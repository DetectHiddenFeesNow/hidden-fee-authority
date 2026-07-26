(function(){
  'use strict';
  const header=document.querySelector('.header');
  if(header){window.addEventListener('scroll',()=>{header.classList.toggle('header-scrolled',window.pageYOffset>50)},{passive:true})}
  const h=document.querySelector('.hamburger'),n=document.querySelector('.header-nav');
  if(h&&n){h.addEventListener('click',()=>{h.classList.toggle('active');n.classList.toggle('open');h.setAttribute('aria-expanded',n.classList.contains('open'))});n.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{h.classList.remove('active');n.classList.remove('open')}));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&n.classList.contains('open')){h.classList.remove('active');n.classList.remove('open')}})}
  document.querySelectorAll('.faq-question').forEach(b=>b.addEventListener('click',()=>{const i=b.closest('.faq-item'),o=i.classList.contains('open');i.classList.toggle('open');b.setAttribute('aria-expanded',!o)}));
  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();window.scrollTo({top:t.getBoundingClientRect().top+window.pageYOffset-80,behavior:'smooth'})}}));
  const toc=document.querySelector('.toc');
  if(toc){const art=document.querySelector('article');if(art){const l=document.createElement('div');art.querySelectorAll('h2,h3').forEach((el,i)=>{if(!el.id)el.id='s-'+i;const a=document.createElement('a');a.href='#'+el.id;a.textContent=el.textContent.slice(0,60);if(el.tagName==='H3'){a.style.paddingLeft='16px';a.style.fontSize='var(--text-xs)'}l.appendChild(a)});if(l.children.length)toc.appendChild(l)}}
  document.querySelectorAll('[data-reading-time]').forEach(el=>{const t=document.querySelector('article')?.textContent||'';el.textContent=Math.max(1,Math.ceil(t.split(/\s+/).filter(Boolean).length/200))+' min read'})
})();
