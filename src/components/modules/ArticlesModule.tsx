import React, { useMemo, useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Article, ArticleCategory } from '../../contexts/DataContext';
import ArticleModal from '../ArticleModal';
import ArticleCategoryModal from '../ArticleCategoryModal';
import CategoryView from '../CategoryView';
import { 
  Plus, 
  Search, 
  Filter, 
  Package, 
  Edit3, 
  Trash2, 
  Eye, 
  Grid, 
  List, 
  Tag,
  ShoppingCart,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  X
} from 'lucide-react';

const ArticlesModule: React.FC = () => {
  const {
    articles,
    articleCategories,
    addAdvancedArticle,
    updateAdvancedArticle,
    deleteAdvancedArticle,
    addArticleCategory,
    updateArticleCategory,
    deleteArticleCategory
  } = useData() as any;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editingCategory, setEditingCategory] = useState<ArticleCategory | null>(null);
  const [selectedCategoryView, setSelectedCategoryView] = useState<ArticleCategory | null>(null);
  const [preSelectedCategoryId, setPreSelectedCategoryId] = useState<string | null>(null);
  const [showInlineForm, setShowInlineForm] = useState(false);
  const [editingArticleInline, setEditingArticleInline] = useState<Article | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock' | 'date' | 'domain'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Récupérer tous les domaines uniques
  const uniqueDomains = useMemo(() => {
    const domains = new Set<string>();
    articles.forEach((article: Article) => {
      if (article.domain) {
        domains.add(article.domain);
      }
    });
    return Array.from(domains).sort();
  }, [articles]);

  // Filtrage et tri des articles
  const filteredArticles = useMemo(() => {
    let filtered = articles.filter((article: Article) => {
      const matchesSearch = article.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.domain?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.categoryId?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || article.categoryId === selectedCategory;
      const matchesDomain = !selectedDomain || article.domain === selectedDomain;
      return matchesSearch && matchesCategory && matchesDomain;
    });

    // Tri
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
        case 'domain':
          aValue = (a.domain || '').toLowerCase();
          bValue = (b.domain || '').toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [articles, searchTerm, selectedCategory, selectedDomain, sortBy, sortOrder]);

  // Statistiques
  const stats = useMemo(() => {
    const totalArticles = articles.length;
    const totalValue = articles.reduce((sum: number, article: Article) => 
      sum + ((article.unitPrice || 0) * (article.stock || 0)), 0);
    const lowStock = articles.filter((article: Article) => 
      article.stock !== undefined && article.minStock !== undefined && 
      article.stock <= article.minStock).length;
    const outOfStock = articles.filter((article: Article) => 
      article.stock === 0 || article.stock === undefined).length;

    return { totalArticles, totalValue, lowStock, outOfStock };
  }, [articles]);


  // Fonction utilitaire pour calculer les statistiques d'une catégorie
  const getCategoryStats = (categoryId: string) => {
    // Articles directs de cette catégorie
    const directArticles = articles.filter((article: Article) => article.categoryId === categoryId);
    
    // Sous-catégories de cette catégorie
    const subcategories = articleCategories.filter((cat: ArticleCategory) => cat.parentId === categoryId);
    
    // Articles de toutes les sous-catégories
    const subcategoryArticles = subcategories.flatMap((subcat: ArticleCategory) => 
      articles.filter((article: Article) => article.categoryId === subcat.id)
    );
    
    // Tous les articles (directs + sous-catégories)
    const allArticles = [...directArticles, ...subcategoryArticles];
    
    // Calculs
    const totalArticles = allArticles.length;
    const totalValue = allArticles.reduce((sum: number, article: Article) => 
      sum + ((article.unitPrice || 0) * (article.stock || 0)), 0);
    const directCount = directArticles.length;
    const subcategoryCount = subcategoryArticles.length;
    
    return {
      totalArticles,
      totalValue,
      directCount,
      subcategoryCount,
      subcategories: subcategories.length
    };
  };

  // Gestion des catégories
  const handleAddCategory = (categoryData: Omit<ArticleCategory, 'id' | 'dateCreation'>) => {
    addArticleCategory(categoryData);
    setShowCategoryModal(false);
  };

  const handleUpdateCategory = (id: string, categoryData: Partial<Omit<ArticleCategory, 'id' | 'dateCreation'>>) => {
    updateArticleCategory(id, categoryData);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ? Les articles associés seront déclassés.')) {
      deleteArticleCategory(id);
    }
  };

  const handleCategoryClick = (category: ArticleCategory) => {
    setSelectedCategoryView(category);
  };

  const handleBackFromCategory = () => {
    setSelectedCategoryView(null);
  };

  const handleAddArticleWithCategory = (categoryId?: string) => {
    setPreSelectedCategoryId(categoryId || null);
    setShowInlineForm(true);
  };

  // Gestion des articles
  const handleAddArticle = (articleData: Omit<Article, 'id' | 'dateCreation' | 'lastUpdated'>) => {
    addAdvancedArticle(articleData);
    setShowAddModal(false);
    setPreSelectedCategoryId(null);
  };

  const handleAddArticleInline = (articleData: Omit<Article, 'id' | 'dateCreation' | 'lastUpdated'>) => {
    addAdvancedArticle(articleData);
    setShowInlineForm(false);
    setPreSelectedCategoryId(null);
  };

  const handleCloseInlineForm = () => {
    setShowInlineForm(false);
    setPreSelectedCategoryId(null);
  };

  const handleUpdateArticle = (id: string, articleData: Partial<Omit<Article, 'id' | 'dateCreation' | 'lastUpdated'>>) => {
    updateAdvancedArticle(id, articleData);
    setEditingArticle(null);
  };

  const handleDeleteArticle = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      deleteAdvancedArticle(id);
    }
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


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Si une catégorie est sélectionnée, afficher la vue de catégorie */}
      {selectedCategoryView ? (
          <CategoryView
            selectedCategory={selectedCategoryView}
            onBack={handleBackFromCategory}
            onEditArticle={setEditingArticle}
            onDeleteArticle={handleDeleteArticle}
            onAddArticle={handleAddArticleWithCategory}
            articles={articles}
          />
      ) : (
        <>
      {/* Header avec statistiques */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Répertoire d'Articles</h1>
              <p className="text-gray-600 mt-1">Gérez vos articles par catégorie de manière organisée</p>
            </div>
                   <div className="flex items-center space-x-3">
                     <button
                       onClick={() => setShowCategoryModal(true)}
                       className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                     >
                       <Tag className="w-4 h-4 mr-2" />
                       Gérer Catégories
                     </button>
                     <button
                       onClick={() => handleAddArticleWithCategory()}
                       className="flex items-center px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
                     >
                       <Plus className="w-4 h-4 mr-2" />
                       Nouvel Article
                     </button>
                   </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Articles</p>
                  <p className="text-2xl font-bold">{stats.totalArticles}</p>
                </div>
                <Package className="w-8 h-8 text-blue-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Valeur Totale</p>
                  <p className="text-2xl font-bold">{stats.totalValue.toLocaleString()} FCFA</p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Stock Faible</p>
                  <p className="text-2xl font-bold">{stats.lowStock}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Rupture Stock</p>
                  <p className="text-2xl font-bold">{stats.outOfStock}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-200" />
              </div>
            </div>
          </div>
        </div>
      </div>

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
                  placeholder="Rechercher des articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                />
              </div>
            </div>

            {/* Filtre par catégorie */}
            <div className="lg:w-64">
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              >
                <option value="">Toutes les catégories</option>
                {articleCategories
                  .filter((cat: ArticleCategory) => !cat.parentId) // Catégories principales seulement
                  .map((category: ArticleCategory) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Filtre par domaine */}
            {uniqueDomains.length > 0 && (
              <div className="lg:w-64">
                <select
                  value={selectedDomain || ''}
                  onChange={(e) => setSelectedDomain(e.target.value || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                >
                  <option value="">Tous les domaines</option>
                  {uniqueDomains.map((domain: string) => (
                    <option key={domain} value={domain}>
                      {domain}
                    </option>
                  ))}
                </select>
              </div>
            )}


            {/* Tri */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              >
                <option value="name">Nom</option>
                <option value="price">Prix</option>
                <option value="stock">Stock</option>
                <option value="domain">Domaine</option>
                <option value="date">Date</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>

            {/* Mode d'affichage */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-brand-blue text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-brand-blue text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Formulaire d'ajout d'article en ligne */}
        {showInlineForm && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Ajouter un nouvel article
                {preSelectedCategoryId && (
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    dans {articleCategories.find(cat => cat.id === preSelectedCategoryId)?.name || 'Catégorie sélectionnée'}
                  </span>
                )}
              </h3>
              <button
                onClick={handleCloseInlineForm}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <ArticleModal
              isOpen={true}
              onClose={handleCloseInlineForm}
              onSave={handleAddArticleInline}
              preSelectedCategoryId={preSelectedCategoryId}
              articleCategories={articleCategories}
              articles={articles}
              inline={true}
            />
          </div>
        )}

        {/* Formulaire de modification d'article en ligne */}
        {editingArticleInline && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
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
                articles={articles}
                inline={true}
              />
            </div>
          </div>
        )}

        {/* Liste des catégories */}
        {articleCategories.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Catégories d'Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {articleCategories
                .filter((cat: ArticleCategory) => !cat.parentId) // Catégories principales seulement
                .map((category: ArticleCategory) => {
                  const stats = getCategoryStats(category.id);
                  
                        return (
                          <div 
                            key={category.id} 
                            className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow cursor-pointer group"
                            onClick={() => handleCategoryClick(category)}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                                <span className="text-lg">{category.icon}</span>
                              </div>
                              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingCategory(category);
                                  }}
                                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteCategory(category.id);
                                  }}
                                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-brand-blue transition-colors">{category.name}</h4>
                            {category.description && (
                              <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                            )}
                            
                            {/* Statistiques détaillées */}
                            <div className="space-y-2 mb-3">
                              <div className="flex justify-between text-sm">
                                <span className="flex items-center text-gray-600">
                                  <Package className="w-3 h-3 mr-1" />
                                  Total: {stats.totalArticles} articles
                                </span>
                                <span className="flex items-center text-gray-600">
                                  <ShoppingCart className="w-3 h-3 mr-1" />
                                  {stats.totalValue.toLocaleString()} FCFA
                                </span>
                              </div>
                              
                              {stats.subcategories > 0 && (
                                <div className="flex justify-between text-xs text-gray-500">
                                  <span>Directs: {stats.directCount}</span>
                                  <span>Sous-catégories: {stats.subcategoryCount}</span>
                                </div>
                              )}
                              
                              {stats.subcategories > 0 && (
                                <div className="text-xs text-gray-500">
                                  {stats.subcategories} sous-catégorie{stats.subcategories > 1 ? 's' : ''}
                                </div>
                              )}
                            </div>
                            
                            <div className="mt-3 text-xs text-brand-blue font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                              Cliquer pour voir les articles →
                            </div>
                          </div>
                        );
                })}
            </div>
          </div>
        )}


        {/* Liste des articles */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              Articles ({filteredArticles.length})
            </h3>
          </div>

          {viewMode === 'grid' ? (
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredArticles.map((article: Article) => {
                  const category = articleCategories.find((c: ArticleCategory) => c.id === article.categoryId);
                  const stockStatus = article.stock === 0 ? 'out' : 
                                   (article.stock !== undefined && article.minStock !== undefined && article.stock <= article.minStock) ? 'low' : 'ok';
                  
                  return (
                    <div key={article.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{article.name}</h4>
                          {article.sku && (
                            <p className="text-xs text-gray-500 mb-1">SKU: {article.sku}</p>
                          )}
                          {category && (
                            <div className="flex items-center mb-2">
                              <div className={`w-3 h-3 rounded-full ${category.color.split(' ')[0]} mr-2`}></div>
                              <span className="text-xs text-gray-600">{category.name}</span>
                            </div>
                          )}
                          {article.domain && (
                            <div className="mb-2">
                              <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                                {article.domain}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleEditArticleInline(article)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(article.id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {article.description && (
                        <p className="text-sm text-gray-600 mb-3">{article.description}</p>
                      )}
                      
                      <div className="space-y-2">
                        {article.unitPrice && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Prix:</span>
                            <span className="font-semibold">{article.unitPrice.toLocaleString()} FCFA</span>
                          </div>
                        )}
                        {(article.lowerLimitPrice || article.upperLimitPrice) && (
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>Fourchette:</span>
                            <span>
                              {article.lowerLimitPrice ? article.lowerLimitPrice.toLocaleString() : '-'} - {article.upperLimitPrice ? article.upperLimitPrice.toLocaleString() : '-'} FCFA
                            </span>
                          </div>
                        )}
                        {article.unit && (
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>Unité:</span>
                            <span className="font-medium">{article.unit}</span>
                          </div>
                        )}
                        
                        {article.stock !== undefined && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Stock:</span>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold">{article.stock}</span>
                              {stockStatus === 'out' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                              {stockStatus === 'low' && <AlertTriangle className="w-4 h-4 text-orange-500" />}
                              {stockStatus === 'ok' && <CheckCircle className="w-4 h-4 text-green-500" />}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Article</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domaine</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredArticles.map((article: Article) => {
                    const category = articleCategories.find((c: ArticleCategory) => c.id === article.categoryId);
                    const stockStatus = article.stock === 0 ? 'out' : 
                                     (article.stock !== undefined && article.minStock !== undefined && article.stock <= article.minStock) ? 'low' : 'ok';
                    
                    return (
                      <tr key={article.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{article.name}</div>
                            {article.sku && (
                              <div className="text-sm text-gray-500">SKU: {article.sku}</div>
                            )}
                            {article.description && (
                              <div className="text-sm text-gray-500">{article.description}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {article.domain ? (
                            <span className="text-sm px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                              {article.domain}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {category ? (
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full ${category.color.split(' ')[0]} mr-2`}></div>
                              <span className="text-sm text-gray-900">{category.name}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">Aucune catégorie</span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            {article.unitPrice ? (
                              <div className="font-semibold">{article.unitPrice.toLocaleString()} FCFA</div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                            {(article.lowerLimitPrice || article.upperLimitPrice) && (
                              <div className="text-xs text-gray-500 mt-1">
                                {article.lowerLimitPrice ? article.lowerLimitPrice.toLocaleString() : '-'} - {article.upperLimitPrice ? article.upperLimitPrice.toLocaleString() : '-'} FCFA
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {article.stock !== undefined ? article.stock : '-'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {stockStatus === 'out' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Rupture
                            </span>
                          )}
                          {stockStatus === 'low' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Faible
                            </span>
                          )}
                          {stockStatus === 'ok' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              OK
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditArticleInline(article)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteArticle(article.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun article trouvé</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || selectedCategory ? 'Aucun article ne correspond à vos critères de recherche.' : 'Commencez par ajouter votre premier article.'}
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un article
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}

      <ArticleModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setPreSelectedCategoryId(null);
        }}
        onSave={handleAddArticle}
        preSelectedCategoryId={preSelectedCategoryId}
        articleCategories={articleCategories}
        articles={articles}
      />

      <ArticleModal
        isOpen={!!editingArticle}
        onClose={() => setEditingArticle(null)}
        onSave={handleAddArticle}
        onUpdate={handleUpdateArticle}
        editingArticle={editingArticle}
        articleCategories={articleCategories}
        articles={articles}
      />

      <ArticleCategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSave={handleAddCategory}
        parentCategories={articleCategories.filter((cat: ArticleCategory) => !cat.parentId)}
      />

      <ArticleCategoryModal
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        onSave={handleAddCategory}
        onUpdate={handleUpdateCategory}
        category={editingCategory}
        parentCategories={articleCategories.filter((cat: ArticleCategory) => !cat.parentId)}
      />
        </>
      )}
    </div>
  );
};

export default ArticlesModule;