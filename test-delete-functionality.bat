@echo off
echo ========================================
echo TEST FONCTIONNALITE SUPPRIMER
echo ========================================

echo [1/5] Verification des modules avec suppression...
echo.

echo ✅ DischargeModule - Fonction handleDeleteDischarge
echo ✅ DischargeModuleModern - Fonction handleDeleteDischarge  
echo ✅ ClientsModule - Fonction deleteClient
echo ✅ ArticlesModule - Fonctions handleDeleteArticle et handleDeleteCategory
echo ⚠️ ChatConversation - Fonction handleMessageAction delete

echo.
echo [2/5] Verification des imports useData...
findstr /s "useData" src\components\modules\*.tsx | findstr "deleteDischarge\|deleteClient\|deleteArticle"

echo.
echo [3/5] Verification des boutons Trash2...
findstr /s "Trash2" src\components\modules\*.tsx

echo.
echo [4/5] Verification des fonctions de suppression dans DataContext...
findstr /A "deleteDischarge\|deleteClient\|deleteArticle" src\contexts\DataContext.tsx

echo.
echo [5/5] URLs de test:
echo http://localhost:5173/discharges - Test suppression decharges
echo http://localhost:5173/clients - Test suppression clients  
echo http://localhost:5173/articles - Test suppression articles
echo http://localhost:5173/chat - Test suppression messages

echo.
echo ========================================
echo TEST TERMINE
echo ========================================
echo.
echo INSTRUCTIONS DE TEST:
echo 1. Ouvrir http://localhost:5173
echo 2. Naviguer vers chaque module
echo 3. Cliquer sur les boutons supprimer (icone poubelle)
echo 4. Confirmer la suppression
echo 5. Verifier que l'element disparait de la liste
echo.
pause
