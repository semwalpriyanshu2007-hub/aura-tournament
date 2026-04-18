import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Wallet, ArrowUpCircle, ArrowDownCircle, Clock, CreditCard, Landmark, Plus, DollarSign } from 'lucide-react';
import { useAura } from '../store';

export function WalletView() {
  const { user, depositMoney } = useAura();
  const [showDeposit, setShowDeposit] = useState(false);
  const [amount, setAmount] = useState('');

  const handleDeposit = () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return;
    depositMoney(val);
    setAmount('');
    setShowDeposit(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-display font-bold mb-2">My <span className="text-aura-red">Wallet</span></h2>
        <p className="text-gray-500">Manage your funds and transaction history</p>
      </div>

      {/* Main Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-aura-red to-aura-orange rounded-[2.5rem] p-8 lg:p-12 text-white shadow-[0_20px_40px_rgba(255,0,0,0.2)]">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-12">
            <div>
              <div className="text-sm font-mono uppercase tracking-[0.2em] opacity-80 mb-2">Available Balance</div>
              <div className="text-5xl lg:text-6xl font-display font-bold drop-shadow-lg">${user?.wallet.balance.toLocaleString()}</div>
            </div>
            <Wallet size={48} className="opacity-20" />
          </div>

          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setShowDeposit(true)}
              className="bg-white text-aura-red font-bold px-8 py-3 rounded-xl flex items-center space-x-2 shadow-lg hover:scale-105 transition-transform"
            >
              <Plus size={20} />
              <span>Add Cash</span>
            </button>
            <button className="bg-aura-bg/20 backdrop-blur-md border border-white/20 text-white font-bold px-8 py-3 rounded-xl flex items-center space-x-2 hover:bg-aura-bg/40 transition-all">
              <ArrowDownCircle size={20} />
              <span>Withdraw</span>
            </button>
          </div>
        </div>

        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl opacity-30" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Transaction History */}
        <section className="bg-aura-card border border-aura-border rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center space-x-2">
              <Clock size={20} className="text-aura-red" />
              <span>Recent Activity</span>
            </h3>
          </div>

          <div className="space-y-4">
            {user?.wallet.transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    tx.type === 'deposit' || tx.type === 'prize' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {tx.type === 'deposit' || tx.type === 'prize' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                  </div>
                  <div>
                    <div className="font-bold text-sm capitalize">{tx.type.replace('_', ' ')}</div>
                    <div className="text-xs text-gray-500">{new Date(tx.date).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${
                    tx.type === 'deposit' || tx.type === 'prize' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {tx.type === 'deposit' || tx.type === 'prize' ? '+' : '-'}${tx.amount}
                  </div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest">{tx.status}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Payment Methods (Mock) */}
        <section className="bg-aura-card border border-aura-border rounded-3xl p-8">
          <h3 className="text-xl font-bold mb-8 flex items-center space-x-2">
            <CreditCard size={20} className="text-aura-red" />
            <span>Saved Methods</span>
          </h3>

          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between cursor-pointer hover:border-aura-red transition-all">
              <div className="flex items-center space-x-4">
                <Landmark className="text-gray-400" />
                <div>
                  <div className="text-sm font-bold">Easypaisa / JazzCash</div>
                  <div className="text-xs text-gray-500">Linked - ****7742</div>
                </div>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full" />
            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between cursor-pointer hover:border-aura-red transition-all">
              <div className="flex items-center space-x-4">
                <CreditCard className="text-gray-400" />
                <div>
                  <div className="text-sm font-bold">Visa Card</div>
                  <div className="text-xs text-gray-500">Linked - ****8902</div>
                </div>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full" />
            </div>

            <button className="w-full py-4 border-2 border-dashed border-aura-border rounded-2xl text-gray-500 font-bold hover:border-aura-red hover:text-aura-red transition-all flex items-center justify-center space-x-2">
              <Plus size={20} />
              <span>Link New Wallet</span>
            </button>
          </div>
        </section>
      </div>

      {/* Deposit Modal */}
      {showDeposit && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-aura-card border border-aura-border rounded-3xl p-8 w-full max-w-md shadow-2xl"
          >
            <h3 className="text-2xl font-display font-bold mb-6">Deposit <span className="text-aura-red">Cash</span></h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-xs font-mono text-gray-500 uppercase block mb-2">Enter Amount ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-aura-red" size={20} />
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="20.00"
                    className="w-full bg-white/5 border border-aura-border rounded-2xl py-4 pl-12 pr-4 text-2xl font-bold focus:outline-none focus:border-aura-red transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[10, 50, 100].map(v => (
                  <button 
                    key={v}
                    onClick={() => setAmount(v.toString())}
                    className="p-3 bg-white/5 rounded-xl border border-white/5 font-bold hover:bg-aura-red/20 hover:border-aura-red transition-all"
                  >
                    +${v}
                  </button>
                ))}
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setShowDeposit(false)}
                  className="flex-1 py-4 text-gray-500 font-bold"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeposit}
                  className="flex-2 bg-aura-red text-white py-4 rounded-2xl font-bold neon-glow-red hover:bg-red-600 transition-all"
                >
                  Confirm Deposit
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
