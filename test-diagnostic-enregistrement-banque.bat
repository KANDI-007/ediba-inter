@echo off
CHCP 65001
SETLOCAL

ECHO ========================================
ECHO DIAGNOSTIC PROBLEME ENREGISTREMENT COMPTES BANCAIRES
ECHO ========================================

ECHO [1/4] Verification des corrections appliquees...
ECHO.
FINDSTR /C:"bankAccounts: state.bankAccounts" src\contexts\DataContext.tsx > NUL && ECHO ✅ bankAccounts inclus dans localStorage
FINDSTR /C:"console.log.*DataContext.*Ajout du compte bancaire" src\contexts\DataContext.tsx > NUL && ECHO ✅ Logs de debug ajoutes dans DataContext
FINDSTR /C:"console.log.*Tentative d'ajout du compte bancaire" src\components\modules\BankModule.tsx > NUL && ECHO ✅ Logs de debug ajoutes dans BankModule
ECHO.

ECHO [2/4] Verification du build...
ECHO.
npm run build
IF %ERRORLEVEL% NEQ 0 (
    ECHO ❌ Erreur de build detectee
    PAUSE
    EXIT /B 1
) ELSE (
    ECHO ✅ Build reussi
)
ECHO.

ECHO [3/4] Instructions de test...
ECHO.
ECHO Pour tester l'enregistrement des comptes bancaires:
ECHO 1. Ouvrir http://localhost:5173
ECHO 2. Aller dans Parametres
ECHO 3. Cliquer sur l'onglet "Comptes Bancaires"
ECHO 4. Cliquer sur "Ajouter mon premier compte bancaire"
ECHO 5. Remplir les champs obligatoires:
ECHO    - Nom de la banque: BIA-TOGO
ECHO    - Numero de compte: TG005 01251 00115511401-48
ECHO    - Titulaire du compte: EDIBA INTER SARL U
ECHO 6. Cliquer sur "Ajouter"
ECHO 7. Ouvrir la console du navigateur (F12)
ECHO 8. Verifier les logs de debug
ECHO.

ECHO [4/4] Logs attendus dans la console...
ECHO.
ECHO Les logs suivants devraient apparaitre:
ECHO 🔄 Tentative d'ajout du compte bancaire: [donnees du formulaire]
ECHO 🔄 DataContext: Ajout du compte bancaire: [donnees du formulaire]
ECHO 🔄 DataContext: Compte bancaire cree: [compte avec ID]
ECHO 🔄 DataContext: Nouvel etat avec compte bancaire: [liste des comptes]
ECHO ✅ DataContext: Compte bancaire ajoute avec succes
ECHO ✅ Compte bancaire ajoute avec succes: [compte cree]
ECHO.

ECHO ========================================
ECHO DIAGNOSTIC TERMINE
ECHO ========================================
ECHO.
ECHO Si les logs n'apparaissent pas ou si le compte ne s'affiche pas:
ECHO 1. Verifier que le serveur de developpement est demarre
ECHO 2. Verifier que la console du navigateur est ouverte
ECHO 3. Verifier qu'aucune erreur JavaScript n'est presente
ECHO 4. Rafraichir la page et reessayer
ECHO.
PAUSE
ENDLOCAL
