import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("gold_exchange.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image TEXT,
    priceType TEXT DEFAULT 'fixed',
    displayOrder INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS popups (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    imageUrl TEXT,
    buttonText TEXT,
    buttonLink TEXT,
    position TEXT DEFAULT 'center',
    size TEXT DEFAULT 'medium',
    startDate TEXT,
    endDate TEXT,
    isActive INTEGER DEFAULT 1,
    displayOrder INTEGER DEFAULT 0,
    customX TEXT,
    customY TEXT,
    mobileX TEXT,
    mobileY TEXT,
    layoutType TEXT DEFAULT 'image-top'
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    categoryId TEXT NOT NULL,
    price INTEGER NOT NULL,
    image TEXT NOT NULL,
    description TEXT,
    isNew INTEGER DEFAULT 0,
    isBest INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS config (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS gold_prices (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    nameEn TEXT NOT NULL,
    buyPrice INTEGER NOT NULL,
    sellPrice INTEGER NOT NULL,
    change TEXT NOT NULL,
    changeValue INTEGER NOT NULL,
    metal TEXT NOT NULL DEFAULT 'gold',
    category TEXT NOT NULL DEFAULT '',
    displayOrder INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS price_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    priceId TEXT NOT NULL,
    date TEXT NOT NULL,
    price INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS international_prices (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    goldUsd REAL NOT NULL,
    silverUsd REAL NOT NULL,
    exchangeRate REAL NOT NULL
  );

  CREATE TABLE IF NOT EXISTS consultations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    content TEXT NOT NULL,
    preferredDate TEXT,
    photoUrl TEXT,
    status TEXT DEFAULT 'pending',
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS news (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT,
    content TEXT,
    imageUrl TEXT,
    date TEXT,
    isActive INTEGER DEFAULT 1,
    category TEXT,
    source TEXT,
    url TEXT,
    type TEXT DEFAULT 'custom',
    updatedAt INTEGER DEFAULT (strftime('%s', 'now'))
  );
`);

// Migration: Ensure news table has updatedAt column if it already existed
try {
  db.prepare("SELECT updatedAt FROM news LIMIT 1").get();
} catch (e) {
  try {
    db.prepare("ALTER TABLE news ADD COLUMN updatedAt INTEGER DEFAULT (strftime('%s', 'now'))").run();
  } catch (err) {
    console.error("Migration failed:", err);
  }
}

// Seed initial data if empty
db.transaction(() => {
  const configCount = db.prepare("SELECT COUNT(*) as count FROM config").get() as { count: number };
  const defaultConfig = {
    logoUrl: 'https://i.ibb.co/ZzKvrFRW/1.png',
    siteName: 'International First Gold Exchange Co., Ltd.',
    address: '서울특별시 종로구 돈화문로 5가길 1 (돈의동)',
    aboutText: '국제퍼스트금거래소는 투명하고 정직한 거래를 원칙으로 합니다. \n\n수년간의 노하우와 전문성을 바탕으로 고객님의 소중한 자산을 최상의 가치로 보답해 드립니다. \n\n금, 은, 다이아몬드 등 각종 귀금속 매입 및 판매를 전문으로 하며, 실시간 국제 시세를 반영한 정확한 가격을 제시합니다.',
    aboutImageUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1200&auto=format&fit=crop',
    phone: '1588-0000',
    hours: '평일 09:00 - 18:00 (주말/공휴일 휴무)'
  };

  if (configCount.count === 0) {
    Object.entries(defaultConfig).forEach(([key, value]) => {
      db.prepare("INSERT INTO config (key, value) VALUES (?, ?)").run(key, value);
    });
  } else {
    Object.entries(defaultConfig).forEach(([key, value]) => {
      const exists = db.prepare("SELECT 1 FROM config WHERE key = ?").get(key);
      if (!exists) {
        db.prepare("INSERT INTO config (key, value) VALUES (?, ?)").run(key, value);
      }
    });
  }

  // Seed Gold Prices if empty
  const priceCount = db.prepare("SELECT COUNT(*) as count FROM gold_prices").get() as { count: number };
  if (priceCount.count === 0) {
    const samplePrices = [
      { id: '1', name: '순금 시세 (24K) - 실시간', nameEn: '24K Gold Price', buyPrice: 450000, sellPrice: 410000, change: 'up', changeValue: 2500, metal: 'gold', category: 'market' },
      { id: '2', name: '18K 시세', nameEn: '18K Gold Price', buyPrice: 335000, sellPrice: 301000, change: 'up', changeValue: 1800, metal: 'gold', category: 'market' },
      { id: '3', name: '14K 시세', nameEn: '14K Gold Price', buyPrice: 262000, sellPrice: 233000, change: 'down', changeValue: 1200, metal: 'gold', category: 'market' },
      { id: '4', name: '백금 시세', nameEn: 'Platinum Price', buyPrice: 185000, sellPrice: 155000, change: 'none', changeValue: 0, metal: 'gold', category: 'market' },
      { id: '5', name: '은 시세', nameEn: 'Silver Price', buyPrice: 5800, sellPrice: 4700, change: 'up', changeValue: 50, metal: 'silver', category: 'market' },
      { id: 'p1', name: '골드바', nameEn: 'Gold Bar', buyPrice: 0, sellPrice: 410000, change: 'up', changeValue: 2500, metal: 'gold', category: 'product' },
      { id: 'p2', name: '덩어리(검인)', nameEn: 'Lump', buyPrice: 0, sellPrice: 408000, change: 'up', changeValue: 2500, metal: 'gold', category: 'product' },
      { id: 'p3', name: '(돌)반지, 메달, 검인제품', nameEn: 'Ring/Medal', buyPrice: 0, sellPrice: 405000, change: 'up', changeValue: 2500, metal: 'gold', category: 'product' },
      { id: 'p4', name: '목걸이, 팔찌', nameEn: 'Necklace/Bracelet', buyPrice: 0, sellPrice: 405000, change: 'up', changeValue: 2500, metal: 'gold', category: 'product' },
      { id: 'p5', name: '동물, 열쇠, 면&팔각 체인', nameEn: 'Chain/Key', buyPrice: 0, sellPrice: 403000, change: 'up', changeValue: 2500, metal: 'gold', category: 'product' },
      { id: 'p6', name: '칠보, 무검, 마고자, 단추', nameEn: 'Others', buyPrice: 0, sellPrice: 400000, change: 'up', changeValue: 2500, metal: 'gold', category: 'product' },
      { id: 's1', name: '그래뉼', nameEn: 'Granule', buyPrice: 5800, sellPrice: 4700, change: 'up', changeValue: 50, metal: 'silver', category: 'silver_product' },
      { id: 's2', name: '실버바(브랜드별 상이)', nameEn: 'Silver Bar', buyPrice: 6000, sellPrice: 4900, change: 'up', changeValue: 100, metal: 'silver', category: 'silver_product' },
      { id: 's3', name: '은수저(99%)', nameEn: 'Silver Spoon 99%', buyPrice: 0, sellPrice: 4500, change: 'up', changeValue: 50, metal: 'silver', category: 'silver_product' },
      { id: 's4', name: '은수저(80%)', nameEn: 'Silver Spoon 80%', buyPrice: 0, sellPrice: 3800, change: 'up', changeValue: 50, metal: 'silver', category: 'silver_product' },
      { id: 's5', name: '은수저(70%)', nameEn: 'Silver Spoon 70%', buyPrice: 0, sellPrice: 3200, change: 'up', changeValue: 50, metal: 'silver', category: 'silver_product' },
    ];
    const insert = db.prepare("INSERT INTO gold_prices (id, name, nameEn, buyPrice, sellPrice, change, changeValue, metal, category, displayOrder) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    samplePrices.forEach((p, idx) => insert.run(p.id, p.name, p.nameEn, p.buyPrice, p.sellPrice, p.change, p.changeValue, p.metal, p.category, idx));
  }

  // Seed International Prices if empty
  const intlCount = db.prepare("SELECT COUNT(*) as count FROM international_prices").get() as { count: number };
  if (intlCount.count === 0) {
    db.prepare("INSERT INTO international_prices (id, goldUsd, silverUsd, exchangeRate) VALUES (1, 2150.45, 24.12, 1345.50)").run();
  }

  // Seed News if empty
  const newsCount = db.prepare("SELECT COUNT(*) as count FROM news").get() as { count: number };
  if (newsCount.count === 0) {
    const sampleNews = [
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
    const insert = db.prepare("INSERT INTO news (id, title, summary, content, imageUrl, date, isActive, category, source, url, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    sampleNews.forEach(n => insert.run(n.id, n.title, n.summary, n.content, n.imageUrl, n.date, n.isActive, n.category, n.source, n.url, n.type));
  }

  const categoryCount = db.prepare("SELECT COUNT(*) as count FROM categories").get() as { count: number };
  if (categoryCount.count === 0) {
    const insertCategory = db.prepare(`
      INSERT INTO categories (id, name, description, image, priceType, displayOrder)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    insertCategory.run('cat1', '골드바', '99.9% 순도의 프리미엄 골드바', 'https://images.unsplash.com/photo-1610375461246-83df859d849d', 'market', 1);
    insertCategory.run('cat2', '실버바', '투자용 실버바 컬렉션', 'https://images.unsplash.com/photo-1618409399922-04197670bbd8', 'market', 2);
    insertCategory.run('cat3', '아기돌제품', '소중한 아이를 위한 첫 선물', 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a', 'fixed', 3);
    insertCategory.run('cat4', '카드바', '선물하기 좋은 카드형 골드바', 'https://images.unsplash.com/photo-1589750670744-dc963320c742', 'fixed', 4);
    insertCategory.run('cat5', '맞춤제작', '나만의 특별한 귀금속 제작', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f', 'fixed', 5);
  }

  const productCount = db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
  if (productCount.count <= 1) {
    // Clear existing to re-seed with full list if only the initial one exists
    db.prepare("DELETE FROM products").run();
    
    const insertProduct = db.prepare(`
      INSERT INTO products (id, name, categoryId, price, image, description, isNew, isBest)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const sampleProducts = [
      {
        id: '1',
        name: '프리미엄 골드바 100g',
        categoryId: 'cat1',
        price: 12500000,
        image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=800&auto=format&fit=crop',
        description: '999.9% 순도의 국제 공인 골드바입니다. 투자 가치가 매우 높습니다.',
        isBest: 1,
        isNew: 0
      },
      {
        id: '2',
        name: '순금 골드바 37.5g (10돈)',
        categoryId: 'cat1',
        price: 4680000,
        image: 'https://images.unsplash.com/photo-1589750670744-dc963320c742?q=80&w=800&auto=format&fit=crop',
        description: '가장 대중적인 10돈 골드바입니다. 선물용 및 투자용으로 적합합니다.',
        isBest: 0,
        isNew: 1
      },
      {
        id: '3',
        name: '실버바 1kg',
        categoryId: 'cat2',
        price: 1450000,
        image: 'https://images.unsplash.com/photo-1618409399922-04197670bbd8?q=80&w=800&auto=format&fit=crop',
        description: '999.9% 순은 실버바입니다. 안정적인 자산 배분을 위해 추천합니다.',
        isBest: 1,
        isNew: 0
      },
      {
        id: 's1',
        name: '프리미엄 실버바 500g',
        categoryId: 'cat2',
        price: 750000,
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
        description: '투자 입문용으로 적합한 500g 실버바입니다.',
        isBest: 0,
        isNew: 0
      },
      {
        id: 's2',
        name: '실버 코인 세트',
        categoryId: 'cat2',
        price: 320000,
        image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=800&auto=format&fit=crop',
        description: '수집 가치가 높은 한정판 실버 코인 세트입니다.',
        isBest: 0,
        isNew: 1
      },
      {
        id: '4',
        name: '아기 돌반지 3.75g (1돈)',
        categoryId: 'cat3',
        price: 485000,
        image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?q=80&w=800&auto=format&fit=crop',
        description: '소중한 아이의 첫 생일을 축하하는 순금 돌반지입니다.',
        isBest: 1,
        isNew: 0
      },
      {
        id: 'b1',
        name: '아기 돌팔찌 11.25g (3돈)',
        categoryId: 'cat3',
        price: 1420000,
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
        description: '고급스러운 디자인의 순금 돌팔찌입니다.',
        isBest: 0,
        isNew: 0
      },
      {
        id: 'b2',
        name: '순금 아기 수저 세트',
        categoryId: 'cat3',
        price: 980000,
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
        description: '아이의 건강한 성장을 기원하는 순금 수저입니다.',
        isBest: 0,
        isNew: 1
      },
      {
        id: '5',
        name: '카드형 골드바 1g',
        categoryId: 'cat4',
        price: 145000,
        image: 'https://images.unsplash.com/photo-1589750670744-dc963320c742?q=80&w=800&auto=format&fit=crop',
        description: '지갑에 쏙 들어가는 카드 형태의 미니 골드바입니다.',
        isBest: 0,
        isNew: 0
      },
      {
        id: 'c1',
        name: '생일 축하 카드바 1.875g',
        categoryId: 'cat4',
        price: 265000,
        image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=800&auto=format&fit=crop',
        description: '특별한 날을 기념하는 메시지 카드형 골드바입니다.',
        isBest: 0,
        isNew: 1
      },
      {
        id: 'c2',
        name: '기업용 로고 카드바',
        categoryId: 'cat4',
        price: 0,
        image: 'https://images.unsplash.com/photo-1589750670744-dc963320c742?q=80&w=800&auto=format&fit=crop',
        description: '기업 홍보 및 근속 기념을 위한 맞춤형 카드바입니다.',
        isBest: 0,
        isNew: 0
      },
      {
        id: '6',
        name: '맞춤 제작 순금 메달',
        categoryId: 'cat5',
        price: 0,
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
        description: '고객님이 원하시는 디자인으로 제작해 드리는 커스텀 메달입니다. 가격은 상담 후 결정됩니다.',
        isBest: 0,
        isNew: 0
      }
    ];

    for (const p of sampleProducts) {
      insertProduct.run(p.id, p.name, p.categoryId, p.price, p.image, p.description, p.isNew, p.isBest);
    }
  }
})();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/products", (req, res) => {
    const products = db.prepare("SELECT * FROM products").all();
    res.json(products);
  });

  app.get('/api/config', (req, res) => {
    const config = db.prepare("SELECT * FROM config").all() as { key: string, value: string }[];
    const configObj = config.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
    res.json(configObj);
  });

  app.post('/api/config', (req, res) => {
    const fields = ['logoUrl', 'siteName', 'address', 'aboutText', 'aboutImageUrl', 'phone', 'hours'];
    for (const field of fields) {
      if (req.body[field] !== undefined) {
        db.prepare("INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)").run(field, req.body[field]);
      }
    }
    res.json({ success: true });
  });

  app.get("/api/prices", (req, res) => {
    const goldPrices = db.prepare("SELECT * FROM gold_prices ORDER BY displayOrder ASC").all();
    const international = db.prepare("SELECT * FROM international_prices WHERE id = 1").get();
    res.json({ goldPrices, international });
  });

  app.post("/api/prices", (req, res) => {
    const { id, name, nameEn, buyPrice, sellPrice, change, changeValue, metal, category, displayOrder } = req.body;
    db.prepare(`
      INSERT INTO gold_prices (id, name, nameEn, buyPrice, sellPrice, change, changeValue, metal, category, displayOrder)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id || Math.random().toString(36).substr(2, 9), name, nameEn || '', buyPrice, sellPrice, change || 'none', changeValue || 0, metal || 'gold', category || '', displayOrder || 0);
    res.json({ success: true });
  });

  app.put("/api/prices/:id", (req, res) => {
    const { name, nameEn, buyPrice, sellPrice, change, changeValue, metal, category, displayOrder } = req.body;
    db.prepare(`
      UPDATE gold_prices 
      SET name = ?, nameEn = ?, buyPrice = ?, sellPrice = ?, change = ?, changeValue = ?, metal = ?, category = ?, displayOrder = ?
      WHERE id = ?
    `).run(name, nameEn, buyPrice, sellPrice, change, changeValue, metal, category, displayOrder, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/prices/:id", (req, res) => {
    db.prepare("DELETE FROM gold_prices WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/prices/history/:priceId", (req, res) => {
    const history = db.prepare("SELECT * FROM price_history WHERE priceId = ? ORDER BY date ASC").all(req.params.priceId);
    res.json(history);
  });

  app.post("/api/prices/update-all", (req, res) => {
    const { goldPrices, international } = req.body;
    
    const updatePrice = db.prepare(`
      UPDATE gold_prices 
      SET buyPrice = ?, sellPrice = ?, change = ?, changeValue = ?
      WHERE id = ?
    `);

    const insertHistory = db.prepare("INSERT INTO price_history (priceId, date, price) VALUES (?, ?, ?)");
    const today = new Date().toISOString().split('T')[0];

    db.transaction(() => {
      for (const p of goldPrices) {
        updatePrice.run(p.buyPrice, p.sellPrice, p.change, p.changeValue, p.id);
        // Record history for main prices
        if (p.id === '1' || p.id === '5') {
          insertHistory.run(p.id, today, p.sellPrice);
        }
      }
      if (international) {
        db.prepare("UPDATE international_prices SET goldUsd = ?, silverUsd = ?, exchangeRate = ? WHERE id = 1")
          .run(international.goldUsd, international.silverUsd, international.exchangeRate);
      }
    })();

    res.json({ success: true });
  });

  app.post("/api/products", (req, res) => {
    const { id, name, categoryId, price, image, description, isNew, isBest } = req.body;
    const insert = db.prepare(`
      INSERT INTO products (id, name, categoryId, price, image, description, isNew, isBest)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insert.run(id || Math.random().toString(36).substr(2, 9), name, categoryId, price, image, description, isNew ? 1 : 0, isBest ? 1 : 0);
    res.json({ success: true });
  });

  app.delete("/api/products/:id", (req, res) => {
    db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.put("/api/products/:id", (req, res) => {
    const { name, categoryId, price, image, description, isNew, isBest } = req.body;
    const update = db.prepare(`
      UPDATE products 
      SET name = ?, categoryId = ?, price = ?, image = ?, description = ?, isNew = ?, isBest = ?
      WHERE id = ?
    `);
    update.run(name, categoryId, price, image, description, isNew ? 1 : 0, isBest ? 1 : 0, req.params.id);
    res.json({ success: true });
  });

  // Category Routes
  app.get("/api/categories", (req, res) => {
    const categories = db.prepare("SELECT * FROM categories ORDER BY displayOrder ASC").all();
    res.json(categories);
  });

  app.post("/api/categories", (req, res) => {
    const { id, name, description, image, priceType, displayOrder } = req.body;
    const insert = db.prepare(`
      INSERT INTO categories (id, name, description, image, priceType, displayOrder)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    insert.run(id || Math.random().toString(36).substr(2, 9), name, description, image, priceType, displayOrder || 0);
    res.json({ success: true });
  });

  app.put("/api/categories/:id", (req, res) => {
    const { name, description, image, priceType, displayOrder } = req.body;
    const update = db.prepare(`
      UPDATE categories 
      SET name = ?, description = ?, image = ?, priceType = ?, displayOrder = ?
      WHERE id = ?
    `);
    update.run(name, description, image, priceType, displayOrder, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/categories/:id", (req, res) => {
    db.prepare("DELETE FROM categories WHERE id = ?").run(req.params.id);
    // Also delete products in this category?
    db.prepare("DELETE FROM products WHERE categoryId = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Popup Routes
  app.get("/api/popups", (req, res) => {
    const popups = db.prepare("SELECT * FROM popups ORDER BY displayOrder ASC").all();
    res.json(popups);
  });

  app.post("/api/popups", (req, res) => {
    const { id, title, content, imageUrl, buttonText, buttonLink, position, size, startDate, endDate, isActive, displayOrder, customX, customY, mobileX, mobileY, layoutType } = req.body;
    const insert = db.prepare(`
      INSERT INTO popups (id, title, content, imageUrl, buttonText, buttonLink, position, size, startDate, endDate, isActive, displayOrder, customX, customY, mobileX, mobileY, layoutType)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insert.run(
      id || Math.random().toString(36).substr(2, 9),
      title, content, imageUrl, buttonText, buttonLink, position, size, startDate, endDate, isActive ? 1 : 0, displayOrder || 0,
      customX, customY, mobileX, mobileY, layoutType || 'image-top'
    );
    res.json({ success: true });
  });

  app.put("/api/popups/:id", (req, res) => {
    const { title, content, imageUrl, buttonText, buttonLink, position, size, startDate, endDate, isActive, displayOrder, customX, customY, mobileX, mobileY, layoutType } = req.body;
    const update = db.prepare(`
      UPDATE popups 
      SET title = ?, content = ?, imageUrl = ?, buttonText = ?, buttonLink = ?, position = ?, size = ?, startDate = ?, endDate = ?, isActive = ?, displayOrder = ?, customX = ?, customY = ?, mobileX = ?, mobileY = ?, layoutType = ?
      WHERE id = ?
    `);
    update.run(
      title, content, imageUrl, buttonText, buttonLink, position, size, startDate, endDate, isActive ? 1 : 0, displayOrder,
      customX, customY, mobileX, mobileY, layoutType,
      req.params.id
    );
    res.json({ success: true });
  });

  app.delete("/api/popups/:id", (req, res) => {
    db.prepare("DELETE FROM popups WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/posts", (req, res) => {
    const posts = db.prepare("SELECT * FROM posts ORDER BY createdAt DESC").all();
    res.json(posts);
  });

  app.post("/api/posts", (req, res) => {
    const { title, content, type } = req.body;
    const id = Math.random().toString(36).substr(2, 9);
    db.prepare("INSERT INTO posts (id, title, content, type) VALUES (?, ?, ?, ?)").run(id, title, content, type);
    res.json({ success: true });
  });

  app.get("/api/consultations", (req, res) => {
    const consultations = db.prepare("SELECT * FROM consultations ORDER BY createdAt DESC").all();
    res.json(consultations);
  });

  app.post("/api/consultations", (req, res) => {
    const { name, phone, email, content, preferredDate, photoUrl } = req.body;
    const id = Math.random().toString(36).substr(2, 9);
    db.prepare("INSERT INTO consultations (id, name, phone, email, content, preferredDate, photoUrl) VALUES (?, ?, ?, ?, ?, ?, ?)").run(id, name, phone, email, content, preferredDate, photoUrl);
    res.json({ success: true });
  });

  app.put("/api/consultations/:id", (req, res) => {
    const { status } = req.body;
    db.prepare("UPDATE consultations SET status = ? WHERE id = ?").run(status, req.params.id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.get("/api/news", (req, res) => {
    const news = db.prepare("SELECT *, updatedAt FROM news ORDER BY date DESC").all();
    res.json(news);
  });

  app.post("/api/news", (req, res) => {
    const { id, title, summary, content, imageUrl, date, isActive, category, source, url, type } = req.body;
    const now = Math.floor(Date.now() / 1000);
    const insert = db.prepare(`
      INSERT INTO news (id, title, summary, content, imageUrl, date, isActive, category, source, url, type, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insert.run(id || Math.random().toString(36).substr(2, 9), title, summary, content, imageUrl, date, isActive ? 1 : 0, category, source, url, type || 'custom', now);
    res.json({ success: true });
  });

  app.put("/api/news/:id", (req, res) => {
    console.log('PUT /api/news/' + req.params.id, req.body);
    const { title, summary, content, imageUrl, date, isActive, category, source, url, type } = req.body;
    
    try {
      // Get existing news to fill in missing fields if necessary
      const existing = db.prepare("SELECT * FROM news WHERE id = ?").get(req.params.id) as any;
      if (!existing) {
        return res.status(404).json({ error: 'News not found' });
      }

      const update = db.prepare(`
        UPDATE news 
        SET title = ?, summary = ?, content = ?, imageUrl = ?, date = ?, isActive = ?, category = ?, source = ?, url = ?, type = ?, updatedAt = ?
        WHERE id = ?
      `);
      
      const now = Math.floor(Date.now() / 1000);
      const result = update.run(
        title !== undefined ? title : existing.title,
        summary !== undefined ? summary : existing.summary,
        content !== undefined ? content : existing.content,
        imageUrl !== undefined ? imageUrl : existing.imageUrl,
        date !== undefined ? date : existing.date,
        isActive !== undefined ? (isActive ? 1 : 0) : existing.isActive,
        category !== undefined ? category : existing.category,
        source !== undefined ? source : existing.source,
        url !== undefined ? url : existing.url,
        type !== undefined ? type : existing.type,
        now,
        req.params.id
      );
      
      console.log('Update result:', result);
      res.json({ success: true });
    } catch (err) {
      console.error('Database error during news update:', err);
      res.status(500).send(err instanceof Error ? err.message : 'Unknown error');
    }
  });

  app.delete("/api/news/:id", (req, res) => {
    db.prepare("DELETE FROM news WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
