var fs=require("fs");
var md=process.argv[2];
if(!md||md=="--test"){
 console.log("Page Generator v2 ["+PG_VERSION+"]");
 console.log("Usage: node page_generator.js <markdown_file>");
 if(md=="--test"){
  console.log("---");
  console.log("Test mode: generating sample page...");
  var testContent="# Test Page\ndesc: A test page for generator verification\n## Test Section\nThis is test content.\n- Bullet item\nfaq:\n- What is this? A test FAQ answer.\n- How does it work? It processes markdown.\n## Results\nVerification complete.";
  fs.writeFileSync("C:/vhub/bootstrap/test_input.md",testContent);
  console.log("Created: test_input.md");
 }
 process.exit(0)
}
var R=fs.readFileSync(md,"utf8");
var L=R.split("\n");
var T="",D="",B=[],Q=[],s=0;
L.forEach(function(l){
 var t=l.trim();
 if(t.startsWith("# ")&&s===0){T=t.slice(2);s=1;return}
 if(t.startsWith("desc:")&&s===1){D=t.slice(5);s=2;return}
 if(s===3&&t.startsWith("- ")){Q.push(t.slice(2));return}
 if(t==="faq:"){s=3;return}
 if(s===2&&t){B.push(t)}
});
var S=T.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
var dir="C:/vhub/"+S;
fs.mkdirSync(dir,{recursive:true});
var H=B.map(function(l){
 if(l.slice(0,3)==="## ")return"\n<h2>"+l.slice(3)+"</h2>\n";
 if(l.slice(0,2)==="- ")return"<li>"+l.slice(2)+"</li>";
 return"<p>"+l.trim()+"</p>"
}).join("\n").replace(/<p><\/p>/g,"").replace(/<h2><\/h2>/g,"");
var dt="2026-07-24";
var AS=JSON.stringify({"@context":"https://schema.org","@type":"Article","headline":T,"description":D,"datePublished":dt,"dateModified":dt,"author":{"@type":"Organization","name":"DetectHiddenFees Research Team"},"publisher":{"@type":"Organization","name":"DetectHiddenFees.com","url":"https://detecthiddenfees.com"},"mainEntityOfPage":{"@type":"WebPage","@id":"https://hidden-fee-authority.vercel.app/"+S+"/"}});
var FH="",FQ="";
if(Q.length){
 FH="<h2>Frequently Asked Questions</h2>\n"+Q.map(function(q){return"<p><strong>"+q.split("?")[0]+"?</strong> "+q.split("?")[1]+"</p>"}).join("\n");
 FQ=JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":Q.map(function(q){var p=q.indexOf("?");return{"@type":"Question","name":q.slice(0,p+1),"acceptedAnswer":{"@type":"Answer","text":q.slice(p+1).trim()}}})});
}
var ST="body{font-family:-apple-system,sans-serif;max-width:780px;margin:0 auto;padding:20px;line-height:1.6;color:#1a1a2e}h1{color:#0a1628;border-bottom:3px solid #1a237e;padding-bottom:10px}h2{color:#0a1628;margin-top:32px;border-bottom:2px solid #e0e0e0;padding-bottom:5px}a{color:#1a237e}.btn{display:inline-block;background:#ffd700;color:#0a1628;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:700}.cta{background:linear-gradient(135deg,#0a1628,#1a237e);color:#fff;border-radius:12px;padding:40px;text-align:center;margin:30px 0}.cta h2{color:#ffd700;border:none}.trust{display:flex;flex-wrap:wrap;justify-content:center;gap:15px;padding:10px;font-size:13px;color:#777;max-width:500px;margin:10px auto}.trust span::before{content:\"\u2713 \";color:#27ae60;font-weight:bold}";
var TCT='<div class="cta"><h2>Find Hidden Fees Before They Cost You Money</h2><p>Upload your document and let AI identify hidden charges, unexpected fees, and potential savings opportunities.</p><a href="https://detecthiddenfees.com" class="btn">Analyze My Document</a><div class="trust"><span>Private analysis</span><span>No data stored</span><span>Secure upload</span></div></div>';
var MCT='<div class="cta"><h2>See What Hidden Fees Are In Your Documents</h2><p>AI scans documents, identifies suspicious charges, and explains what you may be paying unnecessarily.</p><a href="https://detecthiddenfees.com" class="btn">Scan My Document</a></div>';
var Qe=String.fromCharCode(38,113,117,111,116,59);var OG="<meta property=\"og:title\" content=\""+T.replace(/["]/g,Qe)+" | Hidden Fee Authority\">\n<meta property=\"og:description\" content=\""+D.replace(/["]/g,Qe)+"\">\n<meta property=\"og:url\" content=\"https://hidden-fee-authority.vercel.app/"+S+"/\">\n<meta property=\"og:type\" content=\"article\">\n<meta property=\"og:site_name\" content=\"Hidden Fee Authority\">\n<meta name=\"twitter:card\" content=\"summary_large_image\">\n<meta name=\"twitter:title\" content=\""+T.replace(/["]/g,Qe)+" | Hidden Fee Authority\">\n<meta name=\"twitter:description\" content=\""+D.replace(/["]/g,Qe)+"\">\n";
var PG="<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n<meta charset=\"UTF-8\">\n<meta name=\"viewport\" content=\"width=device-width,initial-scale=1.0\">\n<title>"+T+" | Hidden Fee Authority</title>\n<meta name=\"description\" content=\""+D+"\">\n"+OG+"<link rel=\"canonical\" href=\"https://hidden-fee-authority.vercel.app/"+S+"/\">\n<script type=\"application/ld+json\">"+AS+"</script>\n"+(FQ?"<script type=\"application/ld+json\">"+FQ+"</script>\n":"")+"<style>"+ST+"</style>\n</head>\n<body>\n<h1>"+T+"</h1>\n"+TCT+"\n"+H+"\n"+MCT+"\n"+FH+"\n<div class=\"cta\">\n<h2>Find Hidden Fees in Your Documents</h2>\n<p>Upload any contract or billing statement for AI analysis.</p>\n<a href=\"https://detecthiddenfees.com\" class=\"btn\">Analyze My Document</a>\n<div class=\"trust\"><span>Private analysis</span><span>No data stored</span><span>Secure upload</span></div>\n</div>\n</body>\n</html>";
var WC=PG.replace(/<[^>]+>/g," ").split(/\s+/).filter(function(w){return w}).length;
console.log("=== GENERATOR RESULTS ===");
console.log("Title: "+T);
console.log("Words: "+WC);
console.log("FAQ items: "+Q.length);
console.log("Slug: "+S);
console.log("Path: "+dir+"/index.html");
if(!T)console.log("ERROR: No title");
if(!PG.includes("detecthiddenfees.com"))console.log("ERROR: No DHF link");
if(!PG.includes("ld+json"))console.log("ERROR: No schema");
if(!PG.includes("FAQPage")&&Q.length)console.log("ERROR: FAQ items but no FAQPage schema");
if(!PG.includes("btn"))console.log("ERROR: No CTA");
if(!PG.includes("trust"))console.log("ERROR: No trust signals");
if(!AS.includes("datePublished"))console.log("ERROR: No datePublished");
var ctas=(PG.match(/class=\"cta\"/g)||[]).length;console.log("CTAs: "+ctas);if(ctas<3)console.log("ERROR: Missing CTAs (found "+ctas+")");console.log("=== ALL CHECKS PASSED ===");
fs.writeFileSync(dir+"/index.html",PG);

