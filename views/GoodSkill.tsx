import React, { useState, useMemo } from 'react';
import SectionTitle from '../components/SectionTitle';

// --- UPDATED TYPES FOR DETAILED COURSE CONTENT ---

interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswerIndex: number;
}

interface Quiz {
    questions: QuizQuestion[];
}

interface Lesson {
    id: string;
    title: string;
    type: 'video' | 'text' | 'quiz';
    content?: string; // For text lessons
    videoId?: string; // YouTube video ID for video lessons
    quiz?: Quiz;
    completed: boolean;
}

interface Module {
    id: string;
    title: string;
    lessons: Lesson[];
}

interface Course {
    title: string;
    category: string;
    duration: string;
    image: string;
    rating: number;
    reviewCount: number;
    learningObjectives: string[];
    whatYouWillLearn: string[];
    targetAudience: string;
    completed?: boolean; // This will now be derived from progress
    modules: Module[];
}


// --- LEARNING COMPONENTS ---

const VideoLesson: React.FC<{ videoId: string }> = ({ videoId }) => (
    <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
        <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
        ></iframe>
    </div>
);

const TextLesson: React.FC<{ title: string; content: string }> = ({ title, content }) => (
    <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
        <div className="prose max-w-none text-gray-700 whitespace-pre-line">
            {content}
        </div>
    </div>
);

const QuizComponent: React.FC<{ quiz: Quiz; onQuizComplete: () => void }> = ({ quiz, onQuizComplete }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(Array(quiz.questions.length).fill(null));
    const [showResults, setShowResults] = useState(false);

    const handleAnswerSelect = (optionIndex: number) => {
        if (showResults) return;
        const newAnswers = [...selectedAnswers];
        newAnswers[currentQuestionIndex] = optionIndex;
        setSelectedAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };
    
    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleSubmit = () => {
        setShowResults(true);
        // In a real app, you might have a score threshold to pass
        onQuizComplete(); 
    };
    
    const score = useMemo(() => {
        return selectedAnswers.reduce((correctCount, answer, index) => {
            return answer === quiz.questions[index].correctAnswerIndex ? correctCount + 1 : correctCount;
        }, 0);
    }, [selectedAnswers, quiz.questions]);
    
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const selectedAnswer = selectedAnswers[currentQuestionIndex];

    if (showResults) {
        return (
            <div className="bg-white p-6 rounded-lg border text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Hasil Kuis</h3>
                <p className="text-lg text-gray-600 mb-4">Anda menjawab {score} dari {quiz.questions.length} pertanyaan dengan benar.</p>
                <div className={`text-4xl font-bold ${score / quiz.questions.length >= 0.7 ? 'text-green-500' : 'text-orange-500'}`}>
                    Skor Anda: {Math.round((score / quiz.questions.length) * 100)}%
                </div>
                <button onClick={() => { setShowResults(false); setCurrentQuestionIndex(0); setSelectedAnswers(Array(quiz.questions.length).fill(null)); }} className="mt-6 bg-blue-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-blue-700">
                    Ulangi Kuis
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg border">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Kuis Modul</h3>
                <p className="text-sm font-medium text-gray-500">Pertanyaan {currentQuestionIndex + 1} dari {quiz.questions.length}</p>
            </div>
            <p className="text-gray-800 font-semibold mb-4 min-h-[4rem]">{currentQuestion.question}</p>
            <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    return (
                        <button
                            key={index}
                            onClick={() => handleAnswerSelect(index)}
                            className={`w-full text-left p-3 border rounded-lg transition-colors flex items-center space-x-3 ${isSelected ? 'bg-blue-100 border-blue-500 ring-2 ring-blue-300' : 'bg-gray-50 hover:bg-gray-100'}`}
                        >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-400'}`}>
                                {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </div>
                            <span>{option}</span>
                        </button>
                    );
                })}
            </div>
            <div className="flex justify-between items-center mt-6 pt-4 border-t">
                <button onClick={handlePrev} disabled={currentQuestionIndex === 0} className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-full hover:bg-gray-300 disabled:opacity-50">
                    Sebelumnya
                </button>
                {currentQuestionIndex === quiz.questions.length - 1 ? (
                    <button onClick={handleSubmit} disabled={selectedAnswer === null} className="bg-green-500 text-white font-semibold py-2 px-6 rounded-full hover:bg-green-600 disabled:bg-green-300">
                        Selesaikan Kuis
                    </button>
                ) : (
                    <button onClick={handleNext} disabled={selectedAnswer === null} className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-blue-700 disabled:bg-blue-300">
                        Selanjutnya
                    </button>
                )}
            </div>
        </div>
    );
};


