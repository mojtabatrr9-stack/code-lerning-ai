@echo off
set CH="C:\Program Files\Google\Chrome\Application\chrome.exe"
"%CH%" --headless=new --no-sandbox --disable-gpu --no-first-run --user-data-dir=C:\tmp\jv\p1 --window-size=1440,900 --virtual-time-budget=8000 --screenshot=C:\tmp\jv\hero.png "file:///C:/Users/ali/Downloads/javaneh-academy-backup/javaneh/index.html"
echo SHOT_EXIT=%ERRORLEVEL%
