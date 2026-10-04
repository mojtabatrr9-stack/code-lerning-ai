param([string]$Root = (Get-Location).Path)
$ErrorActionPreference = 'Stop'

$src      = Join-Path $Root 'src'
$tplPath  = Join-Path $src 'index.template.html'
$arcPath  = Join-Path $Root 'archive/index-v1.html'
$outPath  = Join-Path $Root 'index.html'

# --- 1) font: pull the embedded @font-face (base64 TTF) out of the archived build ---
$arch = [IO.File]::ReadAllText($arcPath)
$fm   = [regex]::Match($arch, '@font-face\s*\{[^{}]*\}')
if (-not $fm.Success) { throw 'font-face block not found in archive/index-v1.html' }
$font = $fm.Value
Write-Output ("font block: " + $font.Length + " chars")

# --- 2) css: explicit order (design system, then views) ---
$cssFiles = @('theme.css', 'site.css')
$cssParts = foreach ($f in $cssFiles) {
  $p = Join-Path $src $f
  if (-not (Test-Path $p)) { throw "missing $f" }
  "/* ===== $f ===== */`n" + [IO.File]::ReadAllText($p)
}
$css = $cssParts -join "`n"

# --- 3) js: explicit order ---
$jsFiles = @('data.js', 'mascot.js', 'fx.js', 'app.js', 'v-auth.js', 'v-onboard.js', 'v-home.js', 'v-courses.js', 'v-lesson.js', 'v-lab.js', 'v-path.js', 'v-league.js', 'v-profile.js')
$jsParts = foreach ($f in $jsFiles) {
  $p = Join-Path $src $f
  if (-not (Test-Path $p)) { throw "missing $f" }
  "/* ===== $f ===== */`n" + [IO.File]::ReadAllText($p)
}
$js = $jsParts -join "`n"

# --- 4) splice into the template ---
$tpl = [IO.File]::ReadAllText($tplPath)
foreach ($token in @('/*{{FONT}}*/', '/*{{CSS}}*/', '/*{{JS}}*/')) {
  if ($tpl.IndexOf($token) -lt 0) { throw "template is missing token $token" }
}
$out = $tpl.Replace('/*{{FONT}}*/', $font).Replace('/*{{CSS}}*/', $css).Replace('/*{{JS}}*/', $js)

$enc = New-Object System.Text.UTF8Encoding($false)
[IO.File]::WriteAllText($outPath, $out, $enc)

$kb = [math]::Round((Get-Item $outPath).Length / 1KB, 1)
Write-Output ("built index.html: " + $kb + " KB  (css " + $css.Length + " chars, js " + $js.Length + " chars)")
