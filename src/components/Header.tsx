/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Mail, LayoutGrid, LogIn, UserPlus, CreditCard, ChevronDown, User, Star, MessageSquare, LogOut, Settings, Tv, Menu, X, Bell, HelpCircle, MessageCircle, Twitter, Instagram, Facebook, Youtube, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { APP_LOGO_URL } from '../constants';
import { useState, useEffect } from 'react';

const getDaysRemaining = (expiryStr?: string) => {
  if (!expiryStr) return null;
  const days = Math.ceil((new Date(expiryStr).getTime() - new Date().getTime()) / 86400000);
  return days > 0 ? days : 0;
};

export default function Header() {
  const { user, profile, loading, signOut, signIn } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [headerLoading, setHeaderLoading] = useState(false);

  const handleHeaderLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!loginEmail || !loginPass) {
      setLoginError('Bilgiler eksik.');
      return;
    }
    
    setHeaderLoading(true);
    setLoginError('');
    try {
      await signIn(loginEmail, loginPass, rememberMe);
      navigate('/bilgilerim');
    } catch (err: any) {
      setLoginError('Giriş başarısız. Bilgilerinizi kontrol ediniz.');
    } finally {
      setHeaderLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const menuItems = [
    { label: 'Güncel Tahminler', path: '/tahminler' },
    { label: 'Başarılı Tahminler', path: '/basarili-tahminler' },
    { label: 'Nasıl Vip Üye Olurum?', path: '/vip' },
    { label: 'Blog', path: '/blog' },
    { label: 'İletişim', path: '/iletisim' }
  ];

  return (
    <header className="w-full flex flex-col font-sans sticky top-0 z-50">
      {/* Nesine Style Top Bar */}
      <div className={`bg-[#010a26] py-2 px-2 md:px-4 border-b border-white/10 transition-all duration-300 ${scrolled ? 'shadow-md py-1' : ''}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Identity Section */}
          <div className="flex items-center space-x-1.5 md:space-x-3 min-w-0">
            {/* Logo Link */}
            <Link to="/" className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full p-[2px] overflow-hidden flex items-center justify-center bg-[#010a26] shadow-lg shadow-black/20 group shrink-0">
              {/* Rotating Neon Overlay */}
              <div className="absolute w-[200%] h-[200%] bg-[conic-gradient(transparent,#ffcc00,#ff3300,#00ffcc,transparent_30%)] animate-neon-rotate opacity-80"></div>
              
              {/* Image Container */}
              <div className="relative z-10 w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                <img 
                  src={APP_LOGO_URL} 
                  alt="ALTILIYAKALATANADAM Logo" 
                  className="w-[85%] h-[85%] object-contain group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
            </Link>

            <div className="flex flex-col">
              <div className="flex items-center space-x-1 md:space-x-2">
                <Link to="/" className="text-[10px] sm:text-base md:text-xl font-black text-white italic tracking-tighter uppercase leading-none hover:opacity-80 transition-opacity whitespace-nowrap">
                  ALTILIYAKALATAN<span className="text-white/60">ADAM</span>
                </Link>
                <div className="flex items-center space-x-1 shrink-0">
                  <a 
                    href="https://wa.me/905336711463" 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-1 rounded-full text-white hover:scale-110 transition-transform shadow-md"
                    title="WhatsApp"
                  >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-5 h-5 md:w-6 md:h-6" referrerPolicy="no-referrer" />
                  </a>
                  <div className="hidden sm:flex items-center space-x-1">
                    <a 
                      href="https://x.com/aya_canpolat?s=11&t=pi0jHu5kSA-MgDWBDRCMBg" 
                      target="_blank" 
                      rel="noreferrer"
                      className="bg-black p-1 rounded-full text-white hover:scale-110 transition-transform shadow-md border border-white/20"
                      title="X (Twitter)"
                    >
                      <Twitter size={14} fill="currentColor" />
                    </a>
                    <a 
                      href="https://www.instagram.com/altiliyakalatanadam?igsh=Z3E0OWxndjVnYjUx&utm_source=qr" 
                      target="_blank" 
                      rel="noreferrer"
                      className="bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] p-1 rounded-full text-white hover:scale-110 transition-transform shadow-md"
                      title="Instagram"
                    >
                      <Instagram size={14} />
                    </a>
                    <a 
                      href="https://www.facebook.com/share/1FtoneYKcR/?mibextid=wwXIfr" 
                      target="_blank" 
                      rel="noreferrer"
                      className="bg-[#1877F2] p-1 rounded-full text-white hover:scale-110 transition-transform shadow-md"
                      title="Facebook"
                    >
                      <Facebook size={14} fill="currentColor" />
                    </a>
                    <a 
                      href="https://youtube.com/@altiliyakalatanadamcanpolat?si=kjTRAmnEweAjkpyk" 
                      target="_blank" 
                      rel="noreferrer"
                      className="bg-[#FF0000] p-1 rounded-full text-white hover:scale-110 transition-transform shadow-md"
                      title="YouTube"
                    >
                      <Youtube size={14} fill="currentColor" />
                    </a>
                  </div>
                </div>
              </div>
              <Link to="/" className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mt-0.5 hidden sm:block hover:text-white/60 transition-colors">
                Türkiye'nin En İyisi
              </Link>
            </div>
          </div>

          {/* Right Section (Help, Login, Register) */}
          <div className="hidden lg:flex items-center space-x-3">
            {user && (
               <button 
                 onClick={() => alert('Henüz yeni bildiriminiz bulunmuyor.')}
                 className="relative p-2 text-[#ffcc00] hover:scale-110 transition-all mr-2 cursor-pointer"
               >
                 <Bell size={20} />
                 <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full border border-[#010a26]"></span>
               </button>
            )}
            {/* Yardım */}
            <Link to="/kurumsal/yardim" className="flex items-center space-x-1 text-white text-[11px] font-black uppercase tracking-tight hover:text-[#ffcc00] mr-2">
              <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center">
                <HelpCircle size={12} className="text-[#ffcc00]" />
              </div>
              <span className="uppercase">YARDIM</span>
            </Link>

             {!user ? (
                <div className="flex flex-col">
                  {loginError && <div className="text-red-500 text-[10px] font-bold mb-1 ml-1">{loginError}</div>}
                  <form onSubmit={handleHeaderLogin} className="flex items-center space-x-2">
                     {/* Pseudo Login Fields for Nesine Look */}
                     <div className="flex bg-white rounded-md border border-gray-300 overflow-hidden h-9">
                     <div className="flex items-center px-2 bg-gray-100 border-r border-gray-300">
                       <User size={14} className="text-gray-400" />
                     </div>
                     <input 
                       type="text" 
                       placeholder="E-posta veya Telefon No" 
                       value={loginEmail}
                       onChange={(e) => setLoginEmail(e.target.value)}
                       className="px-3 text-[10px] w-44 focus:outline-none text-black"
                     />
                   </div>
                   <div className="flex bg-white rounded-md border border-gray-300 overflow-hidden h-9">
                     <div className="flex items-center px-2 bg-gray-100 border-r border-gray-300">
                       <X size={14} className="text-gray-400" />
                     </div>
                     <input 
                       type="password" 
                       placeholder="Şifre" 
                       value={loginPass}
                       onChange={(e) => setLoginPass(e.target.value)}
                       className="px-3 text-[10px] w-24 focus:outline-none text-black"
                     />
                     <Link 
                       to="/giris-yap" 
                       state={{ showReset: true }}
                       className="bg-[#020f3a] text-white/70 text-[9px] px-2 font-bold hover:bg-[#ffcc00] hover:text-[#010a26] border-l border-white/10 transition-colors flex items-center"
                     >
                       Unuttum
                     </Link>
                   </div>
                   
                   <div className="flex items-center space-x-1 text-[10px] font-bold text-white/70 px-1">
                     <input 
                       type="checkbox" 
                       id="remember" 
                       checked={rememberMe}
                       onChange={(e) => setRememberMe(e.target.checked)}
                       className="w-3 h-3 border-white/20 bg-white/5 rounded" 
                     />
                     <label htmlFor="remember" className="cursor-pointer">Beni Hatırla</label>
                   </div>

                   <button 
                     type="submit"
                     disabled={headerLoading}
                     className="h-9 px-4 bg-[#ffcc00] text-[#010a26] font-black text-xs rounded-md shadow-sm hover:opacity-90 transition-all flex items-center space-x-1 disabled:opacity-50"
                   >
                     <span>{headerLoading ? '...' : 'GİRİŞ'}</span>
                     <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-[#010a26] ml-1"></div>
                   </button>

                   <Link 
                     to="/kayit-ol" 
                     className="h-9 px-4 bg-[#23a317] text-white font-black text-[11px] rounded-md shadow-sm flex items-center justify-center hover:opacity-90 transition-all"
                   >
                     HEMEN ÜYE OL
                   </Link>
                </form>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                 <div className="flex flex-col items-end">
                   <span className="text-[10px] font-bold text-white/60 uppercase tracking-tight">Hoşgeldiniz</span>
                   <span className="text-xs font-black text-white">{profile?.fullName || user?.email}</span>
                 </div>
                 
                 {profile?.isVip && (
                   <div className="bg-[#010a26] text-[#ffcc00] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center space-x-1">
                     <Star size={10} className="fill-[#ffcc00]" />
                     <span>VIP</span>
                   </div>
                 )}

                 <div className="flex items-center space-x-2">
                    {profile?.role === 'admin' && (
                      <Link to="/admin" className="p-2 bg-[#010a26] text-[#ffcc00] rounded-lg hover:bg-[#102677] transition-colors flex items-center space-x-1">
                        <LayoutGrid size={16} />
                        <span className="text-[10px] font-black uppercase tracking-tight hidden sm:inline">Panel</span>
                      </Link>
                    )}
                    <Link to="/bilgilerim" className="p-0.5 bg-white border-2 border-black rounded-lg hover:border-gray-600 transition-all flex items-center justify-center overflow-hidden w-10 h-10 shadow-lg">
                       {profile?.role === 'admin' ? (
                          <img 
                            src={APP_LOGO_URL} 
                            className="w-full h-full object-contain"
                            alt="Admin"
                            referrerPolicy="no-referrer"
                          />
                       ) : (
                          <div className="text-black"><User size={24} /></div>
                       )}
                    </Link>
                    <button onClick={handleSignOut} className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                      <LogOut size={16} />
                    </button>
                 </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button Section */}
          <div className="lg:hidden flex items-center space-x-2">
            {!user && (
              <Link to="/giris-yap" className="bg-[#ffcc00] text-[#010a26] px-4 py-2 rounded-lg font-black text-xs uppercase tracking-widest">Giriş</Link>
            )}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white p-2 bg-white/10 rounded-lg"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#ffcc00] to-transparent opacity-50"></div>

      {/* Nesine Style Sub Nav (Bottom Bar) */}
      <div className="bg-[#010a26] border-b border-white/5 py-1 hidden lg:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <ul className="flex items-center space-x-1">
            {menuItems.map((item) => (
              <li key={item.label}>
                <Link 
                  to={item.path} 
                  className="px-6 py-3 text-[11px] font-black text-white hover:text-[#ffcc00] uppercase tracking-tighter transition-all block relative group"
                >
                  {item.label}
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#ffcc00] transition-all group-hover:w-full"></div>
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center space-x-3 mr-4">
            <Link to="/program" className="flex items-center space-x-2 bg-[#ffcc00] text-black px-4 py-2 rounded-md font-black text-[10px] tracking-widest hover:bg-white transition-all">
              <Tv size={14} />
              <span>YARIŞ PROGRAMLARI</span>
            </Link>
            <Link to="/odeme-bildirimi" className="flex items-center space-x-2 bg-white/5 text-gray-400 px-4 py-2 rounded-md font-black text-[10px] tracking-widest hover:bg-white/10 border border-white/10 transition-all">
              <CreditCard size={14} />
              <span>ÖDEME BİLDİRİMİ</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/5 bg-[#010a26] overflow-hidden"
          >
            <ul className="flex flex-col space-y-2 p-6 text-sm font-black text-white uppercase tracking-tight">
              {menuItems.map((item) => (
                <li key={item.label}>
                  <Link 
                    to={item.path} 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 border-b border-white/5 hover:text-[#ffcc00] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="pt-4 border-t border-white/5">
                <div className="flex flex-wrap items-center gap-3 justify-center">
                  <a href="https://wa.me/905336711463" target="_blank" rel="noreferrer" className="flex items-center space-x-2 bg-[#25D366] px-4 py-2 rounded-xl text-xs font-bold text-white">
                    <MessageCircle size={16} fill="white" />
                    <span>WhatsApp</span>
                  </a>
                  <a href="https://whatsapp.com/channel/0029Vb74jmJEquiXSAHseL2Y" target="_blank" rel="noreferrer" className="flex items-center space-x-2 bg-[#25D366] px-4 py-2 rounded-xl text-xs font-bold text-white">
                    <Send size={16} className="ml-[1px]" />
                    <span>WhatsApp Kanalı</span>
                  </a>
                  <a href="https://x.com/aya_canpolat?s=11&t=pi0jHu5kSA-MgDWBDRCMBg" target="_blank" rel="noreferrer" className="flex items-center space-x-2 bg-black px-4 py-2 rounded-xl text-xs font-bold text-white border border-white/20">
                    <Twitter size={16} fill="white" />
                    <span>X (Twitter)</span>
                  </a>
                  <a href="https://www.instagram.com/altiliyakalatanadam?igsh=Z3E0OWxndjVnYjUx&utm_source=qr" target="_blank" rel="noreferrer" className="flex items-center space-x-2 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] px-4 py-2 rounded-xl text-xs font-bold text-white">
                    <Instagram size={16} />
                    <span>Instagram</span>
                  </a>
                  <a href="https://www.facebook.com/share/1FtoneYKcR/?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="flex items-center space-x-2 bg-[#1877F2] px-4 py-2 rounded-xl text-xs font-bold text-white">
                    <Facebook size={16} fill="white" />
                    <span>Facebook</span>
                  </a>
                  <a href="https://youtube.com/@altiliyakalatanadamcanpolat?si=kjTRAmnEweAjkpyk" target="_blank" rel="noreferrer" className="flex items-center space-x-2 bg-[#FF0000] px-4 py-2 rounded-xl text-xs font-bold text-white">
                    <Youtube size={16} fill="white" />
                    <span>YouTube</span>
                  </a>
                </div>
              </li>
              <li className="pt-4 space-y-3">
                <Link 
                  to="/program"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 bg-[#ffcc00] text-black px-4 py-3 rounded-xl font-black tracking-widest text-xs w-full justify-center"
                >
                  <Tv size={18} />
                  <span>YARIŞ PROGRAMLARI</span>
                </Link>
                {profile?.role === 'admin' && (
                  <Link 
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-xl font-black tracking-widest text-xs w-full justify-center"
                  >
                    <LayoutGrid size={18} />
                    <span>ADMİN PANELİ</span>
                  </Link>
                )}
                <Link 
                  to="/odeme-bildirimi"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 bg-white/10 text-white px-4 py-3 rounded-xl font-black tracking-widest text-xs w-full justify-center border border-white/20"
                >
                  <CreditCard size={18} />
                  <span>ÖDEME BİLDİRİMİ</span>
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
