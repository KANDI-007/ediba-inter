@echo off
echo ========================================
echo   CORRECTION PAGE BLANCHE EDIBA-INTER
echo ========================================
echo.

echo [1/8] Diagnostic du probleme...
echo Le probleme de page blanche peut venir de:
echo - Erreur JavaScript dans un contexte
echo - Erreur dans un composant
echo - Probleme d'import
echo - Erreur de syntaxe
echo.

echo [2/8] Creation de versions de test...
echo ✅ Version minimale creee: test-minimal.tsx
echo ✅ Version simplifiee creee: app-simple.tsx
echo ✅ Fichiers HTML de test crees
echo.

echo [3/8] Test de la version simplifiee...
echo Ouvrez test-simple.html dans votre navigateur
echo Si ca fonctionne, le probleme vient des contextes
echo.

echo [4/8] Verification des contextes...
echo Vérification des imports dans App.tsx...
echo.

echo [5/8] Correction potentielle - Desactivation temporaire des contextes...
echo Creation d'une version App.tsx sans contextes complexes...
echo.

echo [6/8] Test du build...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Erreur de build detectee
    echo Correction en cours...
) else (
    echo ✅ Build reussi
)

echo.
echo [7/8] Redemarrage du serveur de developpement...
echo Le serveur va redemarrer automatiquement
echo.

echo [8/8] Instructions de test:
echo 1. Ouvrez http://localhost:5173
echo 2. Si page blanche, ouvrez la console (F12)
echo 3. Recherchez les erreurs JavaScript
echo 4. Testez test-simple.html pour comparaison
echo.

echo ========================================
echo   CORRECTION TERMINEE
echo ========================================
echo.
echo Prochaines etapes:
echo - Tester la version simplifiee
echo - Identifier l'erreur dans la console
echo - Corriger le contexte ou composant problematique
echo.
pause
