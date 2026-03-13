import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, Award, Clock } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-bold uppercase tracking-widest mb-6">
              <ShieldCheck size={14} />
              국가공인 금거래소
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-8">
              당신의 가치를 <br />
              <span className="gold-text-gradient">가장 빛나게</span>
            </h1>
            <p className="text-xl text-zinc-400 mb-10 max-w-lg leading-relaxed">
              국제퍼스트 금거래소는 투명한 시세와 정직한 감정으로 
              고객님의 소중한 자산을 최고의 가치로 보답합니다.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 rounded-full gold-gradient text-black font-bold flex items-center gap-2 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all">
                실시간 시세 확인 <ArrowRight size={18} />
              </button>
              <button className="px-8 py-4 rounded-full border border-white/20 hover:bg-white/5 transition-colors font-bold">
                지점 찾기
              </button>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-8 border-t border-white/10 pt-8">
              <div>
                <div className="text-2xl font-bold text-white mb-1">15년+</div>
                <div className="text-xs text-zinc-500 uppercase tracking-tighter">업계 경력</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">99.9%</div>
                <div className="text-xs text-zinc-500 uppercase tracking-tighter">순도 보장</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">24/7</div>
                <div className="text-xs text-zinc-500 uppercase tracking-tighter">시세 모니터링</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000"
                alt="Gold Bars"
                className="w-full h-auto"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 p-6 glass-card rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-zinc-400 uppercase tracking-widest mb-1">현재 금 시세 (3.75g)</div>
                    <div className="text-2xl font-bold text-gold">425,000원</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-emerald-400 font-bold">+1.2%</div>
                    <div className="text-[10px] text-zinc-500">전일대비</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 gold-gradient rounded-full blur-[80px] opacity-30" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gold rounded-full blur-[100px] opacity-20" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
