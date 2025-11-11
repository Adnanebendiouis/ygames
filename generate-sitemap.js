import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import path from 'path';

async function generateSitemap() {
  const publicDir = path.resolve('./public');
  if (!existsSync(publicDir)) mkdirSync(publicDir); // ✅ auto-create

  const smStream = new SitemapStream({ hostname: 'https://ygames.shop' });
  const writeStream = createWriteStream(path.join(publicDir, 'sitemap.xml'));
  smStream.pipe(writeStream);

  smStream.write({ url: '/', changefreq: 'weekly', priority: 1.0 });
  smStream.write({ url: '/contact', changefreq: 'monthly', priority: 0.6 });

  smStream.end();
  await streamToPromise(smStream);
  console.log('✅ Sitemap generated at public/sitemap.xml');
}

generateSitemap();
