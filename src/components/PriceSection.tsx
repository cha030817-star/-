import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, TrendingDown, Minus, Info, ChevronRight } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { GoldPrice, InternationalPrice, ChartData, Language } from '../types';
import { 
  TRANSLATIONS, 
  DAILY_CHART_DATA, 
  WEEKLY_CHART_DATA, 
  MONTHLY_CHART_DATA, 
  SILVER_DAILY_CHART_DATA,
  SILVER_WEEKLY_CHART_DATA,
  SILVER_MONTHLY_CHART_DATA,
  GOLD_PRICE_CATEGORIES, 
  SILVER_PRICE_CATEGORIES 
} from '../constants';

interface PriceSectionProps {
  prices: GoldPrice[];
  international: InternationalPrice;
  lang: Language;
}

export const PriceSection: React.FC<PriceSectionProps> = ({ prices, international, lang }) => {
  const t = TRANSLATIONS[lang];
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [histories, setHistories] = useState<Record<string, any[]>>({});

  useEffect(() => {
    // Fetch history for main prices (순금 시세 1, 은 시세 5)
    const fetchHistory = async (id: string) => {
      try {
        const res = await fetch(`/api/prices/history/${id}`);
        const data = await res.json();
        setHistories(prev => ({ ...prev, [id]: data }));
      } catch (err) {
        console.error(err);
      }
    };

    fetchHistory('1');
    fetchHistory('5');
  }, []);

  const getChartData = (priceId: string) => {
    const history = histories[priceId] || [];
    
    if (history.length === 0) {
      // Fallback to sample data if no history from API
      if (priceId === '5' || priceId === 's1') { // Silver
        return timeframe === 'daily' ? SILVER_DAILY_CHART_DATA : 
               timeframe === 'weekly' ? SILVER_WEEKLY_CHART_DATA : 
               SILVER_MONTHLY_CHART_DATA;
      }
      return timeframe === 'daily' ? DAILY_CHART_DATA : 
             timeframe === 'weekly' ? WEEKLY_CHART_DATA : 
             MONTHLY_CHART_DATA;
    }
    
    // Filter by timeframe
    let filtered = history;
    if (timeframe === 'daily') {
      filtered = history.slice(-7);
    } else if (timeframe === 'weekly') {
      filtered = history.slice(-14);
    } else {
      filtered = history;
    }

    return filtered.map(h => ({
      date: h.date.split('-').slice(1).join('/'),
      price: h.price
    }));
  };

  const domesticGoldPrices = useMemo(() => {
    return prices.filter(p => p.category === 'market' && p.metal === 'gold');
  }, [prices]);

  const silverPrices = useMemo(() => {
    return prices.filter(p => p.category === 'market' && p.metal === 'silver');
  }, [prices]);

  const goldProductPrices = useMemo(() => {
    return prices.filter(p => p.category === 'product');
  }, [prices]);

  const silverProductPrices = useMemo(() => {
    return prices.filter(p => p.category === 'silver_product');
  }, [prices]);

  const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

  const PriceChart = ({ data, color = "#D4AF37" }: { data: any[], color?: string }) => (
    <div className="h-[120px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
          <XAxis dataKey="date" hide />
          <YAxis hide domain={['auto', 'auto']} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', fontSize: '10px' }}
            itemStyle={{ color }}
          />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke={color} 
            strokeWidth={2} 
            dot={false}
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <section id="gold-price" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-light mb-4 gold-text-gradient font-semibold">실시간 시세 정보</h2>
        <p className="text-zinc-500">{today} 기준 실시간 시세입니다.</p>
      </div>

      {/* Row 1: 3 Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* 1) Domestic Market Prices */}
        <div className="glass-card rounded-[32px] overflow-hidden border-gold/20 flex flex-col shadow-xl">
          <div className="p-6 border-b border-white/5 bg-gold/5">
            <h3 className="text-lg font-bold flex items-center gap-2 text-white">
              <span className="w-1 h-5 bg-gold rounded-full" />
              국내 금/은 시세
            </h3>
            <p className="text-[10px] text-zinc-500 mt-1">단위: 3.75g (1돈) 기준</p>
          </div>
          
          <div className="flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-zinc-500 text-[9px] uppercase tracking-widest border-b border-white/5">
                  <th className="px-4 py-3 font-medium">항목</th>
                  <th className="px-4 py-3 font-medium">살때</th>
                  <th className="px-4 py-3 font-medium">팔때</th>
                  <th className="px-4 py-3 font-medium text-right">+/-</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[...domesticGoldPrices, ...silverPrices].map((price) => (
                  <tr key={price.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-4 py-4">
                      <span className="text-xs font-bold text-zinc-200 group-hover:text-gold transition-colors">{price.name}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium text-white">{price.buyPrice > 0 ? `₩${price.buyPrice.toLocaleString()}` : '-'}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium text-zinc-400">₩{price.sellPrice.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                        price.change === 'up' ? 'text-red-500' : price.change === 'down' ? 'text-blue-500' : 'text-zinc-600'
                      }`}>
                        {price.change === 'up' ? '+' : price.change === 'down' ? '-' : ''}
                        {price.changeValue > 0 ? price.changeValue.toLocaleString() : ''}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2) Gold Product Purchase Price List */}
        <div className="glass-card rounded-[32px] overflow-hidden border-white/10 flex flex-col shadow-xl">
          <div className="p-6 border-b border-white/5 bg-white/5">
            <h3 className="text-lg font-bold flex items-center gap-2 text-white">
              <span className="w-1 h-5 bg-gold rounded-full" />
              순금 제품별 매입시세
            </h3>
            <p className="text-[10px] text-zinc-500 mt-1">고객님이 파실 때 가격 (매입 전용)</p>
          </div>
          
          <div className="p-6 space-y-3 flex-1">
            {goldProductPrices.map((price) => (
              <div key={price.id} className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-xl border border-white/5 hover:border-gold/30 transition-all group">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold ${price.change === 'up' ? 'text-red-500' : price.change === 'down' ? 'text-blue-500' : 'text-zinc-600'}`}>
                    {price.change === 'up' ? '+' : price.change === 'down' ? '-' : ''}
                  </span>
                  <span className="text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors">{price.name}</span>
                </div>
                <span className="text-base font-medium text-gold">₩{price.sellPrice.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3) Silver Product Price List */}
        <div className="glass-card rounded-[32px] overflow-hidden border-white/10 flex flex-col shadow-xl">
          <div className="p-6 border-b border-white/5 bg-white/5">
            <h3 className="text-lg font-bold flex items-center gap-2 text-white">
              <span className="w-1 h-5 bg-zinc-500 rounded-full" />
              은 제품 시세
            </h3>
            <p className="text-[10px] text-zinc-500 mt-1">실버바 및 은수저 시세</p>
          </div>
          
          <div className="p-6 space-y-3 flex-1">
            {silverProductPrices.map((price) => (
              <div key={price.id} className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-xl border border-white/5 hover:border-zinc-300 transition-all group">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold ${price.change === 'up' ? 'text-red-500' : price.change === 'down' ? 'text-blue-500' : 'text-zinc-600'}`}>
                    {price.change === 'up' ? '+' : price.change === 'down' ? '-' : ''}
                  </span>
                  <span className="text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors">{price.name}</span>
                </div>
                <span className="text-base font-medium text-zinc-300">₩{price.sellPrice.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Wide Graph Area */}
      <div className="glass-card rounded-[32px] overflow-hidden border-white/5 mb-12 shadow-2xl">
        <div className="p-8 border-b border-white/5 bg-zinc-900/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-3">
              <span className="w-1.5 h-6 gold-gradient rounded-full" />
              시세 변동 추이
            </h3>
            <p className="text-xs text-zinc-500 mt-1">국내 금/은 시세 기준 실시간 변동 데이터</p>
          </div>
          <div className="flex bg-zinc-900 p-1 rounded-xl border border-white/10">
            {(['daily', 'weekly', 'monthly'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${
                  timeframe === tf 
                    ? 'bg-gold text-black shadow-lg shadow-gold/20' 
                    : 'text-zinc-500 hover:text-white'
                }`}
              >
                {tf === 'daily' ? '일간' : tf === 'weekly' ? '주간' : '월간'}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12 bg-black/40">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gold" />
                순금(24K) 시세 추이
              </h4>
              <span className="text-[10px] text-zinc-600">단위: ₩/3.75g</span>
            </div>
            <div className="h-[200px]">
              <PriceChart data={getChartData('1')} color="#D4AF37" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-zinc-400" />
                은(Silver) 시세 추이
              </h4>
              <span className="text-[10px] text-zinc-600">단위: ₩/3.75g</span>
            </div>
            <div className="h-[200px]">
              <PriceChart data={getChartData('5')} color="#A1A1AA" />
            </div>
          </div>
        </div>
      </div>

      {/* International & Exchange Rate Summary */}
      <div className="glass-card p-10 rounded-[40px] border-white/5 flex flex-wrap justify-around items-center gap-12 bg-zinc-900/30 backdrop-blur-3xl">
        <div className="text-center group cursor-help">
          <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold mb-3 group-hover:text-gold transition-colors">International Gold</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-light text-white">$</span>
            <span className="text-4xl font-light text-white tracking-tighter">{international.goldUsd.toLocaleString()}</span>
          </div>
        </div>
        <div className="w-px h-12 bg-white/5 hidden md:block" />
        <div className="text-center group cursor-help">
          <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold mb-3 group-hover:text-zinc-300 transition-colors">International Silver</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-light text-zinc-400">$</span>
            <span className="text-4xl font-light text-zinc-400 tracking-tighter">{international.silverUsd.toLocaleString()}</span>
          </div>
        </div>
        <div className="w-px h-12 bg-white/5 hidden md:block" />
        <div className="text-center group cursor-help">
          <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold mb-3 group-hover:text-white transition-colors">USD/KRW Exchange</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-light text-zinc-500">₩</span>
            <span className="text-4xl font-light text-zinc-200 tracking-tighter">{international.exchangeRate.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
