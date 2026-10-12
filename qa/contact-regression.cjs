const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {JSDOM}=require(path.join(process.env.TEMP,'adnan-portfolio-qa/node_modules/jsdom'));
for(const language of ['en','ar']){
 const dom=new JSDOM(fs.readFileSync(language==='ar'?'ar/index.html':'index.html','utf8'),{url:'http://localhost:8080',runScripts:'outside-only',pretendToBeVisual:true});const w=dom.window,d=w.document;
 w.matchMedia=q=>({matches:q.includes('reduced-motion'),addEventListener(){}});w.localStorage.setItem('ak-language',language);
 w.eval(fs.readFileSync('js/content.js','utf8'));w.eval(fs.readFileSync('js/main.js','utf8').replace('window.location.href=','window.__mailto='));
 const form=d.querySelector('#contact-form');form.elements.name.value='   ';form.elements.email.value='not-an-email';form.elements.message.value='   ';
 form.dispatchEvent(new w.Event('submit',{cancelable:true}));assert.equal(d.querySelectorAll('.field-error:not([hidden])').length,3);assert.equal(w.__mailto,undefined);
 form.elements.name.value=language==='ar'?'عدنان':'QA Visitor';form.elements.email.value='qa@example.com';form.elements.message.value='Laravel & AI\nتفاصيل المشروع';
 form.dispatchEvent(new w.Event('submit',{cancelable:true}));assert.ok(w.__mailto.startsWith('mailto:adnanzz444@gmail.com?'));
 const draft=new URL(w.__mailto);assert.ok(draft.searchParams.get('body').includes('Laravel & AI\nتفاصيل المشروع'));assert.ok(draft.searchParams.get('body').includes('qa@example.com'));assert.ok(draft.searchParams.get('subject').includes(form.elements.name.value));
 assert.equal(d.querySelectorAll('.field-error:not([hidden])').length,0);setTimeout(()=>dom.window.close(),50);
}
console.log('PASS: shared inline validation and unchanged mailto draft behavior in EN/AR, including whitespace and Unicode.');
