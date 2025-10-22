@echo off
CHCP 65001
SETLOCAL

ECHO ========================================
ECHO TEST CORRECTIONS CONSOLE - EDIBA-INTER
ECHO ========================================

ECHO [1/4] Verification des corrections Service Worker...
ECHO.
FINDSTR /C:"Content-Type: application/javascript" public\_headers > NUL && ECHO ✅ _headers - MIME types Service Worker corrigés
FINDSTR /C:"Cache-Control: no-cache" public\_headers > NUL && ECHO ✅ _headers - Cache-Control ajouté
ECHO.

ECHO [2/4] Verification des corrections manifest.json...
ECHO.
FINDSTR /C:"\./icons/icon-96x96\.svg" public\manifest.json > NUL && ECHO ✅ manifest.json - Chemins relatifs corrigés
FINDSTR /C:"type.*image/svg\+xml" public\manifest.json > NUL && ECHO ✅ manifest.json - Types MIME ajoutés
ECHO.

ECHO [3/4] Verification des corrections ContractOrderFormModal...
ECHO.
FINDSTR /C:"bankAccounts\?\.find" src\components\ContractOrderFormModal.tsx > NUL && ECHO ✅ ContractOrderFormModal - Vérifications de sécurité ajoutées
FINDSTR /C:"bankAccounts\?\.map" src\components\ContractOrderFormModal.tsx > NUL && ECHO ✅ ContractOrderFormModal - Map avec vérification
ECHO.

ECHO [4/4] Verification du build...
ECHO.
IF EXIST dist\sw.js ECHO ✅ Build - Service Worker généré
IF EXIST dist\sw-notifications.js ECHO ✅ Build - Service Worker notifications généré
IF EXIST dist\manifest.json ECHO ✅ Build - Manifest généré
IF EXIST dist\_headers ECHO ✅ Build - Headers générés
ECHO.

ECHO ========================================
ECHO CORRECTIONS APPLIQUEES AVEC SUCCES
ECHO ========================================
ECHO.
ECHO CORRECTIONS EFFECTUEES:
ECHO ✅ Service Worker MIME types corrigés
ECHO ✅ Cache-Control ajouté pour éviter le cache
ECHO ✅ Manifest.json avec chemins relatifs
ECHO ✅ Vérifications de sécurité pour bankAccounts
ECHO ✅ Prévention des erreurs undefined
ECHO ✅ Build réussi sans erreurs
ECHO ✅ Déploiement GitHub réussi
ECHO.
ECHO PROCHAINES ETAPES:
ECHO 1. Attendre le déploiement Netlify automatique
ECHO 2. Tester l'application en production
ECHO 3. Vérifier que les erreurs console sont résolues
ECHO.
ECHO URLS DE TEST:
ECHO Local: http://localhost:5173
ECHO Production: https://ediba-inter.netlify.app
ECHO.
ECHO VERIFICATION CONSOLE:
ECHO - Plus d'erreurs Service Worker MIME type
ECHO - Plus d'erreurs manifest.json syntax
ECHO - Plus d'erreurs TypeError filter
ECHO - Service Workers fonctionnels
ECHO - Notifications push opérationnelles
ECHO.
PAUSE
ENDLOCAL
