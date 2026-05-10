const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto('https://www.pkmnchamps.com/stats?regulation=reg_m1&format=singles&month=2026-05', { waitUntil: 'networkidle2' });
    
    const text = await page.evaluate(() => document.body.innerText);
    const html = await page.evaluate(() => document.body.innerHTML);
    
    require('fs').writeFileSync('puppeteer_output.txt', text);
    require('fs').writeFileSync('puppeteer_html.txt', html);
    
    await browser.close();
    console.log("Puppeteer finished.");
  } catch (e) {
    console.error(e);
  }
})();
