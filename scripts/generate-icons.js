import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Créer le dossier icons s'il n'existe pas
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Tailles d'icônes requises pour PWA
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Fonction pour créer une icône SVG simple si aucune icône source n'est fournie
function createDefaultIcon() {
  return `
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" fill="#25C1FF"/>
      <rect x="64" y="64" width="384" height="384" fill="white" rx="32"/>
      <text x="256" y="280" font-family="Arial, sans-serif" font-size="120" font-weight="bold" text-anchor="middle" fill="#25C1FF">E</text>
      <text x="256" y="360" font-family="Arial, sans-serif" font-size="40" text-anchor="middle" fill="#25C1FF">EDIBA</text>
    </svg>
  `;
}

async function generateIcons() {
  try {
    console.log('🎨 Génération des icônes PWA...');
    
    // Créer une icône SVG par défaut
    const svgIcon = createDefaultIcon();
    const svgBuffer = Buffer.from(svgIcon);
    
    // Générer toutes les tailles d'icônes
    for (const size of iconSizes) {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(path.join(iconsDir, `icon-${size}x${size}.png`));
      
      console.log(`✅ Icône ${size}x${size} générée`);
    }
    
    console.log('🎉 Toutes les icônes PWA ont été générées avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de la génération des icônes:', error);
    process.exit(1);
  }
}

generateIcons();
