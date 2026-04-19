import { AuraProvider, useAura } from './store';
import { Layout } from './components/Layout';
import { HomeView } from './views/HomeView';
import { TournamentsView } from './views/TournamentsView';
import { WalletView } from './views/WalletView';
import { ProfileView } from './views/ProfileView';
import { CommunityView } from './views/CommunityView';
import { LeaderboardView } from './views/LeaderboardView';
import { AdminView } from './views/AdminView';
import { LoginView } from './views/LoginView';
import { AnimatePresence, motion } from 'motion/react';

function AppContent() {

  // ✅ ADD FUNCTION (yahi missing tha)
  const addTournament = async () => {
    const res = await fetch('/api/add-tournament', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: "My Tournament",
        price: 50
      })
    });

    const data = await res.json();
    console.log(data);
  };

  const { activeView, user } = useAura();

  if (!user) {
    return <LoginView />;
  }

  const renderView = () => {
    switch (activeView) {
      case 'home': return <HomeView />;
      case 'tournaments': return <TournamentsView />;
      case 'wallet': return <WalletView />;
      case 'profile': return <ProfileView />;
      case 'community': return <CommunityView />;
      case 'leaderboard': return <LeaderboardView />;
      case 'admin-dashboard': return <AdminView />;
      default: return <HomeView />;
    }
  };

  return (
    <Layout>

      {/* 🔥 BUTTON YAHAN ADD KIYA */}
      <button 
        onClick={addTournament}
        style={{
          margin: '10px',
          padding: '10px 15px',
          background: 'red',
          color: 'white',
          border: 'none',
          borderRadius: '8px'
        }}
      >
        Add Tournament
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}

export default function App() {
  return (
    <AuraProvider>
      <AppContent />
    </AuraProvider>
  );
}
