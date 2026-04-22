/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { dbService } from '../services/dbService';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../lib/utils';
import { APP_LOGO_URL } from '../constants';

export default function SuccessTable() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [successList, setSuccessList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dbService.getPredictions('success', profile?.role || 'user', profile?.isVip || false);
        setSuccessList(data.slice(0, 6)); // show latest 6 to fill grid
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="bg-[#050505] py-20 px-4 overflow-hidden relative">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8 border-b border-white/10 pb-8">
          <div className="flex flex-col">
             <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-medium">Başarı İstatistikleri</span>
             <h2 className="text-3xl md:text-5xl font-light tracking-tight text-white m-0">
               Kazandıran Tahminler
             </h2>
          </div>
          
          <div className="md:max-w-md pl-6 border-l border-white/20 h-full flex flex-col justify-center">
            <p className="text-gray-400 text-sm font-light leading-relaxed">
               Bugüne kadar <span className="text-white font-medium">5.791</span> koşuda isabet sağlandı.
               Toplam <span className="text-white font-medium">6.177.230,75 TL</span> ikramiye dağıtıldı.
            </p>
          </div>
        </div>

        {/* Table Area */}
        <div className="w-full bg-[#0a0a0a] rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-gray-500 font-medium">
                  <th className="px-8 py-6">Tarih</th>
                  <th className="px-8 py-6">Yorumcu</th>
                  <th className="px-8 py-6">Koşu Adı</th>
                  <th className="px-8 py-6 text-right">İkramiye</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center text-gray-500 font-light">Veriler yükleniyor...</td>
                </tr>
              ) : successList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center text-gray-500 font-light">Kayıtlı veri bulunamadı.</td>
                </tr>
              ) : (
                successList.map((p, i) => (
                  <motion.tr 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => navigate(`/tahmin/${p.slug}`)}
                    className="hover:bg-white/5 cursor-pointer transition-colors group"
                  >
                    <td className="px-8 py-6 font-light text-gray-300">
                       {formatDate(p.createdAt)}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 rounded-full overflow-hidden bg-[#111]">
                          <img src={p.image || APP_LOGO_URL} alt={p.authorName} referrerPolicy="no-referrer" className="w-full h-full object-cover opacity-80" />
                        </div>
                        <span className="font-light text-gray-200">{p.authorName || 'Uzman Analist'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-3">
                        <span className="font-light text-gray-200">{p.title}</span>
                        {p.resultStatus === 'won' && (
                          <span className="bg-white/10 text-white text-[9px] font-medium uppercase px-2 py-1 rounded-sm tracking-wider">Tuttu</span>
                        )}
                        {p.resultStatus === 'partial' && (
                          <span className="bg-white/5 text-gray-400 text-[9px] font-medium uppercase px-2 py-1 rounded-sm tracking-wider">Kısmen</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right font-medium text-white tracking-wide">
                      {p.winnings || '0,00 TL'}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        </div>

      </div>
    </section>
  );
}

