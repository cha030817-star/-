import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Grid2X2, 
  Settings, 
  Edit2, 
  LogOut, 
  Plus, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  MessageSquare,
  Layers,
  MonitorPlay,
  Calendar,
  Layout,
  Check,
  Newspaper,
  Globe,
  Link as LinkIcon,
  X as CloseIcon
} from 'lucide-react';
import { Product, GoldPrice, InternationalPrice, Category, Consultation, Popup, NewsItem } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

interface AdminPanelProps {
  onClose: () => void;
  products: Product[];
  prices: GoldPrice[];
  international: InternationalPrice;
  consultations: Consultation[];
  categories: Category[];
  popups: Popup[];
  logoUrl: string;
  siteName: string;
  address: string;
  aboutText: string;
  aboutImageUrl: string;
  phone: string;
  hours: string;
  onAddProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  onEditProduct: (id: string, product: Partial<Product>) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  onUpdatePrices: (goldPrices: GoldPrice[], international: InternationalPrice) => Promise<void>;
  onUpdateConfig: (config: { 
    logoUrl?: string; 
    siteName?: string;
    address?: string;
    aboutText?: string;
    aboutImageUrl?: string;
    phone?: string;
    hours?: string;
  }) => Promise<void>;
  onAddCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  onEditCategory: (id: string, category: Partial<Category>) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  onAddPopup: (popup: Omit<Popup, 'id'>) => Promise<void>;
  onEditPopup: (id: string, popup: Partial<Popup>) => Promise<void>;
  onDeletePopup: (id: string) => Promise<void>;
  onAddPrice: (price: Omit<GoldPrice, 'id'>) => Promise<void>;
  onEditPrice: (id: string, price: Partial<GoldPrice>) => Promise<void>;
  onDeletePrice: (id: string) => Promise<void>;
  news: NewsItem[];
  onAddNews: (news: Omit<NewsItem, 'id'>) => Promise<void>;
  onEditNews: (id: string, news: Partial<NewsItem>) => Promise<void>;
  onDeleteNews: (id: string) => Promise<void>;
  onUpdateConsultation: (id: string, status: 'pending' | 'completed') => Promise<void>;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  onClose, 
  products, 
  prices, 
  international, 
  consultations,
  categories,
  popups,
  logoUrl,
  siteName,
  address,
  aboutText,
  aboutImageUrl,
  phone,
  hours,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onUpdatePrices,
  onUpdateConfig,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onAddPopup,
  onEditPopup,
  onDeletePopup,
  onAddPrice,
  onEditPrice,
  onDeletePrice,
  news,
  onAddNews,
  onEditNews,
  onDeleteNews,
  onUpdateConsultation
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'popups' | 'news' | 'prices' | 'consultations' | 'settings'>('products');
  
