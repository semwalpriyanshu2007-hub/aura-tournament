import React from 'react';
import { motion } from 'motion/react';
import { User, Trophy, Zap, Target, Shield, Settings, Camera, Award, Star } from 'lucide-react';
import { useAura } from '../store';

export function ProfileView() {
  const { user } = useAura();

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Profile Header */}
      <div className="relative">
        <div className="h-64 rounded-[2rem] bg-gradient-to-r from-aura-red/30 via-aura-orange/30 to-aura-yellow/30 border border-white/10" />
        <div className="absolute -bottom-16 left-8 lg:left-12 flex flex-col lg:flex-row lg:items-end gap-6">
          <div className="relative group">
            <img src={user.avatar} className="w-32 h-32 lg:w-40 lg:h-40 rounded-full border-4 border-aura-bg shadow-2xl" />
            <button className="absolute bottom-2 right-2 p-2 bg-aura-red rounded-full text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={18} />
            </button>
          </div>
          <div className="mb-4 lg:mb-6">
            <div className="flex items-center space-x-3 mb-1">
              <h2 className="text-3xl lg:text-4xl font-display font-bold">{user.username}</h2>
              <span className="bg-aura-red/20 text-aura-red text-[10px] font-bold px-3 py-1 rounded-full border border-aura-red/30 uppercase tracking-widest">
                verified
              </span>
            </div>
            <div className="text-gray-400 font-mono text-sm tracking-wider">{user.uid}</div>
          </div>
        </div>
        <div className="absolute top-8 right-8 flex gap-3">
          <button className="p-3 bg-black/50 backdrop-blur-md rounded-xl text-white hover:bg-black/70 transition-all border border-white/10">
            <Settings size={20} />
          </button>
        </div>
      </div>

      <div className="pt-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stats Section */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-aura-card border border-aura-border rounded-3xl p-8">
            <h3 className="text-xl font-bold mb-8 flex items-center space-x-2">
              <Trophy size={20} className="text-aura-red" />
              <span>Combat Stats</span>
            </h3>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Matches', value: user.stats.matches, icon: Trophy, color: 'text-aura-red' },
                { label: 'Wins', value: user.stats.wins, icon: Award, color: 'text-aura-orange' },
                { label: 'Total Kills', value: user.stats.kills, icon: Target, color: 'text-aura-yellow' },
                { label: 'K/D Ratio', value: user.stats.kdRatio, icon: Zap, color: 'text-white' },
              ].map((stat, i) => (
                <div key={i} className="space-y-1">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-mono">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-aura-border">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-mono uppercase tracking-widest text-gray-500">Tier Progress - {user.stats.rank}</span>
                <span className="text-xs font-bold text-aura-red">850 / 1000 LP</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-aura-red to-aura-orange rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
          </section>

          <section className="bg-aura-card border border-aura-border rounded-3xl p-8">
            <h3 className="text-xl font-bold mb-8 flex items-center space-x-2">
              <Star size={20} className="text-aura-yellow" />
              <span>Achievements</span>
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {user.achievements.map((ach) => (
                <div key={ach.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center text-center group hover:bg-aura-red/5 hover:border-aura-red transition-all cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Award className="text-aura-yellow" />
                  </div>
                  <div className="text-sm font-bold mb-1">{ach.title}</div>
                  <div className="text-[10px] text-gray-500">{ach.date}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Context */}
        <div className="space-y-8">
          <section className="bg-aura-card border border-aura-border rounded-3xl p-8">
            <h3 className="text-xl font-bold mb-6">Security</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="text-sm">Account ID</div>
                <div className="text-xs font-mono text-gray-500">****-****-034</div>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="text-sm">MFA Status</div>
                <div className="text-xs text-green-500 font-bold uppercase tracking-tighter">Enabled</div>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="text-sm">Device Bound</div>
                <div className="text-xs text-aura-red font-bold uppercase tracking-tighter">Verified</div>
              </div>
            </div>
          </section>

          <section className="bg-aura-card border border-aura-border rounded-3xl p-8 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-4">Aura Core</h3>
              <p className="text-sm text-gray-400 mb-6">Upgrade to Premium for custom rooms, exclusive tags, and lower tournament fees.</p>
              <button className="w-full py-4 bg-gradient-to-r from-aura-red to-aura-orange rounded-xl font-bold text-sm neon-glow-red hover:scale-[1.02] transition-transform">
                Get Premium
              </button>
            </div>
            <Zap size={100} className="absolute -bottom-10 -right-10 text-aura-white opacity-5 rotate-12" />
          </section>
        </div>
      </div>
    </div>
  );
}
