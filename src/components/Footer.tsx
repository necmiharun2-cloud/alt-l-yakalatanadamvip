/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Facebook, Twitter, Youtube, Instagram, Star, CreditCard, Send, Apple, Smartphone, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#000000] pt-24 pb-12 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          {/* Column 1: ALTILIYAKALATANADAM */}
          <div>
            <h4 className="text-xl font-black text-white italic mb-8 border-b-2 border-[#ff0000] inline-block pb-2 pr-4">ALTILIYAKALATANADAM</h4>
            <ul className="space-y-4">
              <li><Link to="/kurumsal/hakkimizda" className="text-gray-500 hover:text-white transition-colors text-sm font-bold">Hakkında</Link></li>
              <li><Link to="/tahminler" className="text-gray-500 hover:text-white transition-colors text-sm font-bold">Güncel Tahminler</Link></li>
              <li><Link to="/basarili-tahminler" className="text-gray-500 hover:text-white transition-colors text-sm font-bold">Başarılı Tahminler</Link></li>
              <li><Link to="/blog" className="text-gray-500 hover:text-white transition-colors text-sm font-bold">Blog</Link></li>
            </ul>
          </div>

          {/* Column 2: Destek */}
          <div>
            <h4 className="text-xl font-black text-white italic mb-8 border-b-2 border-[#ff0000] inline-block pb-2 pr-4">Destek</h4>
            <ul className="space-y-4">
              <li><Link to="/vip" className="text-gray-500 hover:text-white transition-colors text-sm font-bold">Nasıl Vip Üye Olurum?</Link></li>
              <li><Link to="/kurumsal/reklam" className="text-gray-500 hover:text-white transition-colors text-sm font-bold">Reklam</Link></li>
              <li><Link to="/kurumsal/yardim" className="text-gray-500 hover:text-white transition-colors text-sm font-bold">Yardım</Link></li>
              <li><Link to="/iletisim" className="text-gray-500 hover:text-white transition-colors text-sm font-bold">İletişim</Link></li>
            </ul>
          </div>

          {/* Column 3: Üyelik */}
          <div>
            <h4 className="text-xl font-black text-white italic mb-8 border-b-2 border-[#ff0000] inline-block pb-2 pr-4">Üyelik</h4>
            <div className="space-y-6">
              <Link to="/vip" className="flex items-start space-x-4 bg-white/5 p-4 rounded-xl border border-white/5 hover:border-[#ff0000] transition-all group">
                <Star size={20} className="text-[#ff0000] group-hover:scale-125 transition-transform" />
                <div className="flex flex-col">
                  <span className="text-white text-sm font-black italic">Vip Üyelik</span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Hemen Üye Olun</span>
                </div>
              </Link>
              <Link to="/odeme-bildirimi" className="flex items-start space-x-4 bg-white/5 p-4 rounded-xl border border-white/5 hover:border-[#ff0000] transition-all group">
                <CreditCard size={20} className="text-[#ff0000] group-hover:scale-125 transition-transform" />
                <div className="flex flex-col">
                  <span className="text-white text-sm font-black italic">Ödeme Bildirimi</span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Formu Doldurun</span>
                </div>
              </Link>
              <a href="https://wa.me/905336711463" target="_blank" rel="noreferrer" className="flex items-start space-x-4 bg-white/5 p-4 rounded-xl border border-white/5 hover:border-[#ff0000] transition-all group">
                <Send size={20} className="text-[#ff0000] group-hover:scale-125 transition-transform" />
                <div className="flex flex-col">
                  <span className="text-white text-sm font-black italic">WhatsApp Destek</span>
                  <span className="text-[10px] text-gray-500 font-bold tracking-tight">90 533 671 14 63</span>
                </div>
              </a>
            </div>
          </div>

          {/* Column 4: Sosyal Medya */}
          <div>
            <h4 className="text-xl font-black text-white italic mb-8 border-b-2 border-[#ff0000] inline-block pb-2 pr-4">Sosyal Medya</h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className="flex items-center space-x-4 text-gray-500 hover:text-white transition-colors group">
                  <Facebook size={18} className="group-hover:text-[#ff0000]" />
                  <span className="text-sm font-bold">Facebook</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-4 text-gray-500 hover:text-white transition-colors group">
                  <Twitter size={18} className="group-hover:text-[#ff0000]" />
                  <span className="text-sm font-bold">Twitter</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-4 text-gray-500 hover:text-white transition-colors group">
                  <Youtube size={18} className="group-hover:text-[#ff0000]" />
                  <span className="text-sm font-bold">Youtube</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-4 text-gray-500 hover:text-white transition-colors group">
                  <Instagram size={18} className="group-hover:text-[#ff0000]" />
                  <span className="text-sm font-bold">Instagram</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Branding & Stores */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-white/5 space-y-8 md:space-y-0">
          <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest text-center md:text-left">
            Copyright © 2026 Tüm hakları saklıdır ALTILIYAKALATANADAM.com
          </p>
          
          <div className="flex items-center space-x-6">
            <a href="#" className="flex items-center space-x-2 grayscale hover:grayscale-0 transition-all opacity-50 hover:opacity-100">
              <Apple size={24} className="text-white" />
              <div className="flex flex-col leading-tight">
                <span className="text-[6px] font-bold text-gray-400">Download on the</span>
                <span className="text-xs font-black text-white tracking-tighter">App Store</span>
              </div>
            </a>
            <a href="#" className="flex items-center space-x-2 grayscale hover:grayscale-0 transition-all opacity-50 hover:opacity-100">
              <Smartphone size={24} className="text-white" />
              <div className="flex flex-col leading-tight">
                <span className="text-[6px] font-bold text-gray-400">GET IT ON</span>
                <span className="text-xs font-black text-white tracking-tighter">Google Play</span>
              </div>
            </a>
          </div>
        </div>

        {/* Legal Links */}
        <div className="mt-12 flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-4 text-[10px] font-black uppercase text-gray-600 tracking-widest">
          <Link to="/yasal/kvkk-politikasi-10" className="hover:text-white transition-colors">KVKK Politikası</Link>
          <Link to="/yasal/gizlilik-ilkesi-6" className="hover:text-white transition-colors">Gizlilik İlkeleri</Link>
          <Link to="/yasal/iade-sartlari-7" className="hover:text-white transition-colors">İade Şartları</Link>
          <Link to="/yasal/kullanim-kosullari-8" className="hover:text-white transition-colors">Kullanım Koşulları</Link>
          <Link to="/yasal/satis-sozlesmesi-9" className="hover:text-white transition-colors">Satış Sözleşmesi</Link>
        </div>
      </div>

      {/* Scroll to Top */}
      <button 
        onClick={scrollToTop}
        className="absolute bottom-8 right-8 bg-[#ff0000] hover:bg-white text-white hover:text-black p-3 rounded-xl shadow-2xl transition-all transform hover:-translate-y-2 group"
      >
        <ArrowUp size={20} className="group-hover:animate-bounce" />
      </button>
    </footer>
  );
}
