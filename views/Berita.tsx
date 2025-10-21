import React, { useState, useEffect } from 'react';
import { View } from '../types';
import SectionTitle from '../components/SectionTitle';
import NewsCard from '../components/NewsCard';
import { newsService, NewsArticle, NewsCategory } from '../src/services/newsService';

interface BeritaProps {
  setCurrentView: (view: View) => void;
}

const ArticleDetailView: React.FC<{ article: NewsArticle; onBack: () => void; }> = ({ article, onBack }) => (
    <div className="animate-fade-in">
        <div className="container mx-auto px-6 py-8">
            <button onClick={onBack} className="flex items-center text-gray-600 hover:text-blue-600 font-semibold mb-6">
                <span className="material-symbols-outlined mr-2">arrow_back</span>
                Kembali ke Semua Berita
            </button>
        </div>

        <section className="relative h-64 md:h-96 bg-cover bg-center" style={{ backgroundImage: `url('${article.image.replace("400/300", "1200/500")}')` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>
        </section>
        
        <div className="container mx-auto px-6 -mt-16 relative z-10">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                     <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">{article.category}</span>
                     <span className="text-sm text-gray-500">{article.date}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-6">{article.title}</h1>
                <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                    {article.fullContent}
                </div>
            </div>
        </div>
    </div>
);


const Berita: React.FC<BeritaProps> = ({ setCurrentView }) => {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  // Load articles and categories on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [articlesData, categoriesData] = await Promise.all([
          newsService.getArticles({ limit: 12 }),
          newsService.getCategories()
        ]);

        setArticles(articlesData.articles);
        setCategories(categoriesData);
      } catch (err: any) {
        console.error('Error loading news data:', err);
        setError('Gagal memuat berita. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter articles based on search and category
  const filteredArticles = articles.filter(article => {
    const matchesSearch = !searchTerm || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'Semua' || 
      article.category_slug === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleReadMore = (article: NewsArticle) => {
    setSelectedArticle(article);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedArticle(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by filteredArticles
  };

  if (selectedArticle) {
    return <ArticleDetailView article={selectedArticle} onBack={handleBackToList} />;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12 animate-fade-in">
        <SectionTitle 
          title="Berita & Kegiatan Terbaru"
          subtitle="Memuat berita terbaru..."
        />
        <div className="flex justify-center items-center py-12">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-12 animate-fade-in">
        <SectionTitle 
          title="Berita & Kegiatan Terbaru"
          subtitle="Terjadi kesalahan saat memuat berita"
        />
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 animate-fade-in">
      <SectionTitle 
        title="Berita & Kegiatan Terbaru"
        subtitle="Ikuti perkembangan, inovasi, dan kisah sukses dari ekosistem digital Tangerang Selatan."
      />

      {/* Search and Filter */}
      <div className="mt-8 mb-8">
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Cari berita..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Semua">Semua Kategori</option>
                {categories.map(category => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <NewsCard 
              key={article.id} 
              article={article} 
              onReadMoreClick={() => handleReadMore(article)} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Tidak ada berita yang ditemukan.</p>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              Hapus pencarian
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Berita;