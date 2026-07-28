#!/usr/bin/env node
/**
 * Prerender script for Anstay
 * Generates static HTML for key pages for better SEO
 * Run: node scripts/prerender.js
 */

import fs from 'fs-extra';
import path from 'path';
import { JSDOM } from 'jsdom';
import { renderToString } from 'react-dom/server';
import pkgHelmet from 'react-helmet-async';
const { HelmetProvider } = pkgHelmet;
import { StaticRouter } from 'react-router-dom/server.js';
import React from 'react';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const DIST_DIR = path.resolve(__dirname, '../dist');
const SITE_ORIGIN = 'https://anstay.com.vn';

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
        keywords: 'apartment booking, Vietnam, Hanoi, Ha Long, vacation rental'
    },
    '/about': {
        title: 'About Anstay - Your Travel Experience Partner',
        description: 'Learn about Anstay mission to provide authentic travel experiences in Vietnam.',
        keywords: 'about anstay, company, mission'
    },
    '/contact': {
        title: 'Contact Anstay - Get Help with Your Booking',
        description: 'Contact our support team for any questions about bookings or experiences.',
        keywords: 'contact, support, help'
    },
    '/policy': {
        title: 'Anstay Policies',
        description: 'Read our policies and terms of service.',
        keywords: 'policy, terms, privacy'
    },
};

async function renderPageToHtml(route) {
    try {
        const helmetContext = {};

        // Create virtual DOM
        const dom = new JSDOM('<!DOCTYPE html><html><body><div id="root"></div></body></html>', {
            url: `${SITE_ORIGIN}${route}`,
        });

        // Get the meta data for this route
        const meta = META_DATA[route] || META_DATA['/'];

        // Create the HTML string with meta tags
        const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${meta.title}</title>
  <meta name="description" content="${meta.description}" />
  <meta name="keywords" content="${meta.keywords}" />
  <meta property="og:title" content="${meta.title}" />
  <meta property="og:description" content="${meta.description}" />
  <meta property="og:type" content="website" />
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
</head>
<body>
  <div id="root"><!-- App will hydrate here --></div>
  <script type="module" src="/main.js"><\/script>
</body>
</html>`;

        return html;
    } catch (error) {
        console.error(`Error rendering ${route}:`, error.message);
        return null;
    }
}

async function prerender() {
    console.log('🚀 Starting prerender process...\n');

    try {
        // Ensure dist directory exists
        await fs.ensureDir(DIST_DIR);

        let successCount = 0;
        let errorCount = 0;

        for (const page of PAGES_TO_PRERENDER) {
            try {
                console.log(`📄 Rendering: ${page.path}`);

                const html = await renderPageToHtml(page.path);

                if (html) {
                    const filePath = path.join(DIST_DIR, page.filename);
                    await fs.ensureDir(path.dirname(filePath));
                    await fs.writeFile(filePath, html, 'utf-8');

                    console.log(`✅ Saved: ${page.filename}\n`);
                    successCount++;
                } else {
                    console.log(`❌ Failed to render: ${page.path}\n`);
                    errorCount++;
                }
            } catch (error) {
                console.error(`❌ Error processing ${page.path}:`, error.message, '\n');
                errorCount++;
            }
        }

        console.log('\n=== Prerender Summary ===');
        console.log(`✅ Successfully prerendered: ${successCount} pages`);
        console.log(`❌ Failed: ${errorCount} pages`);
        console.log('\n✨ Prerender complete!');

        process.exit(errorCount > 0 ? 1 : 0);
    } catch (error) {
        console.error('Fatal error:', error);
        process.exit(1);
    }
}

prerender();
