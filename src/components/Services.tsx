import { motion } from 'motion/react';
import { ShoppingBag, Scale, Briefcase, Gem, ShieldCheck, Truck } from 'lucide-react';

const SERVICES = [
  {
    title: '금/은 매입 및 매도',
    description: '당일 최고 시세로 투명하게 매입하며, 엄격한 품질의 골드바를 판매합니다.',
    icon: ShoppingBag,
  },
  {
    title: '전문 감정 서비스',
    description: '국가공인 감정사가 최첨단 장비를 사용하여 정확한 함량과 가치를 측정합니다.',
    icon: Scale,
  },
  {
    title: '기업용 기프트',
    description: '근속 기념, 창립 기념 등 기업의 품격을 높여주는 맞춤형 금제품을 제작합니다.',
    icon: Briefcase,
  },
  {
    title: '다이아몬드/유색보석',
    description: 'GIA 등 공신력 있는 기관의 감정서가 첨부된 보석류를 취급합니다.',
    icon: Gem,
  },
  {
    title: '안전 보관 서비스',
    description: '고객님의 소중한 자산을 철저한 보안 시스템 하에 안전하게 보관해 드립니다.',
    icon: ShieldCheck,
  },
  {
    title: '전국 안심 배송',
    description: '고가의 자산인 만큼 특수 물류 시스템을 통해 안전하게 문 앞까지 배송합니다.',
    icon: Truck,
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-gold uppercase tracking-[0.3em] mb-4">Our Expertise</h2>
          <h3 className="text-4xl md:text-5xl font-bold mb-6">차별화된 전문 서비스</h3>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            국제퍼스트 금거래소는 단순한 거래를 넘어 고객의 자산 가치를 
            극대화하기 위한 토탈 케어 솔루션을 제공합니다.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service, idx) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-gold/30 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center mb-6 group-hover:gold-gradient transition-all">
                <service.icon className="text-gold group-hover:text-black transition-colors" size={28} />
              </div>
              <h4 className="text-xl font-bold mb-4 group-hover:text-gold transition-colors">{service.title}</h4>
              <p className="text-zinc-400 leading-relaxed text-sm">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
