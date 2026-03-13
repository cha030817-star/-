import { Product, Category, GoldPrice, ChartData, InternationalPrice, NewsItem } from './types';

export const GOLD_PRICE_CATEGORIES = [
  '골드바',
  '덩어리(검인)',
  '(돌)반지, 메달, 검인제품',
  '목걸이, 팔찌',
  '동물, 열쇠, 면&팔각 체인',
  '칠보, 무검, 마고자, 단추'
];

export const SILVER_PRICE_CATEGORIES = [
  '그래뉼',
  '실버바(브랜드별 상이)',
  '은수저(99%)',
  '은수저(80%)',
  '은수저(70%)'
];

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '1',
    name: '프리미엄 골드바 100g',
    categoryId: 'cat1',
    price: 12500000,
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=800&auto=format&fit=crop',
    description: '999.9% 순도의 국제 공인 골드바입니다. 투자 가치가 매우 높습니다.',
    isBest: true,
  },
  {
    id: '2',
    name: '순금 골드바 37.5g (10돈)',
    categoryId: 'cat1',
    price: 4680000,
    image: 'https://images.unsplash.com/photo-1589750670744-dc963320c742?q=80&w=800&auto=format&fit=crop',
    description: '가장 대중적인 10돈 골드바입니다. 선물용 및 투자용으로 적합합니다.',
    isNew: true,
  },
  {
    id: '3',
    name: '실버바 1kg',
    categoryId: 'cat2',
    price: 1450000,
    image: 'https://images.unsplash.com/photo-1618409399922-04197670bbd8?q=80&w=800&auto=format&fit=crop',
    description: '999.9% 순은 실버바입니다. 안정적인 자산 배분을 위해 추천합니다.',
    isBest: true,
  },
  {
    id: 's1',
    name: '프리미엄 실버바 500g',
    categoryId: 'cat2',
    price: 750000,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
    description: '투자 입문용으로 적합한 500g 실버바입니다.',
  },
  {
    id: 's2',
    name: '실버 코인 세트',
    categoryId: 'cat2',
    price: 320000,
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=800&auto=format&fit=crop',
    description: '수집 가치가 높은 한정판 실버 코인 세트입니다.',
    isNew: true,
  },
  {
    id: '4',
    name: '아기 돌반지 3.75g (1돈)',
    categoryId: 'cat3',
    price: 485000,
    image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?q=80&w=800&auto=format&fit=crop',
    description: '소중한 아이의 첫 생일을 축하하는 순금 돌반지입니다.',
    isBest: true,
  },
  {
    id: 'b1',
    name: '아기 돌팔찌 11.25g (3돈)',
    categoryId: 'cat3',
    price: 1420000,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
    description: '고급스러운 디자인의 순금 돌팔찌입니다.',
  },
  {
    id: 'b2',
    name: '순금 아기 수저 세트',
    categoryId: 'cat3',
    price: 980000,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
    description: '아이의 건강한 성장을 기원하는 순금 수저입니다.',
    isNew: true,
  },
  {
    id: '5',
    name: '카드형 골드바 1g',
    categoryId: 'cat4',
    price: 145000,
    image: 'https://images.unsplash.com/photo-1589750670744-dc963320c742?q=80&w=800&auto=format&fit=crop',
    description: '지갑에 쏙 들어가는 카드 형태의 미니 골드바입니다.',
  },
  {
    id: 'c1',
    name: '생일 축하 카드바 1.875g',
    categoryId: 'cat4',
    price: 265000,
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=800&auto=format&fit=crop',
    description: '특별한 날을 기념하는 메시지 카드형 골드바입니다.',
    isNew: true,
  },
  {
    id: 'c2',
    name: '기업용 로고 카드바',
    categoryId: 'cat4',
    price: 0,
    image: 'https://images.unsplash.com/photo-1589750670744-dc963320c742?q=80&w=800&auto=format&fit=crop',
    description: '기업 홍보 및 근속 기념을 위한 맞춤형 카드바입니다.',
  },
  {
    id: '6',
    name: '맞춤 제작 순금 메달',
    categoryId: 'cat5',
    price: 0,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
    description: '고객님이 원하시는 디자인으로 제작해 드리는 커스텀 메달입니다. 가격은 상담 후 결정됩니다.',
  },
];

