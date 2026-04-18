import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  Users, 
  Trophy, 
  DollarSign, 
  Plus, 
  MoreVertical, 
  AlertCircle,
  Megaphone,
  Check,
  X,
  CreditCard
} from 'lucide-react';
import { useAura } from '../store';

export function AdminView() {
  const { tournaments, createTournament, updateTournament, selectWinner, addNotification } = useAura();
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showWinnerSelect, setShowWinnerSelect] = useState(false);
  const [participantList, setParticipantList] = useState<any[]>([]);
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(false);
  const [selectedTid, setSelectedTid] = useState<string | null>(null);
  const [editTourney, setEditTourney] = useState<{id: string, name: string, price: number} | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null);
  const [newTourney, setNewTourney] = useState({
    name: '',
    type: 'solo' as const,
    prizePool: 0,
    entryFee: 0,
    maxSlots: 12,
    date: new Date().toISOString().split('T')[0],
    startTime: '18:00'
  });

  const handleCreate = () => {
    createTournament(newTourney);
    addNotification({
      id: `n_${Date.now()}`,
      title: 'Global Announcement',
      message: `New Tournament: ${newTourney.name} is now open for registration!`,
      type: 'system',
      read: false,
      date: new Date().toISOString()
    });
    setShowAdd(false);
  };

  const onEditClick = (t: any) => {
    setEditTourney({
      id: t.id,
      name: t.name,
      price: t.entryFee
    });
    setShowEdit(true);
  };

  const handleUpdate = async () => {
    if (!editTourney) return;
    setIsSaving(true);
    const success = await updateTournament(editTourney.id, {
      name: editTourney.name,
      price: editTourney.price
    });
    setIsSaving(false);
    
    if (success) {
      setShowEdit(false);
      setEditTourney(null);
      addNotification({
        id: `n_${Date.now()}`,
        title: 'System Update',
        message: `Tournament "${editTourney.name}" has been updated by administration.`,
        type: 'system',
        read: false,
        date: new Date().toISOString()
      });
    }
  };

  const onWinnerClick = async (id: string) => {
    setSelectedTid(id);
    setIsLoadingParticipants(true);
    setShowWinnerSelect(true);
    setSelectedWinner(null);
    try {
      const res = await fetch(`/api/tournament/${id}/participants`);
      const data = await res.json();
      setParticipantList(data.participants || []);
    } catch (err) {
      console.error('Error fetching participants:', err);
      alert('Failed to load participants');
      setShowWinnerSelect(false);
    } finally {
      setIsLoadingParticipants(false);
    }
  };

  const handleConfirmWinner = async () => {
    if (!selectedTid || !selectedWinner) return;
    setIsSaving(true);
    const success = await selectWinner(selectedTid, selectedWinner);
    setIsSaving(false);
    
    if (success) {
      setShowWinnerSelect(false);
      alert(`Winner ${selectedWinner} selected successfully!`);
      const t = tournaments.find(tourney => tourney.id === selectedTid);
      addNotification({
        id: `n_${Date.now()}`,
        title: 'Champions Announced',
        message: `${selectedWinner} has emerged as the champion of ${t?.name || 'Tournament'}!`,
        type: 'tournament',
        read: false,
        date: new Date().toISOString()
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold">Admin <span className="text-aura-orange">Control</span></h2>
          <p className="text-gray-500">Manage platform resources and oversight</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-aura-orange text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center space-x-2 shadow-lg hover:scale-105 transition-all"
        >
          <Plus size={20} />
          <span>New Tournament</span>
        </button>
      </div>

      {/* Overview Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Users', value: '1,284', icon: Users, color: 'text-blue-400' },
          { label: 'Active Rooms', value: '12', icon: Trophy, color: 'text-aura-orange' },
          { label: 'Platform Revenue', value: '$8,420', icon: DollarSign, color: 'text-green-400' },
          { label: 'Pending Withdrawals', value: '8', icon: AlertCircle, color: 'text-red-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-aura-card border border-aura-border p-6 rounded-2xl relative overflow-hidden">
            <div className={`p-2 w-fit rounded-lg bg-white/5 mb-4 ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-xs text-gray-500 uppercase font-mono tracking-widest">{stat.label}</div>
            <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-5 -translate-y-1/2 translate-x-1/2 rounded-full ${stat.color.replace('text', 'bg')}`} />
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Manage Tournaments */}
        <section className="bg-aura-card border border-aura-border rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-aura-border flex justify-between items-center">
            <h3 className="font-bold flex items-center space-x-2">
              <BarChart3 size={18} className="text-aura-orange" />
              <span>Tournaments Pipeline</span>
            </h3>
          </div>
          <div className="p-2">
            <table className="w-full text-left text-xs">
              <thead className="text-gray-500 font-mono uppercase tracking-widest bg-white/5">
                <tr>
                  <th className="px-4 py-3">Tournament</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Slots</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-aura-border/50">
                {tournaments.map(t => (
                  <tr key={t.id}>
                    <td className="px-4 py-4">
                      <div className="font-bold">{t.name}</div>
                      <div className="text-[10px] text-gray-500 uppercase">{t.type}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        t.status === 'upcoming' ? 'border-aura-orange/30 text-aura-orange' : 'border-green-500/30 text-green-500'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-mono">{t.joinedSlots}/{t.maxSlots}</td>
                    <td className="px-4 py-4 text-right flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => onWinnerClick(t.id)}
                        className="text-green-500 hover:text-green-400 text-[10px] font-bold uppercase tracking-wider bg-green-500/5 px-2 py-1 rounded-md border border-green-500/20 transition-all"
                      >
                        Winner
                      </button>
                      <button 
                        onClick={() => onEditClick(t)}
                        className="text-aura-orange hover:text-orange-400 text-[10px] font-bold uppercase tracking-wider bg-aura-orange/5 px-3 py-1 rounded-md border border-aura-orange/20 transition-all"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pending Withdrawals */}
        <section className="bg-aura-card border border-aura-border rounded-3xl p-6">
          <h3 className="font-bold mb-6 flex items-center space-x-2">
            <CreditCard size={18} className="text-red-400" />
            <span>Withdrawal Requests</span>
          </h3>
          <div className="space-y-4">
            {[
              { id: 'w1', user: 'ProKiller99', amount: 450, method: 'Easypaisa', date: '5 mins ago' },
              { id: 'w2', user: 'GhostRider', amount: 120, method: 'Bank Transfer', date: '2 hrs ago' },
            ].map(w => (
              <div key={w.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold">{w.user}</div>
                  <div className="text-[10px] text-gray-500 uppercase font-mono">{w.method} • {w.date}</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm font-bold text-green-400">${w.amount}</div>
                  <div className="flex space-x-2">
                    <button className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-all">
                      <Check size={16} />
                    </button>
                    <button className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all">
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Broadcast System */}
      <section className="bg-aura-card border border-aura-border rounded-3xl p-8 relative overflow-hidden bg-gradient-to-r from-aura-card to-aura-orange/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-aura-orange/10 text-aura-orange rounded-2xl">
              <Megaphone size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">Global Broadcast</h3>
              <p className="text-sm text-gray-500 max-w-md">Send instant push notifications and banner announcements to all active platform users.</p>
            </div>
          </div>
          <div className="flex-1 max-w-lg">
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Type global message..." 
                className="flex-1 bg-white/5 border border-aura-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-aura-orange transition-all"
              />
              <button className="bg-aura-orange text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all">
                Send
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Create Tournament Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-aura-card border border-aura-border rounded-[2rem] p-8 w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-display font-bold">New <span className="text-aura-orange">Tournament</span></h3>
              <button onClick={() => setShowAdd(false)}><X /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="col-span-2">
                <label className="text-xs font-mono text-gray-500 uppercase block mb-2">Tournament Name</label>
                <input 
                  type="text" 
                  value={newTourney.name}
                  onChange={e => setNewTourney({...newTourney, name: e.target.value})}
                  className="w-full bg-white/5 border border-aura-border rounded-xl p-3 focus:outline-none focus:border-aura-orange transition-all font-bold"
                  placeholder="The Ultimate Pro Series"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-gray-500 uppercase block mb-2">Match Type</label>
                <select 
                  value={newTourney.type}
                  onChange={e => setNewTourney({...newTourney, type: e.target.value as any})}
                  className="w-full bg-white/5 border border-aura-border rounded-xl p-3 focus:outline-none focus:border-aura-orange transition-all capitalize"
                >
                  <option value="solo">Solo</option>
                  <option value="duo">Duo</option>
                  <option value="squad">Squad</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-mono text-gray-500 uppercase block mb-2">Prize Pool ($)</label>
                <input 
                  type="number" 
                  value={newTourney.prizePool}
                  onChange={e => setNewTourney({...newTourney, prizePool: parseInt(e.target.value)})}
                  className="w-full bg-white/5 border border-aura-border rounded-xl p-3 focus:outline-none focus:border-aura-orange transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-gray-500 uppercase block mb-2">Entry Fee ($)</label>
                <input 
                  type="number" 
                  value={newTourney.entryFee}
                  onChange={e => setNewTourney({...newTourney, entryFee: parseInt(e.target.value)})}
                  className="w-full bg-white/5 border border-aura-border rounded-xl p-3 focus:outline-none focus:border-aura-orange transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-gray-500 uppercase block mb-2">Max Slots</label>
                <input 
                  type="number" 
                  value={newTourney.maxSlots}
                  onChange={e => setNewTourney({...newTourney, maxSlots: parseInt(e.target.value)})}
                  className="w-full bg-white/5 border border-aura-border rounded-xl p-3 focus:outline-none focus:border-aura-orange transition-all"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setShowAdd(false)}
                className="flex-1 py-4 text-gray-500 font-bold"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreate}
                className="flex-2 bg-aura-orange text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-[0_0_20px_rgba(255,138,0,0.3)]"
              >
                Launch Tournament
              </button>
            </div>
          </motion.div>
        </div>
      )}
      {/* Edit Tournament Modal */}
      {showEdit && editTourney && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-aura-card border border-aura-border rounded-[2rem] p-8 w-full max-w-lg shadow-2xl relative overflow-hidden"
          >
            {/* Success Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-aura-orange/10 blur-3xl -translate-y-1/2 translate-x-1/2 rounded-full" />
            
            <div className="flex justify-between items-center mb-8 relative">
              <div>
                <h3 className="text-2xl font-display font-bold">Edit <span className="text-aura-orange">Tournament</span></h3>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">ID: {editTourney.id}</p>
              </div>
              <button 
                onClick={() => !isSaving && setShowEdit(false)}
                className="text-gray-500 hover:text-white p-2 transition-colors"
              >
                <X />
              </button>
            </div>

            <div className="space-y-6 mb-8 relative">
              <div>
                <label className="text-xs font-mono text-gray-500 uppercase block mb-2 font-bold tracking-tighter">Event Title</label>
                <input 
                  type="text" 
                  value={editTourney.name}
                  onChange={e => setEditTourney({...editTourney, name: e.target.value})}
                  className="w-full bg-white/5 border border-aura-border rounded-xl p-4 focus:outline-none focus:border-aura-orange transition-all font-bold text-lg"
                  placeholder="Update title..."
                />
              </div>
              
              <div>
                <label className="text-xs font-mono text-gray-500 uppercase block mb-2 font-bold tracking-tighter">Management Fee ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-aura-orange" size={18} />
                  <input 
                    type="number" 
                    value={editTourney.price}
                    onChange={e => setEditTourney({...editTourney, price: parseInt(e.target.value) || 0})}
                    className="w-full bg-white/5 border border-aura-border rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-aura-orange transition-all font-bold text-xl"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 relative">
              <button 
                disabled={isSaving}
                onClick={() => setShowEdit(false)}
                className="flex-1 py-4 text-gray-400 font-bold hover:text-white transition-colors disabled:opacity-50"
              >
                Discard
              </button>
              <button 
                disabled={isSaving}
                onClick={handleUpdate}
                className="flex-2 bg-aura-orange text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-[0_0_30px_rgba(255,138,0,0.2)] flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check size={20} />
                    <span>Commit Changes</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Select Winner Modal */}
      {showWinnerSelect && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[110] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
            className="bg-aura-card border border-aura-border rounded-[2.5rem] p-8 w-full max-w-lg shadow-2xl relative overflow-hidden"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-display font-bold">Declare <span className="text-green-400">Winner</span></h3>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Tournament Selection</p>
              </div>
              <button onClick={() => !isSaving && setShowWinnerSelect(false)} className="text-gray-500 hover:text-white transition-colors"><X /></button>
            </div>

            <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {isLoadingParticipants ? (
                <div className="py-12 flex flex-col items-center justify-center text-gray-500 space-y-4">
                  <div className="w-8 h-8 border-4 border-aura-orange/20 border-t-aura-orange rounded-full animate-spin" />
                  <span className="text-xs font-mono uppercase tracking-widest">Scanning Participants...</span>
                </div>
              ) : participantList.length === 0 ? (
                <div className="py-12 text-center text-gray-600 font-mono text-xs uppercase tracking-widest bg-white/5 rounded-2xl border border-dashed border-aura-border">
                  No participants registered yet
                </div>
              ) : (
                participantList.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedWinner(p.userName)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                      selectedWinner === p.userName 
                        ? 'bg-green-500/10 border-green-500/50 text-white' 
                        : 'bg-white/5 border-aura-border text-gray-400 hover:border-aura-orange/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${selectedWinner === p.userName ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-600 group-hover:text-aura-orange transition-colors'}`}>
                        <Users size={18} />
                      </div>
                      <span className="font-bold underline-offset-4 decoration-aura-orange/30">{p.userName}</span>
                    </div>
                    {selectedWinner === p.userName && <Check className="text-green-400" size={18} />}
                  </button>
                ))
              )}
            </div>

            <div className="flex gap-4">
              <button 
                disabled={isSaving}
                onClick={() => setShowWinnerSelect(false)}
                className="flex-1 py-4 text-gray-500 font-bold hover:text-white transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                disabled={isSaving || !selectedWinner || participantList.length === 0}
                onClick={handleConfirmWinner}
                className="flex-[2] bg-green-500 text-aura-bg py-4 rounded-xl font-bold hover:bg-green-400 transition-all shadow-[0_0_30px_rgba(34,197,94,0.2)] disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-aura-bg/20 border-t-aura-bg rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Trophy size={20} />
                    <span>Declare Champion</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
