@echo off
cd /d "%~dp0"
echo ========================================
echo Installing dependencies...
echo ========================================
cd backend
npm install
echo.
echo ========================================
echo Installation complete!
echo ========================================
pause
