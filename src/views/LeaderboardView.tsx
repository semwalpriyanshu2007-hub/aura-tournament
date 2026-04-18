import React from 'react';
import { motion } from 'motion/react';
import { Medal, Trophy, Star, ChevronRight, TrendingUp, Search } from 'lucide-react';
import { useAura } from '../store';

export function LeaderboardView() {
  const { user } = useAura();

  // Mock Global Leaderboard
  const leaders = [
    { rank: 1, name: 'KingGarena', kills: 4520, wins: 156, points: 12500, avatar: 'https://picsum.photos/seed/k1/100/100' },
    { rank: 2, name: 'ShadowX', kills: 3890, wins: 142, points: 11200, avatar: 'https://picsum.photos/seed/k2/100/100' },
    { rank: 3, name: 'DragonBreath', kills: 3560, wins: 128, points: 10800, avatar: 'https://picsum.photos/seed/k3/100/100' },
    { rank: 4, name: 'MysticMist', kills: 3120, wins: 98, points: 9500, avatar: 'https://picsum.photos/seed/k4/100/100' },
    { rank: 5, name: 'EliteSniper', kills: 2890, wins: 87, points: 8900, avatar: 'https://picsum.photos/seed/k5/100/100' },
    { rank: 6, name: user?.username || 'You', kills: (user?.stats.kills || 0), wins: (user?.stats.wins || 0), points: 7600, avatar: user?.avatar },
    { rank: 7, name: 'NovaBlast', kills: 2450, wins: 64, points: 7200, avatar: 'https://picsum.photos/seed/k6/100/100' },
    { rank: 8, name: 'VikingKing', kills: 2100, wins: 56, points: 6800, avatar: 'https://picsum.photos/seed/k7/100/100' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-display font-bold">Global <span className="text-aura-red">Hall of Fame</span></h2>
          <p className="text-gray-500">The most legendary warriors of the current season</p>
        </div>
        
        <div className="flex bg-aura-card border border-aura-border rounded-xl p-1">
          {['Global', 'Regional', 'Friends'].map(t => (
            <button
              key={t}
              className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                t === 'Global' ? 'bg-aura-red text-white' : 'text-gray-500 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top 3 Podium */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          {leaders.slice(0, 3).map((l, i) => {
            const isFirst = l.rank === 1;
            return (
              <motion.div
                key={l.rank}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative bg-aura-card border p-8 rounded-[2.5rem] flex flex-col items-center text-center overflow-hidden ${
                  isFirst ? 'border-aura-yellow/50 scale-105 z-10' : 'border-aura-border'
                }`}
              >
                {isFirst && (
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-aura-yellow neon-glow-orange" />
                )}
                <div className="relative mb-6">
                  <img 
                    src={l.avatar} 
                    className={`w-24 h-24 rounded-full border-4 ${
                      l.rank === 1 ? 'border-aura-yellow' : l.rank === 2 ? 'border-gray-300' : 'border-aura-orange/50'
                    }`} 
                  />
                  <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center border-4 border-aura-card font-bold ${
                    l.rank === 1 ? 'bg-aura-yellow text-aura-bg' : l.rank === 2 ? 'bg-gray-300 text-aura-bg' : 'bg-aura-orange text-white'
                  }`}>
                    {l.rank}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{l.name}</h3>
                <div className="flex items-center space-x-2 text-aura-red font-mono text-sm mb-6">
                  <Star size={14} fill="currentColor" />
                  <span>{l.points.toLocaleString()} LP</span>
                </div>
                <div className="grid grid-cols-2 gap-8 w-full border-t border-aura-border pt-6">
                  <div>
                    <div className="text-lg font-bold">{l.wins}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest">Wins</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">{l.kills}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest">Kills</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* List Table */}
        <div className="lg:col-span-3 bg-aura-card border border-aura-border rounded-[2rem] overflow-hidden">
          <div className="p-8 border-b border-aura-border flex justify-between items-center">
            <h4 className="font-bold flex items-center space-x-2">
              <TrendingUp size={18} className="text-aura-red" />
              <span>Rankings</span>
            </h4>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
              <input 
                type="text" 
                placeholder="Find player..." 
                className="bg-white/5 border border-aura-border rounded-lg py-1.5 pl-9 pr-4 text-xs focus:outline-none focus:border-aura-red transition-all w-48"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-mono">
                <tr>
                  <th className="px-8 py-4">Rank</th>
                  <th className="px-8 py-4">Player</th>
                  <th className="px-8 py-4">Wins</th>
                  <th className="px-8 py-4">Kills</th>
                  <th className="px-8 py-4">Points</th>
                  <th className="px-8 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-aura-border/50">
                {leaders.map((l) => (
                  <tr 
                    key={l.rank} 
                    className={`group hover:bg-white/5 transition-colors cursor-pointer ${
                      l.name === user?.username ? 'bg-aura-red/5' : ''
                    }`}
                  >
                    <td className="px-8 py-5">
                      <span className={`font-mono font-bold ${
                        l.rank <= 3 ? 'text-aura-red' : 'text-gray-500'
                      }`}>
                        #{l.rank.toString().padStart(2, '0')}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-3">
                        <img src={l.avatar} className="w-8 h-8 rounded-full" />
                        <span className="font-bold text-sm whitespace-nowrap">{l.name}</span>
                        {l.name === user?.username && (
                          <span className="text-[8px] bg-aura-red text-white px-1.5 py-0.5 rounded font-bold uppercase">You</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-medium">{l.wins}</td>
                    <td className="px-8 py-5 text-sm font-medium">{l.kills}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-1.5 text-aura-red font-mono text-sm font-bold">
                        <Star size={12} fill="currentColor" />
                        <span>{l.points.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 text-gray-600 group-hover:text-white transition-colors">
                        <ChevronRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
