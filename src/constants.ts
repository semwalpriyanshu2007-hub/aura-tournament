import { Tournament, User, Post } from './types';

export const MOCK_USER: User = {
  id: '1',
  username: 'ShadowSlayer',
  email: 'player@aura.cup',
  role: 'user',
  uid: 'AURA-7742-X91',
  avatar: 'https://picsum.photos/seed/gamer1/200/200',
  stats: {
    matches: 142,
    wins: 28,
    kills: 856,
    kdRatio: 3.12,
    rank: 'Grandmaster'
  },
  wallet: {
    balance: 1250,
    transactions: [
      { id: 't1', amount: 500, type: 'deposit', status: 'completed', date: '2024-03-15T12:00:00Z' },
      { id: 't2', amount: 50, type: 'entry_fee', status: 'completed', date: '2024-03-16T14:30:00Z' },
      { id: 't3', amount: 200, type: 'prize', status: 'completed', date: '2024-03-17T18:00:00Z' }
    ]
  },
  achievements: [
    { id: 'a1', title: 'First Blood', icon: 'Target', date: '2024-01-10' },
    { id: 'a2', title: 'Survivor', icon: 'Shield', date: '2024-02-15' }
  ],
  notifications: [
    { id: 'n1', title: 'Tournament Starting', message: 'The Elite Squad Pro starts in 30 mins!', type: 'tournament', read: false, date: '2024-03-20T09:00:00Z' },
    { id: 'n2', title: 'Withdrawal Approved', message: 'Your withdrawal of $500 has been approved.', type: 'wallet', read: true, date: '2024-03-18T10:00:00Z' }
  ]
};

export const MOCK_ADMIN: User = {
  ...MOCK_USER,
  id: '2',
  username: 'AuraAdmin',
  email: 'admin@aura.cup',
  role: 'admin',
  uid: 'AURA-0001-ADM'
};

export const MOCK_TOURNAMENTS: Tournament[] = [
  {
    id: 'tr1',
    name: 'Elite Squad Pro',
    type: 'squad',
    entryFee: 100,
    prizePool: 5000,
    maxSlots: 12,
    joinedSlots: 10,
    status: 'upcoming',
    date: '2024-03-25',
    startTime: '18:00',
    slots: []
  },
  {
    id: 'tr2',
    name: 'Solo Survivalist',
    type: 'solo',
    entryFee: 20,
    prizePool: 1000,
    maxSlots: 48,
    joinedSlots: 15,
    status: 'upcoming',
    date: '2024-03-26',
    startTime: '20:00',
    slots: []
  },
  {
    id: 'tr3',
    name: 'Duo Dominators',
    type: 'duo',
    entryFee: 50,
    prizePool: 2500,
    maxSlots: 24,
    joinedSlots: 24,
    status: 'upcoming',
    date: '2024-03-27',
    startTime: '19:00',
    slots: []
  }
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    userId: '1',
    username: 'ShadowSlayer',
    content: 'Just clutched a 1v4 in the last tournament! 🔥 #FreeFire #AuraCup',
    image: 'https://picsum.photos/seed/gameplay1/800/450',
    likes: 24,
    comments: [
      { id: 'c1', userId: '3', username: 'ProGamerX', text: 'Insane gameplay!', date: '2024-03-18T12:00:00Z' }
    ],
    date: '2024-03-18T10:00:00Z'
  },
  {
    id: 'p2',
    userId: '4',
    username: 'QueenBee',
    content: 'Looking for a squad for the upcoming Elite Squad Pro. HMU!',
    likes: 12,
    comments: [],
    date: '2024-03-19T08:30:00Z'
  }
];