export const SAMPLE_GOLD_PRICES: GoldPrice[] = [
  { id: '1', name: '순금 시세 (24K)', nameEn: '24K Gold Price', buyPrice: 450000, sellPrice: 410000, change: 'up', changeValue: 2500, metal: 'gold', category: 'market', displayOrder: 0 },
  { id: '2', name: '18K 시세', nameEn: '18K Gold Price', buyPrice: 335000, sellPrice: 301000, change: 'up', changeValue: 1800, metal: 'gold', category: 'market', displayOrder: 1 },
  { id: '3', name: '14K 시세', nameEn: '14K Gold Price', buyPrice: 262000, sellPrice: 233000, change: 'down', changeValue: 1200, metal: 'gold', category: 'market', displayOrder: 2 },
  { id: '4', name: '백금 시세', nameEn: 'Platinum Price', buyPrice: 185000, sellPrice: 155000, change: 'none', changeValue: 0, metal: 'gold', category: 'market', displayOrder: 3 },
  { id: '5', name: '은 시세', nameEn: 'Silver Price', buyPrice: 5800, sellPrice: 4700, change: 'up', changeValue: 50, metal: 'silver', category: 'market', displayOrder: 4 },
  
  // Pure Gold Products
  { id: 'p1', name: '골드바', nameEn: 'Gold Bar', buyPrice: 0, sellPrice: 410000, change: 'up', changeValue: 2500, metal: 'gold', category: 'product', displayOrder: 5 },
  { id: 'p2', name: '덩어리(검인)', nameEn: 'Lump', buyPrice: 0, sellPrice: 408000, change: 'up', changeValue: 2500, metal: 'gold', category: 'product', displayOrder: 6 },
  { id: 'p3', name: '(돌)반지, 메달, 검인제품', nameEn: 'Ring/Medal', buyPrice: 0, sellPrice: 405000, change: 'up', changeValue: 2500, metal: 'gold', category: 'product', displayOrder: 7 },
  { id: 'p4', name: '목걸이, 팔찌', nameEn: 'Necklace/Bracelet', buyPrice: 0, sellPrice: 405000, change: 'up', changeValue: 2500, metal: 'gold', category: 'product', displayOrder: 8 },
  { id: 'p5', name: '동물, 열쇠, 면&팔각 체인', nameEn: 'Chain/Key', buyPrice: 0, sellPrice: 403000, change: 'up', changeValue: 2500, metal: 'gold', category: 'product', displayOrder: 9 },
  { id: 'p6', name: '칠보, 무검, 마고자, 단추', nameEn: 'Others', buyPrice: 0, sellPrice: 400000, change: 'up', changeValue: 2500, metal: 'gold', category: 'product', displayOrder: 10 },
  
  // Silver Products
  { id: 's1', name: '그래뉼', nameEn: 'Granule', buyPrice: 5800, sellPrice: 4700, change: 'up', changeValue: 50, metal: 'silver', category: 'silver_product', displayOrder: 11 },
  { id: 's2', name: '실버바(브랜드별 상이)', nameEn: 'Silver Bar', buyPrice: 6000, sellPrice: 4900, change: 'up', changeValue: 100, metal: 'silver', category: 'silver_product', displayOrder: 12 },
  { id: 's3', name: '은수저(99%)', nameEn: 'Silver Spoon 99%', buyPrice: 0, sellPrice: 4500, change: 'up', changeValue: 50, metal: 'silver', category: 'silver_product', displayOrder: 13 },
  { id: 's4', name: '은수저(80%)', nameEn: 'Silver Spoon 80%', buyPrice: 0, sellPrice: 3800, change: 'up', changeValue: 50, metal: 'silver', category: 'silver_product', displayOrder: 14 },
  { id: 's5', name: '은수저(70%)', nameEn: 'Silver Spoon 70%', buyPrice: 0, sellPrice: 3200, change: 'up', changeValue: 50, metal: 'silver', category: 'silver_product', displayOrder: 15 },
];

export const DAILY_CHART_DATA: ChartData[] = [
  { date: '09:00', price: 449000 },
  { date: '11:00', price: 449500 },
  { date: '13:00', price: 448800 },
  { date: '15:00', price: 450200 },
  { date: '17:00', price: 450000 },
];

export const WEEKLY_CHART_DATA: ChartData[] = [
  { date: '02-25', price: 442000 },
  { date: '02-26', price: 445000 },
  { date: '02-27', price: 443000 },
  { date: '02-28', price: 447000 },
  { date: '03-01', price: 448500 },
  { date: '03-02', price: 449000 },
  { date: '03-03', price: 450000 },
];

export const MONTHLY_CHART_DATA: ChartData[] = [
  { date: '02-01', price: 435000 },
  { date: '02-08', price: 438000 },
  { date: '02-15', price: 441000 },
  { date: '02-22', price: 440000 },
  { date: '03-01', price: 448500 },
  { date: '03-03', price: 450000 },
];

export const SILVER_DAILY_CHART_DATA: ChartData[] = [
  { date: '09:00', price: 5750 },
  { date: '11:00', price: 5780 },
  { date: '13:00', price: 5760 },
  { date: '15:00', price: 5820 },
  { date: '17:00', price: 5800 },
];

export const SILVER_WEEKLY_CHART_DATA: ChartData[] = [
  { date: '02-25', price: 5600 },
  { date: '02-26', price: 5650 },
  { date: '02-27', price: 5620 },
  { date: '02-28', price: 5700 },
  { date: '03-01', price: 5750 },
  { date: '03-02', price: 5780 },
  { date: '03-03', price: 5800 },
];

