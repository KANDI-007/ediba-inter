@echo off
echo ========================================
echo NETTOYAGE DU PROJET EDIBA INTER
echo ========================================
echo.

echo [1/5] Suppression des fichiers de test...
del /q test.html test-simple.html 2>nul
echo OK

echo [2/5] Suppression des fichiers de correction obsolètes...
del /q CORRECTION_*.md 2>nul
del /q MISSION_*.md 2>nul
del /q DEPLOIEMENT_*.md 2>nul
del /q TEST_*.md 2>nul
del /q SOLUTION_*.md 2>nul
del /q VERIFICATION_*.md 2>nul
del /q SYNCHRONISATION_*.md 2>nul
del /q DESIGN_*.md 2>nul
del /q GUIDE_*.md 2>nul
del /q DEMARRAGE_*.md 2>nul
del /q MISE_A_JOUR_CAHIER_DES_CHARGES.md 2>nul
del /q PROJET_PRET_GITHUB.md 2>nul
del /q RESUME_FINAL_*.md 2>nul
del /q IMAGES_*.md 2>nul
del /q ORGANISATION_*.md 2>nul
del /q PARTAGE_*.md 2>nul
del /q PLAN_*.md 2>nul
del /q NETTOYAGE_*.md 2>nul
del /q NOTIFICATIONS_*.md 2>nul
del /q SYSTEME_*.md 2>nul
del /q INTERFACE_*.md 2>nul
del /q CHAT_*.md 2>nul
del /q MODULE_BANQUE_*.md 2>nul
del /q JOURNAL_*.md 2>nul
del /q STATUT_*.md 2>nul
del /q ETAPES_*.md 2>nul
del /q RAILWAY_*.md 2>nul
del /q CORRECTIONS_*.md 2>nul
del /q ARCHITECTURE_*.md 2>nul
del /q CONFIRMATION_*.md 2>nul
echo OK

echo [3/5] Suppression des scripts redondants...
del /q test-*.bat 2>nul
del /q deploy-*.bat 2>nul
del /q sync-github-*.bat 2>nul
del /q fix-images-*.bat 2>nul
del /q correction-*.bat 2>nul
del /q create-github-*.bat 2>nul
del /q init-git-*.bat 2>nul
del /q setup-github-*.bat 2>nul
del /q update-git-*.bat 2>nul
del /q prepare-github.bat 2>nul
del /q organize-images-*.bat 2>nul
del /q start-*.bat 2>nul
del /q verification-*.bat 2>nul
del /q diagnostic-*.bat 2>nul
del /q ouvrir-dossier-*.bat 2>nul
echo OK

echo [4/5] Suppression des scripts PowerShell redondants...
del /q create-*.ps1 2>nul
del /q sync-github-*.ps1 2>nul
del /q deploy-final-complete.ps1 2>nul
echo OK

echo [5/5] Suppression du dossier github-upload (doublons)...
if exist github-upload (
    echo ATTENTION: Le dossier github-upload va etre supprime.
    echo Appuyez sur une touche pour continuer ou Ctrl+C pour annuler...
    pause >nul
    rmdir /s /q github-upload 2>nul
    echo OK
)

echo.
echo ========================================
echo NETTOYAGE TERMINE
echo ========================================
echo.
echo Fichiers conserves:
echo - README.md (a mettre a jour)
echo - CAHIER_DES_CHARGES_COMPLET.md (a actualiser)
echo - CHANGELOG.md
echo - ETAT_PROJET.md
echo - package.json, package-lock.json
echo - Tous les fichiers de configuration
echo - Le dossier src/ (code source)
echo - Le dossier public/ (assets)
echo.
pause

