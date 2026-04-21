import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'motion/react';
import { Clock, Users, Star, Mic } from 'lucide-react';

export default function Biography() {
  return (
    <div className="min-h-screen bg-[#010a26] text-white">
      <Header />
      
      <main className="max-w-6xl mx-auto py-20 px-4 pt-32 pb-32">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#020f3a] rounded-[40px] border border-white/10 overflow-hidden shadow-2xl relative"
        >
          {/* Background Decorative Element */}
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#ffcc00]/5 to-transparent"></div>
          
          <div className="relative z-10 p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
            
            {/* Photo Side */}
            <div className="w-full lg:w-1/3 flex justify-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-[40px] border-4 border-[#ffcc00] p-2 shadow-[0_0_40px_rgba(255,204,0,0.2)] rotate-3 hover:rotate-0 transition-transform duration-500 bg-black/50">
                <div className="w-full h-full rounded-[30px] overflow-hidden bg-black relative">
                  <img 
                    src="https://cdn.resimupload.org/2026/04/21/e222fecb-3ebb-4f1b-8cdb-b96b4c938aa8.jpg" 
                    alt="Can Polat - Altılı Yakalatan Adam" 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                </div>
                
                {/* Years Badge */}
                <div className="absolute -bottom-6 -right-6 bg-black border-2 border-[#ffcc00] w-24 h-24 rounded-full flex flex-col items-center justify-center text-[#ffcc00] shadow-xl transform -rotate-12">
                  <span className="text-3xl font-black leading-none">10</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Yıllık</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Tecrübe</span>
                </div>
              </div>
            </div>

            {/* Text Side */}
            <div className="w-full lg:w-2/3">
              <div className="inline-block px-5 py-2 rounded-full bg-[#ffcc00]/10 text-[#ffcc00] border border-[#ffcc00]/20 font-bold text-sm tracking-widest uppercase mb-6 shadow-inner">
                Yarış Yazarı & Analisti
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white mb-4">
                Can POLAT
              </h1>
              <h2 className="text-xl md:text-2xl font-black text-gray-400 mb-10 tracking-tight flex items-center gap-3">
                <span className="w-10 h-[2px] bg-gray-600 block"></span>
                Nam-ı Diğer: <span className="text-[#ffcc00]">"Altılı Yakalatan Adam"</span>
              </h2>

              <div className="space-y-6 text-base md:text-lg text-gray-300 leading-relaxed font-medium">
                <p>
                  <strong>2015 Haziran</strong> ayında yarış yazarlığına başlayan ve İzmir'de ikamet eden Can Polat, 
                  at yarışı camiasında ve sosyal medya platformlarında yıllardır <strong>"Altılı Yakalatan Adam"</strong> olarak anılmaktadır.
                </p>
                <p>
                  İnsanlara faydalı olmak ilkesiyle yola çıkan Polat, hem sosyal medya mecralarındaki anlık paylaşımları 
                  hem de düzenlediği interaktif <strong>canlı yayınlardaki</strong> detaylı yarış anlatımları ve uzun uzadıya 
                  yaptığı analitik yorumlarla takipçilerine yıllardır rehberlik etmektedir.
                </p>
                <p>
                  Önümüzdeki <strong>Haziran 2026</strong> itibarıyla yarış yazarlığındaki <strong className="text-[#ffcc00]">11. senesine</strong> girecek olan tecrübeli uzman; 
                  aktif olarak sosyal medya hesaplarında, özel WhatsApp VIP gruplarında ve 
                  <strong className="text-[#ffcc00] mx-1">ALTILIYAKALATANADAM.com</strong> 
                  resmi internet sitesi üzerinden profesyonel hizmetlerini hız kesmeden sürdürmektedir.
                </p>
              </div>
              
              {/* Highlight Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                <div className="bg-[#010a26] rounded-2xl p-4 border border-white/5 flex flex-col items-center text-center group hover:border-[#ffcc00]/50 transition-colors shadow-lg">
                  <Clock className="w-8 h-8 text-[#ffcc00] mb-3 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] uppercase text-gray-400 tracking-widest font-bold">Kariyer</span>
                  <span className="text-lg font-black text-white mt-1">2015'ten Beri</span>
                </div>
                <div className="bg-[#010a26] rounded-2xl p-4 border border-white/5 flex flex-col items-center text-center group hover:border-[#ffcc00]/50 transition-colors shadow-lg">
                  <Mic className="w-8 h-8 text-[#ffcc00] mb-3 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] uppercase text-gray-400 tracking-widest font-bold">Etkileşim</span>
                  <span className="text-lg font-black text-white mt-1">Canlı Yayınlar</span>
                </div>
                <div className="bg-[#010a26] rounded-2xl p-4 border border-white/5 flex flex-col items-center text-center group hover:border-[#ffcc00]/50 transition-colors shadow-lg">
                  <Users className="w-8 h-8 text-[#ffcc00] mb-3 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] uppercase text-gray-400 tracking-widest font-bold">Topluluk</span>
                  <span className="text-lg font-black text-white mt-1">VIP Gruplar</span>
                </div>
                <div className="bg-[#010a26] rounded-2xl p-4 border border-white/5 flex flex-col items-center text-center group hover:border-[#ffcc00]/50 transition-colors shadow-lg">
                  <Star className="w-8 h-8 text-[#ffcc00] mb-3 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] uppercase text-gray-400 tracking-widest font-bold">Unvan</span>
                  <span className="text-lg font-black text-[#ffcc00] mt-1 italic">Yakalatan</span>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
}
