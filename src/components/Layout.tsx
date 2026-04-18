import React from 'react';
import { Navigation } from './Navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Search, Settings } from 'lucide-react';
import { useAura } from '../store';

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, notifications, markNotificationRead } = useAura();
  const [showNotif, setShowNotif] = React.useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-aura-bg text-white">
      <Navigation />
      
      {/* Main Content Area */}
      <main className="lg:ml-64 min-h-screen">
        {/* Desktop Header */}
        <header className="hidden lg:flex h-20 items-center justify-between px-8 border-b border-aura-border bg-aura-bg/50 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search tournaments, players..." 
                className="w-full bg-white/5 border border-aura-border rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-aura-red transition-colors font-sans text-sm"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative">
              <button onClick={() => setShowNotif(!showNotif)} className="relative p-2 text-gray-300 hover:text-white transition-colors">
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-aura-red text-[10px] flex items-center justify-center rounded-full border-2 border-aura-bg font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotif && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 bg-aura-card border border-aura-border rounded-2xl shadow-2xl p-4 z-50 overflow-hidden"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold">Notifications</h3>
                      <button className="text-xs text-aura-red hover:underline">Mark all read</button>
                    </div>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="text-sm text-gray-500 text-center py-8">No notifications</div>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} className={`p-3 rounded-xl border ${n.read ? 'bg-transparent border-aura-border/50' : 'bg-aura-red/5 border-aura-red/20'}`}>
                            <div className="text-xs font-bold text-aura-red mb-1">{n.title}</div>
                            <div className="text-sm text-gray-300">{n.message}</div>
                            <div className="text-[10px] text-gray-500 mt-2 font-mono">
                              {new Date(n.date).toLocaleDateString()}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button className="p-2 text-gray-300 hover:text-white">
              <Settings size={22} />
            </button>

            <div className="flex items-center space-x-3 pl-6 border-l border-aura-border">
              <div className="text-right">
                <div className="text-sm font-bold text-white">{user?.username}</div>
                <div className="text-xs text-aura-red font-mono">{user?.stats.rank}</div>
              </div>
              <img src={user?.avatar} className="w-10 h-10 rounded-full border-2 border-aura-red shadow-[0_0_10px_rgba(255,0,0,0.3)]" />
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="p-4 lg:p-8 mt-16 lg:mt-0">
          {children}
        </div>
      </main>
    </div>
  );
}
