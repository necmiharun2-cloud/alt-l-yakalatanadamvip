/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'motion/react';
import { APP_LOGO_URL } from '../constants';
import { ChevronRight, ChevronLeft, Eye, Lock, Calendar, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';

export default function Predictions() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const data = await dbService.getPredictions('current');
        setPredictions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching predictions:', err);
        setPredictions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPredictions();
  }, []);

  const isVip = profile?.isVip || profile?.role === 'admin';

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Header />
      
      <main className="max-w-7xl mx-auto py-20 px-4">
        {/* Title Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-l-4 border-[#ffcc00] pl-8 gap-6">
            <div className="flex items-center space-x-6">
              <img 
                src={APP_LOGO_URL} 
                alt="Güncel Tahminler" 
                className="w-16 h-16 object-contain"
                referrerPolicy="no-referrer"
              />
              <div>
                <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter mb-4">
                  VIP <span className="text-gray-400">Kupon Stüdyosu</span>
                </h1>
              </div>
            </div>
            <div className="max-w-md text-xs md:text-sm text-gray-500 font-medium">
              Profesyonel at yarışı analizleri, %90+ güven endeksli VIP kuponlar ve günlük banko tercihlerimizle kazancınızı katlayın.
            </div>
          </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ffcc00]"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {predictions.length === 0 ? (
                <div className="col-span-full py-12 text-center bg-[#0a0a0a] rounded-[40px] border border-white/5">
                  <p className="text-gray-500 italic">Henüz güncel tahmin bulunmuyor.</p>
                </div>
              ) : (
                predictions.map((pred, idx) => (
                  <motion.div 
                    key={pred.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (idx % 2) * 0.1 }}
                    onClick={() => navigate(`/tahmin/${pred.slug}`)}
                    className="bg-[#0a0a0a] rounded-[40px] p-6 border border-white/5 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center group cursor-pointer hover:border-[#ffcc00]/30 transition-all relative overflow-hidden"
                  >
                    {!pred.isPublic && !isVip && pred.visibility !== 'sample' && pred.visibility !== 'public' && (
                      <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-20 flex items-center justify-center p-6 text-center">
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-[#ffcc00]/10 rounded-full flex items-center justify-center mb-4">
                               <Lock size={32} className="text-[#ffcc00]" />
                            </div>
                            <span className="text-sm font-black uppercase tracking-[0.3em] text-[#ffcc00] mb-2">VIP ÖZEL İÇERİK</span>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Bu kuponu görmek için VIP üye olmalısınız.</p>
                          </div>
                      </div>
                    )}

                    {/* Ribbon Badge */}
                    {(pred.badge || pred.couponType) && (
                       <div className="absolute top-0 right-0 z-10">
                          <div className="bg-[#ffcc00] text-black text-[9px] font-black px-4 py-1 uppercase tracking-widest -rotate-0 rounded-bl-2xl shadow-xl">
                             {pred.badge || (pred.couponType === 'aggressive' ? 'AGRESİF' : pred.couponType === 'economic' ? 'EKONOMİK' : 'STANDART')}
                          </div>
                       </div>
                    )}

                    <div className="w-full sm:w-1/3 overflow-hidden rounded-[30px] mb-4 sm:mb-0 sm:mr-8 relative aspect-square shadow-2xl">
                      <img 
                        src={pred.image || 'https://picsum.photos/seed/horse/300/300'} 
                        alt={pred.authorName || 'ALTILIYAKALATANADAM'} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-40" />
                      
                      {/* Track Tag on Image */}
                      <div className="absolute bottom-4 left-4 flex items-center space-x-2">
                         <div className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                            <span className="text-[8px] font-black uppercase text-[#ffcc00] tracking-widest">{pred.track}</span>
                         </div>
                      </div>
                    </div>

                    <div className="w-full sm:w-2/3 flex flex-col justify-center">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2 text-[8px] font-black uppercase text-gray-500 tracking-widest">
                          <Calendar size={10} className="text-[#ffcc00]" />
                          <span>{pred.raceDate}</span>
                        </div>
                        <div className="flex items-center space-x-1 bg-[#ffcc00]/10 px-2 py-1 rounded-lg border border-[#ffcc00]/20">
                           <Star size={10} className="text-[#ffcc00] fill-[#ffcc00]" />
                           <span className="text-[9px] font-black text-[#ffcc00]">%{pred.confidenceScore || 85}</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-black italic mb-2 leading-tight tracking-tight group-hover:text-[#ffcc00] transition-colors uppercase">
                        {pred.title}
                      </h3>
                      
                      <div className="flex items-center space-x-2 mb-6">
                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                          pred.couponType === 'aggressive' ? 'bg-red-500/20 text-red-500' :
                          pred.couponType === 'economic' ? 'bg-green-500/20 text-green-500' :
                          'bg-[#ffcc00]/20 text-[#ffcc00]'
                        }`}>
                          {pred.couponType === 'aggressive' ? 'Agresif' : pred.couponType === 'economic' ? 'Ekonomik' : 'Standart'} KUPON
                        </span>
                        <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">•</span>
                        <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">{pred.priceLabel || 'Orta Risk'}</span>
                      </div>

                      {pred.ayaklar && pred.ayaklar.length > 0 && (
                        <div className="mb-6 flex flex-wrap gap-2">
                           {pred.ayaklar.slice(0, 6).map((a: any, i: number) => {
                             const horseInfo = typeof a === 'object' ? a.horses : a;
                             return (
                               <div key={i} className="bg-white/5 border border-white/5 px-2 py-1 rounded-lg flex items-center space-x-1">
                                 <span className="text-[7px] font-black text-[#ffcc00] uppercase">{i + 1}.A:</span>
                                 <span className="text-[9px] font-bold text-gray-400 truncate max-w-[40px] uppercase">{horseInfo || '?'}</span>
                               </div>
                             );
                           })}
                        </div>
                      )}

                      <div className="flex items-center justify-between border-t border-white/5 pt-4">
                        <div className="flex flex-col">
                           <span className="text-xs font-black italic uppercase tracking-tight">{pred.authorName || 'ALTILIYAKALATANADAM'}</span>
                           <span className="text-[8px] text-gray-500 uppercase font-bold tracking-tight">Yarış Yazarı</span>
                        </div>
                        <div className="flex items-center space-x-1 text-[10px] font-black text-gray-400">
                           <Eye size={12} />
                           <span>{pred.views || 0}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
