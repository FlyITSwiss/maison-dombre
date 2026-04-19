const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        recordVideo: { dir: 'tests/videos/' }
    });
    const page = await context.newPage();

    console.log('🎬 Testing scroll animations...\n');

    await page.goto('file:///C:/Users/Tarik Gilani/Desktop/maison-dombre/index.html');

    // Wait for preloader to finish
    console.log('⏳ Waiting for preloader...');
    await page.waitForTimeout(3500);

    // Smooth scroll test
    console.log('📜 Starting smooth scroll test...\n');

    const sections = [
        { name: 'Hero', selector: '#hero' },
        { name: 'Expertise', selector: '#expertise' },
        { name: 'Réalisations', selector: '#realisations' },
        { name: 'Pourquoi nous', selector: '#pourquoi' },
        { name: 'Processus', selector: '#processus' },
        { name: 'Témoignages', selector: '#temoignages' },
        { name: 'Contact', selector: '#contact' },
        { name: 'Map', selector: '.map-section' },
        { name: 'Footer', selector: '.footer' },
    ];

    for (const section of sections) {
        console.log('  → Scrolling to ' + section.name + '...');

        try {
            // Scroll with smooth behavior
            await page.evaluate((sel) => {
                const el = document.querySelector(sel);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, section.selector);

            // Wait for scroll animation
            await page.waitForTimeout(1500);

            // Check if GSAP animations triggered
            const hasAnimated = await page.evaluate((sel) => {
                const el = document.querySelector(sel);
                if (!el) return false;

                // Check for revealed class or opacity
                const revealed = el.querySelectorAll('.revealed, [style*="opacity: 1"]');
                return revealed.length > 0 || el.classList.contains('revealed');
            }, section.selector);

            console.log('    ✅ ' + section.name + ' - animations: ' + (hasAnimated ? 'triggered' : 'static'));

        } catch (e) {
            console.log('    ⚠️  ' + section.name + ' - error: ' + e.message);
        }
    }

    // Scroll back to top
    console.log('\n  → Scrolling back to top...');
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(2000);

    // Check scroll progress bar
    const progressBar = await page.evaluate(() => {
        const bar = document.querySelector('.scroll-progress');
        return bar ? getComputedStyle(bar).width : null;
    });
    console.log('  📊 Scroll progress bar: ' + (progressBar ? 'working' : 'not found'));

    // Test parallax effect
    console.log('\n🎭 Testing parallax sections...');
    await page.evaluate(() => {
        const parallax = document.querySelectorAll('.parallax-section');
        parallax.forEach(p => p.scrollIntoView({ behavior: 'smooth' }));
    });
    await page.waitForTimeout(1500);
    console.log('  ✅ Parallax sections rendered');

    // Final screenshot
    await page.screenshot({ path: 'tests/scroll-test-final.png', fullPage: false });
    console.log('\n📸 Final screenshot saved');

    // Keep browser open for 5 seconds to observe
    console.log('\n👀 Observe the browser for 5 seconds...');
    await page.waitForTimeout(5000);

    await context.close();
    await browser.close();

    console.log('\n✅ Scroll animation test complete!');
})();
