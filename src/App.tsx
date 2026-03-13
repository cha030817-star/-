import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Menu, 
  X, 
  ChevronRight, 
  Grid2X2, 
  Grid3X3, 
  Eye, 
  EyeOff,
  Instagram,
  MessageCircle,
  Phone,
  ArrowRight,
  User,
  Settings,
  Plus,
  Trash2,
  Edit2,
  LogOut,
  ChevronDown,
  Globe,
  Plane
} from 'lucide-react';
import { SAMPLE_PRODUCTS, SAMPLE_GOLD_PRICES, SAMPLE_INTERNATIONAL_PRICE, SAMPLE_NEWS, TRANSLATIONS } from './constants';
import { Product, Category, Post, GoldPrice, InternationalPrice, Language, Consultation, Popup, NewsItem } from './types';
import { PriceSection } from './components/PriceSection';
import { AdminPanel } from './components/AdminPanel';

// --- Components ---

const Logo = ({ logoUrl, siteName, variant = 'full' }: { logoUrl?: string; siteName?: string; variant?: 'full' | 'simple' }) => {
  const [imageError, setImageError] = React.useState(false);

  useEffect(() => {
    setImageError(false);
  }, [logoUrl]);

  const displayLogo = !imageError && (logoUrl || 'https://i.ibb.co/ZzKvrFRW/1.png');
  const finalLogoUrl = logoUrl || 'https://i.ibb.co/ZzKvrFRW/1.png';

  if (variant === 'simple') {
    return (
      <div className="flex items-center gap-2 group cursor-pointer">
        {displayLogo ? (
          <img 
            src={finalLogoUrl} 
            alt="IFGE Logo" 
            className="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-8 h-8 md:w-10 md:h-10 gold-gradient rounded-full flex items-center justify-center">
            <span className="text-black font-bold text-[10px] md:text-xs">IF</span>
          </div>
        )}
        <span className="text-lg md:text-xl font-bold tracking-tighter gold-text-gradient">IFGE</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 md:gap-4 group cursor-pointer">
      <div className="relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center">
        {displayLogo ? (
          <img 
            src={finalLogoUrl} 
            alt={siteName || "International First Gold Exchange"} 
            className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full gold-gradient rounded-xl flex items-center justify-center border-2 border-white/20">
            <span className="text-black font-black text-xl">IF</span>
          </div>
        )}
      </div>
      
      <div className="flex flex-col justify-center">
        <h1 className="text-lg md:text-xl font-bold tracking-tight text-white leading-tight">
          국제퍼스트금거래소
        </h1>
        <span className="text-[10px] md:text-xs text-zinc-500 font-light tracking-wide">
          International First Gold Exchange Co., Ltd.
        </span>
      </div>
    </div>
  );
};

const Header = ({ 
  onAdminClick, 
  lang, 
  setLang,
  onLogoClick,
  logoUrl,
  siteName
}: { 
  onAdminClick: () => void;
  lang: Language;
  setLang: (l: Language) => void;
  onLogoClick: () => void;
  logoUrl?: string;
  siteName?: string;
}) => {
  const t = TRANSLATIONS[lang];
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/5">
      <div className="w-full px-2 md:px-4 h-24 flex items-center justify-between">
        <div onClick={onLogoClick}>
          <Logo logoUrl={logoUrl} siteName={siteName} />
        </div>
        
        <nav className="hidden lg:flex items-center gap-10">
          <a href="#gold-price" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-gold transition-colors">
            {t.goldPrice}
          </a>
          <a href="#products" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-gold transition-colors">
            {t.products}
          </a>
          <a href="#company" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-gold transition-colors">
            회사소개
          </a>
          <a href="#location" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-gold transition-colors">
            오시는 길
          </a>
          
          <div className="flex items-center gap-4 border-l border-white/10 pl-10">
            <button 
              onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}
              className="flex items-center gap-2 text-[10px] font-black text-zinc-500 hover:text-gold transition-colors uppercase tracking-tighter"
            >
              <Globe size={14} /> {lang}
            </button>
            <button 
              onClick={onAdminClick}
              className="p-2 text-zinc-500 hover:text-gold transition-colors"
            >
              <User size={20} />
            </button>
          </div>
        </nav>

        <button className="lg:hidden text-white">
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
};

const Hero = ({ lang, setActiveCategory }: { lang: Language, setActiveCategory: (c: string) => void }) => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden py-24">
      {/* Background with Earth at night visual */}
      <div className="absolute inset-0 z-0 bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black z-10" />
        <img 
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2944&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="Economic and Financial Market" 
          className="w-full h-full object-cover opacity-40 scale-105 animate-pulse-slow"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="relative z-20 text-center px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-7xl font-light tracking-tighter mb-4 leading-tight">
            가장 가치 있는 순간<br />
            <span className="gold-text-gradient font-semibold">국제퍼스트와 함께합니다</span>
          </h2>
          <p className="text-zinc-400 text-lg md:text-xl font-light mb-10 max-w-2xl mx-auto">
            신뢰와 전문성을 바탕으로 안전한 금 거래 서비스를 제공합니다.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => {
                setActiveCategory('전체');
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 gold-gradient text-black font-semibold rounded-full hover:scale-105 transition-transform flex items-center gap-2"
            >
              제품 둘러보기 <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => {
                document.getElementById('consultation')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-medium rounded-full border border-white/20 hover:bg-white/20 transition-all"
            >
              상담 예약하기
            </button>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-zinc-500">
        <ChevronDown size={32} />
      </div>
    </section>
  );
};

