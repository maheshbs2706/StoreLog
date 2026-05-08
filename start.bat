@echo off
cd /d "%~dp0"
echo Starting StoreLog server...
echo Press Ctrl+C to stop
timeout /t 2 /nobreak >nul
start "" "http://localhost:3000"
npx serve . -p 3000
pause
