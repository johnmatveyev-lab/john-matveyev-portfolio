const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  await page.goto('https://ai-skill-drop.vercel.app', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'public/projects/aiskilldrop.png' });
  await browser.close();
})();
