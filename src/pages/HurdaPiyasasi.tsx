/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const scrapData = [
    { t: "Bakır Hurdası", i: [{ n: "Soyulmuş Bakır", p: 552.15 }, { n: "Lama Bakır İmalat", p: 522.34 }, { n: "Boru Bakır", p: 510.24 }, { n: "Yanık Bakır", p: 500.84 }, { n: "Soyma Bakır Fiyatı", p: 532.64 }, { n: "Hurda Bakırlı Petek", p: 228.24 }] },
    { t: "Sarı (Pirinç)", i: [{ n: "Sarı Hurda Araiş", p: 342.24 }, { n: "Musluk Hurdası", p: 320.34 }, { n: "Pirinç Araiş", p: 350.04 }, { n: "Batarya Vana Su Saati", p: 290.11 }, { n: "Sarı Talaşı", p: 350.17 }, { n: "Ms 58 - 64 - 70", p: 390.32 }] },
    { t: "Demir Grubu", i: [{ n: "DKP Demir", p: 12.20 }, { n: "Ekstra Demir", p: 11.17 }, { n: "Toplama Demir", p: 10.54 }, { n: "Mahalle Hurdası", p: 10.51 }, { n: "1. Grup Demir", p: 11.23 }, { n: "Teneke Hurdası", p: 3.05 }] },
    { t: "Kablo Çeşitleri", i: [{ n: "Soyulmamış Kablo", p: 358.11 }, { n: "Ttr Hurda Kablo", p: 350.00 }, { n: "Nya Kablo Hurda", p: 470.10 }, { n: "Tekdamar Kalın", p: 510.00 }, { n: "Karışık Bakır Kablo", p: 350.82 }] },
    { t: "Alüminyum", i: [{ n: "Hurda Alüminyum", p: 99.11 }, { n: "Ofset Matbaa Kalıbı", p: 85.50 }, { n: "Profil Alüminyum", p: 99.10 }, { n: "Alüminyum Talaş", p: 68.18 }, { n: "Jant Alüminyum", p: 95.19 }] },
    { t: "Krom (Paslanmaz)", i: [{ n: "304 Paslanmaz Krom", p: 48.16 }, { n: "316 Paslanmaz Krom", p: 80.50 }, { n: "Paslanmaz Çelik", p: 47.11 }, { n: "Krom Talaşı", p: 46.18 }, { n: "Karışık Krom", p: 48.19 }] },
    { t: "Akü Hurdası", i: [{ n: "Kuru Akü", p: 28.11 }, { n: "Jel Akü", p: 28.47 }, { n: "Sulu Akü", p: 28.50 }, { n: "Büyük Amper Akü", p: 29.50 }, { n: "Küçük Akü", p: 27.20 }] },
    { t: "Kurşun Grubu", i: [{ n: "Levha Kurşun", p: 95.01 }, { n: "Çatı Sökümü Kurşun", p: 92.50 }, { n: "Külçe Kurşun", p: 75.50 }, { n: "Boru Kurşun", p: 70.00 }, { n: "Karışık Kurşun", p: 73.15 }] },
    { t: "Çinko Hurdası", i: [{ n: "Levha Çıkma Çinko", p: 90.11 }, { n: "Karışık Çinko", p: 70.30 }, { n: "Çatı Minare Sökümü", p: 70.26 }, { n: "Külçe Çinko", p: 70.50 }, { n: "Zamak Hurdası", p: 82.00 }] },
    { t: "Kağıt & Karton", i: [{ n: "Karton Hurdası", p: 6.60 }, { n: "A4 Beyaz Kağıt", p: 7.50 }, { n: "Kitap / Dergi", p: 6.20 }, { n: "Gazete Hurdası", p: 5.80 }, { n: "Arşiv Kağıdı", p: 7.10 }] },
    { t: "Plastik Hurdası", i: [{ n: "Pimapen Hurdası", p: 18.00 }, { n: "Naylon Hurdası", p: 14.50 }, { n: "Pvc Boru Hurdası", p: 8.50 }, { n: "Plastik Kasa", p: 9.00 }, { n: "Şeffaf Naylon", p: 15.50 }] },
    { t: "Motor & Kompresör", i: [{ n: "Buzdolabı Motoru", p: 25.00 }, { n: "Elektrik Motoru", p: 32.50 }, { n: "Klima Kompresörü", p: 28.00 }, { n: "Büyük Sanayi Motor", p: 38.00 }, { n: "Çamaşır Mak. Motor", p: 22.00 }] },
    { t: "Petekler & Radyatör", i: [{ n: "Bakırlı Petek", p: 285.00 }, { n: "Alüminyum Petek", p: 65.00 }, { n: "Klima Radyatörü", p: 110.00 }, { n: "Oto Radyatör", p: 95.00 }, { n: "Demir Radyatör", p: 7.50 }] },
    { t: "Şantiye & Yıkım", i: [{ n: "Şantiye Hurdası", p: 14.50 }, { n: "İnşaat Demiri", p: 13.80 }, { n: "Çelik Halat", p: 10.00 }, { n: "Sandviç Panel", p: 15.50 }, { n: "Konteyner Hurdası", p: 11.50 }] },
    { t: "Özel Hurdalar", i: [{ n: "Matbaa Kalıbı", p: 135.00 }, { n: "X-Ray Film", p: 450.00 }, { n: "Elektronik Kart", p: 85.00 }, { n: "Bilgisayar Hurdası", p: 120.00 }, { n: "Nikel Hurdası", p: 410.00 }] }
];

