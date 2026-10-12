'use strict';
(() => {
  const root=document.documentElement;
  const arabic=/^\/ar(?:\/|$)/.test(location.pathname);
  root.lang=arabic?'ar':'en';root.dir=arabic?'rtl':'ltr';root.dataset.errorLanguage=root.lang;
  try{root.dataset.theme=localStorage.getItem('ak-theme')==='light'?'light':'dark';}catch{}
  document.querySelector('meta[name="theme-color"]').content=root.dataset.theme==='light'?'#f5f2ec':'#141413';
})();
