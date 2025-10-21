import React, { useState, useEffect } from 'react';
import SectionTitle from '../components/SectionTitle';
import { forumService, ForumTopic, ForumReply, ForumCategory } from '../src/services/forumService';
import { useAuth } from '../contexts/AuthContext';

// --- COMPONENT ---
const Forum: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const [topics, setTopics] = useState<ForumTopic[]>([]);
    const [categories, setCategories] = useState<ForumCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTopic, setSelectedTopic] = useState<ForumTopic | null>(null);
    const [replies, setReplies] = useState<ForumReply[]>([]);
    const [newReply, setNewReply] = useState('');
    const [showCreateTopic, setShowCreateTopic] = useState(false);
    const [newTopic, setNewTopic] = useState({
        title: '',
        content: '',
        category_id: '',
        tags: [] as string[]
    });

    // Load data from database
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                const [topicsData, categoriesData] = await Promise.all([
                    forumService.getTopics({ limit: 20 }),
                    forumService.getCategories()
                ]);
                setTopics(topicsData.topics);
                setCategories(categoriesData);
            } catch (err: any) {
                console.error('Error loading forum data:', err);
                setError('Gagal memuat data forum. Silakan coba lagi.');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Load replies when topic is selected
    useEffect(() => {
        if (selectedTopic) {
            const loadReplies = async () => {
                try {
                    const repliesData = await forumService.getReplies(selectedTopic.slug);
                    setReplies(repliesData.replies);
                } catch (err: any) {
                    console.error('Error loading replies:', err);
                }
            };
            loadReplies();
        }
    }, [selectedTopic]);

    const filteredTopics = topics.filter(topic => {
        const matchesCategory = selectedCategory === 'all' || topic.category_slug === selectedCategory;
        const matchesSearch = !searchTerm || 
            topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            topic.content.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleTopicSelect = (topic: ForumTopic) => {
        setSelectedTopic(topic);
    };

    const handleBackToList = () => {
        setSelectedTopic(null);
        setReplies([]);
    };

    const handleReplySubmit = async () => {
        if (!newReply.trim() || !selectedTopic || !isAuthenticated) return;

        try {
            await forumService.createReply(selectedTopic.slug, { content: newReply });
            setNewReply('');
            // Reload replies
            const repliesData = await forumService.getReplies(selectedTopic.slug);
            setReplies(repliesData.replies);
        } catch (err: any) {
            console.error('Error creating reply:', err);
            alert('Gagal mengirim balasan. Silakan coba lagi.');
        }
    };

    const handleCreateTopic = async () => {
        if (!newTopic.title.trim() || !newTopic.content.trim() || !newTopic.category_id) return;

        try {
            const createdTopic = await forumService.createTopic(newTopic);
            setTopics(prev => [createdTopic, ...prev]);
            setNewTopic({ title: '', content: '', category_id: '', tags: [] });
            setShowCreateTopic(false);
        } catch (err: any) {
            console.error('Error creating topic:', err);
            alert('Gagal membuat topik. Silakan coba lagi.');
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-6 py-12 animate-fade-in">
                <SectionTitle
                    title="Forum Komunitas UMKM"
                    subtitle="Diskusi, berbagi pengalaman, dan saling membantu dalam mengembangkan bisnis."
                />
                <div className="flex items-center justify-center py-16">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-600"></div>
                        <p className="mt-4 text-gray-600">Memuat forum...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-6 py-12 animate-fade-in">
                <SectionTitle
                    title="Forum Komunitas UMKM"
                    subtitle="Diskusi, berbagi pengalaman, dan saling membantu dalam mengembangkan bisnis."
                />
                <div className="text-center py-16">
                    <p className="text-red-500 text-lg">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    if (selectedTopic) {
        return (
            <div className="container mx-auto px-6 py-12 animate-fade-in">
                <div className="mb-6">
                    <button
                        onClick={handleBackToList}
                        className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
                    >
                        <span className="material-symbols-outlined mr-2">arrow_back</span>
                        Kembali ke Forum
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">{selectedTopic.title}</h1>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                        <span>Oleh {selectedTopic.author_name}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(selectedTopic.created_at).toLocaleDateString('id-ID')}</span>
                        <span className="mx-2">•</span>
                        <span>{selectedTopic.reply_count} balasan</span>
                        <span className="mx-2">•</span>
                        <span>{selectedTopic.view_count} dilihat</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="prose max-w-none">
                        <p className="whitespace-pre-line">{selectedTopic.content}</p>
                    </div>
                    {selectedTopic.tags && selectedTopic.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {selectedTopic.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800">Balasan ({replies.length})</h3>
                    {replies.map((reply) => (
                        <div key={reply.id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                        <span className="material-symbols-outlined text-blue-600">person</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">{reply.author_name}</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(reply.created_at).toLocaleDateString('id-ID')}
                                        </p>
                                    </div>
                                </div>
                                {reply.is_solution && (
                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                        Solusi Terpilih
                                    </span>
                                )}
                            </div>
                            <div className="prose max-w-none">
                                <p className="whitespace-pre-line">{reply.content}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {isAuthenticated && (
                    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Tulis Balasan</h3>
                        <textarea
                            value={newReply}
                            onChange={(e) => setNewReply(e.target.value)}
                            placeholder="Tulis balasan Anda..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={4}
                        />
                        <button
                            onClick={handleReplySubmit}
                            disabled={!newReply.trim()}
                            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                        >
                            Kirim Balasan
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-12 animate-fade-in">
            <SectionTitle
                title="Forum Komunitas UMKM"
                subtitle="Diskusi, berbagi pengalaman, dan saling membantu dalam mengembangkan bisnis."
            />

            {/* Controls */}
            <div className="mb-8 p-4 bg-white rounded-lg shadow-sm border">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Cari topik..."
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
                            <option value="all">Semua Kategori</option>
                            {categories.map(category => (
                                <option key={category.slug} value={category.slug}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {isAuthenticated && (
                        <button
                            onClick={() => setShowCreateTopic(true)}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Buat Topik Baru
                        </button>
                    )}
                </div>
            </div>

            {/* Topics List */}
            <div className="space-y-4">
                {filteredTopics.map((topic) => (
                    <div
                        key={topic.id}
                        onClick={() => handleTopicSelect(topic)}
                        className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center mb-2">
                                    {topic.is_pinned && (
                                        <span className="material-symbols-outlined text-yellow-500 mr-2">push_pin</span>
                                    )}
                                    <h3 className="text-lg font-bold text-gray-800">{topic.title}</h3>
                                </div>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                    {topic.content.substring(0, 200)}...
                                </p>
                                <div className="flex items-center text-sm text-gray-500">
                                    <span>Oleh {topic.author_name}</span>
                                    <span className="mx-2">•</span>
                                    <span>{topic.category_name}</span>
                                    <span className="mx-2">•</span>
                                    <span>{topic.reply_count} balasan</span>
                                    <span className="mx-2">•</span>
                                    <span>{topic.view_count} dilihat</span>
                                </div>
                            </div>
                            <div className="text-right text-sm text-gray-500">
                                <p>{new Date(topic.last_reply_at || topic.created_at).toLocaleDateString('id-ID')}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Topic Modal */}
            {showCreateTopic && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Buat Topik Baru</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Judul</label>
                                <input
                                    type="text"
                                    value={newTopic.title}
                                    onChange={(e) => setNewTopic(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Masukkan judul topik..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                                <select
                                    value={newTopic.category_id}
                                    onChange={(e) => setNewTopic(prev => ({ ...prev, category_id: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Pilih kategori...</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Konten</label>
                                <textarea
                                    value={newTopic.content}
                                    onChange={(e) => setNewTopic(prev => ({ ...prev, content: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    rows={6}
                                    placeholder="Tulis konten topik Anda..."
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowCreateTopic(false)}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleCreateTopic}
                                disabled={!newTopic.title.trim() || !newTopic.content.trim() || !newTopic.category_id}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                            >
                                Buat Topik
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Forum;