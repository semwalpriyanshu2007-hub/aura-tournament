import React from 'react';  
import { motion } from 'motion/react';  
import { Trophy, Users, Zap, TrendingUp, Calendar, ArrowRight } from 'lucide-react';  
import { useAura } from '../store';  

export function HomeView() {  
  const { user, tournaments, setActiveView, joinTournament } = useAura();  
  const [joiningId, setJoiningId] = React.useState<string | null>(null);  

  // 🔥 NEW FUNCTION (ADD KIYA)
  const addTournament = async () => {
    alert("Button Clicked 🚀");

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

    const data = await res.json();
    console.log(data);
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

      {/* 🔥 ADD TOURNAMENT BUTTON */}
      <button
        onClick={addTournament}
        style={{
          margin: '10px',
          padding: '10px 15px',
          background: 'red',
          color: 'white',
          border: 'none',
          borderRadius: '8px'
        }}
      >
        Add Tournament
      </button>

      {/* Hero Section */}  
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-aura-red/20 to-aura-orange/20 border border-aura-red/20 p-8 lg:p-12">  
        <div className="relative z-10 max-w-2xl">  
          <motion.div  
            initial={{ opacity: 0, y: 20 }}  
            animate={{ opacity: 1, y: 0 }}  
            className="inline-flex items-center space-x-2 bg-aura-red/10 border border-aura-red/20 rounded-full px-4 py-1.5 mb-6"  
          >  
            <Zap size={14} className="text-aura-red fill-aura-red" />  
            <span className="text-xs font-bold text-aura-red tracking-wide uppercase">Season 4 Now Live • Welcome, {user?.username}</span>  
          </motion.div>  
            
          <motion.h2  
            initial={{ opacity: 0, y: 20 }}  
            animate={{ opacity: 1, y: 0 }}  
            transition={{ delay: 0.1 }}  
            className="text-4xl lg:text-6xl font-display font-bold mb-4 leading-tight"  
          >  
            BECOME THE <span className="text-aura-red neon-text-red">LEGEND</span> OF THE FIELD  
          </motion.h2>  
            
          <motion.p  
            initial={{ opacity: 0, y: 20 }}  
            animate={{ opacity: 1, y: 0 }}  
            transition={{ delay: 0.2 }}  
            className="text-gray-400 text-lg mb-8"  
          >  
            Join daily tournaments, compete with top squads, and win massive prize pools.   
            The aura of victory awaits you.  
          </motion.p>  
            
          <motion.div  
            initial={{ opacity: 0, y: 20 }}  
            animate={{ opacity: 1, y: 0 }}  
            transition={{ delay: 0.3 }}  
            className="flex flex-wrap gap-4"  
          >  
            <button   
              onClick={() => setActiveView('tournaments')}  
              className="bg-aura-red hover:bg-red-600 text-white font-bold px-8 py-4 rounded-xl transition-all hover:scale-105 active:scale-95 neon-glow-red flex items-center space-x-2"  
            >  
              <span>Join Tournament</span>  
              <ArrowRight size={20} />  
            </button>  
            <button className="bg-white/5 hover:bg-white/10 text-white font-bold px-8 py-4 rounded-xl border border-aura-border transition-all flex items-center space-x-2">  
              <span>View Leaderboard</span>  
            </button>  
          </motion.div>  
        </div>  
      </section>  

      {/* बाकी code same hai... */}
    </div>  
  );  
}
