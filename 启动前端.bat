@echo off
cd /d "%~dp0"
cd frontend
echo Starting frontend server...
echo Please visit: http://localhost:8080
python -m http.server 8080
pause
