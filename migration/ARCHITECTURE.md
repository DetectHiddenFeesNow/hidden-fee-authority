# Vercel Authority Hub Architecture

## Folder Structure
C:\vhub\
  content\ - Markdown source files
  scripts\ - Node.js automation scripts
  audits\ - Audit output JSON files
  reports\ - Audit report markdown
  backups\ - Script backups
  logs\ - System logs
  migration\ - Transfer package
  ai-*\ - Generated HTML pages

## Key Scripts
page_generator.js v2.0.0 - Converts markdown to HTML with schema, FAQ, dates, trust signals
master_verify.js - Audits all pages for schema, dates, links, FAQ, examples, word count
file_writer.js - Writes files from JSON {path,content} payloads
task_runner.js - Central task dispatcher
fix_newlines.js - Converts literal backslash-n to actual newlines

## Workflow
Markdown (C:\vhub\content) -> page_generator.js -> HTML -> master_verify.js -> Git -> Vercel

## Tech Stack
Node.js v24.18.0, Python 3.13.2, Git 2.55.0, ripgrep 14.1.0, PowerShell, Vercel

## Domain
hidden-fee-authority.vercel.app (research hub)
detecthiddenfees.com (main site)