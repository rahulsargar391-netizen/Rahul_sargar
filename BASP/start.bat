@echo off
title BASP - start
echo Make sure MySQL is GREEN in the XAMPP Control Panel.
echo Starting the server and the website in two new windows...
start "BASP server" cmd /k "cd /d %~dp0server && npm run dev"
start "BASP website" cmd /k "cd /d %~dp0client && npm run dev"
timeout /t 8 >nul
start http://localhost:5173
