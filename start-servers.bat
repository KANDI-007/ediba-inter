@echo off
echo ========================================
echo   DEMARRAGE SERVEURS EDIBA
echo ========================================
echo.

echo Demarrage du serveur backend Socket.IO...
start "Backend Server" cmd /k "node simple-backend-server.cjs"

echo.
echo Demarrage du serveur frontend Vite...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ========================================
echo   SERVEURS DEMARRES
echo ========================================
echo.
echo Backend Socket.IO: http://localhost:3001
echo Frontend Vite: http://localhost:5174
echo.
echo Appuyez sur une touche pour fermer...
pause > nul
