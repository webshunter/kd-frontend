import React, { useState, useMemo, useEffect } from 'react';
import SectionTitle from '../components/SectionTitle';
import { eventService, Event, EventCategory } from '../src/services/eventService';
import { firebaseConfig } from '../services/firebase';

// --- STYLES & CONFIGS ---
const CATEGORY_COLORS: Record<Event['category'], string> = {
    Bazaar: 'bg-orange-100 text-orange-800 border-orange-200',
    Seminar: 'bg-blue-100 text-blue-800 border-blue-200',
    Workshop: 'bg-purple-100 text-purple-800 border-purple-200',
    Komunitas: 'bg-green-100 text-green-800 border-green-200',
    Lainnya: 'bg-gray-100 text-gray-800 border-gray-200',
};

const DATE_FILTERS = ['Semua', 'Hari Ini', 'Minggu Ini', 'Bulan Ini'];

// --- UTILITY FUNCTIONS ---
const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00'); // Assume local timezone
    return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const formatDay = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return {
        day: date.getDate(),
        month: date.toLocaleString('id-ID', { month: 'short' })
    };
};

// --- CHILD COMPONENTS ---

const EventDetailModal: React.FC<{ event: Event | null; onClose: () => void }> = ({ event, onClose }) => {
    if (!event) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white bg-black/40 hover:bg-black/70 rounded-full p-1 z-20"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>

                <div className="relative h-64 flex-shrink-0">
                    <img src={event.image_url || 'https://picsum.photos/800/400?random=' + Math.random()} alt={event.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full mb-2 inline-block ${CATEGORY_COLORS[event.category] || 'bg-gray-100 text-gray-800'}`}>
                            {event.category_name || event.category}
                        </span>
                        <h2 className="text-3xl font-extrabold text-white">{event.title}</h2>
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto">
                    <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Deskripsi Acara</h3>
                            <p className="text-gray-600 whitespace-pre-line leading-relaxed">{event.full_description || event.description}</p>
                        </div>
                        <div>
                            <div className="bg-gray-50 p-4 rounded-lg border space-y-3">
                                <p className="flex items-start"><span className="material-symbols-outlined text-gray-500 mr-3">calendar_month</span><div><span className="font-semibold">{formatDate(event.start_date)}</span></div></p>
                                <p className="flex items-start"><span className="material-symbols-outlined text-gray-500 mr-3">schedule</span><div><span className="font-semibold">{new Date(event.start_date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - {new Date(event.end_date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span></div></p>
                                <p className="flex items-start"><span className="material-symbols-outlined text-gray-500 mr-3">location_on</span><div><span className="font-semibold">{event.location}</span><br/>{event.address}</div></p>
                                <p className="flex items-start"><span className="material-symbols-outlined text-gray-500 mr-3">badge</span><div><span className="font-semibold">Penyelenggara:</span><br/>{event.organizer}</div></p>
                            </div>
                        </div>
                    </div>
                    {(event.latitude && event.longitude) && (
                        <div className="h-64 bg-gray-200">
                             <iframe
                                width="100%"
                                height="100%"
                                loading="lazy"
                                allowFullScreen
                                src={`https://www.google.com/maps/embed/v1/place?key=${firebaseConfig.apiKey}&q=${event.latitude},${event.longitude}`}>
                            </iframe>
                        </div>
                    )}
                </div>
                
                {event.registration_link && (
                    <div className="p-4 bg-gray-50 border-t flex-shrink-0">
                        <a href={event.registration_link} target="_blank" rel="noopener noreferrer" className="w-full bg-amber-500 text-white font-bold py-3 px-6 rounded-full hover:bg-amber-600 transition-colors duration-300 flex items-center justify-center space-x-2">
                             <span className="material-symbols-outlined">confirmation_number</span>
                            <span>Daftar / Dapatkan Tiket</span>
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

const EventCard: React.FC<{ event: Event; onSelect: (event: Event) => void }> = ({ event, onSelect }) => {
    const { day, month } = formatDay(event.start_date);
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden group border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
            <div className="relative">
                <img src={event.image_url || 'https://picsum.photos/400/300?random=' + Math.random()} alt={event.title} className="w-full h-48 object-cover" />
                 <span className={`absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-full ${CATEGORY_COLORS[event.category] || 'bg-gray-100 text-gray-800'}`}>
                    {event.category_name || event.category}
                </span>
            </div>
            <div className="p-5 flex-grow flex">
                <div className="text-center pr-5 border-r border-gray-200 mr-5 flex-shrink-0">
                    <p className="text-3xl font-extrabold text-amber-600">{day}</p>
                    <p className="text-md font-bold text-gray-500 uppercase">{month}</p>
                </div>
                <div className="flex flex-col">
                    <h3 className="text-lg font-bold text-gray-800">{event.title}</h3>
                    <p className="text-sm text-gray-500 flex items-center mt-1"><span className="material-symbols-outlined !text-base mr-1">location_on</span>{event.location}</p>
                    <button onClick={() => onSelect(event)} className="mt-auto font-semibold text-blue-600 hover:text-blue-800 self-start text-sm">
                        Lihat Detail
                    </button>
                </div>
            </div>
        </div>
    );
};


const EventTangsel: React.FC = () => {
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
    const [categoryFilter, setCategoryFilter] = useState<string>('Semua');
    const [dateFilter, setDateFilter] = useState('Semua');
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<Event[]>([]);
    const [categories, setCategories] = useState<EventCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load events and categories from database
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                const [eventsData, categoriesData] = await Promise.all([
                    eventService.getEvents({ limit: 50 }),
                    eventService.getCategories()
                ]);
                setEvents(eventsData.events);
                setCategories(categoriesData);
            } catch (err: any) {
                console.error('Error loading events data:', err);
                setError('Gagal memuat data acara. Silakan coba lagi.');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        if (selectedEvent) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [selectedEvent]);

    const filteredEvents = useMemo(() => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekEnd = new Date(today);
        weekEnd.setDate(today.getDate() + (7 - today.getDay()));

        return events.filter(event => {
            const matchesCategory = categoryFilter === 'Semua' || event.category === categoryFilter;
            
            const eventDate = new Date(event.start_date);
            let matchesDate = true;
            if (dateFilter === 'Hari Ini') {
                matchesDate = eventDate.getTime() === today.getTime();
            } else if (dateFilter === 'Minggu Ini') {
                matchesDate = eventDate >= today && eventDate <= weekEnd;
            } else if (dateFilter === 'Bulan Ini') {
                matchesDate = eventDate.getMonth() === today.getMonth() && eventDate.getFullYear() === today.getFullYear();
            }
            return matchesCategory && matchesDate;
        });
    }, [events, categoryFilter, dateFilter]);

    const handleSelectEvent = (event: Event) => setSelectedEvent(event);
    const handleCloseModal = () => setSelectedEvent(null);

    // --- Calendar Logic ---
    const changeMonth = (offset: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + offset);
            return newDate;
        });
    };

    const calendarData = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Sun, 1=Mon
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const blanks = Array(firstDayOfMonth).fill(null);
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

        const eventsByDay = events.reduce((acc, event) => {
            const eventDate = new Date(event.start_date);
            if(eventDate.getFullYear() === year && eventDate.getMonth() === month) {
                const day = eventDate.getDate();
                if(!acc[day]) acc[day] = [];
                acc[day].push(event);
            }
            return acc;
        }, {} as Record<number, Event[]>);

        return { blanks, days, eventsByDay };
    }, [currentDate, events]);

    const weekDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    if (loading) {
        return (
            <div className="container mx-auto px-6 py-12 animate-fade-in">
                <SectionTitle
                    title="Kalender Acara Tangerang Selatan"
                    subtitle="Temukan bazaar, seminar, workshop, dan acara komunitas menarik di sekitar Anda."
                />
                <div className="flex items-center justify-center py-16">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-600"></div>
                        <p className="mt-4 text-gray-600">Memuat acara...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-6 py-12 animate-fade-in">
                <SectionTitle
                    title="Kalender Acara Tangerang Selatan"
                    subtitle="Temukan bazaar, seminar, workshop, dan acara komunitas menarik di sekitar Anda."
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

    return (
        <div className="container mx-auto px-6 py-12 animate-fade-in">
            <SectionTitle
                title="Kalender Acara Tangerang Selatan"
                subtitle="Temukan bazaar, seminar, workshop, dan acara komunitas menarik di sekitar Anda."
            />

            {/* Controls */}
            <div className="mb-8 p-4 bg-white rounded-lg shadow-sm border sticky top-[80px] z-20 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* View Toggles */}
                    <div className="flex-shrink-0">
                         <div className="inline-flex rounded-md shadow-sm">
                            <button onClick={() => setViewMode('list')} className={`px-4 py-2 text-sm font-medium border rounded-l-lg ${viewMode === 'list' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'}`}>
                                <span className="material-symbols-outlined !text-xl mr-2 align-middle">list</span>Daftar
                            </button>
                            <button onClick={() => setViewMode('calendar')} className={`px-4 py-2 text-sm font-medium border rounded-r-lg ${viewMode === 'calendar' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'}`}>
                                <span className="material-symbols-outlined !text-xl mr-2 align-middle">calendar_month</span>Kalender
                            </button>
                        </div>
                    </div>
                    {/* Filters */}
                    <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm bg-white">
                            <option value="Semua">Semua Kategori</option>
                            {categories.map(cat => <option key={cat.slug} value={cat.slug}>{cat.name}</option>)}
                        </select>
                         <select value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm bg-white" disabled={viewMode === 'calendar'}>
                            {DATE_FILTERS.map(date => <option key={date} value={date}>{date === 'Semua' ? 'Semua Waktu' : date}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Content */}
            {viewMode === 'list' ? (
                 filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredEvents.map(event => <EventCard key={event.id} event={event} onSelect={handleSelectEvent} />)}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-lg border">
                        <h3 className="text-xl font-semibold text-gray-700">Tidak Ada Acara</h3>
                        <p className="text-gray-500 mt-2">Tidak ada acara yang cocok dengan filter Anda saat ini.</p>
                    </div>
                )
            ) : (
                <div className="bg-white p-4 rounded-lg shadow-lg border">
                    <div className="flex justify-between items-center mb-4">
                        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100"><span className="material-symbols-outlined">chevron_left</span></button>
                        <h3 className="text-xl font-bold text-gray-800">{currentDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' })}</h3>
                        <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100"><span className="material-symbols-outlined">chevron_right</span></button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-sm font-semibold text-gray-500">
                        {weekDays.map(day => <div key={day} className="py-2">{day}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {calendarData.blanks.map((_, i) => <div key={`blank-${i}`} className="border rounded-md h-24 sm:h-32"></div>)}
                        {calendarData.days.map(day => (
                            <div key={day} className="border rounded-md h-24 sm:h-32 p-1.5 flex flex-col">
                                <span className="font-semibold text-gray-700">{day}</span>
                                <div className="mt-1 flex-grow overflow-y-auto space-y-1">
                                    {calendarData.eventsByDay[day]?.map(event => (
                                        <button key={event.id} onClick={() => handleSelectEvent(event)} className={`w-full text-left text-xs font-semibold px-1.5 py-0.5 rounded truncate ${CATEGORY_COLORS[event.category]}`}>
                                            {event.title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            <EventDetailModal event={selectedEvent} onClose={handleCloseModal} />
        </div>
    );
};

export default EventTangsel;