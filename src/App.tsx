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
