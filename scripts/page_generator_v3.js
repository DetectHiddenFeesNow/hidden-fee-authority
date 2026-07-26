/*
 * Page Generator v3.0.0 â€” Research-Grade Authority Report Generator
 * 
 * Supports: Expanded Industry Analysis, Real-World Case Studies, 
 * Fee Impact Tables, Warning Signs, Methodology/References, 
 * AEO structure, optimized FAQ (8-12 questions)
 * 
 * Usage: node scripts/page_generator_v3.js content/<file>.md
 */

var fs = require("fs");
var md = process.argv[2];

if (!md || md === "--help") {
  console.log("Page Generator v3.0.0");
  console.log("Usage: node scripts/page_generator_v3.js <markdown_file>");
  console.log("");
  console.log("Features:");
  console.log("  - Expanded industry analysis with sub-sectors");
  console.log("  - Real-world case study tables");
  console.log("  - Fee impact comparison tables");
  console.log("  - Warning signs sections");
  console.log("  - Methodology & References");
  console.log("  - AEO-optimized structure");
  console.log("  - FAQ schema (8-12 questions)");
  console.log("  - Article schema with all dates");
  if (md === "--test") {
    console.log("Test mode: creating sample output...");
    process.exit(0);
  }
  process.exit(0);
}

// --- Read Markdown ---
var content = fs.readFileSync(md, "utf8");
var lines = content.split("\n");

// --- Parse ---
var title = "";
var desc = "";
var body = [];
var faqItems = [];
var state = "header";
var catMeta = "";

lines.forEach(function(line) {
  var t = line.trim();
  if (state === "header" && t === "") return;
  if (state === "header" && t.startsWith("# ") && !title) {
    title = t.slice(2);
    return;
  }
  if (state === "header" && t.startsWith("desc:")) {
    desc = t.slice(5).trim();
    return;
  }
  if (state === "header" && t.startsWith("category:")) {
    catMeta = t.slice(9).trim().toLowerCase();
    return;
  }
  if (t === "faq:") {
    state = "faq";
    return;
  }
  if (state === "faq") {
    if (t.startsWith("## ") || t.startsWith("# ")) {
      state = "body";
      body.push(line);
      return;
    }
    if (t.startsWith("- ")) {
      faqItems.push(t.slice(2));
      return;
    }
  }
  if (state === "header" && title && desc) {
    state = "body";
  }
  if (state === "body") {
    body.push(line);
  }
});

// --- Determine target slug ---
var rawSlug = title.toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");

var knownSlugs = {};

var slugList = [
  "the-hidden-auto-dealer-fees-report-2026",
  "the-hidden-banking-fees-report-2026",
  "the-hidden-contractor-fees-report-2026",
  "the-hidden-fees-consumer-report-2026",
  "the-hidden-healthcare-costs-report-2026",
  "the-hidden-insurance-fees-report-2026",
  "the-hidden-legal-fees-report-2026",
  "the-hidden-rental-fees-report-2026",
  "the-hidden-subscription-fees-report-2026",
  "the-hidden-telecom-fees-report-2026",
  "the-hidden-travel-fees-report-2026",
  "consumer-fee-protection-guide-2026",
  "hidden-fee-statistics"
];

slugList.forEach(function(s) { knownSlugs[s] = 1; });

var targetSlug = rawSlug;
for (var k in knownSlugs) {
  var shortKey = k.replace("the-hidden-", "").replace("-report-2026", "").replace("-fees-report-2026", "");
  if (rawSlug.indexOf(shortKey) >= 0 || rawSlug === k) {
    targetSlug = k;
    break;
  }
}

// --- Create output directory ---
var outputDir = "/tmp/hidden-fee-authority/" + targetSlug;
try { fs.mkdirSync(outputDir, { recursive: true }); } catch(e) {}

// --- Section detection ---
function hasSection(lines, name) {
  var s = "## " + name;
  for (var i = 0; i < lines.length; i++) {
    var trimmed = lines[i].trim();
    if (trimmed === s) return true;
    if (trimmed.indexOf(s) === 0) return true;
  }
  return false;
}

var hasRealWorld     = hasSection(body, "Real-World Example") || hasSection(body, "Real World Case Study");
var hasFeeTable      = hasSection(body, "Fee Impact Table") || hasSection(body, "Cost Impact Table") || hasSection(body, "Fee Comparison Table");
var hasWarning       = hasSection(body, "Hidden Fee Warning Signs") || hasSection(body, "Warning Signs");
var hasMethodology   = hasSection(body, "Methodology") || hasSection(body, "Research Approach") || hasSection(body, "Analysis Framework") || hasSection(body, "Research Method");
var hasReferences    = hasSection(body, "References") || hasSection(body, "Sources");