const CourseCard: React.FC<{ course: Course; onViewCourse: (course: Course) => void; }> = ({ course, onViewCourse }) => {
    const { title, category, image } = course;
    
    const totalLessons = useMemo(() => course.modules.reduce((acc, module) => acc + module.lessons.length, 0), [course.modules]);
    const completedLessons = useMemo(() => course.modules.reduce((acc, module) => acc + module.lessons.filter(l => l.completed).length, 0), [course.modules]);
    const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden group border flex flex-col transition-all duration-300">
            <div className="relative">
                <img src={image} alt={title} className="w-full h-48 object-cover" />
                <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">{category}</div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-gray-800 h-14">{title}</h3>
                
                <div className="mt-4 mb-4">
                    <div className="flex justify-between mb-1">
                        <span className="text-xs font-medium text-gray-500">Progress</span>
                        <span className="text-xs font-medium text-blue-700">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                <button 
                    onClick={() => onViewCourse(course)} 
                    className="w-full mt-auto bg-blue-600 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-700 transition duration-300 flex items-center justify-center space-x-2"
                >
                    <span>{progress > 0 ? 'Lanjutkan Belajar' : 'Mulai Belajar'}</span>
                </button>
            </div>
        </div>
    );
};


const GoodSkill: React.FC = () => {
    const [view, setView] = useState<'list' | 'detail'>('list');
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

    const initialCourses: Course[] = [
        { 
            title: "Dasar-Dasar Digital Marketing untuk UMKM", 
            category: "Pemasaran", 
            duration: "8 Jam", 
            image: "https://picsum.photos/400/300?random=17", 
            rating: 4.8, 
            reviewCount: 250,
            learningObjectives: ["Memahami konsep dasar digital marketing.", "Mengidentifikasi channel marketing yang tepat.", "Membuat strategi konten sederhana."],
            whatYouWillLearn: ["SEO untuk pemula.", "Pemasaran media sosial.", "Dasar-dasar Google Ads."],
            targetAudience: "Pemilik UMKM dan staf pemasaran.",
            modules: [
                { id: 'm1', title: 'Modul 1: Pengenalan', lessons: [
                    { id: 'l1-1', title: 'Selamat Datang di Kursus!', type: 'video', videoId: '6gRxtQ8Eifc', completed: false },
                    { id: 'l1-2', title: 'Apa itu Digital Marketing?', type: 'text', content: 'Digital marketing adalah proses menggunakan channel digital untuk mempromosikan atau memasarkan produk dan layanan kepada konsumen dan bisnis. Ini mencakup berbagai strategi dan taktik, mulai dari optimisasi mesin pencari (SEO) hingga pemasaran media sosial.', completed: false },
                ]},
                { id: 'm2', title: 'Modul 2: Media Sosial', lessons: [
                    { id: 'l2-1', title: 'Memilih Platform yang Tepat', type: 'text', content: 'Tidak semua media sosial cocok untuk setiap bisnis. Instagram dan TikTok sangat bagus untuk produk yang visual seperti fashion dan kuliner. LinkedIn lebih efektif untuk bisnis B2B (Business-to-Business). Facebook memiliki audiens yang luas dan beragam.', completed: false },
                    { id: 'l2-2', title: 'Membuat Konten Menarik', type: 'video', videoId: '8P2XmI-e5p4', completed: false },
                    { id: 'l2-3', title: 'Kuis Media Sosial', type: 'quiz', quiz: { questions: [
                        { question: 'Platform mana yang paling cocok untuk bisnis B2B?', options: ['Instagram', 'TikTok', 'LinkedIn', 'Facebook'], correctAnswerIndex: 2 },
                        { question: 'Apa metrik utama untuk mengukur interaksi?', options: ['Likes', 'Shares', 'Comments', 'Semua Benar'], correctAnswerIndex: 3 },
                    ]}, completed: false },
                ]},
            ],
        },
        { 
            title: "Manajemen Keuangan Bisnis Sederhana", 
            category: "Keuangan", 
            duration: "6 Jam", 
            image: "https://picsum.photos/400/300?random=18", 
            rating: 4.6, 
            reviewCount: 189,
            learningObjectives: [], whatYouWillLearn: [], targetAudience: "",
            modules: [],
        },
        { 
            title: "Teknik Fotografi Produk dengan Smartphone", 
            category: "Kreatif", 
            duration: "4 Jam", 
            image: "https://picsum.photos/400/300?random=19", 
            rating: 4.9, 
            reviewCount: 312,
             learningObjectives: [], whatYouWillLearn: [], targetAudience: "",
            modules: [],
        },
    ];

    const [courses, setCourses] = useState<Course[]>(initialCourses);

    const handleViewCourse = (course: Course) => {
        if (course.modules.length === 0) {
            alert("Konten kursus ini sedang dalam pengembangan. Silakan cek kembali nanti!");
            return;
        }
        const firstLesson = course.modules[0]?.lessons[0] || null;
        setSelectedCourse(course);
        setActiveLesson(firstLesson);
        setView('detail');
    };

    const handleBackToList = () => {
        setView('list');
        setSelectedCourse(null);
        setActiveLesson(null);
    };

    const handleMarkComplete = (lessonId: string) => {
        if (!selectedCourse) return;
        
        let nextLesson: Lesson | null = null;
        let foundCurrent = false;
        for (const module of selectedCourse.modules) {
            for (const lesson of module.lessons) {
                if (foundCurrent) {
                    nextLesson = lesson;
                    break;
                }
                if (lesson.id === lessonId) {
                    foundCurrent = true;
                }
            }
            if (nextLesson) break;
        }

        const updatedCourse = {
            ...selectedCourse,
            modules: selectedCourse.modules.map(module => ({
                ...module,
                lessons: module.lessons.map(lesson => 
                    lesson.id === lessonId ? { ...lesson, completed: true } : lesson
                ),
            })),
        };
        
        setCourses(courses.map(c => c.title === updatedCourse.title ? updatedCourse : c));
        setSelectedCourse(updatedCourse);

        if (nextLesson) {
            setActiveLesson(nextLesson);
        }
    };
    
  if (view === 'detail' && selectedCourse && activeLesson) {
    const totalLessons = selectedCourse.modules.reduce((acc, module) => acc + module.lessons.length, 0);
    const completedLessons = selectedCourse.modules.reduce((acc, module) => acc + module.lessons.filter(l => l.completed).length, 0);
    const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    
    return (
        <div className="container mx-auto px-6 py-12 animate-fade-in">
            <button onClick={handleBackToList} className="flex items-center text-gray-600 hover:text-blue-600 font-semibold mb-6">
                <span className="material-symbols-outlined mr-2">arrow_back</span>
                Kembali ke Semua Kursus
            </button>
            
            <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">{selectedCourse.title}</h2>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    {activeLesson.type === 'video' && activeLesson.videoId && <VideoLesson videoId={activeLesson.videoId} />}
                    {activeLesson.type === 'text' && activeLesson.content && <TextLesson title={activeLesson.title} content={activeLesson.content} />}
                    {activeLesson.type === 'quiz' && activeLesson.quiz && <QuizComponent quiz={activeLesson.quiz} onQuizComplete={() => handleMarkComplete(activeLesson.id)} />}
                    
                    {!activeLesson.completed && activeLesson.type !== 'quiz' && (
                         <button onClick={() => handleMarkComplete(activeLesson.id)} className="mt-6 w-full md:w-auto bg-green-500 text-white font-bold py-3 px-8 rounded-full hover:bg-green-600 transition duration-300 flex items-center justify-center space-x-2">
                            <span className="material-symbols-outlined">check_circle</span>
                            <span>Tandai Selesai & Lanjutkan</span>
                        </button>
                    )}
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white p-4 rounded-lg shadow-lg border sticky top-24">
                        <h3 className="font-bold text-xl mb-4">Materi Kursus</h3>
                        <div className="space-y-4">
                            {selectedCourse.modules.map(module => (
                                <div key={module.id}>
                                    <h4 className="font-semibold text-gray-700">{module.title}</h4>
                                    <ul className="mt-2 space-y-1">
                                        {module.lessons.map(lesson => {
                                            const isActive = activeLesson.id === lesson.id;
                                            const iconMap = { video: 'play_circle', text: 'description', quiz: 'quiz' };
                                            return (
                                                <li key={lesson.id}>
                                                    <button 
                                                        onClick={() => setActiveLesson(lesson)}
                                                        className={`w-full text-left p-2 rounded-md transition-colors flex items-center space-x-3 ${isActive ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                                                    >
                                                        {lesson.completed ? 
                                                            <span className="material-symbols-outlined text-green-500">check_circle</span> : 
                                                            <span className="material-symbols-outlined text-gray-500">{iconMap[lesson.type]}</span>
                                                        }
                                                        <span className={`text-sm ${isActive ? 'font-semibold text-blue-700' : 'text-gray-800'}`}>{lesson.title}</span>
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }
    
  return (
    <div className="container mx-auto px-6 py-12">
      <SectionTitle 
        title="GoodSkill Tangsel"
        subtitle="Tingkatkan kompetensi Anda dengan berbagai kursus online dan dapatkan sertifikasi digital."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map(course => <CourseCard key={course.title} course={course} onViewCourse={handleViewCourse} />)}
      </div>
    </div>
  );
};

export default GoodSkill;