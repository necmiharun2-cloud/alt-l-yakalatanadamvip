/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'motion/react';
import { Calendar, Eye, ThumbsUp, Heart, ChevronLeft } from 'lucide-react';
import { dbService } from '../services/dbService';
import { db } from '../lib/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (slug) {
          const detail = await dbService.getBlogPostBySlug(slug);
          if (detail) {
            setPost(detail);
            // Increment view count
            updateDoc(doc(db, 'blogs', detail.id), {
              views: increment(1)
            }).catch(e => {
              if (e.code !== 'permission-denied') {
                console.error("View increment failed:", e);
              }
            });
          }
        }
      } catch (err) {
        console.error('Error fetching blog detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080d16] text-white">
        <Header />
        <main className="max-w-4xl mx-auto py-40 px-4 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00e5ff]"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#080d16] text-white">
        <Header />
        <main className="max-w-4xl mx-auto py-40 px-4 text-center">
          <h2 className="text-3xl font-black italic">Yazı bulunamadı.</h2>
          <Link to="/blog" className="text-[#00e5ff] mt-4 block underline">Blog'a dön</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080d16] text-white">
      <Header />
      
      <main className="max-w-4xl mx-auto py-20 px-4">
        {/* Back Link */}
        <Link 
          to="/blog" 
          className="inline-flex items-center space-x-2 text-[#00e5ff] hover:text-white transition-colors mb-12 font-black uppercase text-[10px] tracking-widest"
        >
          <ChevronLeft size={16} />
          <span>Geri Dön</span>
        </Link>

        <article>
          {/* Header */}
          <header className="mb-12">
            <div className="flex items-center space-x-6 mb-6">
              <div className="flex items-center space-x-2 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                <Calendar size={12} className="text-[#00e5ff]" />
                <span>
                    {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                <Eye size={12} className="text-[#00e5ff]" />
                <span>{post.views || 0} Görüntülenme</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-8 leading-tight uppercase">
              {post.title}
            </h1>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-xs font-bold bg-[#151b27] px-4 py-2 rounded-full border border-white/5">
                <ThumbsUp size={14} className="text-[#00e5ff]" />
                <span>{post.likes || 0}</span>
              </div>
              <div className="flex items-center space-x-1 text-xs font-bold bg-[#151b27] px-4 py-2 rounded-full border border-white/5">
                <Heart size={14} className="text-red-500" />
                <span>{Math.floor((post.likes || 0) * 0.6)}</span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="rounded-[40px] overflow-hidden mb-12 shadow-2xl border border-white/5">
            <img 
              src={post.image || `https://picsum.photos/seed/${post.id}/1200/600`} 
              alt={post.title} 
              className="w-full h-auto"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Content */}
          <div className="bg-[#0a0a0a] rounded-[40px] p-8 md:p-12 shadow-2xl border border-white/5">
            <div className="prose prose-invert max-w-none text-gray-400 font-medium leading-loose text-lg space-y-8 whitespace-pre-wrap">
              {post.content}
              
              <div className="pt-12 border-t border-white/5">
                <Link 
                  to="/iletisim" 
                  className="inline-block px-8 py-4 bg-[#00e5ff] text-black font-black uppercase tracking-widest rounded-2xl hover:bg-white transition-all transform active:scale-95"
                >
                  VIP Üye Ol ve Kazanmaya Başla
                </Link>
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
