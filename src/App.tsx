/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './components/Header';
import Slider from './components/Slider';
import FeatureCards from './components/FeatureCards';
import SuccessTable from './components/SuccessTable';
import LatestPosts from './components/LatestPosts';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import Register from './pages/Register';
import Login from './pages/Login';
import PaymentNotification from './pages/PaymentNotification';
import Predictions from './pages/Predictions';
import PastSuccess from './pages/PastSuccess';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Contact from './pages/Contact';
import PredictionDetail from './pages/PredictionDetail';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import VipPage from './pages/VipPage';
import CompliancePage from './pages/CompliancePage';
import { ChevronLeft, ChevronRight, Apple, Smartphone, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { dbService } from './services/dbService';
import { useAuth } from './context/AuthContext';

import LegalPage from './pages/LegalPage';
import { useParams } from 'react-router-dom';

const legalContents: Record<string, {title: string, content: string}> = {
  'kvkk-politikasi-10': {
    title: 'KVKK Politikası',
    content: 'Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında ALTILIYAKALATANADAM.com olarak kişisel verilerinizi nasıl işlediğimiz ve koruduğumuz hakkında detaylı bilgilendirme.\n\nALTILIYAKALATANADAM, kullanıcılarına ait her türlü bilgiyi gizli tutmayı taahhüt eder. Sistemlerimizde barındırılan tüm finansal işlemler, modern şifreleme altyapıları ile korunmaktadır.'
  },
  'gizlilik-ilkesi-6': {
    title: 'Gizlilik İlkesi',
    content: 'Gizlilik İlkesi\n\nALTILIYAKALATANADAM platformu, kullanıcı deneyimini en üst seviyeye taşırken kullanıcı bilgilerinin gizliliğine maksimum düzeyde özen göstermektedir.\n\nSitemizi ziyaret ettiğinizde toplanan veriler yalnızca yasal mevzuatlara uygun bir şekilde istatistiki amaçlarla kullanılmaktadır.'
  },
  'iade-sartlari-7': {
    title: 'İade Şartları',
    content: 'İade Şartları\n\nALTILIYAKALATANADAM.com üzerinden yapılan dijital üyelik paketlerinin ve hizmetlerin iade koşulları.\n\nDijital içerik hizmeti sunulduğu için, satın alınan paketlerin içeriği kullanılmaya başlandığı andan itibaren ücret iadesi yapılmamaktadır. Hizmet başlamadan önce yapılan iptal bildirimleri teknik ekibimizce incelenmektedir.'
  },
  'kullanim-kosullari-8': {
    title: 'Kullanım Koşulları',
    content: 'Kullanım Koşulları\n\nBu web sitesini ziyaret ederek veya ALTILIYAKALATANADAM hizmetlerinden faydalanarak bu koşulları kabul etmiş sayılırsınız.\n\nSite üzerindeki tahminler, analizler ve yorumlar sadece bilgi amaçlı olup kesinlik taşımaz ve yatırımlarınızda %100 başarı garantisi sunmaz.'
  },
  'satis-sozlesmesi-9': {
    title: 'Satış Sözleşmesi',
    content: 'Mesafeli Satış Sözleşmesi\n\nALTILIYAKALATANADAM.com ile kullanıcı arasındaki hizmet ve ürün satış şartları bu sözleşme kapsamında belirlenmiştir.\n\nTarafların hak ve yükümlülükleri, Türk Borçlar Kanunu ve Tüketiciyi Koruma Kanunu uyarınca güvence altındadır.'
  }
};

function LegalPageWrapper() {
  const { slug } = useParams();
  const page = slug ? legalContents[slug] : null;

  if (!page) {
    return <div className="text-white p-20 text-center">Sayfa bulunamadı.</div>;
  }

  return <LegalPage title={page.title} content={page.content} />;
}

const TRACKS = [
  'Şanlıurfa',
  'Turffontein',
  'İstanbul',
  'Adana',
  'Laurel Park',
  'Keeneland',
  'Santa Anita',
  'İzmir'
];

function HomePage() {
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState<any[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<string>('İstanbul');

  useEffect(() => {
    const fetchLatest = async () => {
        try {
            const data = await dbService.getPredictions('current');
            if (data && Array.isArray(data)) {
                setPredictions(data);
            }
        } catch (err) {
            console.error('Error fetching latest predictions:', err);
        }
    };
    fetchLatest();
  }, []);

  const latestPrediction = predictions.find(p => (p.track || 'İstanbul') === selectedTrack);
  const { profile } = useAuth();
  const showContent = latestPrediction?.isPublic || profile?.isVip || profile?.role === 'admin';

  return (
    <>
      <Slider />
      <FeatureCards />
      <SuccessTable />
      <section className="bg-[#080d16] py-24 px-4 overflow-hidden relative">
        {/* Blurred background horse racing image */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-2/3 bg-cover bg-left opacity-20 blur-sm" 
          style={{ backgroundImage: 'url("https://picsum.photos/seed/horseracing/1920/1080")' }} 
        />
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#080d16] to-transparent" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center relative z-10 mb-8 md:mb-16">
           <div className="w-full flex-wrap md:flex-nowrap flex justify-center md:justify-between gap-2 border-b border-white/5 pb-6">
              {TRACKS.map(track => {
                 const hasPrediction = predictions.some(p => (p.track || 'İstanbul') === track);
                 return (
                   <button
                     key={track}
                     onClick={() => setSelectedTrack(track)}
                     className={`flex-1 px-4 py-3 rounded-2xl text-[9px] sm:text-[10px] lg:text-xs font-black uppercase tracking-widest transition-all text-center whitespace-nowrap border-b-2 ${
                       selectedTrack === track
                         ? 'bg-[#00e5ff]/10 text-[#00e5ff] border-[#00e5ff]'
                         : hasPrediction 
                           ? 'bg-transparent text-white border-white/20 hover:bg-white/5 hover:border-white/40'
                           : 'bg-transparent text-gray-600 border-transparent hover:bg-white/5 opacity-50'
                     }`}
                   >
                     {track}
                   </button>
                 );
              })}
           </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center relative z-10">
          <div className="w-full md:w-1/2 relative z-10">
            <div className="border-l-4 border-[#00e5ff] pl-8 mb-6 md:mb-10">
              <h2 className="text-5xl font-black italic tracking-tighter mb-4">
                Güncel <span className="text-gray-400">Tahminler</span>
              </h2>
            </div>

            {latestPrediction ? (
              <motion.div 
                key={latestPrediction.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate(`/tahmin/${latestPrediction.slug}`)}
                className="bg-[#0a0a0a] rounded-3xl md:rounded-[40px] p-8 md:p-12 border border-white/5 shadow-2xl relative cursor-pointer group hover:border-[#00e5ff]/30 transition-all"
              >
                <div className="absolute top-6 right-6 md:top-12 md:right-12 flex space-x-2">
                  <button className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#00e5ff] transition-colors group">
                    <ChevronLeft size={16} className="group-hover:scale-125 transition-transform text-white/50 group-hover:text-black" />
                  </button>
                  <button className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#00e5ff] transition-colors group">
                    <ChevronRight size={16} className="group-hover:scale-125 transition-transform text-white/50 group-hover:text-black" />
                  </button>
                </div>

                <div className={`flex flex-col mb-8 md:mb-12 ${!showContent ? 'blur-sm opacity-50 select-none' : ''}`}>
                  <span className="text-4xl md:text-6xl font-black text-white/5 absolute top-10 right-10 md:top-20 md:right-20 pointer-events-none">NEW</span>
                  <h3 className="text-2xl md:text-3xl font-black italic mb-2 tracking-tight">
                      {latestPrediction.title}
                  </h3>
                  <p className="text-[#00e5ff] text-lg md:text-xl font-black italic">{latestPrediction.subTitle}</p>
                </div>

                <div className="relative">
                  <div className={`${!showContent ? 'blur-md opacity-30 select-none pointer-events-none' : ''}`}>
                    {latestPrediction.ayaklar && latestPrediction.ayaklar.length > 0 && (
                      <div className="mb-8 w-full overflow-x-auto rounded-xl border border-[#00e5ff] relative bg-[#050A14]">
                        {/* Background Watermark */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.03] overflow-hidden">
                           <span className="text-white font-black text-6xl md:text-8xl -rotate-12 whitespace-nowrap">ALTILIYAKALATANADAM.COM</span>
                        </div>

                        <div className="relative z-10">
                          <div className="bg-[#0B1526] flex flex-col justify-center items-center py-3 border-b border-[#00e5ff]/30">
                            <span className="text-[#00e5ff] font-black tracking-widest text-lg md:text-xl uppercase">ALTILIYAKALATANADAM</span>
                            <span className="text-white font-bold tracking-widest text-xs md:text-sm uppercase mt-1">
                              {latestPrediction.track ? `${latestPrediction.track} ` : ''}AGF TABLOSU
                            </span>
                          </div>
                          <div className="grid grid-cols-6 divide-x divide-[#00e5ff]/30 min-w-[500px]">
                            {latestPrediction.ayaklar.slice(0, 6).map((a: string, i: number) => {
                              const horseLines = typeof a === 'string' ? a.split('\n').map(line => line.trim()).filter(Boolean) : [];
                              return (
                                <div key={i} className="flex flex-col">
                                  <div className="bg-[#00e5ff] text-black text-center py-1 text-xs md:text-sm font-black border-b border-[#0B1526]">
                                    {i + 1}. AYAK
                                  </div>
                                  <div className="bg-[#0B1526] text-white text-center py-0.5 text-[10px] md:text-xs font-bold shadow-inner border-b border-white/5">
                                    AT NO
                                  </div>
                                  <div className="flex flex-col p-2 space-y-2 flex-1 bg-transparent">
                                    {horseLines.map((line, idx) => (
                                      <div key={idx} className="flex items-center space-x-2 text-xs md:text-sm relative z-20">
                                        <span className="font-bold text-white w-4 text-right shrink-0">{idx + 1}</span>
                                        <span className={`font-bold tabular-nums truncate ${idx === 0 ? 'text-[#00e5ff]' : 'text-gray-300'}`}>{line}</span>
                                      </div>
                                    ))}
                                    {horseLines.length === 0 && (
                                      <div className="text-gray-600 text-xs text-center italic py-2 relative z-20">Belirtilmedi</div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {!showContent && (
                    <div className="absolute inset-0 flex items-center justify-center p-4 z-20">
                      <div className="bg-black/90 p-8 rounded-2xl border border-[#00e5ff]/20 text-center shadow-2xl">
                          <Lock size={40} className="text-[#00e5ff] mx-auto mb-4" />
                          <h4 className="font-bold mb-2">İçerik Kilitli</h4>
                          <button onClick={(e) => { e.stopPropagation(); navigate('/vip'); }} className="text-[#00e5ff] font-black underline text-sm uppercase">VIP Üye Ol</button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center space-y-6 sm:space-y-0 sm:space-x-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Yorumcu</span>
                    <span className="text-lg md:text-xl font-black italic">{latestPrediction.authorName || 'ALTILIYAKALATANADAM'}</span>
                    <span className="text-[10px] text-[#00e5ff] uppercase font-bold tracking-tight">At Yarışı Tahmincisi & Yarış Yazarı</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-2 md:mt-0">
                    <Apple size={20} className="text-white/20" />
                    <Smartphone size={20} className="text-white/20" />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#0a0a0a] rounded-3xl md:rounded-[40px] p-8 md:p-12 border border-white/5 shadow-2xl relative flex flex-col items-center justify-center min-h-[300px]"
              >
                 <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <Smartphone size={24} className="text-gray-500" />
                 </div>
                 <h3 className="text-xl font-black italic text-gray-400 mb-2">Tahmin Bekleniyor</h3>
                 <p className="text-sm text-gray-500 text-center">Bu pist ({selectedTrack}) için şu an güncel bir tahmin bulunmuyor. Lütfen daha sonra tekrar kontrol edin veya diğer pistleri inceleyin.</p>
              </motion.div>
            )}
          </div>

          <div className="w-full md:w-1/2 mt-12 md:mt-0 relative">
             <div className="absolute inset-0 bg-radial from-[#00e5ff]/20 to-transparent blur-3xl pointer-events-none" />
             <motion.img 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              src="https://picsum.photos/seed/tipster/800/800" 
              alt="Tipster" 
              className="w-full max-w-md mx-auto rounded-[60px] shadow-2xl relative z-10 border-4 border-white/5"
              referrerPolicy="no-referrer"
             />
          </div>
        </div>
      </section>
      <LatestPosts />
      <Testimonials />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#080d16] text-white selection:bg-[#00e5ff] selection:text-white">
        <Routes>
          <Route path="/" element={<><Header /><main><HomePage /></main><Footer /></>} />
          <Route path="/kayit-ol" element={<Register />} />
          <Route path="/giris-yap" element={<Login />} />
          <Route path="/odeme-bildirimi" element={<PaymentNotification />} />
          <Route path="/tahminler" element={<Predictions />} />
          <Route path="/basarili-tahminler" element={<PastSuccess />} />
          <Route path="/tahmin/:slug" element={<PredictionDetail />} />
          <Route path="/bilgilerim" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/iletisim" element={<Contact />} />
          <Route path="/vip" element={<VipPage />} />
          <Route path="/yasal/:slug" element={<LegalPageWrapper />} />
          <Route path="/kurumsal/:slug" element={<CompliancePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
