import React from 'react';
import { motion } from 'motion/react';
import { Zap, ArrowRight } from 'lucide-react';
import { useAura } from '../store';

export function HomeView() {
  const { user, tournaments, setActiveView, joinTournament } = useAura();

  const [joiningId, setJoiningId] = React.useState<string | null>(null);

  // ✅ MODAL STATES
  const [showModal, setShowModal] = React.useState(false);
  const [name, setName] = React.useState('');
  const [price, setPrice] = React.useState('');

  // ✅ ADD TOURNAMENT (FINAL FIXED)
  const addTournament = async () => {
    if (!name || !price) {
      alert("Fill all fields ❗");
      return;
    }

    try {
      const res = await fetch('/api/add-tournament', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          price: Number(price) 
        })
      });

      if (!res.ok) {
        throw new Error("API failed");
      }

      const data = await res.json();
      console.log(data);

      alert("Tournament Added ✅");

      // reset
      setName('');
      setPrice('');
      setShowModal(false);

      // 🔥 IMPORTANT: refresh list
      window.location.reload();

    } catch (err) {
      console.error(err);
      alert("Error ❌");
    }
  };

  const handleJoin = async (id: string) => {
    setJoiningId(id);
    try {
      const success = await joinTournament(id);
      if (success) alert('Joined successfully!');
    } catch (error: any) {
      alert(error.message || 'Failed to join tournament');
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div className="space-y-8">

      {/* ✅ OPEN MODAL BUTTON */}
      <button
        onClick={() => setShowModal(true)}
        className="bg-red-600 text-white px-4 py-2 rounded-lg m-2"
      >
        Add Tournament
      </button>

      {/* 🔥 HERO */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-aura-red/20 to-aura-orange/20 border border-aura-red/20 p-8 lg:p-12">
        <div className="relative z-10 max-w-2xl">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-aura-red/10 border border-aura-red/20 rounded-full px-4 py-1.5 mb-6"
          >
            <Zap size={14} className="text-aura-red fill-aura-red" />
            <span className="text-xs font-bold text-aura-red uppercase">
              Welcome, {user?.username}
            </span>
          </motion.div>

          <motion.h2 className="text-4xl font-bold mb-4">
            BECOME THE <span className="text-red-500">LEGEND</span>
          </motion.h2>

          <motion.p className="text-gray-400 mb-6">
            Join tournaments and win rewards.
          </motion.p>

          <div className="flex gap-4">
            <button
              onClick={() => setActiveView('tournaments')}
              className="bg-red-500 text-white px-6 py-3 rounded-lg flex items-center gap-2"
            >
              Join Tournament <ArrowRight size={18} />
            </button>

            <button className="bg-gray-700 text-white px-6 py-3 rounded-lg">
              Leaderboard
            </button>
          </div>

        </div>
      </section>

      {/* 🔥 TOURNAMENT LIST */}
      <section>
        <h3 className="text-xl font-bold mb-4">Tournaments</h3>

        <div className="grid gap-4">
          {tournaments.map((t) => (
            <div key={t.id} className="p-4 border rounded-xl">

              <h4 className="font-bold">{t.name}</h4>

              <p className="text-sm text-gray-400">
                ${t.entryFee} • {t.joinedSlots}/{t.maxSlots}
              </p>

              <button
                onClick={() => handleJoin(t.id)}
                disabled={joiningId === t.id}
                className="mt-3 bg-gray-800 text-white px-4 py-2 rounded-lg w-full"
              >
                {joiningId === t.id ? "Joining..." : "Join"}
              </button>

            </div>
          ))}
        </div>
      </section>

      {/* 🔥 MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]">

          <div className="bg-[#111] p-6 rounded-xl w-[90%] max-w-md border border-red-500">

            <h2 className="text-xl font-bold mb-4 text-white">
              Add Tournament
            </h2>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tournament Name"
              autoFocus
              className="w-full mb-3 p-3 rounded bg-black border border-gray-700 text-white focus:outline-none"
            />

            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Entry Price"
              className="w-full mb-4 p-3 rounded bg-black border border-gray-700 text-white focus:outline-none"
            />

            <div className="flex gap-3">
              <button
                onClick={addTournament}
                className="flex-1 bg-red-600 py-2 rounded text-white font-bold"
              >
                Submit
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-700 py-2 rounded text-white"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
