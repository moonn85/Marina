#!/usr/bin/env node
/**
 * Puppeteer prerender for static SEO pages.
 *
 * Important:
 * - The temporary server always serves the original Vite index.html for SPA
 *   fallbacks, even after prerendered files are written.
 * - A page is only written when React actually mounts content into #root.
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '../dist');

const STATIC_PAGES_TO_PRERENDER = [
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

const PORT = Number(process.env.PRERENDER_PORT || 0);
const HOST = process.env.PRERENDER_HOST || '127.0.0.1';

/**
 * Puppeteer serializes the DOM *after* load, so the hero <video> has already had its
 * `src` set by the deferred-load effect and is frozen into the static HTML — which makes
 * the browser fetch the (large) video eagerly and also causes a hydration mismatch
 * (the client's first render has no src yet). Strip the src so the shipped HTML matches
 * the client's initial render and the video truly loads only after the page is idle.
 */
function deferHeroVideo(html) {
    // The hero <video> is rendered only after the page is idle (loadVideo state). Puppeteer
    // freezes it into the static HTML; remove it entirely so the shipped markup matches the
    // client's initial render (no video) — avoids a hydration mismatch and an eager fetch.
    return html.replace(/<video\b[^>]*class=("|')[^"']*\bslider-video\b[^"']*\1[^>]*>[\s\S]*?<\/video>/gi, '');
}

/**
 * Render-blocking local CSS is the biggest remaining LCP/FCP cost on mobile, and the
 * `media="print"` deferral causes a full-page layout shift (no critical CSS is inlined).
 * The bundles are small (~30KB total), so inline them straight into <head>: this removes
 * the blocking network requests AND keeps CLS at 0 because the styles are present before
 * first paint. Mirrors react-snap's `inlineCss`.
 */
