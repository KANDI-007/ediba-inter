# Creer des icones SVG magnifiques pour EDIBA-INTER
Write-Host "Creation d'icones SVG magnifiques pour EDIBA-INTER..."

# Logo EDIBA-INTER moderne
$logo_svg = @"
<svg width="200" height="60" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#1D4ED8;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1E40AF;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#10B981;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#059669;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#047857;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#7C3AED;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.3"/>
    </filter>
  </defs>
  
  <rect x="5" y="5" width="190" height="50" fill="url(#blueGradient)" rx="12" filter="url(#shadow)"/>
  
  <circle cx="30" cy="30" r="12" fill="white" opacity="0.9"/>
  <rect x="22" y="22" width="16" height="4" fill="url(#greenGradient)" rx="2"/>
  <rect x="22" y="28" width="12" height="4" fill="url(#purpleGradient)" rx="2"/>
  <rect x="34" y="28" width="4" height="12" fill="url(#greenGradient)" rx="2"/>
  
  <text x="55" y="25" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="white">EDIBA</text>
  <text x="55" y="42" font-family="Arial, sans-serif" font-size="12" font-weight="normal" fill="white" opacity="0.9">INTER</text>
  
  <circle cx="170" cy="20" r="2" fill="white" opacity="0.6"/>
  <circle cx="180" cy="35" r="1.5" fill="white" opacity="0.4"/>
  <circle cx="175" cy="45" r="1" fill="white" opacity="0.3"/>
</svg>
"@

# Placeholder magnifique
$placeholder_svg = @"
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#F8FAFC;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#E2E8F0;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1D4ED8;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <rect width="300" height="200" fill="url(#bgGradient)" rx="12"/>
  <rect x="2" y="2" width="296" height="196" fill="none" stroke="#CBD5E1" stroke-width="2" rx="12"/>
  
  <circle cx="150" cy="80" r="25" fill="url(#iconGradient)" opacity="0.1"/>
  <circle cx="150" cy="80" r="20" fill="url(#iconGradient)" opacity="0.2"/>
  <circle cx="150" cy="80" r="15" fill="url(#iconGradient)"/>
  
  <rect x="140" y="70" width="20" height="15" fill="white" rx="2"/>
  <circle cx="145" cy="75" r="2" fill="url(#iconGradient)"/>
  <path d="M140 80 L150 75 L160 80 L160 85 L140 85 Z" fill="white"/>
  
  <text x="150" y="120" font-family="Arial, sans-serif" font-size="16" fill="#475569" text-anchor="middle" font-weight="500">Image Placeholder</text>
  <text x="150" y="140" font-family="Arial, sans-serif" font-size="12" fill="#64748B" text-anchor="middle">EDIBA-INTER</text>
  
  <circle cx="50" cy="50" r="3" fill="#3B82F6" opacity="0.3"/>
  <circle cx="250" cy="150" r="2" fill="#10B981" opacity="0.4"/>
  <circle cx="80" cy="160" r="2.5" fill="#8B5CF6" opacity="0.3"/>
</svg>
"@

# En-tete de facture magnifique
$header_svg = @"
<svg width="800" height="120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
      <stop offset="25%" style="stop-color:#1D4ED8;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#1E40AF;stop-opacity:1" />
      <stop offset="75%" style="stop-color:#1E3A8A;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1E40AF;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#F1F5F9;stop-opacity:1" />
    </linearGradient>
    <filter id="headerShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000000" flood-opacity="0.2"/>
    </filter>
  </defs>
  
  <rect width="800" height="120" fill="url(#headerGradient)" filter="url(#headerShadow)"/>
  
  <circle cx="50" cy="30" r="8" fill="white" opacity="0.1"/>
  <circle cx="750" cy="90" r="12" fill="white" opacity="0.08"/>
  <circle cx="100" cy="100" r="6" fill="white" opacity="0.12"/>
  
  <rect x="20" y="20" width="70" height="20" fill="url(#logoGradient)" rx="10" opacity="0.95"/>
  <rect x="20" y="45" width="50" height="20" fill="url(#logoGradient)" rx="10" opacity="0.9"/>
  <rect x="70" y="45" width="20" height="50" fill="url(#logoGradient)" rx="10" opacity="0.9"/>
  
  <circle cx="40" cy="30" r="6" fill="#3B82F6" opacity="0.8"/>
  <rect x="35" y="28" width="10" height="2" fill="white" rx="1"/>
  <rect x="35" y="32" width="6" height="2" fill="white" rx="1"/>
  <rect x="41" y="32" width="2" height="6" fill="white" rx="1"/>
  
  <text x="120" y="35" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="white">EDIBA INTER SARL U</text>
  <text x="120" y="55" font-family="Arial, sans-serif" font-size="14" fill="white" opacity="0.9">Application de Facturation Professionnelle</text>
  <text x="120" y="75" font-family="Arial, sans-serif" font-size="12" fill="white" opacity="0.8">Gestion Moderne et Efficace</text>
  
  <rect x="600" y="20" width="2" height="80" fill="white" opacity="0.3"/>
  <circle cx="650" cy="40" r="3" fill="white" opacity="0.4"/>
  <circle cx="700" cy="80" r="2" fill="white" opacity="0.3"/>
