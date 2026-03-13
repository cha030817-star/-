
import Database from 'better-sqlite3';
const db = new Database('gold_exchange.db');

const newsItems = [
  {
    id: 'n1',
    title: '이란 전쟁 긴장 속 금 가격 상승',
    summary: '중동 긴장과 전쟁 리스크가 커지면서 안전자산 수요가 증가해 금 가격이 상승했습니다.',
    content: '이란을 둘러싼 군사 긴장이 고조되면서 글로벌 금융시장에서는 안전자산에 대한 수요가 빠르게 증가하고 있습니다.\n\n이 영향으로 국제 금 가격은 강세를 보이고 있으며, 투자자들은 지정학적 불확실성이 커질수록 금으로 이동하는 흐름을 보이고 있습니다.\n\n시장에서는 중동 갈등이 지속될 경우 금 가격 변동성이 당분간 이어질 가능성이 높다고 보고 있습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1610375461246-83df859d849d',
    date: '2026-03-05',
    isActive: 1,
    category: 'gold',
    source: 'Yahoo Finance',
    url: 'https://finance.yahoo.com/news/iran-sending-gold-over-5-131530317.html',
    type: 'custom'
  },
  {
    id: 'n2',
    title: '전쟁 영향으로 달러 강세와 에너지 가격 상승',
    summary: '이란 전쟁 여파로 국제 에너지 가격이 상승하며 달러 강세가 이어지고 있습니다.',
    content: '이란 관련 지정학적 갈등이 확대되면서 국제 에너지 가격이 급등하고 있습니다.\n\n이 상황은 글로벌 금융시장에도 영향을 미쳐 달러 가치 상승으로 이어지고 있으며, 인플레이션 부담도 커질 수 있습니다.\n\n시장에서는 전쟁 리스크가 지속될 경우 에너지 가격과 달러 강세가 동시에 이어질 수 있다고 보고 있습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23',
    date: '2026-03-09',
    isActive: 1,
    category: 'economy',
    source: 'Yahoo Finance',
    url: 'https://finance.yahoo.com/news/dollar-energy-prices-spike-continued-144832877.html',
    type: 'custom'
  },
  {
    id: 'n3',
    title: '중동 긴장에 환율 시장 변동성 확대',
    summary: '중동 갈등 영향으로 글로벌 환율 시장 변동성이 확대되고 있습니다.',
    content: '중동 지역 군사 긴장이 지속되면서 달러와 주요 통화의 변동성이 커지고 있습니다.\n\n에너지 가격 상승과 글로벌 경제 불확실성이 겹치며 안전자산 선호가 강해지고 있습니다.\n\n이 흐름은 금 시세에도 직접 영향을 줄 수 있습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5',
    date: '2026-03-10',
    isActive: 1,
    category: 'exchange',
    source: 'Chosun Biz',
    url: 'https://biz.chosun.com/policy/policy_sub/2026/03/10/TKEFQ57XORFVVCF54XOKPHPQD4/',
    type: 'custom'
  }
];

const now = Math.floor(Date.now() / 1000);

// Clear existing news to ensure only these 3 show up as requested
db.prepare("DELETE FROM news").run();

const insert = db.prepare(`
  INSERT INTO news (id, title, summary, content, imageUrl, date, isActive, category, source, url, type, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const item of newsItems) {
  insert.run(
    item.id,
    item.title,
    item.summary,
    item.content,
    item.imageUrl,
    item.date,
    item.isActive,
    item.category,
    item.source,
    item.url,
    item.type,
    now
  );
}

console.log('Successfully replaced news with 3 new articles.');
