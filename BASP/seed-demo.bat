@echo off
title BASP - create demo accounts
echo Make sure MySQL is GREEN in the XAMPP Control Panel.
echo.
cd /d "%~dp0server"
call npm run seed
echo.
pause
