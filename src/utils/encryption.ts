import { config } from '../config/environment';

// Interface pour les données chiffrées
interface EncryptedData {
  data: string;
  iv: string;
  salt: string;
}

// Interface pour les options de chiffrement
interface EncryptionOptions {
  key?: string;
  algorithm?: string;
}

class EncryptionService {
  private readonly algorithm = 'AES-GCM';
  private readonly keyLength = 256;
  private readonly ivLength = 12;
  private readonly saltLength = 16;

  /**
   * Génère une clé de chiffrement à partir d'un mot de passe
   */
  private async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: this.algorithm, length: this.keyLength },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Génère un salt aléatoire
   */
  private generateSalt(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(this.saltLength));
  }

  /**
   * Génère un IV aléatoire
   */
  private generateIV(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(this.ivLength));
  }

  /**
   * Chiffre des données
   */
  async encrypt(data: string, options: EncryptionOptions = {}): Promise<EncryptedData> {
    try {
      const key = options.key || config.security.encryptionKey;
      const salt = this.generateSalt();
      const iv = this.generateIV();
      
      const cryptoKey = await this.deriveKey(key, salt);
      
      const encryptedData = await crypto.subtle.encrypt(
        {
          name: this.algorithm,
          iv: iv
        },
        cryptoKey,
        new TextEncoder().encode(data)
      );

      return {
        data: this.arrayBufferToBase64(encryptedData),
        iv: this.arrayBufferToBase64(iv),
        salt: this.arrayBufferToBase64(salt)
      };
    } catch (error) {
      console.error('Erreur lors du chiffrement:', error);
      throw new Error('Échec du chiffrement des données');
    }
  }

  /**
   * Déchiffre des données
   */
  async decrypt(encryptedData: EncryptedData, options: EncryptionOptions = {}): Promise<string> {
    try {
      const key = options.key || config.security.encryptionKey;
      const salt = this.base64ToArrayBuffer(encryptedData.salt);
      const iv = this.base64ToArrayBuffer(encryptedData.iv);
      const data = this.base64ToArrayBuffer(encryptedData.data);
      
      const cryptoKey = await this.deriveKey(key, salt);
      
      const decryptedData = await crypto.subtle.decrypt(
        {
          name: this.algorithm,
          iv: iv
        },
        cryptoKey,
        data
      );

      return new TextDecoder().decode(decryptedData);
    } catch (error) {
      console.error('Erreur lors du déchiffrement:', error);
      throw new Error('Échec du déchiffrement des données');
    }
  }

  /**
   * Chiffre des données sensibles avant stockage
   */
  async encryptSensitiveData(data: any): Promise<string> {
    const jsonData = JSON.stringify(data);
    const encrypted = await this.encrypt(jsonData);
    return JSON.stringify(encrypted);
  }

  /**
   * Déchiffre des données sensibles après récupération
   */
  async decryptSensitiveData(encryptedString: string): Promise<any> {
    try {
      const encryptedData = JSON.parse(encryptedString);
      const decrypted = await this.decrypt(encryptedData);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Erreur lors du déchiffrement des données sensibles:', error);
      return null;
    }
  }

  /**
   * Chiffre les données utilisateur
   */
  async encryptUserData(userData: any): Promise<string> {
    return this.encryptSensitiveData(userData);
  }

  /**
   * Déchiffre les données utilisateur
   */
  async decryptUserData(encryptedUserData: string): Promise<any> {
    return this.decryptSensitiveData(encryptedUserData);
  }

  /**
   * Chiffre les données de session
   */
  async encryptSessionData(sessionData: any): Promise<string> {
    return this.encryptSensitiveData(sessionData);
  }

  /**
   * Déchiffre les données de session
   */
  async decryptSessionData(encryptedSessionData: string): Promise<any> {
    return this.decryptSensitiveData(encryptedSessionData);
  }

  /**
   * Vérifie l'intégrité des données
   */
  async verifyDataIntegrity(data: string, hash: string): Promise<boolean> {
    try {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
      const computedHash = this.arrayBufferToBase64(hashBuffer);
      return computedHash === hash;
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'intégrité:', error);
      return false;
    }
  }

  /**
   * Génère un hash pour les données
   */
  async generateHash(data: string): Promise<string> {
    try {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
      return this.arrayBufferToBase64(hashBuffer);
    } catch (error) {
      console.error('Erreur lors de la génération du hash:', error);
      throw new Error('Échec de la génération du hash');
    }
  }

  /**
   * Convertit un ArrayBuffer en base64
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  /**
   * Convertit une chaîne base64 en ArrayBuffer
   */
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  /**
   * Génère une clé de chiffrement sécurisée
   */
  generateSecureKey(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return this.arrayBufferToBase64(array.buffer);
  }

  /**
   * Valide une clé de chiffrement
   */
  validateKey(key: string): boolean {
    try {
      // Vérifier que la clé peut être décodée en base64
      atob(key);
      return key.length >= 32; // Longueur minimale
    } catch {
      return false;
    }
  }
}

// Instance singleton
export const encryptionService = new EncryptionService();

// Hook pour utiliser le service de chiffrement
export const useEncryption = () => {
  return {
    encrypt: encryptionService.encrypt.bind(encryptionService),
    decrypt: encryptionService.decrypt.bind(encryptionService),
    encryptSensitiveData: encryptionService.encryptSensitiveData.bind(encryptionService),
    decryptSensitiveData: encryptionService.decryptSensitiveData.bind(encryptionService),
    encryptUserData: encryptionService.encryptUserData.bind(encryptionService),
    decryptUserData: encryptionService.decryptUserData.bind(encryptionService),
    encryptSessionData: encryptionService.encryptSessionData.bind(encryptionService),
    decryptSessionData: encryptionService.decryptSessionData.bind(encryptionService),
    verifyDataIntegrity: encryptionService.verifyDataIntegrity.bind(encryptionService),
    generateHash: encryptionService.generateHash.bind(encryptionService),
    generateSecureKey: encryptionService.generateSecureKey.bind(encryptionService),
    validateKey: encryptionService.validateKey.bind(encryptionService)
  };
};
