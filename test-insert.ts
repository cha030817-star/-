
import Database from 'better-sqlite3';
const db = new Database('gold_exchange.db');

db.prepare("DELETE FROM news WHERE id LIKE 'test-news-%'").run();
console.log('Test news deleted');
