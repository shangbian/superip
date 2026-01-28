@echo off
cd /d "%~dp0"
cd backend
echo Starting backend server...
npm run dev
pause
