#!/usr/bin/env node
const fs = require('fs'), path = require('path');
const base = process.platform === 'win32' ? 'C:/vhub' : '.';
const report = { 
  timestamp: new Date().toISOString(),
  total: 0, passing: 0, issues: [],
  header_mismatch: [], thin_content: [], duplicate_risk: [],
  missing_cta: [], missing_schema: [], trust_issues: [], 
  topic_contamination: []
};

// Off-topic terms that shouldn't appear in random pages
const offTopicTerms = [
  { term: 'mortgage', pagePattern: /mortgage/i },
  { term: 'loan origination', pagePattern: /loan\s*origination|origination\s*fee/i },
  { term: 'prepayment penalty', pagePattern: /prepayment/i },
  { term: 'APR', pagePattern: /APR/i },
];

function countWords(html) {
  return html.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().split(' ').length;
}

function audit(dirname) {
  const fp = path.join(base, dirname, 'index.html');
  if (!fs.existsSync(fp)) return;
  let c = fs.readFileSync(fp, 'utf8');
  const wc = countWords(c);
  const title = (c.match(/<title>([^<]+)/)||[])[1] || '';
  const h1 = (c.match(/<h1>([^<]+)/)||[])[1] || '';
  const bodyStart = (c.match(/<h1>[^<]*<\/h1>\s*<p>([^<]+)/)||[])[1] || '';
  const pageName = dirname.replace('ai-','').replace(/-/g,' ').toLowerCase();
  const reportEntry = { page: dirname, title, h1, words: wc, issues: [] };
  
  // 1. Topic contamination - check for off-topic terms
  for (const ot of offTopicTerms) {
    if (ot.term === 'mortgage' && !pageName.includes('mortgage')) continue;
    if (ot.term === 'loan origination' && !pageName.includes('loan')) continue;
    if (c.toLowerCase().includes(ot.term) && !pageName.includes(ot.term.replace(/ /g,''))) {
      reportEntry.issues.push(`off-topic: ${ot.term}`);
    }
  }
  
  // 2. Header mismatch - check if body mentions different topic than title
  const titleTopic = title.replace(/AI\s*/,'').replace(/Check[^]*/,'').toLowerCase().trim();
  const bodyWords = bodyStart.toLowerCase().split(' ').slice(0,10);
  const wordMatch = bodyWords.some(w => titleTopic.includes(w) || w.length > 5 && titleTopic.includes(w));
  if (!wordMatch && bodyWords.length > 3) {
    reportEntry.issues.push(`header mismatch: title="${titleTopic.substring(0,30)}" body="${bodyWords.slice(0,5).join(' ')}"`);
    report.header_mismatch.push(dirname);
  }
  
  // 3. Thin content
  if (wc < 800) {
    reportEntry.issues.push(`thin content: ${wc} words`);
    report.thin_content.push(dirname);
  }
  
  // 4. Missing CTA
  if (!c.includes('class="btn"') && !c.includes('class="cta"')) {
    reportEntry.issues.push('missing CTA');
    report.missing_cta.push(dirname);
  }
  
  // 5. Schema
  if (!c.includes('application/ld+json')) {
    reportEntry.issues.push('missing schema');
    report.missing_schema.push(dirname);
  }
  
  // 6. Trust signals
  if (!c.includes('Private') && !c.includes('private') && !c.includes('privacy')) {
    reportEntry.issues.push('trust signals missing');
    report.trust_issues.push(dirname);
  }
  
  if (reportEntry.issues.length) {
    report.issues.push(reportEntry);
  } else {
    report.passing++;
  }
  report.total++;
}

// Run audit
fs.readdirSync(base).filter(d=>d.startsWith('ai-')&&fs.statSync(path.join(base,d)).isDirectory()).sort().forEach(audit);

// Summary
report.pages_checked = report.total;
report.pages_passing = report.passing;
report.pages_needing_fixes = report.issues.length;

console.log('=== BACKLINK QUALITY AUDIT ===');
console.log(`Total pages: ${report.total}`);
console.log(`Passing: ${report.passing}`);
console.log(`Needing fixes: ${report.issues.length}`);
console.log(`\nHeader mismatches: ${report.header_mismatch.length}`);
console.log(`Thin content (<800w): ${report.thin_content.length}`);
console.log(`Missing CTA: ${report.missing_cta.length}`);
console.log(`Missing schema: ${report.missing_schema.length}`);
console.log(`Trust issues: ${report.trust_issues.length}`);

if (report.issues.length > 0) {
  console.log('\n=== PAGES WITH ISSUES (first 10) ===');
  report.issues.slice(0,10).forEach(p => {
    console.log(`  ${p.page}: ${p.words}w - ${p.issues.join('; ')}`);
  });
}

// Save report
fs.writeFileSync(path.join(base, 'scripts', 'backlink_quality_audit.json'), JSON.stringify(report, null, 2));
console.log(`\nReport saved: scripts/backlink_quality_audit.json`);
