import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Header from './components/Header';
import Footer from './components/Footer';

function HomePage() {
  return (
    <div className="min-h-screen bg-[#080d16] text-white flex flex-col items-center justify-center p-20 text-center">
      <h1 className="text-6xl font-black italic mb-4">ALTILIYAKALATANADAM<span className="text-[#00e5ff]">.com</span></h1>
      <p className="text-xl text-gray-400 max-w-2xl">Sistem temizliği yapıldı. Giriş ve Kayıt sistemini test edebilirsiniz.</p>
    </div>
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
          {/* Diğer sayfaları korumak isterseniz burayı sonra tekrar doldururuz */}
          <Route path="*" element={<><Header /><main><HomePage /></main><Footer /></>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
