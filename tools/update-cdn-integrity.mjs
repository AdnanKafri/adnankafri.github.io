import fs from 'node:fs';import {createHash} from 'node:crypto';import {JSDOM} from 'jsdom';
const dom=new JSDOM(fs.readFileSync('tools/template.html','utf8'));
for(const script of dom.window.document.querySelectorAll('script[src^="https:"]')){
 const response=await fetch(script.src);if(!response.ok)throw new Error(script.src);
 script.setAttribute('integrity','sha384-'+createHash('sha384').update(Buffer.from(await response.arrayBuffer())).digest('base64'));script.crossOrigin='anonymous';
}
for(const size of [16,32,512])dom.window.document.querySelector(`link[href="assets/logo-${size}.png"]`).setAttribute('sizes',`${size}x${size}`);
fs.writeFileSync('tools/template.html',dom.serialize());dom.window.close();
