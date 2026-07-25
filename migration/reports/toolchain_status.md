# Windows Toolchain Status

## Confirmed Working

| Tool | Status | Version | Path |
|------|--------|---------|------|
| ripgrep | Verified | 14.1.0 | C:\Program Files\Python313\rg.exe |
| Node.js | Verified | 24.18.0 | C:\Program Files\nodejs\node.exe |
| npm | Verified | 11.16.0 | via Node |
| Python | Verified | 3.13.2 | C:\Program Files\Python313\python.exe |
| Git | Verified | 2.55.0 | C:\Program Files\Git\cmd\git.exe |
| PowerShell | Verified | 5.1+ | built-in |
| file_writer.js | Verified | Active | C:\vhub\scripts\file_writer.js |
| page_generator.js | Verified | 2.0.0 | C:\vhub\scripts\page_generator.js |

## npm Packages (Verification ongoing)

Prettier, ESLint, PM2: npm global install attempted through HTTP API but stdout not captured. Verify manually: npm list -g.

## winget Packages

GitHub CLI, jq, PowerShell 7: winget install attempted. Verify with: gh --version, jq --version, pwsh --version.

## S3curit3 Recommendations

Install through VS Code integrated terminal for best results.

## Production Pipeline

Content (C:\vhub\content\) -> page_generator.js v2.0.0 -> HTML -> Audit -> Git -> Vercel
