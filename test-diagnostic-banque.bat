@echo off
CHCP 65001
SETLOCAL

ECHO ========================================
ECHO DIAGNOSTIC MODULE BANQUE - EDIBA-INTER
ECHO ========================================

ECHO [1/5] Verification des fichiers...
ECHO.
IF EXIST src\components\modules\BankModule.tsx ECHO ✅ BankModule.tsx existe
IF EXIST src\components\modules\BankModuleTest.tsx ECHO ✅ BankModuleTest.tsx créé
IF EXIST src\components\modules\ParametersModule.tsx ECHO ✅ ParametersModule.tsx existe
ECHO.

ECHO [2/5] Verification des imports dans ParametersModule...
ECHO.
FINDSTR /C:"import BankModule from './BankModule';" src\components\modules\ParametersModule.tsx > NUL && ECHO ✅ Import BankModule
FINDSTR /C:"import BankModuleTest from './BankModuleTest';" src\components\modules\ParametersModule.tsx > NUL && ECHO ✅ Import BankModuleTest
ECHO.

ECHO [3/5] Verification de l'utilisation du composant de test...
ECHO.
FINDSTR /C:"<BankModuleTest />" src\components\modules\ParametersModule.tsx > NUL && ECHO ✅ BankModuleTest utilisé temporairement
ECHO.

ECHO [4/5] Verification du DataContext...
ECHO.
FINDSTR /C:"bankAccounts: BankAccount\[\];" src\contexts\DataContext.tsx > NUL && ECHO ✅ Interface BankAccount dans DataContext
FINDSTR /C:"bankAccounts: \[{" src\contexts\DataContext.tsx > NUL && ECHO ✅ Données initiales bankAccounts
FINDSTR /C:"addBankAccount:" src\contexts\DataContext.tsx > NUL && ECHO ✅ Fonction addBankAccount
ECHO.

ECHO [5/5] URLs de test...
ECHO.
ECHO Local: http://localhost:5173/parameters
ECHO.
ECHO ========================================
ECHO DIAGNOSTIC TERMINE
ECHO ========================================
ECHO.
ECHO INSTRUCTIONS DE TEST:
ECHO 1. Ouvrir http://localhost:5173
ECHO 2. Aller dans Paramètres
ECHO 3. Cliquer sur l'onglet "Comptes Bancaires"
ECHO 4. Vérifier les informations de diagnostic affichées
ECHO 5. Ouvrir la console du navigateur (F12)
ECHO 6. Regarder les logs "BankModuleTest - bankAccounts:"
ECHO.
ECHO DIAGNOSTIC ATTENDU:
ECHO - Nombre de comptes bancaires: 1
ECHO - Type de bankAccounts: object
ECHO - bankAccounts est undefined: Non
ECHO - bankAccounts est null: Non
ECHO - Compte BIA-TOGO affiché
ECHO.
ECHO SI LE MODULE EST BLANC:
ECHO - Vérifier la console pour les erreurs
ECHO - Vérifier que DataContext est bien chargé
ECHO - Vérifier que useData() fonctionne
ECHO.
PAUSE
ENDLOCAL
