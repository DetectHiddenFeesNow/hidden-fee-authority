#!/usr/bin/env python3
"""Batch expansion runner v3.1 - fixed path."""
import re, json, sys
from pathlib import Path

BASE = Path("C:/vhub") if sys.platform == "win32" else Path(".")
REPORT = {"pages_checked": 0, "pages_updated": 0, "pages_errors": []}

FAQ_PATTERNS = [
    r'<h[12][^>]*>\s*FAQ\s*</h[12]>',
    r'<h[12][^>]*>\s*Frequently Asked Questions\s*</h[12]>',
]

def find_faq(html):
    for pattern in FAQ_PATTERNS:
        m = re.search(pattern, html, re.IGNORECASE)
        if m: return m.start(), m.group()
    return -1, ""

def count_w(html):
    t = re.sub(r'<[^>]+>', ' ', html); t = re.sub(r'\s+', ' ', t).strip()
    return len(t.split())

def expand(d):
    p = BASE / d / "index.html"
    if not p.exists(): return
    c = p.read_text(encoding="utf-8")
    wb = count_w(c)
    has_ex = 'Example scenario' in c
    has_res = 'Results Preview' in c
    faq_pos, _ = find_faq(c)
    if faq_pos < 0:
        REPORT["pages_errors"].append(f"{d}: no FAQ"); return
    ch = []
    if not has_ex:
        name = d.replace("ai-","").replace("-"," ").title()
        ex = f'<h2>Example Scenario</h2><p><strong>Example scenario:</strong> A consumer reviewing {name.lower()} terms discovers restrictions not clearly disclosed. After AI analysis, the system identifies clauses that may affect the expected service value.</p>\n'
        c = c[:faq_pos] + ex + "\n" + c[faq_pos:]; ch.append("ex")
        faq_pos += len(ex)+1
    if not has_res:
        res = '<h2>Results Preview</h2><p>After analysis you receive an AI Analysis Report including: Summary Report with key findings; Hidden Fee Detection identifying problem clauses; Cost Impact Analysis showing potential financial impact; Risk Score; and Recommendations.</p>\n'
        c = c[:faq_pos] + res + "\n" + c[faq_pos:]; ch.append("res")
    if ch:
        p.write_text(c, encoding="utf-8"); REPORT["pages_updated"] += 1
        print(f"  {d}: {wb}->{count_w(c)}w {' '.join(ch)}")
    REPORT["pages_checked"] += 1

if __name__ == "__main__":
    for d in sorted(BASE.glob("ai-*")):
        if d.is_dir(): expand(d.name)
    print(f"\nChecked: {REPORT['pages_checked']} | Updated: {REPORT['pages_updated']} | Errors: {len(REPORT['pages_errors'])}")
    json.dump(REPORT, open(BASE/"scripts/expansion_report.json","w"), indent=2)
