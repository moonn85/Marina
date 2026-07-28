#!/usr/bin/env node
/**
 * Prerender script for Anstay
 * Generates static HTML for key pages for better SEO
 * Simplified version: uses HTML templates instead of full React SSR
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '../dist');

// Pages to prerender - Add/remove as needed
const PAGES_TO_PRERENDER = [
  { path: '/', filename: 'index.html' },
  { path: '/about', filename: 'about/index.html' },
  { path: '/contact', filename: 'contact/index.html' },
  { path: '/policy', filename: 'policy/index.html' },
  { path: '/apartment-ha-long', filename: 'apartment-ha-long/index.html' },
  { path: '/about-us', filename: 'about-us/index.html' },
  { path: '/support', filename: 'support/index.html' },
];

// Meta data for different routes
const META_DATA = {
  '/': {
    title: 'Anstay - Book Apartments & Experiences in Vietnam | Hanoi, Ha Long',
    description: 'Discover and book beautiful apartments and unique experiences in Vietnam. From Hanoi to Ha Long, enjoy authentic stays with Anstay.',
    keywords: 'apartment booking, Vietnam, Hanoi, Ha Long, vacation rental',
    ogImage: 'https://res.cloudinary.com/drpqrn5jz/image/upload/f_webp,q_75/v1763450336/halong-bay-tour_mpTU2_t0fcmv.jpg'
  },
  '/about': {
    title: 'About Anstay - Your Travel Experience Partner',
    description: 'Learn about Anstay mission to provide authentic travel experiences in Vietnam.',
    keywords: 'about anstay, company, mission',
    ogImage: 'https://res.cloudinary.com/drpqrn5jz/image/upload/v1763454528/Anstay_wra7ap.png'
  },
  '/contact': {
    title: 'Contact Anstay - Get Help with Your Booking',
    description: 'Contact our support team for any questions about bookings or experiences.',
    keywords: 'contact, support, help',
    ogImage: 'https://res.cloudinary.com/drpqrn5jz/image/upload/v1763454528/Anstay_wra7ap.png'
  },
  '/policy': {
    title: 'Anstay Policies',
    description: 'Read our policies and terms of service.',
    keywords: 'policy, terms, privacy',
    ogImage: 'https://res.cloudinary.com/drpqrn5jz/image/upload/v1763454528/Anstay_wra7ap.png'
  },
  '/apartment-ha-noi': {
    title: 'Luxury Apartments in Hanoi - Book Now at Anstay',
    description: 'Discover beautiful apartments in Hanoi. Perfect for business travelers and families.',
    keywords: 'apartments Hanoi, rental Hanoi, vacation apartment',
    ogImage: 'https://res.cloudinary.com/drpqrn5jz/image/upload/v1763454528/Anstay_wra7ap.png'
  },
  '/apartment-ha-long': {
    title: 'Ha Long Bay Apartments & Residences | Anstay',
    description: 'Book stunning apartments in Ha Long Bay with sea views. Perfect destination for your Vietnam vacation.',
    keywords: 'Ha Long apartments, Ha Long Bay, vacation rental',
    ogImage: 'https://res.cloudinary.com/drpqrn5jz/image/upload/f_webp,q_75/v1763450336/halong-bay-tour_mpTU2_t0fcmv.jpg'
  },
};

function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

function getHTMLTemplate(route, meta) {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${escapeHtml(meta.title)}</title>
  <meta name="description" content="${escapeHtml(meta.description)}" />
  <meta name="keywords" content="${escapeHtml(meta.keywords)}" />
  <meta property="og:title" content="${escapeHtml(meta.title)}" />
  <meta property="og:description" content="${escapeHtml(meta.description)}" />
  <meta property="og:image" content="${escapeHtml(meta.ogImage)}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://anstay.com.vn${route}" />
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
  <meta name="googlebot" content="index, follow" />
  <meta name="author" content="ANSTAY" />
  <meta name="geo.position" content="20.9590;107.0436" />
  
  <link rel="icon" type="image/png" href="https://res.cloudinary.com/drpqrn5jz/image/upload/v1763454528/Anstay_wra7ap.png" />
  <link rel="canonical" href="https://anstay.com.vn${route}" />
  
  <!-- Google tag (gtag.js) - delayed -->
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.__loadAnstayAnalytics = function () {
      if (window.__anstayAnalyticsLoaded) return;
      window.__anstayAnalyticsLoaded = true;
      var script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=G-H89XYWWVD8';
      document.head.appendChild(script);
      gtag('js', new Date());
      gtag('config', 'G-H89XYWWVD8');
    };
    window.addEventListener('load', function () {
      setTimeout(window.__loadAnstayAnalytics, 12000);
    }, { once: true });
  <\/script>
  
  <!-- Preload critical resources -->
  <link rel="preload" as="script" href="/main.js" />
  
  <!-- Schema.org JSON-LD Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "${escapeHtml(meta.title)}",
    "description": "${escapeHtml(meta.description)}",
    "url": "https://anstay.com.vn${route}",
    "image": "${escapeHtml(meta.ogImage)}",
    "publisher": {
      "@type": "Organization",
      "name": "ANSTAY",
      "logo": {
        "@type": "ImageObject",
        "url": "https://res.cloudinary.com/drpqrn5jz/image/upload/v1763454528/Anstay_wra7ap.png"
      }
    }
  }
  <\/script>
</head>
<body>
  <div id="root">
    <!-- React app will hydrate and render here -->
  </div>
  <script type="module" src="/main.js"><\/script>
</body>
</html>`;
}

async function prerender() {
  console.log('\\n🚀 Starting SEO prerender process...\\n');

  try {
    // Ensure dist directory exists
    await fs.ensureDir(DIST_DIR);

    let successCount = 0;
    let errorCount = 0;

    for (const page of PAGES_TO_PRERENDER) {
      try {
        console.log(`📄 Prerendering: ${page.path}`);

        // Get meta data for this route
        const meta = META_DATA[page.path] || META_DATA['/'];

        // Generate HTML template
        const html = getHTMLTemplate(page.path, meta);

        // Write to file
        const filePath = path.join(DIST_DIR, page.filename);
        await fs.ensureDir(path.dirname(filePath));
        await fs.writeFile(filePath, html, 'utf-8');

        const fileSize = (html.length / 1024).toFixed(2);
        console.log(`✅ Saved: ${page.filename} (${fileSize} KB)\n`);
        successCount++;
      } catch (error) {
        console.error(`❌ Error processing ${page.path}:`, error.message, '\n');
        errorCount++;
      }
    }

    console.log('\\n=== 📊 Prerender Summary ===');
    console.log(`✅ Successfully prerendered: ${successCount}/${PAGES_TO_PRERENDER.length} pages`);
    if (errorCount > 0) {
      console.log(`❌ Failed: ${errorCount} pages`);
    }
    console.log('\\n📁 Generated HTML files in dist/');
    console.log('\\n✨ SEO prerender complete!');
    console.log('\\n💡 Next steps:');
    console.log('   1. Run: npm run preview');
    console.log('   2. Check: curl http://localhost:4173 | grep -i "<title"');
    console.log('   3. Deploy to server');
    console.log('\\n');

    process.exit(errorCount > 0 ? 1 : 0);
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

prerender();
