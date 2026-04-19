const { chromium } = require('playwright');

const viewports = [
    { name: 'Desktop', width: 1920, height: 1080 },
    { name: 'Laptop', width: 1366, height: 768 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Mobile', width: 375, height: 812 },
];

(async () => {
    const browser = await chromium.launch({ headless: false });

    for (const vp of viewports) {
        console.log('\n📱 Testing ' + vp.name + ' (' + vp.width + 'x' + vp.height + ')...');
        const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
        const page = await context.newPage();

        await page.goto('file:///C:/Users/Tarik Gilani/Desktop/maison-dombre/index.html');
        await page.waitForTimeout(3500); // Wait for preloader

        // Take full page screenshot
        const filename = 'tests/responsive-' + vp.name.toLowerCase() + '.png';
        await page.screenshot({ path: filename, fullPage: true });

        console.log('  ✅ ' + vp.name + ' screenshot saved');
        await context.close();
    }

    await browser.close();
    console.log('\n✅ All responsive tests complete!');
})();
