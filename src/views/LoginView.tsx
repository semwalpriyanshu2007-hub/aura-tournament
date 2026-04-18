import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Target, User as UserIcon } from 'lucide-react';
import { useAura } from '../store';
import { MOCK_USER } from '../constants';

export function LoginView() {
  const { setUser } = useAura();
  const [username, setUsername] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    // Create a new user based on MOCK_USER but with custom name
    const newUser = {
      ...MOCK_USER,
      id: `u_${Date.now()}`,
      username: username.trim(),
      email: `${username.toLowerCase().replace(/\s+/g, '')}@aura.cup`,
      uid: `AURA-${Math.floor(Math.random() * 9000 + 1000)}-X${Math.floor(Math.random() * 90 + 10)}`
    };

    setUser(newUser);
  };

  return (
    <div className="min-h-screen bg-aura-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-aura-red/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-aura-orange/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-aura-card border border-aura-border rounded-[2.5rem] p-8 lg:p-12 relative z-10 shadow-2xl"
      >
        <div className="text-center mb-10">
          <div className="inline-flex p-3 bg-aura-red/10 rounded-2xl mb-4 border border-aura-red/20 shadow-[0_0_20px_rgba(255,0,0,0.1)]">
            <Target className="text-aura-red" size={32} />
          </div>
          <h1 className="text-3xl font-display font-bold mb-2">AURA <span className="text-aura-red">CUP</span></h1>
          <p className="text-gray-500">Welcome to the elite gaming arena.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-xs font-mono text-gray-500 uppercase block mb-1.5 ml-1">Choose Your Gamer Tag</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input 
                type="text" 
                autoFocus
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter username..."
                className="w-full bg-white/5 border border-aura-border rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-aura-red transition-all"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={!username.trim()}
            className="w-full bg-aura-red text-white py-4 rounded-xl font-bold neon-glow-red hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Enter Arena</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-8 text-center">
            <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest leading-relaxed">
                By entering, you join a network of competitive warriors.<br/>
                Prepare for absolute dominance.
            </p>
        </div>
      </motion.div>

      {/* Footer micro-details */}
      <div className="absolute bottom-8 text-center w-full">
        <p className="text-[10px] font-mono text-gray-700 uppercase tracking-widest">
          © 2024 Aura Cup Esports Platform • System v2.0
        </p>
      </div>
    </div>
  );
}
