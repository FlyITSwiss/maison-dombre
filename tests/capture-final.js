/**
 * Capture finale - Maison d'Ombre
 * Prend des screenshots desktop et mobile du site avec tous les effets spectaculaires
 */

const { firefox } = require('playwright');

(async () => {
    console.log('='.repeat(60));
    console.log('  CAPTURE FINALE - MAISON D\'OMBRE');
    console.log('='.repeat(60));

    const browser = await firefox.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        // Desktop capture
        console.log('\n[Desktop] Chargement de la page...');
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.goto('http://127.0.0.1:8888', { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000); // Attendre les animations

        // Vérifier le curseur personnalisé
        const hasCursor = await page.evaluate(() => {
            return document.getElementById('cursor') !== null;
        });
        console.log(`[Desktop] Curseur personnalisé: ${hasCursor ? '✅' : '❌'}`);

        // Vérifier les lettres animées
        const hasKinetic = await page.evaluate(() => {
            return document.querySelectorAll('.hero-title .char').length > 0;
        });
        console.log(`[Desktop] Typographie cinétique: ${hasKinetic ? '✅' : '❌'}`);

        // Vérifier l'effet Aurora
        const hasAurora = await page.evaluate(() => {
            const hero = document.querySelector('.hero');
            return hero && hero.classList.contains('aurora-bg');
        });
        console.log(`[Desktop] Effet Aurora: ${hasAurora ? '✅' : '❌'}`);

        // Vérifier les cartes glassmorphism
        const hasGlass = await page.evaluate(() => {
            const cards = document.querySelectorAll('.feature-card.glass-card');
            return cards.length > 0;
        });
        console.log(`[Desktop] Cartes Glassmorphism: ${hasGlass ? '✅' : '❌'}`);

        // Screenshot Desktop Hero
        await page.screenshot({
            path: 'tests/screenshot-desktop-hero.png',
            fullPage: false
        });
        console.log('[Desktop] Screenshot Hero: tests/screenshot-desktop-hero.png');

        // Scroll vers gallery pour screenshot
        await page.evaluate(() => {
            document.querySelector('#realisations').scrollIntoView({ behavior: 'instant' });
        });
        await page.waitForTimeout(1000);

        await page.screenshot({
            path: 'tests/screenshot-desktop-gallery.png',
            fullPage: false
        });
        console.log('[Desktop] Screenshot Gallery: tests/screenshot-desktop-gallery.png');

        // Full page screenshot
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(500);
        await page.screenshot({
            path: 'tests/screenshot-desktop-full.png',
            fullPage: true
        });
        console.log('[Desktop] Screenshot Full: tests/screenshot-desktop-full.png');

        // Mobile capture
        console.log('\n[Mobile] Configuration viewport mobile...');
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto('http://127.0.0.1:8888', { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);

        // Vérifier WhatsApp button
        const hasWhatsApp = await page.evaluate(() => {
            const btn = document.querySelector('.whatsapp-float');
            return btn && getComputedStyle(btn).display !== 'none';
        });
        console.log(`[Mobile] Bouton WhatsApp: ${hasWhatsApp ? '✅' : '❌'}`);

        // Vérifier pas de scroll horizontal
        const noHScroll = await page.evaluate(() => {
            return document.documentElement.scrollWidth <= document.documentElement.clientWidth + 5;
        });
        console.log(`[Mobile] Pas de scroll horizontal: ${noHScroll ? '✅' : '❌'}`);

        await page.screenshot({
            path: 'tests/screenshot-mobile-hero.png',
            fullPage: false
        });
        console.log('[Mobile] Screenshot Hero: tests/screenshot-mobile-hero.png');

        await page.screenshot({
            path: 'tests/screenshot-mobile-full.png',
            fullPage: true
        });
        console.log('[Mobile] Screenshot Full: tests/screenshot-mobile-full.png');

        console.log('\n' + '='.repeat(60));
        console.log('  RÉSUMÉ DES EFFETS SPECTACULAIRES');
        console.log('='.repeat(60));
        console.log(`
  1. Curseur Personnalisé Magnétique    ${hasCursor ? '✅' : '❌'}
  2. Typographie Cinétique (Kinetic)    ${hasKinetic ? '✅' : '❌'}
  3. Effet Aurora Gradient Mesh         ${hasAurora ? '✅' : '❌'}
  4. Cartes Glassmorphism               ${hasGlass ? '✅' : '❌'}
  5. Bouton WhatsApp Flottant           ${hasWhatsApp ? '✅' : '❌'}
  6. Pas de Scroll Horizontal           ${noHScroll ? '✅' : '❌'}
        `);

        const allPassed = hasCursor && hasKinetic && hasAurora && hasGlass && hasWhatsApp && noHScroll;
        console.log(`  SCORE: ${allPassed ? '6/6 - TOUS LES EFFETS OK! 🎉' : 'Certains effets manquants'}`);
        console.log('='.repeat(60));

        // Garder le navigateur ouvert 5 secondes pour visualisation
        console.log('\n  Le navigateur reste ouvert 5 secondes pour visualisation...');
        await page.waitForTimeout(5000);

    } catch (error) {
        console.error('Erreur:', error.message);
    } finally {
        await browser.close();
    }
})();