export const SILVER_MONTHLY_CHART_DATA: ChartData[] = [
  { date: '02-01', price: 5400 },
  { date: '02-08', price: 5450 },
  { date: '02-15', price: 5550 },
  { date: '02-22', price: 5500 },
  { date: '03-01', price: 5750 },
  { date: '03-03', price: 5800 },
];



export const SAMPLE_NEWS: NewsItem[] = [
  {
    id: 'n1',
    title: '이란 전쟁 긴장 속 금 가격 상승',
    summary: '중동 긴장과 전쟁 리스크가 커지면서 안전자산 수요가 증가해 금 가격이 상승했습니다.',
    content: '이란을 둘러싼 군사 긴장이 고조되면서 글로벌 금융시장에서는 안전자산에 대한 수요가 빠르게 증가하고 있습니다.\n\n이 영향으로 국제 금 가격은 강세를 보이고 있으며, 투자자들은 지정학적 불확실성이 커질수록 금으로 이동하는 흐름을 보이고 있습니다.\n\n시장에서는 중동 갈등이 지속될 경우 금 가격 변동성이 당분간 이어질 가능성이 높다고 보고 있습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=800&auto=format&fit=crop',
    date: '2026-03-05',
    isActive: true,
    category: 'gold',
    source: 'Yahoo Finance',
    url: 'https://finance.yahoo.com/news/iran-sending-gold-over-5-131530317.html',
    type: 'sample',
    updatedAt: Date.now()
  },
  {
    id: 'n2',
    title: '전쟁 영향으로 달러 강세와 에너지 가격 상승',
    summary: '이란 전쟁 여파로 국제 에너지 가격이 상승하며 달러 강세가 이어지고 있습니다.',
    content: '이란 관련 지정학적 갈등이 확대되면서 국제 에너지 가격이 급등하고 있습니다.\n\n이 상황은 글로벌 금융시장에도 영향을 미쳐 달러 가치 상승으로 이어지고 있으며, 인플레이션 부담도 커질 수 있습니다.\n\n시장에서는 전쟁 리스크가 지속될 경우 에너지 가격과 달러 강세가 동시에 이어질 수 있다고 보고 있습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    date: '2026-03-09',
    isActive: true,
    category: 'economy',
    source: 'Yahoo Finance',
    url: 'https://finance.yahoo.com/news/dollar-energy-prices-spike-continued-144832877.html',
    type: 'sample',
    updatedAt: Date.now()
  },
  {
    id: 'n3',
    title: '중동 긴장에 환율 시장 변동성 확대',
    summary: '중동 갈등 영향으로 글로벌 환율 시장 변동성이 확대되고 있습니다.',
    content: '중동 지역 군사 긴장이 지속되면서 달러와 주요 통화의 변동성이 커지고 있습니다.\n\n에너지 가격 상승과 글로벌 경제 불확실성이 겹치며 안전자산 선호가 강해지고 있습니다.\n\n이 흐름은 금 시세에도 직접 영향을 줄 수 있습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?q=80&w=800&auto=format&fit=crop',
    date: '2026-03-10',
    isActive: true,
    category: 'exchange',
    source: 'Chosun Biz',
    url: 'https://biz.chosun.com/policy/policy_sub/2026/03/10/TKEFQ57XORFVVCF54XOKPHPQD4/',
    type: 'sample',
    updatedAt: Date.now()
  }
];

export const SAMPLE_CHART_DATA: ChartData[] = WEEKLY_CHART_DATA;

export const SAMPLE_INTERNATIONAL_PRICE: InternationalPrice = {
  goldUsd: 2150.45,
  silverUsd: 24.12,
  exchangeRate: 1345.50,
};

export const TRANSLATIONS = {
  ko: {
    goldPrice: '시세 안내',
    buyPrice: '내가 살 때',
    sellPrice: '내가 팔 때',
    domesticPrice: '국내 시세',
    internationalPrice: '국제 시세',
    exchangeRate: '환율',
    referenceNote: '국제 시세 기준 참고용',
    contentTitle: '금 함량 정보',
    day: '일간',
    week: '주간',
    month: '월간',
    products: '제품 컬렉션',
    admin: '관리자',
  },
  en: {
    goldPrice: 'Gold Price',
    buyPrice: 'Buy Price',
    sellPrice: 'Sell Price',
    domesticPrice: 'Domestic Price',
    internationalPrice: 'International Price',
    exchangeRate: 'Exchange Rate',
    referenceNote: 'For reference based on international market',
    contentTitle: 'Gold Content Info',
    day: 'Daily',
    week: 'Weekly',
    month: 'Monthly',
    products: 'Collections',
    admin: 'Admin',
  }
};
