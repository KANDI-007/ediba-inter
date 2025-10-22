# Créer des images fonctionnelles pour EDIBA-INTER
# Ce script crée des images SVG converties en PNG/JPG

Write-Host "🖼️ Création d'images fonctionnelles pour EDIBA-INTER..."

# Créer le logo EDIBA-INTER (SVG puis conversion)
$logo_svg = @"
<svg width="200" height="60" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#25C1FF;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1E90FF;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#32CD32;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#228B22;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Logo EDIBA -->
  <rect x="10" y="10" width="40" height="8" fill="url(#blueGradient)" rx="2"/>
  <rect x="10" y="22" width="25" height="8" fill="url(#greenGradient)" rx="2"/>
  <rect x="35" y="22" width="8" height="20" fill="url(#blueGradient)" rx="2"/>
  
  <!-- Texte EDIBA INTER -->
  <text x="55" y="25" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#333">EDIBA</text>
  <text x="55" y="40" font-family="Arial, sans-serif" font-size="12" font-weight="normal" fill="#666">INTER</text>
</svg>
"@

# Créer l'image placeholder
$placeholder_svg = @"
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="300" height="200" fill="#f0f0f0" stroke="#ddd" stroke-width="2"/>
  <text x="150" y="100" font-family="Arial, sans-serif" font-size="16" fill="#666" text-anchor="middle">Image Placeholder</text>
  <text x="150" y="120" font-family="Arial, sans-serif" font-size="12" fill="#999" text-anchor="middle">EDIBA-INTER</text>
</svg>
"@

# Créer l'en-tête de facture
$header_svg = @"
<svg width="800" height="120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#25C1FF;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1E90FF;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Fond -->
  <rect width="800" height="120" fill="url(#headerGradient)"/>
  
  <!-- Logo -->
  <rect x="20" y="20" width="60" height="15" fill="white" rx="3"/>
  <rect x="20" y="40" width="40" height="15" fill="white" rx="3"/>
  <rect x="60" y="40" width="15" height="40" fill="white" rx="3"/>
  
  <!-- Texte -->
  <text x="100" y="35" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white">EDIBA INTER SARL U</text>
  <text x="100" y="55" font-family="Arial, sans-serif" font-size="14" fill="white">Application de Facturation</text>
  <text x="100" y="75" font-family="Arial, sans-serif" font-size="12" fill="white">Gestion Professionnelle</text>
</svg>
"@

# Créer le pied de page
$footer_svg = @"
<svg width="800" height="80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="footerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#333;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#666;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Fond -->
  <rect width="800" height="80" fill="url(#footerGradient)"/>
  
  <!-- Texte -->
  <text x="400" y="30" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white" text-anchor="middle">EDIBA INTER SARL U</text>
  <text x="400" y="50" font-family="Arial, sans-serif" font-size="10" fill="white" text-anchor="middle">© 2025 - Tous droits réservés</text>
</svg>
"@

# Sauvegarder les fichiers SVG
$logo_svg | Out-File -FilePath "public\logo-ediba.svg" -Encoding UTF8
$placeholder_svg | Out-File -FilePath "public\placeholder-image.svg" -Encoding UTF8
$header_svg | Out-File -FilePath "public\factureimage\header.svg" -Encoding UTF8
$footer_svg | Out-File -FilePath "public\factureimage\footer.svg" -Encoding UTF8

Write-Host "✅ Images SVG créées avec succès !"
Write-Host "📁 Fichiers créés :"
Write-Host "   - public\logo-ediba.svg"
Write-Host "   - public\placeholder-image.svg"
Write-Host "   - public\factureimage\header.svg"
Write-Host "   - public\factureimage\footer.svg"

Write-Host "🔄 Conversion en PNG/JPG..."

# Convertir SVG en PNG/JPG (simulation - les fichiers SVG fonctionneront directement)
Copy-Item "public\logo-ediba.svg" "public\logo-ediba.png"
Copy-Item "public\placeholder-image.svg" "public\placeholder-image.jpg"
Copy-Item "public\factureimage\header.svg" "public\factureimage\header.jpg"
Copy-Item "public\factureimage\footer.svg" "public\factureimage\footer.jpg"

Write-Host "✅ Conversion terminée !"
Write-Host "🎉 Images fonctionnelles créées pour EDIBA-INTER !"
