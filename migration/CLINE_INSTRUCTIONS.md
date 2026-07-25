# Cline Operating Instructions

## Workspace
C:\vhub

## Tools
- Node.js for automation scripts
- Python for data processing
- ripgrep for fast project-wide searches
- Git for version control

## Workflow
1. Create/edit markdown in C:\vhub\content\
2. Run: node scripts/page_generator.js <file.md>
3. Run: node scripts/master_verify.js
4. Git commit and push
5. Vercel auto-deploys

## Rules
- Do NOT modify page_generator.js without approval
- Do NOT modify file_writer.js without approval
- Run verification before every deployment
- 124 backlink pages are production - do not regenerate
- Authority assets must pass 2500+ words, schema, FAQ, dates, trust
- iSH/Alpine Linux is not available
- Windows is the source of truth

## Key URLs
Live site: https://hidden-fee-authority.vercel.app/
Source: https://github.com/DetectHiddenFeesNow/hidden-fee-authority
Main site: https://detecthiddenfees.com