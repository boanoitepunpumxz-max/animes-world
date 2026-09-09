@echo off
title ANIMES WORLD
color 0D
echo.
echo  ================================================
echo   AW  ANIMES WORLD - Iniciando tudo...
echo  ================================================
echo.

REM Inicia o backend em uma janela separada
echo  [1/2] Iniciando Backend (porta 3001)...
start "ANIMES WORLD - Backend" cmd /k "cd /d %~dp0backend && node src/server.js"

REM Aguarda 3 segundos para o backend inicializar
timeout /t 3 /nobreak > nul

REM Inicia o frontend em outra janela
echo  [2/2] Iniciando Frontend (porta 5173)...
start "ANIMES WORLD - Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

REM Aguarda mais 5 segundos e abre o navegador
echo.
echo  Aguardando inicializacao...
timeout /t 5 /nobreak > nul

echo  Abrindo navegador...
start http://localhost:5173

echo.
echo  ================================================
echo   Site: http://localhost:5173
echo   API:  http://localhost:3001/api/health
echo   Admin: http://localhost:5173/admin
echo  ================================================
echo.
echo  Para fechar: feche as duas janelas pretas abertas.
echo.
pause
