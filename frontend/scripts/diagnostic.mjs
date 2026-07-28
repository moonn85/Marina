#!/usr/bin/env node
/**
 * Diagnostic: Check what Puppeteer actually sees
 */

import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '../dist');

function startServer(port) {
    return new Promise((resolve) => {
        const server = http.createServer((req, res) => {
            let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);

            if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
                filePath = path.join(DIST_DIR, 'index.html');
            }

            try {
                const ext = path.extname(filePath);
                let contentType = 'text/html';

                if (ext === '.js') contentType = 'application/javascript';
                else if (ext === '.css') contentType = 'text/css';
                else if (ext === '.json') contentType = 'application/json';
                else if (ext === '.svg') contentType = 'image/svg+xml';
                else if (ext === '.png') contentType = 'image/png';
                else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
                else if (ext === '.gif') contentType = 'image/gif';

                const content = fs.readFileSync(filePath);
                res.writeHead(200, { 'Content-Type': `${contentType}; charset=utf-8` });
                res.end(content);
            } catch (err) {
                res.writeHead(404);
                res.end('Not found');
            }
        });

        server.listen(port, () => {
            resolve(server);
        });
    });
}

async function diagnose() {
    console.log('🔍 Puppeteer Diagnostic\n');

    let server;
    let browser;

    try {
        const PORT = 5173;
        server = await startServer(PORT);
        console.log(`✅ Server on port ${PORT}`);

        console.log('🚀 Launching Puppeteer...\n');
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox'],
        });

        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);
        page.setDefaultTimeout(60000);

        // Enable console messages
        page.on('console', msg => {
            console.log(`[BROWSER] ${msg.type().toUpperCase()}: ${msg.text()}`);
        });

        console.log('📄 Loading: http://localhost:5173/\n');

        const response = await page.goto(`http://localhost:${PORT}/`, {
            waitUntil: 'domcontentloaded',
        });
        console.log(`✅ Page loaded (status: ${response.status()})`);

        // Wait for network to idle
        console.log('⏳ Waiting for network to idle...');
        await page.waitForFunction(() => {
            return window.performance.getEntriesByType('resource').length > 0;
        }, { timeout: 10000 }).catch(() => {
            console.log('⚠️  Timeout waiting for resources');
        });

        await new Promise(r => setTimeout(r, 3000));

        // Check #root
        const rootHtml = await page.evaluate(() => {
            const root = document.getElementById('root');
            return {
                exists: !!root,
                innerHTML: root?.innerHTML?.slice(0, 500) || 'EMPTY',
                innerText: root?.innerText?.slice(0, 200) || 'NO TEXT',
                childCount: root?.children?.length || 0,
            };
        });

        console.log('\n📊 #root Status:');
        console.log(`  - Exists: ${rootHtml.exists}`);
        console.log(`  - Children: ${rootHtml.childCount}`);
        console.log(`  - Text: ${rootHtml.innerText}`);
        console.log(`  - HTML (first 500): ${rootHtml.innerHTML}\n`);

        // Get page title
        const title = await page.title();
        console.log(`  - Page title: ${title}`);

        // Check for H1, H2, sections
        const elements = await page.evaluate(() => ({
            h1: document.querySelectorAll('h1').length,
            h2: document.querySelectorAll('h2').length,
            sections: document.querySelectorAll('section').length,
            scripts: document.querySelectorAll('script').length,
        }));

        console.log(`  - H1 tags: ${elements.h1}`);
        console.log(`  - H2 tags: ${elements.h2}`);
        console.log(`  - Sections: ${elements.sections}`);
        console.log(`  - Scripts: ${elements.scripts}\n`);

        // Get full HTML
        const fullHtml = await page.content();
        const htmlSize = fullHtml.length;

        console.log(`📈 Full HTML size: ${(htmlSize / 1024).toFixed(2)} KB`);

        // Check if div#root in HTML
        if (fullHtml.includes('<div id="root">')) {
            const match = fullHtml.match(/<div id="root"[^>]*>([\s\S]{0,1000})/);
            if (match) {
                console.log(`\n📍 #root in HTML (first 1000 chars):`);
                console.log(match[1]);
            }
        }

        // Save diagnostic HTML
        const diagnosticPath = path.join(DIST_DIR, '_diagnostic.html');
        fs.writeFileSync(diagnosticPath, fullHtml);
        console.log(`\n✅ Saved diagnostic HTML to: dist/_diagnostic.html`);

        await page.close();
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        if (browser) await browser.close();
        if (server) server.close();
    }
}

diagnose();
