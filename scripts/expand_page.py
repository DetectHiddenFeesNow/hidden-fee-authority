#!/usr/bin/env python3
"""Page expansion runner - v2 with better FAQ detection."""
import re, sys
from pathlib import Path

def expand_page(page_dir):
    path = Path(page_dir) / "index.html"
    if not path.exists():
        return False
    
    c = path.read_text(encoding="utf-8")
    page_name = page_dir.name.replace("ai-", "").replace("-", " ").title()
    changes = []
    
    # Find FAQ anchor - try multiple patterns
    faq_markers = ['<h2>FAQ</h2>', '<h2>Frequently Asked Questions</h2>', '<h2>Faq</h2>']
    faq_pos = -1
    faq_marker = ""
    for m in faq_markers:
        pos = c.find(m)
        if pos > 0:
            faq_pos = pos
            faq_marker = m
            break
    
    if faq_pos < 0:
        return False
    
    # Add Example Scenario if missing
    if "Example scenario" not in c and "Example Scenario" not in c:
        ex = f'<h2>Example Scenario</h2><p><strong>Example scenario:</strong> A consumer reviewing {page_name.lower()} terms discovers that certain restrictions were not clearly disclosed upfront. After uploading the document for AI analysis, the system identifies specific clauses that may affect the expected value of the service.</p>\n'
        c = c[:faq_pos] + ex + "\n" + c[faq_pos:]
        changes.append("example")
        faq_pos += len(ex) + 1
    
    # Add Results Preview if missing
    if "Results Preview" not in c:
        res = '<h2>Results Preview</h2><p>After analysis you receive an AI Analysis Report including: Summary Report with key findings; Restriction Detection identifying problem clauses; Cost Impact Analysis showing potential financial impact; Risk Score assessing overall terms; and Recommendations for next steps.</p>\n'
        insert_pos = c.find(faq_marker)
        if insert_pos > 0:
            c = c[:insert_pos] + res + "\n" + c[insert_pos:]
            changes.append("results")
    
    if changes:
        path.write_text(c, encoding="utf-8")
    
    return True

if __name__ == "__main__":
    if len(sys.argv) < 2:
        base = Path(".")
        for d in sorted(base.glob("ai-*")):
            if d.is_dir():
                expand_page(d)
        print("Batch complete")
    else:
        expand_page(Path(sys.argv[1]))
