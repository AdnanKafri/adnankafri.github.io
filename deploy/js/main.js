'use strict';
(() => {
  const data = window.PORTFOLIO, system = data.system, root = document.documentElement;
  const $ = (s, parent = document) => parent.querySelector(s);
  const $$ = (s, parent = document) => [...parent.querySelectorAll(s)];
  const read = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const save = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Storage is optional. */ } };
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeURL = value => { if (!value) return null; try { return ['https:','http:','file:'].includes(new URL(value, location.href).protocol) ? esc(value) : null; } catch { return null; } };
  const external = 'target="_blank" rel="noopener noreferrer"';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine) and (min-width: 851px)');
  const mobile = matchMedia('(max-width: 680px)');
  const compactDiagram = matchMedia('(max-width: 1024px)');
  let language = root.lang === 'ar' ? 'ar' : 'en';
  const asset = value => /^(https?:|\/)/.test(value) ? value : (language==='ar'?'../':'')+value;
  let paused = read('ak-motion-paused') === 'true', lenis = null, motionContext = null, packetObserver = null;
  let apiTimer = 0, noticeTimer = 0, scrollFrame = 0, switching = false, lenisTick = null;
  let formValidated = false;
  let stackObserver = null, stackFrame = 0;
  const dialogFocus = new WeakMap();
  const t = () => data[language], s = () => system[language];
  const moving = () => !reduced.matches && !paused;
  const chips = items => `<div class="chips">${items.map(v => `<span class="chip" dir="auto">${esc(v)}</span>`).join('')}</div>`;

  function renderName() {
    const name = t().name;
    $('#kinetic-name').removeAttribute('aria-label');
    // Arabic shaping is preserved: animate whole joined words, never disconnected letters.
    $('#kinetic-name').innerHTML = `<span class="sr-only">${esc(name)}</span>` + name.split(' ').map(word => language === 'ar'
      ? `<span class="arabic-word" aria-hidden="true">${esc(word)}</span>`
      : `<span class="name-word" aria-hidden="true">${[...word].map(letter => `<span class="name-letter">${esc(letter)}</span>`).join('')}</span>`).join('');
  }
  function renderBento() {
    const c = t(), u = s();
    $('#bento').innerHTML = `
      <article class="bento-card bento-profile spotlight"><p class="eyebrow">${esc(u.systemLabel)}</p><h3>${esc(c.portraitNote)}</h3><p>${esc(c.profile)}</p><div class="facts-strip"><div class="fact"><strong dir="ltr"><span class="counter" data-count="3">3</span>+</strong><span>${esc(u.yearsLabel)}</span></div><div class="fact"><strong dir="ltr"><span class="counter" data-count="5">5</span></strong><span>${esc(u.rankLabel)}</span></div></div></article>
      <figure class="bento-card bento-photo"><img src="${asset('assets/adnan.webp')}" alt="${esc(c.portraitAlt)}" width="1100" height="733" loading="lazy" decoding="async"><figcaption class="photo-caption"><strong>${esc(c.name)}</strong><p>${esc(c.portraitLabel)}</p><p>${esc(c.portraitSub)}</p></figcaption></figure>
      <article class="bento-card bento-location spotlight"><p class="eyebrow">${esc(c.facts[0][0])}</p><div class="location-glyph" aria-hidden="true">⌖</div><p>${esc(c.facts[0][1])}</p></article>
      <article class="bento-card bento-languages spotlight"><p class="eyebrow">${esc(c.facts[1][0])}</p><div class="language-glyph" aria-hidden="true">Aa / ع</div><p>${esc(c.facts[1][1])}</p></article>
      <article class="bento-card bento-education spotlight"><p class="eyebrow">${esc(c.facts[2][0])}</p><h3>${esc(c.degree)}</h3><p>${esc(c.facts[2][1])}</p></article>
      <article class="bento-card bento-current spotlight"><span class="current-symbol" aria-hidden="true">↗</span><div><p class="eyebrow">${esc(u.current)}</p><p>${esc(u.currentBody)}</p></div></article>`;
  }
  function diagram(index) {
    const u = s(), small = compactDiagram.matches, rtl = language === 'ar';
    const width = small ? 360 : 1000;
    let height, nodes, edges;
    if (index === 0) {
      height = small ? 590 : 315;
      nodes = small ? [
        [180,35,u.user], [180,130,'Laravel','',true], [180,225,'FastAPI'],
        [180,330,u.model,'EfficientNet-B4 / BiLSTM + MFCC'], [180,440,u.score], [180,550,u.dashboard]
      ] : [
        [100,65,u.user], [310,65,'Laravel','',true], [555,65,'FastAPI'],
        [850,65,u.model,'EfficientNet-B4 / BiLSTM + MFCC'], [670,235,u.score], [310,235,u.dashboard]
      ];
      edges = [[0,1],[1,2],[2,3],[3,4],[4,5]];
    } else if (index === 1) {
      height = small ? 400 : 255;
      nodes = small ? [[90,40,u.web],[270,40,u.flutter],[180,185,'Laravel API','',true],[90,350,'MySQL'],[270,350,u.search]]
        : [[130,55,u.web],[130,195,u.flutter],[500,125,'Laravel API','',true],[860,55,'MySQL'],[860,195,u.search]];
      edges = [[0,2],[1,2],[2,3],[2,4]];
    } else {
      height = small ? 410 : 135;
      nodes = small ? [[180,40,u.school],[180,145,'Laravel REST API','',true],[180,250,'MySQL'],[180,365,u.roles]]
        : [[115,65,u.school],[370,65,'Laravel REST API','',true],[615,65,'MySQL'],[865,65,u.roles]];
      edges = [[0,1],[1,2],[2,3]];
    }
    // Mirror coordinates and flow, not glyphs. Latin technical names remain readable.
    const positioned = nodes.map(([x,y,label,sub,main]) => [rtl ? width-x : x,y,label,sub,main]);
    const nodeW = (n) => n[3] ? (small ? 300 : 250) : (small && index===1 ? 155 : small ? 220 : 175);
    const paths = edges.map(([a,b], i) => {
      const from = positioned[a], to = positioned[b];
      let x1=from[0], y1=from[1], x2=to[0], y2=to[1], path;
      if (small) {
        y1+=27;y2-=27;
        path=`M${x1} ${y1} C${x1} ${(y1+y2)/2} ${x2} ${(y1+y2)/2} ${x2} ${y2}`;
      } else if (index===0 && a===3) {
        y1+=29;y2-=29;
        path=`M${x1} ${y1} V${(y1+y2)/2} Q${x1} ${y2} ${x2} ${y2}`;
      } else {
        const direction = Math.sign(x2-x1);x1+=direction*nodeW(from)/2;x2-=direction*nodeW(to)/2;
        path=`M${x1} ${y1} C${(x1+x2)/2} ${y1} ${(x1+x2)/2} ${y2} ${x2} ${y2}`;
      }
      return `<path class="diagram-line" marker-end="url(#flow-arrow-${index})" d="${path}"/><circle class="diagram-packet" r="3" opacity=".8"><animateMotion dur="${2.5+i*.25}s" begin="-${i*.5}s" repeatCount="indefinite" path="${path}"/></circle>`;
    }).join('');
    const blocks = positioned.map(n => {
      const [x,y,label,sub,main] = n, w=nodeW(n);
      const multiline=small&&label===u.search;
      const text=multiline?u.searchLines.map((line,i)=>`<tspan x="${x}" y="${y-8+i*18}">${esc(line)}</tspan>`).join(''):esc(label);
      return `<g><rect class="diagram-node ${main?'main-node':''}" x="${x-w/2}" y="${y-27}" width="${w}" height="54" rx="2"/><text class="diagram-label ${main?'main-label':''}" x="${x}" y="${y-(sub?7:0)}" direction="${/[\u0600-\u06ff]/.test(label)?'rtl':'ltr'}">${text}</text>${sub?`<text class="diagram-label diagram-sub" x="${x}" y="${y+13}" direction="ltr">${esc(sub)}</text>`:''}</g>`;
    }).join('');
    const description = [u.deepFlow,u.phoneFlow,u.schoolFlow][index];
    return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="diagram-title-${index} diagram-desc-${index}" class="system-diagram"><title id="diagram-title-${index}">${esc(t().projects[index].title)} — ${esc(u.architecture)}</title><desc id="diagram-desc-${index}">${esc(description)}</desc><defs><marker id="flow-arrow-${index}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="var(--muted)"/></marker></defs>${paths}${blocks}</svg>`;
  }
  function renderSkills(){
    const core = new Set([0,1,3,5]);
    $('#skill-grid').innerHTML=t().skills.map(([title,items],group)=>{
      const list=items.map((item,i)=>`<li class="stack-item ${(group===0&&core.has(i))||(group===1&&i===6)||(group===2&&i===0)?'stack-core':''}"><span dir="auto">${esc(item)}</span></li>`).join('');
      return `<article class="stack-row"><div class="stack-row-heading"><h3>${esc(title)}</h3><button class="stack-pause" type="button" aria-pressed="false" aria-label="${esc(s().stackPause)}"><span aria-hidden="true">Ⅱ</span></button></div><div class="stack-window"><div class="stack-track"><ul class="stack-list">${list}</ul></div></div></article>`;
    }).join('');
    $$('.stack-pause').forEach(button=>button.addEventListener('click',()=>{const row=button.closest('.stack-row'),stopped=row.classList.toggle('is-paused');button.setAttribute('aria-pressed',String(stopped));button.setAttribute('aria-label',stopped?s().stackResume:s().stackPause);button.firstElementChild.textContent=stopped?'▷':'Ⅱ';}));
    const serviceIcons=[
      '<rect x="3" y="4" width="26" height="24" rx="2"/><path d="M3 11h26M8 7.5h.1M12 7.5h.1M12 16l-4 4 4 4m8-8 4 4-4 4"/>',
      '<rect x="11" y="11" width="10" height="10" rx="2"/><path d="M16 3v8m0 10v8M3 16h8m10 0h8M6 6l5 5m10 10 5 5M26 6l-5 5M11 21l-5 5"/>',
      '<circle cx="16" cy="16" r="5"/><circle cx="5" cy="6" r="2"/><circle cx="27" cy="6" r="2"/><circle cx="5" cy="26" r="2"/><circle cx="27" cy="26" r="2"/><path d="M7 8l5 5m8 0 5-5M7 24l5-5m8 0 5 5"/>',
      '<rect x="3" y="4" width="26" height="18" rx="2"/><path d="M11 28h10m-5-6v6M11 13l3 3 7-7"/>',
      '<path d="M3 5h10a4 4 0 0 1 3 2 4 4 0 0 1 3-2h10v22H19a4 4 0 0 0-3 2 4 4 0 0 0-3-2H3ZM16 7v22M7 11h5m8 0h5M7 16h5m8 0h5"/>'
    ];
    const titlePatterns=language==='ar'?[/Laravel/,/REST API/,/الذكاء الاصطناعي/,/دعم فني/,/تدريب تقني/]:[/Laravel/,/REST API/,/AI model and LLM API/,/IT support/,/technical training/];
    const places=t().coverage.match(language==='ar'?/حماة|حمص|دمشق|أونلاين \/ عن بُعد/g:/Hama|Homs|Damascus|online \/ remote/g)||[];
    $('#services').innerHTML=`<div class="offer-heading"><div><p class="eyebrow">${esc(t().available)}</p><h3 id="offer-title">${esc(t().servicesTitle)}</h3></div><p class="offer-intro">${esc(t().serviceIntro)}</p></div><ul class="offer-grid" aria-labelledby="offer-title">${t().services.map((item,i)=>`<li class="offer-card spotlight"><div class="offer-card-top"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${serviceIcons[i]}</svg><span class="mono" aria-hidden="true">0${i+1}</span></div><h4>${esc(item.match(titlePatterns[i])?.[0]||item)}</h4><p>${esc(item)}</p></li>`).join('')}</ul><div class="coverage-strip"><div class="coverage-chips" aria-hidden="true">${[...new Set(places)].map(place=>`<span>${esc(place)}</span>`).join('')}</div><p class="coverage">${esc(t().coverage)}</p></div>`;
  }
  function renderExperience(){
    $('#timeline').innerHTML=t().experience.map(item=>`<article class="timeline-row ${item.highlight?'role-highlight':''}"><div class="timeline-meta"><p class="timeline-date">${esc(item.date)}</p>${item.status?`<span class="role-status">${esc(item.status)}</span>`:''}${item.type?`<span class="role-type">${esc(item.type)}</span>`:''}</div><div class="timeline-body"><h3>${esc(item.role)}</h3><p class="company">${safeURL(item.url)?`<a href="${safeURL(item.url)}" ${external}>${esc(item.company)} ↗</a>`:esc(item.company)}</p><p class="role-description">${esc(item.description)}</p>${item.bullets?`<p class="responsibilities-label">${esc(s().responsibilities)}</p><ul class="responsibilities">${item.bullets.map(line=>`<li>${esc(line)}</li>`).join('')}</ul>`:''}${item.tags?`<div class="responsibility-tags">${chips(item.tags)}</div>`:''}</div></article>`).join('');
  }
  function queueStack(){
    if(!stackFrame)stackFrame=requestAnimationFrame(measureStack);
  }
  function setupStack(){
    stackObserver?.disconnect();
    if('ResizeObserver' in window){stackObserver=new ResizeObserver(queueStack);$$('.stack-window').forEach(el=>stackObserver.observe(el));}
    queueStack();
  }
  function measureStack(){
    stackFrame=0;
    $$('.stack-row').forEach(row=>{
      const viewport=$('.stack-window',row),track=$('.stack-track',row),original=$('.stack-list:not([aria-hidden])',row);
      if(reduced.matches){row.classList.remove('is-looping');$$('[aria-hidden="true"].stack-list',track).forEach(el=>el.remove());delete row.dataset.cycleWidth;return;}
      row.classList.add('is-looping');
      // Each cycle includes its trailing gap, so adjacent copies have identical spacing.
      const width=original.getBoundingClientRect().width,visible=viewport.clientWidth;
      if(!width||!visible){row.classList.remove('is-looping');return;}
      const copies=Math.max(3,Math.ceil(visible*2/width)+2);
      if(row.dataset.cycleWidth===String(width)&&track.children.length===copies)return;
      $$('.stack-list[aria-hidden]',track).forEach(el=>el.remove());
      for(let i=1;i<copies;i++){const clone=original.cloneNode(true);clone.setAttribute('aria-hidden','true');track.append(clone);}
      row.dataset.cycleWidth=String(width);
      track.style.setProperty('--cycle-width',`${width}px`);
      track.style.setProperty('--stack-duration',`${width/42}s`);
    });
  }
  function isolateMixedText(){
    if(language!=='ar')return;
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    const nodes=[];while(walker.nextNode()){const node=walker.currentNode;if(/[A-Za-z0-9]/.test(node.textContent)&&!node.parentElement.closest('bdi,svg,script,style,pre,code,textarea,input,.counter,.kinetic-name'))nodes.push(node);}
    nodes.forEach(node=>{const fragment=document.createDocumentFragment();let cursor=0;const text=node.textContent;
      for(const match of text.matchAll(/[A-Za-z0-9]+(?:[ ._+\/#&-]+[A-Za-z0-9]+)*/g)){fragment.append(text.slice(cursor,match.index));const bdi=document.createElement('bdi');bdi.dir='ltr';bdi.textContent=match[0];fragment.append(bdi);cursor=match.index+match[0].length;}fragment.append(text.slice(cursor));node.replaceWith(fragment);
    });
  }
  function renderProjects() {
    const old = $$('.project-panel').map(el => el.open), c=t(), u=s();
    $('#project-list').innerHTML = c.projects.map((project,i) => {
      const config=data.projects[i];
      const link=(url,label) => safeURL(url) ? `<a href="${safeURL(url)}" ${external}>${esc(label)} ↗</a>` : '';
      return `<details class="project-panel ${i===0?'featured':''}" ${old.length?old[i]?'open':'':i===0?'open':''}><summary class="project-summary"><span class="project-number">0${i+1}</span><h3><span class="eyebrow">${esc(i===0?c.featured:c.projectLabel)}</span><span class="project-title">${esc(project.title)}</span></h3><span class="project-toggle" aria-hidden="true">+</span><span class="sr-only">${esc(u.expand)}</span></summary><div class="project-content"><div class="project-copy"><p>${esc(project.description)}</p><div>${chips(config.stack)}${config.liveUrl||config.repoUrl?`<div class="project-links">${link(config.liveUrl,c.live)}${link(config.repoUrl,c.code)}</div>`:''}</div></div><div class="architecture ${i===0?'tilt-card':''}"><div class="architecture-header"><span>${esc(u.architecture)}</span><span>${esc(u.architectureNote)}</span></div><div class="diagram-holder" data-diagram="${i}">${diagram(i)}</div></div>${safeURL(config.image)?`<div class="project-shot has-image"><img src="${asset(safeURL(config.image))}" alt="${esc(project.alt)}" width="1200" height="750" loading="lazy" decoding="async"></div>`:''}</div></details>`;
    }).join('');
    $$('.project-panel').forEach(panel => panel.addEventListener('toggle', () => {
      $('.project-summary .sr-only',panel).textContent=panel.open?s().collapse:s().expand;
      window.ScrollTrigger?.refresh(); lenis?.resize(); syncDiagrams();
    }));
  }
  function render() {
    motionContext?.revert(); motionContext=null;
    const c=t(), u=s();
    root.lang=language;root.dir=language==='ar'?'rtl':'ltr';
    document.title=c.metaTitle;
    $('meta[name="description"]').content=c.metaDescription;
    $('meta[property="og:title"]').content=c.metaTitle;
    $('meta[property="og:description"]').content=c.metaDescription;
    $('meta[property="og:locale"]').content=language==='ar'?'ar_SY':'en_US';
    $$('[data-t]').forEach(el => el.textContent=c[el.dataset.t]);
    $$('[data-s]').forEach(el => el.textContent=u[el.dataset.s]);
    $$('[data-contact]').forEach(el=>{const kind=el.dataset.contact;el.href=kind==='email'?'mailto:'+system.email:kind==='phone'?'tel:'+system.phone.replace(/\s/g,''):system[kind];if(kind==='email')el.innerHTML=`<bdi dir="ltr">${esc(system.email)}</bdi> <span aria-hidden="true">↗</span>`;if(kind==='phone')el.textContent=system.phone.replace(/ /g,'\u00a0');});
    $$('[data-publication-link]').forEach(el=>el.href='https://doi.org/'+system.publication.doi);
    $('.doi').textContent='DOI: '+system.publication.doi;
    $('#navigation').innerHTML=c.nav.map(([id,title])=>`<a href="#${id}" aria-label="${esc(title)}"><span data-scramble="${esc(title)}" aria-hidden="true">${esc(title)}</span></a>`).join('');
    $('#navigation').setAttribute('aria-label',c.navLabel);
    $('#language').setAttribute('href',language==='en'?'ar/index.html':'../index.html');
    $('#language').textContent=language==='en'?'العربية':'English';$('#language').lang=language==='en'?'ar':'en';
    $('#language').setAttribute('aria-label',language==='en'?'العربية — '+u.switchLanguage:'English — '+u.switchLanguage);
    $$('[data-close-dialog]').forEach(button => button.setAttribute('aria-label',u.close));
    $$('.brand-logo img,.citation-logo').forEach(img=>img.alt=u.logoAlt);
    $$('.brand-logo').forEach(link=>link.setAttribute('aria-label',c.name));
    $('#api-response').setAttribute('aria-label',u.apiResponse);
    $('meta[property="og:image:alt"]').content=c.name+' — '+c.title;
    renderName();renderBento();
    renderSkills();renderExperience();
    renderProjects();
    $('#achievements').innerHTML=c.achievements.map(([fact,description])=>`<div class="achievement"><strong><bdi dir="ltr">${esc(fact)}</bdi></strong><span>${esc(description)}</span></div>`).join('');
    $('#year').textContent=new Date().getFullYear();$('#form-status').textContent='';
    closeMenu();themeLabel();motionLabel();runAPI();setupMotion();bindScramble();isolateMixedText();setupStack();queueScroll();
    if(formValidated)validateForm(false);
  }
  function themeLabel() {
    const light=root.dataset.theme==='light';
    $('#theme').textContent=light?'☾':'☼';$('#theme').setAttribute('aria-label',t()[light?'darkMode':'lightMode']);
    $('meta[name="theme-color"]').content=light?'#f5f2ec':'#141413';
  }
  function toggleTheme(){root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';save('ak-theme',root.dataset.theme);themeLabel();}
  function closeMenu(){ $('#navigation').classList.remove('open');root.classList.remove('menu-open');$('#main').inert=false;$('footer').inert=false;$('#menu').setAttribute('aria-expanded','false');$('#menu').setAttribute('aria-label',t().openMenu); }
  async function switchLanguage() {
    if(switching)return;switching=true;
    save('ak-language',language==='en'?'ar':'en');
    try{sessionStorage.setItem('ak-contact-draft',JSON.stringify(Object.fromEntries(new FormData($('#contact-form')))));}catch{}
    if(moving() && $('#main').animate)await $('#main').animate([{opacity:1},{opacity:0}],{duration:140,fill:'forwards'}).finished;
    location.assign($('#language').href);
  }
  function responseText(){
    const c=t();
    return `{\n  "role": ${JSON.stringify(c.title)},\n  "stack": ${JSON.stringify(system.stack)},\n  "location": ${JSON.stringify(c.location)},\n  "availability": ${JSON.stringify(c.available)}\n}`;
  }
  function runAPI() {
    clearTimeout(apiTimer);const request=system.request,response=responseText();
    $('#api-request').textContent='';$('#api-response').textContent='';$('#api-status').textContent=s().running;
    $('#run-api').disabled=true;
    const finish=()=>{ $('#api-request').textContent=request;$('#api-response').innerHTML=esc(response).replace(/(&quot;.*?&quot;)(\s*:)?/g,(m,string,key)=>`<span class="${key?'json-key':'json-string'}" dir="${key?'ltr':'auto'}">${string}</span>${key||''}`);$('#run-api').disabled=false;$('#api-status').textContent=s().ready; };
    if(!moving()){finish();return;}
    let frame=0;
    function type(){
      if(!moving()){finish();return;}
      frame++;
      if(frame<=request.length){$('#api-request').textContent=request.slice(0,frame);apiTimer=setTimeout(type,48);}
      else {const count=(frame-request.length)*18;$('#api-response').textContent=response.slice(0,count);if(count<response.length)apiTimer=setTimeout(type,20);else finish();}
    }
    type();
  }
  function motionLabel(){root.classList.toggle('motion-paused',paused||reduced.matches);$('#motion-toggle').textContent=reduced.matches?s().motionReduced:paused?s().motionResume:s().motionPause;$('#motion-toggle').setAttribute('aria-pressed',String(paused||reduced.matches));$('#motion-toggle').disabled=reduced.matches;}
  function syncDiagrams(){
    $$('.system-diagram').forEach(svg=>{const panel=svg.closest('details');const rect=svg.getBoundingClientRect();const onScreen=rect.bottom>0&&rect.top<innerHeight;
      if(moving()&&!document.hidden&&(!panel||panel.open)&&onScreen){svg.unpauseAnimations?.();}else svg.pauseAnimations?.();
      $$('.diagram-packet',svg).forEach(packet=>packet.style.opacity=moving()?'.8':'0');
    });
  }
  function setupMotion() {
    motionContext?.revert(); motionContext=null;
    if(lenisTick&&window.gsap){gsap.ticker.remove(lenisTick);lenisTick=null;}
    lenis?.destroy();lenis=null;
    if(moving() && !mobile.matches && window.Lenis){
      lenis=new Lenis({duration:1.05,smoothWheel:true,syncTouch:false,anchors:false,autoRaf:!window.gsap});
      if(window.gsap){lenisTick=time=>lenis?.raf(time*1000);gsap.ticker.add(lenisTick);}
      if(window.ScrollTrigger)lenis.on('scroll',ScrollTrigger.update);
    }
    if(window.gsap && window.ScrollTrigger && moving()){
      gsap.registerPlugin(ScrollTrigger);
      motionContext=gsap.context(()=>{
        gsap.from('.name-letter, .arabic-word',{yPercent:85,opacity:0,rotation:language==='ar'?0:4,stagger:language==='ar'?.12:.055,duration:.85,ease:'power3.out',clearProps:'transform,opacity'});
        $$('.section-heading, .bento-card, .stack-row, .services, .timeline-row, .project-panel, .citation-card, .degree, .achievement').forEach(el=>{
          gsap.from(el,{y:mobile.matches?12:28,opacity:0,duration:.7,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 93%',once:true},clearProps:'transform,opacity'});
        });
        $$('.counter').forEach(el=>{const value=+el.dataset.count;const proxy={n:0};gsap.to(proxy,{n:value,duration:1.1,ease:'power1.out',scrollTrigger:{trigger:el,start:'top 95%',once:true},onUpdate:()=>el.textContent=Math.round(proxy.n),onComplete:()=>el.textContent=value});});
      });
      ScrollTrigger.refresh();
    } else {$$('.counter').forEach(el=>el.textContent=el.dataset.count);}
    if(!moving()){$$('.magnetic,.tilt-card').forEach(el=>el.style.transform='');}
    packetObserver?.disconnect();
    if('IntersectionObserver' in window){packetObserver=new IntersectionObserver(syncDiagrams,{threshold:0});$$('.system-diagram').forEach(svg=>packetObserver.observe(svg));}
    syncDiagrams();motionLabel();cursorVisibility();queueScroll();
  }
  function queueScroll(){if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScroll);}
  function updateScroll(){
    scrollFrame=0;const max=root.scrollHeight-innerHeight;$('.scroll-progress').style.transform=`scaleX(${max>0?Math.min(1,Math.max(0,scrollY/max)):0})`;
    const rail=$('.timeline-wrap'), rect=rail.getBoundingClientRect();
    const progress=moving()?Math.min(1,Math.max(0,(innerHeight*.72-rect.top)/Math.max(1,rect.height))):1;
    $('.rail-progress').style.transform=`scaleY(${progress})`;
  }
  function goTo(id){
    const target=document.getElementById(id);if(!target)return;
    closeMenu();if(lenis)lenis.scrollTo(target,{offset:-95});else target.scrollIntoView({behavior:moving()?'smooth':'instant'});
    try{history.replaceState(null,'',`#${id}`);}catch{/* file preview */}
    target.setAttribute('tabindex','-1');target.focus({preventScroll:true});
  }
  function showDialog(dialog){dialogFocus.set(dialog,document.activeElement);lenis?.stop();root.classList.add('dialog-open');dialog.showModal();}
  function notify(text){clearTimeout(noticeTimer);$('#notification').textContent=text;$('#notification').classList.add('visible');noticeTimer=setTimeout(()=>$('#notification').classList.remove('visible'),3000);}
  async function copyText(text){
    try{if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');await navigator.clipboard.writeText(text);notify(s().copied);}
    catch{showDialog($('#copy-dialog'));$('#copy-fallback').value=text;$('#copy-fallback').focus();$('#copy-fallback').select();}
  }
  function bindScramble(){
    $$('[data-scramble]').forEach(el=>{
      let timer=0;
      const restore=()=>{clearInterval(timer);el.textContent=el.dataset.scramble;};
      el.parentElement.addEventListener('pointerenter',()=>{
        if(!moving()||!finePointer.matches)return;restore();let step=0;const original=[...el.dataset.scramble],alphabet=language==='ar'?'ابتثجحخدذرزسشصضطظعغفقكلمنهوي':'{}[]<>/01_';
        timer=setInterval(()=>{step++;el.textContent=original.map((char,i)=>char===' '||i<step/1.6?char:alphabet[Math.floor(Math.random()*alphabet.length)]).join('');if(step>=original.length*1.6)restore();},26);
      });el.parentElement.addEventListener('pointerleave',restore);el.parentElement.addEventListener('focus',restore);
    });
  }
  // One short-lived animation loop for cursor, spotlight, magnet and tilt.
  const pointer={x:-100,y:-100,rx:-100,ry:-100,scale:1,targetScale:1};let pointerFrame=0,activeMagnet=null,activeTilt=null,activeSpotlight=null;
  function cursorVisibility(){document.body.classList.toggle('has-cursor',moving()&&finePointer.matches&&!root.classList.contains('dialog-open'));}
  function pointerTick(){
    pointerFrame=0;if(!moving()||!finePointer.matches)return;
    pointer.rx+=(pointer.x-pointer.rx)*.18;pointer.ry+=(pointer.y-pointer.ry)*.18;pointer.scale+=(pointer.targetScale-pointer.scale)*.18;
    $('.cursor-dot').style.transform=`translate3d(${pointer.x-2.5}px,${pointer.y-2.5}px,0)`;
    $('.cursor-ring').style.transform=`translate3d(${pointer.rx-15}px,${pointer.ry-15}px,0) scale(${pointer.scale})`;
    if(activeSpotlight){const r=activeSpotlight.getBoundingClientRect();activeSpotlight.style.setProperty('--mx',`${pointer.x-r.left}px`);activeSpotlight.style.setProperty('--my',`${pointer.y-r.top}px`);}
    if(activeMagnet){const r=activeMagnet.getBoundingClientRect();activeMagnet.style.transform=`translate(${(pointer.x-r.left-r.width/2)*.12}px,${(pointer.y-r.top-r.height/2)*.18}px)`;}
    if(activeTilt){const r=activeTilt.getBoundingClientRect();activeTilt.style.transform=`perspective(1200px) rotateX(${-(pointer.y-r.top-r.height/2)/r.height*3}deg) rotateY(${(pointer.x-r.left-r.width/2)/r.width*3}deg)`;}
    if(Math.abs(pointer.rx-pointer.x)+Math.abs(pointer.ry-pointer.y)>.25||Math.abs(pointer.scale-pointer.targetScale)>.01)pointerFrame=requestAnimationFrame(pointerTick);
  }
  document.addEventListener('pointermove',event=>{
    if(!moving()||!finePointer.matches||event.pointerType==='touch')return;
    pointer.x=event.clientX;pointer.y=event.clientY;pointer.targetScale=event.target.closest('a,button,summary,.bento-card,.api-console')?1.7:1;
    const magnet=event.target.closest('.magnetic'),tilt=event.target.closest('.tilt-card');
    if(activeMagnet&&activeMagnet!==magnet)activeMagnet.style.transform='';if(activeTilt&&activeTilt!==tilt)activeTilt.style.transform='';
    activeMagnet=magnet;activeTilt=tilt;activeSpotlight=event.target.closest('.spotlight');
    if(!pointerFrame)pointerFrame=requestAnimationFrame(pointerTick);
  },{passive:true});
  document.documentElement.addEventListener('pointerleave',()=>{pointer.x=pointer.y=-100;if(activeMagnet)activeMagnet.style.transform='';if(activeTilt)activeTilt.style.transform='';activeMagnet=activeTilt=activeSpotlight=null;if(!pointerFrame)pointerFrame=requestAnimationFrame(pointerTick);});

  $('#theme').addEventListener('click',toggleTheme);$('#language').addEventListener('click',event=>{event.preventDefault();switchLanguage();});$('#run-api').addEventListener('click',runAPI);
  $('#menu').addEventListener('click',()=>{if($('#navigation').classList.contains('open')){closeMenu();return;}$('#navigation').classList.add('open');root.classList.add('menu-open');$('#main').inert=true;$('footer').inert=true;$('#menu').setAttribute('aria-expanded','true');$('#menu').setAttribute('aria-label',t().closeMenu);$('#navigation a').focus();});
  $('#motion-toggle').addEventListener('click',()=>{paused=!paused;save('ak-motion-paused',String(paused));setupMotion();runAPI();});
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&$('#navigation').classList.contains('open')){closeMenu();$('#menu').focus();}
    if(event.key==='Tab'&&$('#navigation').classList.contains('open')){const controls=$$('.header a,.header button').filter(el=>el.getClientRects().length&&!el.disabled),first=controls[0],last=controls.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}
  });
  $$('dialog').forEach(dialog=>{
    $('[data-close-dialog]',dialog).addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
    dialog.addEventListener('close',()=>{if($$('dialog').some(el=>el.open))return;root.classList.remove('dialog-open');lenis?.start();cursorVisibility();const previous=dialogFocus.get(dialog);if(previous?.isConnected)previous.focus({preventScroll:true});});
  });
  document.addEventListener('click',event=>{
    const anchor=event.target.closest('a[href^="#"]');
    if(anchor){const id=anchor.getAttribute('href').slice(1);if(document.getElementById(id)){event.preventDefault();goTo(id);}}
    if(!event.target.closest('.header'))closeMenu();
  });
  $('#copy-citation').addEventListener('click',()=>copyText(system.citation));$('#copy-email').addEventListener('click',()=>copyText(system.email));
  function validateForm(focus=true){
    const form=$('#contact-form'),values={name:form.elements.name.value.trim(),email:form.elements.email.value.trim(),message:form.elements.message.value.trim()};
    const errors={name:values.name?'':s().requiredName,email:!values.email?s().requiredEmail:form.elements.email.validity.typeMismatch?s().invalidEmail:'',message:values.message?'':s().requiredMessage};
    let first=null;
    Object.entries(errors).forEach(([name,error])=>{const field=form.elements[name],label=$(`#${name}-error`);label.textContent=error;label.hidden=!error;field.setAttribute('aria-invalid',String(Boolean(error)));if(error&&!first)first=field;});
    if(first){if(focus){first.focus();$('#form-status').textContent=s().fixFields;}return null;}
    return values;
  }
  $('#contact-form').noValidate=true;
  $('#contact-form').addEventListener('input',()=>{if(formValidated)validateForm(false);$('#form-status').textContent='';$('#send-whatsapp').href=system.whatsapp;});
  $('#contact-form').addEventListener('submit',event=>{
    event.preventDefault();formValidated=true;const values=validateForm();if(!values)return;
    const {name,email,message}=values;
    const subject=encodeURIComponent(t().subject+name),body=encodeURIComponent(`${t().emailName}: ${name}\n${t().emailAddress}: ${email}\n\n${message}`);
    window.location.href=`mailto:${system.email}?subject=${subject}&body=${body}`;$('#form-status').textContent=t().formStatus;
  });
  $('#send-whatsapp').addEventListener('click',event=>{
    formValidated=true;const values=validateForm();if(!values){event.preventDefault();return;}
    const message=s().whatsappTemplate.replace(/\{(name|email|message)\}/g,(_,key)=>values[key]);
    event.currentTarget.href=`${system.whatsapp}?text=${encodeURIComponent(message)}`;
    $('#form-status').textContent=s().openingWhatsApp;
    // Native target=_blank navigation preserves the user gesture; no message is sent automatically.
  });
  addEventListener('scroll',queueScroll,{passive:true});addEventListener('resize',queueScroll,{passive:true});
  matchMedia('(max-width: 850px)').addEventListener('change',()=>closeMenu());
  document.addEventListener('visibilitychange',()=>{syncDiagrams();if(document.hidden)clearTimeout(apiTimer);else if($('#run-api').disabled)runAPI();});
  reduced.addEventListener('change',()=>{setupMotion();runAPI();queueStack();});finePointer.addEventListener('change',cursorVisibility);
  mobile.addEventListener('change',()=>{$$('.diagram-holder').forEach(holder=>holder.innerHTML=diagram(+holder.dataset.diagram));setupMotion();});
  compactDiagram.addEventListener('change',()=>{$$('.diagram-holder').forEach(holder=>holder.innerHTML=diagram(+holder.dataset.diagram));syncDiagrams();});
  render();
  try{const draft=JSON.parse(sessionStorage.getItem('ak-contact-draft')||'null');if(draft){for(const field of ['name','email','message'])$('#contact-form').elements[field].value=draft[field]||'';sessionStorage.removeItem('ak-contact-draft');}}catch{}
  document.fonts?.ready.then(()=>{queueStack();window.ScrollTrigger?.refresh();lenis?.resize();queueScroll();});
})();
