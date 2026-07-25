#!/usr/bin/env python3
"""Page expansion runner for hidden-fee-authority on Windows.
Usage: python expand_page.py <page-dir> [--full]

Reads the page, expands content, writes back.
"""
import re, sys, os
from pathlib import Path

def expand_page(page_dir, full=False):
    path = Path(page_dir) / "index.html"
    if not path.exists():
        print(f"NOT FOUND: {path}")
        return False
    
    c = path.read_text(encoding="utf-8")
    page_name = page_dir.name.replace("ai-", "").replace("-", " ").title()
    changes = []
    
    # Ensure H1 matches content
    h1_match = re.search(r"<h1>([^<]+)", c)
    if h1_match and "Checker" not in h1_match.group(1) and "Checker" not in page_dir.name:
        new_h1 = f"AI {page_name} Checker"
        if new_h1 != h1_match.group(1):
            c = c.replace(h1_match.group(1), new_h1)
            changes.append("h1")
    
    # Ensure CTA matches page intent
    if 'class="btn">Analyze' in c:
        topic = page_name.lower()
        if "education" in topic or "tuition" in topic:
            c = c.replace('class="btn">Analyze', 'class="btn">Analyze My Tuition Bill')
        elif "travel" in topic:
            c = c.replace('class="btn">Analyze', 'class="btn">Analyze My Policy')
        elif "baby" in topic or "registry" in topic:
            c = c.replace('class="btn">Analyze', 'class="btn">Check My Registry')
        else:
            c = c.replace('class="btn">Analyze', 'class="btn">Review My Document')
        changes.append("cta")
    
    # Add Example Scenario if missing
    if "Example scenario" not in c and "<h2>FAQ</h2>" in c:
        ex = f'<h2>Example Scenario</h2><p><strong>Example scenario:</strong> A consumer reviewing {page_name.lower()} terms discovers that certain restrictions were not clearly disclosed upfront. After uploading the document for AI analysis, the system identifies specific clauses that may affect the expected value of the service.</p>\n'
        c = c.replace("<h2>FAQ</h2>", ex + "<h2>FAQ</h2>")
        changes.append("example")
    
    # Add Results Preview if missing
    if "Results Preview" not in c and "<h2>FAQ</h2>" in c:
        res = '<h2>Results Preview</h2><p>After analysis you receive an AI Analysis Report including: Summary Report with key findings; Restriction Detection identifying problem clauses; Cost Impact Analysis showing potential financial impact; Risk Score assessing overall terms; and Recommendations.</p>\n'
        c = c.replace("<h2>FAQ</h2>", res + "<h2>FAQ</h2>")
        changes.append("results")
    
    # Write back
    path.write_text(c, encoding="utf-8")
    
    # Word count
    t = re.sub(r"<[^>]+>", " ", c)
    t = re.sub(r"\s+", " ", t).strip()
    words = len(t.split())
    print(f"  {page_dir.name}: {words}w {' '.join(changes)}")
    return True

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python expand_page.py <page-dir>")
        sys.exit(1)
    expand_page(Path(sys.argv[1]))
