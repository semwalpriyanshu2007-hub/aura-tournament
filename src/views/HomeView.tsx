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

      {/* BUTTON */}
      <button
        onClick={() => setShowModal(true)}
        className="bg-red-600 text-white px-4 py-2 rounded-lg"
      >
        Add Tournament
      </button>

      {/* HERO */}
      <section className="rounded-2xl bg-gradient-to-br from-red-500/10 to-orange-400/10 border border-red-500/20 p-6">
        <div className="max-w-xl">

          <motion.div
            initial={false}   // 🔥 lag fix
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 mb-4"
          >
            <Zap className="w-5 h-5 text-red-500" />
            <span className="text-sm text-red-400 font-bold">
              Welcome, {user?.username}
            </span>
          </motion.div>

          <h2 className="text-2xl font-bold mb-2">
            BECOME THE <span className="text-red-500">LEGEND</span>
          </h2>

          <p className="text-gray-400 mb-4">
            Join tournaments and win rewards.
          </p>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setActiveView('tournaments')}
              className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              Join <ArrowRight className="w-4 h-4" />
            </button>

            <button className="bg-gray-700 text-white px-4 py-2 rounded-lg">
              Leaderboard
            </button>
          </div>

        </div>
      </section>

      {/* TOURNAMENT LIST */}
      <section>
        <h3 className="text-lg font-bold mb-3">Tournaments</h3>

        <div className="grid gap-3">
          {tournaments.map((t) => (
            <div key={t.id} className="p-4 rounded-xl bg-[#111] border border-gray-800">

              <h4 className="font-bold text-white">{t.name}</h4>

              <p className="text-sm text-gray-400">
                ₹{t.entryFee} • {t.joinedSlots}/{t.maxSlots}
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

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[9999]">

          <div className="w-full max-w-md bg-[#111] p-5 rounded-xl border border-red-500">

            <h2 className="text-lg font-bold mb-4 text-white">
              Add Tournament
            </h2>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tournament Name"
              className="w-full mb-3 p-3 rounded bg-black border border-gray-700 text-white outline-none"
            />

            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Entry Price"
              className="w-full mb-4 p-3 rounded bg-black border border-gray-700 text-white outline-none"
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
