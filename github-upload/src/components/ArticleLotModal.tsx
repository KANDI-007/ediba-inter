import React, { useState, useEffect } from 'react';
import { ArticleLot } from '../contexts/DataContext';
import { X, Package, Palette, Type } from 'lucide-react';

interface ArticleLotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lot: Omit<ArticleLot, 'id' | 'dateCreation'>) => void;
  onUpdate?: (id: string, lot: Partial<Omit<ArticleLot, 'id' | 'dateCreation'>>) => void;
  editingLot?: ArticleLot | null;
}

const ArticleLotModal: React.FC<ArticleLotModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  editingLot
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: 'bg-blue-500',
    icon: 'Package'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const colors = [
    { name: 'Bleu', value: 'bg-blue-500', preview: 'bg-blue-500' },
    { name: 'Vert', value: 'bg-green-500', preview: 'bg-green-500' },
    { name: 'Violet', value: 'bg-purple-500', preview: 'bg-purple-500' },
    { name: 'Orange', value: 'bg-orange-500', preview: 'bg-orange-500' },
    { name: 'Rose', value: 'bg-pink-500', preview: 'bg-pink-500' },
    { name: 'Indigo', value: 'bg-indigo-500', preview: 'bg-indigo-500' },
    { name: 'Rouge', value: 'bg-red-500', preview: 'bg-red-500' },
    { name: 'Jaune', value: 'bg-yellow-500', preview: 'bg-yellow-500' },
    { name: 'Teal', value: 'bg-teal-500', preview: 'bg-teal-500' },
    { name: 'Cyan', value: 'bg-cyan-500', preview: 'bg-cyan-500' }
  ];

  const icons = [
    'Package', 'ShoppingCart', 'Settings', 'BarChart3', 'Grid', 'Tag',
    'Star', 'AlertTriangle', 'CheckCircle', 'Clock', 'Layers', 'Box',
    'Archive', 'Folder', 'Database', 'Server', 'Cpu', 'HardDrive'
  ];

  useEffect(() => {
    if (editingLot) {
      setFormData({
        name: editingLot.name,
        description: editingLot.description || '',
        color: editingLot.color,
        icon: editingLot.icon
      });
    } else {
      setFormData({
        name: '',
        description: '',
        color: 'bg-blue-500',
        icon: 'Package'
      });
    }
    setErrors({});
  }, [editingLot, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du lot est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (editingLot && onUpdate) {
      onUpdate(editingLot.id, formData);
    } else {
      onSave(formData);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      color: 'bg-blue-500',
      icon: 'Package'
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Package className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="ml-3 text-lg font-medium text-gray-900">
                    {editingLot ? 'Modifier le lot' : 'Nouveau lot d\'articles'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Nom du lot */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du lot *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Matériel informatique"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Description du lot (optionnel)"
                  />
                </div>

                {/* Couleur */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Couleur
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {colors.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: color.value })}
                        className={`relative w-10 h-10 rounded-lg ${color.preview} ${
                          formData.color === color.value ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
                        } hover:scale-110 transition-transform`}
                        title={color.name}
                      >
                        {formData.color === color.value && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Icône */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icône
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {icons.map((iconName) => {
                      const IconComponent = require('lucide-react')[iconName] || Package;
                      return (
                        <button
                          key={iconName}
                          type="button"
                          onClick={() => setFormData({ ...formData, icon: iconName })}
                          className={`relative w-10 h-10 rounded-lg border-2 flex items-center justify-center ${
                            formData.icon === iconName 
                              ? 'border-indigo-500 bg-indigo-50' 
                              : 'border-gray-300 hover:border-gray-400'
                          } transition-colors`}
                          title={iconName}
                        >
                          <IconComponent className="w-5 h-5 text-gray-600" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Aperçu */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aperçu
                  </label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className={`w-8 h-8 rounded-lg ${formData.color} flex items-center justify-center text-white mr-3`}>
                      {(() => {
                        const IconComponent = require('lucide-react')[formData.icon] || Package;
                        return <IconComponent className="w-4 h-4" />;
                      })()}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{formData.name || 'Nom du lot'}</div>
                      {formData.description && (
                        <div className="text-sm text-gray-500">{formData.description}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {editingLot ? 'Modifier' : 'Créer'}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ArticleLotModal;
