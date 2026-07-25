var fs = require('fs');
var dirs = [
  'the-hidden-fees-consumer-report-2026',
  'the-hidden-healthcare-costs-report-2026', 
  'the-hidden-subscription-fees-report-2026',
  'consumer-fee-protection-guide-2026',
  'hidden-fee-statistics',
  'the-hidden-insurance-fees-report-2026',
  'the-hidden-banking-fees-report-2026',
  'the-hidden-telecom-fees-report-2026',
  'the-hidden-travel-fees-report-2026',
  'the-hidden-auto-dealer-fees-report-2026',
  'the-hidden-rental-fees-report-2026',
  'the-hidden-contractor-fees-report-2026',
  'the-hidden-legal-fees-report-2026'
];

dirs.forEach(function(d) {
  try {
    var fp = 'C:/vhub/' + d + '/index.html';
    var c = fs.readFileSync(fp, 'utf8');
    var changes = [];
    
    // 1. Add OG tags if missing
    if (!c.includes('og:title')) {
      var t = c.match(/<title>([^<]+)<\/title>/);
      var de = c.match(/<meta name="description" content="([^"]+)"/);
      var title = t ? t[1] : d;
      var desc = de ? de[1] : '';
      var og = '<meta property="og:title" content="' + title.replace(/"/g,'"') + '">\n<meta property="og:description" content="' + desc.replace(/"/g,'"') + '">\n<meta property="og:url" content="https://hidden-fee-authority.vercel.app/' + d + '/">\n<meta property="og:type" content="article">\n<meta property="og:site_name" content="Hidden Fee Authority">\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="' + title.replace(/"/g,'"') + '">\n<meta name="twitter:description" content="' + desc.replace(/"/g,'"') + '">\n';
      c = c.replace('<link rel="canonical"', og + '<link rel="canonical"');
      changes.push('og');
    }

    // 2. Add Example scenario if missing
    if (!c.includes('Example scenario')) {
      var ex = '<h2>Example Scenario</h2>\n<p><strong>Example scenario:</strong> A consumer reviewing ' + d.replace(/-/g,' ') + ' discovers fees not clearly disclosed during signup. After AI analysis, the system identifies hidden charges that may affect total cost expectations.</p>\n';
      c = c.replace('Frequently Asked Questions', 'Example Scenario\n</h2>\n' + ex + '<h2>Frequently Asked Questions');
      // Fallback if FAQ heading not found
      if (!c.includes(ex)) {
        c = c.replace('<div class="cta"', ex + '\n<div class="cta"');
      }
      changes.push('ex');
    }

    // 3. Add Results Preview if missing
    if (!c.includes('Results Preview')) {
      var res = '<h2>Results Preview</h2>\n<p>After analysis you receive an AI Analysis Report including: Summary Report; Hidden Fee Detection; Cost Impact Analysis; Risk Score; and Recommendations.</p>\n';
      // Insert before CTA
      c = c.replace('<div class="cta"', res + '<div class="cta"');
      changes.push('res');
    }

    if (changes.length > 0) {
      fs.writeFileSync(fp, c, 'utf8');
      console.log('FIXED ' + d + ': ' + changes.join(', '));
    } else {
      console.log('OK    ' + d);
    }
  } catch(e) {
    console.log('ERROR ' + d + ': ' + e.message);
  }
});
console.log('\nDone.');