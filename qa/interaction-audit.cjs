const path=require('node:path'),fs=require('node:fs'),assert=require('node:assert/strict');
const {chromium}=require(path.join(process.env.TEMP,'adnan-portfolio-qa/node_modules/playwright'));
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const context=await browser.newContext({viewport:{width:1440,height:1000},permissions:['clipboard-read','clipboard-write']});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://localhost:8080',{waitUntil:'networkidle'});
 await page.waitForFunction(()=>!document.querySelector('#run-api').disabled);
 assert.ok(await page.evaluate(()=>window.gsap&&window.ScrollTrigger&&window.Lenis&&document.documentElement.classList.contains('lenis')));
 const consoleData=await page.locator('#api-response').innerText();assert.ok(JSON.parse(consoleData).role.includes('Laravel'));
 await page.keyboard.press('Control+k');await page.locator('#command-search').fill('Education');await page.keyboard.press('Enter');
 await page.waitForFunction(()=>location.hash==='#education');assert.equal(await page.evaluate(()=>document.activeElement.id),'education');
 await page.keyboard.press('Control+k');await page.keyboard.press('Tab');assert.ok(await page.evaluate(()=>!!document.activeElement.closest('dialog')));await page.keyboard.press('Shift+Tab');assert.ok(await page.evaluate(()=>!!document.activeElement.closest('dialog')));await page.keyboard.press('Escape');
 await page.locator('#copy-email').click();assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),'adnanzz444@gmail.com');
 await page.locator('[name=name]').fill('QA Visitor');await page.locator('[name=email]').fill('qa@example.com');await page.locator('[name=message]').fill('A project with Laravel');
 await page.locator('#language').click();await page.waitForFunction(()=>document.documentElement.lang==='ar');
 assert.equal(await page.locator('[name=message]').inputValue(),'A project with Laravel');await page.waitForFunction(()=>!document.querySelector('#run-api').disabled);assert.equal(JSON.parse(await page.locator('#api-response').innerText()).location,'حماة، سوريا');
 await page.locator('#theme').click();assert.equal(await page.evaluate(()=>localStorage.getItem('ak-theme')),'light');
 await page.locator('#motion-toggle').click();assert.ok(await page.evaluate(()=>!document.documentElement.classList.contains('lenis')&&document.documentElement.classList.contains('motion-paused')));
 await page.locator('#motion-toggle').click();assert.ok(await page.evaluate(()=>document.documentElement.classList.contains('lenis')));
 await page.locator('#motion-toggle').click();
 for(const panel of await page.locator('.project-panel').all()){if(!await panel.evaluate(el=>el.open))await panel.locator('summary').click();assert.ok(await panel.locator('.architecture').isVisible());}
 await page.screenshot({path:'qa/screenshots/ar-light-all-projects.png',fullPage:true});
 const responsive=[];
 for(const width of [320,360,768,1024]){
  await page.setViewportSize({width,height:900});await page.waitForTimeout(150);
  const overflow=await page.evaluate(()=>({viewport:innerWidth,width:document.documentElement.scrollWidth}));assert.ok(overflow.width<=overflow.viewport+1,JSON.stringify(overflow));responsive.push(overflow);
 }
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});
 assert.equal(await page.locator('#motion-toggle').isDisabled(),true);
 await page.reload({waitUntil:'networkidle'});assert.equal(await page.evaluate(()=>document.documentElement.lang),'ar');assert.equal(await page.evaluate(()=>document.documentElement.dataset.theme),'light');
 await page.locator('#menu').click();await page.keyboard.press('Escape');assert.equal(await page.locator('#menu').getAttribute('aria-expanded'),'false');
 await page.locator('#education').screenshot({path:'qa/screenshots/ar-light-390-final-education.png',style:'.header,.skip-link,.scroll-progress{visibility:hidden!important}'});
 const brand=await page.locator('.brand-logo img').first().evaluate(el=>({src:el.getAttribute('src'),width:el.naturalWidth,height:el.naturalHeight}));assert.equal(brand.src,'assets/logo-192.png');assert.ok(brand.width>0);
 const version=browser.version();fs.writeFileSync('qa/interaction-report.json',JSON.stringify({version,errors,responsive,brand,passed:['Full-motion initialization','Console JSON','Palette navigation and focus','Native dialog keyboard containment','Clipboard copy','Language transition preserves input','Theme and language persistence','Pause/resume','Project expansion','320/360/768/1024 overflow','Reduced motion','Mobile menu Escape']},null,2));
 console.log('PASS: live-browser interaction checks; browser '+version);assert.deepEqual(errors,[]);await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
