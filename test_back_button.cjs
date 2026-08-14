const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  // Capture console logs from the browser
  page.on('console', msg => {
    if (msg.text().includes('[SCROLL-DEBUG]')) {
      console.log('  [BROWSER]', msg.text());
    }
  });

  console.log('\n=== TEST 2: Debug Back Button Scroll ===\n');

  // Step 1: Load homepage
  console.log('Step 1: Loading homepage ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 15000 });
  await new Promise(r => setTimeout(r, 5000));
  console.log('  ✓ Done');

  // Step 2: Scroll to projects and click Details
  console.log('Step 2: Scroll to projects ...');
  await page.evaluate(() => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1500));

  console.log('Step 3: Click Details on 3rd card ...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const detailBtns = buttons.filter(b => b.textContent && b.textContent.includes('Details'));
    const idx = Math.min(2, detailBtns.length - 1);
    detailBtns[idx].click();
  });
  await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 1000));
  console.log(`  On: ${page.url()}`);

  // Step 4: Check sessionStorage BEFORE clicking back
  console.log('\nStep 4: Check sessionStorage before Back ...');
  const storageBefore = await page.evaluate(() => {
    return {
      lastViewedProject: sessionStorage.getItem('lastViewedProject'),
      skipIntroNext: sessionStorage.getItem('skipIntroNext'),
    };
  });
  console.log('  sessionStorage before clicking Back:', JSON.stringify(storageBefore));

  // Step 5: Click Back
  console.log('\nStep 5: Click Back ...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const backBtn = buttons.find(b => b.textContent && b.textContent.includes('Back'));
    if (backBtn) backBtn.click();
  });

  // Check sessionStorage RIGHT AFTER clicking (before navigation)
  const storageAfterClick = await page.evaluate(() => {
    return {
      lastViewedProject: sessionStorage.getItem('lastViewedProject'),
      skipIntroNext: sessionStorage.getItem('skipIntroNext'),
    };
  });
  console.log('  sessionStorage after click (before nav):', JSON.stringify(storageAfterClick));

  // Wait for navigation
  await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 }).catch(() => {});
  console.log(`  Navigated to: ${page.url()}`);

  // Check sessionStorage after navigation
  const storageAfterNav = await page.evaluate(() => {
    return {
      lastViewedProject: sessionStorage.getItem('lastViewedProject'),
      skipIntroNext: sessionStorage.getItem('skipIntroNext'),
    };
  });
  console.log('  sessionStorage after nav:', JSON.stringify(storageAfterNav));

  // Wait for scroll effect
  await new Promise(r => setTimeout(r, 4000));

  // Check if project-proj3 exists and its position
  const result = await page.evaluate(() => {
    const el = document.getElementById('project-proj3');
    const projectsSection = document.getElementById('projects');
    const allProjectCards = document.querySelectorAll('[id^="project-proj"]');
    
    return {
      cardExists: !!el,
      cardId: el ? el.id : null,
      scrollY: Math.round(window.scrollY),
      cardRect: el ? {
        top: Math.round(el.getBoundingClientRect().top),
        bottom: Math.round(el.getBoundingClientRect().bottom),
      } : null,
      projectsSectionExists: !!projectsSection,
      totalProjectCards: allProjectCards.length,
      allCardIds: Array.from(allProjectCards).map(c => c.id),
      viewportHeight: window.innerHeight,
    };
  });

  console.log('\nStep 6: Final state:');
  console.log('  ', JSON.stringify(result, null, 2));

  console.log('\n=== VERDICT ===');
  if (result.scrollY === 0) {
    console.log('FAIL: Page is at top (scrollY=0). Scroll did not happen.');
    if (!storageAfterNav.lastViewedProject && storageAfterClick.lastViewedProject) {
      console.log('  NOTE: sessionStorage was set after click but cleared after nav.');
      console.log('  This means the useEffect ran and consumed it, but scroll failed.');
    } else if (!storageAfterClick.lastViewedProject) {
      console.log('  NOTE: sessionStorage was NOT set by BackButton click handler.');
    }
  } else {
    const inView = result.cardRect && result.cardRect.top < result.viewportHeight && result.cardRect.bottom > 0;
    console.log(inView ? 'PASS: Card is in viewport!' : 'FAIL: Scrolled but card not in viewport.');
  }

  await browser.close();
})();
