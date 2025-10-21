import React, { useState, useEffect, useMemo } from 'react';
import { View, SearchResult } from '../types';
import { MOCK_UMKM_DATA, ALL_NEWS_ARTICLES, MOCK_COURSES_SEARCH } from '../constants';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  setCurrentView: (view: View) => void;
}

// Custom hook for debouncing
const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};

const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose, setCurrentView }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const debouncedQuery = useDebounce(query, 300);

    useEffect(() => {
        if (!isOpen) {
            // Reset state when modal is closed
            setQuery('');
            setResults([]);
            return;
        }

        const performSearch = () => {
            if (debouncedQuery.trim().length < 2) {
                setResults([]);
                setIsLoading(false);
                return;
            }

            const lowercasedQuery = debouncedQuery.toLowerCase();
            
            // Search UMKM
            const umkmResults: SearchResult[] = MOCK_UMKM_DATA
                .filter(umkm => 
                    umkm.businessName.toLowerCase().includes(lowercasedQuery) ||
                    umkm.ownerName.toLowerCase().includes(lowercasedQuery) ||
                    umkm.description.toLowerCase().includes(lowercasedQuery)
                )
                .map(umkm => ({
                    type: 'UMKM',
                    id: umkm.id,
                    title: umkm.businessName,
                    description: umkm.description,
                    view: View.UMKM,
                    icon: 'storefront'
                }));
            
            // Search News
            const newsResults: SearchResult[] = ALL_NEWS_ARTICLES
                .filter(news =>
                    news.title.toLowerCase().includes(lowercasedQuery) ||
                    news.excerpt.toLowerCase().includes(lowercasedQuery)
                )
                .map(news => ({
                    type: 'Berita',
                    id: news.id,
                    title: news.title,
                    description: news.excerpt,
                    view: View.Berita,
                    icon: 'article'
                }));
            
            // Search Courses
            const courseResults: SearchResult[] = MOCK_COURSES_SEARCH
                .filter(course =>
                    course.title.toLowerCase().includes(lowercasedQuery)
                )
                .map(course => ({
                    type: 'Kursus',
                    id: course.id,
                    title: course.title,
                    description: `Kategori: ${course.category}`,
                    view: View.GoodSkill,
                    icon: 'school'
                }));

            setResults([...umkmResults, ...newsResults, ...courseResults]);
            setIsLoading(false);
        };
        
        setIsLoading(true);
        // Simulate a small delay for better UX
        const searchTimeout = setTimeout(performSearch, 100); 

        return () => clearTimeout(searchTimeout);

    }, [debouncedQuery, isOpen]);

    const groupedResults = useMemo(() => {
        return results.reduce((acc, result) => {
            const type = result.type;
            if (!acc[type]) {
                acc[type] = [];
            }
            acc[type].push(result);
            return acc;
        }, {} as Record<string, SearchResult[]>);
    }, [results]);
    
    const handleNavigation = (view: View) => {
        setCurrentView(view);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-16 md:pt-24 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div 
                className="bg-white rounded-lg shadow-2xl w-full max-w-2xl transform transition-all duration-300 animate-scale-in"
                onClick={e => e.stopPropagation()}
            >
                {/* Search Input */}
                <div className="relative p-4 border-b">
                    <span className="material-symbols-outlined absolute left-7 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Cari UMKM, berita, kursus..."
                        className="w-full pl-10 pr-10 py-3 border-none rounded-md text-lg focus:outline-none focus:ring-0"
                        autoFocus
                    />
                     <button
                        onClick={onClose}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                        aria-label="Tutup pencarian"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto">
                    {isLoading && debouncedQuery.length > 1 && (
                         <div className="p-6 text-center text-gray-500">Mencari...</div>
                    )}
                    
                    {!isLoading && debouncedQuery.length > 1 && results.length === 0 && (
                         <div className="p-6 text-center text-gray-500">
                             <p>Tidak ada hasil untuk "<span className="font-semibold">{debouncedQuery}</span>".</p>
                             <p className="text-sm mt-1">Coba gunakan kata kunci yang berbeda.</p>
                         </div>
                    )}

                    {!isLoading && debouncedQuery.length < 2 && (
                         <div className="p-6 text-center text-gray-400">
                            <p>Ketik minimal 2 karakter untuk memulai pencarian.</p>
                         </div>
                    )}

                    {/* FIX: Replaced Object.entries with Object.keys to avoid type inference issues on the grouped results. */}
                    {Object.keys(groupedResults).map((category) => (
                        <div key={category}>
                            <h3 className="px-4 py-2 bg-gray-50 text-sm font-bold text-gray-600 uppercase tracking-wider">{category}</h3>
                            <ul>
                                {groupedResults[category].map(item => (
                                    <li key={`${item.type}-${item.id}`}>
                                        <button 
                                            onClick={() => handleNavigation(item.view)}
                                            className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex items-start space-x-3"
                                        >
                                            <span className="material-symbols-outlined text-blue-500 mt-1">{item.icon}</span>
                                            <div>
                                                <p className="font-semibold text-gray-800">{item.title}</p>
                                                <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GlobalSearch;