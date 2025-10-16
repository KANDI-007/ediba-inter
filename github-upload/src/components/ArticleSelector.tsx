import React, { useState, useMemo } from 'react';
import { Article, ArticleCategory } from '../contexts/DataContext';
import { Search, Package, Tag, ChevronDown, ChevronRight, Plus } from 'lucide-react';

interface ArticleSelectorProps {
  articles: Article[];
  articleCategories: ArticleCategory[];
  onArticleSelect: (article: Article) => void;
  onClose: () => void;
  isOpen: boolean;
}

const ArticleSelector: React.FC<ArticleSelectorProps> = ({
  articles,
  articleCategories,
  onArticleSelect,
  onClose,
  isOpen
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Grouper les articles par catégorie
  const articlesByCategory = useMemo(() => {
    const grouped: Record<string, { category: ArticleCategory | null; articles: Article[] }> = {
      'uncategorized': { category: null, articles: [] }
    };

    // Initialiser avec les catégories principales
    articleCategories
      .filter(cat => !cat.parentId)
      .forEach(cat => {
        grouped[cat.id] = { category: cat, articles: [] };
      });

    // Grouper les articles
    articles.forEach(article => {
      if (article.categoryId) {
        const category = articleCategories.find(cat => cat.id === article.categoryId);
        if (category) {
          // Trouver la catégorie principale
          let mainCategory = category;
          while (mainCategory.parentId) {
            mainCategory = articleCategories.find(cat => cat.id === mainCategory.parentId) || mainCategory;
          }
          
          if (!grouped[mainCategory.id]) {
            grouped[mainCategory.id] = { category: mainCategory, articles: [] };
          }
          grouped[mainCategory.id].articles.push(article);
        }
      } else {
        grouped['uncategorized'].articles.push(article);
      }
    });

    return grouped;
  }, [articles, articleCategories]);

  // Filtrer les articles selon la recherche et la catégorie sélectionnée
  const filteredArticles = useMemo(() => {
    let filtered = articles;

    // Appliquer le filtre de recherche d'abord
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.sku?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Appliquer le filtre de catégorie
    if (selectedCategory) {
      if (selectedCategory === 'uncategorized') {
        filtered = filtered.filter(article => !article.categoryId);
      } else {
        // Trouver la catégorie sélectionnée
        const selectedCat = articleCategories.find(cat => cat.id === selectedCategory);
        
        if (selectedCat) {
          // Si c'est une catégorie principale, inclure tous les articles de cette catégorie et ses sous-catégories
          if (!selectedCat.parentId) {
            // Trouver toutes les sous-catégories de cette catégorie principale
            const subcategories = articleCategories.filter(cat => cat.parentId === selectedCategory);
            const allCategoryIds = [selectedCategory, ...subcategories.map(sub => sub.id)];
            
            filtered = filtered.filter(article => 
              article.categoryId && allCategoryIds.includes(article.categoryId)
            );
          } else {
            // Si c'est une sous-catégorie, filtrer directement par categoryId
            filtered = filtered.filter(article => article.categoryId === selectedCategory);
          }
        }
      }
    }

    return filtered;
  }, [articles, searchTerm, selectedCategory, articleCategories]);

  // Obtenir les sous-catégories d'une catégorie
  const getSubcategories = (categoryId: string) => {
    return articleCategories.filter(cat => cat.parentId === categoryId);
  };

  // Toggle l'expansion d'une catégorie
  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // Gérer la sélection d'un article
  const handleArticleSelect = (article: Article) => {
    onArticleSelect(article);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Sélectionner un article</h3>
                  <p className="text-blue-100">Choisissez un article depuis le répertoire</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <span className="text-white text-xl">×</span>
              </button>
            </div>
          </div>

          <div className="px-6 py-4">
            {/* Barre de recherche */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un article..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Liste des catégories */}
              <div className="lg:col-span-1">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Tag className="w-4 h-4 mr-2" />
                  Catégories
                </h4>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === null
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Tous les articles ({articles.length})
                  </button>
                  
                  {Object.entries(articlesByCategory).map(([categoryId, { category, articles: categoryArticles }]) => {
                    if (categoryArticles.length === 0) return null;
                    
                    const subcategories = getSubcategories(categoryId);
                    const isExpanded = expandedCategories.has(categoryId);
                    
                    return (
                      <div key={categoryId}>
                        <button
                          onClick={() => {
                            if (subcategories.length > 0) {
                              toggleCategory(categoryId);
                            } else {
                              setSelectedCategory(categoryId);
                            }
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                            selectedCategory === categoryId
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <span>{category?.name || 'Sans catégorie'}</span>
                          <div className="flex items-center space-x-1">
                            <span className="text-xs text-gray-500">({categoryArticles.length})</span>
                            {subcategories.length > 0 && (
                              isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                            )}
                          </div>
                        </button>
                        
                        {/* Sous-catégories */}
                        {isExpanded && subcategories.length > 0 && (
                          <div className="ml-4 space-y-1">
                            {subcategories.map(subcat => {
                              const subcatArticles = articles.filter(article => article.categoryId === subcat.id);
                              if (subcatArticles.length === 0) return null;
                              
                              return (
                                <button
                                  key={subcat.id}
                                  onClick={() => setSelectedCategory(subcat.id)}
                                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                    selectedCategory === subcat.id
                                      ? 'bg-blue-100 text-blue-700'
                                      : 'text-gray-600 hover:bg-gray-50'
                                  }`}
                                >
                                  <span className="flex items-center justify-between">
                                    {subcat.name}
                                    <span className="text-xs text-gray-500">({subcatArticles.length})</span>
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Liste des articles */}
              <div className="lg:col-span-2">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Articles ({filteredArticles.length})
                </h4>
                
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {filteredArticles.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>Aucun article trouvé</p>
                    </div>
                  ) : (
                    filteredArticles.map(article => {
                      const category = articleCategories.find(cat => cat.id === article.categoryId);
                      
                      return (
                        <div
                          key={article.id}
                          onClick={() => handleArticleSelect(article)}
                          className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{article.name}</h5>
                              {article.description && (
                                <p className="text-sm text-gray-600 mt-1">{article.description}</p>
                              )}
                              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                {article.sku && (
                                  <span>SKU: {article.sku}</span>
                                )}
                                {category && (
                                  <span className="flex items-center">
                                    <Tag className="w-3 h-3 mr-1" />
                                    {category.name}
                                  </span>
                                )}
                                {article.unitPrice && (
                                  <span className="font-medium text-green-600">
                                    {article.unitPrice.toLocaleString()} FCFA
                                  </span>
                                )}
                              </div>
                            </div>
                            <button className="ml-2 p-1 text-gray-400 hover:text-blue-600 transition-colors">
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleSelector;
