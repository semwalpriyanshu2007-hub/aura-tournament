import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Users, Zap, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { useAura } from '../store';

export function HomeView() {
  const { user, tournaments, setActiveView, joinTournament } = useAura();
  const [joiningId, setJoiningId] = React.useState<string | null>(null);

  const handleJoin = async (id: string) => {
    setJoiningId(id);
    try {
      const success = await joinTournament(id);
      if (success) {
        alert('Joined successfully!');
      }
    } catch (error: any) {
      alert(error.message || 'Failed to join tournament');
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-aura-red/20 to-aura-orange/20 border border-aura-red/20 p-8 lg:p-12">
        <div className="relative z-10 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-aura-red/10 border border-aura-red/20 rounded-full px-4 py-1.5 mb-6"
          >
            <Zap size={14} className="text-aura-red fill-aura-red" />
            <span className="text-xs font-bold text-aura-red tracking-wide uppercase">Season 4 Now Live • Welcome, {user?.username}</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-6xl font-display font-bold mb-4 leading-tight"
          >
            BECOME THE <span className="text-aura-red neon-text-red">LEGEND</span> OF THE FIELD
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg mb-8"
          >
            Join daily tournaments, compete with top squads, and win massive prize pools. 
            The aura of victory awaits you.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <button 
              onClick={() => setActiveView('tournaments')}
              className="bg-aura-red hover:bg-red-600 text-white font-bold px-8 py-4 rounded-xl transition-all hover:scale-105 active:scale-95 neon-glow-red flex items-center space-x-2"
            >
              <span>Join Tournament</span>
              <ArrowRight size={20} />
            </button>
            <button className="bg-white/5 hover:bg-white/10 text-white font-bold px-8 py-4 rounded-xl border border-aura-border transition-all flex items-center space-x-2">
              <span>View Leaderboard</span>
            </button>
          </motion.div>
        </div>

        {/* Abstract Background Element */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none hidden lg:block">
          <Trophy size={400} className="text-aura-red" />
        </div>
      </section>

      {/* Stats Quick Overview */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Matches', value: user?.stats.matches, icon: TrendingUp, color: 'text-aura-red' },
          { label: 'Victory Royale', value: user?.stats.wins, icon: Trophy, color: 'text-aura-orange' },
          { label: 'Kill Streak', value: user?.stats.kills, icon: Zap, color: 'text-aura-yellow' },
          { label: 'Global Rank', value: `#${user?.id.padStart(4, '0')}`, icon: Users, color: 'text-white' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className="bg-aura-card border border-aura-border p-6 rounded-2xl"
          >
            <div className={`p-2 w-fit rounded-lg bg-white/5 mb-4 ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-xs text-gray-500 uppercase font-mono tracking-widest">{stat.label}</div>
          </motion.div>
        ))}
      </section>

      {/* Featured Tournaments */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="text-2xl font-display font-bold">Featured <span className="text-aura-red">Tournaments</span></h3>
            <p className="text-sm text-gray-500">Pick your mode and start competing</p>
          </div>
          <button 
            onClick={() => setActiveView('tournaments')}
            className="text-aura-red text-sm font-bold hover:underline flex items-center space-x-1"
          >
            <span>See All</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {tournaments.slice(0, 3).map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="bg-aura-card border border-aura-border rounded-3xl overflow-hidden hover:border-aura-red/50 transition-colors group"
            >
              <div className="relative h-48">
                <img 
                  src={`https://picsum.photos/seed/${t.id}/600/300`} 
                  className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-aura-bg/80 backdrop-blur-md text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter border border-white/10">
                    {t.type}
                  </span>
                  <span className="bg-aura-red/20 backdrop-blur-md text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter border border-aura-red/30 text-aura-red">
                    {t.status}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center space-x-2 text-aura-yellow font-bold text-xl drop-shadow-md">
                    <Zap size={18} fill="currentColor" />
                    <span>${t.prizePool}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h4 className="text-xl font-bold mb-2">{t.name}</h4>
                
                {t.winner ? (
                  <div className="mb-4 flex items-center space-x-2 text-green-400 bg-green-500/10 w-fit px-3 py-1 rounded-lg border border-green-500/20">
                    <Trophy size={12} className="fill-green-400" />
                    <span className="text-[10px] font-bold uppercase tracking-tight">Winner: {t.winner}</span>
                  </div>
                ) : (
                  <div className="mb-4 text-gray-500 text-[10px] font-mono uppercase tracking-widest pl-1">
                    Winner not announced yet
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Calendar size={14} />
                    <span className="text-xs">{t.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Users size={14} />
                    <span className="text-xs">{t.joinedSlots}/{t.maxSlots} Joined</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleJoin(t.id)}
                  disabled={joiningId === t.id}
                  className="w-full bg-white/5 hover:bg-aura-red text-white py-3 rounded-xl font-bold transition-all border border-aura-border hover:border-aura-red disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {joiningId === t.id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Joining...</span>
                    </>
                  ) : (
                    <span>Join for ${t.entryFee}</span>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