</svg>
"@

# Pied de page elegant
$footer_svg = @"
<svg width="800" height="80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="footerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#1F2937;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#374151;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#111827;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1D4ED8;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <rect width="800" height="80" fill="url(#footerGradient)"/>
  <rect x="0" y="0" width="800" height="3" fill="url(#accentGradient)"/>
  
  <circle cx="100" cy="40" r="15" fill="url(#accentGradient)" opacity="0.1"/>
  <circle cx="700" cy="40" r="20" fill="url(#accentGradient)" opacity="0.08"/>
  
  <text x="400" y="30" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="white" text-anchor="middle">EDIBA INTER SARL U</text>
  <text x="400" y="50" font-family="Arial, sans-serif" font-size="11" fill="#D1D5DB" text-anchor="middle">© 2025 - Tous droits reserves | Application de Facturation Moderne</text>
  
  <circle cx="50" cy="25" r="2" fill="#3B82F6" opacity="0.6"/>
  <circle cx="750" cy="55" r="1.5" fill="#10B981" opacity="0.5"/>
  <circle cx="150" cy="60" r="1" fill="#8B5CF6" opacity="0.4"/>
</svg>
"@

# Avatar par defaut magnifique
$avatar_svg = @"
<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="avatarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#1D4ED8;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1E40AF;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="faceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FEF3C7;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#FDE68A;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <circle cx="50" cy="50" r="50" fill="url(#avatarGradient)"/>
  <circle cx="50" cy="45" r="20" fill="url(#faceGradient)"/>
  
  <circle cx="43" cy="40" r="3" fill="#1F2937"/>
  <circle cx="57" cy="40" r="3" fill="#1F2937"/>
  <circle cx="44" cy="39" r="1" fill="white"/>
  <circle cx="58" cy="39" r="1" fill="white"/>
  
  <path d="M40 50 Q50 58 60 50" stroke="#1F2937" stroke-width="2" fill="none"/>
  
  <rect x="35" y="65" width="30" height="25" fill="url(#avatarGradient)" rx="15"/>
  
  <circle cx="20" cy="20" r="3" fill="white" opacity="0.3"/>
  <circle cx="80" cy="80" r="2" fill="white" opacity="0.2"/>
</svg>
"@

# Sauvegarder tous les fichiers SVG
$logo_svg | Out-File -FilePath "public\logo-ediba.svg" -Encoding UTF8
$placeholder_svg | Out-File -FilePath "public\placeholder-image.svg" -Encoding UTF8
$header_svg | Out-File -FilePath "public\factureimage\header.svg" -Encoding UTF8
$footer_svg | Out-File -FilePath "public\factureimage\footer.svg" -Encoding UTF8
$avatar_svg | Out-File -FilePath "public\default-avatar.svg" -Encoding UTF8

Write-Host "Icônes SVG magnifiques créées !"
Write-Host "Conversion en PNG/JPG..."

# Convertir SVG en PNG/JPG
Copy-Item "public\logo-ediba.svg" "public\logo-ediba.png"
Copy-Item "public\placeholder-image.svg" "public\placeholder-image.jpg"
Copy-Item "public\factureimage\header.svg" "public\factureimage\header.jpg"
Copy-Item "public\factureimage\footer.svg" "public\factureimage\footer.jpg"
Copy-Item "public\default-avatar.svg" "public\default-avatar.png"

Write-Host "Conversion terminée !"
Write-Host "Icônes magnifiques créées pour EDIBA-INTER !"
