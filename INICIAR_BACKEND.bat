@echo off
title ANIMES WORLD - Backend
color 0D
echo.
echo  ================================================
echo   AW  ANIMES WORLD - Backend
echo  ================================================
echo.
echo  Iniciando servidor na porta 3001...
echo.
cd /d "%~dp0backend"
node src/server.js
pause
