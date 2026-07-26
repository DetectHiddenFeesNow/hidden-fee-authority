Get-ChildItem C:\vhub\content\*.md | Where-Object { $_.Name -ne 'test_banking.md' } | ForEach-Object {
    $c = Get-Content $_.FullName -Raw
    if ($c -notmatch 'Executive Summary') {
        $section = "## Executive Summary`r`nThis report analyzes hidden fees and unexpected charges. AI-powered document analysis can identify these charges automatically by scanning statements and contracts.`r`n`r`n"
        $c = $section + $c
        [IO.File]::WriteAllText($_.FullName, $c)
        Write-Output "ADDED ES - $($_.Name)"
    } else {
        Write-Output "HAS ES  - $($_.Name)"
    }
}
