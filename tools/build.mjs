import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {JSDOM,VirtualConsole} from 'jsdom';
process.chdir(path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'));
const {SITE_URL}=JSON.parse(fs.readFileSync('site.config.json','utf8'));
const base=new URL(SITE_URL);if(base.protocol!=='https:'||base.pathname!=='/'||base.search||base.hash)throw new Error('SITE_URL must be an HTTPS origin with a trailing slash.');
const template=fs.readFileSync('tools/template.html','utf8'),content=fs.readFileSync('js/content.js','utf8'),main=fs.readFileSync('js/main.js','utf8');
const url=part=>new URL(part,SITE_URL).href;
for(const language of ['en','ar']){
 const prefix=language==='ar'?'../':'';
 const errors=[],virtualConsole=new VirtualConsole();virtualConsole.on('jsdomError',error=>errors.push(error));
 const dom=new JSDOM(template,{url:url(language==='ar'?'ar/':''),runScripts:'outside-only',pretendToBeVisual:true,virtualConsole});
 const w=dom.window,d=w.document;d.documentElement.lang=language;d.documentElement.dir=language==='ar'?'rtl':'ltr';
 w.matchMedia=query=>({matches:query.includes('reduced-motion'),addEventListener(){},removeEventListener(){}});
 w.eval(content);w.eval(main);const data=w.PORTFOLIO,c=data[language],s=data.system;
 d.documentElement.className='';d.body.classList.remove('has-cursor');d.querySelector('#contact-form').removeAttribute('novalidate');
 const motion=d.querySelector('#motion-toggle');motion.disabled=false;motion.textContent=s[language].motionPause;motion.setAttribute('aria-pressed','false');
 d.querySelectorAll('.diagram-packet').forEach(el=>el.removeAttribute('style'));
 d.querySelector('#language').href=language==='en'?'ar/index.html':'../index.html';
 for(const el of d.querySelectorAll('[src],[href]'))for(const attr of ['src','href']){const value=el.getAttribute(attr);if(value&&/^(assets|css|js)\//.test(value))el.setAttribute(attr,prefix+value);}
 for(const el of d.querySelectorAll('[srcset]'))el.setAttribute('srcset',el.getAttribute('srcset').replace(/(?<![\w/])assets\//g,prefix+'assets/'));
 function meta(key,value,property=false){let el=d.querySelector(`meta[${property?'property':'name'}="${key}"]`);if(!el){el=d.createElement('meta');el.setAttribute(property?'property':'name',key);d.head.append(el);}el.content=value;}
 function link(rel,href,attrs={}){const el=d.createElement('link');el.rel=rel;el.href=href;for(const [k,v]of Object.entries(attrs))el.setAttribute(k,v);d.head.append(el);}
 const pageUrl=url(language==='ar'?'ar/':'');link('canonical',pageUrl);
 for(const [lang,part]of [['en',''],['ar','ar/'],['x-default','']])link('alternate',url(part),{hreflang:lang});
 link('manifest',prefix+'site.webmanifest');
 const criticalFonts=language==='ar'?['cairo-arabic']:['syne-latin','inter-latin'];
 const fontPreload=d.createElement('script');fontPreload.textContent=`if(location.protocol!=='file:'){for(const href of ${JSON.stringify(criticalFonts.map(name=>prefix+'assets/fonts/'+name+'.woff2'))}){const font=document.createElement('link');font.rel='preload';font.href=href;font.as='font';font.type='font/woff2';font.crossOrigin='anonymous';document.head.append(font)}}`;d.head.append(fontPreload);
 meta('theme-color','#141413');meta('og:url',pageUrl,true);meta('og:site_name',c.name,true);meta('og:locale:alternate',language==='en'?'ar_SY':'en_US',true);meta('og:image',url('assets/og-image.png'),true);meta('og:image:alt',c.name+' — '+c.title,true);
 meta('twitter:title',c.metaTitle);meta('twitter:description',c.metaDescription);meta('twitter:image',url('assets/og-image.png'));meta('twitter:image:alt',c.name+' — '+c.title);
 const personId=url('#person');const person={'@type':'Person','@id':personId,name:c.name,alternateName:data[language==='en'?'ar':'en'].name,jobTitle:c.title,description:c.profile,url:pageUrl,image:url('assets/adnan.webp'),email:s.email,telephone:s.phone,address:{'@type':'PostalAddress',addressLocality:language==='en'?'Hama':'حماة',addressCountry:'SY'},knowsAbout:c.skills.flatMap(group=>group[1]),sameAs:[s.github,s.linkedin],alumniOf:{'@type':'CollegeOrUniversity',name:c.university}};
 const graph=[person,{'@type':'WebSite','@id':url('#website'),name:c.name,url:SITE_URL,inLanguage:['en','ar']},{'@type':'ProfilePage','@id':pageUrl+'#profile',url:pageUrl,name:c.metaTitle,description:c.metaDescription,inLanguage:language,mainEntity:{'@id':personId},isPartOf:{'@id':url('#website')}},{'@type':'ScholarlyArticle','@id':'https://doi.org/'+s.publication.doi,headline:data.en.paperTitle,identifier:s.publication.doi,url:'https://doi.org/'+s.publication.doi,datePublished:s.publication.date,inLanguage:'en',author:[{'@type':'Person',name:s.publication.coauthor},{'@id':personId}],isPartOf:{'@type':'PublicationIssue',issueNumber:s.publication.issue,isPartOf:{'@type':'PublicationVolume',volumeNumber:s.publication.volume,isPartOf:{'@type':'Periodical',name:s.publication.journal}}}}];
 const json=d.createElement('script');json.type='application/ld+json';json.textContent=JSON.stringify({'@context':'https://schema.org','@graph':graph}).replace(/</g,'\\u003c');d.head.append(json);
 const output=language==='en'?'index.html':'ar/index.html';fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,dom.serialize().replace(/ (defer|open|required|hidden|readonly)=""/g,' $1'));await new Promise(resolve=>setTimeout(resolve,30));dom.window.close();if(errors.length)throw errors[0];
}
const date=new Date().toISOString().slice(0,10),escape=value=>value.replaceAll('&','&amp;').replaceAll('"','&quot;');
const alternates=[['en',url('')],['ar',url('ar/')],['x-default',url('')]].map(([lang,href])=>`<xhtml:link rel="alternate" hreflang="${lang}" href="${escape(href)}"/>`).join('');
fs.writeFileSync('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${['','ar/'].map(part=>`<url><loc>${escape(url(part))}</loc><lastmod>${date}</lastmod>${alternates}</url>`).join('')}</urlset>\n`);
fs.writeFileSync('robots.txt',`User-agent: *\nAllow: /\nSitemap: ${url('sitemap.xml')}\n`);
fs.writeFileSync('site.webmanifest',JSON.stringify({name:'Adnan Kafri | عدنان كفري',short_name:'Adnan Kafri',start_url:'./',scope:'./',display:'browser',background_color:'#141413',theme_color:'#141413',icons:[192,512].map(size=>({src:`assets/logo-${size}.png`,sizes:`${size}x${size}`,type:'image/png',purpose:'any'}))},null,2)+'\n');
fs.copyFileSync('tools/error.html','404.html');
process.stdout.write('Generated English, Arabic, sitemap, robots, manifest and 404.\n');
