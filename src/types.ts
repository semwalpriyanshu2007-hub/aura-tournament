export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  uid: string;
  avatar?: string;
  stats: {
    matches: number;
    wins: number;
    kills: number;
    kdRatio: number;
    rank: string;
  };
  wallet: {
    balance: number;
    transactions: Transaction[];
  };
  achievements: Achievement[];
  notifications: Notification[];
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'entry_fee' | 'prize';
  status: 'pending' | 'completed' | 'failed';
  date: string;
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  date: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'tournament' | 'wallet' | 'system';
  read: boolean;
  date: string;
}

export interface Tournament {
  id: string;
  name: string;
  type: 'solo' | 'duo' | 'squad';
  entryFee: number;
  prizePool: number;
  maxSlots: number;
  joinedSlots: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  date: string;
  startTime: string;
  slots: Participant[];
  winner?: string;
  bracket?: any; // Simple mock bracket
}

export interface Participant {
  id: string;
  userId: string;
  username: string;
  teamName?: string;
  slotNumber: number;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  content: string;
  image?: string;
  likes: number;
  comments: Comment[];
  date: string;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  text: string;
  date: string;
}
