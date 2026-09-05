const fs = require('fs');
const path = require('path');

// Helper function to slugify event names, consistent with eventService.ts
const slugify = (text) => {
  if (!text) {
    return '';
  }
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const generateSitemap = () => {
  const baseUrl = 'https://mynextbib.com';
  const pages = ['/', '/faq', '/wizard', '/results'];
  const sitemapPath = path.resolve(__dirname, 'public', 'sitemap.xml');
  const prdPath = path.resolve(__dirname, 'public', 'prd.txt');

  try {
    let eventUrls = [];
    
    // Read and parse prd.txt for dynamic event URLs
    if (fs.existsSync(prdPath)) {
      try {
        const prdContent = fs.readFileSync(prdPath, 'utf8');
        const events = JSON.parse(prdContent);
        
        eventUrls = Object.values(events).map(event => {
          const slug = slugify(event.event_name);
          return `${baseUrl}/event/${slug}/`;
        });
        
        console.log(`Found ${eventUrls.length} events for sitemap.`);
      } catch (err) {
        console.error('Error parsing prd.txt:', err);
      }
    } else {
      console.warn('prd.txt not found, skipping dynamic event URLs.');
    }

    const allUrls = [...pages.map(page => `${baseUrl}${page}`), ...eventUrls];

    const sitemapContent = `
      <?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${allUrls.map(url => `
          <url>
            <loc>${url}</loc>
            <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>${url.includes('/event/') ? '0.7' : '0.8'}</priority>
          </url>`).join('')}
      </urlset>
    `.trim();

    fs.writeFileSync(sitemapPath, sitemapContent);
    console.log('Sitemap generated successfully!');
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
};

generateSitemap();