// --- Render HTML from markdown body ---
function renderBody(lines) {
  var html = "";
  var tableRows = [];
  var inTable = false;

  for (var i = 0; i < lines.length; i++) {
    var raw = lines[i];
    var t = raw.trim();

    if (t.indexOf("## ") === 0) {
      if (inTable) { html += buildTable(tableRows); tableRows = []; inTable = false; }
      html += "\n<h2>" + t.slice(3) + "</h2>\n";
      continue;
    }
    if (t.indexOf("### ") === 0) {
      if (inTable) { html += buildTable(tableRows); tableRows = []; inTable = false; }
      html += "\n<h3>" + t.slice(4) + "</h3>\n";
      continue;
    }
    if (t.indexOf("#### ") === 0) {
      if (inTable) { html += buildTable(tableRows); tableRows = []; inTable = false; }
      html += "\n<h4>" + t.slice(5) + "</h4>\n";
      continue;
    }

    if (t.charAt(0) === "|" && t.charAt(t.length - 1) === "|") {
      if (t.indexOf("---") >= 0) continue;
      tableRows.push(t);
      inTable = true;
      continue;
    } else {
      if (inTable) { html += buildTable(tableRows); tableRows = []; inTable = false; }
    }

    if (t === "---") {
      html += "<hr>\n";
      continue;
    }

    if (t.indexOf("- **") === 0 && t.indexOf(":**") > 0) {
      var ci = t.indexOf(":**");
      var bold = t.slice(4, ci);
      var rest = t.slice(ci + 3);
      html += "<li><strong>" + bold + ":</strong>" + rest + "</li>\n";
      continue;
    }

    if (t.indexOf("- ") === 0) {
      html += "<li>" + t.slice(2) + "</li>\n";
      continue;
    }

    if (t) {
      html += "<p>" + t + "</p>\n";
    }
  }

  if (inTable) html += buildTable(tableRows);
  return html;
}

function buildTable(rows) {
  if (!rows.length) return "";
  var h = "<table>\n";
  rows.forEach(function(row, idx) {
    var cells = row.split("|").filter(function(c) { return c.trim(); });
    var tag = idx === 0 ? "th" : "td";
    h += "<tr>";
    cells.forEach(function(c) { h += "<" + tag + ">" + c.trim() + "</" + tag + ">"; });
    h += "</tr>\n";
  });
  h += "</table>\n";
  return h;
}


// --- 3-CTA SYSTEM ---
var catMeta = catMeta || "default";
var cm; try { cm = JSON.parse(fs.readFileSync("/tmp/hidden-fee-authority/scripts/cta_map.json", "utf8")); } catch(e) { cm = { default: { paragraph: "Upload.", button: "Analyze", url: "https://detecthiddenfees.com" } }; }
var C = cm[catMeta] || cm.default;
function uniqueCTA(title) {var t = title.replace(/^(the |a |an )/i, "").replace(/d{4}$/, "").trim();var words = t.split(/s+/).filter(function(w){return w.length>3}).slice(0,4);var kw = words.length > 0 ? words.join(" ") : "your document";var prefixes = ["Upload your " + kw + " and let AI scan for ","Before signing, scan your " + kw + " to uncover ","Don't overpay. Analyze your " + kw + " now to detect ","AI-powered review of your " + kw + " can reveal ","Stop overpaying. Let AI examine your " + kw + " for ","Upload your " + kw + " documents and detect ","Your " + kw + " may contain hidden charges. AI can find ","Run an AI check on your " + kw + " to identify ","Hidden fees lurk in " + kw + ". AI analysis finds ","Take control of your " + kw + " costs. AI detects "];var suffixes = ["overcharges, unexpected fees, and billing errors.","hidden costs, fine print traps, and unnecessary charges.","unexpected fees, duplicate billing, and hidden surcharges.","hidden add-ons, fee creep, and pricing discrepancies.","overlooked charges, recurring fees, and policy exclusions.","buried costs, misleading fees, and unexpected surcharges.","hidden expenses, billing mistakes, and undisclosed charges.","unexpected markups, recurring deductions, and fee traps.","concealed charges, service fees, and billing irregularities.","surprise fees, auto-renewals, and hidden subscription costs."];var idx = (title.length + kw.length) % prefixes.length;return prefixes[idx] + suffixes[idx];}function mK(h, isBottom) {var p = isBottom ? uniqueCTA(title) : (uniqueCTA(title) + " Upload now for a free analysis.");return '<div class="cta"><h2>' + h + '</h2><p>' + p + '</p><a href="' + C.url + '" class="btn">' + C.button + '</a><div class="trust"><span>Private analysis</span><span>No data stored</span><span>Secure upload</span></div></div>'; }
var tC = mK("Find Hidden Fees Before They Cost You Money", false);
var mC = mK("Ready To Find Hidden Charges?", false);
var bC = mK("Protect Yourself From Hidden Costs", true);

