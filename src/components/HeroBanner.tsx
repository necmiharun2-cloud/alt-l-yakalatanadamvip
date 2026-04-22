import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TRACKS = [
  'Diyarbakır', 'Urfa', 'Elazığ', 'Adana', 
  'Ankara', 'İzmir', 'İstanbul', 'Kocaeli', 'Antalya'
];

export default function HeroBanner() {
  const navigate = useNavigate();
  const [targetCities, setTargetCities] = useState<string[]>(['İstanbul', 'Elazığ']);
  const [tomorrowDate, setTomorrowDate] = useState<{ day: string, month: string }>({ day: '22', month: 'Nisan' });

  useEffect(() => {
    // Calculate tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const day = tomorrow.getDate().toString();
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    const month = months[tomorrow.getMonth()];
    
    setTomorrowDate({ day, month });

    // Pick 2 random unique tracks
    const shuffled = [...TRACKS].sort(() => 0.5 - Math.random());
    setTargetCities([shuffled[0], shuffled[1]]);
  }, []);

  return (
    <section className="relative w-full pt-32 pb-20 overflow-hidden bg-[#0a0a0a] flex items-center justify-center min-h-[90vh]">
      {/* Background with blur and dark gradient */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-60"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1598583492576-963d3fb4d257?q=80&w=1920&auto=format&fit=crop")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-transparent to-[#0a0a0a]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 w-full flex flex-col items-center text-center">
        
        {/* Top Questions */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4 mb-4"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black italic text-white tracking-tighter drop-shadow-2xl">
            Kim nasıl koşar ?
          </h1>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black italic text-white tracking-tighter drop-shadow-2xl opacity-90">
            Kim nasıl kazanır ?
          </h2>
          <h3 className="text-3xl md:text-5xl lg:text-6xl font-black italic text-[#ffcc00] tracking-tighter drop-shadow-2xl">
            Tuttuğunuz atın şansı nedir?
          </h3>
        </motion.div>

        {/* Neon Green Tagline */}
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8, delay: 0.4 }}
           className="mb-12"
        >
          <h4 className="text-3xl md:text-5xl font-black tracking-tight text-[#00ff00] drop-shadow-[0_0_8px_rgba(0,255,0,0.5)]" style={{ textShadow: '0 0 3px #00ff00, 0 0 8px rgba(0,255,0,0.5)' }}>
            Kazanmak herkesin hakkı !
          </h4>
        </motion.div>

        {/* Center Portrait (Resmim Ben) -> Using his image */}
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8, delay: 0.3 }}
           className="relative mb-8 group cursor-pointer"
           onClick={() => navigate('/vip')}
        >
          {/* Kimdir pulsing button */}
          <div 
             className="absolute -top-3 -right-3 md:-top-5 md:-right-5 z-50 flex h-16 w-16 md:h-20 md:w-20 items-center justify-center cursor-pointer hover:scale-110 transition-transform"
             onClick={(e) => {
                e.stopPropagation();
                navigate('/kimdir');
             }}
          >
             {/* The glowing pinging ring */}
             <div className="absolute inset-1 md:inset-2 rounded-full bg-[#ffcc00] animate-ping opacity-60"></div>
             
             {/* The actual button circle */}
             <div className="relative flex h-full w-full items-center justify-center rounded-full bg-[#0a1120] border-2 border-[#ffcc00] shadow-[0_0_15px_rgba(255,204,0,0.4)] overflow-hidden transition-all">
                <span className="text-[#ffcc00] font-black text-[11px] md:text-sm uppercase tracking-widest text-center leading-tight">
                  KİMDİR<br/>?
                </span>
             </div>
          </div>

          <div className="absolute inset-0 bg-[#ffcc00] rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-[#ffcc00]/50 p-2 relative z-10 overflow-hidden shadow-2xl">
             <div className="w-full h-full rounded-full overflow-hidden bg-black">
                <img 
                  src="https://cdn.resimupload.org/2026/04/21/e222fecb-3ebb-4f1b-8cdb-b96b4c938aa8.jpg" 
                  alt="Altılı Yakalatan Adam" 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                  referrerPolicy="no-referrer"
                />
             </div>
          </div>
          {/* Label under image */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#ffcc00] text-black px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest whitespace-nowrap shadow-xl">
            Altılı Yakalatan Adam
          </div>
        </motion.div>

        {/* Vip Üye Olun Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-16 mt-8"
        >
          <button 
            onClick={() => navigate('/vip')}
            className="text-2xl md:text-4xl font-black text-white hover:text-[#ffcc00] transition-colors flex flex-col items-center gap-2 group"
          >
            <span>Vip Üye olun</span>
            <span className="flex items-center gap-3">
              kazanmaya başlayın
              <ArrowRight className="w-6 h-6 md:w-8 md:h-8 text-[#ffcc00] group-hover:translate-x-2 transition-transform" />
            </span>
          </button>
        </motion.div>

        {/* Predictions Date */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div 
            onClick={() => navigate('/tahminler')}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 flex items-center justify-between group hover:bg-[#ffcc00]/10 hover:border-[#ffcc00]/30 transition-all cursor-pointer"
          >
             <div>
                <div className="text-[#ffcc00] font-black text-2xl md:text-3xl mb-1">{tomorrowDate.day}</div>
                <div className="text-gray-400 font-bold uppercase tracking-widest text-sm">{tomorrowDate.month}</div>
             </div>
             <div className="text-right">
                <div className="text-white font-black text-xl md:text-2xl italic">{targetCities[0]}</div>
                <div className="text-gray-400 font-medium text-sm">Tahminleri</div>
             </div>
          </div>

          <div 
            onClick={() => navigate('/tahminler')}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 flex items-center justify-between group hover:bg-[#ffcc00]/10 hover:border-[#ffcc00]/30 transition-all cursor-pointer"
          >
             <div>
                <div className="text-[#ffcc00] font-black text-2xl md:text-3xl mb-1">{tomorrowDate.day}</div>
                <div className="text-gray-400 font-bold uppercase tracking-widest text-sm">{tomorrowDate.month}</div>
             </div>
             <div className="text-right">
                <div className="text-white font-black text-xl md:text-2xl italic">{targetCities[1]}</div>
                <div className="text-gray-400 font-medium text-sm">Tahminleri</div>
             </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
