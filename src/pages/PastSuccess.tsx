/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'motion/react';
import { ChevronRight, ChevronLeft, Calendar, User, Trophy } from 'lucide-react';
import { dbService } from '../services/dbService';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../lib/utils';

export default function PastSuccess() {
  const { profile } = useAuth();
  const [successList, setSuccessList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuccess = async () => {
      try {
        const data = await dbService.getPredictions('success', profile?.role || 'user', profile?.isVip || false);
        setSuccessList(data);
      } catch (err) {
        console.error('Error fetching success list:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSuccess();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Header />
      
      <main>
        {/* Banner with Breadcrumb */}
        <section className="relative h-[250px] overflow-hidden flex items-center px-4">
          <div className="absolute inset-0 bg-[#000000] opacity-80 z-10" />
          <img 
            src="https://picsum.photos/seed/race1/1920/600" 
            alt="Race" 
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="max-w-7xl mx-auto w-full relative z-20">
            <div className="flex items-center space-x-3 text-xs font-bold uppercase tracking-widest text-[#ffcc00]">
              <span>Anasayfa</span>
              <ChevronRight size={14} />
              <span className="text-gray-400">Kupon Arşivi (Kazananlar)</span>
            </div>
          </div>
        </section>

        {/* Stats & Title Section */}
        <section className="max-w-7xl mx-auto py-16 px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12">
            <div className="border-l-4 border-[#ffcc00] pl-8">
              <h1 className="text-5xl font-black italic tracking-tighter">
                Kazananlar <span className="text-gray-400">Arşivi</span>
              </h1>
            </div>
            <div className="bg-[#222222]/50 border border-white/5 rounded-3xl p-8 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-12 mt-8 md:mt-0 shadow-2xl relative overflow-hidden group hover:border-[#ffcc00]/20 transition-all">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Trophy size={60} className="text-[#ffcc00]" />
               </div>
               <div className="flex flex-col text-center md:text-left relative z-10">
                  <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Toplam İkramiye</span>
                  <span className="text-2xl font-black text-[#ffcc00]">6.177.230,75 TL</span>
               </div>
               <div className="w-px h-12 bg-white/10 hidden md:block" />
               <div className="flex flex-col text-center md:text-left relative z-10">
                  <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Kazanma Oranı</span>
                  <span className="text-2xl font-black text-green-500">%89.4</span>
               </div>
            </div>
          </div>

          {loading ? (
             <div className="flex justify-center items-center py-20">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ffcc00]"></div>
             </div>
          ) : (
            <>
              {/* Full Width Table */}
              <div className="bg-[#0a0a0a] rounded-[40px] border border-white/5 overflow-hidden shadow-3xl">
                <div className="grid grid-cols-4 bg-[#111111] p-6 text-[10px] font-black uppercase tracking-[0.3em] text-[#ffcc00] border-b border-white/5">
                  <div className="flex items-center space-x-2"><Calendar size={12} /><span>TARİH / YARIŞ</span></div>
                  <div className="flex items-center space-x-2"><User size={12} /><span>YAZAR</span></div>
                  <div className="flex items-center space-x-2"><Trophy size={12} /><span>KAVRAM / KUPON</span></div>
                  <div className="text-right">İKRAMİYE</div>
                </div>
                
                <div className="divide-y divide-white/5">
                  {successList.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 italic">Henüz arşivlenmiş başarılı kupon bulunmuyor.</div>
                  ) : (
                    successList.map((item, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="grid grid-cols-4 p-8 hover:bg-[#ffcc00]/5 transition-all group cursor-default"
                      >
                        <div className="flex flex-col">
                           <span className="text-gray-300 font-black text-xs uppercase tracking-widest mb-1">{formatDate(item.createdAt, { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                           <span className="text-[9px] text-[#ffcc00] font-black uppercase">{item.track || 'Genel'}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                             <img src="https://i.pravatar.cc/100?u=altili" alt="ALTILIYAKALATANADAM" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                          </div>
                          <span className="text-white font-black italic text-xs uppercase group-hover:text-[#ffcc00] transition-colors">ALTILIYAKALATANADAM</span>
                        </div>
                        <div className="flex flex-col justify-center">
                          <span className="text-white font-black italic text-sm group-hover:text-[#ffcc00] transition-colors line-clamp-1 uppercase tracking-tight">{item.title}</span>
                          <div className="flex items-center mt-1">
                             {item.resultStatus === 'won' && (
                               <span className="bg-green-500 text-black text-[7px] font-black uppercase px-2 py-0.5 rounded-full mr-2">KAZANDI</span>
                             )}
                             {item.resultStatus === 'partial' && (
                               <span className="bg-orange-500 text-black text-[7px] font-black uppercase px-2 py-0.5 rounded-full mr-2">KISMİ</span>
                             )}
                             <span className="text-[8px] text-gray-500 font-bold uppercase">{item.couponType === 'aggressive' ? 'Agresif' : item.couponType === 'economic' ? 'Ekonomik' : 'Standart'} Kupon</span>
                          </div>
                        </div>
                        <div className="text-right flex flex-col justify-center items-end">
                           <span className="text-[#ffcc00] font-black text-2xl italic tracking-tighter leading-none">{item.winnings || '0,00 TL'}</span>
                           <span className="text-[8px] text-gray-500 font-bold uppercase mt-1">Net Ödeme</span>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
