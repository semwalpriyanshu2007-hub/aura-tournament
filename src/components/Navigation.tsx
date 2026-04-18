import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Wallet, 
  User as UserIcon, 
  Home, 
  LayoutDashboard, 
  Users, 
  Bell, 
  LogOut, 
  Menu, 
  X,
  PlusCircle,
  BarChart3,
  Globe,
  Download
} from 'lucide-react';
import { useAura } from '../store';

export function Navigation() {
  const { activeView, setActiveView, isAdminView, setIsAdminView, user, notifications, canInstall, installApp } = useAura();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'tournaments', label: 'Tournaments', icon: Trophy },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'community', label: 'Community', icon: Globe },
    { id: 'leaderboard', label: 'Leaderboard', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ];

  const adminItems = [
    { id: 'admin-dashboard', label: 'Admin Panel', icon: LayoutDashboard },
    { id: 'manage-users', label: 'Manage Users', icon: Users },
  ];

  const handleNavClick = (id: string) => {
    setActiveView(id);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="fixed left-0 top-0 h-full w-64 bg-aura-card border-r border-aura-border hidden lg:flex flex-col z-50">
        <div className="p-6">
          <h1 className="text-2xl font-display font-bold text-aura-red neon-text-red tracking-tight">
            AURA CUP
          </h1>
        </div>

        <div className="flex-1 px-4 space-y-1 overflow-y-auto">
          <div className="text-xs font-mono text-gray-500 uppercase tracking-widest px-4 mb-2">Navigation</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-aura-red/10 text-aura-red' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={20} className={isActive ? 'drop-shadow-[0_0_8px_rgba(255,0,0,0.5)]' : ''} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}

          {(user?.role === 'admin' || isAdminView) && (
            <div className="pt-6">
              <div className="text-xs font-mono text-gray-500 uppercase tracking-widest px-4 mb-2">Admin</div>
              {adminItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-aura-orange/10 text-aura-orange' 
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon size={20} className={isActive ? 'drop-shadow-[0_0_8px_rgba(255,138,0,0.5)]' : ''} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-aura-border space-y-2">
          {canInstall && (
            <button 
              onClick={installApp}
              className="w-full flex items-center space-x-3 px-4 py-3 text-aura-red bg-aura-red/10 hover:bg-aura-red/20 border border-aura-red/30 rounded-lg transition-all animate-pulse"
            >
              <Download size={20} />
              <span className="font-bold text-sm tracking-tight">INSTALL APP</span>
            </button>
          )}
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-aura-red hover:bg-aura-red/5 rounded-lg transition-colors">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </nav>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 w-full bg-aura-bg/80 backdrop-blur-md border-bottom border-aura-border h-16 flex items-center justify-between px-4 z-50">
        <button onClick={() => setIsMenuOpen(true)}>
          <Menu className="text-white" />
        </button>
        
        <h1 className="text-xl font-display font-bold text-aura-red neon-text-red">AURA CUP</h1>
        
        <div className="relative">
          <Bell className="text-gray-300" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-aura-red text-[10px] flex items-center justify-center rounded-full border-2 border-aura-bg font-bold">
              {unreadCount}
            </span>
          )}
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-4/5 max-w-sm bg-aura-card border-r border-aura-border z-[70] flex flex-col"
            >
              <div className="p-6 flex items-center justify-between">
                <h1 className="text-2xl font-display font-bold text-aura-red neon-text-red tracking-tight">
                  AURA CUP
                </h1>
                <button onClick={() => setIsMenuOpen(false)}>
                  <X />
                </button>
              </div>

              <div className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
                <div className="text-xs font-mono text-gray-500 uppercase tracking-widest px-4 mb-2">Navigation</div>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive 
                          ? 'bg-aura-red/10 text-aura-red' 
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}

                {(user?.role === 'admin' || isAdminView) && (
                  <div className="pt-6">
                    <div className="text-xs font-mono text-gray-500 uppercase tracking-widest px-4 mb-2">Admin</div>
                    {adminItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeView === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavClick(item.id)}
                          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                            isActive 
                              ? 'bg-aura-orange/10 text-aura-orange' 
                              : 'text-gray-400 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <Icon size={20} />
                          <span className="font-medium">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-aura-border">
                {canInstall && (
                  <button 
                    onClick={installApp}
                    className="w-full flex items-center justify-center space-x-3 px-4 py-4 mb-4 text-aura-red bg-aura-red/10 border border-aura-red/20 rounded-xl animate-pulse shadow-[0_0_20px_rgba(255,0,0,0.1)]"
                  >
                    <Download size={20} />
                    <span className="font-black text-sm uppercase tracking-tighter">Install Aura Cup</span>
                  </button>
                )}
                <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl mb-4">
                  <img src={user?.avatar} className="w-10 h-10 rounded-full border-2 border-aura-red" />
                  <div>
                    <div className="text-sm font-bold">{user?.username}</div>
                    <div className="text-xs text-gray-400">{user?.uid}</div>
                  </div>
                </div>
                <button className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                  <LogOut size={20} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Tab Bar (Optional - I'll stick to drawer or just sidebar + header) */}
    </>
  );
}
