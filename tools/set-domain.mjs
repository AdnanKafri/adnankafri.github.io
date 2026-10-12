import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
process.chdir(path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'));
const arg=process.argv[2];if(!arg)throw new Error('Usage: node tools/set-domain.mjs <HTTPS-origin>');
const parsed=new URL(arg);if(parsed.protocol!=='https:'||parsed.username||parsed.password||parsed.pathname!=='/'||parsed.search||parsed.hash)throw new Error('Supply a bare HTTPS origin.');
fs.writeFileSync('site.config.json',JSON.stringify({SITE_URL:parsed.origin+'/'},null,2)+'\n');
await import('./build.mjs');
