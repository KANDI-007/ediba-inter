// Module centralisé pour les images EDIBA-INTER
// Solution avancée pour l'affichage des images sur Netlify

export const images = {
  // Logo principal
  logo: '/logo-ediba.png',
  
  // Images de fallback
  defaultAvatar: '/default-avatar.png',
  placeholder: '/placeholder-image.jpg',
  
  // Images de layout
  entete: '/entete.png',
  pied: '/pied.png',
  
  // Images de facture
  header: '/factureimage/header.jpg',
  footer: '/factureimage/footer.jpg',
  
  // Icônes PWA
  icon192: '/icons/icon-192x192.svg',
  icon512: '/icons/icon-512x512.svg',
  
  // Images supplémentaires
  webp1: '/OIP (1) copy.webp',
  webp2: '/OIP (1) copy copy.webp'
} as const;

// Fonction utilitaire pour obtenir une image avec fallback
export const getImage = (imageKey: keyof typeof images, fallback?: string): string => {
  const image = images[imageKey];
  return image || fallback || images.defaultAvatar;
};

// Fonction pour vérifier si une image existe
export const imageExists = (imageKey: keyof typeof images): boolean => {
  return !!images[imageKey];
};

// Types pour TypeScript
export type ImageKey = keyof typeof images;

// Export par défaut
export default images;
