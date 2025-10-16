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

// SVG template pour les icônes
function createIconSVG(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#25C1FF"/>
  <rect x="64" y="64" width="384" height="384" fill="white" rx="32"/>
  <text x="256" y="280" font-family="Arial, sans-serif" font-size="120" font-weight="bold" text-anchor="middle" fill="#25C1FF">E</text>
  <text x="256" y="360" font-family="Arial, sans-serif" font-size="40" text-anchor="middle" fill="#25C1FF">EDIBA</text>
</svg>`;
}

async function createIcons() {
  try {
    console.log('🎨 Création des icônes PWA...');
    
    // Créer des fichiers SVG pour chaque taille
    for (const size of iconSizes) {
      const svgContent = createIconSVG(size);
      const filename = `icon-${size}x${size}.svg`;
      fs.writeFileSync(path.join(iconsDir, filename), svgContent);
      console.log(`✅ Icône ${size}x${size} créée`);
    }
    
    console.log('🎉 Toutes les icônes PWA ont été créées avec succès !');
    console.log('💡 Note: Pour une meilleure compatibilité, convertissez les SVG en PNG avec un outil comme Inkscape ou un service en ligne.');
  } catch (error) {
    console.error('❌ Erreur lors de la création des icônes:', error);
    process.exit(1);
  }
}

createIcons();
