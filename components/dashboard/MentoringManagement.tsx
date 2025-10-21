import React, { useState, useEffect } from 'react';
import { mentoringService, Mentor, MentorCategory } from '../../src/services/mentoringService';

const MentoringManagement: React.FC = () => {
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [categories, setCategories] = useState<MentorCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                const [mentorsData, categoriesData] = await Promise.all([
                    mentoringService.getMentors({ limit: 100 }),
                    mentoringService.getCategories()
                ]);
                setMentors(mentorsData.mentors);
                setCategories(categoriesData);
            } catch (err: any) {
                console.error('Error loading mentoring data:', err);
                setError('Gagal memuat data mentoring. Silakan coba lagi.');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const filteredMentors = (mentors || []).filter(mentor => {
        const matchesSearch = !searchTerm || 
            mentor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mentor.bio.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || 
            mentor.category_slug === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Pagination
    const totalPages = Math.ceil(filteredMentors.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentMentors = filteredMentors.slice(startIndex, endIndex);

    const getStatusBadge = (mentor: Mentor) => {
        if (mentor.is_available) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-green-100 text-green-800 border-green-200">
                    <span className="material-symbols-outlined text-xs mr-1">check_circle</span>
                    Available
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-red-100 text-red-800 border-red-200">
                <span className="material-symbols-outlined text-xs mr-1">cancel</span>
                Busy
            </span>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatPrice = (price: number | string | null) => {
        if (!price) return 'Gratis';
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return `Rp ${numPrice.toLocaleString('id-ID')}`;
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-blue-600"></div>
                    <p className="mt-4 text-gray-600 font-medium">Memuat data mentoring...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-red-600 text-2xl">error</span>
                    </div>
                    <p className="text-red-500 text-lg font-medium mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Manajemen Mentoring</h1>
                            <p className="mt-2 text-gray-600">Kelola mentor dan kategori dengan mudah</p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                            <button
                                onClick={() => setShowCreateForm(true)}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            >
                                <span className="material-symbols-outlined mr-2 text-lg">add</span>
                                Tambah Mentor
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <span className="material-symbols-outlined text-blue-600">psychology</span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Mentor</p>
                                <p className="text-2xl font-bold text-gray-900">{mentors?.length || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <span className="material-symbols-outlined text-green-600">event_available</span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Available</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {(mentors || []).filter(m => m.is_available).length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <span className="material-symbols-outlined text-yellow-600">category</span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Kategori</p>
                                <p className="text-2xl font-bold text-gray-900">{categories?.length || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <span className="material-symbols-outlined text-purple-600">star</span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Avg Rating</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {(mentors || []).length > 0 ? 
                                        ((mentors || []).reduce((sum, mentor) => {
                                            const rating = typeof mentor.rating === 'string' ? parseFloat(mentor.rating) : (mentor.rating || 0);
                                            return sum + rating;
                                        }, 0) / (mentors || []).length).toFixed(1)
                                        : '0.0'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Cari Mentor</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-gray-400">search</span>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Cari nama atau bio..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="all">Semua Kategori</option>
                                {(categories || []).map(category => (
                                    <option key={category.slug} value={category.slug}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory('all');
                                    setCurrentPage(1);
                                }}
                                className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <span className="material-symbols-outlined mr-2 text-sm">refresh</span>
                                Reset Filter
                            </button>
                        </div>
                    </div>
                    </div>

                {/* Mentors Table */}
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div className="flex items-center">
                                            <span className="material-symbols-outlined mr-2 text-sm">psychology</span>
                                            Mentor
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div className="flex items-center">
                                            <span className="material-symbols-outlined mr-2 text-sm">category</span>
                                            Kategori
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div className="flex items-center">
                                            <span className="material-symbols-outlined mr-2 text-sm">work</span>
                                            Pengalaman
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div className="flex items-center">
                                            <span className="material-symbols-outlined mr-2 text-sm">star</span>
                                            Rating
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div className="flex items-center">
                                            <span className="material-symbols-outlined mr-2 text-sm">attach_money</span>
                                            Harga
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div className="flex items-center">
                                            <span className="material-symbols-outlined mr-2 text-sm">flag</span>
                                            Status
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div className="flex items-center">
                                            <span className="material-symbols-outlined mr-2 text-sm">settings</span>
                                            Aksi
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentMentors.map((mentor) => (
                                    <tr key={mentor.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-12 w-12">
                                                    <img
                                                        className="h-12 w-12 rounded-full object-cover border border-gray-200"
                                                        src={mentor.photo_url || 'https://picsum.photos/48/48?random=' + Math.random()}
                                                        alt={mentor.title}
                                                    />
                                                </div>
                                                <div className="ml-4 min-w-0 flex-1">
                                                    <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                                        {mentor.title}
                                                    </div>
                                                    <div className="text-sm text-gray-500 truncate max-w-xs">
                                                        {mentor.bio}
                                                    </div>
                                                    <div className="text-xs text-gray-400 mt-1">
                                                        {mentor.company}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                                style={{
                                                    backgroundColor: mentor.category_color + '20',
                                                    color: mentor.category_color,
                                                    border: `1px solid ${mentor.category_color}40`
                                                }}
                                            >
                                                {mentor.category_name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {mentor.experience_years} tahun
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-900">
                                                <span className="material-symbols-outlined text-sm mr-1 text-yellow-400">star</span>
                                                {mentor.rating ? 
                                                    (typeof mentor.rating === 'string' ? parseFloat(mentor.rating) : mentor.rating).toFixed(1) 
                                                    : '0.0'
                                                }
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {formatPrice(mentor.hourly_rate)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(mentor)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors" title="Edit">
                                                    <span className="material-symbols-outlined text-sm">edit</span>
                                                </button>
                                                <button className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors" title="View">
                                                    <span className="material-symbols-outlined text-sm">visibility</span>
                                                </button>
                                                <button className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors" title="Delete">
                                                    <span className="material-symbols-outlined text-sm">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Menampilkan <span className="font-medium">{startIndex + 1}</span> sampai{' '}
                                        <span className="font-medium">{Math.min(endIndex, filteredMentors.length)}</span> dari{' '}
                                        <span className="font-medium">{filteredMentors.length}</span> hasil
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span className="material-symbols-outlined text-sm">chevron_left</span>
                                        </button>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                    page === currentPage
                                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Create Form Modal */}
                {showCreateForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-gray-900">Tambah Mentor Baru</h2>
                                    <button
                                        onClick={() => setShowCreateForm(false)}
                                        className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                                    >
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="material-symbols-outlined text-blue-600 text-2xl">construction</span>
                                    </div>
                                    <p className="text-gray-600 font-medium">Form untuk menambah mentor baru akan segera tersedia.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MentoringManagement;