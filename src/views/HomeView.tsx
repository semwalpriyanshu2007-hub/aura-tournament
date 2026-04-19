import React from 'react';
import { motion } from 'motion/react';
import { Zap, ArrowRight } from 'lucide-react';
import { useAura } from '../store';
import { db } from '../firebase'; // 👈 IMPORTANT
import { collection, getDocs } from 'firebase/firestore';

export function HomeView() {
  const { user, tournaments, setActiveView, joinTournament, setTournaments } = useAura();

  const [joiningId, setJoiningId] = React.useState<string | null>(null);

  // MODAL STATES
  const [showModal, setShowModal] = React.useState(false);
  const [name, setName] = React.useState('');
  const [price, setPrice] = React.useState('');

  // 🔥 LOAD TOURNAMENTS FROM FIREBASE
  const loadTournaments = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'tournaments'));

      const data: any[] = [];

      snapshot.forEach(doc => {
        data.push({
          id: doc.id,
          ...doc.data()
        });
      });

      setTournaments(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // 🔥 LOAD ON PAGE LOAD
  React.useEffect(() => {
    loadTournaments();
  }, []);

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

      // 🔥 RELOAD DATA WITHOUT PAGE REFRESH
      await loadTournaments();

    } catch (err) {
      console.error(err);
      alert("Error ❌");
    }
  };

  const handleJoin = async (id: string) => {
    setJoiningId(id);
    try {
      const success = await joinTournament(id);
      if (success) {
        alert('Joined successfully!');
        await loadTournaments(); // 🔥 refresh slots
      }
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

      {/* 🔥 HERO */}
      <section className="relative rounded-3xl bg-gradient-to-br from-red-500/10 to-orange-400/10 border border-red-500/20 p-6 backdrop-blur-xl overflow-hidden">

        <div className="max-w-xl z-10 relative">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-red-500" />
            <span className="text-sm text-red-400 font-bold">
              Welcome, {user?.username}
            </span>
          </div>

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
              className="bg-red-500 text-white px-5 py-2 rounded-xl flex items-center gap-2"
            >
              Join <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-500 blur-3xl opacity-20"></div>
      </section>

      {/* 🔥 TOURNAMENT LIST */}
      <section>
        <h3 className="text-lg font-bold mb-3">Tournaments</h3>

        <div className="grid gap-4">
          {tournaments.map((t, i) => (
            <motion.div
              key={t.id}
              className="p-4 rounded-2xl bg-[#111] border border-gray-800"
            >
              <div className="flex justify-between mb-2">
                <h4 className="text-white font-bold">{t.name}</h4>
                <span className="text-red-400">₹{t.entryFee}</span>
              </div>

              <p className="text-xs text-gray-400 mb-3">
                {t.joinedSlots || 0}/{t.maxSlots || 100} Players
              </p>

              <button
                onClick={() => handleJoin(t.id)}
                disabled={joiningId === t.id}
                className="w-full bg-red-500 py-2 rounded text-white"
              >
                {joiningId === t.id ? "Joining..." : "Join Now"}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🔥 MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">

          <div className="bg-[#111] p-5 rounded-xl w-full max-w-md">

            <h2 className="text-white mb-3">Add Tournament</h2>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full mb-3 p-2 bg-black border"
            />

            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
              className="w-full mb-3 p-2 bg-black border"
            />

            <button onClick={addTournament} className="bg-red-500 w-full py-2 text-white">
              Submit
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
