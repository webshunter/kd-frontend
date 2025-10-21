import React, { useState, useMemo } from 'react';
import SectionTitle from '../components/SectionTitle';
import { MOCK_MENTORS, MENTOR_CATEGORIES } from '../constants';
import { Mentor } from '../types';

// Utility to format dates
const formatSlotDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });
};
const formatSlotTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
};

// --- Child Components ---

const MentorCard: React.FC<{ mentor: Mentor; onSelect: (mentor: Mentor) => void }> = ({ mentor, onSelect }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">
        <div className="p-5 flex-grow">
            <div className="flex flex-col items-center text-center">
                <img src={mentor.image} alt={mentor.name} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg" />
                <h3 className="text-xl font-bold text-gray-800 mt-4">{mentor.name}</h3>
                <p className="text-sm font-semibold text-indigo-600">{mentor.expertise}</p>
                <p className="text-sm text-gray-500 mt-1">{mentor.company}</p>
                <p className="text-sm text-gray-600 mt-3 h-16">{mentor.bio}</p>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
                {mentor.specialties.slice(0, 3).map(specialty => (
                    <span key={specialty} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{specialty}</span>
                ))}
            </div>
        </div>
        <div className="px-5 py-3 bg-gray-50 border-t">
            <button
                onClick={() => onSelect(mentor)}
                className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-full hover:bg-indigo-700 transition-colors"
            >
                Lihat Profil & Jadwal
            </button>
        </div>
    </div>
);

const MentorDetailView: React.FC<{ mentor: Mentor; onBack: () => void }> = ({ mentor, onBack }) => {
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);

    const handleBookSlot = () => {
        if (selectedSlot) {
            setIsBookingConfirmed(true);
        }
    };

    const upcomingSlots = mentor.availableSlots.filter(slot => new Date(slot) > new Date());
    
    const groupedSlots = upcomingSlots.reduce((acc, slot) => {
        const dateKey = formatSlotDate(slot);
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(slot);
        return acc;
    }, {} as Record<string, string[]>);

    return (
        <div className="container mx-auto px-6 py-12 animate-fade-in">
            <button onClick={onBack} className="flex items-center text-gray-600 hover:text-indigo-600 font-semibold mb-6">
                <span className="material-symbols-outlined mr-2">arrow_back</span>
                Kembali ke Semua Mentor
            </button>

            {isBookingConfirmed ? (
                <div className="text-center py-16 flex flex-col items-center bg-white rounded-lg shadow-lg border">
                    <span className="material-symbols-outlined text-6xl text-green-500">check_circle</span>
                    <h2 className="text-3xl font-bold text-gray-800 mt-4">Booking Terkonfirmasi!</h2>
                    <p className="mt-2 text-gray-600 max-w-md">
                        Anda telah berhasil menjadwalkan sesi mentoring dengan <span className="font-semibold">{mentor.name}</span> pada <span className="font-semibold">{formatSlotDate(selectedSlot!)}</span> pukul <span className="font-semibold">{formatSlotTime(selectedSlot!)}</span>.
                        Link pertemuan akan dikirimkan ke email Anda.
                    </p>
                    <button onClick={onBack} className="mt-8 bg-indigo-600 text-white font-bold py-2 px-6 rounded-full hover:bg-indigo-700">
                        Selesai
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Info */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-lg border">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-8 pb-8 border-b">
                            <img src={mentor.image} alt={mentor.name} className="w-32 h-32 rounded-full object-cover border-4 border-indigo-200 shadow-lg flex-shrink-0" />
                            <div>
                                <h1 className="text-4xl font-bold text-gray-800">{mentor.name}</h1>
                                <p className="text-2xl font-semibold text-indigo-600">{mentor.expertise}</p>
                                <p className="text-md text-gray-500">{mentor.company}</p>
                            </div>
                        </div>
                        
                        <div className="mb-8">
                            <h3 className="font-bold text-gray-800 text-xl mb-3">Tentang Mentor</h3>
                            <p className="text-gray-700 whitespace-pre-line leading-relaxed">{mentor.fullDescription}</p>
                        </div>

                         <div>
                            <h3 className="font-bold text-gray-800 text-xl mb-3">Spesialisasi</h3>
                            <div className="flex flex-wrap gap-2">
                                {mentor.specialties.map(specialty => (
                                    <span key={specialty} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full font-medium">{specialty}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Right Column: Booking */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-lg border sticky top-24">
                             <h3 className="font-bold text-gray-800 text-xl mb-4 border-b pb-3">Pilih Jadwal Konsultasi</h3>
                            {Object.keys(groupedSlots).length > 0 ? (
                                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                    {Object.keys(groupedSlots).map((date) => (
                                        <div key={date}>
                                            <p className="font-semibold text-gray-700 mb-2">{date}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {groupedSlots[date].map(slot => (
                                                    <button
                                                        key={slot}
                                                        onClick={() => setSelectedSlot(slot)}
                                                        className={`px-4 py-2 text-sm font-semibold rounded-full border-2 transition-colors ${
                                                            selectedSlot === slot
                                                            ? 'bg-indigo-600 text-white border-indigo-600'
                                                            : 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50'
                                                        }`}
                                                    >
                                                        {formatSlotTime(slot)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 bg-gray-100 p-4 rounded-md text-center">Saat ini tidak ada jadwal yang tersedia.</p>
                            )}
                            <button
                                onClick={handleBookSlot}
                                disabled={!selectedSlot}
                                className="w-full mt-6 bg-green-500 text-white font-bold py-3 px-6 rounded-full hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                <span className="material-symbols-outlined">event_available</span>
                                <span>Booking Sesi Mentoring</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


const Mentoring: React.FC = () => {
    const [categoryFilter, setCategoryFilter] = useState<Mentor['expertise'] | 'Semua Keahlian'>('Semua Keahlian');
    const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
    
    const filteredMentors = useMemo(() => {
        if (categoryFilter === 'Semua Keahlian') {
            return MOCK_MENTORS;
        }
        return MOCK_MENTORS.filter(mentor => mentor.expertise === categoryFilter);
    }, [categoryFilter]);

    const handleSelectMentor = (mentor: Mentor) => {
        setSelectedMentor(mentor);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const handleBackToList = () => setSelectedMentor(null);

    if (selectedMentor) {
        return <MentorDetailView mentor={selectedMentor} onBack={handleBackToList} />;
    }

    return (
        <div className="container mx-auto px-6 py-12 animate-fade-in">
            <SectionTitle
                title="Mentoring Bisnis 1-on-1"
                subtitle="Dapatkan bimbingan langsung dari para ahli dan praktisi berpengalaman untuk mengakselerasi pertumbuhan bisnis Anda."
            />
            
            <div className="mb-8 p-4 bg-white rounded-lg shadow-sm border sticky top-[80px] z-10 flex justify-center flex-wrap gap-2">
                {MENTOR_CATEGORIES.map(category => (
                    <button
                        key={category}
                        onClick={() => setCategoryFilter(category)}
                        className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-colors duration-200 ${
                            categoryFilter === category
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredMentors.map(mentor => (
                    <MentorCard key={mentor.id} mentor={mentor} onSelect={handleSelectMentor} />
                ))}
            </div>
        </div>
    );
};

export default Mentoring;