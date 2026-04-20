/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'motion/react';
import { User, Star, CreditCard, MessageCircle, Mail, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

export default function Dashboard() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState(profile?.phone || '');
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', newPasswordConfirm: '' });
  const [messages, setMessages] = useState({ phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  
  const menuItems = [
    { label: 'Üyelik Bilgileri', badge: profile?.isVip ? 'VIP Üye' : (profile?.role === 'admin' ? 'Admin' : 'Standart Üye'), icon: User, active: true },
    { label: 'Vip Paket Satın Al', icon: Star, action: () => navigate('/vip') },
    { label: 'Ödeme Bildirimi', icon: CreditCard, action: () => navigate('/odeme-bildirimi') },
    { label: 'ALTILIYAKALATANADAM Destek', icon: MessageCircle, action: () => navigate('/iletisim') },
    { label: 'İletişim', icon: Mail, action: () => navigate('/iletisim') },
    { label: 'Çıkış', icon: LogOut, action: () => { signOut(); navigate('/'); } },
  ];

  if (!profile || !user) {
     return (
        <div className="min-h-screen bg-[#080d16] flex items-center justify-center text-white">
           Yükleniyor veya Giriş Yapılmadı...
        </div>
     )
  }

  const getDaysRemaining = (expiryStr?: string) => {
    if (!expiryStr) return 0;
    const expiryDate = new Date(expiryStr);
    const timeDiff = expiryDate.getTime() - new Date().getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return days > 0 ? days : 0;
  };
  
  const handleUpdatePhone = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setMessages({ ...messages, phone: '' });
      try {
        await updateDoc(doc(db, 'users', user.uid), { phone: phone });
        setMessages({ ...messages, phone: 'Telefon numarası güncellendi.' });
      } catch (err: any) {
        setMessages({ ...messages, phone: err.message || 'Güncelleme başarısız.' });
      } finally {
        setLoading(false);
      }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
      e.preventDefault();
      if (passwords.newPassword !== passwords.newPasswordConfirm) {
         setMessages({ ...messages, password: 'Yeni şifreler eşleşmiyor!' });
         return;
      }
      setLoading(true);
      setMessages({ ...messages, password: '' });
      try {
        if (!auth.currentUser || !auth.currentUser.email) throw new Error("Giriş yapılmış kullanıcı bulunamadı.");
        
        // Re-authenticate first
        const credential = EmailAuthProvider.credential(auth.currentUser.email, passwords.currentPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);
        
        await updatePassword(auth.currentUser, passwords.newPassword);
        setMessages({ ...messages, password: 'Şifreniz güncellendi.' });
        setPasswords({ currentPassword: '', newPassword: '', newPasswordConfirm: '' });
      } catch (err: any) {
        setMessages({ ...messages, password: err.message || 'Şifre güncellenemedi.' });
      } finally {
        setLoading(false);
      }
  };

  return (
    <div className="min-h-screen bg-[#080d16] text-white">
      <Header />
      
      <main className="max-w-7xl mx-auto py-20 px-4">
        {/* Breadcrumb row */}
        <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-gray-600 mb-12">
          <span>Anasayfa</span>
          <ChevronRight size={12} className="text-gray-800" />
          <span className="text-[#00e5ff]">Bilgilerim</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Menu */}
          <aside className="w-full lg:w-1/3">
            <div className="border-l-4 border-[#00e5ff] pl-6 mb-8">
              <h2 className="text-3xl font-black italic tracking-tighter uppercase whitespace-nowrap">Kullanıcı <span className="text-gray-400">Menüsü</span></h2>
            </div>
            
            <div className="bg-[#0a0a0a] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
              <div className="divide-y divide-white/5">
                {menuItems.map((item, idx) => (
                  <button 
                    key={idx}
                    onClick={item.action}
                    className={`w-full flex items-center justify-between px-8 py-5 transition-all group ${item.active ? 'bg-[#151b27]/40 ring-1 ring-inset ring-[#00e5ff]/20' : 'hover:bg-white/5'}`}
                  >
                    <div className="flex items-center space-x-4">
                      <item.icon size={18} className={item.active ? 'text-[#00e5ff]' : 'text-gray-500 group-hover:text-white transition-colors'} />
                      <span className={`text-xs font-black uppercase tracking-widest ${item.active ? 'text-white' : 'text-gray-500 group-hover:text-white transition-colors'}`}>
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="bg-[#00e5ff]/10 text-[#00e5ff] text-[8px] font-black uppercase px-2 py-0.5 rounded-full border border-[#00e5ff]/20">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <ChevronRight size={14} className={`transition-transform ${item.active ? 'text-[#00e5ff] translate-x-1' : 'text-gray-800 group-hover:text-white group-hover:translate-x-1'}`} />
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 space-y-12">
            
            {/* VIP Status Card */}
            {profile?.isVip && (
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-[#0c121e] to-[#0a0a0a] border border-[#00e5ff]/20 rounded-[40px] p-8 md:p-12 shadow-[0_0_50px_-12px_rgba(0,229,255,0.15)] relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <Star size={120} className="text-[#00e5ff]" />
                </div>
                
                <h3 className="text-xl font-black italic mb-6 tracking-tight uppercase flex items-center space-x-3 text-[#00e5ff]">
                  <Star size={20} />
                  <span>VIP <span className="text-white">Abonelik Durumu</span></span>
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 relative z-10">
                   <div>
                     <div className="text-[10px] font-black uppercase tracking-widest text-[#00e5ff] mb-1">Paket Tipi</div>
                     <div className="font-bold text-sm">{profile.vipPackage || '1 Aylık VIP'}</div>
                   </div>
                   <div>
                     <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Başlangıç</div>
                     <div className="font-bold text-sm">
                       {profile.vipStartDate ? new Date(profile.vipStartDate).toLocaleDateString('tr-TR') : '-'}
                     </div>
                   </div>
                   <div>
                     <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Bitiş</div>
                     <div className="font-bold text-sm text-red-400">
                       {profile.vipExpiry ? new Date(profile.vipExpiry).toLocaleDateString('tr-TR') : '-'}
                     </div>
                   </div>
                   <div>
                     <div className="text-[10px] font-black uppercase tracking-widest text-[#00e5ff] mb-1">Kalan Süre</div>
                     <div className="font-black text-2xl italic tracking-tighter">
                       {getDaysRemaining(profile.vipExpiry)} <span className="text-[10px] font-bold text-gray-400 not-italic">Gün</span>
                     </div>
                   </div>
                </div>
                
                <button onClick={() => navigate('/vip')} className="w-full md:w-auto px-8 py-3 bg-[#00e5ff] text-black font-black uppercase text-[10px] tracking-widest rounded-full hover:bg-white transition-all shadow-lg shadow-[#00e5ff]/20">
                  Şimdi Yenile
                </button>
              </motion.section>
            )}
            
            {/* Notification and Preferences Section */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0a0a0a] border border-white/5 rounded-[40px] p-8 md:p-12 shadow-2xl"
            >
              <h3 className="text-xl font-black italic mb-6 tracking-tight uppercase">
                Bildirim <span className="text-gray-400">Ayarları</span>
              </h3>
              <p className="text-gray-500 text-xs font-medium mb-8">Hangi durumlarda size bildirim göndereceğimizi seçin.</p>
              
              <div className="space-y-4 mb-12">
                 <div className="flex items-center space-x-3 bg-[#151b27] p-5 rounded-2xl border border-white/10">
                    <input type="checkbox" id="emailNotif" defaultChecked className="w-5 h-5 rounded bg-[#0a0a0a] border-white/10 text-[#00e5ff] focus:ring-[#00e5ff]" />
                    <label htmlFor="emailNotif" className="text-sm font-bold text-gray-400 cursor-pointer">E-Posta Bildirimleri Al</label>
                 </div>
                 <div className="flex items-center space-x-3 bg-[#151b27] p-5 rounded-2xl border border-white/10">
                    <input type="checkbox" id="browserNotif" defaultChecked className="w-5 h-5 rounded bg-[#0a0a0a] border-white/10 text-[#00e5ff] focus:ring-[#00e5ff]" />
                    <label htmlFor="browserNotif" className="text-sm font-bold text-gray-400 cursor-pointer">Tarayıcı (Push) Bildirimleri Al</label>
                 </div>
                 <div className="flex items-center space-x-3 bg-[#151b27] p-5 rounded-2xl border border-white/10">
                    <input type="checkbox" id="vipNotif" defaultChecked className="w-5 h-5 rounded bg-[#0a0a0a] border-white/10 text-[#00e5ff] focus:ring-[#00e5ff]" />
                    <label htmlFor="vipNotif" className="text-sm font-bold text-gray-400 cursor-pointer">Sadece VIP İçerik ve Önemli Duyuruları Al</label>
                 </div>
              </div>

              <h3 className="text-xl font-black italic mb-6 tracking-tight uppercase">
                Favori <span className="text-gray-400">Pistlerim</span>
              </h3>
              <p className="text-gray-500 text-xs font-medium mb-8">Ana sayfada öncelikli görmek istediğiniz pistleri seçin.</p>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {['İstanbul', 'İzmir', 'Ankara', 'Adana', 'Şanlıurfa', 'Bursa'].map((track) => (
                   <div key={track} className="flex items-center space-x-3 bg-[#151b27] p-4 rounded-xl border border-white/10">
                      <input type="checkbox" id={`track-${track}`} defaultChecked={track === 'İstanbul' || track === 'İzmir'} className="w-5 h-5 rounded bg-[#0a0a0a] border-white/10 text-[#00e5ff] focus:ring-[#00e5ff]" />
                      <label htmlFor={`track-${track}`} className="text-sm font-bold text-gray-400 cursor-pointer">{track}</label>
                   </div>
                ))}
              </div>

              <button className="w-full p-4 bg-transparent border-2 border-[#00e5ff] rounded-2xl font-black text-[#00e5ff] uppercase text-xs tracking-[0.2em] hover:bg-[#00e5ff] hover:text-white transition-all transform active:scale-95">
                Tercihleri Kaydet
              </button>
            </motion.section>

            {/* E-Posta Değiştir */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0a0a0a] border border-white/5 rounded-[40px] p-8 md:p-12 shadow-2xl"
            >
              <h3 className="text-xl font-black italic mb-6 tracking-tight uppercase">
                E-Posta <span className="text-gray-400">Değiştir</span>
              </h3>
              <p className="text-gray-500 text-xs font-medium mb-8">E-posta adresinizi değiştirmek için aşağıdaki formu kullanabilirsiniz.</p>
              
              <div className="space-y-4">
                <div className="relative">
                  <input 
                    type="email" 
                    defaultValue={profile?.email || ''}
                    disabled
                    className="w-full bg-[#151b27] border border-white/10 rounded-2xl p-5 text-sm font-bold focus:outline-none focus:border-[#00e5ff] transition-colors opacity-50 cursor-not-allowed"
                  />
                  <div className="text-xs text-gray-500 mt-2 ml-2">Geçici olarak e-posta değişimi devre dışıdır.</div>
                </div>
                <button disabled className="w-full p-4 bg-transparent border-2 border-gray-600 rounded-2xl font-black text-gray-600 uppercase text-xs tracking-[0.2em] transform active:scale-95 cursor-not-allowed">
                  Güncelle
                </button>
              </div>
            </motion.section>

            {/* Telefon Numarası Değiştir */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0a0a0a] border border-white/5 rounded-[40px] p-8 md:p-12 shadow-2xl"
            >
              <h3 className="text-xl font-black italic mb-6 tracking-tight uppercase">
                Telefon Numarası <span className="text-gray-400">Değiştir</span>
              </h3>
              <p className="text-gray-500 text-xs font-medium mb-8">Yeni telefon numaranıza doğrulama kodu gönderilecektir.</p>
              
              <form onSubmit={handleUpdatePhone} className="space-y-4">
                {messages.phone && <div className="text-[#00e5ff] text-sm mb-4 font-bold">{messages.phone}</div>}
                <div className="relative">
                  <input 
                    type="tel" 
                    placeholder="Telefon Numaranız"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-[#151b27] border border-white/10 rounded-2xl p-5 text-sm font-bold focus:outline-none focus:border-[#00e5ff] transition-colors"
                  />
                </div>
                <button type="submit" disabled={loading} className="w-full p-4 bg-transparent border-2 border-[#00e5ff] rounded-2xl font-black text-[#00e5ff] uppercase text-xs tracking-[0.2em] hover:bg-[#00e5ff] hover:text-white transition-all transform active:scale-95">
                  {loading ? 'Güncelleniyor...' : 'Güncelle'}
                </button>
              </form>
            </motion.section>

            {/* Şifre Değiştir */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0a0a0a] border border-white/5 rounded-[40px] p-8 md:p-12 shadow-2xl"
            >
              <h3 className="text-xl font-black italic mb-6 tracking-tight uppercase">
                Şifre <span className="text-gray-400">Değiştir</span>
              </h3>
              <p className="text-gray-500 text-xs font-medium mb-8">Lütfen aşağıdaki form alanlarına yeni şifrenizi giriniz. Bundan sonraki girişlerde girdiğiniz yeni şifreniz geçerli olacaktır.</p>
              
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                {messages.password && <div className="text-[#00e5ff] text-sm mb-4 font-bold">{messages.password}</div>}
                <input 
                  type="password" 
                  placeholder="Eski Şifre"
                  value={passwords.currentPassword}
                  onChange={e => setPasswords({...passwords, currentPassword: e.target.value})}
                  className="w-full bg-[#151b27] border border-white/10 rounded-2xl p-5 text-sm font-bold focus:outline-none focus:border-[#00e5ff] transition-colors"
                />
                <input 
                  type="password" 
                  placeholder="Yeni Şifre"
                  value={passwords.newPassword}
                  onChange={e => setPasswords({...passwords, newPassword: e.target.value})}
                  className="w-full bg-[#151b27] border border-white/10 rounded-2xl p-5 text-sm font-bold focus:outline-none focus:border-[#00e5ff] transition-colors"
                />
                <input 
                  type="password" 
                  placeholder="Yeni Şifre Tekrar"
                  value={passwords.newPasswordConfirm}
                  onChange={e => setPasswords({...passwords, newPasswordConfirm: e.target.value})}
                  className="w-full bg-[#151b27] border border-white/10 rounded-2xl p-5 text-sm font-bold focus:outline-none focus:border-[#00e5ff] transition-colors"
                />
                <button type="submit" disabled={loading} className="w-full p-4 bg-transparent border-2 border-[#00e5ff] rounded-2xl font-black text-[#00e5ff] uppercase text-xs tracking-[0.2em] hover:bg-[#00e5ff] hover:text-white transition-all transform active:scale-95">
                  {loading ? 'Güncelleniyor...' : 'Güncelle'}
                </button>
              </form>
            </motion.section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
