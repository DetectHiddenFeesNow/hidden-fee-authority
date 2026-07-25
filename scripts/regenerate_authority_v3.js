/*
 * Regenerate Authority Assets v3.0.0
 * 
 * Batch regenerates all authority report HTML files
 * using the new v3 generator with all quality upgrades.
 * 
 * Usage: node scripts/regenerate_authority_v3.js
 */

var fs = require("fs");
var path = require("path");
var exec = require("child_process").execSync;

// Authority asset markdown files in content/
var assets = [
  "content/auto-dealer-fees-report-2026.md",
  "content/banking-fees-report-2026.md",
  "content/contractor-fees-report-2026.md",
  "content/consumer-report-2026.md",
  "content/healthcare-costs-2026.md",
  "content/insurance-fees-report-2026.md",
  "content/legal-fees-report-2026.md",
  "content/rental-fees-report-2026.md",
  "content/subscription-report-2026.md",
  "content/telecom-fees-report-2026.md",
  "content/travel-fees-report-2026.md"
];

console.log("============================================");
console.log("  Authority Asset Regeneration v3.0.0");
console.log("  Research-Grade Quality Upgrade");
console.log("============================================");
console.log("");

var results = [];
var totalWords = 0;

assets.forEach(function(mdFile) {
  var fullPath = "C:/vhub/" + mdFile;
  
  if (!fs.existsSync(fullPath)) {
    console.log("SKIP  " + mdFile + " (not found)");
    return;
  }
  
  try {
    console.log("GEN   " + mdFile);
    var output = exec("node C:/vhub/scripts/page_generator_v3.js " + fullPath, { timeout: 10000 });
    var text = output.toString();
    
    // Parse word count
    var wcMatch = text.match(/Words: (\d+)/);
    var words = wcMatch ? parseInt(wcMatch[1]) : 0;
    totalWords += words;
    
    // Parse warnings
    var warns = text.split("\n").filter(function(line) {
      return line.indexOf("WARNING:") >= 0 || line.indexOf("ERROR:") >= 0;
    });
    
    results.push({
      file: mdFile,
      words: words,
      warnings: warns
    });
    
    console.log(text.split("\n").filter(function(l) {
      return l.indexOf("=== ") === 0 || l.indexOf("WARNING:") === 0 || l.indexOf("ERROR:") === 0;
    }).join("\n"));
    console.log("");
  } catch(e) {
    console.log("FAIL  " + mdFile + ": " + e.message);
    results.push({ file: mdFile, words: 0, warnings: ["FAILED: " + e.message] });
  }
});

// --- Summary ---
console.log("============================================");
console.log("  REGENERATION SUMMARY");
console.log("============================================");

var passed = 0;
var needsWork = 0;

results.forEach(function(r) {
  var hasRequired = r.warnings.filter(function(w) {
    return w.indexOf("Missing:") >= 0;
  });
  
  console.log(r.file + " — " + r.words + " words");
  
  if (r.warnings.length > 0) {
    r.warnings.forEach(function(w) { console.log("  " + w); });
  }
  
  if (hasRequired.length > 0 || r.words < 1000) {
    needsWork++;
  } else {
    passed++;
  }
});

console.log("");
console.log("Total assets: " + results.length);
console.log("Passed: " + passed);
console.log("Needs work: " + needsWork);
console.log("Total words generated: " + totalWords);
console.log("Avg words per asset: " + Math.round(totalWords / results.length));
console.log("");
console.log("Template: content/templates/authority_asset_v2.md");
console.log("Generator: scripts/page_generator_v3.js");
console.log("Style: scripts/v3_style.css");
console.log("");

if (needsWork > 0) {
  console.log("ACTION REQUIRED: Update the following markdown files to add missing sections:");
  results.forEach(function(r) {
    var hasRequired = r.warnings.filter(function(w) {
      return w.indexOf("Missing:") >= 0;
    });
    if (hasRequired.length > 0) {
      console.log("  - " + r.file);
      hasRequired.forEach(function(w) { console.log("      " + w); });
    }
  });
}

console.log("\nDone.");