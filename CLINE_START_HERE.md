# Welcome to the DetectHiddenFees Authority Hub

## First Steps

Read these files in order:

1. GLOBAL.md - Complete project brain and operating rules
2. ARCHITECTURE.md - Folder structure and script purposes  
3. TASK_HISTORY.md - What has been built and lessons learned
4. CLINE_INSTRUCTIONS.md - Operating rules for this workspace

## Quick Start

After reading the brain files, inspect:

- scripts/ - Automation scripts (page_generator.js v2.0.0, master_verify.js)
- content/ - Markdown source files for authority assets
- content/templates/ - Authority asset templates

## Before Making Changes

Run:

node scripts/master_verify.js

This audits all 124+ pages for schema, dates, FAQ, links, trust signals.

## Key URLs

Live site: https://hidden-fee-authority.vercel.app/
Source repo: https://github.com/DetectHiddenFeesNow/hidden-fee-authority
Main site: https://detecthiddenfees.com

## Core Principle

Improve and expand the existing production system. Do not rebuild it.
