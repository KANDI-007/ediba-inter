@echo off
echo ========================================
echo CORRECTION DEFINITIVE DES IMAGES
echo ========================================

echo.
echo [1/6] Correction des chemins d'images dans les composants...

REM Correction dans Layout.tsx
powershell -Command "(Get-Content 'src\components\Layout.tsx') -replace 'src={images\.logo}', 'src=\"./logo-ediba.png\"' | Set-Content 'src\components\Layout.tsx'"

REM Correction dans ChatModule.tsx
powershell -Command "(Get-Content 'src\components\modules\ChatModule.tsx') -replace 'src={user\.avatar \|\| ''\./default-avatar\.png''}', 'src=\"./default-avatar.png\"' | Set-Content 'src\components\modules\ChatModule.tsx'"

REM Correction dans ChatInterface.tsx
powershell -Command "(Get-Content 'src\components\ChatInterface.tsx') -replace 'src={activeConversation\.participants\.find\(p =&gt; p\.id !== currentUser\?\.id\)\?\.avatar \|\| ''\./default-avatar\.png''}', 'src=\"./default-avatar.png\"' | Set-Content 'src\components\ChatInterface.tsx'"

REM Correction dans ChatConversation.tsx
powershell -Command "(Get-Content 'src\components\chat\ChatConversation.tsx') -replace 'src={conversation\.participants\.find\(p =&gt; p\.id !== ''current''\)\?\.avatar \|\| ''\./default-avatar\.png''}', 'src=\"./default-avatar.png\"' | Set-Content 'src\components\chat\ChatConversation.tsx'"
powershell -Command "(Get-Content 'src\components\chat\ChatConversation.tsx') -replace 'src={message\.fileUrl \|\| ''\./placeholder-image\.jpg''}', 'src=\"./placeholder-image.jpg\"' | Set-Content 'src\components\chat\ChatConversation.tsx'"

REM Correction dans ChatSidebar.tsx
powershell -Command "(Get-Content 'src\components\chat\ChatSidebar.tsx') -replace 'src={avatar \|\| ''\./default-avatar\.png''}', 'src=\"./default-avatar.png\"' | Set-Content 'src\components\chat\ChatSidebar.tsx'"

REM Correction dans ConnectedUsersPanel.tsx
powershell -Command "(Get-Content 'src\components\chat\ConnectedUsersPanel.tsx') -replace 'src={user\.avatar \|\| ''\./default-avatar\.png''}', 'src=\"./default-avatar.png\"' | Set-Content 'src\components\chat\ConnectedUsersPanel.tsx'"

echo.
echo [2/6] Suppression du module d'images centralisé...
if exist "src\assets\images.ts" del "src\assets\images.ts"

echo.
echo [3/6] Nettoyage du cache...
if exist "dist" rmdir /s /q "dist"
if exist "node_modules\.vite" rmdir /s /q "node_modules\.vite"

echo.
echo [4/6] Installation des dépendances...
call npm install

echo.
echo [5/6] Construction du projet...
call npm run build

echo.
echo [6/6] Vérification des fichiers générés...
echo.
echo Fichiers dans dist:
dir dist /b

echo.
echo Images dans dist:
dir dist\*.png dist\*.jpg dist\*.svg /b

echo.
echo ========================================
echo CORRECTION TERMINEE
echo ========================================
echo.
echo Les images sont maintenant configurées avec des chemins relatifs.
echo Vous pouvez maintenant déployer sur Netlify.
echo.
echo Pour déployer:
echo 1. Allez sur https://app.netlify.com
echo 2. Connectez votre repository GitHub
echo 3. Configurez le build: npm run build
echo 4. Publiez le dossier: dist
echo.
pause
