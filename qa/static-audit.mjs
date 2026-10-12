import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {JSDOM} from 'jsdom';import {execFileSync} from 'node:child_process';
const config=JSON.parse(fs.readFileSync('site.config.json'));const result={pages:[],contrast:[],domainMigration:false};
const existsCase=relative=>{let current=process.cwd();for(const part of relative.replaceAll('\\','/').split('/')){if(!fs.readdirSync(current).includes(part))return false;current=path.join(current,part);}return fs.existsSync(current);};
for(const file of ['index.html','ar/index.html','404.html']){
 const html=fs.readFileSync(file,'utf8'),dom=new JSDOM(html,{url:config.SITE_URL+(file.startsWith('ar/')?'ar/':'')});const d=dom.window.document;
 assert.equal(d.querySelectorAll('h1').length,1);
 assert.ok(!/ADD (SCREENSHOT|LIVE|GITHUB)|Interactive profile|local demonstration|lorem|TODO|href="#"|(?:src|href)=""|#(?:d5ff6b|d6ad95|426114|8c4a30)/i.test(html));
 for(const el of d.querySelectorAll('[src],[href]')){const raw=el.getAttribute('src')||el.getAttribute('href');if(raw.startsWith('#'))assert.ok(d.getElementById(raw.slice(1)));else if(!/^[a-z]+:/i.test(raw)){const relative=raw.startsWith('/')?raw.slice(1):path.join(path.dirname(file),raw);if(!raw.endsWith('/'))assert.ok(existsCase(relative),relative);}}
 if(file!=='404.html'){
  const canonical=d.querySelector('link[rel=canonical]').href;assert.equal(canonical,config.SITE_URL+(file.startsWith('ar/')?'ar/':''));
  const graph=JSON.parse(d.querySelector('script[type="application/ld+json"]').textContent)['@graph'];assert.deepEqual(graph.map(x=>x['@type']),['Person','WebSite','ProfilePage','ScholarlyArticle']);assert.equal(graph[0].knowsAbout.length,32);assert.equal(graph[0].address.addressCountry,'SY');
  assert.equal(d.querySelectorAll('#skills').length,1);assert.equal(d.querySelectorAll('.stack-row').length,4);assert.equal(d.querySelectorAll('.project-shot,.placeholder-link,.core-skills,.skill-row,.bento-marquee').length,0);
  const numbers=[...d.querySelectorAll('[data-t$="Label"]')].filter(e=>/^(about|skills|experience|projects|publication|education|contact)Label$/.test(e.dataset.t)).map(e=>e.textContent.match(/\d{2}/)[0]);assert.deepEqual(numbers,['01','02','03','04','05','06','07']);
  for(const link of d.querySelectorAll('script[src^="https:"]'))assert.ok(link.getAttribute('integrity')&&link.crossOrigin==='anonymous'&&link.defer);
  result.pages.push({file,lang:d.documentElement.lang,staticText:d.body.textContent.length,title:d.title,titleLength:d.title.length,description:d.querySelector('meta[name=description]').content,descriptionLength:d.querySelector('meta[name=description]').content.length,canonical,sections:numbers,schemas:graph.map(x=>x['@type'])});
 }
 dom.window.close();
}
function luminance(hex){const rgb=hex.match(/\w\w/g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;}
function ratio(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
for(const [theme,accent,ink,muted,surfaces,button]of [['dark','f8d090','f2eee6','b6b1a7',['141413','1c1c1a','252421'],'241b10'],['light','78501e','28241e','625a4d',['f5f2ec','ebe7df','e2dcd1'],'fff8e9']]){
 for(const [label,fg]of [['accent',accent],['text',ink],['secondary text',muted]])for(const bg of surfaces){const value=ratio(fg,bg);assert.ok(value>=4.5,theme+label+value);result.contrast.push({theme,label,fg:'#'+fg,bg:'#'+bg,ratio:+value.toFixed(2)});}
 const value=ratio(button,accent);assert.ok(value>=4.5);result.contrast.push({theme,label:'button',ratio:+value.toFixed(2)});
}
const files=['site.config.json','index.html','ar/index.html','robots.txt','sitemap.xml','site.webmanifest','404.html'],saved=Object.fromEntries(files.map(f=>[f,fs.readFileSync(f)]));
try{execFileSync(process.execPath,['tools/set-domain.mjs','https://migration-check.invalid/'],{stdio:'pipe'});for(const f of ['index.html','ar/index.html','robots.txt','sitemap.xml']){const text=fs.readFileSync(f,'utf8');assert.ok(text.includes('https://migration-check.invalid/'));assert.ok(!text.includes(config.SITE_URL));}assert.ok(!fs.existsSync('CNAME'));result.domainMigration=true;}finally{for(const [file,bytes]of Object.entries(saved))fs.writeFileSync(file,bytes);}
const sitemap=fs.readFileSync('sitemap.xml','utf8');assert.equal((sitemap.match(/<url>/g)||[]).length,2);assert.equal((sitemap.match(/xhtml:link/g)||[]).length,6);assert.ok(fs.readFileSync('robots.txt','utf8').includes(config.SITE_URL+'sitemap.xml'));
fs.writeFileSync('qa/static-report.json',JSON.stringify(result,null,2));process.stdout.write(JSON.stringify({pages:result.pages,domainMigration:result.domainMigration,minimumContrast:Math.min(...result.contrast.map(x=>x.ratio))},null,2));
