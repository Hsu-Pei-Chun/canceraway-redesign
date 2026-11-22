const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.goto('https://www.canceraway.org.tw/',{waitUntil:'domcontentloaded',timeout:60000});await p.waitForTimeout(1500);
const r=await p.evaluate(()=>{const t=s=>(s||'').replace(/\s+/g,' ').trim();
const out=[];document.querySelectorAll('nav li, .navbar li, #menu li, .menu li').forEach(li=>{const a=li.querySelector(':scope > a');if(!a)return;const subs=[...li.querySelectorAll(':scope ul a')].map(x=>t(x.textContent)+' | '+x.getAttribute('href'));if(subs.length)out.push({top:t(a.textContent),href:a.getAttribute('href'),subs});});
const foot=[...document.querySelectorAll('footer a')].map(a=>t(a.textContent)+' | '+a.getAttribute('href'));
const footText=t((document.querySelector('footer')||{}).innerText||'');
return {out,foot,footText};});
console.log(JSON.stringify(r,null,1));await b.close();})();
