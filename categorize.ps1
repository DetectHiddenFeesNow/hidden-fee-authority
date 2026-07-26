Get-ChildItem C:\vhub\content\*.md | ForEach-Object {
    $n = $_.Name.ToLower()
    $cat = "default"
    if ($n -match "banking") { $cat = "banking" }
    elseif ($n -match "insurance") { $cat = "insurance" }
    elseif ($n -match "telecom") { $cat = "telecom" }
    elseif ($n -match "auto|dealer|vehicle") { $cat = "automotive" }
    elseif ($n -match "medical|healthcare") { $cat = "medical" }
    elseif ($n -match "real.estate|rental|storage") { $cat = "real-estate" }
    elseif ($n -match "subscription") { $cat = "subscriptions" }
    elseif ($n -match "education|flight") { $cat = "education" }
    elseif ($n -match "utility") { $cat = "utilities" }
    
    $c = Get-Content $_.FullName -Raw
    if ($c -match "category:") {
        Write-Output "SKIP - $($_.Name)"
    } else {
        $c = $c -replace "(desc:[^\n]+)", ('$1' + "`ncategory: $cat")
        [IO.File]::WriteAllText($_.FullName, $c)
        Write-Output "ADDED $cat - $($_.Name)"
    }
}
