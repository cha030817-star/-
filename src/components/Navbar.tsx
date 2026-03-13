import { motion } from 'motion/react';
import { Coins, Shield, TrendingUp, MapPin, Phone, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: '시세조회', href: '#prices' },
    { name: '주요서비스', href: '#services' },
    { name: '금투자상담', href: '#consultant' },
    { name: '오시는길', href: '#location' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 gold-gradient rounded-lg flex items-center justify-center">
              <Coins className="text-black" size={24} />
            </div>
            <span className="text-xl font-bold tracking-tighter gold-text-gradient">
              국제퍼스트 금거래소
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-zinc-400 hover:text-gold transition-colors"
              >
                {item.name}
              </a>
            ))}
            <button className="px-5 py-2 rounded-full gold-gradient text-black text-sm font-bold hover:scale-105 transition-transform">
              상담 예약
            </button>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-zinc-400">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-zinc-900 border-b border-white/10 px-4 py-6 flex flex-col gap-4"
        >
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium text-zinc-300"
            >
              {item.name}
            </a>
          ))}
          <button className="w-full py-3 rounded-xl gold-gradient text-black font-bold">
            상담 예약
          </button>
        </motion.div>
      )}
    </nav>
  );
}
