# CTA and Internal Link Audit — Banking Cluster

Date: 2026-07-25
Auditor: Sentinel QA

## CTA Placement
Each page currently has 1 CTA block (bottom only). All pages need 3 CTAs.

| Page | Top CTA | Mid CTA | Bottom CTA |
|------|---------|---------|------------|
| Overdraft | MISSING | MISSING | Present (1) |
| ATM | MISSING | MISSING | Present (1) |
| Checking | MISSING | MISSING | Present (1) |
| Wire Transfer | MISSING | MISSING | Present (1) |
| Maintenance | MISSING | MISSING | Present (1) |

## CTA Text (current)
All pages: "Find Hidden Fees in Your Documents - Upload any contract or billing statement for AI analysis. Analyze My Document"

## Internal Links
Related Resources section is plain text, not clickable links. Each page lists 6 resources but none are hyperlinks.

## Fix Required
1. Add TOP CTA after Executive Summary section
2. Add MIDDLE CTA after AI Detection section  
3. Convert Related Resources to clickable anchor tags
4. CTA text should be conversion-focused with industry-specific wording

## Status: FAILED
Action: Update page_generator.js to generate 3 CTAs and clickable internal links.
