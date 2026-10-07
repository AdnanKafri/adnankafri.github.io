/* Optional maintenance utility: refresh the English no-JS fallback after copy edits.
   The deployed site requires no build step and renders content.js at runtime. */
const fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require(path.join(process.env.TEMP,'adnan-portfolio-qa/node_modules/jsdom'));
const dom=new JSDOM(fs.readFileSync('index.html','utf8'),{url:'http://localhost:8080',runScripts:'outside-only',pretendToBeVisual:true});
const w=dom.window,d=w.document;
w.matchMedia=query=>({matches:query.includes('reduced-motion'),addEventListener(){},removeEventListener(){}});
w.eval(fs.readFileSync('js/content.js','utf8'));w.eval(fs.readFileSync('js/main.js','utf8'));
d.documentElement.classList.remove('motion-paused','lenis','lenis-smooth','dialog-open');
d.body.classList.remove('has-cursor');d.querySelector('#contact-form').removeAttribute('novalidate');
const motion=d.querySelector('#motion-toggle');motion.disabled=false;motion.textContent=w.PORTFOLIO.system.en.motionPause;motion.setAttribute('aria-pressed','false');
d.querySelectorAll('.diagram-packet').forEach(el=>el.removeAttribute('style'));
if(!d.querySelector('link[rel="icon"][sizes="512x512"]')){const icon=d.createElement('link');icon.rel='icon';icon.type='image/png';icon.sizes='512x512';icon.href='assets/logo-512.png';d.head.append(icon);}
const noscript=d.querySelector('noscript');if(!noscript.querySelector('style')){const style=d.createElement('style');style.textContent='#contact-form{display:none}';noscript.append(style);}
fs.writeFileSync('index.html',dom.serialize());dom.window.close();console.log('English HTML fallback refreshed.');
