/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'motion/react';
import { ChevronRight, ChevronLeft, Calendar, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { dbService } from '../services/dbService';

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await dbService.getBlogPosts();
        setBlogPosts(data);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-[#080d16] text-white">
      <Header />
      
      <main>
        {/* Banner with Breadcrumb */}
        <section className="relative h-[250px] overflow-hidden flex items-center px-4">
          <div className="absolute inset-0 bg-[#05090f] opacity-80 z-10" />
          <img 
            src="https://picsum.photos/seed/race_blog/1920/600" 
            alt="Race" 
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="max-w-7xl mx-auto w-full relative z-20">
            <div className="flex items-center space-x-3 text-xs font-bold uppercase tracking-widest text-[#00e5ff]">
              <Link to="/">Anasayfa</Link>
              <ChevronRight size={14} />
              <span className="text-gray-400">Blog</span>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto py-20 px-4">
          {/* Title Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 border-l-4 border-[#00e5ff] pl-8">
            <div>
              <h1 className="text-5xl font-black italic tracking-tighter mb-4 underline decoration-[#00e5ff] decoration-4 underline-offset-8">
                Son <span className="text-gray-400">Yazılar</span>
              </h1>
            </div>
            <div className="max-w-md text-sm text-gray-500 font-medium">
              At yarışı tutkunları için en güncel analizler ve ALTILIYAKALATANADAM hakkında tüm merak ettikleriniz!
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00e5ff]"></div>
            </div>
          ) : (
            <>
              {/* Grid Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.length === 0 ? (
                  <div className="col-span-full py-12 text-center bg-[#0a0a0a] rounded-[40px] border border-white/5">
                    <p className="text-gray-500 italic">Henüz blog yazısı bulunmuyor.</p>
                  </div>
                ) : (
                  blogPosts.map((post, idx) => (
                    <motion.div 
                      key={post.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: (idx % 3) * 0.1 }}
                      className="bg-[#0a0a0a] rounded-[40px] overflow-hidden border border-white/5 shadow-2xl group cursor-pointer"
                    >
                      <Link to={`/blog/${post.slug}`}>
                        <div className="h-64 overflow-hidden relative">
                          <img 
                            src={post.image || `https://picsum.photos/seed/${post.id}/600/400`} 
                            alt={post.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />
                        </div>
                        <div className="p-8">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2 text-[#00e5ff]">
                              <Calendar size={14} />
                              <span className="text-[10px] font-black uppercase tracking-widest">
                                {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-500">
                              <Eye size={14} className="text-[#00e5ff]" />
                              <span className="text-[10px] font-black uppercase tracking-widest">{post.views || 0}</span>
                            </div>
                          </div>
                          <h3 className="text-lg font-black text-white mb-4 line-clamp-2 leading-tight tracking-tight group-hover:text-[#00e5ff] transition-colors uppercase italic">
                            {post.title}
                          </h3>
                          <p className="text-gray-500 text-sm font-medium line-clamp-3 leading-relaxed">
                            {post.content?.substring(0, 150)}...
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  ))
                )}
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
