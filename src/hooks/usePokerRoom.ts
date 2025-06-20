import { useEffect, useRef, useState } from 'react';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { User, Vote, Story, Round } from '../types/poker';

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
  const stories = useYMap<Story>(doc.getMap('stories'));
  const rounds = useYMap<Round>(doc.getMap('rounds'));
  const votes = useYMap<Vote>(doc.getMap('votes'));
  const meta = useYMap<string | null>(doc.getMap('meta'));

  // Initialize WebRTC provider
  useEffect(() => {
    const webrtcProvider = new WebrtcProvider(roomId, doc, {
      signaling: ['ws://localhost:4444'],
      maxConns: 20,
      filterBcConns: true,
      peerOpts: {}
    });

    webrtcProvider.on('status', (event: { connected: boolean }) => {
      setIsConnected(event.connected);
    });

    setProvider(webrtcProvider);

    return () => {
      webrtcProvider.destroy();
    };
  }, [roomId, doc]);

  // Initialize user and room state
  useEffect(() => {
    if (!provider || initRef.current) return;
    
    initRef.current = true;

    // Add current user
    const currentUser: User = {
      id: userId,
      name: userName,
      isOnline: true,
      isLeader: false,
      joinedAt: Date.now()
    };

    // Check if this is the first user (becomes leader)
    if (users.size === 0) {
      currentUser.isLeader = true;
      meta.set('leaderId', userId);
    }

    users.set(userId, currentUser);

    // Set up cleanup on page unload
    const handleBeforeUnload = () => {
      if (users.has(userId)) {
        const user = users.get(userId)!;
        users.set(userId, { ...user, isOnline: false });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload();
    };
  }, [provider, userId, userName, users, meta]);

  // Helper functions
  const createStory = (title: string, description?: string) => {
    const storyId = `story_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const story: Story = {
      id: storyId,
      title,
      description,
      createdAt: Date.now()
    };
    stories.set(storyId, story);
    return storyId;
  };

  const startRound = (storyId: string) => {
    const leaderId = meta.get('leaderId');
    if (leaderId !== userId) return; // Only leader can start rounds

    // End current round if exists
    const currentRoundId = meta.get('currentRoundId');
    if (currentRoundId && rounds.has(currentRoundId)) {
      const currentRound = rounds.get(currentRoundId)!;
      rounds.set(currentRoundId, {
        ...currentRound,
        isActive: false,
        completedAt: Date.now()
      });
    }

    // Create new round
    const roundId = `round_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const round: Round = {
      id: roundId,
      storyId,
      isActive: true,
      votesRevealed: false,
      createdAt: Date.now(),
      completedAt: null
    };

    rounds.set(roundId, round);
    meta.set('currentRoundId', roundId);
  };

  const castVote = (value: string) => {
    const currentRoundId = meta.get('currentRoundId');
    if (!currentRoundId) return;

    const voteKey = `${currentRoundId}_${userId}`;
    const vote: Vote = {
      userId,
      value,
      votedAt: Date.now()
    };

    votes.set(voteKey, vote);
  };

  const revealVotes = () => {
    const leaderId = meta.get('leaderId');
    if (leaderId !== userId) return; // Only leader can reveal votes

    const currentRoundId = meta.get('currentRoundId');
    if (!currentRoundId || !rounds.has(currentRoundId)) return;

    const round = rounds.get(currentRoundId)!;
    rounds.set(currentRoundId, {
      ...round,
      votesRevealed: true
    });
  };

  const endRound = () => {
    const leaderId = meta.get('leaderId');
    if (leaderId !== userId) return; // Only leader can end rounds

    const currentRoundId = meta.get('currentRoundId');
    if (!currentRoundId || !rounds.has(currentRoundId)) return;

    const round = rounds.get(currentRoundId)!;
    rounds.set(currentRoundId, {
      ...round,
      isActive: false,
      completedAt: Date.now()
    });

    meta.set('currentRoundId', null);
  };

  // Get current round data
  const currentRoundId = meta.get('currentRoundId');
  const currentRound = currentRoundId ? rounds.get(currentRoundId) : null;
  const currentStory = currentRound ? stories.get(currentRound.storyId) : null;
  
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
    stories: Array.from(stories.values()),
    rounds: Array.from(rounds.values()),
    
    // Current round data
    currentRound,
    currentStory,
    currentRoundVotes,
    currentUserVote,
    
    // User state
    isLeader,
    
    // Actions
    createStory,
    startRound,
    castVote,
    revealVotes,
    endRound
  };
}
