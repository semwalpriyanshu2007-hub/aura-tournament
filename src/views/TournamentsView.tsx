import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Calendar, Users, Zap, Search, Filter, X, CheckCircle } from 'lucide-react';
import { useAura } from '../store';
import { Tournament } from '../types';

export function TournamentsView() {
  const { tournaments, isLoadingTournaments, tournamentError, fetchTournaments, joinTournament, user } = useAura();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);

  const filteredTournaments = tournaments.filter(t => {
    const matchesFilter = filter === 'all' || t.type === filter;
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleJoin = async (id: string) => {
    setIsJoining(true);
    try {
      const success = await joinTournament(id);
      if (success) {
        setJoinSuccess(true);
        setTimeout(() => {
          setJoinSuccess(false);
          setSelectedTournament(null);
        }, 2000);
      }
    } catch (error: any) {
      alert(error.message || 'Failed to join tournament');
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoadingTournaments) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-aura-red/30 border-t-aura-red rounded-full animate-spin" />
        <p className="text-gray-500 font-mono text-sm animate-pulse">ESTABLISHING CONNECTION TO AURA SERVERS...</p>
      </div>
    );
  }

  if (tournamentError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center">
        <div className="bg-aura-red/10 p-4 rounded-full border border-aura-red/20">
          <Zap size={32} className="text-aura-red" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">Signal Interrupted</h3>
          <p className="text-gray-500 max-w-xs mx-auto">We couldn't retrieve the tournament data. Please verify your connection.</p>
        </div>
        <button 
          onClick={() => fetchTournaments()}
          className="bg-aura-red text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all neon-glow-red"
        >
          RETRY UPLINK
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold">Browse <span className="text-aura-red">Tournaments</span></h2>
          <p className="text-gray-500">Compete in professional rooms and earn rewards</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-aura-card border border-aura-border rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-aura-red transition-colors w-full sm:w-64"
            />
          </div>
          <div className="flex bg-aura-card border border-aura-border rounded-xl p-1">
            {['all', 'solo', 'duo', 'squad'].map(t => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  filter === t ? 'bg-aura-red text-white' : 'text-gray-500 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTournaments.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSelectedTournament(t)}
            className="group cursor-pointer bg-aura-card border border-aura-border rounded-3xl overflow-hidden hover:border-aura-red transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="relative h-40">
              <img src={`https://picsum.photos/seed/${t.id}/600/300`} className="w-full h-full object-cover opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-t from-aura-card to-transparent" />
              <div className="absolute top-4 right-4 bg-aura-bg/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-bold text-white uppercase">
                {t.type}
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-lg font-bold group-hover:text-aura-red transition-colors">{t.name}</h4>
                <div className="text-aura-yellow font-bold flex items-center space-x-1">
                  <Zap size={14} fill="currentColor" />
                  <span>${t.prizePool}</span>
                </div>
              </div>

              {t.winner ? (
                <div className="mb-4 flex items-center space-x-2 text-green-500 bg-green-500/10 w-fit px-2 py-0.5 rounded-md border border-green-500/10">
                  <Trophy size={10} className="fill-green-500" />
                  <span className="text-[10px] font-bold">WINNER: {t.winner}</span>
                </div>
              ) : (
                <div className="mb-4 text-gray-500 text-[9px] font-mono uppercase tracking-widest">
                  Winner Pending
                </div>
              )}

              <div className="flex items-center space-x-4 mb-6 text-gray-500 text-xs">
                <div className="flex items-center space-x-1">
                  <Calendar size={14} />
                  <span>{t.date}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users size={14} />
                  <span>{t.joinedSlots}/{t.maxSlots}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs font-mono text-gray-600 uppercase">Entry: ${t.entryFee}</div>
                <button className="text-aura-red text-sm font-bold flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                  <span>View Details</span>
                  <X size={14} className="rotate-45" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal Details */}
      <AnimatePresence>
        {selectedTournament && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !isJoining && setSelectedTournament(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 lg:inset-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-[800px] lg:h-[600px] bg-aura-card border border-aura-border rounded-[2.5rem] z-[110] overflow-hidden flex flex-col lg:flex-row shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              <div className="lg:w-2/5 relative h-48 lg:h-auto">
                <img src={`https://picsum.photos/seed/${selectedTournament.id}/800/800`} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-aura-card via-aura-card/20 to-transparent" />
                <button 
                  onClick={() => setSelectedTournament(null)}
                  className="absolute top-6 left-6 p-2 bg-black/50 text-white rounded-full lg:hidden"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="lg:w-3/5 p-8 lg:p-12 overflow-y-auto">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-xs font-bold text-aura-red uppercase tracking-widest border border-aura-red/30 px-3 py-1 rounded-full">
                    Upcoming Match
                  </span>
                  <button 
                    onClick={() => setSelectedTournament(null)}
                    className="hidden lg:block text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <h3 className="text-3xl font-display font-bold mb-2">{selectedTournament.name}</h3>
                <p className="text-gray-400 text-sm mb-8">
                  Official Garena selection tournament. Top seeds will qualify for the Aura Championship Series.
                </p>

                <div className="grid grid-cols-2 gap-6 mb-10">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div className="text-xs font-mono text-gray-500 uppercase mb-2">Prize Pool</div>
                    <div className="text-2xl font-bold text-aura-yellow flex items-center space-x-1">
                      <Zap size={20} fill="currentColor" />
                      <span>${selectedTournament.prizePool}</span>
                    </div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div className="text-xs font-mono text-gray-500 uppercase mb-2">Entry Fee</div>
                    <div className="text-2xl font-bold text-white">${selectedTournament.entryFee}</div>
                  </div>
                </div>

                <div className="space-y-4 mb-10">
                  <div className="flex items-center justify-between text-sm py-3 border-b border-aura-border">
                    <div className="text-gray-400 flex items-center space-x-2">
                      <Trophy size={16} />
                      <span>Type</span>
                    </div>
                    <span className="font-bold capitalize">{selectedTournament.type}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm py-3 border-b border-aura-border">
                    <div className="text-gray-400 flex items-center space-x-2">
                      <Calendar size={16} />
                      <span>Date & Time</span>
                    </div>
                    <span className="font-bold">{selectedTournament.date} @ {selectedTournament.startTime}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm py-3 border-b border-aura-border">
                    <div className="text-gray-400 flex items-center space-x-2">
                      <Users size={16} />
                      <span>Slots Filled</span>
                    </div>
                    <span className="font-bold">{selectedTournament.joinedSlots} / {selectedTournament.maxSlots}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {joinSuccess ? (
                    <div className="flex-1 bg-green-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 animate-pulse">
                      <CheckCircle size={20} />
                      <span>Joined Successfully!</span>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleJoin(selectedTournament.id)}
                      disabled={isJoining || selectedTournament.joinedSlots >= selectedTournament.maxSlots || (user && user.wallet.balance < selectedTournament.entryFee)}
                      className="flex-1 bg-aura-red hover:bg-red-600 disabled:bg-gray-700 text-white py-4 rounded-2xl font-bold transition-all neon-glow-red flex items-center justify-center space-x-3"
                    >
                      {isJoining ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Zap size={20} />
                          <span>Join Now (${selectedTournament.entryFee})</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
                
                {user && user.wallet.balance < selectedTournament.entryFee && !joinSuccess && (
                  <p className="text-center text-red-500 text-xs mt-4 font-medium uppercase tracking-widest">
                    Insufficient Balance
                  </p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