function inlineLocalCss(html) {
    return html.replace(/<link\b[^>]*>/gi, (tag) => {
        if (!/rel=("|')?stylesheet\1?/i.test(tag)) return tag;
        const hrefMatch = tag.match(/\shref=("|')([^"']+)\1/i);
        if (!hrefMatch) return tag;
        let href = hrefMatch[2].replace(/&amp;/g, '&');
        // Only inline same-origin /css/ bundles (skip Google Fonts and other CDNs).
        if (!href.startsWith('/css/')) return tag;
        const cssPath = path.join(DIST_DIR, href.split('?')[0]);
        if (!fs.existsSync(cssPath)) return tag;
        const css = fs.readFileSync(cssPath, 'utf-8');
        // Preserve the deferred marker so any runtime logic stays a no-op on these.
        return `<style data-inlined-from="${href}">${css}</style>`;
    });
}

/**
 * The Google Fonts stylesheet is frozen by the prerender into render-blocking
 * `media="all"`. With the app CSS now inlined there is no full-page reflow, so restore
 * the non-blocking `media="print"` swap to drop ~900ms of render-blocking on mobile.
 * Only the JS-driven link (it carries the onload swap) is touched; the <noscript>
 * fallback is left intact.
 */
function deferFont(html) {
    return html.replace(/<link\b[^>]*fonts\.googleapis\.com[^>]*>/gi, (tag) => {
        if (!/onload=("|')this\.media='all'\1/i.test(tag)) return tag;
        if (/\smedia=("|')[^"']*\1/i.test(tag)) {
            return tag.replace(/\smedia=("|')[^"']*\1/i, ' media="print"');
        }
        return tag.replace(/<link/i, '<link media="print"');
    });
}

function optimizeHtml(html) {
    return deferFont(inlineLocalCss(deferHeroVideo(html)));
}

const CONTENT_SELECTORS = [
    '#root > *',
    'main',
    'header',
    'h1',
    'h2',
    'section',
    '.main-home',
    '.aboutcp',
    '.aboutgcp',
    '.container-about-us',
];

const RENDER_CONCURRENCY = Math.max(1, Number(process.env.PRERENDER_CONCURRENCY) || 2);
const RENDER_ATTEMPTS = Math.max(1, Number(process.env.PRERENDER_ATTEMPTS) || 3);

const contentTypes = {
    '.css': 'text/css',
    '.gif': 'image/gif',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
};

function isAssetRequest(urlPath) {
    return path.extname(urlPath) !== '';
}

function startServer(port, baseIndexHtml) {
    return new Promise((resolve, reject) => {
        const server = http.createServer((req, res) => {
            const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
            const filePath = path.join(DIST_DIR, urlPath);

            try {
                if (isAssetRequest(urlPath) && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                    const ext = path.extname(filePath);
                    const contentType = contentTypes[ext] || 'text/html';
                    res.writeHead(200, { 'Content-Type': `${contentType}; charset=utf-8` });
                    res.end(fs.readFileSync(filePath));
                    return;
                }

                if (isAssetRequest(urlPath)) {
                    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                    res.end('Not found');
                    return;
                }

                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(baseIndexHtml);
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end(error.message);
            }
        });

        server.on('error', reject);
        server.listen(port, HOST, () => {
            const address = server.address();
            const actualPort = typeof address === 'object' && address ? address.port : port;
            console.log(`Temp server running at http://${HOST}:${actualPort}`);
            resolve({ server, port: actualPort });
        });
    });
}

async function waitForReact(page, pageInfo) {
    try {
        await page.waitForSelector(pageInfo.readySelector || CONTENT_SELECTORS.join(','), {
            timeout: pageInfo.readySelector ? 30000 : 15000,
        });

    } catch (error) {
        if (pageInfo.readySelector) throw error;
        await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    return page.evaluate((selectors) => {
        const root = document.getElementById('root');
        return {
            hasContent: selectors.some((selector) => document.querySelector(selector)),
            rootLength: root?.innerHTML.length || 0,
            title: document.title,
        };
    }, CONTENT_SELECTORS);
}

async function prerender() {
    console.log('\nStarting Puppeteer prerender\n');

    let server;
    let browser;

    try {
        const indexPath = path.join(DIST_DIR, 'index.html');
        if (!fs.existsSync(indexPath)) {
            console.error('Error: dist/index.html not found. Run vite build first.');
            process.exit(1);
        }

        const pagesToPrerender = STATIC_PAGES_TO_PRERENDER;
        const baseIndexHtml = fs.readFileSync(indexPath, 'utf-8');
        const serverInfo = await startServer(PORT, baseIndexHtml);
        server = serverInfo.server;
        const serverPort = serverInfo.port;

        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        let successCount = 0;
        let errorCount = 0;

        let nextPageIndex = 0;

        const renderPages = async () => {
            while (nextPageIndex < pagesToPrerender.length) {
                const pageInfo = pagesToPrerender[nextPageIndex++];
                const page = await browser.newPage();
                const pageErrors = [];

                page.setDefaultNavigationTimeout(30000);
                page.setDefaultTimeout(30000);
                page.on('console', (message) => {
                    if (['error', 'warning'].includes(message.type())) {
                        pageErrors.push(`${message.type()}: ${message.text()}`);
                    }
                });
                page.on('pageerror', (error) => {
                    pageErrors.push(`pageerror: ${error.message}`);
                });

                try {
                    console.log(`Rendering: ${pageInfo.path}`);
                    let html;

                    for (let attempt = 1; attempt <= RENDER_ATTEMPTS; attempt++) {
                        try {
                            await page.goto(`http://${HOST}:${serverPort}${pageInfo.path}`, {
                                waitUntil: ['domcontentloaded', 'networkidle2'],
                            });

                            const renderState = await waitForReact(page, pageInfo);
                            if (!renderState.hasContent || renderState.rootLength === 0) {
                                throw new Error('React did not render page content');
                            }

                            html = optimizeHtml(await page.content());
                            break;
                        } catch (error) {
                            if (attempt === RENDER_ATTEMPTS) throw error;
                            console.warn(`  Retrying ${pageInfo.path}: ${error.message}`);
                        }
                    }

                    const filePath = path.join(DIST_DIR, pageInfo.filename);
                    await fs.ensureDir(path.dirname(filePath));
                    await fs.writeFile(filePath, html, 'utf-8');

                    console.log(`  Saved: ${pageInfo.filename} (${(html.length / 1024).toFixed(1)} KB)`);
                    successCount++;
                } catch (error) {
                    console.error(`  Error rendering ${pageInfo.path}: ${error.message}`);
                    if (pageErrors.length) {
                        console.error(pageErrors.slice(0, 8).map((pageError) => `    ${pageError}`).join('\n'));
                    }
                    errorCount++;
                } finally {
                    await page.close();
                }
            }
        };

        const workerCount = Math.min(RENDER_CONCURRENCY, pagesToPrerender.length);
        console.log(`Rendering ${pagesToPrerender.length} page(s) with ${workerCount} concurrent tab(s).`);
        await Promise.all(Array.from({ length: workerCount }, () => renderPages()));

        console.log('\n=== Prerender Summary ===');
        console.log(`Success: ${successCount}/${pagesToPrerender.length}`);
        if (errorCount > 0) {
            console.log(`Failed: ${errorCount}`);
            process.exitCode = 1;
        }
    } catch (error) {
        console.error('Fatal error during prerendering:', error);
        process.exitCode = 1;
    } finally {
        if (browser) await browser.close();
        if (server) server.close();
        console.log('\nPrerendering process finished.');
    }
}

prerender();
