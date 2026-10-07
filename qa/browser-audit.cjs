const {chromium}=require(require('node:path').join(process.env.TEMP,'adnan-portfolio-qa/node_modules/playwright'));
const fs=require('node:fs');const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const report=[];
 for(const language of ['en','ar'])for(const theme of ['dark','light'])for(const mobile of [false,true]){
  const tag=`${language}-${theme}-${mobile?'mobile':'desktop'}`;
  const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:1000},deviceScaleFactor:1,isMobile:mobile,hasTouch:mobile,reducedMotion:'reduce'});
  await context.addInitScript(({language,theme})=>{localStorage.setItem('ak-language',language);localStorage.setItem('ak-theme',theme);},{language,theme});
  await context.route('https://wa.me/**',route=>route.fulfill({status:200,contentType:'text/html',body:'<title>WhatsApp navigation intercepted for QA</title>'}));
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://localhost:8080',{waitUntil:'networkidle',timeout:60000});
  await page.evaluate(()=>document.fonts.ready);
  await page.locator('.core-skill').first().waitFor();
  await page.screenshot({path:`qa/screenshots/${tag}-hero.png`});
  for(const id of ['education','skills','experience','contact'])await page.locator(`#${id}`).screenshot({path:`qa/screenshots/${tag}-${id}.png`,style:'.header,.scroll-progress,.skip-link{visibility:hidden!important}'});
  await page.screenshot({path:`qa/screenshots/${tag}-full.png`,fullPage:true});
  const layout=await page.evaluate(()=>{
   const rows=[...document.querySelectorAll('.achievement')].map(el=>{const v=el.querySelector('strong').getBoundingClientRect(),label=el.querySelector('span').getBoundingClientRect(),style=getComputedStyle(el.querySelector('strong'));return{value:{left:v.left,right:v.right,width:v.width},label:{left:label.left,right:label.right},font:style.fontSize,line:style.lineHeight,text:el.innerText};});
   const vw=innerWidth;const overflow=[...document.querySelectorAll('main *')].filter(el=>{if(el.closest('.marquee-track,svg,.mesh')||!el.getClientRects().length)return false;const r=el.getBoundingClientRect();return r.width>0&&(r.left<-.5||r.right>vw+.5);}).map(el=>({tag:el.tagName,class:el.className,text:el.textContent.slice(0,60)}));
   return{rows,overflow,scrollWidth:document.documentElement.scrollWidth,viewport:vw,fonts:document.fonts.check(document.documentElement.lang==='ar'?'600 20px Cairo':'600 20px Syne'),lang:document.documentElement.lang,dir:document.documentElement.dir};
  });
  assert.equal(layout.lang,language);assert.equal(layout.dir,language==='ar'?'rtl':'ltr');
  assert.ok(layout.rows.every(r=>Math.abs(r.value.left-layout.rows[0].value.left)<.5&&Math.abs(r.label.left-layout.rows[0].label.left)<.5));
  await page.locator('#send-whatsapp').click();assert.equal(await page.locator('.field-error:not([hidden])').count(),3);
  await page.locator('[name=name]').fill(language==='ar'?'مراجع الاختبار':'QA Visitor');
  await page.locator('[name=email]').fill('invalid-email');await page.locator('[name=message]').fill('Laravel & AI\nProject details');
  await page.locator('#send-whatsapp').click();assert.equal(await page.locator('#email-error').isVisible(),true);
  await page.locator('[name=email]').fill('qa@example.com');
  const popupPromise=context.waitForEvent('page');await page.locator('#send-whatsapp').click();const popup=await popupPromise;await popup.waitForLoadState();
  const whatsapp=new URL(popup.url());assert.equal(whatsapp.hostname,'wa.me');assert.equal(whatsapp.pathname,'/963952749458');assert.ok(whatsapp.searchParams.get('text').includes('qa@example.com'));assert.ok(whatsapp.searchParams.get('text').includes('\n'));assert.ok(popup.url().includes('%0A'));if(language==='ar')assert.ok(whatsapp.searchParams.get('text').startsWith('مرحباً عدنان'));
  assert.equal(await page.locator('#send-whatsapp').getAttribute('rel'),'noopener noreferrer');await popup.close();
  await page.locator('#command-open').click();await page.locator('#command-search').fill(language==='ar'?'واتساب':'WhatsApp');assert.equal(await page.locator('[role=option]').count(),1);await page.keyboard.press('Escape');
  await page.addScriptTag({path:require.resolve(require('node:path').join(process.env.TEMP,'adnan-portfolio-qa/node_modules/axe-core'))});
  const axe=await page.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));});
  report.push({tag,errors,layout,axe,whatsapp:whatsapp.href});console.log(tag,JSON.stringify({errors,overflow:layout.overflow,axe:axe.map(v=>({id:v.id,nodes:v.nodes.length})),fonts:layout.fonts}));
  await context.close();
 }
 fs.writeFileSync('qa/browser-report.json',JSON.stringify(report,null,2));await browser.close();
})().catch(error=>{console.error(error);process.exit(1)});