const CategoryNav = ({ 
  activeCategory, 
  setActiveCategory,
  categories
}: { 
  activeCategory: string; 
  setActiveCategory: (c: string) => void;
  categories: Category[];
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [planePos, setPlanePos] = useState({ x: 0, y: 0 });
  const [prevPos, setPrevPos] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const activeBtn = containerRef.current?.querySelector(`[data-category="${activeCategory}"]`) as HTMLElement;
    if (activeBtn) {
      const newX = activeBtn.offsetLeft + activeBtn.offsetWidth / 2;
      setPrevPos(planePos);
      setPlanePos({ x: newX, y: 0 });
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 800);
      return () => clearTimeout(timer);
    }
  }, [activeCategory]);

  return (
    <div className="py-8 bg-black flex flex-col items-center border-b border-white/5">
      <div ref={containerRef} className="relative flex items-center gap-4 bg-zinc-900/30 p-2 rounded-2xl border border-white/5 backdrop-blur-sm">
        {/* Curved Flight Path Trail */}
        <AnimatePresence>
          {isAnimating && (
            <motion.svg 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none overflow-visible"
              style={{ height: '100px', top: '-60px' }}
            >
              <motion.path
                d={`M ${prevPos.x} 80 Q ${(prevPos.x + planePos.x) / 2} 0 ${planePos.x} 80`}
                fill="none"
                stroke="url(#trail-grad)"
                strokeWidth="2"
                strokeDasharray="4 4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
              <defs>
                <linearGradient id="trail-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="50%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </motion.svg>
          )}
        </AnimatePresence>

        {/* Plane Icon with Curved Animation */}
        <motion.div 
          animate={{ 
            x: planePos.x - 10,
            y: isAnimating ? [-30, -70, -30] : -30,
            rotate: planePos.x > prevPos.x ? [45, 0, 45] : [-45, 0, -45]
          }}
          transition={{ 
            duration: 0.8, 
            ease: "easeInOut",
            y: { duration: 0.8, times: [0, 0.5, 1] },
            rotate: { duration: 0.8, times: [0, 0.5, 1] }
          }}
          className="absolute left-0 text-gold pointer-events-none z-20 drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]"
          style={{ top: 0 }}
        >
          <Plane size={20} />
        </motion.div>

        {['전체', ...categories.map(c => c.name)].map((cat) => (
          <button
            key={cat}
            data-category={cat}
            onClick={() => setActiveCategory(cat)}
            className={`relative px-8 py-4 text-xs font-bold tracking-widest uppercase transition-all duration-500 group ${
              activeCategory === cat 
                ? 'text-gold' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <span className="relative z-10">{cat}</span>
            
            {/* Hover Effect */}
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 rounded-xl transition-colors" />
            
            {/* Selected Indicator Line */}
            {activeCategory === cat && (
              <motion.div 
                layoutId="active-line"
                className="absolute bottom-0 left-4 right-4 h-0.5 gold-gradient rounded-full shadow-[0_2px_10px_rgba(212,175,55,0.5)]"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

const ProductSection = ({ 
  products, 
  activeCategory, 
  setActiveCategory,
  categories
}: { 
  products: Product[];
  activeCategory: string;
  setActiveCategory: (c: string) => void;
  categories: Category[];
}) => {
  const [gridCols, setGridCols] = useState(4);
  const [showPrice, setShowPrice] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    if (activeCategory === '전체') return products;
    const category = categories.find(c => c.name === activeCategory);
    return products.filter(p => p.categoryId === category?.id);
  }, [products, activeCategory, categories]);

  return (
    <section id="products" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
        <div>
          <h3 className="text-3xl font-light mb-2">
            {activeCategory === '전체' ? '프리미엄 컬렉션' : `${activeCategory} 컬렉션`}
          </h3>
          <p className="text-zinc-500">
            {activeCategory === '전체' 
              ? '국제퍼스트가 엄선한 최상의 제품들을 만나보세요.' 
              : `국제퍼스트의 최고급 ${activeCategory} 라인업입니다.`}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
            <button 
              onClick={() => setGridCols(4)}
              className={`p-2 rounded-md transition-all ${gridCols === 4 ? 'bg-zinc-800 text-gold' : 'text-zinc-500'}`}
            >
              <Grid2X2 size={18} />
            </button>
            <button 
              onClick={() => setGridCols(8)}
              className={`p-2 rounded-md transition-all ${gridCols === 8 ? 'bg-zinc-800 text-gold' : 'text-zinc-500'}`}
            >
              <Grid3X3 size={18} />
            </button>
          </div>

          <button 
            onClick={() => setShowPrice(!showPrice)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
              showPrice ? 'bg-gold/10 border-gold/30 text-gold' : 'bg-zinc-900 border-zinc-800 text-zinc-500'
            }`}
          >
            {showPrice ? <Eye size={18} /> : <EyeOff size={18} />}
            <span className="text-sm font-medium">{showPrice ? '금액 포함' : '사진만'}</span>
          </button>
        </div>
      </div>

      <motion.div 
        layout
        className={`grid gap-6 ${
          gridCols === 4 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' 
            : 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-8'
        }`}
      >
        <AnimatePresence mode='popLayout'>
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -10 }}
              className="group cursor-pointer"
              onClick={() => setSelectedProduct(product)}
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-900 border border-white/5 mb-4">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-4 py-2 bg-white text-black text-xs font-bold rounded-full">상세보기</span>
                </div>
                {product.isNew && (
                  <span className="absolute top-4 left-4 px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded uppercase tracking-widest">New</span>
                )}
                {product.isBest && (
                  <span className="absolute top-4 left-4 px-2 py-1 bg-gold text-black text-[10px] font-bold rounded uppercase tracking-widest">Best</span>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-gold font-bold uppercase tracking-widest">
                  {categories.find(c => c.id === product.categoryId)?.name || '기타'}
                </p>
                <h4 className="text-sm font-medium text-white group-hover:text-gold transition-colors">{product.name}</h4>
                {showPrice && (
                  <p className="text-lg font-light text-zinc-300">
                    {product.price > 0 ? `₩${product.price.toLocaleString()}` : '상담문의'}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-zinc-900 rounded-3xl overflow-hidden border border-white/10 flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-6 right-6 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-white hover:text-black transition-all"
              >
                <X size={20} />
              </button>

              <div className="md:w-1/2 aspect-square md:aspect-auto">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="md:w-1/2 p-10 flex flex-col justify-center">
                <span className="text-xs font-bold text-gold uppercase tracking-widest mb-2">
                  {categories.find(c => c.id === selectedProduct.categoryId)?.name || '기타'}
                </span>
                <h3 className="text-3xl font-light mb-6">{selectedProduct.name}</h3>
                <p className="text-zinc-400 mb-8 leading-relaxed">
                  {selectedProduct.description}
                </p>
                <div className="mb-10">
                  <p className="text-sm text-zinc-500 mb-1">판매가</p>
                  <p className="text-4xl font-light text-white">
                    {selectedProduct.price > 0 ? `₩${selectedProduct.price.toLocaleString()}` : '상담문의'}
                  </p>
                </div>
                <div className="flex gap-4">
                  <button className="flex-1 py-4 gold-gradient text-black font-bold rounded-xl hover:opacity-90 transition-opacity">
                    구매하기
                  </button>
                  <button 
                    onClick={() => window.open('http://pf.kakao.com/_hBRxhX', '_blank')}
                    className="p-4 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 transition-colors"
                  >
                    <MessageCircle size={24} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

const ConsultationSection = ({ lang, onRefresh, phone, hours }: { lang: Language, onRefresh: () => void, phone?: string, hours?: string }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    content: '',
    preferredDate: '',
    photoUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      // Submit to internal API
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          createdAt: new Date().toISOString()
        })
      });

      if (!res.ok) throw new Error('상담 신청에 실패했습니다.');

      // Submit to Formspree (Optional, but keeping it as it was there)
      try {
        await fetch('https://formspree.io/f/xdawnnjp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            _subject: `New Consultation Request from ${formData.name}`
          })
        });
      } catch (e) {
        console.warn('Formspree submission failed, but internal save succeeded');
      }

      setIsSuccess(true);
      setFormData({ name: '', phone: '', email: '', content: '', preferredDate: '', photoUrl: '' });
      onRefresh(); // Refresh the consultations list for admin
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error: any) {
      console.error('Failed to submit consultation', error);
      setError(error.message || '상담 신청 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="consultation" className="py-32 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <h3 className="text-4xl font-light mb-6">전문 상담 신청</h3>
          <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
            금 거래, 투자, 맞춤 제작 등 궁금하신 점을 남겨주시면<br />
            전문 상담사가 신속하고 친절하게 답변해 드립니다.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-6 bg-zinc-900/50 rounded-2xl border border-white/5">
              <div className="w-12 h-12 gold-gradient rounded-full flex items-center justify-center text-black">
                <Phone size={24} />
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">대표 번호</p>
                <p className="text-xl font-medium">{phone || '1588-0000'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 bg-zinc-900/50 rounded-2xl border border-white/5">
              <div className="w-12 h-12 gold-gradient rounded-full flex items-center justify-center text-black">
                <Globe size={24} />
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">상담 시간</p>
                <p className="text-xl font-medium">{hours || '평일 09:00 - 18:00'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/30 p-8 md:p-12 rounded-3xl border border-white/10 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs text-zinc-500 uppercase tracking-widest ml-1">이름</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="성함을 입력해주세요"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-zinc-700 focus:border-gold/50 focus:outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-zinc-500 uppercase tracking-widest ml-1">전화번호</label>
                <input 
                  required
                  type="tel" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  placeholder="010-0000-0000"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-zinc-700 focus:border-gold/50 focus:outline-none transition-colors"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs text-zinc-500 uppercase tracking-widest ml-1">이메일</label>
                <input 
                  required
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="example@mail.com"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-zinc-700 focus:border-gold/50 focus:outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-zinc-500 uppercase tracking-widest ml-1">상담 희망 날짜</label>
                <input 
                  required
                  type="date" 
                  value={formData.preferredDate}
                  onChange={e => setFormData({...formData, preferredDate: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-zinc-700 focus:border-gold/50 focus:outline-none transition-colors"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-zinc-500 uppercase tracking-widest ml-1">사진 첨부 (URL)</label>
              <input 
                type="text" 
                value={formData.photoUrl}
                onChange={e => setFormData({...formData, photoUrl: e.target.value})}
                placeholder="이미지 URL을 입력해주세요"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-zinc-700 focus:border-gold/50 focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-zinc-500 uppercase tracking-widest ml-1">상담 내용</label>
              <textarea 
                required
                rows={4}
                value={formData.content}
                onChange={e => setFormData({...formData, content: e.target.value})}
                placeholder="문의하실 내용을 상세히 적어주세요"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-zinc-700 focus:border-gold/50 focus:outline-none transition-colors resize-none"
              />
            </div>
            
            <button 
              disabled={isSubmitting}
              className={`w-full py-5 gold-gradient text-black font-bold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? '전송 중...' : '상담 신청하기'}
              {!isSubmitting && <ArrowRight size={20} />}
            </button>

            {isSuccess && (
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-emerald-500 text-sm font-medium"
              >
                상담 신청이 완료되었습니다. 곧 연락드리겠습니다.
              </motion.p>
            )}

            {error && (
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-red-500 text-sm font-medium"
              >
                {error}
              </motion.p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

const CompanySection = ({ aboutText, aboutImageUrl }: { aboutText?: string; aboutImageUrl?: string }) => {
  const defaultText = `국제퍼스트금거래소는 국내를 넘어 해외 시장과의 직접 거래를 기반으로 보다 폭넓은 귀금속 유통 네트워크를 구축하고 있습니다. 국제 시세 흐름을 빠르게 반영하며 안정적이고 신뢰할 수 있는 거래 환경을 제공합니다.

귀금속 거래에서 가장 중요한 것은 정확성과 약속입니다. 국제퍼스트금거래소는 모든 거래 과정에서 시간 약속과 신뢰를 최우선 가치로 삼아 고객과의 약속을 철저히 지키는 운영 원칙을 이어가고 있습니다.

금, 은, 각종 귀금속 제품 거래는 물론 고객의 목적과 상황에 맞춘 맞춤형 상담까지 제공하며 보다 가치 있는 거래 경험을 만들어가고 있습니다.`;

  const paragraphs = (aboutText || defaultText).split('\n').filter(p => p.trim() !== '');

  return (
    <section id="company" className="py-32 bg-black relative overflow-hidden">
      {/* Background World Map Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1621977717126-e29965156a27?q=80&w=3199&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center mix-blend-overlay" />
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 500">
          <path d="M 100 250 Q 500 50 900 250" fill="none" stroke="#D4AF37" strokeWidth="1" strokeDasharray="5 5" className="animate-pulse" />
          <path d="M 200 350 Q 500 150 800 350" fill="none" stroke="#D4AF37" strokeWidth="1" strokeDasharray="5 5" className="animate-pulse" style={{ animationDelay: '1s' }} />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-light mb-12 gold-text-gradient font-semibold">회사소개</h2>
            <div className="space-y-8 text-zinc-400 text-lg leading-relaxed font-light">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl overflow-hidden border border-gold/20 relative group">
              <img 
                src={aboutImageUrl || "https://images.unsplash.com/photo-1589750670744-dc963320c742?q=80&w=1000&auto=format&fit=crop"} 
                alt="Gold Bars" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10">
                <p className="text-gold font-bold tracking-widest uppercase text-xs mb-2">Global Network</p>
                <p className="text-2xl font-light text-white">Trust & Excellence</p>
              </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 border border-gold/10 rounded-full animate-spin-slow pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 border border-gold/5 rounded-full animate-reverse-spin-slow pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const LocationSection = ({ address, phone, hours }: { address?: string, phone?: string, hours?: string }) => {
  return (
    <section id="location" className="py-32 bg-zinc-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-light mb-4 gold-text-gradient font-semibold">오시는 길</h2>
          <p className="text-zinc-500">국제퍼스트금거래소 방문 안내</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="rounded-3xl overflow-hidden h-[400px] border border-white/10 bg-zinc-900 relative">
            {/* Placeholder for Map */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10">
              <Globe className="text-gold/20 mb-6" size={80} />
              <p className="text-zinc-400 text-lg mb-2">서울 종로구 귀금속 전문 상권 내 위치</p>
              <p className="text-zinc-600 text-sm">방문 상담은 사전 예약제로 운영됩니다.</p>
            </div>
            <div className="absolute bottom-6 left-6 right-6 p-6 bg-black/80 backdrop-blur-md rounded-2xl border border-white/10">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gold/10 rounded-xl text-gold">
                  <Grid2X2 size={24} />
                </div>
                <div>
                  <p className="text-white font-medium mb-1">{address || '서울특별시 종로구 돈화문로 123'}</p>
                  <p className="text-zinc-500 text-sm">종로3가역 10번 출구 도보 3분</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center space-y-8">
            <div className="p-8 bg-zinc-900/50 rounded-3xl border border-white/5">
              <h4 className="text-xl font-medium mb-4 flex items-center gap-3">
                <Phone className="text-gold" size={20} />
                예약 및 상담 문의
              </h4>
              <p className="text-zinc-400 leading-relaxed mb-6">
                원활한 상담을 위해 방문 전 반드시 사전 예약을 부탁드립니다. 
                전화 또는 홈페이지 상담 신청을 통해 예약이 가능합니다.
              </p>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Direct Line</p>
                  <p className="text-2xl font-light text-white">{phone || '1588-0000'}</p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Business Hours</p>
                  <p className="text-lg font-light text-zinc-300">{hours || '09:00 - 18:00'}</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-zinc-900/50 rounded-3xl border border-white/5">
              <h4 className="text-xl font-medium mb-4 flex items-center gap-3">
                <Plane className="text-gold" size={20} />
                주차 안내
              </h4>
              <p className="text-zinc-400 leading-relaxed">
                건물 내 기계식 주차가 가능하며, 만차 시 인근 공영주차장 이용을 안내해 드립니다. 
                방문 전 연락 주시면 상세히 안내해 드리겠습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const PopupOverlay = ({ popups }: { popups: Popup[] }) => {
  const [closedPopups, setClosedPopups] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const activePopups = useMemo(() => {
    const now = new Date();
    return popups.filter(p => {
      if (!p.isActive) return false;
      if (closedPopups.includes(p.id)) return false;
      
      const start = new Date(p.startDate);
      const end = new Date(p.endDate);
      if (now < start || now > end) return false;

      const hideUntil = localStorage.getItem(`hide_popup_${p.id}`);
      if (hideUntil && new Date(hideUntil) > now) return false;

      return true;
    }).sort((a, b) => a.displayOrder - b.displayOrder);
  }, [popups, closedPopups]);

  const handleClose = (id: string, hideForDay: boolean) => {
    if (hideForDay) {
      const tomorrow = new Date();
      tomorrow.setHours(24, 0, 0, 0);
      localStorage.setItem(`hide_popup_${id}`, tomorrow.toISOString());
    }
    setClosedPopups(prev => [...prev, id]);
  };

  if (activePopups.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none">
      {activePopups.map((popup, index) => {
        const posX = isMobile ? popup.mobileX : popup.customX;
        const posY = isMobile ? popup.mobileY : popup.customY;
        const needsCentering = posX?.includes('%') || posY?.includes('%');

        return (
          <motion.div
            key={popup.id}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            style={{ 
              zIndex: 200 + index,
              left: popup.position === 'custom' ? posX : undefined,
              top: popup.position === 'custom' ? posY : undefined,
              transform: popup.position === 'custom' && needsCentering ? 'translate(-50%, -50%)' : undefined
            }}
            className={`absolute pointer-events-auto bg-zinc-900 border border-gold/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col ${
              popup.position === 'center' ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' :
              popup.position === 'bottom-left' ? 'bottom-10 left-10' :
              popup.position === 'bottom-right' ? 'bottom-10 right-10' :
              popup.position === 'top-banner' ? 'top-0 left-0 right-0 rounded-none border-x-0 border-t-0' :
              ''
            } ${
              popup.size === 'small' ? 'w-[300px] h-[400px]' :
              popup.size === 'medium' ? 'w-[450px] h-[600px]' :
              popup.size === 'large' ? 'w-[600px] h-[800px]' : 
              popup.size === 'full' ? 'w-full h-full rounded-none' : 'w-[450px] h-[600px]'
            }`}
          >
            <div className={`flex flex-col h-full ${popup.layoutType === 'image-bottom' ? 'flex-col-reverse' : ''}`}>
              {popup.imageUrl && (
                <div className={`flex-grow overflow-hidden bg-black/20 ${popup.layoutType === 'image-only' ? 'h-full' : ''}`}>
                  <img 
                    src={popup.imageUrl} 
                    alt={popup.title} 
                    className="w-full h-full object-contain" 
                    referrerPolicy="no-referrer" 
                  />
                </div>
              )}
              
              {popup.layoutType !== 'image-only' && (
                <div className="p-6 md:p-8 bg-zinc-900 border-t border-white/5">
                  <h3 className="text-xl md:text-2xl font-light mb-2 gold-text-gradient">{popup.title}</h3>
                  <div className="text-zinc-500 text-xs md:text-sm mb-6 line-clamp-2 leading-relaxed">{popup.content}</div>
                  
                  <div className="flex items-center justify-between gap-4">
                    <button 
                      onClick={() => handleClose(popup.id, true)}
                      className="text-[10px] md:text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      오늘 하루 보지 않기
                    </button>
                    
                    <div className="flex gap-2 md:gap-3">
                      <button 
                        onClick={() => handleClose(popup.id, false)}
                        className="px-4 md:px-6 py-2 bg-zinc-800 text-zinc-300 text-xs md:text-sm rounded-xl hover:bg-zinc-700 transition-colors"
                      >
                        닫기
                      </button>
                      {popup.buttonLink && (
                        <a 
                          href={popup.buttonLink}
                          className="px-4 md:px-6 py-2 gold-gradient text-black text-xs md:text-sm font-bold rounded-xl hover:opacity-90 transition-opacity"
                        >
                          {popup.buttonText || '자세히 보기'}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {popup.layoutType === 'image-only' && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between">
                  <button 
                    onClick={() => handleClose(popup.id, true)}
                    className="text-[10px] text-zinc-300 hover:text-white transition-colors"
                  >
                    오늘 하루 보지 않기
                  </button>
                  <button 
                    onClick={() => handleClose(popup.id, false)}
                    className="px-4 py-1 bg-white/10 backdrop-blur-md text-white text-xs rounded-lg hover:bg-white/20 transition-colors"
                  >
                    닫기
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

const Footer = ({ 
  logoUrl, 
  siteName,
  categories,
  setActiveCategory,
  phone,
  hours,
  address
}: { 
  logoUrl?: string; 
  siteName?: string;
  categories: Category[];
  setActiveCategory: (c: string) => void;
  phone?: string;
  hours?: string;
  address?: string;
}) => {
  return (
    <footer className="bg-zinc-950 border-t border-white/5 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
        <div className="col-span-1 md:col-span-2">
          <div className="mb-8">
            <Logo logoUrl={logoUrl} siteName={siteName} variant="simple" />
          </div>
          <p className="text-zinc-400 max-w-md leading-relaxed mb-8">
            국제퍼스트금거래소는 투명하고 안전한 금 거래 문화를 선도합니다. 
            최고의 품질과 신뢰를 바탕으로 고객님의 소중한 자산을 지켜드립니다.
          </p>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/internationalfirst_official/" target="_blank" rel="noopener noreferrer" className="p-3 bg-zinc-900 rounded-full text-zinc-400 hover:text-gold hover:bg-zinc-800 transition-all">
              <Instagram size={20} />
            </a>
            <a href="http://pf.kakao.com/_hBRxhX" target="_blank" rel="noopener noreferrer" className="p-3 bg-zinc-900 rounded-full text-zinc-400 hover:text-gold hover:bg-zinc-800 transition-all">
              <MessageCircle size={20} />
            </a>
          </div>
        </div>

        <div>
          <h5 className="text-white font-semibold mb-6">고객센터</h5>
          <ul className="space-y-4 text-zinc-400">
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-gold" />
              <span>{phone || '1588-0000'}</span>
            </li>
            <li>{hours || '평일 09:00 - 18:00 (주말/공휴일 휴무)'}</li>
            <li>{address || '서울특별시 종로구 돈화문로 5가길 1 (돈의동)'}</li>
          </ul>
        </div>

        <div>
          <h5 className="text-white font-semibold mb-6">메뉴</h5>
          <ul className="space-y-4 text-zinc-400">
            {categories.map(cat => (
              <li key={cat.id}>
                <button 
                  onClick={() => {
                    setActiveCategory(cat.name);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="hover:text-gold transition-colors"
                >
                  {cat.name}
                </button>
              </li>
            ))}
            <li><a href="#" className="hover:text-gold transition-colors">공지사항</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-zinc-600 text-xs">
        <p>© 2024 International First Gold Exchange Co., Ltd. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-zinc-400">이용약관</a>
          <a href="#" className="hover:text-zinc-400">개인정보처리방침</a>
          <a href="#" className="hover:text-zinc-400">사업자정보확인</a>
        </div>
      </div>
    </footer>
  );
};

const NewsSection = ({ news }: { news: NewsItem[] }) => {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  
  const activeNews = useMemo(() => {
    const filtered = news.filter(n => n.isActive);
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [news]);

  // Sync selectedNews if the news list updates (e.g., after an edit)
  useEffect(() => {
    if (selectedNews) {
      const updated = news.find(n => n.id === selectedNews.id);
      if (updated) {
        setSelectedNews(updated);
      }
    }
  }, [news]);

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1624392334056-8316bb137637?q=80&w=2000&auto=format&fit=crop" 
          alt="Gold Background" 
          className="w-full h-full object-cover mix-blend-overlay"
          referrerPolicy="no-referrer"
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-light mb-4">
              뉴스 / <span className="gold-text-gradient">시사 이슈</span>
            </h2>
            <p className="text-zinc-500 max-w-2xl">
              국제 금 시세에 영향을 주는 주요 뉴스 및 경제 지표를 실시간으로 전달해 드립니다.
            </p>
          </div>
          <div className="flex items-center gap-2 text-gold text-sm font-medium">
            <Globe size={16} />
            <span>최신 경제/시사 뉴스</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activeNews.slice(0, 3).map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -10 }}
              onClick={() => setSelectedNews(item)}
              className="group cursor-pointer bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden hover:border-gold/30 transition-all duration-500 flex flex-col h-full"
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                <img 
                  src={item.imageUrl ? (item.imageUrl.startsWith('data:') ? item.imageUrl : `${item.imageUrl}${item.imageUrl.includes('?') ? '&' : '?'}v=${item.updatedAt || Date.now()}`) : ''} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold text-gold uppercase tracking-widest">
                    {item.category === 'gold' ? '금' : item.category === 'exchange' ? '환율' : item.category === 'international' ? '국제정세' : '경제'}
                  </span>
                </div>
              </div>
              <div className="p-8 flex flex-col h-full">
                <div className="flex items-center gap-3 text-[10px] text-zinc-500 mb-4 uppercase tracking-widest">
                  <span>{item.date}</span>
                  <span className="w-1 h-1 bg-gold rounded-full" />
                  <span>{item.source}</span>
                </div>
                <h3 className="text-xl font-medium mb-4 group-hover:text-gold transition-colors line-clamp-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-zinc-500 text-sm line-clamp-3 leading-relaxed mb-6 flex-grow">
                  {item.summary}
                </p>
                
                {item.url && (
                  <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between group/link">
                    <span className="text-[10px] font-bold text-gold uppercase tracking-widest">기사 원문 보기</span>
                    <ArrowRight size={14} className="text-gold transform group-hover/link:translate-x-1 transition-transform" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* News Detail Modal */}
      <AnimatePresence>
        {selectedNews && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNews(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-900 border border-white/10 rounded-[40px] overflow-hidden shadow-2xl flex flex-col"
            >
              <button 
                onClick={() => setSelectedNews(null)}
                className="absolute top-6 right-6 z-10 p-3 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-gold hover:text-black transition-all"
              >
                <X size={20} />
              </button>

              <div className="overflow-y-auto">
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={selectedNews.imageUrl ? (selectedNews.imageUrl.startsWith('data:') ? selectedNews.imageUrl : `${selectedNews.imageUrl}${selectedNews.imageUrl.includes('?') ? '&' : '?'}v=${selectedNews.updatedAt || Date.now()}`) : 'https://picsum.photos/seed/news/800/500'} 
                    alt={selectedNews.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-10 md:p-16">
                  <div className="flex items-center gap-4 text-xs text-gold font-bold uppercase tracking-[0.2em] mb-6">
                    <span>{selectedNews.category}</span>
                    <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                    <span className="text-zinc-500">{selectedNews.date}</span>
                    <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                    <span className="text-zinc-500">{selectedNews.source}</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-light mb-10 leading-tight">
                    {selectedNews.title}
                  </h2>
                  <div className="prose prose-invert max-w-none">
                    <div className="text-zinc-400 text-lg leading-relaxed">
                      {selectedNews.content.split('\n').map((paragraph, idx) => (
                        paragraph.trim() ? (
                          <p key={idx} className="mb-6 last:mb-0">
                            {paragraph}
                          </p>
                        ) : (
                          <div key={idx} className="h-4" />
                        )
                      ))}
                    </div>
                  </div>
                  
                  {selectedNews.url && (
                    <div className="mt-12 pt-12 border-t border-white/5">
                      <a 
                        href={selectedNews.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-8 py-4 gold-gradient text-black font-bold rounded-2xl hover:opacity-90 transition-opacity"
                      >
                        기사 원문 보기 <ArrowRight size={18} />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

// --- Main App ---

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [popups, setPopups] = useState<Popup[]>([]);
  const [news, setNews] = useState<NewsItem[]>(SAMPLE_NEWS);
  const [prices, setPrices] = useState<GoldPrice[]>(SAMPLE_GOLD_PRICES);
  const [international, setInternational] = useState<InternationalPrice>(SAMPLE_INTERNATIONAL_PRICE);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [config, setConfig] = useState<{ 
    logoUrl: string; 
    siteName: string;
    address: string;
    aboutText: string;
    aboutImageUrl: string;
    phone: string;
    hours: string;
  }>({ 
    logoUrl: '', 
    siteName: '',
    address: '',
    aboutText: '',
    aboutImageUrl: '',
    phone: '',
    hours: ''
  });
  const [lang, setLang] = useState<Language>('ko');
  const [activeCategory, setActiveCategory] = useState<string>('전체');
  const [chartMetal, setChartMetal] = useState<'gold' | 'silver'>('gold');

  const refreshProducts = () => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setProducts(data.map((p: any) => ({ ...p, isNew: !!p.isNew, isBest: !!p.isBest })));
        }
      });
  };

  const refreshCategories = () => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data) setCategories(data);
      });
  };

  const refreshPopups = () => {
    fetch('/api/popups')
      .then(res => res.json())
      .then(data => {
        if (data) setPopups(data.map((p: any) => ({ ...p, isActive: !!p.isActive })));
      });
  };

  const refreshNews = () => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data)) {
          setNews(data.map((n: any) => ({ 
            ...n, 
            isActive: !!n.isActive,
            type: n.type || 'custom'
          })));
        }
      })
      .catch(err => console.error('Failed to fetch news:', err));
  };

  const refreshPrices = () => {
    fetch('/api/prices')
      .then(res => res.json())
      .then(data => {
        if (data.goldPrices && Array.isArray(data.goldPrices)) {
          setPrices(data.goldPrices);
        }
        if (data.international) setInternational(data.international);
      })
      .catch(err => console.error('Failed to fetch prices:', err));
  };

  const refreshConsultations = () => {
    fetch('/api/consultations')
      .then(res => res.json())
      .then(data => {
        if (data) setConsultations(data);
      });
  };

  const refreshConfig = () => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data) setConfig(data);
      });
  };

  useEffect(() => {
    refreshProducts();
    refreshPrices();
    refreshConsultations();
    refreshConfig();
    refreshCategories();
    refreshPopups();
    refreshNews();
  }, []);

  const handleAddProduct = async (product: Omit<Product, 'id'>) => {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (res.ok) refreshProducts();
  };

  const handleEditProduct = async (id: string, product: Partial<Product>) => {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (res.ok) refreshProducts();
  };

  const handleDeleteProduct = async (id: string) => {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) refreshProducts();
  };

  const handleUpdatePrices = async (goldPrices: GoldPrice[], international: InternationalPrice) => {
    const res = await fetch('/api/prices/update-all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goldPrices, international }),
    });
    if (res.ok) refreshPrices();
  };

  const handleAddNews = async (newsItem: Omit<NewsItem, 'id'>) => {
    console.log('Adding news:', newsItem);
    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newsItem, type: newsItem.type || 'custom' }),
      });
      if (res.ok) {
        console.log('News added successfully');
        refreshNews();
      } else {
        const error = await res.text();
        console.error('Failed to add news:', error);
        alert('뉴스 추가에 실패했습니다: ' + error);
      }
    } catch (err) {
      console.error('Error adding news:', err);
      alert('뉴스 추가 중 오류가 발생했습니다.');
    }
  };

  const handleEditNews = async (id: string, newsItem: Partial<NewsItem>) => {
    console.log('Editing news:', id, newsItem);
    try {
      const res = await fetch(`/api/news/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newsItem),
      });
      if (res.ok) {
        console.log('News edited successfully');
        refreshNews();
      } else {
        const error = await res.text();
        console.error('Failed to edit news:', error);
        alert('뉴스 수정에 실패했습니다: ' + error);
      }
    } catch (err) {
      console.error('Error editing news:', err);
      alert('뉴스 수정 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteNews = async (id: string) => {
    const res = await fetch(`/api/news/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) refreshNews();
  };

  const handleUpdateConfig = async (newConfig: { 
    logoUrl?: string; 
    siteName?: string;
    address?: string;
    aboutText?: string;
    aboutImageUrl?: string;
    phone?: string;
    hours?: string;
  }) => {
    const res = await fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newConfig),
    });
    if (res.ok) refreshConfig();
  };

  const handleUpdateConsultation = async (id: string, status: 'pending' | 'completed') => {
    const res = await fetch(`/api/consultations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) refreshConsultations();
  };

  const openAdmin = () => {
    refreshConsultations();
    refreshPrices();
    refreshProducts();
    refreshConfig();
    refreshCategories();
    refreshPopups();
    refreshNews();
    setIsAdminOpen(true);
  };

  return (
    <div className="min-h-screen bg-black selection:bg-gold selection:text-black">
      <Header 
        onAdminClick={openAdmin} 
        lang={lang} 
        setLang={setLang} 
        onLogoClick={() => setActiveCategory('전체')}
        logoUrl={config.logoUrl}
        siteName={config.siteName}
      />
      
      <main className="pt-24">
        <CategoryNav 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory} 
          categories={categories}
        />

        <AnimatePresence mode="wait">
          {activeCategory === '전체' ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Hero lang={lang} setActiveCategory={setActiveCategory} />
              
              <PriceSection 
                prices={prices} 
                international={international} 
                lang={lang} 
              />

              <NewsSection news={news} />

              <CompanySection 
                aboutText={config.aboutText} 
                aboutImageUrl={config.aboutImageUrl} 
              />

              <ProductSection 
                products={products} 
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                categories={categories}
              />

              <ConsultationSection 
                lang={lang} 
                onRefresh={refreshConsultations} 
                phone={config.phone}
                hours={config.hours}
              />

              <LocationSection 
                address={config.address} 
                phone={config.phone}
                hours={config.hours}
              />
              
              {/* Trust Section */}
              <section className="py-32 bg-zinc-950">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                      <Settings className="text-gold" size={32} />
                    </div>
                    <h4 className="text-xl font-medium">정밀 감정 시스템</h4>
                    <p className="text-zinc-500 leading-relaxed">최첨단 장비를 활용한 정밀 감정으로 99.9% 이상의 순도를 보장합니다.</p>
                  </div>
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                      <ChevronRight className="text-gold" size={32} />
                    </div>
                    <h4 className="text-xl font-medium">안전 거래 보장</h4>
                    <p className="text-zinc-500 leading-relaxed">모든 거래는 법적 절차를 준수하며 투명하게 공개됩니다.</p>
                  </div>
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                      <User className="text-gold" size={32} />
                    </div>
                    <h4 className="text-xl font-medium">전문가 상담</h4>
                    <p className="text-zinc-500 leading-relaxed">10년 이상의 경력을 가진 전문가가 1:1 맞춤 상담을 제공합니다.</p>
                  </div>
                </div>
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="category"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="min-h-[80vh]"
            >
              <ProductSection 
                products={products} 
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                categories={categories}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer 
        logoUrl={config.logoUrl} 
        siteName={config.siteName} 
        categories={categories}
        setActiveCategory={setActiveCategory}
        phone={config.phone}
        hours={config.hours}
        address={config.address}
      />

      {/* Admin Overlay */}
      <AnimatePresence>
        {isAdminOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AdminPanel 
              onClose={() => setIsAdminOpen(false)} 
              products={products}
              prices={prices}
              international={international}
              consultations={consultations}
              categories={categories}
              popups={popups}
              news={news}
              logoUrl={config.logoUrl}
              siteName={config.siteName}
              address={config.address}
              aboutText={config.aboutText}
              aboutImageUrl={config.aboutImageUrl}
              phone={config.phone}
              hours={config.hours}
              onAddProduct={handleAddProduct}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
              onUpdatePrices={handleUpdatePrices}
              onUpdateConfig={handleUpdateConfig}
              onAddNews={handleAddNews}
              onEditNews={handleEditNews}
              onDeleteNews={handleDeleteNews}
              onAddCategory={async (c) => {
                await fetch('/api/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(c) });
                refreshCategories();
              }}
              onEditCategory={async (id, c) => {
                await fetch(`/api/categories/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(c) });
                refreshCategories();
              }}
              onDeleteCategory={async (id) => {
                await fetch(`/api/categories/${id}`, { method: 'DELETE' });
                refreshCategories();
              }}
              onAddPopup={async (p) => {
                await fetch('/api/popups', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) });
                refreshPopups();
              }}
              onEditPopup={async (id, p) => {
                await fetch(`/api/popups/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) });
                refreshPopups();
              }}
              onDeletePopup={async (id) => {
                await fetch(`/api/popups/${id}`, { method: 'DELETE' });
                refreshPopups();
              }}
              onAddPrice={async (p) => {
                await fetch('/api/prices', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) });
                refreshPrices();
              }}
              onEditPrice={async (id, p) => {
                await fetch(`/api/prices/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) });
                refreshPrices();
              }}
              onDeletePrice={async (id) => {
                await fetch(`/api/prices/${id}`, { method: 'DELETE' });
                refreshPrices();
              }}
              onUpdateConsultation={handleUpdateConsultation}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <PopupOverlay popups={popups} />
    </div>
  );
}