var bodyHtml = renderBody(body);

// --- Warnings ---

// TOP CTA after first H2 (usually Executive Summary)
var ei = bodyHtml.indexOf("<h2>Executive Summary</h2>");
if (ei >= 0) {
  var nh = bodyHtml.indexOf("<h2>", ei + 30);
  if (nh < 0) nh = ei + 200;
  bodyHtml = bodyHtml.slice(0, nh) + "\n" + tC + "\n" + bodyHtml.slice(nh);
}
// MIDDLE CTA after AI Detection (or after second section if no AI section)
var aiP = ["<h2>How AI Detects", "<h2>How AI Reviews", "<h2>How AI Analyzes", "<h2>AI Detection", "<h2>AI Methodology"];
var ai = -1;
for (var p = 0; p < aiP.length; p++) { ai = bodyHtml.indexOf(aiP[p]); if (ai >= 0) break; }
if (ai >= 0) {
  var na = bodyHtml.indexOf("<h2>", ai + 50);
  if (na < 0) na = ai + 200;
  bodyHtml = bodyHtml.slice(0, na) + "\n" + mC + "\n" + bodyHtml.slice(na);
} else {
  // Fallback: place MID CTA after the second H2 section
  var h2c = 0, h2i = -1;
  for (var i = 0; i < bodyHtml.length; i++) {
    if (bodyHtml.slice(i, i+4) === "<h2>") { h2c++; if (h2c === 2) { h2i = i; break; } }
  }
  if (h2i >= 0) {
    var nxt = bodyHtml.indexOf("<h2>", h2i + 4);
    if (nxt < 0) nxt = h2i + 200;
    bodyHtml = bodyHtml.slice(0, nxt) + "\n" + mC + "\n" + bodyHtml.slice(nxt);
  }
}

var warns = [];
if (!hasRealWorld)     warns.push("Missing: Real-World Example section");
if (!hasFeeTable)      warns.push("Missing: Fee Impact Table");
if (!hasWarning)       warns.push("Missing: Hidden Fee Warning Signs section");
if (!hasMethodology)   warns.push("Missing: Methodology section");
if (!hasReferences)    warns.push("Missing: References section");
if (faqItems.length < 8) warns.push("FAQ has " + faqItems.length + " items (minimum 8)");
if (faqItems.length > 12) warns.push("FAQ has " + faqItems.length + " items (max 12)");

// --- FAQ ---
var faqHtml = "";
var faqSchema = [];

if (faqItems.length) {
  faqHtml = "<h2>Frequently Asked Questions</h2>\n";
  faqItems.slice(0, 12).forEach(function(item) {
    var qi = item.indexOf("?");
    if (qi > 0) {
      var q = item.slice(0, qi + 1);
      var a = item.slice(qi + 1).trim();
      faqHtml += "<p><strong>" + q + "</strong> " + a + "</p>\n";
      faqSchema.push({
        "@type": "Question",
        "name": q,
        "acceptedAnswer": { "@type": "Answer", "text": a }
      });
    }
  });
}

// --- Schema ---
var datePublished = "2026-01-15";
var dateModified = "2026-07-25";

var articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": title,
  "description": desc,
  "datePublished": datePublished,
  "dateModified": dateModified,
  "author": { "@type": "Organization", "name": "DetectHiddenFees Research Team" },
  "publisher": { "@type": "Organization", "name": "DetectHiddenFees.com", "url": "https://detecthiddenfees.com" },
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://hidden-fee-authority.vercel.app/" + targetSlug + "/" }
};

var faqPageSchema = faqSchema.length ? {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqSchema
} : null;

// --- Styles (inline, no external dependency) ---
var STYLE = "body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:800px;margin:0 auto;padding:20px;line-height:1.7;color:#1a1a2e;font-size:16px}h1{color:#0a1628;border-bottom:3px solid #1a237e;padding-bottom:10px;font-size:2em;margin-top:0}h2{color:#0a1628;margin-top:36px;border-bottom:2px solid #e0e0e0;padding-bottom:6px;font-size:1.5em}h3{color:#1a237e;margin-top:28px;font-size:1.25em}h4{color:#333;margin-top:20px;font-size:1.1em}a{color:#1a237e}p{margin:12px 0}li{margin:4px 0}table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}th,td{border:1px solid #ddd;padding:10px 12px;text-align:left}th{background:#0a1628;color:#fff;font-weight:600}tr:nth-child(even){background:#f5f5f5}tr:hover{background:#e8eaf6}.btn{display:inline-block;background:#ffd700;color:#0a1628;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:700;font-size:16px}.cta{background:linear-gradient(135deg,#0a1628,#1a237e);color:#fff;border-radius:12px;padding:40px;text-align:center;margin:40px 0}.cta h2{color:#ffd700;border:none;margin-top:0}.cta p{color:#ccc}.trust{display:flex;flex-wrap:wrap;justify-content:center;gap:15px;padding:10px;font-size:13px;color:#777;max-width:500px;margin:10px auto}.trust span::before{content:\"\\2713 \";color:#27ae60;font-weight:bold}article{min-height:60vh}hr{border:none;border-top:1px solid #e0e0e0;margin:24px 0}code{background:#f5f5f5;padding:2px 6px;border-radius:3px;font-size:0.9em}blockquote{border-left:4px solid #1a237e;margin:16px 0;padding:8px 16px;background:#f8f9fa}";

