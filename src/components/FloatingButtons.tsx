import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function FloatingButtons() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth',
        });
    };

    const handleWhatsAppClick = () => {
        window.open('https://wa.me/905336711463', '_blank');
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-center space-y-4">
            {/* Scroll Buttons Container - Visible when scrolled down */}
            <AnimatePresence>
                {isVisible && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="flex flex-col space-y-3"
                    >
                        {/* Scroll Up Button */}
                        <button
                            onClick={scrollToTop}
                            className="w-12 h-12 bg-[#020f3a]/80 backdrop-blur-md border border-white/10 text-white rounded-2xl flex items-center justify-center hover:bg-[#ffcc00] hover:text-[#010a26] transition-all shadow-2xl group"
                            title="Yukarı Çık"
                        >
                            <ChevronUp size={24} className="group-hover:-translate-y-1 transition-transform" />
                        </button>

                        {/* Scroll Down Button */}
                        <button
                            onClick={scrollToBottom}
                            className="w-12 h-12 bg-[#020f3a]/80 backdrop-blur-md border border-white/10 text-white rounded-2xl flex items-center justify-center hover:bg-[#ffcc00] hover:text-[#010a26] transition-all shadow-2xl group"
                            title="Aşağı İn"
                        >
                            <ChevronDown size={24} className="group-hover:translate-y-1 transition-transform" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Fixed WhatsApp Button - Always Visible */}
            <button
                onClick={handleWhatsAppClick}
                className="w-16 h-16 bg-[#25D366] text-white rounded-[24px] flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.4)] hover:scale-110 active:scale-95 transition-all group relative"
                title="WhatsApp Destek"
            >
                <div className="absolute inset-0 bg-[#25D366]/20 rounded-[24px] animate-ping" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-10 h-10 relative z-10" referrerPolicy="no-referrer" />
                
                {/* Notification Badge */}
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-lg animate-bounce z-20">1</span>
                
                {/* Tooltip */}
                <div className="absolute right-20 bg-[#0a1b5d] text-white px-4 py-2 rounded-xl text-[10px] font-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl border border-white/10 uppercase tracking-widest italic">
                   Bize Ulaşın
                </div>
            </button>
        </div>
    );
}
