import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Users, Zap, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { useAura } from '../store';

export function HomeView() {
  const { user, tournaments, setActiveView, joinTournament } = useAura();
  const [joiningId, setJoiningId] = React.useState<string | null>(null);

  // ✅ FINAL FIXED FUNCTION
  const addTournament = async () => {
    alert("Button Clicked 🚀");

    try {
      const res = await fetch('/api/add-tournament', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: "My Tournament",
          price: 50
        })
      });

      alert("Status: " + res.status);

      const data = await res.json();
      console.log(data);

      alert("DATA: " + JSON.stringify(data));
    } catch (err) {
      console.error(err);
      alert("Fetch failed ❌");
    }
  };

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

      {/* ✅ ONLY ONE BUTTON */}
      <button
        onClick={addTournament}
        className="bg-red-600 text-white px-4 py-2 rounded-lg m-2"
      >
        Add Tournament
      </button>

      {/* 🔥 Hero Section */}
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

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-4"
          >
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

      {/* 🔥 Tournament List */}
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

    </div>
  );
}
