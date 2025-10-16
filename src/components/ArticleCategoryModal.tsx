import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, Tag, Palette, FileText } from 'lucide-react';

interface ArticleCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: {
    id: string;
    name: string;
    description?: string;
    icon: string;
    color: string;
    parentId?: string;
  } | null;
  onSave: (category: {
    name: string;
    description?: string;
    icon: string;
    color: string;
    parentId?: string;
  }) => void;
  parentCategories?: Array<{
    id: string;
    name: string;
  }>;
}

const ArticleCategoryModal: React.FC<ArticleCategoryModalProps> = ({
  isOpen,
  onClose,
  category,
  onSave,
  parentCategories = []
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '📦',
    color: 'bg-gray-100 text-gray-800',
    parentId: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const colorOptions = [
    { value: 'bg-red-100 text-red-800', label: 'Rouge', preview: '🔴' },
    { value: 'bg-blue-100 text-blue-800', label: 'Bleu', preview: '🔵' },
    { value: 'bg-green-100 text-green-800', label: 'Vert', preview: '🟢' },
    { value: 'bg-yellow-100 text-yellow-800', label: 'Jaune', preview: '🟡' },
    { value: 'bg-purple-100 text-purple-800', label: 'Violet', preview: '🟣' },
    { value: 'bg-pink-100 text-pink-800', label: 'Rose', preview: '🩷' },
    { value: 'bg-indigo-100 text-indigo-800', label: 'Indigo', preview: '🟦' },
    { value: 'bg-gray-100 text-gray-800', label: 'Gris', preview: '⚫' },
    { value: 'bg-amber-100 text-amber-800', label: 'Ambre', preview: '🟠' },
    { value: 'bg-teal-100 text-teal-800', label: 'Sarcelle', preview: '🟢' },
    { value: 'bg-cyan-100 text-cyan-800', label: 'Cyan', preview: '🔵' },
    { value: 'bg-orange-100 text-orange-800', label: 'Orange', preview: '🟠' }
  ];

  const iconOptions = [
    '🪑', '💻', '🗂️', '📦', '📄', '✏️', '📁', '✉️', '📎', '🔧', '🎨', '🌳',
    '✨', '🛠️', '🖨️', '💾', '📊', '📋', '📌', '📝', '📐', '📏', '🔍', '⭐',
    '🏷️', '📌', '📑', '📒', '📓', '📔', '📕', '📗', '📘', '📙', '📚', '📛'
  ];

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || '',
        icon: category.icon,
        color: category.color,
        parentId: category.parentId || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        icon: '📦',
        color: 'bg-gray-100 text-gray-800',
        parentId: ''
      });
    }
    setErrors({});
  }, [category, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom de la catégorie est requis';
    }

    if (!formData.icon.trim()) {
      newErrors.icon = 'L\'icône est requise';
    }

    if (!formData.color.trim()) {
      newErrors.color = 'La couleur est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        icon: formData.icon,
        color: formData.color,
        parentId: formData.parentId || undefined
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Tag className="w-6 h-6" />
              <h3 className="text-xl font-bold">
                {category ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {/* Nom de la catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de la catégorie *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
                placeholder="Ex: Ameublement, Informatique, Fournitures de bureau"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Description de la catégorie..."
                rows={3}
              />
            </div>

            {/* Catégorie parent */}
            {parentCategories.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie parent (optionnel)
                </label>
                <select
                  value={formData.parentId}
                  onChange={(e) => setFormData({...formData, parentId: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Aucune (catégorie principale)</option>
                  {parentCategories.map((parent) => (
                    <option key={parent.id} value={parent.id}>
                      {parent.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Icône */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icône *
              </label>
              <div className="grid grid-cols-8 gap-2">
                {iconOptions.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setFormData({...formData, icon})}
                    className={`p-3 text-2xl rounded-lg border-2 transition-all duration-200 ${
                      formData.icon === icon
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
              {errors.icon && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.icon}
                </p>
              )}
            </div>

            {/* Couleur */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Couleur *
              </label>
              <div className="grid grid-cols-4 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setFormData({...formData, color: color.value})}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center justify-center space-x-2 ${
                      formData.color === color.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-lg">{color.preview}</span>
                    <span className="text-sm font-medium">{color.label}</span>
                  </button>
                ))}
              </div>
              {errors.color && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.color}
                </p>
              )}
            </div>

            {/* Aperçu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aperçu
              </label>
              <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${formData.color}`}>
                    {formData.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{formData.name || 'Nom de la catégorie'}</h4>
                    {formData.description && (
                      <p className="text-sm text-gray-600">{formData.description}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{category ? 'Modifier' : 'Créer'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleCategoryModal;
