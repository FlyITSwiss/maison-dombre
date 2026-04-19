const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        viewport: { width: 375, height: 812 },
        isMobile: true,
        hasTouch: true,
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
        recordVideo: { dir: 'tests/videos/' }
    });
    const page = await context.newPage();

    console.log('📱 Testing MOBILE scroll performance...\n');

    await page.goto('file:///C:/Users/Tarik Gilani/Desktop/maison-dombre/index.html');

    // Wait for preloader
    console.log('⏳ Waiting for preloader...');
    await page.waitForTimeout(3500);

    // Check that heavy effects are disabled on mobile
    console.log('\n🔍 Checking mobile optimizations...');

    const optimizations = await page.evaluate(() => {
        const results = {};

        // Check grain overlay
        const grain = document.querySelector('.grain-overlay');
        results.grainDisabled = !grain || getComputedStyle(grain).display === 'none';

        // Check morphing blobs
        const blobs = document.querySelector('.morphing-blobs');
        results.blobsDisabled = !blobs || getComputedStyle(blobs).display === 'none';

        // Check floating elements
        const floating = document.querySelector('.floating-elements');
        results.floatingDisabled = !floating || getComputedStyle(floating).display === 'none';

        // Check backdrop-filter is removed
        const btn = document.querySelector('.hero-cta .btn-primary');
        if (btn) {
            const style = getComputedStyle(btn);
            results.backdropFilterDisabled = style.backdropFilter === 'none' || !style.backdropFilter;
        }

        return results;
    });

    console.log('  Grain overlay disabled: ' + (optimizations.grainDisabled ? '✅' : '❌'));
    console.log('  Morphing blobs disabled: ' + (optimizations.blobsDisabled ? '✅' : '❌'));
    console.log('  Floating elements disabled: ' + (optimizations.floatingDisabled ? '✅' : '❌'));
    console.log('  Backdrop filter disabled: ' + (optimizations.backdropFilterDisabled ? '✅' : '❌'));

    // Simulate touch scroll with performance measurement
    console.log('\n📜 Testing smooth touch scroll...');

    const sections = ['#expertise', '#realisations', '#pourquoi', '#processus', '#temoignages', '#contact', '.map-section', '.footer'];
    let frameDrops = 0;

    for (const section of sections) {
        const sectionName = section.replace('#', '').replace('.', '');
        console.log('  → Scrolling to ' + sectionName + '...');

        // Measure scroll performance
        const metrics = await page.evaluate(async (sel) => {
            const start = performance.now();
            let frames = 0;

            const countFrames = () => {
                frames++;
                if (performance.now() - start < 1500) {
                    requestAnimationFrame(countFrames);
                }
            };
            requestAnimationFrame(countFrames);

            const el = document.querySelector(sel);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            await new Promise(r => setTimeout(r, 1500));

            return {
                frames,
                fps: Math.round(frames / 1.5)
            };
        }, section);

        const fpsStatus = metrics.fps >= 50 ? '✅' : (metrics.fps >= 30 ? '⚠️' : '❌');
        console.log('    ' + fpsStatus + ' FPS: ~' + metrics.fps);

        if (metrics.fps < 50) frameDrops++;

        await page.waitForTimeout(500);
    }

    // Scroll back to top
    console.log('\n  → Scrolling back to top...');
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(1500);

    // Take screenshot
    await page.screenshot({ path: 'tests/mobile-scroll-perf.png', fullPage: false });
    console.log('\n📸 Screenshot saved');

    // Performance summary
    console.log('\n═══════════════════════════════════════');
    console.log('📊 MOBILE PERFORMANCE SUMMARY');
    console.log('═══════════════════════════════════════');
    console.log('  Heavy effects disabled: ' + (optimizations.grainDisabled && optimizations.blobsDisabled ? '✅ YES' : '❌ NO'));
    console.log('  Scroll smoothness: ' + (frameDrops === 0 ? '✅ EXCELLENT' : (frameDrops <= 2 ? '⚠️ GOOD' : '❌ NEEDS WORK')));
    console.log('  Frame drops: ' + frameDrops + '/8 sections');

    // Keep browser open to observe
    console.log('\n👀 Observe for 5 seconds...');
    await page.waitForTimeout(5000);

    await context.close();
    await browser.close();

    console.log('\n✅ Mobile performance test complete!');
})();
