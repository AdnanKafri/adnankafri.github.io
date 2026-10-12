import path from 'node:path';import fs from 'node:fs';import {pathToFileURL} from 'node:url';
const deps=path.join(process.env.TEMP,'adnan-portfolio-qa/node_modules');
const {default:lighthouse}=await import(pathToFileURL(path.join(deps,'lighthouse/core/index.js')));
const {default:desktopConfig}=await import(pathToFileURL(path.join(deps,'lighthouse/core/config/desktop-config.js')));
const chromeLauncher=await import(pathToFileURL(path.join(deps,'chrome-launcher/dist/index.js')));
fs.mkdirSync('qa/prelaunch-lighthouse',{recursive:true});const summary=[];
for(const lang of ['en','ar'])for(const desktop of [false,true]){
 const chrome=await chromeLauncher.launch({chromePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',chromeFlags:['--headless','--no-sandbox']});
 try{const flags={port:chrome.port,output:['json','html'],logLevel:'error',onlyCategories:['performance','accessibility','best-practices','seo']};
 const run=await lighthouse((process.env.AUDIT_BASE||'http://127.0.0.1:8082')+'/'+(lang==='ar'?'ar/':''),flags,desktop?desktopConfig:undefined);if(run.lhr.configSettings.formFactor!==(desktop?'desktop':'mobile'))throw new Error('Incorrect Lighthouse form factor');const tag=lang+'-'+(desktop?'desktop':'mobile');fs.writeFileSync(`qa/prelaunch-lighthouse/${tag}.json`,run.report[0]);fs.writeFileSync(`qa/prelaunch-lighthouse/${tag}.html`,run.report[1]);const scores=Object.fromEntries(Object.entries(run.lhr.categories).map(([k,v])=>[k,Math.round(v.score*100)]));const issues=Object.values(run.lhr.audits).filter(a=>a.score!==null&&a.score<.9&&a.details).map(a=>({id:a.id,title:a.title,score:a.score,display:a.displayValue}));summary.push({tag,scores,formFactor:run.lhr.configSettings.formFactor,screen:run.lhr.configSettings.screenEmulation,issues});process.stdout.write(JSON.stringify({tag,scores,issues})+'\n');}finally{await chrome.kill();}
}
fs.writeFileSync('qa/prelaunch-lighthouse-summary.json',JSON.stringify(summary,null,2));
