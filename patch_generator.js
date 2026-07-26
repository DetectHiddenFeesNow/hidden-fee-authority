var fs = require('fs');
var s = fs.readFileSync('C:/vhub/scripts/page_generator_v3.js', 'utf8');

// 1. Add category detection + CTA map loading
// Insert right before 'var bodyHtml = renderBody(body);'
var ctaInject = '\n// --- 3-CTA SYSTEM ---\n' +
'var category = "default"; var cl = title.toLowerCase();\n' +
'if(cl.indexOf("bank")>=0||cl.indexOf("overdraft")>=0)category="banking";\n' +
'else if(cl.indexOf("insurance")>=0)category="insurance";\n' +
'else if(cl.indexOf("telecom")>=0||cl.indexOf("phone")>=0||cl.indexOf("internet")>=0)category="telecom";\n' +
'else if(cl.indexOf("auto")>=0||cl.indexOf("dealer")>=0||cl.indexOf("vehicle")>=0)category="automotive";\n' +
'else if(cl.indexOf("medical")>=0||cl.indexOf("health")>=0)category="medical";\n' +
'var cm;try{cm=JSON.parse(fs.readFileSync("C:/vhub/scripts/cta_map.json","utf8"));}catch(e){cm={default:{p:"Upload your document.",b:"Analyze My Document",u:"https://detecthiddenfees.com"}}}\n' +
'var C=cm[category]||cm.default;\n' +
'function mK(h){return\'<div class="cta"><h2>\'+h+\'</h2><p>\'+C.p+\'</p><a href="\'+C.u+\'" class="btn">\'+C.b+\'</a><div class="trust"><span>Private analysis</span><span>No data stored</span><span>Secure upload</span></div></div>\'}\n' +
'var tC=mK("Find Hidden Fees Before They Cost You Money");\n' +
'var mC=mK("Ready To Find Hidden Charges?");\n' +
'var bC=mK("Protect Yourself From Hidden Costs");\n';

s = s.replace('var bodyHtml = renderBody(body);', ctaInject + 'var bodyHtml = renderBody(body);');

// 2. Inject TOP and MIDDLE CTAs into bodyHtml (before warns)
var ctaPlace = '\n// TOP CTA\n' +
'var ei=bodyHtml.indexOf("<h2>Executive Summary</h2>");\n' +
'if(ei>=0){var nh=bodyHtml.indexOf("<h2>",ei+30);if(nh<0)nh=bodyHtml.indexOf("<h3>",ei+30);var ia=nh>0?nh:ei+50;bodyHtml=bodyHtml.slice(0,ia)+"\\n"+tC+"\\n"+bodyHtml.slice(ia)}\n' +
'// MIDDLE CTA\n' +
'var aiP=["<h2>How AI Detects","<h2>How AI Reviews","<h2>How AI Analyzes","<h2>AI Detection","<h2>AI Methodology"];var ai=-1;for(var p=0;p<aiP.length;p++){ai=bodyHtml.indexOf(aiP[p]);if(ai>=0)break}if(ai>=0){var na=bodyHtml.indexOf("<h2>",ai+50);if(na<0)na=bodyHtml.indexOf("<h3>",ai+50);var ma=na>0?na:ai+100;bodyHtml=bodyHtml.slice(0,ma)+"\\n"+mC+"\\n"+bodyHtml.slice(ma)}\n';

s = s.replace('var warns = [];', ctaPlace + 'var warns = [];');

// 3. Replace bottom CTA with bC (dynamic)
var oldCTA = '<div class="cta">\\n<h2>Find Hidden Fees in Your Documents</h2>\\n<p>Upload any contract or billing statement for AI analysis.</p>\\n<a href="https://detecthiddenfees.com" class="btn">Analyze My Document</a>\\n<div class="trust"><span>Private analysis</span><span>No data stored</span><span>Secure upload</span></div>\\n</div>';
s = s.replace(oldCTA, '\'+bC+\'');

// 4. Add CTA stats to output
s = s.replace('console.log("=== OUTPUT WRITTEN ===");',
  'var cc=(html.match(/class="cta"/g)||[]).length;\n' +
  'console.log("CTAs: "+cc+" (TOP/MIDDLE/BOTTOM)");\n' +
  'console.log("Category: "+category);\n' +
  'console.log("Button: "+C.b);\n' +
  'if(cc<3)console.log("ERROR: Missing CTAs");\n' +
  'console.log("=== OUTPUT WRITTEN ===");'
);

fs.writeFileSync('C:/vhub/scripts/page_generator_v3.js', s);
console.log('PATCHED OK');
