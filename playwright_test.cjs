const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('request', request => {
    const url = request.url();
    if (url.includes('pagina_busqueda')) {
       console.log('Method:', request.method());
       console.log('URL:', url);
       console.log('PostData:', request.postData());
    }
  });

  await page.goto('https://www.lacoopeencasa.coop/');
  await page.waitForTimeout(3000);
  
  await page.goto('https://www.lacoopeencasa.coop/buscar/leche');
  await page.waitForTimeout(3000);

  await browser.close();
  console.log("Done");
})();
