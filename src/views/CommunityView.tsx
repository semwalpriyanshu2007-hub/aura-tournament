import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Image as ImageIcon, MessageCircle, Heart, MoreHorizontal, Share2, Filter } from 'lucide-react';
import { useAura } from '../store';

export function CommunityView() {
  const { posts, setPosts, user } = useAura();
  const [newPost, setNewPost] = useState('');

  const handleLike = (id: string) => {
    setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-display font-bold">Community <span className="text-aura-red">Wall</span></h2>
        <p className="text-gray-500">Share your glory moments with the world</p>
      </div>

      {/* New Post Box */}
      <section className="bg-aura-card border border-aura-border rounded-3xl p-6">
        <div className="flex space-x-4 mb-4">
          <img src={user?.avatar} className="w-12 h-12 rounded-full border-2 border-aura-red" />
          <textarea 
            placeholder="Share your victory or look for a squad..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="flex-1 bg-white/5 border border-aura-border rounded-2xl p-4 min-h-[120px] focus:outline-none focus:border-aura-red transition-all resize-none text-sm"
          />
        </div>
        <div className="flex items-center justify-between pl-16">
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-aura-red hover:bg-aura-red/5 rounded-xl transition-all">
              <ImageIcon size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-aura-red hover:bg-aura-red/5 rounded-xl transition-all">
              <Filter size={20} />
            </button>
          </div>
          <button className="bg-aura-red text-white px-8 py-2.5 rounded-xl font-bold flex items-center space-x-2 hover:bg-red-600 transition-all neon-glow-red">
            <span>Post</span>
            <Send size={16} />
          </button>
        </div>
      </section>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post, i) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-aura-card border border-aura-border rounded-3xl overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img src={`https://picsum.photos/seed/user-${post.userId}/100/100`} className="w-10 h-10 rounded-full" />
                  <div>
                    <div className="text-sm font-bold">{post.username}</div>
                    <div className="text-[10px] text-gray-500 uppercase font-mono">{new Date(post.date).toLocaleDateString()}</div>
                  </div>
                </div>
                <button className="text-gray-500 hover:text-white">
                  <MoreHorizontal />
                </button>
              </div>

              <p className="text-gray-300 text-sm mb-4 leading-relaxed line-clamp-3">
                {post.content}
              </p>

              {post.image && (
                <div className="rounded-2xl overflow-hidden mb-4 aspect-video border border-white/5">
                  <img src={post.image} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-aura-border/50">
                <div className="flex items-center space-x-6">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className="flex items-center space-x-2 text-gray-400 hover:text-aura-red transition-all group"
                  >
                    <Heart size={20} className="group-hover:fill-aura-red" />
                    <span className="text-sm font-bold">{post.likes}</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-all">
                    <MessageCircle size={20} />
                    <span className="text-sm font-bold">{post.comments.length}</span>
                  </button>
                </div>
                <button className="text-gray-400 hover:text-white">
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            {/* Simple Comments (Mock Only) */}
            {post.comments.length > 0 && (
              <div className="bg-black/20 p-6 border-t border-aura-border/30">
                {post.comments.map(c => (
                  <div key={c.id} className="flex space-x-3 text-sm">
                    <span className="font-bold text-gray-400">{c.username}:</span>
                    <span className="text-gray-500">{c.text}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.article>
        ))}
      </div>
    </div>
  );
}
