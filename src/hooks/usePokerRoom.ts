import { useEffect, useRef, useState } from 'react';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { User, Vote, Round } from '../types/poker';

// Custom hook to observe Y.Map changes
function useYMap<T>(yMap: Y.Map<T>) {
  const [data, setData] = useState<Map<string, T>>(new Map());

  useEffect(() => {
    const updateData = () => {
      setData(new Map(yMap));
    };

    // Initial data
    updateData();

    // Listen for changes
    yMap.observe(updateData);

    return () => {
      yMap.unobserve(updateData);
    };
  }, [yMap]);

  return data;
}

export function usePokerRoom(roomId: string, userId: string, userName: string) {
  const [doc] = useState(() => new Y.Doc());
  const [provider, setProvider] = useState<WebrtcProvider | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const initRef = useRef(false);

  // Y.js Maps
  const users = useYMap<User>(doc.getMap('users'));
  const rounds = useYMap<Round>(doc.getMap('rounds'));
  const votes = useYMap<Vote>(doc.getMap('votes'));
  const meta = useYMap<string | null>(doc.getMap('meta'));

  // Direct Yjs maps for mutation
  const roundsMap = doc.getMap<Round>('rounds');
  const votesMap = doc.getMap<Vote>('votes');
  const metaMap = doc.getMap<string | null>('meta');

  // Awareness: track online users and leader consistently
  useEffect(() => {
    const signalingUrl = import.meta.env.VITE_WEBRTC_SIGNALING_URL || 'ws://localhost:4444';
    const webrtcProvider = new WebrtcProvider(roomId, doc, {
      signaling: [signalingUrl],
      maxConns: 20,
      filterBcConns: true,
      peerOpts: {}
    });

    webrtcProvider.on('status', (event: { connected: boolean }) => {
      setIsConnected(event.connected);
    });

    setProvider(webrtcProvider);

    // Listen for awareness changes to update online status
    const handleAwarenessChange = () => {
      const usersMap = doc.getMap('users');
      // Awareness states are Record<string, { user: User }>
      const states = Array.from(webrtcProvider.awareness.getStates().values()) as Array<{ user?: User }>;
      const onlineIds = new Set(states.map((s) => s.user?.id).filter((id): id is string => Boolean(id)));
      usersMap.forEach((user, id) => {
        const typedUser = user as User;
        if (onlineIds.has(id)) {
          if (!typedUser.isOnline) usersMap.set(id, { ...typedUser, isOnline: true });
        } else {
          if (typedUser.isOnline) usersMap.set(id, { ...typedUser, isOnline: false });
        }
      });
    };
    webrtcProvider.awareness.on('change', handleAwarenessChange);

    // Clean up
    return () => {
      webrtcProvider.awareness.off('change', handleAwarenessChange);
      webrtcProvider.destroy();
    };
  }, [roomId, doc, userId]);

  // Initialize user and leader (deterministic leader election)
  useEffect(() => {
    if (!provider || initRef.current) return;
    initRef.current = true;

    // Wait a bit for initial sync
    const timer = setTimeout(() => {
      const usersMap = doc.getMap('users');
      const metaMap = doc.getMap('meta');

      // Add current user if not present
      let currentUser = usersMap.get(userId) as User | undefined;
      if (!currentUser) {
        currentUser = {
          id: userId,
          name: userName,
          isOnline: true,
          isLeader: false,
          joinedAt: Date.now()
        };
        usersMap.set(userId, currentUser);
      } else {
        usersMap.set(userId, { ...currentUser, isOnline: true, name: userName });
      }

      // Leader election: always assign leader to the user with the lowest joinedAt (or userId as tiebreaker)
      const allUsers = Array.from(usersMap.values()).map(u => u as User);
      let leader = allUsers
        .filter(u => u.isOnline)
        .sort((a, b) => (a.joinedAt - b.joinedAt) || a.id.localeCompare(b.id))[0];
      if (!leader && allUsers.length > 0) {
        leader = allUsers.sort((a, b) => (a.joinedAt - b.joinedAt) || a.id.localeCompare(b.id))[0];
      }
      if (leader) {
        metaMap.set('leaderId', leader.id);
        // Update all users' isLeader field
        usersMap.forEach((user, id) => {
          const typedUser = user as User;
          if (typedUser.isLeader !== (id === leader.id)) {
            usersMap.set(id, { ...typedUser, isLeader: id === leader.id });
          }
        });
      }
    }, 200);

    // Set up cleanup on page unload
    const handleBeforeUnload = () => {
      const usersMap = doc.getMap('users');
      if (usersMap.has(userId)) {
        const user = usersMap.get(userId) as User;
        usersMap.set(userId, { ...user, isOnline: false });
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload();
    };
  }, [provider, userId, userName, doc]);

  // Update user name when it changes (without recreating the provider)
  useEffect(() => {
    if (!provider || !userName) return;

    // Update awareness state with new name
    provider.awareness.setLocalStateField('user', {
      id: userId,
      name: userName
    });

    // Update user name in the persistent document
    const usersMap = doc.getMap('users');
    const currentUser = usersMap.get(userId) as User | undefined;
    if (currentUser) {
      usersMap.set(userId, { ...currentUser, name: userName });
    }
  }, [provider, userId, userName, doc]);

  // Helper functions
  const startRound = () => {
    const leaderId = metaMap.get('leaderId');
    if (leaderId !== userId) return; // Only leader can start rounds

    // End current round if exists
    const currentRoundId = metaMap.get('currentRoundId');
    if (currentRoundId && roundsMap.has(currentRoundId)) {
      const currentRound = roundsMap.get(currentRoundId)!;
      roundsMap.set(currentRoundId, {
        ...currentRound,
        isActive: false,
        completedAt: Date.now()
      });
    }

    // Create new round
    const roundId = `round_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const round: Round = {
      id: roundId,
      isActive: true,
      votesRevealed: false,
      createdAt: Date.now(),
      completedAt: null
    };

    roundsMap.set(roundId, round);
    metaMap.set('currentRoundId', roundId);
  };

  const castVote = (value: string) => {
    const currentRoundId = metaMap.get('currentRoundId');
    if (!currentRoundId) return;

    const voteKey = `${currentRoundId}_${userId}`;
    const vote: Vote = {
      userId,
      value,
      votedAt: Date.now()
    };

    votesMap.set(voteKey, vote);
  };

  const revealVotes = () => {
    const leaderId = metaMap.get('leaderId');
    if (leaderId !== userId) return; // Only leader can reveal votes

    const currentRoundId = metaMap.get('currentRoundId');
    if (!currentRoundId || !roundsMap.has(currentRoundId)) return;

    const round = roundsMap.get(currentRoundId)!;
    roundsMap.set(currentRoundId, {
      ...round,
      votesRevealed: true
    });
  };

  const endRound = () => {
    const leaderId = metaMap.get('leaderId');
    if (leaderId !== userId) return; // Only leader can end rounds

    const currentRoundId = metaMap.get('currentRoundId');
    if (!currentRoundId || !roundsMap.has(currentRoundId)) return;

    const round = roundsMap.get(currentRoundId)!;
    roundsMap.set(currentRoundId, {
      ...round,
      isActive: false,
      completedAt: Date.now()
    });

    metaMap.set('currentRoundId', null);
  };

  // Get current round data
  const currentRoundId = meta.get('currentRoundId');
  const currentRound = currentRoundId ? rounds.get(currentRoundId) : null;

  // Get votes for current round
  const currentRoundVotes = currentRoundId 
    ? Array.from(votes.entries())
        .filter(([key]) => key.startsWith(`${currentRoundId}_`))
        .map(([, vote]) => vote)
    : [];

  const currentUserVote = currentRoundId 
    ? votes.get(`${currentRoundId}_${userId}`)
    : null;

  const isLeader = meta.get('leaderId') === userId;
  const onlineUsers = Array.from(users.values()).filter(user => user.isOnline);

  return {
    // Connection state
    isConnected,
    
    // Room data
    users: Array.from(users.values()),
    onlineUsers,
    rounds: Array.from(rounds.values()),
    
    // Current round data
    currentRound,
    currentRoundVotes,
    currentUserVote,
    
    // User state
    isLeader,
    
    // Actions
    startRound,
    castVote,
    revealVotes,
    endRound
  };
}
