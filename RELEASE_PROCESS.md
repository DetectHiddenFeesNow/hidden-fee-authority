# Release Process

## Roles
Developer: Cline
QA/DevOps: Sentinel
Approval: Release gate PASS required

## Workflow
1. Cline makes changes to the project
2. Sentinel runs: node scripts/release_gate.js
3. Sentinel reviews release_gate_report.md
4. If PASS: Deployment approved
5. If FAIL: Issues returned to Cline for fixes

## Release Gate Requirements
All checks must pass:
- Schema (Article, FAQPage, Organization)
- datePublished, dateModified
- Internal links to DetectHiddenFees.com
- Canonical URLs
- FAQ sections
- Example scenarios
- Results Preview sections
- Trust signals
- Word count minimums (800+ backlinks, 2500+ authority assets)
- Sitemap inclusion
- HTTP 200

## Deployment
Git commit -> Push -> Vercel auto-deploy -> Verify HTTP 200
