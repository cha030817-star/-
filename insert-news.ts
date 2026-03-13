
import Database from 'better-sqlite3';
const db = new Database('gold_exchange.db');

const newsItems = [
  {
    id: 'news-reuters-1',
    title: '중동 갈등에 안전자산 수요 확대',
    summary: '중동 긴장이 이어지면서 안전자산 선호가 강해져 국제 금값이 상승했다. 달러 약세까지 겹치며 금 수요를 지지하고 있다.',
    content: '중동 지역 군사 긴장이 이어지면서 글로벌 투자자들의 안전자산 선호 심리가 강해지고 있습니다.\n\n이에 따라 국제 금 가격은 상승 흐름을 보였으며, 달러 약세가 금값 상승에 추가적인 영향을 주고 있습니다.\n\n시장에서는 지정학적 리스크가 단기간에 해소되기 어렵다고 보고 있으며, 금 수요가 당분간 유지될 가능성이 높다는 분석이 나오고 있습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1610375461246-83df859d849d',
    date: '2026-03-10',
    isActive: 1,
    category: 'gold',
    source: 'Reuters',
    url: 'https://www.reuters.com',
    type: 'custom'
  },
  {
    id: 'news-reuters-2',
    title: '유가 급등락에 글로벌 시장 변동성 확대',
    summary: '중동 전쟁 리스크로 국제 유가가 흔들리며 글로벌 금융시장 변동성이 커지고 있다.',
    content: '이란 관련 긴장 고조와 공급 불안 우려로 국제 유가가 급등락을 반복하고 있습니다.\n\n유가 변동성 확대는 금시장과 외환시장에도 직접적인 영향을 주고 있으며, 투자자들은 안전자산 비중을 늘리는 움직임을 보이고 있습니다.\n\n에너지 가격 상승은 향후 물가에도 영향을 줄 수 있어 시장의 긴장감이 커지고 있습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23',
    date: '2026-03-10',
    isActive: 1,
    category: 'economy',
    source: 'Reuters',
    url: 'https://www.reuters.com',
    type: 'custom'
  },
  {
    id: 'news-reuters-3',
    title: '전쟁 장기화 우려에 환율 시장도 긴장',
    summary: '중동 전쟁 장기화 우려로 외환시장도 관망세가 강해지고 있다.',
    content: '전쟁 관련 불확실성이 길어지면서 외환시장에서도 달러 흐름과 주요 통화 변동성이 확대되고 있습니다.\n\n환율 변화는 금 시세와 직접 연결되는 요소로, 국제 금시장에서도 민감한 반응이 이어지고 있습니다.\n\n시장에서는 향후 지정학적 변수와 미국 금리 방향을 함께 주시하고 있습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5',
    date: '2026-03-11',
    isActive: 1,
    category: 'exchange',
    source: 'Reuters',
    url: 'https://www.reuters.com',
    type: 'custom'
  }
];

const now = Math.floor(Date.now() / 1000);

const insert = db.prepare(`
  INSERT OR REPLACE INTO news (id, title, summary, content, imageUrl, date, isActive, category, source, url, type, updatedAt)
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

console.log('Successfully inserted 3 Reuters style news items.');
