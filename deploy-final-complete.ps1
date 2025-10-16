# Script PowerShell pour déploiement final EDIBA-INTER
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DEPLOIEMENT FINAL COMPLET EDIBA-INTER" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si Git est installé
$gitPath = ""
if (Test-Path "C:\Program Files\Git\bin\git.exe") {
    $gitPath = "C:\Program Files\Git\bin\git.exe"
} elseif (Test-Path "C:\Program Files (x86)\Git\bin\git.exe") {
    $gitPath = "C:\Program Files (x86)\Git\bin\git.exe"
} else {
    Write-Host "❌ Git n'est pas trouvé. Veuillez installer Git d'abord." -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour continuer"
    exit 1
}

Write-Host "[1/8] Vérification du statut Git..." -ForegroundColor Yellow
& $gitPath status
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de la vérification du statut Git" -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour continuer"
    exit 1
}
Write-Host "✓ Repository Git vérifié" -ForegroundColor Green
Write-Host ""

Write-Host "[2/8] Nettoyage des fichiers de construction..." -ForegroundColor Yellow
if (Test-Path "dist") { Remove-Item -Recurse -Force "dist" }
if (Test-Path "node_modules\.vite") { Remove-Item -Recurse -Force "node_modules\.vite" }
Write-Host "✓ Nettoyage terminé" -ForegroundColor Green
Write-Host ""

Write-Host "[3/8] Installation des dépendances..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de l'installation des dépendances" -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour continuer"
    exit 1
}
Write-Host "✓ Dépendances installées" -ForegroundColor Green
Write-Host ""

Write-Host "[4/8] Test de construction local..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de la construction locale" -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour continuer"
    exit 1
}
Write-Host "✓ Construction locale réussie" -ForegroundColor Green
Write-Host ""

Write-Host "[5/8] Vérification des fichiers de sortie..." -ForegroundColor Yellow
if (-not (Test-Path "dist\index.html")) {
    Write-Host "❌ Fichier index.html manquant dans dist/" -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour continuer"
    exit 1
}
if (-not (Test-Path "dist\assets")) {
    Write-Host "❌ Dossier assets manquant dans dist/" -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour continuer"
    exit 1
}
Write-Host "✓ Fichiers de sortie vérifiés" -ForegroundColor Green
Write-Host ""

Write-Host "[6/8] Ajout des fichiers modifiés..." -ForegroundColor Yellow
& $gitPath add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de l'ajout des fichiers" -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour continuer"
    exit 1
}
Write-Host "✓ Fichiers ajoutés au staging" -ForegroundColor Green
Write-Host ""

Write-Host "[7/8] Création du commit de déploiement..." -ForegroundColor Yellow
$commitMessage = @"
Deploy: Version finale EDIBA-INTER prête pour production

✅ Corrections Vite/Rollup appliquées
✅ Configuration Netlify optimisée  
✅ Build testé et validé localement
✅ Architecture documentée
✅ PWA configurée et fonctionnelle

Fonctionnalités déployées:
- Dashboard moderne et responsive
- Gestion complète des utilisateurs
- Module de facturation avancé
- Système de chat en temps réel
- Module de décharge intégré
- Gestion des fournisseurs
- Notifications push
- PWA installable
- Interface WhatsApp moderne

Prêt pour déploiement Netlify/Vercel 🚀
"@

& $gitPath commit -m $commitMessage
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de la création du commit" -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour continuer"
    exit 1
}
Write-Host "✓ Commit de déploiement créé" -ForegroundColor Green
Write-Host ""

Write-Host "[8/8] Push vers GitHub..." -ForegroundColor Yellow
& $gitPath push origin master
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du push. Tentative avec la branche par défaut..." -ForegroundColor Yellow
    & $gitPath push origin HEAD
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erreur lors du push vers GitHub" -ForegroundColor Red
        Write-Host "   Vérifiez votre configuration Git et vos permissions" -ForegroundColor Red
        Read-Host "Appuyez sur Entrée pour continuer"
        exit 1
    }
}
Write-Host "✓ Push réussi vers GitHub" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DEPLOIEMENT FINAL TERMINE AVEC SUCCES" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Application EDIBA-INTER déployée" -ForegroundColor Green
Write-Host "✅ Code poussé vers GitHub" -ForegroundColor Green
Write-Host "✅ Prêt pour déploiement automatique" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Prochaines étapes:" -ForegroundColor Yellow
Write-Host "   1. Connectez votre repository à Netlify"
Write-Host "   2. Configurez le build command: npm run build"
Write-Host "   3. Configurez le publish directory: dist"
Write-Host "   4. Activez le déploiement automatique"
Write-Host ""
Write-Host "🔗 URLs de déploiement:" -ForegroundColor Yellow
Write-Host "   - Netlify: https://app.netlify.com"
Write-Host "   - Vercel: https://vercel.com"
Write-Host "   - GitHub: https://github.com/votre-username/ediba-inter"
Write-Host ""
Write-Host "📱 Fonctionnalités déployées:" -ForegroundColor Yellow
Write-Host "   ✅ Interface moderne et responsive"
Write-Host "   ✅ Gestion des utilisateurs avec rôles"
Write-Host "   ✅ Système de facturation complet"
Write-Host "   ✅ Chat en temps réel avec appels"
Write-Host "   ✅ Module de décharge intégré"
Write-Host "   ✅ Gestion des fournisseurs"
Write-Host "   ✅ Notifications push"
Write-Host "   ✅ PWA installable"
Write-Host "   ✅ Export PDF/Excel"
Write-Host "   ✅ Interface WhatsApp moderne"
Write-Host ""
Write-Host "🎉 Votre application EDIBA-INTER est prête !" -ForegroundColor Green
Write-Host ""
Read-Host "Appuyez sur Entrée pour continuer"
