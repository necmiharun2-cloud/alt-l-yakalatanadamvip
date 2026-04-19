/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, FileText, CheckCircle, ListPlus, Send, ImageIcon, Type, Link as LinkIcon, Users, Eye, Lock, ShieldCheck, Database, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db, auth } from '../lib/firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

type Section = 'guncel' | 'basarili' | 'blog' | 'users' | 'slider' | 'banks';

export default function Admin() {
  const { profile, loading: authLoading } = useAuth();
  const [activeSection, setActiveSection] = useState<Section>('guncel');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    subTitle: '',
    content: '',
    image: '',
    slug: '',
    track: 'İstanbul',
    winnings: '',
    views: 0,
    type: 'current',
    role: 'user',
    // slider specific
    ctaText: '',
    ctaLink: '',
    orderIndex: 0,
    // bank specific
    bankName: '',
    iban: '',
    receiverName: '',
    // Horse race specific
    ayaklar: Array(6).fill(''),
    fiyat: '',
    commentsEnabled: true
  });

  const sections = [
    { id: 'guncel', label: 'Güncel Tahminler', icon: ListPlus },
    { id: 'basarili', label: 'Başarılı Tahminler', icon: CheckCircle },
    { id: 'blog', label: 'Blog Yazıları', icon: FileText },
    { id: 'slider', label: 'Slider Ayarları', icon: ImageIcon },
    { id: 'banks', label: 'Banka Bilgileri', icon: Building2 },
    { id: 'users', label: 'Kullanıcı & Ödemeler', icon: Users },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      if (activeSection === 'blog') {
        const payload = {
          title: formData.title,
          slug: formData.slug || formData.title.toLowerCase().replace(/ /g, '-'),
          content: formData.content,
          image: formData.image,
          views: Number(formData.views),
          createdAt: serverTimestamp()
        };
        if (editId) {
            await updateDoc(doc(db, 'blogs', editId), payload);
        } else {
            await addDoc(collection(db, 'blogs'), payload);
        }
      } else if (activeSection === 'guncel' || activeSection === 'basarili') {
        const payload = {
          title: formData.title,
          subTitle: formData.subTitle,
          slug: formData.slug || formData.title.toLowerCase().replace(/ /g, '-'),
          content: formData.content,
          image: formData.image,
          track: formData.track,
          type: activeSection === 'guncel' ? 'current' : 'success',
          winnings: formData.winnings,
          views: Number(formData.views),
          authorName: 'ALTILIYAKALATANADAM',
          isPublic: formData.type === 'isPublic', // Using type as a temp flag for isPublic checkbox
          ayaklar: Array.isArray(formData.ayaklar) ? formData.ayaklar.filter(l => l.trim()) : [],
          fiyat: formData.fiyat,
          commentsEnabled: formData.commentsEnabled,
          createdAt: serverTimestamp()
        };
        if (editId) {
            await updateDoc(doc(db, 'predictions', editId), payload);
        } else {
            await addDoc(collection(db, 'predictions'), payload);
        }
      } else if (activeSection === 'banks') {
          const payload = {
            bankName: formData.bankName,
            iban: formData.iban,
            receiverName: formData.receiverName,
            active: true
          };
          if (editId) {
              await updateDoc(doc(db, 'banks', editId), payload);
          } else {
              await addDoc(collection(db, 'banks'), payload);
          }
      }
      setMessage(editId ? 'İçerik başarıyla güncellendi!' : 'İçerik başarıyla yayınlandı!');
      setFormData({ ...formData, title: '', subTitle: '', content: '', slug: '', winnings: '', track: 'İstanbul', bankName: '', iban: '', receiverName: '' });
      setEditId(null);
      await fetchAdminData();
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || 'Hata oluştu. Yetkiniz olmayabilir.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any, type: string) => {
      setEditId(item.id);
      if (type === 'blog') {
          setFormData({ ...formData, title: item.title, slug: item.slug, content: item.content, image: item.image, views: item.views });
      } else if (type === 'prediction') {
          setFormData({ 
            ...formData, 
            title: item.title, 
            subTitle: item.subTitle || '', 
            slug: item.slug, 
            track: item.track || 'İstanbul',
            content: item.content, 
            image: item.image, 
            winnings: item.winnings || '', 
            views: item.views || 0, 
            type: item.isPublic ? 'isPublic' : '',
            ayaklar: Array.isArray(item.ayaklar) ? [...item.ayaklar, ...Array(6 - item.ayaklar.length).fill('')] : Array(6).fill(''),
            fiyat: item.fiyat || '',
            commentsEnabled: item.commentsEnabled !== undefined ? item.commentsEnabled : true
          });
      } else if (type === 'bank') {
          setFormData({ ...formData, bankName: item.bankName, iban: item.iban, receiverName: item.receiverName });
      }
      window.scrollTo(0, 0);
  };
  
  const handleMarkSuccess = async (prediction: any) => {
    const winnings = window.prompt("Tebrikler! Kazanılan ikramiye tutarını giriniz (Örn: 511.589,37 TL):", prediction.winnings || "");
    if (winnings === null) return; // User cancelled
    
    setLoading(true);
    try {
      await updateDoc(doc(db, 'predictions', prediction.id), {
        type: 'success',
        winnings: winnings,
        updatedAt: serverTimestamp()
      });
      setMessage('Tahmin başarıyla başarılı listesine taşındı!');
      await fetchAdminData();
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || 'Hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, type: string) => {
      if (!window.confirm("Bu veriyi silmek istediğinize emin misiniz?")) return;
      try {
          if (type === 'blog') await deleteDoc(doc(db, 'blogs', id));
          if (type === 'prediction') await deleteDoc(doc(db, 'predictions', id));
          if (type === 'bank') await deleteDoc(doc(db, 'banks', id));
          setMessage('Başarıyla silindi!');
          await fetchAdminData();
      } catch (err) {
          console.error(err);
      }
  };

  const [users, setUsers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [sliderItems, setSliderItems] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [banks, setBanks] = useState<any[]>([]);

  const [newUser, setNewUser] = useState({ fullName: '', email: '', password: '', role: 'user', isVip: false });

  React.useEffect(() => {
    fetchAdminData();
    setEditId(null);
    setFormData({ title: '', subTitle: '', content: '', image: '', slug: '', track: 'İstanbul', winnings: '', views: 0, type: 'current', role: 'user', ctaText: '', ctaLink: '', orderIndex: 0, bankName: '', iban: '', receiverName: '', ayaklar: Array(6).fill(''), fiyat: '', commentsEnabled: true });
    setMessage('');
  }, [activeSection]);

  const fetchAdminData = async () => {
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      const paymentsSnap = await getDocs(query(collection(db, 'payments'), orderBy('createdAt', 'desc')));
      const sliderSnap = await getDocs(query(collection(db, 'slider'), orderBy('orderIndex', 'asc')));
      const predsSnap = await getDocs(query(collection(db, 'predictions'), orderBy('createdAt', 'desc')));
      const blogsSnap = await getDocs(query(collection(db, 'blogs'), orderBy('createdAt', 'desc')));
      const banksSnap = await getDocs(collection(db, 'banks'));

      setUsers(usersSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setPayments(paymentsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setSliderItems(sliderSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setPredictions(predsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setBlogs(blogsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setBanks(banksSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Error fetching admin data", err);
    }
  };

  const handleSliderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        await addDoc(collection(db, 'slider'), {
            title: formData.title,
            subTitle: formData.subTitle,
            ctaText: formData.ctaText,
            ctaLink: formData.ctaLink,
            imageUrl: formData.image,
            orderIndex: Number(formData.orderIndex),
            active: true
        });
        await fetchAdminData();
        setMessage('Slider öğesi başarıyla eklendi!');
        setFormData({ ...formData, title: '', subTitle: '', ctaText: '', ctaLink: '', image: '', orderIndex: 0 });
    } catch (err) {
        console.error(err);
        setMessage('Slider eklenirken hata oluştu');
    } finally {
        setLoading(false);
    }
  };

  const deleteSlider = async (id: string) => {
      try {
          await deleteDoc(doc(db, 'slider', id));
          await fetchAdminData();
          setMessage('Slider silindi!');
      } catch(err) {
          console.error(err);
      }
  };

  const handlePaymentAction = async (paymentId: string, status: string, userId: string, isVip: boolean) => {
    try {
      await updateDoc(doc(db, 'payments', paymentId), { status });
      if (status === 'approved') {
        await updateDoc(doc(db, 'users', userId), { isVip: true, role: 'vip' });
      }
      await fetchAdminData();
      setMessage('İşlem başarılı!');
    } catch (err) {
       console.error(err);
       setMessage('Hata oluştu');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
       // Note: Creating a user in Firebase Auth requires a separate instance or custom logic if already logged in as admin.
       // Usually we'd use a Cloud Function, but here I'll just set it in Firestore and mention they need to use the register page or I can use a secondary auth instance if needed.
       // For now, I'll use a placeholder logic: Admin can't easily create OTHER users in Auth easily from direct SDK without being logged out.
       // I'll just explain. OR I'll create a doc in Firestore and assume they use the same email to register later.
       await addDoc(collection(db, 'users'), {
         ...newUser,
         createdAt: serverTimestamp()
       });
       await fetchAdminData();
       setNewUser({ fullName: '', email: '', password: '', role: 'user', isVip: false });
       setMessage('Kullanıcı profile kaydı oluşturuldu (Auth kaydı manuel yapılmalıdır)!');
    } catch(err) {
       console.error(err);
       setMessage('Kullanıcı oluşturulurken bir hata oluştu');
    } finally {
       setLoading(false);
    }
  };

  const seedData = async () => {
    setLoading(true);
    try {
      await addDoc(collection(db, 'predictions'), {
         title: 'İzmir Çiminde Namağlup - 18 Nisan İzmir',
         subTitle: 'İzmir tahminleri sayfanın en altındadır;',
         slug: 'izmir-ciminde-namaglup-18-nisan',
         content: 'İzmir yarışları için yaptığımız detaylı analizler...',
         type: 'current',
         authorName: 'ALTILIYAKALATANADAM',
         isPublic: true,
         createdAt: serverTimestamp()
      });
      await addDoc(collection(db, 'blogs'), {
         title: "ALTILIYAKALATANADAM'dan Yine Büyük İkramiye 511.589,37 TL",
         slug: 'buyuk-ikramiye-24-ocak',
         content: '24 Ocak tarihinde kazandırdığımız dev ikramiye detayları...',
         image: 'https://picsum.photos/seed/win/800/400',
         views: 1250,
         createdAt: serverTimestamp()
      });
      alert('Demo verileri başarıyla yüklendi!');
    } catch (err) {
      console.error(err);
      alert('Hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Loading check
  if (authLoading) {
    return <div className="min-h-screen bg-[#080d16] flex items-center justify-center text-white">Yükleniyor...</div>;
  }

  // Skip rendering if not admin (in real app we'd redirect)
  if (!profile || profile.role !== 'admin') {
     return <div className="min-h-screen bg-[#080d16] flex items-center justify-center text-white">Yetkisiz Erişim</div>;
  }

  return (
    <div className="min-h-screen bg-[#080d16] text-white">
      <Header />
      
      <main className="max-w-7xl mx-auto py-20 px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-l-4 border-[#00e5ff] pl-8">
          <div>
            <h1 className="text-5xl font-black italic tracking-tighter mb-4">
              Admin <span className="text-gray-400">Paneli</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium">Sitedeki içerikleri buradan yönetebilir ve yeni gönderiler ekleyebilirsiniz.</p>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={seedData}
              className="flex items-center space-x-2 bg-blue-600/20 border border-blue-500/30 p-3 rounded-2xl group hover:bg-blue-600 transition-all"
            >
              <Database size={18} className="text-blue-400 group-hover:text-white" />
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 group-hover:text-white">Demo Veri Yükle</span>
            </button>
            <div className="flex items-center space-x-2 bg-[#0a0a0a] border border-white/5 p-3 rounded-2xl group cursor-default">
              <LayoutDashboard size={20} className="text-[#00e5ff]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Yönetim Paneli v2.0</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Tabs */}
          <aside className="w-full lg:w-1/4">
            <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl md:rounded-[32px] overflow-hidden shadow-2xl p-2 md:p-4 space-y-1 md:space-y-2 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible scrollbar-hide">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as Section)}
                  className={`flex-shrink-0 lg:flex-shrink lg:w-full flex items-center space-x-3 md:space-x-4 p-4 md:p-5 rounded-xl md:rounded-2xl transition-all group ${
                    activeSection === section.id 
                    ? 'bg-[#00e5ff] text-black shadow-lg shadow-[#00e5ff]/20' 
                    : 'hover:bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <section.icon size={18} className={activeSection === section.id ? 'text-black' : 'text-[#00e5ff] group-hover:scale-110 transition-transform'} />
                  <span className="text-[10px] md:text-sm font-black uppercase tracking-tight whitespace-nowrap">{section.label}</span>
                </button>
              ))}
            </div>
          </aside>

          {/* Form Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-[#0a0a0a] border border-white/5 rounded-[40px] p-8 md:p-12 shadow-2xl"
              >
                {message && (
                  <div className="bg-green-500/10 border border-green-500 text-green-500 p-4 rounded-2xl mb-6 text-sm font-bold">
                    {message}
                  </div>
                )}

                <div className="flex items-center space-x-4 mb-10">
                  <div className="w-12 h-12 bg-[#00e5ff]/10 rounded-2xl flex items-center justify-center">
                    {(() => {
                      const Icon = sections.find(s => s.id === activeSection)?.icon;
                      return Icon ? <Icon size={24} className="text-[#00e5ff]" /> : null;
                    })()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black italic tracking-tight">{sections.find(s => s.id === activeSection)?.label} Ekle</h2>
                    <p className="text-gray-500 text-xs font-medium">Lütfen tüm bilgileri eksiksiz doldurun.</p>
                  </div>
                </div>

                  {activeSection === 'banks' ? (
                       <div className="space-y-8">
                         <form onSubmit={handleSubmit} className="space-y-4 bg-[#151b27] p-6 rounded-2xl border border-white/5">
                             <input type="text" placeholder="Banka Adı (Örn: Ziraat Bankası)" required value={formData.bankName} onChange={e => setFormData({...formData, bankName: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-[#00e5ff]" />
                             <input type="text" placeholder="IBAN (Örn: TR00 0000 0000 0000 0000 0000 00)" required value={formData.iban} onChange={e => setFormData({...formData, iban: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-[#00e5ff]" />
                             <input type="text" placeholder="Alıcı Adı Soyadı Lti. Şti." required value={formData.receiverName} onChange={e => setFormData({...formData, receiverName: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-[#00e5ff]" />
                             <div className="flex space-x-4">
                               <button type="submit" disabled={loading} className="flex-1 bg-[#00e5ff] text-black font-bold p-4 rounded-xl uppercase hover:bg-white transition-colors">{editId ? 'Güncelle' : 'Ekle'}</button>
                               {editId && <button type="button" onClick={() => { setEditId(null); setFormData({...formData, bankName: '', iban: '', receiverName: ''}); }} className="px-6 bg-gray-700 text-white font-bold p-4 rounded-xl uppercase hover:bg-gray-600 transition-colors">İptal</button>}
                             </div>
                         </form>
                         <div className="bg-[#151b27] p-6 rounded-2xl border border-white/5 divide-y divide-white/5">
                             {banks.map(b => (
                                 <div key={b.id} className="flex justify-between items-center py-4">
                                     <div className="flex flex-col">
                                         <span className="font-bold text-[#00e5ff]">{b.bankName}</span>
                                         <span className="text-xs text-gray-500 font-mono mt-1">{b.iban}</span>
                                         <span className="text-xs text-gray-400 mt-1">{b.receiverName}</span>
                                     </div>
                                     <div className="flex items-center space-x-2">
                                       <button onClick={() => handleEdit(b, 'bank')} className="text-blue-500 text-sm bg-blue-500/10 px-3 py-1 rounded-lg">Düzenle</button>
                                       <button onClick={() => handleDelete(b.id, 'bank')} className="text-red-500 text-sm bg-red-500/10 px-3 py-1 rounded-lg">Sil</button>
                                     </div>
                                 </div>
                             ))}
                             {banks.length === 0 && <div className="text-gray-500 text-sm italic py-4">Banka bilgisi yok.</div>}
                         </div>
                      </div>
                  ) : activeSection === 'slider' ? (
                      <div className="space-y-8">
                         <form onSubmit={handleSliderSubmit} className="space-y-4 bg-[#151b27] p-6 rounded-2xl border border-white/5">
                             <input type="text" placeholder="Başlık" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-sm" />
                             <input type="text" placeholder="Alt Başlık" value={formData.subTitle} onChange={e => setFormData({...formData, subTitle: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-sm" />
                             <input type="text" placeholder="CTA Metni" value={formData.ctaText} onChange={e => setFormData({...formData, ctaText: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-sm" />
                             <input type="text" placeholder="CTA Linki" value={formData.ctaLink} onChange={e => setFormData({...formData, ctaLink: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-sm" />
                             <input type="text" placeholder="Görsel URL" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-sm" />
                             <input type="number" placeholder="Sıralama (0-9)" value={formData.orderIndex} onChange={e => setFormData({...formData, orderIndex: Number(e.target.value)})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-sm" />
                             <button type="submit" disabled={loading} className="w-full bg-[#00e5ff] text-black font-bold p-4 rounded-xl uppercase hover:bg-white transition-colors">Ekle</button>
                         </form>
                         <div className="bg-[#151b27] p-6 rounded-2xl border border-white/5 divide-y divide-white/5">
                             {sliderItems.map(s => (
                                 <div key={s.id} className="flex justify-between items-center py-4">
                                     <div className="flex flex-col">
                                         <span className="font-bold">{s.title}</span>
                                         <span className="text-xs text-gray-500">{s.subTitle}</span>
                                     </div>
                                     <button onClick={() => deleteSlider(s.id)} className="text-red-500 text-sm bg-red-500/10 px-3 py-1 rounded-lg">Sil</button>
                                 </div>
                             ))}
                             {sliderItems.length === 0 && <div className="text-gray-500 text-sm italic py-4">Slider öğesi yok.</div>}
                         </div>
                      </div>
                  ) : activeSection !== 'users' ? (
                    <div className="space-y-12">
                     <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Başlık / Koşu Adı</label>
                          <div className="relative">
                            <Type size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" />
                            <input 
                              type="text" 
                              placeholder="Örn: Tek Banko - 11 Nisan İstanbul"
                              required
                              value={formData.title}
                              onChange={e => setFormData({...formData, title: e.target.value})}
                              className="w-full bg-[#151b27] border border-white/10 rounded-2xl p-5 pl-14 text-sm font-bold focus:outline-none focus:border-[#00e5ff] transition-colors"
                            />
                          </div>
                        </div>

                        {activeSection === 'guncel' && (
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Pist (Hipodrom)</label>
                            <div className="relative">
                              <select 
                                value={formData.track}
                                onChange={e => setFormData({...formData, track: e.target.value})}
                                className="w-full bg-[#151b27] border border-white/10 rounded-2xl p-5 text-sm font-bold focus:outline-none focus:border-[#00e5ff] transition-colors appearance-none"
                              >
                                <option value="Şanlıurfa">Şanlıurfa</option>
                                <option value="Turffontein">Turffontein</option>
                                <option value="İstanbul">İstanbul</option>
                                <option value="Adana">Adana</option>
                                <option value="Laurel Park">Laurel Park</option>
                                <option value="Keeneland">Keeneland</option>
                                <option value="Santa Anita">Santa Anita</option>
                                <option value="İzmir">İzmir</option>
                              </select>
                            </div>
                          </div>
                        )}
                        
                        {activeSection !== 'guncel' && (
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Slug (URL)</label>
                            <div className="relative">
                              <LinkIcon size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" />
                              <input 
                                type="text" 
                                placeholder="Örn: istanbul-tahminleri-18-nisan"
                                value={formData.slug}
                                onChange={e => setFormData({...formData, slug: e.target.value})}
                                className="w-full bg-[#151b27] border border-white/10 rounded-2xl p-5 pl-14 text-sm font-bold focus:outline-none focus:border-[#00e5ff] transition-colors"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {activeSection === 'guncel' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Slug (URL)</label>
                            <div className="relative">
                              <LinkIcon size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" />
                              <input 
                                type="text" 
                                placeholder="Örn: istanbul-tahminleri-18-nisan"
                                value={formData.slug}
                                onChange={e => setFormData({...formData, slug: e.target.value})}
                                className="w-full bg-[#151b27] border border-white/10 rounded-2xl p-5 pl-14 text-sm font-bold focus:outline-none focus:border-[#00e5ff] transition-colors"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Görsel URL</label>
                          <div className="relative">
                            <ImageIcon size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" />
                            <input 
                              type="url" 
                              placeholder="Örn: https://picsum.photos/..."
                              value={formData.image}
                              onChange={e => setFormData({...formData, image: e.target.value})}
                              className="w-full bg-[#151b27] border border-white/10 rounded-2xl p-5 pl-14 text-sm font-bold focus:outline-none focus:border-[#00e5ff] transition-colors"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Okunma / İzlenme Sayısı</label>
                          <div className="relative">
                            <Eye size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" />
                            <input 
                              type="number" 
                              placeholder="Örn: 1250"
                              value={formData.views}
                              onChange={e => setFormData({...formData, views: Number(e.target.value)})}
                              className="w-full bg-[#151b27] border border-white/10 rounded-2xl p-5 pl-14 text-sm font-bold focus:outline-none focus:border-[#00e5ff] transition-colors"
                            />
                          </div>
                        </div>
                      </div>

                      {activeSection === 'basarili' && (
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">İkramiye Tutarı</label>
                          <div className="relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 font-bold">₺</span>
                            <input 
                              type="text" 
                              placeholder="Örn: 26.500,00 TL"
                              required
                              value={formData.winnings}
                              onChange={e => setFormData({...formData, winnings: e.target.value})}
                              className="w-full bg-[#151b27] border border-white/10 rounded-2xl p-5 pl-10 text-sm font-bold focus:outline-none focus:border-[#00e5ff] transition-colors"
                            />
                          </div>
                        </div>
                      )}

                      {activeSection === 'guncel' && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                               <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Alt Başlık (SubTitle)</label>
                               <input 
                                  type="text" 
                                  placeholder="Örn: İstanbul Tahminleri Sayfanın En Altındadır;"
                                  value={formData.subTitle}
                                  onChange={e => setFormData({...formData, subTitle: e.target.value})}
                                  className="w-full bg-[#151b27] border border-white/10 rounded-2xl p-5 text-sm font-bold focus:outline-none focus:border-[#00e5ff] transition-colors"
                                />
                            </div>
                            <div className="flex items-center justify-between p-5 space-x-4">
                               <div className="flex items-center space-x-3">
                                 <input 
                                   type="checkbox" 
                                   id="isPublic"
                                   checked={formData.type === 'isPublic'}
                                   onChange={e => setFormData({...formData, type: e.target.checked ? 'isPublic' : ''})}
                                   className="w-5 h-5 rounded bg-[#151b27] border-white/10 text-[#00e5ff] focus:ring-[#00e5ff]"
                                 />
                                 <label htmlFor="isPublic" className="text-sm font-bold text-gray-400 cursor-pointer">Ücretsiz Herkese Açık Yap</label>
                               </div>
                               <div className="flex items-center space-x-3">
                                 <input 
                                   type="checkbox" 
                                   id="commentsEnabled"
                                   checked={!formData.commentsEnabled}
                                   onChange={e => setFormData({...formData, commentsEnabled: !e.target.checked})}
                                   className="w-5 h-5 rounded bg-[#151b27] border-white/10 text-[#00e5ff] focus:ring-[#00e5ff]"
                                 />
                                 <label htmlFor="commentsEnabled" className="text-sm font-bold text-gray-400 cursor-pointer">Yorumlara Kapat</label>
                               </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Şablon Fiyatı</label>
                              <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 font-black italic">₺</span>
                                <input 
                                  type="text" 
                                  placeholder="Örn: 1.250 ₺"
                                  value={formData.fiyat}
                                  onChange={e => setFormData({...formData, fiyat: e.target.value})}
                                  className="w-full bg-[#151b27] border border-white/10 rounded-2xl p-5 pl-10 text-sm font-bold focus:outline-none focus:border-[#00e5ff] transition-colors"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Ayaklar (Her ayağa 16 adet At ve AGF girebilirsiniz)</label>
                            <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
                              {Array.from({ length: 6 }).map((_, i) => {
                                const currentAyakStr = formData.ayaklar[i] || '';
                                const lines = currentAyakStr.split('\n');
                                const horses = Array.from({length: 16}).map((_, idx) => {
                                   const line = lines[idx] || '';
                                   const match = line.trim().match(/^([^\(]+?)(?:\s*\(\%?([^\)]+)\))?$/);
                                   return {
                                      atNo: match ? match[1].trim() : '',
                                      agf: match && match[2] ? match[2].trim() : ''
                                   };
                                });

                                const updateHorse = (horseIdx: number, field: 'atNo' | 'agf', val: string) => {
                                   const newHorses = [...horses];
                                   newHorses[horseIdx][field] = val;
                                   const newAyaklar = [...formData.ayaklar];
                                   newAyaklar[i] = newHorses
                                      .map(h => {
                                         if (!h.atNo && !h.agf) return '';
                                         return `${h.atNo}${h.agf ? ` (%${h.agf})` : ''}`;
                                      })
                                      .join('\n');
                                   setFormData({...formData, ayaklar: newAyaklar});
                                };

                                return (
                                  <div key={i} className="flex flex-col space-y-1 bg-[#151b27] border border-white/10 rounded-xl p-2 h-[350px] overflow-y-auto custom-scrollbar relative">
                                    <span className="text-[9px] font-black text-[#00e5ff] uppercase text-center mb-1 sticky top-0 bg-[#151b27] py-2 z-10 border-b border-white/5">{i + 1}. Ayak</span>
                                    <div className="flex text-[8px] text-gray-500 font-bold px-1 mb-1">
                                       <span className="w-5 text-center">NO</span>
                                       <span className="flex-1 text-center">AT NO</span>
                                       <span className="flex-1 text-center">% AGF</span>
                                    </div>
                                    {horses.map((horse, hIdx) => (
                                      <div key={hIdx} className="flex space-x-1 items-center">
                                        <span className="text-[9px] font-black text-gray-500 w-5 text-center">{hIdx + 1}</span>
                                        <input 
                                          type="text" 
                                          placeholder="At No" 
                                          value={horse.atNo}
                                          onChange={(e) => updateHorse(hIdx, 'atNo', e.target.value)}
                                          className="w-1/2 bg-black/50 border border-white/5 rounded p-1.5 text-[10px] text-center font-bold focus:border-[#00e5ff] focus:outline-none transition-colors placeholder:text-gray-700" 
                                        />
                                        <input 
                                          type="text" 
                                          placeholder="%" 
                                          value={horse.agf}
                                          onChange={(e) => updateHorse(hIdx, 'agf', e.target.value)}
                                          className="w-1/2 bg-black/50 border border-white/5 rounded p-1.5 text-[10px] text-center font-bold focus:border-[#00e5ff] focus:outline-none transition-colors placeholder:text-gray-700" 
                                        />
                                      </div>
                                    ))}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </>
                      )}

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">İçerik / Açıklama</label>
                        <textarea 
                          placeholder="Gönderi içeriğini buraya giriniz..."
                          required
                          rows={6}
                          value={formData.content}
                          onChange={e => setFormData({...formData, content: e.target.value})}
                          className="w-full bg-[#151b27] border border-white/10 rounded-2xl p-5 text-sm font-bold focus:outline-none focus:border-[#00e5ff] transition-colors resize-none"
                        ></textarea>
                      </div>

                      <div className="flex space-x-4">
                        <button 
                          type="submit"
                          disabled={loading}
                          className="flex-1 p-5 bg-[#00e5ff] rounded-2xl font-black text-black uppercase tracking-[0.2em] hover:bg-white transition-all transform active:scale-95 flex items-center justify-center space-x-3 group disabled:opacity-50"
                        >
                          <span>{loading ? 'Yükleniyor...' : (editId ? 'Güncelle' : 'Yayına Al')}</span>
                          <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>
                        {editId && (
                           <button type="button" onClick={() => { setEditId(null); setFormData({ ...formData, title: '', subTitle: '', content: '', image: '', slug: '', winnings: '' }); }} className="px-8 bg-gray-700 text-white font-black p-5 rounded-2xl uppercase hover:bg-gray-600 transition-colors">İptal</button>
                        )}
                      </div>
                    </form>
                    
                    {/* Item Lists */}
                    <div className="bg-[#151b27] border border-white/5 rounded-2xl p-6">
                        <h3 className="text-xl font-bold mb-4">{sections.find(s => s.id === activeSection)?.label} Listesi</h3>
                        <div className="divide-y divide-white/5">
                           {(activeSection === 'blog') && blogs.map(b => (
                              <div key={b.id} className="flex justify-between items-center py-4">
                                  <div className="flex flex-col flex-1 truncate pr-4">
                                      <span className="font-bold truncate">{b.title}</span>
                                      <span className="text-xs text-gray-500 font-mono mt-1">/{b.slug}</span>
                                  </div>
                                  <div className="flex items-center space-x-2 shrink-0">
                                    <button type="button" onClick={() => handleEdit(b, 'blog')} className="text-blue-500 text-sm bg-blue-500/10 px-3 py-1 rounded-lg">Düzenle</button>
                                    <button type="button" onClick={() => handleDelete(b.id, 'blog')} className="text-red-500 text-sm bg-red-500/10 px-3 py-1 rounded-lg">Sil</button>
                                  </div>
                              </div>
                           ))}
                           {(activeSection === 'guncel' || activeSection === 'basarili') && predictions.filter(p => activeSection === 'guncel' ? p.type === 'current' : p.type === 'success').map(p => (
                              <div key={p.id} className="flex justify-between items-center py-4">
                                  <div className="flex flex-col flex-1 truncate pr-4">
                                      <span className="font-bold truncate">{p.title} {p.track ? `(${p.track})` : ''}</span>
                                      {p.subTitle && <span className="text-xs text-gray-400 mt-1 truncate">{p.subTitle}</span>}
                                      <span className="text-xs text-gray-500 font-mono mt-1">/{p.slug} - {p.createdAt?.toDate ? p.createdAt.toDate().toLocaleDateString('tr-TR') : (p.createdAt ? new Date(p.createdAt).toLocaleDateString('tr-TR') : '')}</span>
                                  </div>
                                  <div className="flex items-center space-x-2 shrink-0">
                                    {p.type === 'current' && (
                                      <button 
                                         type="button" 
                                         onClick={() => handleMarkSuccess(p)} 
                                         className="text-green-500 text-xs bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg hover:bg-green-500 hover:text-white transition-all font-black uppercase tracking-tight"
                                      >
                                        BAŞARILI YAP
                                      </button>
                                    )}
                                    <button type="button" onClick={() => handleEdit(p, 'prediction')} className="text-blue-500 text-sm bg-blue-500/10 px-3 py-1 rounded-lg">Düzenle</button>
                                    <button type="button" onClick={() => handleDelete(p.id, 'prediction')} className="text-red-500 text-sm bg-red-500/10 px-3 py-1 rounded-lg">Sil</button>
                                  </div>
                              </div>
                           ))}
                           
                           {activeSection === 'blog' && blogs.length === 0 && <div className="text-gray-500 text-sm italic py-4">İçerik yok.</div>}
                           {activeSection === 'guncel' && predictions.filter(p => p.type === 'current').length === 0 && <div className="text-gray-500 text-sm italic py-4">İçerik yok.</div>}
                           {activeSection === 'basarili' && predictions.filter(p => p.type === 'success').length === 0 && <div className="text-gray-500 text-sm italic py-4">İçerik yok.</div>}
                        </div>
                    </div>
                  </div>
                  ) : (
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-bold mb-4">Manuel Kullanıcı Ekle</h3>
                        <form onSubmit={handleCreateUser} className="bg-[#151b27] border border-white/5 rounded-2xl p-6 space-y-4">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <input type="text" placeholder="İsim Soyisim" required value={newUser.fullName} onChange={e => setNewUser({...newUser, fullName: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-[#00e5ff]" />
                             <input type="email" placeholder="E-Posta" required value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-[#00e5ff]" />
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <input type="password" placeholder="Şifre" required value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-[#00e5ff]" />
                             <div className="flex items-center space-x-4">
                                <label className="flex items-center space-x-2 text-sm text-gray-400">
                                  <input type="checkbox" checked={newUser.isVip} onChange={e => setNewUser({...newUser, isVip: e.target.checked})} className="rounded bg-[#0a0a0a] border-white/10 text-[#00e5ff]" />
                                  <span>VIP Üye Olarak Ekle</span>
                                </label>
                                <label className="flex items-center space-x-2 text-sm text-gray-400">
                                   <input type="checkbox" checked={newUser.role === 'admin'} onChange={e => setNewUser({...newUser, role: e.target.checked ? 'admin' : 'user'})} className="rounded bg-[#0a0a0a] border-white/10 text-[#00e5ff]" />
                                   <span>Admin Yap</span>
                                </label>
                             </div>
                           </div>
                           <button type="submit" disabled={loading} className="w-full bg-[#00e5ff] text-black font-bold p-4 rounded-xl uppercase hover:bg-white transition-colors">
                              Ekle
                           </button>
                        </form>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold mb-4">Ödeme Bildirimleri</h3>
                        <div className="bg-[#151b27] border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
                           {payments.map(p => (
                             <div key={p.id} className="p-4 flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
                                <div>
                                   <div className="font-bold text-[#00e5ff]">{p.fullName} ({p.email})</div>
                                   <div className="text-sm text-gray-400">Paket: {p.package} | Tutar: {p.amount} ₺</div>
                                   <div className="text-xs text-gray-500 mb-2">Ref: {p.reference} | Banka: {p.bank}</div>
                                   {p.phone && (
                                     <a href={`https://wa.me/${p.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="inline-flex items-center space-x-1 text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">
                                       <Send size={10} />
                                       <span>WhatsApp Mesaj At</span>
                                     </a>
                                   )}
                                </div>
                                <div className="flex space-x-2">
                                  {p.status === 'pending' ? (
                                    <>
                                       <button onClick={() => handlePaymentAction(p.id, 'approved', p.userId, true)} className="bg-green-500/20 text-green-500 hover:bg-green-500 hover:text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors">Onayla (VIP Yap)</button>
                                       <button onClick={() => handlePaymentAction(p.id, 'rejected', p.userId, false)} className="bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors">Reddet</button>
                                    </>
                                  ) : (
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${p.status === 'approved' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                       {p.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                                    </span>
                                  )}
                                </div>
                             </div>
                           ))}
                           {payments.length === 0 && <div className="p-4 text-gray-500 italic">Ödeme bildirimi yok.</div>}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold mb-4">Kullanıcı Listesi</h3>
                        <div className="bg-[#151b27] border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5 max-h-96 overflow-y-auto">
                           {users.map(u => (
                             <div key={u.id} className="p-4 flex justify-between items-center">
                                <div>
                                   <div className="font-bold">{u.fullName}</div>
                                   <div className="text-xs text-gray-400 mb-2">{u.email}</div>
                                   {u.phone && (
                                     <a href={`https://wa.me/${u.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="inline-flex items-center space-x-1 text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">
                                       <Send size={10} />
                                       <span>WhatsApp Mesaj At</span>
                                     </a>
                                   )}
                                </div>
                                <div className="flex space-x-4 items-center">
                                   <div className="text-xs font-bold uppercase text-gray-500">{u.role}</div>
                                   {u.isVip ? (
                                      <span className="bg-[#00e5ff]/20 text-[#00e5ff] px-2 py-1 rounded text-xs font-bold flex items-center"><CheckCircle size={12} className="mr-1" /> VIP</span>
                                   ) : (
                                      <span className="bg-gray-500/20 text-gray-500 px-2 py-1 rounded text-xs font-bold">NORMAL</span>
                                   )}
                                </div>
                             </div>
                           ))}
                        </div>
                      </div>
                    </div>
                  )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
