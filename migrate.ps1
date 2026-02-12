# PowerShell Migration Script: Next.js to React
# This script performs bulk find-and-replace across the codebase

$srcDir = "c:\Users\User\react-nextjs-bootstrap\src"

# Get all .js and .jsx files in src
$files = Get-ChildItem -Path $srcDir -Recurse -Include "*.js","*.jsx" -File

$totalChanges = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    if ($null -eq $content) { continue }
    
    $originalContent = $content
    $changed = $false
    
    # 1. Remove "use client"; directives (not needed in plain React)
    if ($content -match '"use client"') {
        $content = $content -replace '^\s*"use client";\s*\r?\n', ''
        $content = $content -replace '^\s*"use client";\s*', ''
    }
    
    # 2. Remove 'use server'; directives  
    if ($content -match "'use server'") {
        $content = $content -replace "^\s*'use server';\s*\r?\n", ''
    }
    
    # 3. Replace next/link imports with react-router-dom
    # import Link from "next/link" -> import { Link } from "react-router-dom"
    $content = $content -replace 'import\s+Link\s+from\s+[''"]next/link[''"];?\s*', 'import { Link } from "react-router-dom";'
    
    # 4. Replace next/image imports with regular img
    # import Image from "next/image" -> (remove import, Image tags handled separately)  
    $content = $content -replace 'import\s+Image\s+from\s+[''"]next/image[''"];?\s*\r?\n?', ''
    
    # 5. Replace useRouter from next/navigation with react-router-dom
    $content = $content -replace 'import\s*\{\s*useRouter\s*\}\s*from\s+[''"]next/navigation[''"];?', 'import { useNavigate } from "react-router-dom";'
    
    # 6. Replace usePathname from next/navigation with react-router-dom  
    $content = $content -replace 'import\s*\{\s*usePathname\s*\}\s*from\s+[''"]next/navigation[''"];?', 'import { useLocation } from "react-router-dom";'
    
    # 7. Handle combined imports: import { useRouter, usePathname } from "next/navigation"
    $content = $content -replace 'import\s*\{\s*useRouter\s*,\s*usePathname\s*\}\s*from\s+[''"]next/navigation[''"];?', 'import { useNavigate, useLocation } from "react-router-dom";'
    $content = $content -replace 'import\s*\{\s*usePathname\s*,\s*useRouter\s*\}\s*from\s+[''"]next/navigation[''"];?', 'import { useNavigate, useLocation } from "react-router-dom";'
    
    # 8. Handle redirect from next/navigation  
    $content = $content -replace "import\s*\{\s*redirect\s*\}\s*from\s+['""]next/navigation['""];?", 'import { Navigate } from "react-router-dom";'
    
    # 9. Replace useParams from next/navigation
    $content = $content -replace 'import\s*\{\s*useParams\s*\}\s*from\s+[''"]next/navigation[''"];?', 'import { useParams } from "react-router-dom";'
    
    # 10. Handle any remaining next/navigation imports with multiple items
    $content = $content -replace 'from\s+[''"]next/navigation[''"]', 'from "react-router-dom"'
    
    # 11. Replace next/font/google import (just remove it, font loaded via index.html)
    $content = $content -replace 'import\s*\{[^}]*\}\s*from\s+[''"]next/font/google[''"];?\s*\r?\n?', ''
    $content = $content -replace "const\s+inter\s*=\s*Inter\s*\(\s*\{[^}]*\}\s*\)\s*;?\s*\r?\n?", ''
    
    # 12. Replace process.env.NEXT_PUBLIC_ with import.meta.env.VITE_
    $content = $content -replace 'process\.env\.NEXT_PUBLIC_', 'import.meta.env.VITE_'
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $totalChanges++
        Write-Output "Modified: $($file.FullName.Replace($srcDir, 'src'))"
    }
}

Write-Output ""
Write-Output "Total files modified: $totalChanges"
