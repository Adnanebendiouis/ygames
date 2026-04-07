import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import path from 'path';

const HOSTNAME = 'https://www.ygames.shop';
const API_BASE = 'https://api.ygames.shop';

const CATEGORIES = [
  'PlayStation',
  'Xbox',
  'Nintendo',
  'Figurine',
  'Collector',
  'Accessoire',
  'Digital',
  'Promotions',
];

async function fetchAllProducts() {
  const products = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    try {
      const res = await fetch(`${API_BASE}/api/filter/?page=${page}`);
      if (!res.ok) break;
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        products.push(...data.results);
        hasMore = data.next !== null;
        page++;
      } else {
        hasMore = false;
      }
    } catch {
      console.warn(`⚠️  Could not fetch products from API — skipping product URLs`);
      break;
    }
  }
  return products;
}

async function generateSitemap() {
  const publicDir = path.resolve('./public');
  if (!existsSync(publicDir)) mkdirSync(publicDir);

  const smStream = new SitemapStream({ hostname: HOSTNAME });
  const writeStream = createWriteStream(path.join(publicDir, 'sitemap.xml'));
  smStream.pipe(writeStream);

  // Static pages
  smStream.write({ url: '/', changefreq: 'weekly', priority: 1.0 });
  smStream.write({ url: '/contact', changefreq: 'monthly', priority: 0.6 });

  // Category pages
  for (const cat of CATEGORIES) {
    smStream.write({
      url: `/category/${encodeURIComponent(cat)}`,
      changefreq: 'weekly',
      priority: cat === 'Promotions' ? 0.9 : 0.8,
    });
  }

  // Product pages from API
  const products = await fetchAllProducts();
  for (const product of products) {
    smStream.write({
      url: `/product/${product.id}`,
      changefreq: 'monthly',
      priority: 0.7,
      img: product.image ? [{ url: product.image, title: product.name }] : undefined,
    });
  }

  smStream.end();
  await streamToPromise(smStream);
  console.log(`✅ Sitemap generated at public/sitemap.xml (${products.length} products, ${CATEGORIES.length} categories)`);
}

generateSitemap();
