#!/usr/bin/env python3
"""Robust batch expansion script v3 — handles all formatting variations."""
import re, json, sys
from pathlib import Path
from datetime import datetime

BASE = Path(".")
REPORT = {
    "timestamp": datetime.now().isoformat(),
    "pages_checked": 0,
    "pages_missing_example": 0,
    "pages_missing_results": 0,
    "pages_missing_faq": 0,
    "pages_updated": 0,
    "pages_skipped_no_faq": 0,
    "pages_errors": [],
    "word_count_before": 0,
    "word_count_after": 0,
}

FAQ_PATTERNS = [
    r'<h[12][^>]*>\s*FAQ\s*</h[12]>',
    r'<h[12][^>]*>\s*Frequently Asked Questions\s*</h[12]>',
    r'<h[12][^>]*>\s*Common Questions\s*</h[12]>',
    r'<h[12][^>]*>\s*Questions\s*</h[12]>',
    r'<h[12][^>]*>\s*Help Center\s*</h[12]>',
]

def find_faq_position(html):
    for pattern in FAQ_PATTERNS:
        match = re.search(pattern, html, re.IGNORECASE)
        if match:
            return match.start(), match.group()
    return -1, ""

def count_words(html):
    text = re.sub(r'<[^>]+>', ' ', html)
    text = re.sub(r'\s+', ' ', text).strip()
    return len(text.split())

def extract_page_topic(dirname):
    name = dirname.replace("ai-", "").replace("-", " ").strip()
    return name.title()

def expand_page(page_dir):
    path = Path(page_dir) / "index.html"
    if not path.exists():
        REPORT["pages_errors"].append(f"{page_dir}: index.html not found")
        return False
    
    c = path.read_text(encoding="utf-8")
    before_wc = count_words(c)
    REPORT["word_count_before"] += before_wc
    
    page_name = extract_page_topic(page_dir.name)
    has_example = bool(re.search(r'Example [Ss]cenario|example scenario|Example:', c))
    has_results = bool(re.search(r'Results Preview|Results Preview', c, re.IGNORECASE))
    
    faq_pos, faq_marker = find_faq_position(c)
    has_faq = faq_pos > 0
    
    changes = []
    
    if not has_faq:
        REPORT["pages_missing_faq"] += 1
        REPORT["pages_skipped_no_faq"] += 1
        REPORT["pages_errors"].append(f"{page_dir}: no FAQ section found")
        return False
    
    if not has_example:
        example_block = f'<h2>Example Scenario</h2>\n<p><strong>Example scenario:</strong> A consumer reviewing {page_name.lower()} terms discovers restrictions not clearly disclosed upfront. After uploading the document for AI analysis, the system identifies specific clauses that may affect the expected value of the service.</p>\n'
        c = c[:faq_pos] + example_block + "\n" + c[faq_pos:]
        changes.append("example")
        faq_pos += len(example_block) + 1
        REPORT["pages_missing_example"] += 1
    
    if not has_results:
        results_block = '<h2>Results Preview</h2>\n<p>After analysis you receive an AI Analysis Report including: Summary Report with key findings; Hidden Fee Detection identifying problem clauses; Cost Impact Analysis showing potential financial impact; Risk Score assessing overall terms; and Recommendations for next steps.</p>\n'
        # Insert before faq_marker (which may have shifted)
        for pattern in FAQ_PATTERNS:
            match = re.search(pattern, c, re.IGNORECASE)
            if match:
                c = c[:match.start()] + results_block + "\n" + c[match.start():]
                changes.append("results")
                break
        REPORT["pages_missing_results"] += 1
    
    if changes:
        path.write_text(c, encoding="utf-8")
        REPORT["pages_updated"] += 1
    
    after_wc = count_words(c)
    REPORT["word_count_after"] += after_wc
    REPORT["pages_checked"] += 1
    return True

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else None
    
    for d in sorted(BASE.glob("ai-*")):
        if not d.is_dir(): continue
        if target and d.name != target: continue
        expand_page(d)
    
    # Save report
    report_path = BASE / "scripts" / "expansion_report.json"
    REPORT["pages_remaining"] = REPORT["pages_checked"] - REPORT["pages_updated"]
    json.dump(REPORT, open(report_path, "w"), indent=2)
    
    print(f"Checked: {REPORT['pages_checked']}")
    print(f"Updated: {REPORT['pages_updated']}")
    print(f"Skipped (no FAQ): {REPORT['pages_skipped_no_faq']}")
    print(f"Errors: {len(REPORT['pages_errors'])}")
    print(f"Words before: {REPORT['word_count_before']}")
    print(f"Words after: {REPORT['word_count_after']}")
    print(f"Report: {report_path}")
    
    if REPORT['pages_errors']:
        print("\nFirst 5 errors:")
        for e in REPORT['pages_errors'][:5]:
            print(f"  {e}")
