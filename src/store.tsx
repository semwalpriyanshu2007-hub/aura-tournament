import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Tournament, Post, Notification } from './types';
import { MOCK_USER, MOCK_TOURNAMENTS, MOCK_POSTS } from './constants';

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
  createTournament: (tournament: Omit<Tournament, 'id' | 'joinedSlots' | 'slots' | 'status'>) => void;
  updateTournament: (id: string, data: { name: string; price: number }) => Promise<boolean>;
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
    } catch (e) {
      console.error('Error parsing saved user:', e);
      return null;
    }
  });
  
  const [activeView, setActiveView] = useState('home');
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoadingTournaments, setIsLoadingTournaments] = useState(false);
  const [tournamentError, setTournamentError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [isAdminView, setIsAdminView] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_USER.notifications);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    fetchTournaments();

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const fetchTournaments = async () => {
    setIsLoadingTournaments(true);
    setTournamentError(null);
    try {
      const response = await fetch('/api/tournaments');
      if (!response.ok) throw new Error('Failed to fetch tournaments');
      const data = await response.json();
      
      // Map API data to fit frontend type if needed
      // Our API returns { id, name, price, createdAt }
      // The frontend expects Tournament interface with type, entryFee, prizePool etc.
      const mappedTournaments: Tournament[] = data.tournaments.map((t: any) => ({
        id: t.id,
        name: t.name,
        type: t.type || 'solo',
        entryFee: t.price || 0, // In index.js we save 'price' from body
        prizePool: t.prizePool || (t.price ? t.price * 50 : 1000), // Guess prize pool for now
        maxSlots: t.maxSlots || 48,
        joinedSlots: typeof t.participantCount === 'number' ? t.participantCount : (t.joinedSlots || 0),
        status: t.status || 'upcoming',
        date: t.date || new Date(t.createdAt?._seconds * 1000).toLocaleDateString() || '2024-04-20',
        startTime: t.startTime || '18:00',
        slots: t.slots || [],
        winner: t.winner
      }));
      
      setTournaments(mappedTournaments);
    } catch (err: any) {
      console.error('Error loading tournaments:', err);
      setTournamentError(err.message);
    } finally {
      setIsLoadingTournaments(false);
    }
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem('aura_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('aura_user');
    }
  }, [user]);

  const addNotification = (notif: Notification) => {
    setNotifications(prev => [notif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const joinTournament = async (tournamentId: string) => {
    if (!user) return false;
    
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament || tournament.joinedSlots >= tournament.maxSlots) return false;
    if (user.wallet.balance < tournament.entryFee) return false;

    try {
      const response = await fetch('/api/join-tournament', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tournamentId,
          userName: user.username
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to join tournament API');
      }

      // Update wallet locally
      const newUser = {
        ...user,
        wallet: {
          ...user.wallet,
          balance: user.wallet.balance - tournament.entryFee,
          transactions: [
            {
              id: `t_${Date.now()}`,
              amount: tournament.entryFee,
              type: 'entry_fee' as const,
              status: 'completed' as const,
              date: new Date().toISOString()
            },
            ...user.wallet.transactions
          ]
        }
      };
      setUser(newUser);

      // Update tournament slots locally
      setTournaments(prev => prev.map(t => 
        t.id === tournamentId 
          ? { ...t, joinedSlots: t.joinedSlots + 1 } 
          : t
      ));

      addNotification({
        id: `n_${Date.now()}`,
        title: 'Tournament Joined',
        message: `You have successfully joined ${tournament.name}`,
        type: 'tournament',
        read: false,
        date: new Date().toISOString()
      });

      return true;
    } catch (error: any) {
      console.error('Error joining tournament in backend:', error);
      throw error; // Throw the error so the UI can catch it and show the message
    }
  };

  const depositMoney = (amount: number) => {
    if (!user) return;
    const newUser = {
      ...user,
      wallet: {
        ...user.wallet,
        balance: user.wallet.balance + amount,
        transactions: [
          {
            id: `t_${Date.now()}`,
            amount,
            type: 'deposit' as const,
            status: 'completed' as const,
            date: new Date().toISOString()
          },
          ...user.wallet.transactions
        ]
      }
    };
    setUser(newUser);
    addNotification({
      id: `n_${Date.now()}`,
      title: 'Funds Added',
      message: `$${amount} has been added to your wallet.`,
      type: 'wallet',
      read: false,
      date: new Date().toISOString()
    });
  };

  const createTournament = async (tData: Omit<Tournament, 'id' | 'joinedSlots' | 'slots' | 'status'>) => {
    try {
      // Call real API
      const response = await fetch('/api/add-tournament', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: tData.name,
          price: tData.entryFee,
          type: tData.type,
          prizePool: tData.prizePool,
          maxSlots: tData.maxSlots,
          date: tData.date,
          startTime: tData.startTime
        })
      });

      if (!response.ok) throw new Error('Failed to create tournament');
      
      // Refresh list
      await fetchTournaments();
    } catch (error) {
      console.error('Error creating tournament:', error);
      alert('Failed to create tournament correctly in backend');
    }
  };

  const updateTournament = async (id: string, data: { name: string; price: number }) => {
    try {
      const response = await fetch(`/api/tournament/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to update tournament');
      }

      await fetchTournaments();
      return true;
    } catch (error: any) {
      console.error('Error updating tournament:', error);
      alert(error.message);
      return false;
    }
  };

  const selectWinner = async (tournamentId: string, userName: string) => {
    try {
      const response = await fetch('/api/select-winner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tournamentId, userName })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to select winner');
      }

      return true;
    } catch (error: any) {
      console.error('Error selecting winner:', error);
      alert(error.message);
      return false;
    }
  };

  const installApp = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    setDeferredPrompt(null);
  };

  return (
    <AuraContext.Provider value={{
      user, activeView, tournaments, isLoadingTournaments, tournamentError, posts, notifications, isAdminView,
      setUser, setActiveView, setTournaments, fetchTournaments, setPosts, addNotification, 
      markNotificationRead, setIsAdminView, joinTournament, depositMoney, createTournament, updateTournament, selectWinner,
      canInstall: !!deferredPrompt,
      installApp
    }}>
      {children}
    </AuraContext.Provider>
  );
}

export function useAura() {
  const context = useContext(AuraContext);
  if (context === undefined) {
    throw new Error('useAura must be used within an AuraProvider');
  }
  return context;
}
