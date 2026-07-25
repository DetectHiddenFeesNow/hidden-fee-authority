#!/usr/bin/env node
const fs = require('fs'), path = require('path');
const base = process.platform === 'win32' ? 'C:/vhub' : '.';
const r = { checked: 0, updated: 0, errors: [] };
function wc(h) { return h.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().split(' ').length; }
function faq(h) { for (const p of [/<h[12][^>]*>\s*FAQ\s*<\/h[12]>/i]) { const m = h.match(p); if (m) return {pos:m.index,marker:m[0]}; } return null; }
function expand(d) {
  const fp = path.join(base, d, 'index.html');
  if (!fs.existsSync(fp)) return;
  let c = fs.readFileSync(fp, 'utf8');
  const _wb = wc(c);
  const hasEx = c.includes('Example scenario'), hasRes = c.includes('Results Preview');
  const f = faq(c);
  if (!f) { r.errors.push(d); return; }
  const ch = [];
  if (!hasEx) {
    const n = d.replace('ai-','').replace(/-/g,' ').replace(/\b\w/g,l=>l.toUpperCase());
    c = c.slice(0,f.pos)+`<h2>Example Scenario</h2><p><strong>Example scenario:</strong> A consumer reviewing ${n.toLowerCase()} terms discovers restrictions not clearly disclosed. After AI analysis, the system identifies clauses that may affect expected value.</p>\n`+c.slice(f.pos);
    ch.push('ex');
  }
  if (!hasRes) {
    const res = '<h2>Results Preview</h2><p>After analysis you receive an AI Analysis Report including: Summary Report; Hidden Fee Detection; Cost Impact Analysis; Risk Score; and Recommendations.</p>\n';
    const f2 = faq(c);
    if (f2) { c = c.slice(0,f2.pos)+res+'\n'+c.slice(f2.pos); ch.push('res'); }
  }
  if (ch.length) { fs.writeFileSync(fp,c,'utf8'); r.updated++; console.log(d,wc(c)); }
  r.checked++;
}
fs.readdirSync(base).filter(d=>d.startsWith('ai-')&&fs.statSync(path.join(base,d)).isDirectory()).forEach(expand);
console.log('Checked:',r.checked,'| Updated:',r.updated,'| Errors:',r.errors.length);
