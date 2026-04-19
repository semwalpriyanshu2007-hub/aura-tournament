import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Tournament, Post, Notification } from './types';
import { MOCK_USER, MOCK_POSTS } from './constants';

// 🔥 FIREBASE IMPORT
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
  setTournaments: (tournaments: Tournament[]) => void;
  fetchTournaments: () => Promise<void>;
  setPosts: (posts: Post[]) => void;
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  setIsAdminView: (isAdmin: boolean) => void;
  joinTournament: (tournamentId: string) => Promise<boolean>;
  depositMoney: (amount: number) => void;
  createTournament: (tournament: any) => void;
  updateTournament: (id: string, data: any) => Promise<boolean>;
  selectWinner: (tournamentId: string, userName: string) => Promise<boolean>;
  canInstall: boolean;
  installApp: () => Promise<void>;
}

const AuraContext = createContext<AuraState | undefined>(undefined);

export function AuraProvider({ children }: { children: React.ReactNode }) {

  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('aura_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeView, setActiveView] = useState('home');
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoadingTournaments, setIsLoadingTournaments] = useState(true);
  const [tournamentError, setTournamentError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [isAdminView, setIsAdminView] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_USER.notifications);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // 🔥 REALTIME FIRESTORE (MAIN MAGIC)
  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(collection(db, 'tournaments'), (snapshot) => {

        const mapped: Tournament[] = snapshot.docs.map(doc => {
          const t: any = doc.data();

          return {
            id: doc.id,
            name: t.name,
            type: t.type || 'solo',

            entryFee: t.entryFee ?? t.price ?? 0,
            prizePool: t.prizePool ?? ((t.entryFee ?? t.price ?? 0) * 50),

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

    } catch (err: any) {
      console.error(err);
      setTournamentError(err.message);
      setIsLoadingTournaments(false);
    }

  }, []);

  // INSTALL PROMPT
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // SAVE USER
  useEffect(() => {
    if (user) {
      localStorage.setItem('aura_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('aura_user');
    }
  }, [user]);

  const fetchTournaments = async () => {
    // ❌ Not needed anymore (Firestore realtime handles it)
    return;
  };

  const addNotification = (notif: Notification) => {
    setNotifications(prev => [notif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  // JOIN
  const joinTournament = async (tournamentId: string) => {
    if (!user) return false;

    const t = tournaments.find(x => x.id === tournamentId);
    if (!t || t.joinedSlots >= t.maxSlots) return false;
    if (user.wallet.balance < t.entryFee) return false;

    await fetch('/api/join-tournament', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tournamentId, userName: user.username })
    });

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

  const updateTournament = async (id: string, data: any) => {
    await fetch(`/api/tournament/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return true;
  };

  const selectWinner = async (tournamentId: string, userName: string) => {
    await fetch('/api/select-winner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tournamentId, userName })
    });
    return true;
  };

  const installApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
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
      setTournaments,
      fetchTournaments,
      setPosts,
      addNotification,
      markNotificationRead,
      setIsAdminView,
      joinTournament,
      depositMoney,
      createTournament,
      updateTournament,
      selectWinner,
      canInstall: !!deferredPrompt,
      installApp
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