// --- Escape quotes for HTML attributes ---
var Q = String.fromCharCode(38, 113, 117, 111, 116, 59); // "
var safeTitle = title.replace(/\x22/g, Q);
var safeDesc = desc.replace(/\x22/g, Q);
var siteUrl = "https://hidden-fee-authority.vercel.app/" + targetSlug + "/";

// --- Build HTML ---
var html = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n";
html += "<meta charset=\"UTF-8\">\n";
html += "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1.0\">\n";
html += "<title>" + safeTitle + " | Hidden Fee Authority</title>\n";
html += "<meta name=\"description\" content=\"" + safeDesc + "\">\n";
html += "<meta property=\"og:title\" content=\"" + safeTitle + " | Hidden Fee Authority\">\n";
html += "<meta property=\"og:description\" content=\"" + safeDesc + "\">\n";
html += "<meta property=\"og:url\" content=\"" + siteUrl + "\">\n";
html += "<meta property=\"og:type\" content=\"article\">\n";
html += "<meta property=\"og:site_name\" content=\"Hidden Fee Authority\">\n";
html += "<meta name=\"twitter:card\" content=\"summary_large_image\">\n";
html += "<meta name=\"twitter:title\" content=\"" + safeTitle + " | Hidden Fee Authority\">\n";
html += "<meta name=\"twitter:description\" content=\"" + safeDesc + "\">\n";
html += "<link rel=\"canonical\" href=\"" + siteUrl + "\">\n";
html += "<script type=\"application/ld+json\">" + JSON.stringify(articleSchema) + "</script>\n";
if (faqPageSchema) {
  html += "<script type=\"application/ld+json\">" + JSON.stringify(faqPageSchema) + "</script>\n";
}
html += "<style>" + STYLE + "</style>\n";
html += "</head>\n<body>\n";
html += "<article>\n";
html += "<h1>" + safeTitle + "</h1>\n";
html += bodyHtml;
html += faqHtml;
html += "</article>\n";
html += "<div class=\"cta\">\n";
html += "<h2>Find Hidden Fees in Your Documents</h2>\n";
html += "<p>Upload any contract or billing statement for AI analysis.</p>\n";
html += "<a href=\"https://detecthiddenfees.com\" class=\"btn\">Analyze My Document</a>\n";
html += "<div class=\"trust\"><span>Private analysis</span><span>No data stored</span><span>Secure upload</span></div>\n";
html += "</div>\n";
html += "</body>\n</html>";

// --- Write ---
var outPath = outputDir + "/index.html";
fs.writeFileSync(outPath, html);

// --- Stats ---
var wordCount = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(function(w) { return w; }).length;

console.log("=== GENERATOR V3 RESULTS ===");
console.log("Title: " + title);
console.log("Words: " + wordCount);
console.log("FAQ items: " + faqItems.length);
console.log("Slug: " + targetSlug);
console.log("Path: " + outPath);

if (!title) console.log("ERROR: No title");
if (!desc) console.log("ERROR: No description");
if (html.indexOf("detecthiddenfees.com") < 0) console.log("ERROR: No DHF link");
if (html.indexOf("ld+json") < 0) console.log("ERROR: No schema");
if (faqItems.length && html.indexOf("FAQPage") < 0) console.log("ERROR: FAQ items but no FAQPage schema");
if (html.indexOf("btn") < 0) console.log("ERROR: No CTA");
if (html.indexOf("trust") < 0) console.log("ERROR: No trust signals");
if (html.indexOf("datePublished") < 0) console.log("ERROR: No datePublished");

warns.forEach(function(w) { console.log("WARNING: " + w); });

var cc = (html.match(/class="cta"/g) || []).length;
console.log("CTAs: " + cc + " (TOP/MIDDLE/BOTTOM)");
console.log("Category: " + catMeta);
console.log("Button: " + C.button);
if (cc < 3) console.log("ERROR: Missing CTAs");
console.log("=== OUTPUT WRITTEN ===");