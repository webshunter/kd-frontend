import React from 'react';
import { View } from '../../types';

interface Course {
    title: string;
    category: string;
    progress: number; // in percentage
    image: string;
}

const MOCK_COURSES: Course[] = [
    { title: "Dasar-Dasar Digital Marketing untuk UMKM", category: "Pemasaran", progress: 75, image: "https://picsum.photos/400/300?random=17" },
    { title: "Manajemen Keuangan Bisnis Sederhana", category: "Keuangan", progress: 100, image: "https://picsum.photos/400/300?random=18" },
    { title: "Teknik Fotografi Produk dengan Smartphone", category: "Kreatif", progress: 20, image: "https://picsum.photos/400/300?random=19" },
    { title: "Strategi Branding untuk Usaha Kuliner", category: "Branding", progress: 0, image: "https://picsum.photos/400/300?random=23" },
];

const CourseCard: React.FC<{ course: Course }> = ({ course }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group border flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="relative">
            <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
            <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">{course.category}</div>
        </div>
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-lg font-bold text-gray-800 h-14">{course.title}</h3>
            <div className="mt-4 mb-4">
                <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium text-gray-500">Progress</span>
                    <span className="text-xs font-medium text-blue-700">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${course.progress}%` }}></div>
                </div>
            </div>
            <button 
              className={`w-full mt-auto font-bold py-2 px-4 rounded-full transition duration-300 flex items-center justify-center space-x-2 ${
                course.progress === 100 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}>
                 <span className="material-symbols-outlined">{course.progress === 100 ? 'workspace_premium' : 'play_arrow'}</span>
                <span>{course.progress === 100 ? 'Lihat Sertifikat' : (course.progress > 0 ? 'Lanjutkan Belajar' : 'Mulai Belajar')}</span>
            </button>
        </div>
    </div>
);

interface CoursesProps {
  // In a real app, this would come from a prop or context to navigate
  // setCurrentView: (view: View) => void;
}

const Courses: React.FC<CoursesProps> = () => {
    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Kursus Saya</h2>
                    <p className="text-gray-500">Lanjutkan perjalanan belajar Anda dan tingkatkan keahlian.</p>
                </div>
                <button 
                    // onClick={() => setCurrentView(View.GoodSkill)}
                    className="bg-blue-100 text-blue-700 font-semibold py-2 px-4 rounded-full hover:bg-blue-200 transition duration-300 flex-shrink-0"
                >
                    Cari Kursus Baru
                </button>
            </div>
            {MOCK_COURSES.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {MOCK_COURSES.map(course => (
                        <CourseCard key={course.title} course={course} />
                    ))}
                </div>
            ) : (
                 <div className="text-center py-16 bg-white rounded-lg border">
                    <span className="material-symbols-outlined text-6xl text-gray-400">school</span>
                    <h3 className="text-xl font-semibold text-gray-700 mt-4">Anda Belum Mengambil Kursus Apapun</h3>
                    <p className="text-gray-500 mt-2">Jelajahi katalog GoodSkill untuk menemukan kursus yang tepat untuk Anda.</p>
                </div>
            )}
        </div>
    );
};

export default Courses;