import React from 'react';
import { NewsArticle } from '../src/services/newsService';

interface NewsCardProps {
  article: NewsArticle;
  onReadMoreClick: () => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, onReadMoreClick }) => {
    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden group border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">
            <div className="overflow-hidden">
                <img 
                    src={article.image_url || 'https://picsum.photos/400/300?random=' + Math.random()} 
                    alt={article.title} 
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" 
                />
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-center text-sm text-gray-500">
                    <span 
                        className="font-semibold px-2 py-1 rounded-full text-xs"
                        style={{ 
                            backgroundColor: article.category_color + '20', 
                            color: article.category_color 
                        }}
                    >
                        {article.category_name}
                    </span>
                    <p>{formatDate(article.published_at)}</p>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mt-2 flex-grow">{article.title}</h3>
                <p className="text-gray-600 text-sm mt-2">{article.excerpt}</p>
                <div className="flex justify-between items-center mt-4">
                    <button 
                        onClick={onReadMoreClick} 
                        className="font-semibold text-blue-600 hover:text-blue-800 self-start flex items-center focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
                    >
                        Baca Selengkapnya <span className="material-symbols-outlined ml-1">arrow_forward</span>
                    </button>
                    <div className="flex items-center text-xs text-gray-400">
                        <span className="material-symbols-outlined mr-1 text-sm">visibility</span>
                        {article.view_count}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsCard;