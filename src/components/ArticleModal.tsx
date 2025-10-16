import React, { useState, useEffect } from 'react';
import { Article, ArticleCategory } from '../contexts/DataContext';
import { X, Package, Tag, DollarSign, Box, AlertTriangle } from 'lucide-react';

interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (article: Omit<Article, 'id' | 'dateCreation' | 'lastUpdated'>) => void;
  onUpdate?: (id: string, article: Partial<Omit<Article, 'id' | 'dateCreation' | 'lastUpdated'>>) => void;
  editingArticle?: Article | null;
  articleCategories?: ArticleCategory[];
  preSelectedCategoryId?: string | null;
  inline?: boolean; // Nouvelle prop pour afficher en mode inline
  articles?: Article[]; // Pour la validation des SKU
}

const ArticleModal: React.FC<ArticleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  editingArticle,
  articleCategories = [],
  preSelectedCategoryId,
  inline = false,
  articles = []
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    unitPrice: '',
    categoryId: '',
    sku: '',
    supplier: '',
    stock: '',
    minStock: '',
    maxStock: '',
    unit: 'pièce',
    weight: '',
    dimensions: '',
    notes: '',
    brand: '',
    model: '',
    material: '',
    color: '',
    size: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pré-sélectionner la catégorie si fournie
  useEffect(() => {
    if (preSelectedCategoryId) {
      setFormData(prev => ({ ...prev, categoryId: preSelectedCategoryId }));
    }
  }, [preSelectedCategoryId]);

  const units = [
    'pièce', 'kg', 'g', 'L', 'mL', 'm', 'cm', 'mm', 'm²', 'cm²', 'm³', 'cm³',
    'paquet', 'boîte', 'carton', 'rouleau', 'mètre', 'litre', 'tonne'
  ];

  useEffect(() => {
    if (editingArticle) {
      setFormData({
        name: editingArticle.name,
        description: editingArticle.description || '',
        unitPrice: editingArticle.unitPrice?.toString() || '',
        categoryId: editingArticle.categoryId || '',
        sku: editingArticle.sku || '',
        supplier: editingArticle.supplier || '',
        stock: editingArticle.stock?.toString() || '',
        minStock: editingArticle.minStock?.toString() || '',
        maxStock: editingArticle.maxStock?.toString() || '',
        unit: editingArticle.unit || 'pièce',
        weight: editingArticle.weight?.toString() || '',
        dimensions: editingArticle.dimensions || '',
        notes: editingArticle.notes || '',
        brand: editingArticle.brand || '',
        model: editingArticle.model || '',
        material: editingArticle.material || '',
        color: editingArticle.color || '',
        size: editingArticle.size || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        unitPrice: '',
        categoryId: preSelectedCategoryId || '',
        sku: '',
        supplier: '',
        stock: '',
        minStock: '',
        maxStock: '',
        unit: 'pièce',
        weight: '',
        dimensions: '',
        notes: '',
        brand: '',
        model: '',
        material: '',
        color: '',
        size: ''
      });
    }
    setErrors({});
  }, [editingArticle, isOpen, preSelectedCategoryId]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom de l\'article est requis';
    }

    if (formData.unitPrice && (isNaN(Number(formData.unitPrice)) || Number(formData.unitPrice) < 0)) {
      newErrors.unitPrice = 'Le prix unitaire doit être un nombre positif';
    }

    if (formData.stock && (isNaN(Number(formData.stock)) || Number(formData.stock) < 0)) {
      newErrors.stock = 'Le stock doit être un nombre positif';
    }

    if (formData.minStock && (isNaN(Number(formData.minStock)) || Number(formData.minStock) < 0)) {
      newErrors.minStock = 'Le stock minimum doit être un nombre positif';
    }

    if (formData.maxStock && (isNaN(Number(formData.maxStock)) || Number(formData.maxStock) < 0)) {
      newErrors.maxStock = 'Le stock maximum doit être un nombre positif';
    }

    if (formData.weight && (isNaN(Number(formData.weight)) || Number(formData.weight) < 0)) {
      newErrors.weight = 'Le poids doit être un nombre positif';
    }

    // Validation des stocks min/max
    if (formData.minStock && formData.maxStock) {
      const minStock = Number(formData.minStock);
      const maxStock = Number(formData.maxStock);
      if (minStock > maxStock) {
        newErrors.maxStock = 'Le stock maximum doit être supérieur au stock minimum';
      }
    }

    // Validation spécifique pour la modification
    if (editingArticle) {
      // Vérifier si le SKU existe déjà (sauf pour l'article en cours de modification)
      if (formData.sku.trim()) {
        const existingArticle = articles?.find(article => 
          article.sku === formData.sku.trim() && article.id !== editingArticle.id
        );
        if (existingArticle) {
          newErrors.sku = 'Ce SKU existe déjà pour un autre article';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const articleData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        unitPrice: formData.unitPrice ? Number(formData.unitPrice) : undefined,
        categoryId: formData.categoryId || undefined,
        sku: formData.sku.trim() || undefined,
        supplier: formData.supplier.trim() || undefined,
        stock: formData.stock ? Number(formData.stock) : undefined,
        minStock: formData.minStock ? Number(formData.minStock) : undefined,
        maxStock: formData.maxStock ? Number(formData.maxStock) : undefined,
        unit: formData.unit,
        weight: formData.weight ? Number(formData.weight) : undefined,
        dimensions: formData.dimensions.trim() || undefined,
        notes: formData.notes.trim() || undefined,
        brand: formData.brand.trim() || undefined,
        model: formData.model.trim() || undefined,
        material: formData.material.trim() || undefined,
        color: formData.color.trim() || undefined,
        size: formData.size.trim() || undefined
      };

      if (editingArticle && onUpdate) {
        onUpdate(editingArticle.id, articleData);
      } else {
        onSave(articleData);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setErrors({ submit: 'Une erreur est survenue lors de la sauvegarde' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Ne réinitialiser le formulaire que si on n'est pas en train d'éditer
    if (!editingArticle) {
      setFormData({
        name: '',
        description: '',
        unitPrice: '',
        categoryId: '',
        sku: '',
        supplier: '',
        stock: '',
        minStock: '',
        maxStock: '',
        unit: 'pièce',
        weight: '',
        dimensions: '',
        notes: '',
        brand: '',
        model: '',
        material: '',
        color: '',
        size: ''
      });
    }
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  // Contenu du formulaire
  const formContent = (
    <div className={`${inline ? 'w-full' : 'w-full max-w-4xl mx-auto'} bg-white rounded-xl shadow-lg overflow-hidden`}>
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
                   <div>
                     <h2 className="text-xl font-bold">
                       {editingArticle ? 'Modifier l\'article' : 'Nouvel article'}
                     </h2>
                     <p className="text-blue-100">
                       {editingArticle 
                         ? `Modifiez les informations de "${editingArticle.name}"` 
                         : 'Ajoutez un nouvel article à votre inventaire'
                       }
                     </p>
                     {editingArticle && (
                       <div className="mt-2 text-sm text-blue-200">
                         Dernière modification: {new Date(editingArticle.lastUpdated).toLocaleDateString('fr-FR')}
                       </div>
                     )}
                   </div>
          </div>
          {!inline && (
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      {/* Contenu du formulaire */}
      <div className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Informations de base */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'article *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Nom de l'article"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SKU
                </label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Code SKU"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Description de l'article"
              />
            </div>

            {/* Prix et stock */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix unitaire (FCFA)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.unitPrice ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {errors.unitPrice && (
                  <p className="mt-1 text-sm text-red-600">{errors.unitPrice}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock actuel
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.stock ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0"
                />
                {errors.stock && (
                  <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unité
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Stock min/max */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock minimum
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.minStock}
                  onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.minStock ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0"
                />
                {errors.minStock && (
                  <p className="mt-1 text-sm text-red-600">{errors.minStock}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock maximum
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.maxStock}
                  onChange={(e) => setFormData({ ...formData, maxStock: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.maxStock ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0"
                />
                {errors.maxStock && (
                  <p className="mt-1 text-sm text-red-600">{errors.maxStock}</p>
                )}
              </div>
            </div>

            {/* Classification */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select
                  value={formData.categoryId || ''}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {(articleCategories || []).map(category => (
                    <option key={category.id} value={category.id}>{category.icon} {category.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marque
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Marque de l'article"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Modèle
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Modèle de l'article"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Matériau
                </label>
                <input
                  type="text"
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Matériau de l'article"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Couleur
                </label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Couleur de l'article"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Taille
                </label>
                <input
                  type="text"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Taille de l'article"
                />
              </div>
            </div>

            {/* Fournisseur */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fournisseur
              </label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nom du fournisseur"
              />
            </div>

            {/* Dimensions et poids */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dimensions
                </label>
                <input
                  type="text"
                  value={formData.dimensions}
                  onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 10x20x30 cm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Poids (kg)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.weight ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {errors.weight && (
                  <p className="mt-1 text-sm text-red-600">{errors.weight}</p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Notes supplémentaires sur l'article"
              />
            </div>
          </div>

          {/* Affichage des erreurs de soumission */}
          {errors.submit && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
                <p className="text-sm text-red-700">{errors.submit}</p>
              </div>
            </div>
          )}

          {/* Boutons d'action */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                editingArticle 
                  ? 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500' 
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {editingArticle ? 'Modification...' : 'Création...'}
                </span>
              ) : (
                editingArticle ? '✓ Modifier' : '+ Créer'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Retourner le contenu selon le mode
  if (inline) {
    return formContent;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleClose}></div>
        {formContent}
      </div>
    </div>
  );
};

export default ArticleModal;