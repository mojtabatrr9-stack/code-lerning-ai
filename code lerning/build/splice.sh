#!/usr/bin/env bash
# جایگزینی امن بلوک CSS و JS در index.html بدون دست‌زدن به باندل React
set -e
cd "$(dirname "$0")/.."

CSS_M=$(grep -n 'لایهٔ حرکت سینمایی' index.html | head -1 | cut -d: -f1)
CSS_E=$(grep -n '</style>' index.html | tail -1 | cut -d: -f1)
JS_M=$(grep -n 'موتور حرکت و تعامل' index.html | head -1 | cut -d: -f1)
JS_E=$(grep -n '</script>' index.html | tail -1 | cut -d: -f1)

if [ -z "$CSS_M" ] || [ -z "$JS_M" ]; then echo "markers not found"; exit 1; fi

awk -v cs=$((CSS_M-1)) -v ce=$((CSS_E-1)) -v js=$((JS_M-1)) -v je=$((JS_E-1)) '
{
  if (NR==cs) { while ((getline line < "build/motion.css") > 0) print line; skip=1 }
  if (NR==ce) skip=0
  if (NR==js) { while ((getline line < "src/motion.js") > 0) print line; skip=1 }
  if (NR==je) { skip=0; next }
  if (!skip) print
}' index.html > build/index.new.html

mv build/index.new.html index.html
echo "lines: $(wc -l < index.html)  bytes: $(wc -c < index.html)"
