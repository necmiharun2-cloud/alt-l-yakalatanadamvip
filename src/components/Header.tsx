/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Mail, LayoutGrid, LogIn, UserPlus, CreditCard, ChevronDown, User, Star, MessageSquare, LogOut, Settings, Tv, Menu, X, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

const getDaysRemaining = (expiryStr?: string) => {
  if (!expiryStr) return null;
  const days = Math.ceil((new Date(expiryStr).getTime() - new Date().getTime()) / 86400000);
  return days > 0 ? days : 0;
};

export default function Header() {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Güncel Tahminler', path: '/tahminler' },
    { label: 'Başarılı Tahminler', path: '/basarili-tahminler' },
    { label: 'Nasıl Vip Üye Olurum?', path: '/vip' },
    { label: 'Blog', path: '/blog' },
    { label: 'İletişim', path: '/iletisim' }
  ];

  return (
    <header className="w-full flex flex-col font-sans">
      {/* Top Bar */}
      <div className="bg-[#000000] text-gray-400 text-[10px] md:text-xs py-2 px-4 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <div className="flex items-center space-x-4 md:space-x-6">
            <a href="mailto:bilgi@ALTILIYAKALATANADAM.com" className="flex items-center space-x-2 hover:text-white transition-colors">
              <Mail size={12} className="text-[#ff0000]" />
              <span className="hidden sm:inline">bilgi@ALTILIYAKALATANADAM.com</span>
              <span className="sm:hidden">E-Posta</span>
            </a>
            <div className="flex items-center space-x-2 cursor-pointer hover:text-white transition-colors group">
              <LayoutGrid size={12} className="text-[#ff0000]" />
              <span>Diğer Sitelerimiz</span>
              <ChevronDown size={10} className="group-hover:translate-y-0.5 transition-transform" />
            </div>
          </div>
          
          <div className="flex items-center space-x-4 md:space-x-6 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-hide min-h-[24px]">
            {loading ? (
              <div className="flex items-center space-x-4 animate-pulse opacity-50">
                <div className="h-4 w-16 bg-gray-700 rounded"></div>
                <div className="h-4 w-16 bg-gray-700 rounded"></div>
              </div>
            ) : !user ? (
              <>
                <Link to="/giris-yap" className="flex items-center space-x-2 hover:text-white transition-colors whitespace-nowrap">
                  <LogIn size={12} className="text-[#ff0000]" />
                  <span>Giriş Yap</span>
                </Link>
                <Link to="/kayit-ol" className="flex items-center space-x-2 hover:text-white transition-colors whitespace-nowrap">
                  <UserPlus size={12} className="text-[#ff0000]" />
                  <span>Üye Ol</span>
                </Link>
                <Link to="/odeme-bildirimi" className="flex items-center space-x-2 hover:text-white transition-colors whitespace-nowrap">
                  <CreditCard size={12} className="text-[#ff0000]" />
                  <span>Ödeme Bildirimi</span>
                </Link>
              </>
            ) : (
              <>
                {profile?.isVip && profile?.vipExpiry && getDaysRemaining(profile.vipExpiry) !== null && (
                  <div className="flex items-center space-x-1 px-2 py-0.5 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-500 rounded-full border border-yellow-500/30 mr-2">
                    <Star size={10} className="fill-yellow-500 animate-pulse" />
                    <span className="text-[10px] font-black tracking-widest whitespace-nowrap">VIP Kalan: {getDaysRemaining(profile.vipExpiry)} Gün</span>
                  </div>
                )}
                <div className="relative group cursor-pointer mr-2 pt-1 pb-1">
                  <Bell size={14} className="text-[#ff0000] hover:text-white transition-colors" />
                  <div className="absolute top-0 right-[-2px] w-2 h-2 bg-red-500 rounded-full animate-pulse blur-[1px]"></div>
                  <div className="absolute top-0 right-[-2px] w-2 h-2 bg-red-500 rounded-full"></div>
                  {/* Dropdown */}
                  <div className="absolute right-0 top-8 w-64 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2 pointer-events-none group-hover:pointer-events-auto">
                     <div className="text-[10px] font-black uppercase text-gray-500 mb-2 px-2 pt-1 border-b border-white/5 pb-2">Bildirimler</div>
                     <div className="space-y-1">
                        <div className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                          <div className="text-[10px] font-bold text-white">Yeni Tahmin Yayında</div>
                          <div className="text-[9px] text-gray-400 mt-1 line-clamp-1">Günün bankosu ve sürprizi eklendi!</div>
                        </div>
                     </div>
                  </div>
                </div>
                <Link to="/bilgilerim" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors whitespace-nowrap">
                  <User size={12} className="text-[#ff0000]" />
                  <span className="hidden sm:inline">Hoşgeldiniz: <span className="text-white font-bold">{profile?.fullName || user?.email}</span></span>
                  <span className="sm:hidden font-bold text-white">Profil</span>
                </Link>
                {profile?.role === 'admin' && (
                  <Link to="/admin" className="flex items-center space-x-2 hover:text-white transition-colors whitespace-nowrap">
                    <Settings size={12} className="text-[#ff0000]" />
                    <span>Admin</span>
                  </Link>
                )}
                {!profile?.isVip && (
                  <Link to="/vip" className="flex items-center space-x-2 hover:text-white transition-colors whitespace-nowrap">
                    <Star size={12} className="text-[#ff0000]" />
                    <span>VIP Satın Al</span>
                  </Link>
                )}
                <Link to="/odeme-bildirimi" className="flex items-center space-x-2 hover:text-white transition-colors whitespace-nowrap">
                  <CreditCard size={12} className="text-[#ff0000]" />
                  <span>Ödeme</span>
                </Link>
                <button 
                  onClick={signOut}
                  className="flex items-center space-x-2 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                >
                  <LogOut size={12} className="text-[#ff0000]" />
                  <span>Çıkış</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className={`px-4 sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#111111]/90 backdrop-blur-lg shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-2 border-b border-white/5' : 'bg-[#111111] py-4 shadow-2xl'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-[#ff0000] blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <svg width="32" height="32" viewBox="0 0 40 40" className="md:w-10 md:h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 5L10 15V35H30V15L20 5Z" fill="#ff0000" />
                <path d="M15 20L20 15L25 20L20 25L15 20Z" fill="#111111" />
                <path d="M20 10C20 10 15 15 15 20C15 25 20 30 20 30C20 30 25 25 25 20C25 15 20 10 20 10Z" fill="#ff0000" />
              </svg>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg md:text-2xl font-black text-white tracking-tighter">
                ALTILIYAKALATANADAM<span className="text-[#ff0000]">.com</span>
              </span>
              <span className="text-[7px] md:text-[8px] text-gray-500 uppercase tracking-widest font-bold">kazanmanın gidiş hattı</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex items-center space-x-8 text-sm font-bold text-white uppercase tracking-tight">
            {menuItems.map((item) => (
              <li key={item.label} className="relative group">
                <Link to={item.path} className="hover:text-[#ff0000] transition-colors relative z-10">
                  {item.label}
                </Link>
                <motion.div 
                  className="absolute -bottom-1 left-0 h-0.5 bg-[#ff0000] rounded-full"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                />
              </li>
            ))}
            
            <li className="relative group flex items-center ml-2">
              <Link to="/program" className="flex items-center space-x-2 text-[#0ff] hover:text-white transition-all drop-shadow-[0_0_8px_rgba(0,255,255,0.8)] border border-[#0ff]/30 px-3 py-1.5 rounded-full bg-[#0ff]/10 hover:bg-[#0ff]/20">
                <Tv size={16} className="animate-pulse" />
                <span className="font-black tracking-widest text-[10px]">YARIŞ PROGRAMLARI</span>
              </Link>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white hover:text-[#ff0000] transition-colors p-2"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-white/5 bg-[#111111] overflow-hidden"
            >
              <ul className="flex flex-col space-y-4 p-6 text-sm font-bold text-white uppercase tracking-tight">
                {menuItems.map((item) => (
                  <li key={item.label}>
                    <Link 
                      to={item.path} 
                      onClick={() => setMobileMenuOpen(false)}
                      className="block hover:text-[#ff0000] transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link 
                    to="/program"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 text-[#0ff] hover:text-white transition-all drop-shadow-[0_0_8px_rgba(0,255,255,0.8)] border border-[#0ff]/30 px-4 py-2 rounded-xl bg-[#0ff]/10 w-fit"
                  >
                    <Tv size={18} className="animate-pulse" />
                    <span className="font-black tracking-widest text-xs">YARIŞ PROGRAMLARI</span>
                  </Link>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
