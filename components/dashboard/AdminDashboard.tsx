import React, { useState, useEffect } from 'react';
import { DashboardView } from '../../types';

interface AdminDashboardProps {
    setActiveDashboardView: (view: DashboardView) => void;
}

interface SystemStats {
    news: { articles: number; categories: number };
    events: { events: number; categories: number };
    forum: { topics: number; categories: number };
    courses: { courses: number; categories: number };
    mentoring: { mentors: number; categories: number };
    jobs: { jobs: number; categories: number };
    businessMatching: { profiles: number; categories: number };
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ setActiveDashboardView }) => {
    const [stats, setStats] = useState<SystemStats>({
        news: { articles: 0, categories: 0 },
        events: { events: 0, categories: 0 },
        forum: { topics: 0, categories: 0 },
        courses: { courses: 0, categories: 0 },
        mentoring: { mentors: 0, categories: 0 },
        jobs: { jobs: 0, categories: 0 },
        businessMatching: { profiles: 0, categories: 0 }
    });
    const [loading, setLoading] = useState(true);

    // Load system statistics
    useEffect(() => {
        const loadStats = async () => {
            try {
                setLoading(true);
                const [newsRes, eventsRes, forumRes, coursesRes, mentoringRes, jobsRes, businessRes] = await Promise.all([
                    fetch('/api/news?limit=1'),
                    fetch('/api/events?limit=1'),
                    fetch('/api/forum/topics?limit=1'),
                    fetch('/api/courses?limit=1'),
                    fetch('/api/mentoring/mentors?limit=1'),
                    fetch('/api/jobs?limit=1'),
                    fetch('/api/business-matching/profiles?limit=1')
                ]);

                const [newsData, eventsData, forumData, coursesData, mentoringData, jobsData, businessData] = await Promise.all([
                    newsRes.json(),
                    eventsRes.json(),
                    forumRes.json(),
                    coursesRes.json(),
                    mentoringRes.json(),
                    jobsRes.json(),
                    businessRes.json()
                ]);

                setStats({
                    news: {
                        articles: newsData.data?.pagination?.total || 0,
                        categories: 7 // Sample data count
                    },
                    events: {
                        events: eventsData.data?.pagination?.total || 0,
                        categories: 5 // Sample data count
                    },
                    forum: {
                        topics: forumData.data?.pagination?.total || 0,
                        categories: 6 // Sample data count
                    },
                    courses: {
                        courses: coursesData.data?.pagination?.total || 0,
                        categories: 6 // Sample data count
                    },
                    mentoring: {
                        mentors: mentoringData.data?.pagination?.total || 0,
                        categories: 8 // Sample data count
                    },
                    jobs: {
                        jobs: jobsData.data?.pagination?.total || 0,
                        categories: 8 // Sample data count
                    },
                    businessMatching: {
                        profiles: businessData.data?.pagination?.total || 0,
                        categories: 8 // Sample data count
                    }
                });
            } catch (error) {
                console.error('Error loading admin stats:', error);
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, []);

    const managementSections = [
        {
            title: 'Konten & Informasi',
            icon: 'article',
            color: 'blue',
            items: [
                {
                    title: 'Manajemen Berita',
                    description: 'Kelola artikel berita dan kategori',
                    icon: 'newspaper',
                    stats: `${stats.news.articles} artikel, ${stats.news.categories} kategori`,
                    onClick: () => setActiveDashboardView(DashboardView.NewsManagement)
                },
                {
                    title: 'Manajemen Acara',
                    description: 'Kelola acara dan event categories',
                    icon: 'event',
                    stats: `${stats.events.events} acara, ${stats.events.categories} kategori`,
                    onClick: () => setActiveDashboardView(DashboardView.EventsManagement)
                }
            ]
        },
        {
            title: 'Komunitas & Pembelajaran',
            icon: 'groups',
            color: 'green',
            items: [
                {
                    title: 'Manajemen Forum',
                    description: 'Kelola topik forum dan kategori',
                    icon: 'forum',
                    stats: `${stats.forum.topics} topik, ${stats.forum.categories} kategori`,
                    onClick: () => setActiveDashboardView(DashboardView.ForumManagement)
                },
                {
                    title: 'Manajemen Kursus',
                    description: 'Kelola kursus dan modul pembelajaran',
                    icon: 'school',
                    stats: `${stats.courses.courses} kursus, ${stats.courses.categories} kategori`,
                    onClick: () => setActiveDashboardView(DashboardView.CoursesManagement)
                },
                {
                    title: 'Manajemen Mentoring',
                    description: 'Kelola mentor dan sesi mentoring',
                    icon: 'psychology',
                    stats: `${stats.mentoring.mentors} mentor, ${stats.mentoring.categories} kategori`,
                    onClick: () => setActiveDashboardView(DashboardView.MentoringManagement)
                }
            ]
        },
        {
            title: 'Karir & Bisnis',
            icon: 'business',
            color: 'purple',
            items: [
                {
                    title: 'Manajemen Lowongan Kerja',
                    description: 'Kelola lowongan kerja dan aplikasi',
                    icon: 'work',
                    stats: `${stats.jobs.jobs} lowongan, ${stats.jobs.categories} kategori`,
                    onClick: () => setActiveDashboardView(DashboardView.JobsManagement)
                },
                {
                    title: 'Manajemen Business Matching',
                    description: 'Kelola profil bisnis dan koneksi',
                    icon: 'handshake',
                    stats: `${stats.businessMatching.profiles} profil, ${stats.businessMatching.categories} kategori`,
                    onClick: () => setActiveDashboardView(DashboardView.BusinessMatchingManagement)
                }
            ]
        }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Memuat dashboard admin...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
                <h1 className="text-3xl font-bold mb-2">Dashboard Admin</h1>
                <p className="text-blue-100">Kelola semua sistem dan konten Kampung Digital Tangerang Selatan</p>
            </div>

            {/* System Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-lg border">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <span className="material-symbols-outlined text-blue-600 text-2xl">article</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-2xl font-bold text-gray-800">{stats.news.articles + stats.events.events}</p>
                            <p className="text-gray-500">Total Konten</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg border">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <span className="material-symbols-outlined text-green-600 text-2xl">groups</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-2xl font-bold text-gray-800">{stats.forum.topics + stats.courses.courses}</p>
                            <p className="text-gray-500">Aktivitas Komunitas</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg border">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <span className="material-symbols-outlined text-purple-600 text-2xl">business</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-2xl font-bold text-gray-800">{stats.jobs.jobs + stats.businessMatching.profiles}</p>
                            <p className="text-gray-500">Peluang Bisnis</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg border">
                    <div className="flex items-center">
                        <div className="p-3 bg-orange-100 rounded-lg">
                            <span className="material-symbols-outlined text-orange-600 text-2xl">psychology</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-2xl font-bold text-gray-800">{stats.mentoring.mentors}</p>
                            <p className="text-gray-500">Mentor Aktif</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Management Sections */}
            {managementSections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="bg-white rounded-lg shadow-lg border">
                    <div className="p-6 border-b">
                        <div className="flex items-center">
                            <span className={`material-symbols-outlined text-${section.color}-600 text-2xl mr-3`}>
                                {section.icon}
                            </span>
                            <h2 className="text-xl font-bold text-gray-800">{section.title}</h2>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {section.items.map((item, itemIndex) => (
                                <button
                                    key={itemIndex}
                                    onClick={item.onClick}
                                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 border border-gray-200 text-left transition-all duration-200 hover:shadow-md"
                                >
                                    <div className="flex items-start">
                                        <span className={`material-symbols-outlined text-${section.color}-600 text-xl mr-3 mt-1`}>
                                            {item.icon}
                                        </span>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
                                            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                                            <p className="text-xs text-gray-500">{item.stats}</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            ))}

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow-lg border">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Aksi Cepat</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 border border-blue-200 text-left">
                        <span className="material-symbols-outlined text-blue-600 text-xl mb-2">add</span>
                        <h3 className="font-bold text-gray-800">Tambah Konten Baru</h3>
                        <p className="text-sm text-gray-600">Buat artikel, acara, atau konten lainnya</p>
                    </button>
                    <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 border border-green-200 text-left">
                        <span className="material-symbols-outlined text-green-600 text-xl mb-2">analytics</span>
                        <h3 className="font-bold text-gray-800">Laporan Sistem</h3>
                        <p className="text-sm text-gray-600">Lihat statistik dan performa sistem</p>
                    </button>
                    <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 border border-orange-200 text-left">
                        <span className="material-symbols-outlined text-orange-600 text-xl mb-2">settings</span>
                        <h3 className="font-bold text-gray-800">Pengaturan Sistem</h3>
                        <p className="text-sm text-gray-600">Konfigurasi kategori dan pengaturan</p>
                    </button>
                    <button className="p-4 bg-red-50 rounded-lg hover:bg-red-100 border border-red-200 text-left">
                        <span className="material-symbols-outlined text-red-600 text-xl mb-2">backup</span>
                        <h3 className="font-bold text-gray-800">Backup Data</h3>
                        <p className="text-sm text-gray-600">Buat backup data sistem</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
