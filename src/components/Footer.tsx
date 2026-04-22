/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Facebook, Twitter, Youtube, Instagram, Star, CreditCard, Send, Apple, Smartphone, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { APP_LOGO_URL } from '../constants';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#010a26] relative border-t border-white/5">
      {/* Top Navy Section (Main Content) */}
      <div className="bg-[#010a26] pt-12 pb-12 px-4 shadow-inner">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-white">
            {/* Column 1: ALTILIYAKALATANADAM */}
            <div className="bg-white/5 p-8 rounded-[32px] border border-white/5 flex flex-col">
              <h4 className="text-lg font-black text-[#ffcc00] italic mb-8 border-b-2 border-[#ffcc00]/20 inline-block pb-2 pr-4 uppercase">ALTILIYAKALATANADAM</h4>
              <ul className="space-y-4">
                <li><Link to="/kurumsal/hakkimizda" className="text-white/60 hover:text-white transition-colors text-xs font-black uppercase">Hakkında</Link></li>
                <li><Link to="/tahminler" className="text-white/60 hover:text-white transition-colors text-xs font-black uppercase">Güncel Tahminler</Link></li>
                <li><Link to="/basarili-tahminler" className="text-white/60 hover:text-white transition-colors text-xs font-black uppercase">Başarılı Tahminler</Link></li>
                <li><Link to="/blog" className="text-white/60 hover:text-white transition-colors text-xs font-black uppercase">Blog</Link></li>
              </ul>
            </div>

            {/* Column 2: Destek */}
            <div className="bg-white/5 p-8 rounded-[32px] border border-white/5 flex flex-col">
              <h4 className="text-lg font-black text-[#ffcc00] italic mb-8 border-b-2 border-[#ffcc00]/20 inline-block pb-2 pr-4 uppercase">Destek</h4>
              <ul className="space-y-4">
                <li><Link to="/vip" className="text-white/60 hover:text-white transition-colors text-xs font-black uppercase">Nasıl Vip Üye Olurum?</Link></li>
                <li><Link to="/kurumsal/reklam" className="text-white/60 hover:text-white transition-colors text-xs font-black uppercase">Reklam</Link></li>
                <li><Link to="/kurumsal/yardim" className="text-white/60 hover:text-white transition-colors text-xs font-black uppercase">Yardım</Link></li>
                <li><Link to="/iletisim" className="text-white/60 hover:text-white transition-colors text-xs font-black uppercase">İletişim</Link></li>
                <li>
                  <a href="https://wa.me/905336711463" target="_blank" rel="noreferrer" className="flex items-center space-x-4 text-white/60 hover:text-white transition-colors group">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-5 h-5 group-hover:scale-110 transition-all" referrerPolicy="no-referrer" />
                    <span className="text-xs font-black uppercase">WhatsApp Destek</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Üyelik */}
            <div className="bg-white/5 p-8 rounded-[32px] border border-white/5 flex flex-col">
              <h4 className="text-lg font-black text-[#ffcc00] italic mb-8 border-b-2 border-[#ffcc00]/20 inline-block pb-2 pr-4 uppercase">Üyelik</h4>
              <div className="space-y-4">
                <Link to="/vip" className="flex items-start space-x-3 bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group">
                  <Star size={16} className="text-[#ffcc00] group-hover:scale-125 transition-transform" />
                  <div className="flex flex-col">
                    <span className="text-white text-xs font-black italic">Vip Üyelik</span>
                    <span className="text-[9px] text-white/60 font-bold uppercase tracking-tight">Hemen Üye Olun</span>
                  </div>
                </Link>
                <Link to="/odeme-bildirimi" className="flex items-start space-x-3 bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group">
                  <CreditCard size={16} className="text-[#ffcc00] group-hover:scale-125 transition-transform" />
                  <div className="flex flex-col">
                    <span className="text-white text-xs font-black italic">Ödeme Bildirimi</span>
                    <span className="text-[10px] text-white/60 font-bold uppercase tracking-tight">Formu Doldurun</span>
                  </div>
                </Link>
                <a href="https://wa.me/905336711463" target="_blank" rel="noreferrer" className="flex items-start space-x-3 bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-5 h-5 group-hover:scale-125 transition-transform" referrerPolicy="no-referrer" />
                  <div className="flex flex-col">
                    <span className="text-white text-xs font-black italic">WhatsApp Destek</span>
                    <span className="text-[10px] text-white/60 font-bold tracking-tight">90 533 671 14 63</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Column 4: Sosyal Medya */}
            <div className="bg-white/5 p-8 rounded-[32px] border border-white/5 flex flex-col">
              <h4 className="text-lg font-black text-[#ffcc00] italic mb-8 border-b-2 border-[#ffcc00]/20 inline-block pb-2 pr-4 uppercase">Sosyal Medya</h4>
              <ul className="space-y-4">
                <li>
                  <a href="https://www.facebook.com/share/1FtoneYKcR/?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="flex items-center space-x-4 text-white/60 hover:text-white transition-colors group">
                    <Facebook size={18} className="group-hover:scale-110 transition-all text-[#1877F2]" />
                    <span className="text-xs font-black uppercase">Facebook</span>
                  </a>
                </li>
                <li>
                  <a href="https://x.com/aya_canpolat?s=11&t=pi0jHu5kSA-MgDWBDRCMBg" target="_blank" rel="noreferrer" className="flex items-center space-x-4 text-white/60 hover:text-white transition-colors group">
                    <Twitter size={18} className="group-hover:scale-110 transition-all text-white" />
                    <span className="text-xs font-black uppercase">Twitter</span>
                  </a>
                </li>
                <li>
                  <a href="https://youtube.com/@altiliyakalatanadamcanpolat?si=kjTRAmnEweAjkpyk" target="_blank" rel="noreferrer" className="flex items-center space-x-4 text-white/60 hover:text-white transition-colors group">
                    <Youtube size={18} className="group-hover:scale-110 transition-all text-[#FF0000]" />
                    <span className="text-xs font-black uppercase">Youtube</span>
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/altiliyakalatanadam?igsh=Z3E0OWxndjVnYjUx&utm_source=qr" target="_blank" rel="noreferrer" className="flex items-center space-x-4 text-white/60 hover:text-white transition-colors group">
                    <Instagram size={18} className="group-hover:scale-110 transition-all text-[#ee2a7b]" />
                    <span className="text-xs font-black uppercase">Instagram</span>
                  </a>
                </li>
                <li>
                  <a href="https://whatsapp.com/channel/0029Vb74jmJEquiXSAHseL2Y" target="_blank" rel="noreferrer" className="flex items-center space-x-4 text-white/60 hover:text-white transition-colors group">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp Channel" className="w-5 h-5 group-hover:scale-110 transition-all" referrerPolicy="no-referrer" />
                    <span className="text-xs font-black uppercase">WhatsApp Kanalı</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-[2px] bg-gradient-to-r from-[#010a26] via-[#ffcc00] to-[#010a26] opacity-30"></div>

      {/* Bottom Dark Section (Copyright & Stores) */}
      <div className="bg-[#010a26] py-12 px-4 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 text-white/50">
            <div className="flex items-center space-x-4">
              <div className="relative w-16 h-16 rounded-full p-[2px] overflow-hidden flex items-center justify-center bg-white/10">
                {/* Subtle Rotating Neon Overlay */}
                <div className="absolute w-[200%] h-[200%] bg-[conic-gradient(transparent,#ffcc00,#ff3300,#00ffcc,transparent_30%)] animate-neon-rotate opacity-50"></div>
                
                {/* Image Container */}
                <div className="relative z-10 w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                  <img 
                    src={APP_LOGO_URL} 
                    alt="Logo" 
                    className="w-[80%] h-[80%] object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-center md:text-left text-white/40">
                Copyright © 2026 Tüm hakları saklıdır ALTILIYAKALATANADAM.com
              </p>
            </div>
            
            <div className="flex items-center space-x-6">
              <a href="#" className="flex items-center space-x-2 grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100">
                <Apple size={24} className="text-white" />
                <div className="flex flex-col leading-tight">
                  <span className="text-[6px] font-bold text-gray-500">Download on the</span>
                  <span className="text-xs font-black text-white tracking-tighter">App Store</span>
                </div>
              </a>
              <a href="#" className="flex items-center space-x-2 grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100">
                <Smartphone size={24} className="text-white" />
                <div className="flex flex-col leading-tight">
                  <span className="text-[6px] font-bold text-gray-500">GET IT ON</span>
                  <span className="text-xs font-black text-white tracking-tighter">Google Play</span>
                </div>
              </a>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-4 text-[10px] font-black uppercase text-white/30 tracking-widest">
            <Link to="/yasal/kvkk-politikasi-10" className="hover:text-[#ffcc00] transition-colors">KVKK Politikası</Link>
            <Link to="/yasal/gizlilik-ilkesi-6" className="hover:text-[#ffcc00] transition-colors">Gizlilik İlkeleri</Link>
            <Link to="/yasal/iade-sartlari-7" className="hover:text-[#ffcc00] transition-colors">İade Şartları</Link>
            <Link to="/yasal/kullanim-kosullari-8" className="hover:text-[#ffcc00] transition-colors">Kullanım Koşulları</Link>
            <Link to="/yasal/satis-sozlesmesi-9" className="hover:text-[#ffcc00] transition-colors">Satış Sözleşmesi</Link>
          </div>
        </div>
      </div>

      {/* Scroll to Top */}
      <button 
        onClick={scrollToTop}
        className="absolute bottom-8 right-8 bg-[#ffcc00] text-black hover:bg-white p-3 rounded-xl shadow-2xl transition-all transform hover:-translate-y-2 group z-30"
      >
        <ArrowUp size={20} className="group-hover:animate-bounce" />
      </button>
    </footer>
  );
}
