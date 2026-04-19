/**
 * Playwright UX Audit Tests - Maison d'Ombre
 * Validates improvements from the audit
 */

const { chromium } = require('playwright');

const BASE_URL = 'http://127.0.0.1:8888';

async function runTests() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        viewport: { width: 1440, height: 900 }
    });
    const page = await context.newPage();

    console.log('\n========================================');
    console.log('  MAISON D\'OMBRE - UX AUDIT TESTS');
    console.log('========================================\n');

    let passed = 0;
    let failed = 0;

    // Test 1: WhatsApp Button Exists
    console.log('TEST 1: WhatsApp Button...');
    try {
        await page.goto(BASE_URL, { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000); // Wait for animations

        const whatsappBtn = await page.$('.whatsapp-float');
        if (whatsappBtn) {
            const isVisible = await whatsappBtn.isVisible();
            if (isVisible) {
                console.log('  ✓ WhatsApp button is visible');
                passed++;

                // Check position (bottom-right)
                const box = await whatsappBtn.boundingBox();
                if (box && box.x > 1300 && box.y > 800) {
                    console.log('  ✓ WhatsApp button positioned correctly (bottom-right)');
                    passed++;
                } else {
                    console.log('  ✗ WhatsApp button position incorrect');
                    failed++;
                }

                // Check size >= 56px
                if (box && box.width >= 56 && box.height >= 56) {
                    console.log('  ✓ WhatsApp button size OK (>= 56px)');
                    passed++;
                } else {
                    console.log('  ✗ WhatsApp button too small');
                    failed++;
                }
            } else {
                console.log('  ✗ WhatsApp button not visible');
                failed++;
            }
        } else {
            console.log('  ✗ WhatsApp button not found');
            failed++;
        }
    } catch (e) {
        console.log('  ✗ Error:', e.message);
        failed++;
    }

    // Test 2: Hero Section Loads
    console.log('\nTEST 2: Hero Section...');
    try {
        const hero = await page.$('.hero');
        const heroTitle = await page.$('.hero-title');
        if (hero && heroTitle) {
            console.log('  ✓ Hero section present');
            passed++;

            const heroText = await heroTitle.textContent();
            if (heroText.includes('Ombre')) {
                console.log('  ✓ Hero title contains "Ombre"');
                passed++;
            }
        } else {
            console.log('  ✗ Hero section missing');
            failed++;
        }
    } catch (e) {
        console.log('  ✗ Error:', e.message);
        failed++;
    }

    // Test 3: Navigation Works
    console.log('\nTEST 3: Navigation...');
    try {
        const nav = await page.$('nav.nav');
        if (nav) {
            console.log('  ✓ Navigation present');
            passed++;

            // Scroll to trigger sticky nav
            await page.evaluate(() => window.scrollTo(0, 500));
            await page.waitForTimeout(500);

            const hasScrolled = await page.$eval('nav.nav', el => el.classList.contains('scrolled'));
            if (hasScrolled) {
                console.log('  ✓ Sticky navigation activates on scroll');
                passed++;
            } else {
                console.log('  ✗ Sticky navigation not activating');
                failed++;
            }
        } else {
            console.log('  ✗ Navigation missing');
            failed++;
        }
    } catch (e) {
        console.log('  ✗ Error:', e.message);
        failed++;
    }

    // Test 4: Gallery Filter Buttons
    console.log('\nTEST 4: Gallery Filters...');
    try {
        await page.evaluate(() => window.scrollTo(0, 2000));
        await page.waitForTimeout(500);

        const filterBtns = await page.$$('.filter-btn');
        if (filterBtns.length >= 3) {
            console.log(`  ✓ ${filterBtns.length} filter buttons found`);
            passed++;

            // Check touch target size
            const firstBtn = filterBtns[0];
            const box = await firstBtn.boundingBox();
            if (box && box.height >= 40) {
                console.log('  ✓ Filter button height >= 40px');
                passed++;
            } else {
                console.log(`  ✗ Filter button too small: ${box?.height}px`);
                failed++;
            }
        } else {
            console.log('  ✗ Not enough filter buttons');
            failed++;
        }
    } catch (e) {
        console.log('  ✗ Error:', e.message);
        failed++;
    }

    // Test 5: Contact Form
    console.log('\nTEST 5: Contact Form...');
    try {
        await page.evaluate(() => document.getElementById('contact').scrollIntoView());
        await page.waitForTimeout(500);

        const form = await page.$('#contactForm');
        if (form) {
            console.log('  ✓ Contact form present');
            passed++;

            const inputs = await page.$$('#contactForm input, #contactForm select, #contactForm textarea');
            if (inputs.length >= 4) {
                console.log(`  ✓ ${inputs.length} form fields found`);
                passed++;
            }
        } else {
            console.log('  ✗ Contact form missing');
            failed++;
        }
    } catch (e) {
        console.log('  ✗ Error:', e.message);
        failed++;
    }

    // Test 6: Mobile Viewport
    console.log('\nTEST 6: Mobile Viewport (375px)...');
    try {
        await page.setViewportSize({ width: 375, height: 812 });
        await page.goto(BASE_URL, { waitUntil: 'networkidle' });
        await page.waitForTimeout(1000);

        // Check WhatsApp button on mobile
        const mobileWhatsApp = await page.$('.whatsapp-float');
        if (mobileWhatsApp) {
            const mobileBox = await mobileWhatsApp.boundingBox();
            if (mobileBox && mobileBox.width >= 50) {
                console.log('  ✓ WhatsApp button visible on mobile');
                passed++;
            }
        }

        // Check nav toggle appears
        const navToggle = await page.$('.nav-toggle');
        if (navToggle) {
            const isDisplayed = await navToggle.evaluate(el => {
                const style = window.getComputedStyle(el);
                return style.display !== 'none';
            });
            if (isDisplayed) {
                console.log('  ✓ Mobile nav toggle visible');
                passed++;
            }
        }

        // Check no horizontal scroll
        const hasHScroll = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        if (!hasHScroll) {
            console.log('  ✓ No horizontal scroll on mobile');
            passed++;
        } else {
            console.log('  ✗ Horizontal scroll detected on mobile');
            failed++;
        }
    } catch (e) {
        console.log('  ✗ Error:', e.message);
        failed++;
    }

    // Take screenshot
    console.log('\nTaking screenshots...');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'tests/screenshot-desktop.png', fullPage: false });
    console.log('  ✓ Desktop screenshot saved');

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'tests/screenshot-mobile.png', fullPage: false });
    console.log('  ✓ Mobile screenshot saved');

    // Summary
    console.log('\n========================================');
    console.log('  RESULTS');
    console.log('========================================');
    console.log(`  Passed: ${passed}`);
    console.log(`  Failed: ${failed}`);
    console.log(`  Score: ${Math.round((passed / (passed + failed)) * 100)}%`);
    console.log('========================================\n');

    await browser.close();

    process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(console.error);
