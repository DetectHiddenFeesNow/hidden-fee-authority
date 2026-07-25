#!/usr/bin/env python3
import os, re, json
BASE = "C:/vhub"

# Read existing generator
with open(f"{BASE}/scripts/page_generator.js") as f:
    c = f.read()

# Add FAQ parsing after the body state
faq_parser = 'if(t.startsWith("faq:")){state="faq";return}if(state==="faq"){if(t.startsWith("- ")){faqItems.push(t.substring(2))}else{state="body"}}'
c = c.replace('if(state==="body"&&t.length>0){body.push(t)}', faq_parser + '\nif(state==="body"&&t.length>0){body.push(t)}')

# Add FAQ items variable
c = c.replace('var faqItems=[]', 'var faqItems=[]')

# Update the template with FAQ and dates
old_template = c.find('var today')
if old_template > 0:
    c = c[:old_template] + '''
var today="2026-07-24"
''' + c[old_template:]

# Write back
with open(f"{BASE}/scripts/page_generator.js", "w") as f:
    f.write(c)
print("Patched")
