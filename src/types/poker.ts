import * as Y from 'yjs';

// User information
export interface User {
  id: string;
  name: string;
  isOnline: boolean;
  isLeader: boolean;
  joinedAt: number;
}

// Individual vote for a story
export interface Vote {
  userId: string;
  value: string | null; // null means no vote yet
  votedAt: number | null;
}

// Story being estimated
export interface Story {
  id: string;
  title: string;
  description?: string;
  createdAt: number;
}

// Round of voting for a story
export interface Round {
  id: string;
  storyId: string;
  isActive: boolean;
  votesRevealed: boolean;
  createdAt: number;
  completedAt: number | null;
}

// Room state structure for Y.js
export interface RoomState {
  users: Y.Map<User>;
  stories: Y.Map<Story>;
  rounds: Y.Map<Round>;
  votes: Y.Map<Vote>; // Key format: `${roundId}_${userId}`
  currentRoundId: string | null;
  leaderId: string | null;
  roomId: string;
}

// Available voting values
export const VOTING_VALUES = ['0', '1', '2', '3', '5', '8', '13', '21', '34', '55', '89', '?', '☕'];

// Y.js document structure
export interface PokerDocument {
  users: Y.Map<User>;
  stories: Y.Map<Story>;
  rounds: Y.Map<Round>;
  votes: Y.Map<Vote>;
  meta: Y.Map<string | null>; // For currentRoundId, leaderId, etc.
}