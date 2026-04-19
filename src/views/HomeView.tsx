import React from 'react';
import { motion } from 'motion/react';
import { Zap, ArrowRight } from 'lucide-react';
import { useAura } from '../store';

export function HomeView() {
  const { user, tournaments, setActiveView, joinTournament } = useAura();

  const [joiningId, setJoiningId] = React.useState<string | null>(null);

  // MODAL STATES
  const [showModal, setShowModal] = React.useState(false);
  const [name, setName] = React.useState('');
  const [price, setPrice] = React.useState('');

  // ADD TOURNAMENT
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
          entryFee: Number(price)
        })
      });

      if (!res.ok) {
        alert("API failed ❌");
        return;
      }

      await res.json();

      alert("Tournament Added ✅");

      setName('');
      setPrice('');
      setShowModal(false);

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
    <div className="space-y-8 px-3">

      {/* 🔥 ADD BUTTON */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setShowModal(true)}
        className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-5 py-2 rounded-xl shadow-lg"
      >
        + Add Tournament
      </motion.button>

      {/* 🔥 HERO PREMIUM */}
      <section className="relative rounded-3xl bg-gradient-to-br from-red-500/10 to-orange-400/10 border border-red-500/20 p-6 backdrop-blur-xl overflow-hidden">

        <div className="max-w-xl z-10 relative">

          <motion.div
            initial={false}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 mb-4"
          >
            <Zap className="w-5 h-5 text-red-500" />
            <span className="text-sm text-red-400 font-bold">
              Welcome, {user?.username}
            </span>
          </motion.div>

          <h2 className="text-3xl font-bold mb-2">
            BECOME THE <span className="text-red-500">LEGEND</span>
          </h2>

          <p className="text-gray-400 mb-5">
            Join tournaments and win rewards.
          </p>

          <div className="flex gap-3 flex-wrap">
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setActiveView('tournaments')}
              className="bg-red-500 text-white px-5 py-2 rounded-xl flex items-center gap-2 shadow-md"
            >
              Join <ArrowRight className="w-4 h-4" />
            </motion.button>

            <button className="bg-gray-700 text-white px-5 py-2 rounded-xl">
              Leaderboard
            </button>
          </div>

        </div>

        {/* Glow Effect */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-500 blur-3xl opacity-20"></div>
      </section>

      {/* 🔥 PREMIUM TOURNAMENT CARDS */}
      <section>
        <h3 className="text-lg font-bold mb-3">Tournaments</h3>

        <div className="grid gap-4">
          {tournaments.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-2xl bg-gradient-to-br from-[#111] to-[#1a1a1a] border border-gray-800 shadow-lg"
            >

              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-white">{t.name}</h4>
                <span className="text-xs text-red-400 font-bold">
                  ₹{t.entryFee}
                </span>
              </div>

              <p className="text-xs text-gray-400 mb-3">
                {t.joinedSlots}/{t.maxSlots} Players Joined
              </p>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleJoin(t.id)}
                disabled={joiningId === t.id}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-2 rounded-xl font-bold"
              >
                {joiningId === t.id ? "Joining..." : "Join Now"}
              </motion.button>

            </motion.div>
          ))}
        </div>
      </section>

      {/* 🔥 MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[9999]">

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-[#111] p-5 rounded-2xl border border-red-500 shadow-2xl"
          >

            <h2 className="text-lg font-bold mb-4 text-white">
              Add Tournament
            </h2>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tournament Name"
              className="w-full mb-3 p-3 rounded bg-black border border-gray-700 text-white outline-none focus:border-red-500"
            />

            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Entry Price"
              className="w-full mb-4 p-3 rounded bg-black border border-gray-700 text-white outline-none focus:border-red-500"
            />

            <div className="flex gap-3">
              <button
                onClick={addTournament}
                className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 py-2 rounded text-white font-bold"
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

          </motion.div>
        </div>
      )}

    </div>
  );
}
