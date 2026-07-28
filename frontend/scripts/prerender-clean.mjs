#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '../dist');

// Read actual Vite-built index.html to extract CSS and script references
function getViteAssets() {
    const mainHtmlPath = path.join(DIST_DIR, 'index.html');
    const assets = { cssLinks: [], scriptSrc: '' };

    try {
        const content = fs.readFileSync(mainHtmlPath, 'utf-8');

        // Extract CSS links
        const cssMatches = content.match(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g);
        if (cssMatches) {
            cssMatches.forEach(match => {
                const href = match.match(/href="([^"]+)"/)[1];
                assets.cssLinks.push(href);
            });
        }

        // Extract script src
        const scriptMatch = content.match(/<script[^>]+type="module"[^>]+src="([^"]+)"/);
        if (scriptMatch && scriptMatch[1]) {
            assets.scriptSrc = scriptMatch[1];
        }

        console.log(`✅ Found ${assets.cssLinks.length} CSS files and script: ${assets.scriptSrc}`);
    } catch (e) {
        console.warn('⚠️  Could not read Vite index.html, using fallbacks');
        assets.scriptSrc = '/js/main.js';
    }

    return assets;
}

const PAGES_TO_PRERENDER = [
    { path: '/', filename: 'index.html' },
    { path: '/alacarte-residence', filename: 'alacarte-residence/index.html' },
    { path: '/checkin', filename: 'checkin/index.html' },
    { path: '/chinh-sach-bao-mat', filename: 'chinh-sach-bao-mat/index.html' },
    { path: '/cham-soc-khach-hang', filename: 'cham-soc-khach-hang/index.html' },
    { path: '/chuong-trinh-hop-tac', filename: 'chuong-trinh-hop-tac/index.html' },
    { path: '/minibar', filename: 'minibar/index.html' },
    { path: '/minibar-qr', filename: 'minibar-qr/index.html' },
    { path: '/about', filename: 'about/index.html' },
    { path: '/contact', filename: 'contact/index.html' },
    { path: '/booking', filename: 'booking/index.html' },
    { path: '/custom-itinerary', filename: 'custom-itinerary/index.html' },
    { path: '/mevabe', filename: 'mevabe/index.html' },
    { path: '/cart', filename: 'cart/index.html' },
    { path: '/booking/checkout', filename: 'booking/checkout/index.html' },
    { path: '/policy', filename: 'policy/index.html' },
    { path: '/apartment-ha-noi', filename: 'apartment-ha-noi/index.html' },
    { path: '/apartment-ha-long', filename: 'apartment-ha-long/index.html' },
    { path: '/apartments/ha-noi', filename: 'apartments/ha-noi/index.html' },
    { path: '/apartments/ha-long', filename: 'apartments/ha-long/index.html' },
    { path: '/booking-page', filename: 'booking-page/index.html' },
    { path: '/about-us', filename: 'about-us/index.html' },
    { path: '/about-us/company', filename: 'about-us/company/index.html' },
    { path: '/about-us/groupcompany', filename: 'about-us/groupcompany/index.html' },
    { path: '/about-us/culture', filename: 'about-us/culture/index.html' },
    { path: '/about-us/our-story', filename: 'about-us/our-story/index.html' },
    { path: '/explore&experience', filename: 'explore&experience/index.html' },
    { path: '/help', filename: 'help/index.html' },
    { path: '/dashbroad', filename: 'dashbroad/index.html' },
    { path: '/support', filename: 'support/index.html' },
    { path: '/search-results', filename: 'search-results/index.html' },
    { path: '/marina-hotel', filename: 'marina-hotel/index.html' },
];

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
    '/about-us/company': {
        title: 'Thông tin doanh nghiệp ANSTAY | Công ty TNHH Thương mại Dịch vụ ANSTAY',
        description: 'Thông tin pháp lý, thương hiệu, ngày thành lập, trụ sở và mã số thuế của Công ty TNHH Thương mại Dịch vụ ANSTAY.',
        keywords: 'ANSTAY, thông tin doanh nghiệp ANSTAY, Công ty TNHH Thương mại Dịch vụ ANSTAY, mã số thuế ANSTAY',
        ogImage: 'https://res.cloudinary.com/drpqrn5jz/image/upload/v1763454528/Anstay_wra7ap.png'
    },
    '/about-us/groupcompany': {
        title: 'Sơ đồ công ty ANSTAY | Cơ cấu tổ chức',
        description: 'Xem sơ đồ công ty và cơ cấu tổ chức của ANSTAY.',
        keywords: 'sơ đồ công ty ANSTAY, cơ cấu tổ chức ANSTAY, ANSTAY group company',
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

function getHTMLTemplate(route, meta, cssLinks, scriptSrc) {
    const cssLinksHTML = cssLinks.map(href => `  <link rel="stylesheet" crossorigin href="${href}" />`).join('\n');

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
  
  <link rel="icon" type="image/png" href="https://res.cloudinary.com/drpqrn5jz/image/upload/v1763454528/Anstay_wra7ap.png" />
  <link rel="canonical" href="https://anstay.com.vn${route}" />
${cssLinksHTML}
  
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
  <div id="root"></div>
  <script type="module" src="${scriptSrc}"><\/script>
</body>
</html>`;
}

async function prerender() {
    console.log('\nStarting SEO prerender process...\n');

    try {
        await fs.ensureDir(DIST_DIR);

        // Get the actual Vite-generated assets
        const assets = getViteAssets();
        console.log('');

        let successCount = 0;
        let errorCount = 0;

        for (const page of PAGES_TO_PRERENDER) {
            try {
                console.log('Prerendering: ' + page.path);

                const meta = META_DATA[page.path] || META_DATA['/'];
                const html = getHTMLTemplate(page.path, meta, assets.cssLinks, assets.scriptSrc);
                const filePath = path.join(DIST_DIR, page.filename);

                await fs.ensureDir(path.dirname(filePath));
                await fs.writeFile(filePath, html, 'utf-8');

                const fileSize = (html.length / 1024).toFixed(2);
                console.log('SUCCESS: ' + page.filename + ' (' + fileSize + ' KB)\n');
                successCount++;
            } catch (error) {
                console.error('ERROR: ' + page.path + ' - ' + error.message + '\n');
                errorCount++;
            }
        }

        console.log('=== Prerender Summary ===');
        console.log('Success: ' + successCount + '/' + PAGES_TO_PRERENDER.length + ' pages');
        if (errorCount > 0) {
            console.log('Failed: ' + errorCount + ' pages');
        }
        console.log('\nPrerender complete!\n');

        process.exit(errorCount > 0 ? 1 : 0);
    } catch (error) {
        console.error('Fatal error:', error);
        process.exit(1);
    }
}

prerender();
