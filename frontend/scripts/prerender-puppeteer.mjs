#!/usr/bin/env node
/**
 * Prerender script using Puppeteer
 * Actually renders React components server-side
 * Run: npm run build:ssr
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'vite';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '../dist');
const ROOT_DIR = path.resolve(__dirname, '..');

const PAGES_TO_PRERENDER = [
    { path: '/', filename: 'index.html' },
    { path: '/about', filename: 'about/index.html' },
    { path: '/contact', filename: 'contact/index.html' },
    { path: '/policy', filename: 'policy/index.html' },
    { path: '/apartment-ha-long', filename: 'apartment-ha-long/index.html' },
    { path: '/about-us', filename: 'about-us/index.html' },
    { path: '/support', filename: 'support/index.html' },
];

async function prerender() {
    console.log('\n🚀 Starting Puppeteer Prerender...\n');

    let server;
    let browser;

    try {
        // Step 1: Start Vite preview server
        console.log('📦 Starting preview server...');
        server = await createServer({
            root: ROOT_DIR,
            server: { middlewareMode: true },
        });

        const app = require('express')();
        app.use(server.middlewares);
        app.use((req, res, next) => {
            // Serve dist files
            const file = path.join(DIST_DIR, req.url);
            if (fs.existsSync(file)) {
                return res.sendFile(file);
            }
            // Fallback to index.html for SPA
            res.sendFile(path.join(DIST_DIR, 'index.html'));
        });

        const PORT = 5173;
        await new Promise((resolve) => {
            const httpServer = app.listen(PORT, () => {
                console.log(`✅ Preview server running on http://localhost:${PORT}\n`);
                resolve();
            });
        });

        // Step 2: Launch Puppeteer
        console.log('🔍 Launching Puppeteer...');
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        let successCount = 0;
        let errorCount = 0;

        // Step 3: Render each page
        for (const page of PAGES_TO_PRERENDER) {
            try {
                console.log(`📄 Rendering: ${page.path}`);

                const puppeteerPage = await browser.newPage();
                await puppeteerPage.goto(`http://localhost:5173${page.path}`, {
                    waitUntil: 'networkidle2',
                    timeout: 30000,
                });

                // Wait for React to render
                await puppeteerPage.waitForSelector('[data-prerender="true"]', {
                    timeout: 10000
                }).catch(() => {
                    console.log('⚠️  No prerender marker found, using full page');
                });

                // Get full HTML
                const html = await puppeteerPage.content();

                // Save to dist
                const filePath = path.join(DIST_DIR, page.filename);
                await fs.ensureDir(path.dirname(filePath));
                await fs.writeFile(filePath, html, 'utf-8');

                // Check if content was actually rendered
                if (html.includes('<h1>') || html.includes('<h2>')) {
                    console.log(`✅ Saved: ${page.filename} (with content)\n`);
                    successCount++;
                } else {
                    console.log(`⚠️  Saved: ${page.filename} (content may be empty)\n`);
                }

                await puppeteerPage.close();
            } catch (error) {
                console.error(`❌ Error rendering ${page.path}:`, error.message, '\n');
                errorCount++;
            }
        }

        // Step 4: Check result
        console.log('\n=== 📊 Prerender Summary ===');
        console.log(`✅ Successfully prerendered: ${successCount}/${PAGES_TO_PRERENDER.length} pages`);
        if (errorCount > 0) {
            console.log(`❌ Failed: ${errorCount} pages`);
        }

        // Verify index.html has content
        const indexPath = path.join(DIST_DIR, 'index.html');
        const indexContent = await fs.readFile(indexPath, 'utf-8');
        if (indexContent.includes('<h1>') || indexContent.includes('<h2>')) {
            console.log('✨ ✅ Index.html has H1/H2 - Prerender SUCCESS!');
        } else {
            console.log('⚠️  Index.html still empty - Check Puppeteer rendering');
        }

        console.log('\n✨ Prerender complete!');
        process.exit(errorCount > 0 ? 1 : 0);

    } catch (error) {
        console.error('Fatal error:', error);
        process.exit(1);
    } finally {
        if (browser) await browser.close();
        if (server) await server.close();
    }
}

prerender();
