import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { Article, ArticleCategory } from '../contexts/DataContext';
import ArticleModal from './ArticleModal';
import {
  ArrowLeft,
  Package,
  Tag,
  ChevronRight,
  ChevronDown,
  Search,
  Filter,
  Grid,
  List,
  Eye,
  Edit3,
  Trash2,
  Plus,
  BarChart3,
  ShoppingCart,
  X
} from 'lucide-react';

interface CategoryViewProps {
  selectedCategory: ArticleCategory | null;
  onBack: () => void;
  onEditArticle?: (article: Article) => void;
  onDeleteArticle?: (article: Article) => void;
  onAddArticle?: (categoryId?: string) => void;
  articles?: Article[];
}

const CategoryView: React.FC<CategoryViewProps> = ({
  selectedCategory,
  onBack,
  onEditArticle,
  onDeleteArticle,
  onAddArticle,
  articles: allArticles = []
}) => {
  const { articles, articleCategories, addAdvancedArticle, updateAdvancedArticle } = useData() as any;
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock' | 'date'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(new Set());
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategoryForAdd, setSelectedCategoryForAdd] = useState<string | null>(null);
  const [editingArticleInline, setEditingArticleInline] = useState<Article | null>(null);

  // Obtenir les sous-catégories de la catégorie sélectionnée
  const subcategories = useMemo(() => {
    if (!selectedCategory) return [];
    return articleCategories.filter((cat: ArticleCategory) => cat.parentId === selectedCategory.id);
  }, [selectedCategory, articleCategories]);

  // Obtenir les articles de la catégorie et de ses sous-catégories
  const categoryArticles = useMemo(() => {
    if (!selectedCategory) return [];
    
    let filtered = articles.filter((article: Article) => {
      const matchesSearch = article.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.sku?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Inclure les articles de la catégorie principale et de ses sous-catégories
      const isInMainCategory = article.categoryId === selectedCategory.id;
      const isInSubcategory = subcategories.some((sub: ArticleCategory) => sub.id === article.categoryId);
      
      return matchesSearch && (isInMainCategory || isInSubcategory);
    });

    // Tri des articles
    filtered.sort((a: Article, b: Article) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = a.unitPrice || 0;
          bValue = b.unitPrice || 0;
          break;
        case 'stock':
          aValue = a.stock || 0;
          bValue = b.stock || 0;
          break;
        case 'date':
          aValue = new Date(a.dateCreation).getTime();
          bValue = new Date(b.dateCreation).getTime();
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [selectedCategory, articles, subcategories, searchTerm, sortBy, sortOrder]);

  // Grouper les articles par sous-catégorie
  const articlesBySubcategory = useMemo(() => {
    const grouped: { [key: string]: Article[] } = {};
    
    // Articles de la catégorie principale
    const mainCategoryArticles = categoryArticles.filter((article: Article) => 
      article.categoryId === selectedCategory?.id
    );
    if (mainCategoryArticles.length > 0) {
      grouped[selectedCategory?.id || 'main'] = mainCategoryArticles;
    }

    // Articles des sous-catégories
    subcategories.forEach((sub: ArticleCategory) => {
      const subArticles = categoryArticles.filter((article: Article) => 
        article.categoryId === sub.id
      );
      if (subArticles.length > 0) {
        grouped[sub.id] = subArticles;
      }
    });

    return grouped;
  }, [categoryArticles, selectedCategory, subcategories]);

  const toggleSubcategory = (subcategoryId: string) => {
    const newExpanded = new Set(expandedSubcategories);
    if (newExpanded.has(subcategoryId)) {
      newExpanded.delete(subcategoryId);
    } else {
      newExpanded.add(subcategoryId);
    }
    setExpandedSubcategories(newExpanded);
  };

  const getCategoryInfo = (categoryId: string) => {
    if (categoryId === selectedCategory?.id) {
      return selectedCategory;
    }
    return subcategories.find((sub: ArticleCategory) => sub.id === categoryId);
  };

  const getTotalValue = (articles: Article[]) => {
    return articles.reduce((sum, article) => sum + ((article.unitPrice || 0) * (article.stock || 0)), 0);
  };

  const getCategoryName = (categoryId: string) => {
    const category = getCategoryInfo(categoryId);
    return category ? category.name : 'Catégorie inconnue';
  };

  // Fonction utilitaire pour calculer les statistiques d'une catégorie
  const getCategoryStats = (categoryId: string) => {
    const categoryArticles = articles.filter((article: Article) => article.categoryId === categoryId);
    const totalValue = getTotalValue(categoryArticles);
    const averagePrice = categoryArticles.length > 0 
      ? totalValue / categoryArticles.reduce((sum, article) => sum + (article.stock || 0), 0)
      : 0;
    
    return {
      totalArticles: categoryArticles.length,
      totalValue,
      averagePrice,
      totalStock: categoryArticles.reduce((sum, article) => sum + (article.stock || 0), 0)
    };
  };

  const handleAddArticleClick = (categoryId: string) => {
    setSelectedCategoryForAdd(categoryId);
    setShowAddForm(true);
  };

  const handleAddArticle = (articleData: Omit<Article, 'id' | 'dateCreation' | 'lastUpdated'>) => {
    addAdvancedArticle(articleData);
    setShowAddForm(false);
    setSelectedCategoryForAdd(null);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
    setSelectedCategoryForAdd(null);
  };

  // Gestion de la modification inline
  const handleEditArticleInline = (article: Article) => {
    setEditingArticleInline(article);
  };

  const handleUpdateArticleInline = (articleData: Omit<Article, 'id' | 'dateCreation' | 'lastUpdated'>) => {
    if (editingArticleInline) {
      updateAdvancedArticle(editingArticleInline.id, articleData);
      setEditingArticleInline(null);
    }
  };

  const handleCloseEditInline = () => {
    setEditingArticleInline(null);
  };

  if (!selectedCategory) return null;

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </button>
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-lg ${selectedCategory.color} flex items-center justify-center text-white`}>
                  <span className="text-2xl">{selectedCategory.icon}</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{selectedCategory.name}</h1>
                  <p className="text-gray-600">{selectedCategory.description}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleAddArticleClick(selectedCategory.id)}
                className="flex items-center px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvel Article
              </button>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <Package className="w-8 h-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-600">Total Articles</p>
                  <p className="text-2xl font-bold text-blue-900">{categoryArticles.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <ShoppingCart className="w-8 h-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-600">Valeur Totale</p>
                  <p className="text-2xl font-bold text-green-900">
                    {getTotalValue(categoryArticles).toLocaleString()} FCFA
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center">
                <Tag className="w-8 h-8 text-purple-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-purple-600">Sous-catégories</p>
                  <p className="text-2xl font-bold text-purple-900">{subcategories.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center">
                <BarChart3 className="w-8 h-8 text-orange-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-orange-600">Stock Moyen</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {categoryArticles.length > 0 
                      ? Math.round(categoryArticles.reduce((sum, article) => sum + (article.stock || 0), 0) / categoryArticles.length)
                      : 0
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire d'ajout d'article */}
      {showAddForm && (
        <div className="px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Ajouter un nouvel article
              {selectedCategoryForAdd && (
                <span className="text-sm font-normal text-gray-600 ml-2">
                  dans {getCategoryName(selectedCategoryForAdd)}
                </span>
              )}
            </h3>
            <button
              onClick={handleCloseAddForm}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <ArticleModal
            isOpen={true}
            onClose={handleCloseAddForm}
            onSave={handleAddArticle}
            preSelectedCategoryId={selectedCategoryForAdd}
            articleCategories={articleCategories}
            articles={allArticles}
            inline={true}
          />
        </div>
      )}

      {/* Formulaire de modification d'article en ligne */}
      {editingArticleInline && (
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6 mx-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Modifier l'article "{editingArticleInline.name}"
            </h3>
            <button
              onClick={handleCloseEditInline}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <ArticleModal
              isOpen={true}
              onClose={handleCloseEditInline}
              onSave={handleUpdateArticleInline}
              onUpdate={handleUpdateArticleInline}
              editingArticle={editingArticleInline}
              articleCategories={articleCategories}
              articles={allArticles}
              inline={true}
            />
          </div>
        </div>
      )}

      <div className="px-6 py-6">
        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher dans cette catégorie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                />
              </div>
            </div>

            {/* Tri */}
            <div className="flex space-x-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              >
                <option value="name">Nom</option>
                <option value="price">Prix</option>
                <option value="stock">Stock</option>
                <option value="date">Date</option>
              </select>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              >
                <option value="asc">Croissant</option>
                <option value="desc">Décroissant</option>
              </select>
            </div>

            {/* Mode d'affichage */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-brand-blue text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-brand-blue text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Affichage des articles par sous-catégorie */}
        <div className="space-y-6">
          {Object.entries(articlesBySubcategory).map(([categoryId, articles]) => {
            const categoryInfo = getCategoryInfo(categoryId);
            const isSubcategory = categoryId !== selectedCategory.id;
            const isExpanded = !isSubcategory || expandedSubcategories.has(categoryId);
            const stats = getCategoryStats(categoryId);

            return (
              <div key={categoryId} className="bg-white rounded-xl shadow-sm border">
                {/* En-tête de la catégorie/sous-catégorie */}
                <div 
                  className="px-6 py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => isSubcategory && toggleSubcategory(categoryId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {isSubcategory && (
                        <div className="flex items-center">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      )}
                      <div className={`w-8 h-8 rounded-lg ${categoryInfo?.color || 'bg-gray-100'} flex items-center justify-center text-white`}>
                        <span className="text-lg">{categoryInfo?.icon || '📦'}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {isSubcategory ? categoryInfo?.name : `${categoryInfo?.name} (Articles principaux)`}
                        </h3>
                        
                        {/* Statistiques détaillées */}
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <div className="flex items-center">
                            <Package className="w-3 h-3 mr-1" />
                            <span>{stats.totalArticles} articles</span>
                          </div>
                          <div className="flex items-center">
                            <ShoppingCart className="w-3 h-3 mr-1" />
                            <span>{stats.totalValue.toLocaleString()} FCFA</span>
                          </div>
                          {stats.totalStock > 0 && (
                            <div className="flex items-center">
                              <BarChart3 className="w-3 h-3 mr-1" />
                              <span>{stats.totalStock} unités</span>
                            </div>
                          )}
                        </div>
                        
                        {stats.averagePrice > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            Prix moyen: {Math.round(stats.averagePrice).toLocaleString()} FCFA/unité
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddArticleClick(categoryId);
                        }}
                        className="flex items-center px-3 py-1.5 bg-brand-blue text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Ajouter
                      </button>
                    </div>
                  </div>
                </div>

                {/* Articles de la catégorie */}
                {isExpanded && (
                  <div className="p-6">
                    {articles.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Aucun article trouvé dans cette catégorie</p>
                      </div>
                    ) : (
                      <div className={viewMode === 'grid' 
                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                        : 'space-y-3'
                      }>
                        {articles.map((article: Article) => (
                          <div
                            key={article.id}
                            className={`bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow ${
                              viewMode === 'list' ? 'flex items-center justify-between' : ''
                            }`}
                          >
                            {viewMode === 'grid' ? (
                              <>
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center space-x-2">
                                    <Package className="w-5 h-5 text-gray-400" />
                                    <span className="text-sm font-medium text-gray-600">{article.sku}</span>
                                  </div>
                                  <div className="flex space-x-1">
                                    <button
                                      onClick={() => handleEditArticleInline(article)}
                                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                    >
                                      <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => onDeleteArticle?.(article)}
                                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{article.name}</h4>
                                {article.description && (
                                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{article.description}</p>
                                )}
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Prix unitaire:</span>
                                    <span className="font-semibold">{article.unitPrice?.toLocaleString()} FCFA</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Stock:</span>
                                    <span className={`font-semibold ${(article.stock || 0) < (article.minStock || 0) ? 'text-red-600' : 'text-green-600'}`}>
                                      {article.stock || 0} {article.unit || 'unités'}
                                    </span>
                                  </div>
                                  {article.material && (
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-600">Matériau:</span>
                                      <span className="font-medium">{article.material}</span>
                                    </div>
                                  )}
                                  {article.color && (
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-600">Couleur:</span>
                                      <span className="font-medium">{article.color}</span>
                                    </div>
                                  )}
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex items-center space-x-4 flex-1">
                                  <Package className="w-5 h-5 text-gray-400" />
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900">{article.name}</h4>
                                    <p className="text-sm text-gray-600">{article.sku} • {article.description}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold text-gray-900">{article.unitPrice?.toLocaleString()} FCFA</p>
                                    <p className="text-sm text-gray-600">{article.stock || 0} {article.unit || 'unités'}</p>
                                  </div>
                                </div>
                                <div className="flex space-x-1">
                                  <button
                                    onClick={() => handleEditArticleInline(article)}
                                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => onDeleteArticle?.(article)}
                                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryView;
