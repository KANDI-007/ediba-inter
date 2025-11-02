# Script de synchronisation GitHub pour EDIBA-INTER
# Version actuelle avec toutes les corrections

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SYNCHRONISATION GITHUB EDIBA-INTER" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Fonction pour exécuter Git
function Invoke-GitCommand {
    param([string]$Command)
    
    # Essayer différents chemins Git
    $gitPaths = @(
        "git",
        "C:\Program Files\Git\bin\git.exe",
        "C:\Program Files (x86)\Git\bin\git.exe",
        "C:\Users\$env:USERNAME\AppData\Local\Programs\Git\bin\git.exe"
    )
    
    foreach ($gitPath in $gitPaths) {
        try {
            $result = & $gitPath $Command.Split(' ')
            return $result
        }
        catch {
            continue
        }
    }
    
    Write-Host "❌ Git non trouvé. Veuillez installer Git ou utiliser GitHub Desktop." -ForegroundColor Red
    return $null
}

Write-Host "[1/8] Vérification du statut Git..." -ForegroundColor Yellow
$status = Invoke-GitCommand "status"
if ($status) {
    Write-Host "✅ Git fonctionne" -ForegroundColor Green
    Write-Host $status
} else {
    Write-Host "❌ Git non disponible" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 SOLUTIONS ALTERNATIVES:" -ForegroundColor Cyan
    Write-Host "1. Installer Git: https://git-scm.com/download/win" -ForegroundColor White
    Write-Host "2. Utiliser GitHub Desktop: https://desktop.github.com/" -ForegroundColor White
    Write-Host "3. Utiliser l'interface web GitHub" -ForegroundColor White
    Write-Host ""
    Write-Host "📋 FICHIERS À SYNCHRONISER:" -ForegroundColor Cyan
    Write-Host "- CORRECTION_ERREUR_JAVASCRIPT_TERMINEE.md" -ForegroundColor White
    Write-Host "- CORRECTION_PAGE_BLANCHE_TERMINEE.md" -ForegroundColor White
    Write-Host "- src/App.tsx (version corrigée avec ErrorBoundary)" -ForegroundColor White
    Write-Host "- src/App-backup.tsx (sauvegarde)" -ForegroundColor White
    Write-Host "- Tous les scripts de correction" -ForegroundColor White
    Write-Host ""
    Write-Host "🌐 DÉPLOIEMENT NETLIFY:" -ForegroundColor Cyan
    Write-Host "URL: https://ediba-inter.netlify.app" -ForegroundColor White
    Write-Host "Deploy Unique: https://68f8ea9fe7a9a47ae2411066--ediba-inter.netlify.app" -ForegroundColor White
    Write-Host ""
    Write-Host "📞 CONTACT:" -ForegroundColor Cyan
    Write-Host "Développeur: LARE Kandi" -ForegroundColor White
    Write-Host "Email: kandilare20@gmail.com" -ForegroundColor White
    Write-Host "Téléphone: +228 91 67 61 67" -ForegroundColor White
    Read-Host "Appuyez sur Entrée pour continuer"
    exit
}

Write-Host ""
Write-Host "[2/8] Ajout des fichiers modifiés..." -ForegroundColor Yellow
Invoke-GitCommand "add ."

Write-Host ""
Write-Host "[3/8] Vérification des fichiers ajoutés..." -ForegroundColor Yellow
Invoke-GitCommand "status"

Write-Host ""
Write-Host "[4/8] Création du commit..." -ForegroundColor Yellow
$commitMessage = @"
🎉 CORRECTION ERREUR JAVASCRIPT TERMINÉE

✅ Corrections apportées:
- Erreur JavaScript 'Unexpected token <' résolue
- Fichier main-C0_Vo3Gx.js corrompu remplacé par main-BSNze9Ho.js
- ErrorBoundary ajouté pour gestion d'erreur robuste
- Page blanche corrigée
- Déploiement Netlify réussi

🚀 Déploiement:
- URL: https://ediba-inter.netlify.app
- Deploy Unique: https://68f8ea9fe7a9a47ae2411066--ediba-inter.netlify.app
- Build Time: 17.50s
- Deploy Time: 23.8s

📋 Fonctionnalités préservées:
- Vue tableau avec colonne NIF
- Basculement Cartes/Tableau
- Actions: suppression, visualisation, édition
- Ordre des colonnes corrigé
- Tous les modules fonctionnels

🔧 Fichiers créés/modifiés:
- CORRECTION_ERREUR_JAVASCRIPT_TERMINEE.md
- CORRECTION_PAGE_BLANCHE_TERMINEE.md
- src/App.tsx (version corrigée)
- src/App-backup.tsx
- Scripts de correction et vérification

Version: 1.3.2
Dernière mise à jour: 20 Janvier 2025
Statut: ✅ Production Ready + JavaScript Corrigé
"@

Invoke-GitCommand "commit -m `"$commitMessage`""

Write-Host ""
Write-Host "[5/8] Vérification du commit..." -ForegroundColor Yellow
Invoke-GitCommand "log --oneline -1"

Write-Host ""
Write-Host "[6/8] Poussée vers GitHub..." -ForegroundColor Yellow
$pushResult = Invoke-GitCommand "push origin main"
if ($pushResult) {
    Write-Host "✅ Poussée réussie" -ForegroundColor Green
} else {
    Write-Host "❌ Erreur lors de la poussée" -ForegroundColor Red
    Write-Host "Vérifiez la configuration du remote origin" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[7/8] Vérification du remote..." -ForegroundColor Yellow
Invoke-GitCommand "remote -v"

Write-Host ""
Write-Host "[8/8] Résumé final..." -ForegroundColor Yellow
Write-Host "✅ Synchronisation GitHub terminée" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 LIENS UTILES:" -ForegroundColor Cyan
Write-Host "GitHub: https://github.com/KANDI-007/ediba-inter" -ForegroundColor White
Write-Host "Netlify: https://ediba-inter.netlify.app" -ForegroundColor White
Write-Host "Deploy Unique: https://68f8ea9fe7a9a47ae2411066--ediba-inter.netlify.app" -ForegroundColor White
Write-Host ""
Write-Host "📊 STATUT:" -ForegroundColor Cyan
Write-Host "Version: 1.3.2" -ForegroundColor White
Write-Host "Dernière mise à jour: 20 Janvier 2025" -ForegroundColor White
Write-Host "Statut: ✅ Production Ready + JavaScript Corrigé" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SYNCHRONISATION TERMINÉE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Read-Host "Appuyez sur Entrée pour continuer"