export default function HurdaPiyasasi() {
  const [time, setTime] = useState(new Date().toLocaleTimeString('tr-TR'));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('tr-TR'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-slate-200 font-sans p-2 md:p-6">
      <Header />
      
      <main className="max-w-7xl mx-auto py-12">
        <header className="bg-gradient-to-r from-black to-[#111827] border-b-4 border-emerald-500 shadow-[0_4px_20px_rgba(16,185,129,0.2)] mb-8 p-4 md:p-6 flex flex-col md:flex-row justify-between items-center rounded-xl gap-4">
            <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
                <div className="h-10 md:h-14 w-1.5 md:w-2 bg-emerald-500 rounded-full animate-pulse shrink-0"></div>
                <div>
                    <h1 className="text-xl md:text-4xl font-black text-white italic tracking-tighter uppercase leading-tight">HURDA <span className="text-emerald-500">MERKEZİ</span></h1>
                    <p className="text-slate-500 text-[10px] md:text-xs font-bold tracking-wider md:tracking-[0.3em] uppercase">15 Kategori • Canlı Veri</p>
                </div>
            </div>
            <div className="bg-black/40 p-3 md:p-4 rounded-lg border border-slate-800 text-center md:text-right w-full md:w-auto">
                <div className="text-2xl md:text-3xl font-mono text-emerald-500 font-black tracking-widest leading-none">{time}</div>
                <div className="text-[9px] md:text-[11px] text-slate-500 font-bold uppercase mt-1">21 NİSAN 2026 SALI</div>
            </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
          {scrapData.map((cat, idx) => (
            <div key={idx} className="bg-[#111827] border border-[#1f2937] rounded-md overflow-hidden flex flex-col shadow-2xl h-full">
              <div className="bg-[#10b981] color-white p-[10px] font-black uppercase text-[13px] text-center tracking-[1px] border-b-2 border-black/10">
                {cat.t}
              </div>
              <table className="w-full border-collapse grow">
                <tbody>
                  {cat.i.map((item, iIdx) => (
                    <tr key={iIdx} className="border-b border-[#1f2937] hover:bg-[#1f2937] transition-all">
                      <td className="p-3 text-[12px] font-semibold text-[#94a3b8] w-[65%] leading-tight">
                        {item.n}
                        <span className="block text-[10px] color-[#10b981] font-black mt-[3px]">
                          Alım Oranı: ₺{(item.p * 0.88).toFixed(2)}
                        </span>
                      </td>
                      <td className="p-3 text-right text-[14px] font-black text-white w-[35%]">
                        {item.p.toFixed(2)} <span className="text-[9px] text-[#10b981] font-bold ml-1 italic font-sans uppercase">TL</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        <footer className="mt-12 p-6 text-center border-t border-slate-800 text-slate-500 text-xs font-medium">
            Bu paneldeki "Makul Oranlar" piyasa ortalamasından %12 düşülerek (Lojistik/İşçilik/Kâr) hesaplanmıştır. 
            <br />Anlık veriler saatlik olarak güncellenmektedir.
        </footer>
      </main>

      <Footer />
    </div>
  );
}
