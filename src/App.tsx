/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Apple, Smartphone, Lock } from 'lucide-react';
import { motion } from 'motion/react';

// Components
import Header from './components/Header';
import Slider from './components/Slider';
import FeatureCards from './components/FeatureCards';
import SuccessTable from './components/SuccessTable';
import LatestPosts from './components/LatestPosts';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';

// Pages
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
import LegalPage from './pages/LegalPage';

// Services & Context
import { dbService } from './services/dbService';
import { useAuth } from './context/AuthContext';

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
    return <div className="text-white p-20 text-center uppercase font-black italic">Sayfa bulunamadı.</div>;
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
  const { profile } = useAuth();

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
  const showContent = latestPrediction?.isPublic || profile?.isVip || profile?.role === 'admin';

  return (
    <>
      <Slider />
      <FeatureCards />
      <SuccessTable />
      
      <section className="bg-[#080d16] py-24 px-4 overflow-hidden relative">
        <div 
          className="absolute right-0 top-0 bottom-0 w-2/3 bg-cover bg-left opacity-20 blur-sm brightness-50" 
          style={{ backgroundImage: 'url("https://picsum.photos/seed/horseracing/1920/1080")' }} 
        />
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#080d16] to-transparent" />

        <div className="max-w-7xl mx-auto flex flex-col items-center relative z-10 mb-12">
           <div className="w-full flex-wrap md:flex-nowrap flex justify-center md:justify-between gap-2 border-b border-white/5 pb-8 mb-12">
              {TRACKS.map(track => {
                 const hasPrediction = predictions.some(p => (p.track || 'İstanbul') === track);
                 return (
                   <button
                     key={track}
                     onClick={() => setSelectedTrack(track)}
                     className={`flex-1 px-4 py-4 rounded-2xl text-[10px] lg:text-xs font-black uppercase tracking-widest transition-all text-center whitespace-nowrap border-b-2 ${
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

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start gap-16 relative z-10">
          <div className="w-full md:w-1/2 relative z-10">
            <div className="border-l-4 border-[#00e5ff] pl-8 mb-10">
              <h2 className="text-5xl md:text-6xl font-black italic tracking-tighter leading-none mb-2">
                Güncel <span className="text-gray-400">Tahminler</span>
              </h2>
              <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]">Profesyonel Yarış Analizleri</p>
            </div>

            {latestPrediction ? (
              <motion.div 
                key={latestPrediction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0a0a0a] rounded-[40px] p-8 md:p-12 border border-white/5 shadow-2xl relative group"
              >
                <div className="absolute top-0 right-12 translate-y-[-50%] bg-[#00e5ff] text-black px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl">
                  {latestPrediction.date || 'BUGÜN'}
                </div>

                <div className="flex flex-col md:flex-row justify-between mb-8 pb-8 border-b border-white/5">
                  <div>
                    <h3 className="text-3xl font-black italic mb-1">{latestPrediction.track}</h3>
                    <p className="text-[#00e5ff] font-bold text-xs uppercase tracking-widest">Günün Başlama Saati: {latestPrediction.startTime || '14:00'}</p>
                  </div>
                </div>

                <div className="relative mb-8 min-h-[300px]">
                  <div className={`transition-all duration-700 ${showContent ? 'blur-0 opacity-100' : 'blur-xl opacity-20 pointer-events-none'}`}>
                     <div className="space-y-6">
                        {latestPrediction.content?.split('\n').map((line: string, i: number) => (
                           <p key={i} className="text-gray-400 leading-relaxed font-medium">{line}</p>
                        ))}
                        {/* If formatted content exists */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           {[1,2,3,4,5,6].map(raceNum => {
                              const raceKey = `race${raceNum}`;
                              const raceData = latestPrediction[raceKey];
                              if (!raceData) return null;
                              return (
                                 <div key={raceNum} className="bg-[#151b27] p-4 rounded-2xl border border-white/5">
                                    <span className="text-[10px] font-black text-[#00e5ff] uppercase mb-2 block">{raceNum}. AYAK</span>
                                    <div className="flex flex-wrap gap-2">
                                       {raceData.split(/[,\s]+/).map((horse: string, hi: number) => (
                                          <span key={hi} className="bg-black/40 px-3 py-1 rounded-lg text-xs font-bold border border-white/5">{horse}</span>
                                       ))}
                                    </div>
                                 </div>
                              );
                           })}
                        </div>
                     </div>
                  </div>

                  {!showContent && (
                    <div className="absolute inset-0 flex items-center justify-center p-4 z-20">
                      <div className="bg-black/90 p-10 rounded-3xl border border-[#00e5ff]/20 text-center shadow-2xl backdrop-blur-md">
                          <div className="w-16 h-16 bg-[#00e5ff]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Lock size={32} className="text-[#00e5ff]" />
                          </div>
                          <h4 className="text-2xl font-black italic mb-4">İçerik Kilitli</h4>
                          <p className="text-gray-400 text-sm mb-8 max-w-[240px]">Bu analizin tamamını görmek için VIP üyeliğinizin olması gerekmektedir.</p>
                          <button 
                            onClick={(e) => { e.stopPropagation(); navigate('/vip'); }} 
                            className="bg-[#00e5ff] text-black px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-transform"
                          >
                            VIP Üye Ol
                          </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-8 border-t border-white/5">
                  <div className="flex items-center space-x-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Yorumcu</span>
                      <span className="text-lg md:text-xl font-black italic">{latestPrediction.authorName || 'ALTILIYAKALATANADAM'}</span>
                    </div>
                    <div className="h-10 w-px bg-white/5 hidden sm:block"></div>
                    <div className="flex items-center space-x-2">
                      <Apple size={18} className="text-white/10" />
                      <Smartphone size={18} className="text-white/10" />
                    </div>
                  </div>
                  
                  <button onClick={() => navigate(`/tahmin/${latestPrediction.id}`)} className="mt-4 sm:mt-0 text-[#00e5ff] text-xs font-black uppercase tracking-widest hover:underline underline-offset-8 transition-all">
                    Detaylı Analiz
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#0a0a0a] rounded-[40px] p-16 border border-white/5 shadow-2xl relative flex flex-col items-center justify-center text-center"
              >
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <Smartphone size={32} className="text-gray-600" />
                  </div>
                  <h3 className="text-2xl font-black italic text-gray-400 mb-3">Tahmin Bekleniyor</h3>
                  <p className="text-gray-500 text-sm max-w-sm leading-relaxed">Bu pist ({selectedTrack}) için şu an güncel bir tahmin girişi yapılmamıştır. Diğer pistleri inceleyebilir veya daha sonra tekrar kontrol edebilirsiniz.</p>
              </motion.div>
            )}
          </div>

          <div className="w-full md:w-1/2 relative hidden md:block">
             <div className="absolute inset-0 bg-[#00e5ff]/5 blur-[120px] rounded-full" />
             <div className="relative z-10">
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <img 
                    src="https://picsum.photos/seed/tipster/800/800" 
                    alt="Analist" 
                    className="w-full max-w-md mx-auto rounded-[60px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/10"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
                
                {/* Float Card */}
                <div className="absolute -bottom-6 -right-6 bg-[#00e5ff] p-8 rounded-[32px] text-black shadow-2xl max-w-[200px]">
                   <span className="text-4xl font-black italic block mb-1">98%</span>
                   <span className="text-[10px] font-black uppercase tracking-widest">İsabet Oranı İle Analiz</span>
                </div>
             </div>
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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/giris" element={<Login />} />
          <Route path="/kayit" element={<Register />} />
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
          <Route path="*" element={<><Header /><main><HomePage /></main><Footer /></>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
