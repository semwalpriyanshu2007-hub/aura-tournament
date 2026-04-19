import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Tournament, Post, Notification } from './types';
import { MOCK_USER, MOCK_POSTS } from './constants';

// 🔥 FIREBASE
import { db } from './firebase';
import { collection, onSnapshot } from 'firebase/firestore';

interface AuraState {
  user: User | null;
  activeView: string;
  tournaments: Tournament[];
  isLoadingTournaments: boolean;
  tournamentError: string | null;
  posts: Post[];
  notifications: Notification[];
  isAdminView: boolean;
  setUser: (user: User | null) => void;
  setActiveView: (view: string) => void;
  joinTournament: (tournamentId: string) => Promise<boolean>;
  depositMoney: (amount: number) => void;
  createTournament: (tournament: any) => void;
}

const AuraContext = createContext<AuraState | undefined>(undefined);

export function AuraProvider({ children }: { children: React.ReactNode }) {

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('aura_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeView, setActiveView] = useState('home');
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoadingTournaments, setIsLoadingTournaments] = useState(true);
  const [tournamentError, setTournamentError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_USER.notifications);
  const [isAdminView, setIsAdminView] = useState(false);

  // 🔥 REALTIME FIRESTORE
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'tournaments'), (snapshot) => {

      const mapped: Tournament[] = snapshot.docs.map(doc => {
        const t: any = doc.data();

        return {
          id: doc.id,
          name: t.name,
          type: t.type || 'solo',
          entryFee: t.entryFee ?? t.price ?? 0,
          prizePool: (t.entryFee ?? t.price ?? 0) * 50,
          maxSlots: t.maxSlots ?? 100,
          joinedSlots: t.joinedSlots ?? 0,
          status: t.status || 'upcoming',
          date: t.createdAt?.seconds
            ? new Date(t.createdAt.seconds * 1000).toLocaleDateString()
            : 'N/A',
          startTime: t.startTime || '18:00',
          slots: t.slots || [],
          winner: t.winner || null
        };
      });

      setTournaments(mapped);
      setIsLoadingTournaments(false);
    });

    return () => unsubscribe();
  }, []);

  // SAVE USER
  useEffect(() => {
    if (user) {
      localStorage.setItem('aura_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('aura_user');
    }
  }, [user]);

  // 🔥 JOIN (SAFE)
  const joinTournament = async (tournamentId: string) => {
    if (!user) return false;

    const t = tournaments.find(x => x.id === tournamentId);
    if (!t) return false;

    try {
      const res = await fetch('/api/join-tournament', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tournamentId, userName: user.username })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return false;
      }

      // 💰 WALLET UPDATE
      setUser({
        ...user,
        wallet: {
          ...user.wallet,
          balance: user.wallet.balance - t.entryFee,
          transactions: [
            {
              id: `t_${Date.now()}`,
              amount: t.entryFee,
              type: 'entry_fee',
              status: 'completed',
              date: new Date().toISOString()
            },
            ...user.wallet.transactions
          ]
        }
      });

      return true;

    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const depositMoney = (amount: number) => {
    if (!user) return;

    setUser({
      ...user,
      wallet: {
        ...user.wallet,
        balance: user.wallet.balance + amount,
        transactions: [
          {
            id: `t_${Date.now()}`,
            amount,
            type: 'deposit',
            status: 'completed',
            date: new Date().toISOString()
          },
          ...user.wallet.transactions
        ]
      }
    });
  };

  const createTournament = async (tData: any) => {
    await fetch('/api/add-tournament', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tData)
    });
  };

  return (
    <AuraContext.Provider value={{
      user,
      activeView,
      tournaments,
      isLoadingTournaments,
      tournamentError,
      posts,
      notifications,
      isAdminView,
      setUser,
      setActiveView,
      joinTournament,
      depositMoney,
      createTournament
    }}>
      {children}
    </AuraContext.Provider>
  );
}

export function useAura() {
  const ctx = useContext(AuraContext);
  if (!ctx) throw new Error('useAura must be used inside AuraProvider');
  return ctx;
}
