/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Comments from '../components/Comments';
import { motion } from 'motion/react';
import { Calendar, ThumbsUp, Heart, Eye, Lock, MessageCircle, Trophy, Star } from 'lucide-react';
import { dbService } from '../services/dbService';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';

export default function PredictionDetail() {
  const { slug } = useParams();
  const { profile } = useAuth();
  const [prediction, setPrediction] = useState<any>(null);
  const [sidebarTahminler, setSidebarTahminler] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (slug) {
          const detail = await dbService.getPredictionBySlug(slug);
          if (detail) {
            setPrediction(detail);
            // Increment view count (non-blocking)
            updateDoc(doc(db, 'predictions', detail.id), {
              views: increment(1)
            }).catch(e => {
              // Silently ignore permission errors for view increments
              if (e.code !== 'permission-denied') {
                console.error("View increment failed:", e);
              }
            });
          }
        }
        const current = await dbService.getPredictions('current');
        setSidebarTahminler(current);
      } catch (err) {
        console.error('Error fetching prediction detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const isVip = profile?.isVip || profile?.role === 'admin';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white">
        <Header />
        <main className="max-w-7xl mx-auto py-40 px-4 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ffcc00]"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white">
        <Header />
        <main className="max-w-7xl mx-auto py-40 px-4 text-center">
          <h2 className="text-3xl font-black italic">Tahmin bulunamadı.</h2>
          <Link to="/tahminler" className="text-[#ffcc00] mt-4 block underline">Tüm tahminlere dön</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const showContent = prediction.visibility === 'public' || isVip || prediction.status === 'settled' || prediction.isPublic || prediction.type === 'success';

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Header />
      
      <main className="max-w-7xl mx-auto py-10 px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Sidebar: Nav & Prediction List */}
          <aside className="w-full lg:w-1/4 space-y-8">
            <div className="flex flex-col items-center p-6 bg-[#0a0a0a] border border-white/5 rounded-3xl">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-[#ffcc00]">
                <img 
                    src={prediction.image || "https://i.pravatar.cc/300?u=altili"} 
                    alt="Author" 
                    className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-sm font-black uppercase text-center">{prediction.authorName || 'ALTILIYAKALATANADAM'}</h3>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest text-center mt-1">At Yarışı Tahmincisi & Yazarı</p>
            </div>

            <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-white/5 bg-black/20 text-xs font-black uppercase tracking-widest text-center">VIP Kupon Stüdyosu</div>
              <div className="divide-y divide-white/5">
                {sidebarTahminler.map((t, i) => (
                  <Link 
                    key={i} 
                    to={`/tahmin/${t.slug}`}
                    className="block px-6 py-4 text-xs font-bold text-gray-400 hover:text-[#ffcc00] hover:bg-white/5 transition-all"
                  >
                    {t.title}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Content: Detail */}
          <div className="flex-1 bg-[#0a0a0a]/50 border border-white/5 p-6 md:p-10 rounded-3xl shadow-2xl">
             <div className="flex items-center space-x-4 mb-6 text-xs text-gray-500 font-bold">
                 <div className="flex items-center space-x-1">
                    <Calendar size={14} className="text-[#ffcc00]" />
                    <span>{prediction.createdAt?.toDate ? prediction.createdAt.toDate().toLocaleDateString('tr-TR') : '...'}</span>
                 </div>
                 <div className="flex items-center space-x-1">
                    <Eye size={14} className="text-[#ffcc00]" />
                    <span>{prediction.views || 0}</span>
                 </div>
             </div>

              <h1 className="text-2xl md:text-5xl font-black italic mb-2 uppercase leading-tight tracking-tighter">
                {prediction.title}
              </h1>

              {prediction.badge && (
                <div className="inline-block bg-[#ffcc00] text-black text-[10px] font-black px-4 py-1 uppercase tracking-widest rounded-full mb-6 italic">
                  {prediction.badge}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-[#111111] border border-white/5 p-4 rounded-2xl">
                   <div className="text-[8px] font-black uppercase text-gray-500 tracking-widest mb-1">Güven Endeksi</div>
                   <div className="text-xl font-black italic text-[#ffcc00]">%{prediction.confidenceScore || 85}</div>
                </div>
                <div className="bg-[#111111] border border-white/5 p-4 rounded-2xl">
                   <div className="text-[8px] font-black uppercase text-gray-500 tracking-widest mb-1">Kupon Türü</div>
                   <div className="text-xl font-black italic uppercase">{prediction.couponType === 'aggressive' ? 'Agresif' : prediction.couponType === 'economic' ? 'Ekonomik' : 'Standart'}</div>
                </div>
                <div className="bg-[#111111] border border-white/5 p-4 rounded-2xl">
                   <div className="text-[8px] font-black uppercase text-gray-500 tracking-widest mb-1">Risk Durumu</div>
                   <div className="text-xl font-black italic uppercase text-gray-300">{prediction.priceLabel || 'Orta Risk'}</div>
                </div>
              </div>

              {prediction.subTitle && (
                 <div className="bg-[#ffcc00]/5 border-l-4 border-[#ffcc00] text-sm p-5 mb-8 font-bold italic text-gray-300">
                    {prediction.subTitle}
                 </div>
              )}

              <div className="relative">
                {/* Sample Content for non-VIPs if enabled */}
                {!showContent && prediction.visibility === 'sample' && prediction.sampleContent && (
                   <div className="mb-8 p-6 bg-blue-600/10 border border-blue-500/20 rounded-3xl">
                      <div className="flex items-center space-x-2 mb-4">
                         <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-400">Ücretsiz Örnek Analiz</h4>
                      </div>
                      <div className="text-sm italic text-gray-300 leading-relaxed whitespace-pre-wrap">{prediction.sampleContent}</div>
                   </div>
                )}

                <div className={`text-sm md:text-base text-gray-300 leading-relaxed ${(!showContent && prediction.visibility !== 'public') ? 'blur-sm opacity-20 select-none pointer-events-none' : ''}`}>
                    
                    {/* Daily Features */}
                    {showContent && (
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                          {prediction.dailyBanko && (
                             <div className="bg-green-500/10 border border-green-500/20 p-5 rounded-2xl relative overflow-hidden group">
                                <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform">
                                   <Trophy size={80} className="text-green-500" />
                                </div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-green-500 mb-2">Günün Bankosu</h4>
                                <p className="text-lg font-black italic uppercase">{prediction.dailyBanko}</p>
                             </div>
                          )}
                          {prediction.dailySurpriz && (
                             <div className="bg-purple-500/10 border border-purple-500/20 p-5 rounded-2xl relative overflow-hidden group">
                                <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform">
                                   <Star size={80} className="text-purple-500" />
                                </div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-purple-500 mb-2">Günün Sürprizi</h4>
                                <p className="text-lg font-black italic uppercase">{prediction.dailySurpriz}</p>
                             </div>
                          )}
                       </div>
                    )}

                    {/* Show Horse Race Features if any */}
                    {showContent && prediction.ayaklar && prediction.ayaklar.length > 0 && (
                      <div className="mb-8 w-full overflow-x-auto rounded-[30px] border border-[#ffcc00]/30 relative bg-[#000000] custom-scrollbar shadow-2xl">
                        {/* Background Watermark */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.03] overflow-hidden">
                           <span className="text-white font-black text-6xl md:text-8xl -rotate-12 whitespace-nowrap">ALTILIYAKALATANADAM.COM</span>
                        </div>

                        <div className="relative z-10">
                          <div className="bg-[#191919] flex flex-col justify-center items-center py-6 border-b border-[#ffcc00]/30">
                            <span className="text-[#ffcc00] font-black tracking-[0.4em] text-lg md:text-2xl uppercase italic">ALTILIYAKALATANADAM</span>
                            <div className="flex items-center space-x-2 mt-2">
                               <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                               <span className="text-white font-black tracking-[0.2em] text-[10px] md:text-xs uppercase">
                                 {prediction.track ? `${prediction.track} ` : ''}VIP KUPON DETAYI
                               </span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-6 divide-x divide-y md:divide-y-0 divide-[#ffcc00]/20 text-center min-w-full md:min-w-[800px]">
                            {prediction.ayaklar.slice(0, 6).map((a: any, i: number) => {
                              const horses = typeof a === 'object' ? a.horses : a;
                              const horseLines = typeof horses === 'string' ? horses.split(/[,/\s-]/).map(line => line.trim()).filter(Boolean) : [];
                              const isBanko = typeof a === 'object' ? a.banko : false;
                              const analysis = typeof a === 'object' ? a.analysis : '';

                              return (
                                <div key={i} className={`flex flex-col ${isBanko ? 'bg-[#ffcc00]/5' : ''}`}>
                                  <div className={`text-center py-3 text-xs md:text-sm font-black border-b border-[#191919] ${isBanko ? 'bg-[#ffcc00] text-black' : 'bg-[#111111] text-[#ffcc00]'}`}>
                                    {i + 1}. AYAK {isBanko && '(TEK)'}
                                  </div>
                                  <div className="bg-[#050505] text-gray-500 text-center py-1 text-[8px] md:text-[10px] font-black border-b border-white/5 uppercase tracking-widest">
                                    Numaralar
                                  </div>
                                  <div className="flex flex-col p-4 space-y-3 flex-1">
                                    <div className="flex flex-wrap justify-center gap-2">
                                       {horseLines.map((num, idx) => (
                                          <div key={idx} className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm border-2 ${idx === 0 ? 'bg-[#ffcc00] text-black border-white' : 'bg-white/5 text-white border-white/10'}`}>
                                             {num}
                                          </div>
                                       ))}
                                       {horseLines.length === 0 && (
                                          <div className="text-gray-600 text-[10px] italic py-2">Belirtilmedi</div>
                                       )}
                                    </div>
                                    {analysis && (
                                       <div className="mt-4 pt-4 border-t border-white/5 text-[9px] text-gray-400 leading-tight italic">
                                          {analysis}
                                       </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {showContent && prediction.dailyTemplate && (
                       <div className="mb-8 p-6 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-xl">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-[#ffcc00] mb-4">Günün Şablonu</h4>
                          <p className="font-mono text-sm text-gray-300 whitespace-pre-wrap">{prediction.dailyTemplate}</p>
                       </div>
                    )}

                    {showContent && prediction.fiyat && (
                      <div className="mb-8 p-6 bg-[#ffcc00] border-4 border-black rounded-2xl shadow-2xl inline-flex flex-col">
                         <span className="text-[10px] font-black uppercase text-black italic tracking-widest mb-1">Tahmini Kupon Tutarı</span>
                         <span className="font-black text-3xl text-black italic">{prediction.fiyat}</span>
                      </div>
                    )}

                    <div className="whitespace-pre-wrap break-all text-gray-300 leading-relaxed min-h-[100px] text-lg font-medium">{prediction.content}</div>
                </div>

                {!showContent && (prediction.visibility !== 'public') && (
                  <div className="absolute inset-x-0 bottom-0 top-20 flex items-center justify-center p-4">
                    <div className="bg-black/95 p-10 rounded-[40px] border border-[#ffcc00]/30 text-center shadow-3xl max-w-sm w-full backdrop-blur-xl">
                        <div className="w-20 h-20 bg-[#ffcc00]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                           <Lock size={48} className="text-[#ffcc00]" />
                        </div>
                        <h4 className="text-xl font-black uppercase italic mb-2 tracking-tight">KUPON KİLİTLİ</h4>
                        <p className="text-xs text-gray-500 font-medium mb-8">Bu özel VIP analizi ve 6 ayaklı kupon detaylarını görmek için aboneliğinizi başlatın.</p>
                        <Link to="/paketler" className="block w-full bg-[#ffcc00] text-black font-black py-4 rounded-2xl uppercase tracking-widest hover:scale-105 transition-transform mb-4 shadow-xl shadow-[#ffcc00]/20">VIP Üye Ol</Link>
                        <p className="text-[10px] text-gray-500">Zaten üye misiniz? <Link to="/login" className="text-[#ffcc00] underline">Giriş yapın</Link></p>
                    </div>
                  </div>
                )}
             </div>

             {/* Comments Section - Only if enabled by admin */}
             {prediction.commentsEnabled !== false && (
                <div className="mt-12 pt-8 border-t border-white/5">
                   <h3 className="text-xl font-black italic uppercase mb-8 flex items-center space-x-3">
                      <MessageCircle size={24} className="text-[#ffcc00]" />
                      <span>Kullanıcı Yorumları</span>
                   </h3>
                   <Comments predictionId={prediction.id} />
                </div>
             )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