  // Product State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productFormData, setProductFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    categoryId: categories[0]?.id || '',
    price: 0,
    image: '',
    description: '',
    isNew: false,
    isBest: false
  });

  // Category State
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState<Omit<Category, 'id'>>({
    name: '',
    description: '',
    image: '',
    priceType: 'gold',
    displayOrder: 0
  });

  // Popup State
  const [editingPopup, setEditingPopup] = useState<Popup | null>(null);
  const [isAddingPopup, setIsAddingPopup] = useState(false);
  const [popupFormData, setPopupFormData] = useState<Omit<Popup, 'id'>>({
    title: '',
    content: '',
    imageUrl: '',
    buttonText: '자세히 보기',
    buttonLink: '',
    position: 'center',
    size: 'medium',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isActive: true,
    displayOrder: 0,
    customX: '50%',
    customY: '50%',
    mobileX: '50%',
    mobileY: '50%',
    layoutType: 'image-top'
  });

  // News State
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [isAddingNews, setIsAddingNews] = useState(false);
  const [newsFilter, setNewsFilter] = useState<'all' | 'sample' | 'custom'>('all');
  const [newsFormData, setNewsFormData] = useState<Omit<NewsItem, 'id'>>({
    title: '',
    summary: '',
    content: '',
    imageUrl: '',
    date: new Date().toISOString().split('T')[0],
    isActive: true,
    category: 'gold',
    source: 'Reuters',
    url: '',
    type: 'custom'
  });
  const [reutersUrl, setReutersUrl] = useState('');
  const [isFetchingReuters, setIsFetchingReuters] = useState(false);

  // Price & Config Local State
  const [localPrices, setLocalPrices] = useState<GoldPrice[]>(prices);
  const [localInternational, setLocalInternational] = useState<InternationalPrice>(international);
  const [localLogoUrl, setLocalLogoUrl] = useState(logoUrl);
  const [localSiteName, setLocalSiteName] = useState(siteName);
  const [localAddress, setLocalAddress] = useState(address);
  const [localAboutText, setLocalAboutText] = useState(aboutText);
  const [localAboutImageUrl, setLocalAboutImageUrl] = useState(aboutImageUrl);
  const [localPhone, setLocalPhone] = useState(phone);
  const [localHours, setLocalHours] = useState(hours);

  // Price Management State
  const [editingPriceItem, setEditingPriceItem] = useState<GoldPrice | null>(null);
  const [isAddingPriceItem, setIsAddingPriceItem] = useState(false);
  const [priceItemFormData, setPriceItemFormData] = useState<Omit<GoldPrice, 'id'>>({
    name: '',
    nameEn: '',
    buyPrice: 0,
    sellPrice: 0,
    change: 'none',
    changeValue: 0,
    metal: 'gold',
    category: 'product',
    displayOrder: 0
  });

  useEffect(() => {
    setLocalPrices(prices);
  }, [prices]);

  useEffect(() => {
    setLocalPrices(prices);
  }, [prices]);

  useEffect(() => {
    setLocalInternational(international);
  }, [international]);

  useEffect(() => {
    setLocalLogoUrl(logoUrl);
    setLocalSiteName(siteName);
    setLocalAddress(address);
    setLocalAboutText(aboutText);
    setLocalAboutImageUrl(aboutImageUrl);
    setLocalPhone(phone);
    setLocalHours(hours);
  }, [logoUrl, siteName, address, aboutText, aboutImageUrl, phone, hours]);

  const handlePriceChange = (id: string, field: keyof GoldPrice, value: any) => {
    setLocalPrices(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleInternationalChange = (field: keyof InternationalPrice, value: any) => {
    setLocalInternational(prev => ({ ...prev, [field]: value }));
  };

  const handlePricesSubmit = async () => {
    await onUpdatePrices(localPrices, localInternational);
    alert('시세가 성공적으로 업데이트되었습니다.');
  };

  const handleConfigSubmit = async () => {
    await onUpdateConfig({ 
      logoUrl: localLogoUrl, 
      siteName: localSiteName,
      address: localAddress,
      aboutText: localAboutText,
      aboutImageUrl: localAboutImageUrl,
      phone: localPhone,
      hours: localHours
    });
    alert('사이트 설정이 저장되었습니다.');
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      await onEditProduct(editingProduct.id, productFormData);
    } else {
      await onAddProduct(productFormData);
    }
    setEditingProduct(null);
    setIsAddingProduct(false);
    setProductFormData({
      name: '',
      categoryId: categories[0]?.id || '',
      price: 0,
      image: '',
      description: '',
      isNew: false,
      isBest: false
    });
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      await onEditCategory(editingCategory.id, categoryFormData);
    } else {
      await onAddCategory(categoryFormData);
    }
    setEditingCategory(null);
    setIsAddingCategory(false);
    setCategoryFormData({
      name: '',
      description: '',
      image: '',
      priceType: 'gold',
      displayOrder: 0
    });
  };

  const handlePopupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPopup) {
      await onEditPopup(editingPopup.id, popupFormData);
    } else {
      await onAddPopup(popupFormData);
    }
    setEditingPopup(null);
    setIsAddingPopup(false);
    setPopupFormData({
      title: '',
      content: '',
      imageUrl: '',
      buttonText: '자세히 보기',
      buttonLink: '',
      position: 'center',
      size: 'medium',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: true,
      displayOrder: 0,
      customX: '50%',
      customY: '50%',
      mobileX: '50%',
      mobileY: '50%',
      layoutType: 'image-top'
    });
  };

  const startEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductFormData({
      name: product.name,
      categoryId: product.categoryId,
      price: product.price,
      image: product.image,
      description: product.description || '',
      isNew: product.isNew || false,
      isBest: product.isBest || false
    });
    setIsAddingProduct(true);
  };

  const startEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      description: category.description || '',
      image: category.image || '',
      priceType: category.priceType || 'gold',
      displayOrder: category.displayOrder || 0
    });
    setIsAddingCategory(true);
  };

  const startEditPopup = (popup: Popup) => {
    setEditingPopup(popup);
    setPopupFormData({
      title: popup.title,
      content: popup.content,
      imageUrl: popup.imageUrl || '',
      buttonText: popup.buttonText || '자세히 보기',
      buttonLink: popup.buttonLink || '',
      position: popup.position,
      size: popup.size,
      startDate: popup.startDate,
      endDate: popup.endDate,
      isActive: popup.isActive,
      displayOrder: popup.displayOrder,
      customX: popup.customX || '50%',
      customY: popup.customY || '50%',
      mobileX: popup.mobileX || '50%',
      mobileY: popup.mobileY || '50%',
      layoutType: popup.layoutType || 'image-top'
    });
    setIsAddingPopup(true);
  };

  const startEditNews = (item: NewsItem) => {
    setEditingNews(item);
    setNewsFormData({
      title: item.title,
      summary: item.summary,
      content: item.content,
      imageUrl: item.imageUrl || '',
      date: item.date,
      isActive: item.isActive,
      category: item.category as any,
      source: item.source,
      url: item.url || '',
      type: item.type
    });
    setIsAddingNews(true);
  };

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingNews) {
        await onEditNews(editingNews.id, newsFormData);
        alert('뉴스가 성공적으로 수정되었습니다.');
      } else {
        await onAddNews(newsFormData);
        alert('뉴스가 성공적으로 게시되었습니다.');
      }
      setEditingNews(null);
      setIsAddingNews(false);
      setNewsFormData({
        title: '',
        summary: '',
        content: '',
        imageUrl: '',
        date: new Date().toISOString().split('T')[0],
        isActive: true,
        category: 'gold',
        source: 'Reuters',
        url: '',
        type: 'custom'
      });
    } catch (err) {
      console.error('Error submitting news:', err);
    }
  };

  const fetchReutersNews = async () => {
    if (!reutersUrl) return;
    
    setIsFetchingReuters(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Extract news details from this URL: ${reutersUrl}. 
        Return ONLY a JSON object with: title, summary, content, imageUrl, date (YYYY-MM-DD), category (one of: gold, exchange, international, economy), source.
        The content should be a detailed summary of the article in Korean.
        The title and summary should also be in Korean.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              content: { type: Type.STRING },
              imageUrl: { type: Type.STRING },
              date: { type: Type.STRING },
              category: { type: Type.STRING },
              source: { type: Type.STRING }
            },
            required: ["title", "summary", "content", "date", "category", "source"]
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      setNewsFormData({
        ...newsFormData,
        title: data.title || '',
        summary: data.summary || '',
        content: data.content || '',
        imageUrl: data.imageUrl || '',
        date: data.date || new Date().toISOString().split('T')[0],
        category: data.category || 'gold',
        source: data.source || 'News',
        url: reutersUrl,
        type: 'custom'
      });
      alert('뉴스를 성공적으로 불러왔습니다. 내용을 확인하고 게시해주세요.');
    } catch (error) {
      console.error('Error fetching Reuters news:', error);
      alert('뉴스를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsFetchingReuters(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 flex flex-col">
        <div className="p-8 border-b border-zinc-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 gold-gradient rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-sm">IF</span>
            </div>
            <span className="font-bold tracking-tight">ADMIN PANEL</span>
          </div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Management System</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'products' ? 'bg-gold text-black font-bold' : 'text-zinc-400 hover:bg-zinc-900'
            }`}
          >
            <Grid2X2 size={20} /> 제품 관리
          </button>
          <button 
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'categories' ? 'bg-gold text-black font-bold' : 'text-zinc-400 hover:bg-zinc-900'
            }`}
          >
            <Layers size={20} /> 카테고리 관리
          </button>
          <button 
            onClick={() => setActiveTab('popups')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'popups' ? 'bg-gold text-black font-bold' : 'text-zinc-400 hover:bg-zinc-900'
            }`}
          >
            <MonitorPlay size={20} /> 팝업 관리
          </button>
          <button 
            onClick={() => setActiveTab('news')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'news' ? 'bg-gold text-black font-bold' : 'text-zinc-400 hover:bg-zinc-900'
            }`}
          >
            <Newspaper size={20} /> 뉴스/시사 관리
          </button>
          <button 
            onClick={() => setActiveTab('prices')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'prices' ? 'bg-gold text-black font-bold' : 'text-zinc-400 hover:bg-zinc-900'
            }`}
          >
            <TrendingUp size={20} /> 시세 관리
          </button>
          <button 
            onClick={() => setActiveTab('consultations')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'consultations' ? 'bg-gold text-black font-bold' : 'text-zinc-400 hover:bg-zinc-900'
            }`}
          >
            <MessageSquare size={20} /> 상담 관리
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'settings' ? 'bg-gold text-black font-bold' : 'text-zinc-400 hover:bg-zinc-900'
            }`}
          >
            <Settings size={20} /> 사이트 설정
          </button>
        </nav>

        <div className="p-4 border-t border-zinc-800 space-y-2">
          <button 
            onClick={onClose}
            className="w-full flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-gold transition-all"
          >
            <LogOut size={20} /> 홈으로 돌아가기
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-zinc-950 p-12">
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-6">
            <button 
              onClick={onClose}
              className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-gold transition-all"
              title="홈으로 돌아가기"
            >
              <LogOut size={20} />
            </button>
            <div>
              <h2 className="text-3xl font-light capitalize">
                {activeTab === 'products' && '제품 관리'}
                {activeTab === 'categories' && '카테고리 관리'}
                {activeTab === 'popups' && '팝업 관리'}
                {activeTab === 'news' && '뉴스/시사 관리'}
                {activeTab === 'prices' && '시세 관리'}
                {activeTab === 'consultations' && '상담 관리'}
                {activeTab === 'settings' && '사이트 설정'}
              </h2>
              <p className="text-zinc-500">시스템의 데이터를 실시간으로 관리합니다.</p>
            </div>
          </div>
          
          {activeTab === 'products' && !isAddingProduct && (
            <button 
              onClick={() => {
                setEditingProduct(null);
                setProductFormData({
                  name: '',
                  categoryId: categories[0]?.id || '',
                  price: 0,
                  image: '',
                  description: '',
                  isNew: false,
                  isBest: false
                });
                setIsAddingProduct(true);
              }}
              className="px-6 py-3 gold-gradient text-black font-bold rounded-xl flex items-center gap-2"
            >
              <Plus size={20} /> 새 제품 추가
            </button>
          )}

          {activeTab === 'categories' && !isAddingCategory && (
            <button 
              onClick={() => {
                setEditingCategory(null);
                setCategoryFormData({
                  name: '',
                  description: '',
                  image: '',
                  priceType: 'gold',
                  displayOrder: 0
                });
                setIsAddingCategory(true);
              }}
              className="px-6 py-3 gold-gradient text-black font-bold rounded-xl flex items-center gap-2"
            >
              <Plus size={20} /> 새 카테고리 추가
            </button>
          )}

          {activeTab === 'popups' && !isAddingPopup && (
            <button 
              onClick={() => {
                setEditingPopup(null);
                setPopupFormData({
                  title: '',
                  content: '',
                  imageUrl: '',
                  buttonText: '자세히 보기',
                  buttonLink: '',
                  position: 'center',
                  size: 'medium',
                  startDate: new Date().toISOString().split('T')[0],
                  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  isActive: true,
                  displayOrder: 0,
                  customX: '50%',
                  customY: '50%',
                  mobileX: '50%',
                  mobileY: '50%',
                  layoutType: 'image-top'
                });
                setIsAddingPopup(true);
              }}
              className="px-6 py-3 gold-gradient text-black font-bold rounded-xl flex items-center gap-2"
            >
              <Plus size={20} /> 새 팝업 추가
            </button>
          )}

          {activeTab === 'news' && !isAddingNews && (
            <button 
              onClick={() => {
                setEditingNews(null);
                setNewsFormData({
                  title: '',
                  summary: '',
                  content: '',
                  imageUrl: '',
                  date: new Date().toISOString().split('T')[0],
                  isActive: true,
                  category: 'gold',
                  source: 'Reuters',
                  url: '',
                  type: 'custom'
                });
                setIsAddingNews(true);
              }}
              className="px-6 py-3 gold-gradient text-black font-bold rounded-xl flex items-center gap-2"
            >
              <Plus size={20} /> 새 뉴스 추가
            </button>
          )}
        </header>

        {activeTab === 'products' && isAddingProduct && (
          <div className="max-w-2xl bg-zinc-900 border border-zinc-800 p-8 rounded-2xl mb-12">
            <h3 className="text-xl font-bold mb-6">{editingProduct ? '제품 수정' : '새 제품 추가'}</h3>
            <form onSubmit={handleProductSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 uppercase">제품명</label>
                  <input 
                    required
                    type="text" 
                    value={productFormData.name}
                    onChange={(e) => setProductFormData({...productFormData, name: e.target.value})}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 uppercase">카테고리</label>
                  <select 
                    required
                    value={productFormData.categoryId}
                    onChange={(e) => setProductFormData({...productFormData, categoryId: e.target.value})}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3"
                  >
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 uppercase">가격 (원)</label>
                  <input 
                    required
                    type="number" 
                    value={productFormData.price}
                    onChange={(e) => setProductFormData({...productFormData, price: parseInt(e.target.value)})}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 uppercase">이미지 URL</label>
                  <input 
                    required
                    type="text" 
                    value={productFormData.image}
                    onChange={(e) => setProductFormData({...productFormData, image: e.target.value})}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-zinc-500 uppercase">제품 설명</label>
                <textarea 
                  value={productFormData.description}
                  onChange={(e) => setProductFormData({...productFormData, description: e.target.value})}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 h-32" 
                />
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={productFormData.isNew}
                    onChange={(e) => setProductFormData({...productFormData, isNew: e.target.checked})}
                    className="w-4 h-4 accent-gold" 
                  />
                  <span className="text-sm">신제품 (NEW)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={productFormData.isBest}
                    onChange={(e) => setProductFormData({...productFormData, isBest: e.target.checked})}
                    className="w-4 h-4 accent-gold" 
                  />
                  <span className="text-sm">베스트 (BEST)</span>
                </label>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 py-4 gold-gradient text-black font-bold rounded-xl">
                  {editingProduct ? '수정 완료' : '제품 등록'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsAddingProduct(false)}
                  className="px-8 py-4 bg-zinc-800 text-white font-bold rounded-xl"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'products' && !isAddingProduct && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-widest">
                  <th className="px-6 py-4 font-medium">제품 정보</th>
                  <th className="px-6 py-4 font-medium">카테고리</th>
                  <th className="px-6 py-4 font-medium">가격</th>
                  <th className="px-6 py-4 font-medium text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img src={p.image} className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                        <span className="font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-400">
                      {categories.find(c => c.id === p.categoryId)?.name || '알 수 없음'}
                    </td>
                    <td className="px-6 py-4 font-mono">₩{p.price.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => startEditProduct(p)}
                          className="p-2 text-zinc-500 hover:text-white"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => {
                            if (window.confirm('정말 삭제하시겠습니까?')) {
                              onDeleteProduct(p.id);
                            }
                          }}
                          className="p-2 text-zinc-500 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'categories' && isAddingCategory && (
          <div className="max-w-2xl bg-zinc-900 border border-zinc-800 p-8 rounded-2xl mb-12">
            <h3 className="text-xl font-bold mb-6">{editingCategory ? '카테고리 수정' : '새 카테고리 추가'}</h3>
            <form onSubmit={handleCategorySubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs text-zinc-500 uppercase">카테고리명</label>
                <input 
                  required
                  type="text" 
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData({...categoryFormData, name: e.target.value})}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-zinc-500 uppercase">설명</label>
                <textarea 
                  value={categoryFormData.description}
                  onChange={(e) => setCategoryFormData({...categoryFormData, description: e.target.value})}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 h-24" 
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 uppercase">대표 이미지 URL</label>
                  <input 
                    type="text" 
                    value={categoryFormData.image}
                    onChange={(e) => setCategoryFormData({...categoryFormData, image: e.target.value})}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 uppercase">시세 타입</label>
                  <select 
                    value={categoryFormData.priceType}
                    onChange={(e) => setCategoryFormData({...categoryFormData, priceType: e.target.value as any})}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3"
                  >
                    <option value="gold">금 시세 연동</option>
                    <option value="silver">은 시세 연동</option>
                    <option value="fixed">고정 가격</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-zinc-500 uppercase">노출 순서</label>
                <input 
                  type="number" 
                  value={categoryFormData.displayOrder}
                  onChange={(e) => setCategoryFormData({...categoryFormData, displayOrder: parseInt(e.target.value)})}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3" 
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 py-4 gold-gradient text-black font-bold rounded-xl">
                  {editingCategory ? '수정 완료' : '카테고리 등록'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsAddingCategory(false)}
                  className="px-8 py-4 bg-zinc-800 text-white font-bold rounded-xl"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'categories' && !isAddingCategory && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-widest">
                  <th className="px-6 py-4 font-medium">카테고리명</th>
                  <th className="px-6 py-4 font-medium">시세 타입</th>
                  <th className="px-6 py-4 font-medium">순서</th>
                  <th className="px-6 py-4 font-medium text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {categories.map((c) => (
                  <tr key={c.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {c.image && <img src={c.image} className="w-10 h-10 rounded object-cover" referrerPolicy="no-referrer" />}
                        <div>
                          <p className="font-medium">{c.name}</p>
                          <p className="text-xs text-zinc-500">{c.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-1 bg-zinc-800 rounded border border-zinc-700">
                        {c.priceType === 'gold' ? '금 시세' : c.priceType === 'silver' ? '은 시세' : '고정가'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-zinc-500">{c.displayOrder}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => startEditCategory(c)}
                          className="p-2 text-zinc-500 hover:text-white"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => {
                            if (window.confirm('정말 삭제하시겠습니까? 이 카테고리의 제품들도 영향을 받을 수 있습니다.')) {
                              onDeleteCategory(c.id);
                            }
                          }}
                          className="p-2 text-zinc-500 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'popups' && isAddingPopup && (
          <div className="max-w-4xl bg-zinc-900 border border-zinc-800 p-8 rounded-2xl mb-12">
            <h3 className="text-xl font-bold mb-6">{editingPopup ? '팝업 수정' : '새 팝업 추가'}</h3>
            <form onSubmit={handlePopupSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 uppercase">팝업 제목</label>
                  <input 
                    required
                    type="text" 
                    value={popupFormData.title}
                    onChange={(e) => setPopupFormData({...popupFormData, title: e.target.value})}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 uppercase">이미지 URL</label>
                  <input 
                    type="text" 
                    value={popupFormData.imageUrl}
                    onChange={(e) => setPopupFormData({...popupFormData, imageUrl: e.target.value})}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-zinc-500 uppercase">내용</label>
                <textarea 
                  required
                  value={popupFormData.content}
                  onChange={(e) => setPopupFormData({...popupFormData, content: e.target.value})}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 h-32" 
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 uppercase">버튼 텍스트</label>
                  <input 
                    type="text" 
                    value={popupFormData.buttonText}
                    onChange={(e) => setPopupFormData({...popupFormData, buttonText: e.target.value})}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 uppercase">버튼 링크</label>
                  <input 
                    type="text" 
                    value={popupFormData.buttonLink}
                    onChange={(e) => setPopupFormData({...popupFormData, buttonLink: e.target.value})}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 uppercase">레이아웃</label>
                  <select 
                    value={popupFormData.layoutType}
                    onChange={(e) => setPopupFormData({...popupFormData, layoutType: e.target.value as any})}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3"
                  >
                    <option value="image-top">이미지 상단</option>
                    <option value="image-bottom">이미지 하단</option>
                    <option value="image-only">이미지 전용</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 uppercase">위치</label>
                  <select 
                    value={popupFormData.position}
                    onChange={(e) => setPopupFormData({...popupFormData, position: e.target.value as any})}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3"
                  >
                    <option value="center">중앙</option>
                    <option value="bottom-left">하단 좌측</option>
                    <option value="bottom-right">하단 우측</option>
                    <option value="top-bar">상단 바</option>
                    <option value="custom">직접 입력</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 uppercase">크기</label>
                  <select 
                    value={popupFormData.size}
                    onChange={(e) => setPopupFormData({...popupFormData, size: e.target.value as any})}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3"
                  >
                    <option value="small">작게</option>
                    <option value="medium">중간</option>
                    <option value="large">크게</option>
                    <option value="full">전체</option>
                  </select>
                </div>
              </div>

              {popupFormData.position === 'custom' && (
                <div className="p-6 bg-zinc-800/50 rounded-2xl border border-zinc-700 space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-gold">세부 위치 설정</h4>
                    <span className="text-[10px] text-zinc-500">단위: px 또는 % (예: 120px, 10%)</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <p className="text-xs font-medium text-zinc-400">PC 위치</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-zinc-500 uppercase">X축 (Left)</label>
                          <input 
                            type="text" 
                            value={popupFormData.customX}
                            onChange={(e) => setPopupFormData({...popupFormData, customX: e.target.value})}
                            placeholder="50%"
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-sm" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-zinc-500 uppercase">Y축 (Top)</label>
                          <input 
                            type="text" 
                            value={popupFormData.customY}
                            onChange={(e) => setPopupFormData({...popupFormData, customY: e.target.value})}
                            placeholder="50%"
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-sm" 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-xs font-medium text-zinc-400">모바일 위치</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-zinc-500 uppercase">X축 (Left)</label>
                          <input 
                            type="text" 
                            value={popupFormData.mobileX}
                            onChange={(e) => setPopupFormData({...popupFormData, mobileX: e.target.value})}
                            placeholder="50%"
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-sm" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-zinc-500 uppercase">Y축 (Top)</label>
                          <input 
                            type="text" 
                            value={popupFormData.mobileY}
                            onChange={(e) => setPopupFormData({...popupFormData, mobileY: e.target.value})}
                            placeholder="50%"
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-sm" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Positioning Preview */}
                  <div className="pt-4">
                    <p className="text-[10px] text-zinc-500 mb-2">위치 미리보기 (PC 기준)</p>
                    <div className="relative w-full aspect-video bg-black rounded-lg border border-zinc-700 overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-full h-px bg-zinc-800" />
                        <div className="h-full w-px bg-zinc-800" />
                      </div>
                      <motion.div 
                        animate={{ 
                          left: popupFormData.customX, 
                          top: popupFormData.customY,
                          x: popupFormData.customX?.includes('%') ? '-50%' : 0,
                          y: popupFormData.customY?.includes('%') ? '-50%' : 0
                        }}
                        className="absolute w-8 h-10 bg-gold/50 border border-gold rounded flex items-center justify-center"
                      >
                        <Layout size={12} className="text-black" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 uppercase">시작일</label>
                  <input 
                    type="date" 
                    value={popupFormData.startDate}
                    onChange={(e) => setPopupFormData({...popupFormData, startDate: e.target.value})}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 uppercase">종료일</label>
                  <input 
                    type="date" 
                    value={popupFormData.endDate}
                    onChange={(e) => setPopupFormData({...popupFormData, endDate: e.target.value})}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3" 
                  />
                </div>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={popupFormData.isActive}
                    onChange={(e) => setPopupFormData({...popupFormData, isActive: e.target.checked})}
                    className="w-4 h-4 accent-gold" 
                  />
                  <span className="text-sm">활성화 상태</span>
                </label>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-zinc-500 uppercase">노출 순서</label>
                  <input 
                    type="number" 
                    value={popupFormData.displayOrder}
                    onChange={(e) => setPopupFormData({...popupFormData, displayOrder: parseInt(e.target.value)})}
                    className="w-20 bg-zinc-800 border border-zinc-700 rounded-xl p-2" 
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 py-4 gold-gradient text-black font-bold rounded-xl">
                  {editingPopup ? '수정 완료' : '팝업 등록'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsAddingPopup(false)}
                  className="px-8 py-4 bg-zinc-800 text-white font-bold rounded-xl"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'popups' && !isAddingPopup && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popups.map((popup) => (
              <div key={popup.id} className={`bg-zinc-900 border ${popup.isActive ? 'border-gold/20' : 'border-zinc-800'} rounded-2xl overflow-hidden flex flex-col`}>
                {popup.imageUrl && (
                  <div className="aspect-video w-full overflow-hidden">
                    <img src={popup.imageUrl} alt={popup.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold text-lg">{popup.title}</h4>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                      popup.isActive ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                    }`}>
                      {popup.isActive ? '활성' : '비활성'}
                    </span>
                  </div>
                  <p className="text-zinc-500 text-sm line-clamp-2 mb-4">{popup.content}</p>
                  <div className="mt-auto space-y-2">
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                      <Calendar size={12} />
                      <span>{popup.startDate} ~ {popup.endDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                      <Layout size={12} />
                      <span className="capitalize">{popup.position} / {popup.size}</span>
                    </div>
                    <div className="flex justify-end gap-2 pt-4 border-t border-zinc-800">
                      <button 
                        onClick={() => startEditPopup(popup)}
                        className="p-2 text-zinc-500 hover:text-white"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm('정말 삭제하시겠습니까?')) {
                            onDeletePopup(popup.id);
                          }
                        }}
                        className="p-2 text-zinc-500 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {popups.length === 0 && (
              <div className="col-span-full py-24 text-center text-zinc-500 bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-800">
                등록된 팝업이 없습니다.
              </div>
            )}
          </div>
        )}

      {/* Price Item Modal */}
      {(isAddingPriceItem || editingPriceItem) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl"
          >
            <div className="p-8 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                <div className="flex flex-col">
                  <h3 className="text-xl font-bold text-white">
                    {editingPriceItem ? '시세 항목 수정' : '새 시세 항목 추가'}
                  </h3>
                </div>
              <button 
                onClick={() => {
                  setIsAddingPriceItem(false);
                  setEditingPriceItem(null);
                }}
                className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
              >
                <CloseIcon size={20} />
              </button>
            </div>
            
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">항목명 (한글)</label>
                  <input 
                    type="text" 
                    value={priceItemFormData.name}
                    onChange={(e) => setPriceItemFormData({...priceItemFormData, name: e.target.value})}
                    placeholder="예: 골드바 10g"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:border-gold/50 outline-none transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">항목명 (영문)</label>
                  <input 
                    type="text" 
                    value={priceItemFormData.nameEn}
                    onChange={(e) => setPriceItemFormData({...priceItemFormData, nameEn: e.target.value})}
                    placeholder="예: Gold Bar 10g"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:border-gold/50 outline-none transition-all" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">금속 종류</label>
                  <select 
                    value={priceItemFormData.metal}
                    onChange={(e) => setPriceItemFormData({...priceItemFormData, metal: e.target.value as any})}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:border-gold/50 outline-none transition-all"
                  >
                    <option value="gold">금 (Gold)</option>
                    <option value="silver">은 (Silver)</option>
                    <option value="platinum">백금 (Platinum)</option>
                    <option value="palladium">팔라듐 (Palladium)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">카테고리</label>
                  <select 
                    value={priceItemFormData.category}
                    onChange={(e) => setPriceItemFormData({...priceItemFormData, category: e.target.value as any})}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:border-gold/50 outline-none transition-all"
                  >
                    <option value="market">시장 시세 (메인)</option>
                    <option value="product">순금 제품 매입</option>
                    <option value="silver_product">은 제품 시세</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">살 때 가격</label>
                  <input 
                    type="number" 
                    value={priceItemFormData.buyPrice}
                    onChange={(e) => setPriceItemFormData({...priceItemFormData, buyPrice: parseInt(e.target.value) || 0})}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:border-gold/50 outline-none transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">팔 때 가격</label>
                  <input 
                    type="number" 
                    value={priceItemFormData.sellPrice}
                    onChange={(e) => setPriceItemFormData({...priceItemFormData, sellPrice: parseInt(e.target.value) || 0})}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:border-gold/50 outline-none transition-all" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">등락 상태</label>
                  <select 
                    value={priceItemFormData.change}
                    onChange={(e) => setPriceItemFormData({...priceItemFormData, change: e.target.value as any})}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:border-gold/50 outline-none transition-all"
                  >
                    <option value="none">보합 (-)</option>
                    <option value="up">상승 (▲)</option>
                    <option value="down">하락 (▼)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">등락폭</label>
                  <input 
                    type="number" 
                    value={priceItemFormData.changeValue}
                    onChange={(e) => setPriceItemFormData({...priceItemFormData, changeValue: parseInt(e.target.value) || 0})}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:border-gold/50 outline-none transition-all" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">정렬 순서</label>
                <input 
                  type="number" 
                  value={priceItemFormData.displayOrder}
                  onChange={(e) => setPriceItemFormData({...priceItemFormData, displayOrder: parseInt(e.target.value) || 0})}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:border-gold/50 outline-none transition-all" 
                />
              </div>
            </div>

            <div className="p-8 bg-zinc-900/80 border-t border-zinc-800 flex gap-4">
              <button 
                onClick={() => {
                  setIsAddingPriceItem(false);
                  setEditingPriceItem(null);
                }}
                className="flex-1 px-6 py-4 bg-zinc-800 text-white font-bold rounded-2xl hover:bg-zinc-700 transition-all"
              >
                취소
              </button>
              <button 
                onClick={async () => {
                  if (editingPriceItem) {
                    await onEditPrice(editingPriceItem.id, priceItemFormData);
                  } else {
                    await onAddPrice(priceItemFormData);
                  }
                  setIsAddingPriceItem(false);
                  setEditingPriceItem(null);
                }}
                className="flex-1 px-6 py-4 gold-gradient text-black font-bold rounded-2xl shadow-lg shadow-gold/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {editingPriceItem ? '수정 완료' : '항목 추가'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

        {activeTab === 'news' && isAddingNews && (
          <div className="max-w-4xl bg-zinc-900 border border-zinc-800 p-8 rounded-2xl mb-12">
            <div className="flex justify-between items-center mb-8">
              <div className="flex flex-col">
                <h3 className="text-xl font-bold">{editingNews ? '뉴스 수정' : '새 뉴스 추가'}</h3>
              </div>
              <div className="flex gap-2 items-center">
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                  <input 
                    type="text" 
                    placeholder="뉴스 기사 URL 입력" 
                    value={reutersUrl}
                    onChange={(e) => setReutersUrl(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-sm w-64 focus:border-gold outline-none transition-all"
                  />
                </div>
                <button 
                  onClick={fetchReutersNews}
                  disabled={isFetchingReuters || !reutersUrl}
                  className="px-4 py-2 bg-zinc-800 text-gold border border-gold/30 rounded-xl text-sm font-bold hover:bg-gold hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isFetchingReuters ? '불러오는 중...' : '자동 내용 채우기'}
                </button>
              </div>
            </div>

            <form onSubmit={handleNewsSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs text-zinc-500 uppercase tracking-widest">기사 원문 링크 (URL)</label>
                <input 
                  type="text" 
                  placeholder="https://..."
                  value={newsFormData.url}
                  onChange={(e) => setNewsFormData({...newsFormData, url: e.target.value})}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 focus:border-gold outline-none" 
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 uppercase tracking-widest">제목</label>
                  <input 
                    required
                    type="text" 
                    value={newsFormData.title}
                    onChange={(e) => setNewsFormData({...newsFormData, title: e.target.value})}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 focus:border-gold outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 uppercase tracking-widest">카테고리</label>
                  <select 
                    value={newsFormData.category}
                    onChange={(e) => setNewsFormData({...newsFormData, category: e.target.value as any})}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 focus:border-gold outline-none"
                  >
                    <option value="gold">금</option>
                    <option value="exchange">환율</option>
                    <option value="international">국제정세</option>
                    <option value="economy">경제</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs text-zinc-500 uppercase tracking-widest">썸네일 이미지</label>
                    <label className="text-[10px] text-gold cursor-pointer hover:underline">
                      파일 업로드
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewsFormData({...newsFormData, imageUrl: reader.result as string});
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      placeholder="이미지 URL 입력"
                      value={newsFormData.imageUrl}
                      onChange={(e) => setNewsFormData({...newsFormData, imageUrl: e.target.value})}
                      className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl p-3 focus:border-gold outline-none text-sm" 
                    />
                    {newsFormData.imageUrl && (
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-zinc-700 bg-zinc-800 flex-shrink-0">
                        <img src={newsFormData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 uppercase tracking-widest">날짜</label>
                  <input 
                    type="date" 
                    value={newsFormData.date}
                    onChange={(e) => setNewsFormData({...newsFormData, date: e.target.value})}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 focus:border-gold outline-none" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-zinc-500 uppercase tracking-widest">요약 (카드 노출용)</label>
                <textarea 
                  required
                  value={newsFormData.summary}
                  onChange={(e) => setNewsFormData({...newsFormData, summary: e.target.value})}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 h-20 focus:border-gold outline-none" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-zinc-500 uppercase tracking-widest">상세 내용</label>
                <textarea 
                  required
                  value={newsFormData.content}
                  onChange={(e) => setNewsFormData({...newsFormData, content: e.target.value})}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 h-48 focus:border-gold outline-none" 
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 uppercase tracking-widest">출처 (Source)</label>
                  <input 
                    type="text" 
                    value={newsFormData.source}
                    onChange={(e) => setNewsFormData({...newsFormData, source: e.target.value})}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 focus:border-gold outline-none" 
                  />
                </div>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={newsFormData.isActive}
                    onChange={(e) => setNewsFormData({...newsFormData, isActive: e.target.checked})}
                    className="w-4 h-4 accent-gold" 
                  />
                  <span className="text-sm">공개 여부 (활성화)</span>
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 py-4 gold-gradient text-black font-bold rounded-xl shadow-lg shadow-gold/10">
                  {editingNews ? '수정 완료' : '뉴스 게시'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsAddingNews(false)}
                  className="px-8 py-4 bg-zinc-800 text-white font-bold rounded-xl"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'news' && !isAddingNews && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 p-1 bg-zinc-800/50 rounded-xl w-fit">
              <button 
                onClick={() => setNewsFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${newsFilter === 'all' ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'text-zinc-400 hover:text-white'}`}
              >
                전체 뉴스
              </button>
              <button 
                onClick={() => setNewsFilter('sample')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${newsFilter === 'sample' ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'text-zinc-400 hover:text-white'}`}
              >
                예시 뉴스
              </button>
              <button 
                onClick={() => setNewsFilter('custom')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${newsFilter === 'custom' ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'text-zinc-400 hover:text-white'}`}
              >
                내가 올린 뉴스
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news
                .filter(item => {
                  if (newsFilter === 'all') return true;
                  return item.type === newsFilter;
                })
                .map((item) => (
                  <div key={item.id} className={`bg-zinc-900 border ${item.isActive ? 'border-gold/20' : 'border-zinc-800'} rounded-2xl overflow-hidden flex flex-col group`}>
                <div className="aspect-video w-full overflow-hidden relative">
                  <img 
                    src={item.imageUrl ? (item.imageUrl.startsWith('data:') ? item.imageUrl : `${item.imageUrl}${item.imageUrl.includes('?') ? '&' : '?'}v=${item.updatedAt || Date.now()}`) : ''} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    referrerPolicy="no-referrer" 
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded text-[10px] font-bold text-gold uppercase tracking-widest">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex flex-col gap-1">
                      <h4 className="font-bold text-lg line-clamp-1">{item.title}</h4>
                      <span className={`text-[9px] font-bold uppercase tracking-tighter ${item.type === 'sample' ? 'text-zinc-500' : 'text-gold'}`}>
                        {item.type === 'sample' ? '예시 뉴스' : '사용자 뉴스'}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                      item.isActive ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                    }`}>
                      {item.isActive ? '공개' : '비공개'}
                    </span>
                  </div>
                  <p className="text-zinc-500 text-sm line-clamp-2 mb-4 flex-1">{item.summary}</p>
                  <div className="mt-auto space-y-3">
                    <div className="flex items-center justify-between text-[10px] text-zinc-500">
                      <div className="flex items-center gap-2">
                        <Calendar size={12} />
                        <span>{item.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe size={12} />
                        <span>{item.source}</span>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4 border-t border-zinc-800">
                      <button 
                        onClick={() => startEditNews(item)}
                        className="p-2 text-zinc-500 hover:text-white transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm('정말 삭제하시겠습니까?')) {
                            onDeleteNews(item.id);
                          }
                        }}
                        className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {news.length === 0 && (
              <div className="col-span-full py-24 text-center text-zinc-500 bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-800">
                등록된 뉴스가 없습니다.
              </div>
            )}
          </div>
        </div>
      )}

        {activeTab === 'prices' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">실시간 시세 관리</h2>
                <p className="text-zinc-500">메인 페이지의 모든 시세 정보를 직접 관리합니다.</p>
              </div>
              <button 
                onClick={() => {
                  setPriceItemFormData({
                    name: '',
                    nameEn: '',
                    buyPrice: 0,
                    sellPrice: 0,
                    change: 'none',
                    changeValue: 0,
                    metal: 'gold',
                    category: 'product',
                    displayOrder: prices.length
                  });
                  setIsAddingPriceItem(true);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all font-bold"
              >
                <Plus size={18} />
                새 시세 항목 추가
              </button>
            </div>

            {/* International & Exchange Rates */}
            <div className="p-8 bg-zinc-900/50 rounded-[32px] border border-zinc-800 space-y-8">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
                국제 시세 및 환율
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">국제 금 (USD/oz)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                    <input 
                      type="number" 
                      step="0.01" 
                      value={localInternational.goldUsd} 
                      onChange={(e) => handleInternationalChange('goldUsd', parseFloat(e.target.value))}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-4 pl-8 text-white focus:border-gold/50 outline-none transition-all" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">국제 은 (USD/oz)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                    <input 
                      type="number" 
                      step="0.01" 
                      value={localInternational.silverUsd} 
                      onChange={(e) => handleInternationalChange('silverUsd', parseFloat(e.target.value))}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-4 pl-8 text-white focus:border-gold/50 outline-none transition-all" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">원/달러 환율 (KRW)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">₩</span>
                    <input 
                      type="number" 
                      step="0.1" 
                      value={localInternational.exchangeRate} 
                      onChange={(e) => handleInternationalChange('exchangeRate', parseFloat(e.target.value))}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-4 pl-8 text-white focus:border-gold/50 outline-none transition-all" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Market Prices (Main Table) */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <span className="w-1.5 h-6 gold-gradient rounded-full" />
                메인 시장 시세 (국내 금/은)
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {localPrices.filter(p => p.category === 'market').map((price) => (
                  <div key={price.id} className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800 flex flex-wrap items-center gap-6 hover:border-gold/30 transition-all">
                    <div className="flex-1 min-w-[150px]">
                      <span className="text-xs text-zinc-500 uppercase font-bold block mb-1">{price.metal === 'gold' ? '금' : '은'}</span>
                      <span className="text-lg font-bold text-white">{price.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 uppercase font-bold">살 때</label>
                        <input 
                          type="number" 
                          value={price.buyPrice} 
                          onChange={(e) => handlePriceChange(price.id, 'buyPrice', parseInt(e.target.value))}
                          className="w-32 bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-sm text-white" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 uppercase font-bold">팔 때</label>
                        <input 
                          type="number" 
                          value={price.sellPrice} 
                          onChange={(e) => handlePriceChange(price.id, 'sellPrice', parseInt(e.target.value))}
                          className="w-32 bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-sm text-white" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 uppercase font-bold">등락</label>
                        <select 
                          value={price.change}
                          onChange={(e) => handlePriceChange(price.id, 'change', e.target.value)}
                          className="w-24 bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-sm text-white"
                        >
                          <option value="up">상승 ▲</option>
                          <option value="down">하락 ▼</option>
                          <option value="none">보합 -</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 uppercase font-bold">변동폭</label>
                        <input 
                          type="number" 
                          value={price.changeValue} 
                          onChange={(e) => handlePriceChange(price.id, 'changeValue', parseInt(e.target.value))}
                          className="w-24 bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-sm text-white" 
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={async () => {
                          await onEditPrice(price.id, price);
                          alert('항목이 저장되었습니다.');
                        }}
                        className="p-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 rounded-lg transition-all"
                        title="이 항목만 저장"
                      >
                        <Check size={18} />
                      </button>
                      <button 
                        onClick={() => {
                          setEditingPriceItem(price);
                          setPriceItemFormData({ ...price });
                        }}
                        className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Prices Management */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <span className="w-1.5 h-6 bg-zinc-500 rounded-full" />
                제품별 시세 관리 (추가/삭제 가능)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {localPrices.filter(p => p.category !== 'market').map((price) => (
                  <div key={price.id} className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800 space-y-4 hover:border-zinc-600 transition-all group">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">
                          {price.category === 'product' ? '순금 제품' : '은 제품'}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-white group-hover:text-gold transition-colors">{price.name}</span>
                          <span className={`text-xs font-bold ${price.change === 'up' ? 'text-red-500' : price.change === 'down' ? 'text-blue-500' : 'text-zinc-600'}`}>
                            {price.change === 'up' ? '+' : price.change === 'down' ? '-' : ''}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button 
                          onClick={async () => {
                            await onEditPrice(price.id, price);
                            alert('항목이 저장되었습니다.');
                          }}
                          className="p-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 rounded-lg transition-all"
                          title="이 항목만 저장"
                        >
                          <Check size={16} />
                        </button>
                        <button 
                          onClick={() => {
                            setEditingPriceItem(price);
                            setPriceItemFormData({ ...price });
                          }}
                          className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => {
                            if (window.confirm('정말 삭제하시겠습니까?')) {
                              onDeletePrice(price.id);
                            }
                          }}
                          className="p-2 hover:bg-red-500/10 rounded-lg text-zinc-500 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 uppercase font-bold">살 때</label>
                        <input 
                          type="number" 
                          value={price.buyPrice} 
                          onChange={(e) => handlePriceChange(price.id, 'buyPrice', parseInt(e.target.value))}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-sm text-white" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 uppercase font-bold">팔 때</label>
                        <input 
                          type="number" 
                          value={price.sellPrice} 
                          onChange={(e) => handlePriceChange(price.id, 'sellPrice', parseInt(e.target.value))}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-sm text-white" 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="sticky bottom-0 pt-8 pb-4 bg-zinc-950/80 backdrop-blur-md border-t border-white/5 z-10">
              <button 
                onClick={handlePricesSubmit}
                className="w-full py-5 gold-gradient text-black font-bold rounded-2xl shadow-2xl shadow-gold/20 hover:scale-[1.01] active:scale-[0.99] transition-all text-lg"
              >
                모든 시세 변경사항 저장하기
              </button>
            </div>
          </div>
        )}

        {activeTab === 'consultations' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-widest">
                  <th className="px-6 py-4 font-medium">신청자</th>
                  <th className="px-6 py-4 font-medium">연락처</th>
                  <th className="px-6 py-4 font-medium">희망 날짜</th>
                  <th className="px-6 py-4 font-medium">사진</th>
                  <th className="px-6 py-4 font-medium">내용</th>
                  <th className="px-6 py-4 font-medium">신청일</th>
                  <th className="px-6 py-4 font-medium text-right">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {[...consultations].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((c) => (
                  <tr key={c.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-white">{c.name}</span>
                        <span className="text-xs text-zinc-500">{c.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-400">{c.phone}</td>
                    <td className="px-6 py-4 text-gold font-medium">{c.preferredDate || '-'}</td>
                    <td className="px-6 py-4">
                      {c.photoUrl ? (
                        <img 
                          src={c.photoUrl} 
                          alt="Consultation" 
                          className="w-10 h-10 rounded object-cover cursor-pointer hover:scale-150 transition-transform" 
                          onClick={() => window.open(c.photoUrl, '_blank')}
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="text-zinc-600 text-xs">없음</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-zinc-400 max-w-md truncate">{c.content}</td>
                    <td className="px-6 py-4 text-zinc-500 text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onUpdateConsultation(c.id, c.status === 'pending' ? 'completed' : 'pending')}
                        className={`flex items-center gap-2 ml-auto px-3 py-1.5 rounded-lg border transition-all ${
                          c.status === 'pending' 
                            ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20' 
                            : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20'
                        }`}
                      >
                        {c.status === 'completed' && <Check size={14} />}
                        <span className="text-[10px] font-bold">
                          {c.status === 'pending' ? '대기중' : '완료'}
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
                {consultations.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">신청된 상담이 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-12">
            <div className="space-y-6">
              <h4 className="text-xl font-medium flex items-center gap-2">
                <span className="w-1 h-6 bg-gold rounded-full" />
                브랜드 설정
              </h4>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 uppercase tracking-widest ml-1">사이트 이름</label>
                  <input 
                    type="text" 
                    value={localSiteName}
                    onChange={(e) => setLocalSiteName(e.target.value)}
                    placeholder="사이트 이름을 입력하세요"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-gold/50 focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 uppercase tracking-widest ml-1">로고 이미지 URL</label>
                  <div className="flex gap-4">
                    <input 
                      type="text" 
                      value={localLogoUrl}
                      onChange={(e) => setLocalLogoUrl(e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-gold/50 focus:outline-none"
                    />
                    <div className="w-14 h-14 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-center overflow-hidden">
                      {localLogoUrl ? (
                        <img src={localLogoUrl} alt="Logo Preview" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                      ) : (
                        <Settings size={20} className="text-zinc-700" />
                      )}
                    </div>
                  </div>
                  <p className="text-[10px] text-zinc-500 italic mt-1">* 외부 이미지 URL을 입력하거나 /logo.png 를 사용하세요.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 uppercase tracking-widest ml-1">회사 위치 (주소)</label>
                  <input 
                    type="text" 
                    value={localAddress}
                    onChange={(e) => setLocalAddress(e.target.value)}
                    placeholder="서울특별시 종로구..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-gold/50 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-500 uppercase tracking-widest ml-1">고객센터 전화번호</label>
                    <input 
                      type="text" 
                      value={localPhone}
                      onChange={(e) => setLocalPhone(e.target.value)}
                      placeholder="1588-0000"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-gold/50 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-500 uppercase tracking-widest ml-1">고객센터 운영시간</label>
                    <input 
                      type="text" 
                      value={localHours}
                      onChange={(e) => setLocalHours(e.target.value)}
                      placeholder="평일 09:00 - 18:00 (주말/공휴일 휴무)"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-gold/50 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-xl font-medium flex items-center gap-2">
                <span className="w-1 h-6 bg-gold rounded-full" />
                회사 소개 설정
              </h4>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 uppercase tracking-widest ml-1">회사 소개글</label>
                  <textarea 
                    value={localAboutText}
                    onChange={(e) => setLocalAboutText(e.target.value)}
                    placeholder="회사 소개 내용을 입력하세요 (여러 문단 가능)"
                    rows={8}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-gold/50 focus:outline-none resize-none"
                  />
                  <p className="text-[10px] text-zinc-500 italic mt-1">* 줄바꿈을 통해 문단을 구분할 수 있습니다.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 uppercase tracking-widest ml-1">소개 이미지 URL</label>
                  <div className="flex gap-4">
                    <input 
                      type="text" 
                      value={localAboutImageUrl}
                      onChange={(e) => setLocalAboutImageUrl(e.target.value)}
                      placeholder="https://example.com/about.jpg"
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-gold/50 focus:outline-none"
                    />
                    <div className="w-14 h-14 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-center overflow-hidden">
                      {localAboutImageUrl ? (
                        <img src={localAboutImageUrl} alt="About Preview" className="max-w-full max-h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <Settings size={20} className="text-zinc-700" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-xl font-medium flex items-center gap-2">
                <span className="w-1 h-6 bg-gold rounded-full" />
                테마 설정
              </h4>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 uppercase tracking-widest ml-1">포인트 컬러</label>
                  <div className="flex items-center gap-3 p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                    <div className="w-6 h-6 bg-gold rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                    <span className="text-sm font-mono text-zinc-400">#D4AF37 (Gold)</span>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleConfigSubmit}
              className="px-12 py-4 gold-gradient text-black font-bold rounded-xl shadow-lg shadow-gold/20"
            >
              사이트 설정 저장하기
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
