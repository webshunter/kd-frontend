import React, { useState, useRef, useEffect } from 'react';
import SectionTitle from '../components/SectionTitle';
import { type ChatMessage } from '../types';
import { askHUMI } from '../services/geminiService';

// Define a more detailed type for the service
interface LegalService {
    icon: string;
    title: string;
    description: string;
    detailedDescription: string;
    benefits: string[];
    process: { title: string; description: string }[];
}

const ServiceCard: React.FC<{ service: LegalService; onClick: () => void; }> = ({ service, onClick }) => (
    <div 
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
        className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500 hover:shadow-lg transition-shadow duration-300 flex items-start space-x-4 h-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
    >
        <div className="flex-shrink-0">
             <div className="bg-red-100 p-3 rounded-full">
                <span className="material-symbols-outlined text-3xl text-red-600">{service.icon}</span>
            </div>
        </div>
        <div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">{service.title}</h3>
            <p className="text-gray-600 text-sm">{service.description}</p>
        </div>
    </div>
);

// New: Service Detail View Component
const ServiceDetailView: React.FC<{ service: LegalService; onBack: () => void; }> = ({ service, onBack }) => (
    <div className="animate-fade-in">
        <div className="container mx-auto px-6 py-8">
            <button onClick={onBack} className="flex items-center text-gray-600 hover:text-red-600 font-semibold mb-6">
                <span className="material-symbols-outlined mr-2">arrow_back</span>
                Kembali ke Semua Layanan
            </button>
        </div>

        <div className="container mx-auto px-6 pb-16">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-block p-4 bg-red-100 rounded-full mb-4">
                        <span className="material-symbols-outlined text-5xl text-red-600">{service.icon}</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">{service.title}</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-red-200 pb-2">Tentang Layanan</h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{service.detailedDescription}</p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-red-200 pb-2">Proses Layanan</h2>
                            <div className="space-y-8 relative">
                                <div className="absolute left-5 top-5 h-[calc(100%-2.5rem)] w-0.5 bg-gray-200"></div>
                                {service.process.map((step, index) => (
                                    <div key={index} className="relative flex items-start space-x-6">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-lg z-10">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">{step.title}</h3>
                                            <p className="text-gray-600">{step.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <aside className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-lg border sticky top-24">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <span className="material-symbols-outlined text-green-500 mr-3">verified</span>
                                Manfaat Utama
                            </h3>
                            <ul className="space-y-3">
                                {service.benefits.map((benefit, index) => (
                                    <li key={index} className="flex items-start">
                                        <span className="material-symbols-outlined text-green-500 !text-xl mr-2 mt-0.5">check_circle</span>
                                        <span className="text-gray-700">{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full mt-8 bg-orange-500 text-white font-bold py-3 px-6 rounded-full hover:bg-orange-600 transition duration-300">
                                Mulai Konsultasi
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    </div>
);


const HalloHukum: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [selectedService, setSelectedService] = useState<LegalService | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const submitPrompt = async (prompt: string, userMessageText: string) => {
        if (isLoading) return;

        const userMessage: ChatMessage = { sender: 'user', text: userMessageText };
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        // A slight delay to allow the user message to render before the AI responds
        await new Promise(resolve => setTimeout(resolve, 100));

        const aiResponseText = await askHUMI(prompt);
        const aiMessage: ChatMessage = { sender: 'ai', text: aiResponseText };
        
        setMessages((prev) => [...prev, aiMessage]);
        setIsLoading(false);
    };

    useEffect(() => {
        // Set initial welcome message from HUMI only if not navigating back from detail
        if (messages.length === 0 && !selectedService) {
            const fetchWelcomeMessage = async () => {
                setIsLoading(true);
                const welcomeText = await askHUMI("Perkenalkan dirimu.");
                setMessages([{ sender: 'ai', text: welcomeText }]);
                setIsLoading(false);
            };
            fetchWelcomeMessage();
        }
    }, [selectedService]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;
        const currentInput = input;
        setInput('');
        await submitPrompt(currentInput, currentInput);
    };
    
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    const handleQuickAsk = async (prompt: string, question: string) => {
        await submitPrompt(prompt, question);
    };

    const quickTopics = [
        { 
            icon: 'description', 
            question: 'Apa itu NIB?', 
            prompt: 'Jelaskan secara sederhana apa itu NIB dan mengapa penting untuk UMKM?' 
        },
        { 
            icon: 'lightbulb_outline', 
            question: 'Bagaimana cara mendaftarkan HKI?', 
            prompt: 'Saya punya merek baru, bagaimana langkah-langkah mendaftarkan HKI untuk merek dagang?' 
        },
        { 
            icon: 'verified', 
            question: 'Proses Sertifikasi Halal', 
            prompt: 'Apa saja syarat dan proses untuk mendapatkan sertifikasi halal untuk usaha kuliner saya?' 
        },
        {
            icon: 'gavel',
            question: 'Perbedaan PT dan CV',
            prompt: 'Apa perbedaan mendasar antara badan usaha PT Perorangan dengan CV untuk skala UMKM?'
        }
    ];
    
    const legalServices: LegalService[] = [
        {
            icon: 'description',
            title: 'Legal Administrasi',
            description: 'Bantuan pengurusan dokumen legalitas usaha seperti NIB, NPWP, dan pendaftaran merek (HKI).',
            detailedDescription: "Layanan ini dirancang untuk membantu Anda mengurus semua dokumen administrasi yang diperlukan agar usaha Anda terdaftar secara resmi dan sah di mata hukum. Kami akan membimbing Anda melalui proses pendaftaran Nomor Induk Berusaha (NIB) melalui sistem Online Single Submission (OSS), pendaftaran NPWP Badan Usaha, hingga proses pendaftaran merek dagang (HKI) untuk melindungi brand Anda.",
            benefits: ["Usaha terdaftar resmi", "Memudahkan akses permodalan", "Meningkatkan kepercayaan pelanggan", "Melindungi aset merek (HKI)"],
            process: [
                { title: "Konsultasi Kebutuhan", description: "Kami akan mengidentifikasi dokumen apa saja yang Anda butuhkan berdasarkan jenis dan skala usaha Anda." },
                { title: "Pengumpulan Dokumen", description: "Anda cukup menyiapkan dokumen persyaratan seperti KTP dan NPWP pribadi, kami bantu proses selanjutnya." },
                { title: "Proses Pengajuan", description: "Tim kami akan melakukan pengajuan secara online dan memantau prosesnya hingga selesai." },
                { title: "Penyerahan Dokumen", description: "Dokumen legalitas yang sudah terbit akan kami serahkan kepada Anda." }
            ]
        },
        {
            icon: 'chat',
            title: 'Legal Consult',
            description: 'Konsultasi hukum via chat dengan AI atau terhubung dengan konsultan hukum profesional.',
            detailedDescription: "Dapatkan jawaban cepat dan akurat untuk pertanyaan-pertanyaan hukum seputar bisnis Anda. Layanan Legal Consult kami menyediakan dua tingkat layanan: konsultasi instan dengan AI Legal Advisor kami, HUMI, untuk pertanyaan umum, dan sesi konsultasi privat dengan konsultan hukum profesional untuk kasus yang lebih spesifik dan mendalam.",
            benefits: ["Jawaban hukum cepat & akurat", "Biaya konsultasi terjangkau", "Kerahasiaan terjamin", "Saran praktis untuk UMKM"],
            process: [
                { title: "Ajukan Pertanyaan", description: "Tanyakan masalah hukum Anda melalui platform chat kami, baik kepada AI maupun untuk dijadwalkan dengan konsultan." },
                { title: "Analisis Awal oleh AI", description: "HUMI akan memberikan jawaban instan untuk pertanyaan-pertanyaan umum dan umum." },
                { title: "Penjadwalan Sesi (Jika Perlu)", description: "Jika dibutuhkan, kami akan menjadwalkan sesi konsultasi video call dengan konsultan yang sesuai." },
                { title: "Sesi Konsultasi Mendalam", description: "Diskusikan masalah Anda secara detail dan dapatkan nasihat hukum yang komprehensif." }
            ]
        },
        {
            icon: 'request_quote',
            title: 'Legal Contract',
            description: 'Pembuatan dan peninjauan draf kontrak bisnis, seperti perjanjian kerja sama atau sewa.',
            detailedDescription: "Kontrak adalah fondasi dari setiap hubungan bisnis yang sehat. Layanan Legal Contract kami membantu Anda membuat atau meninjau berbagai jenis perjanjian untuk melindungi kepentingan bisnis Anda, seperti surat perjanjian kerja sama dengan mitra, kontrak sewa tempat usaha, atau perjanjian dengan pemasok. Kami memastikan semua klausul jelas, adil, dan mengikat secara hukum.",
            benefits: ["Melindungi dari sengketa", "Memastikan kepastian hukum", "Klausul yang adil dan seimbang", "Mencegah kerugian di masa depan"],
            process: [
                { title: "Kirim Kebutuhan Kontrak", description: "Jelaskan jenis kontrak yang Anda butuhkan atau kirimkan draf yang ingin Anda tinjau." },
                { title: "Penyusunan Draf Awal", description: "Tim hukum kami akan menyusun draf kontrak sesuai dengan kebutuhan dan standar hukum yang berlaku." },
                { title: "Sesi Review & Revisi", description: "Kami akan membahas draf bersama Anda untuk memastikan semua poin sesuai dengan keinginan Anda." },
                { title: "Finalisasi Kontrak", description: "Anda akan menerima dokumen kontrak final yang siap untuk ditandatangani." }
            ]
        },
        {
            icon: 'support_agent',
            title: 'Legal Advisor',
            description: 'Pendampingan hukum berkelanjutan untuk memastikan bisnis Anda patuh pada regulasi.',
            detailedDescription: "Bagi UMKM yang sedang berkembang, memiliki penasihat hukum tetap bisa menjadi langkah strategis. Layanan Legal Advisor kami menyediakan pendampingan hukum berkelanjutan dengan sistem berlangganan yang terjangkau. Anda bisa berkonsultasi kapan saja mengenai kepatuhan (compliance), regulasi baru, atau masalah hukum lain yang muncul dalam operasional bisnis sehari-hari.",
            benefits: ["Pendampingan berkelanjutan", "Update regulasi terbaru", "Mitigasi risiko hukum", "Biaya lebih efisien daripada per kasus"],
            process: [
                { title: "Pilih Paket Langganan", description: "Pilih paket bulanan atau tahunan yang paling sesuai dengan skala bisnis Anda." },
                { title: "Sesi Onboarding", description: "Sesi awal untuk memahami model bisnis dan potensi risiko hukum yang ada." },
                { title: "Akses Konsultasi Prioritas", description: "Dapatkan akses prioritas untuk berkonsultasi melalui chat, telepon, atau video call." },
                { title: "Review Berkala", description: "Sesi review triwulanan untuk memastikan bisnis Anda tetap patuh pada peraturan." }
            ]
        },
        {
            icon: 'sos',
            title: 'Legal Help',
            description: 'Bantuan hukum awal untuk sengketa bisnis atau permasalahan hukum mendesak lainnya.',
            detailedDescription: "Menghadapi sengketa bisnis atau masalah hukum yang mendesak bisa sangat menegangkan. Layanan Legal Help kami dirancang untuk memberikan pertolongan pertama hukum. Kami akan menganalisis situasi Anda, memberikan pandangan hukum awal, dan menyarankan langkah-langkah strategis yang perlu diambil, seperti mediasi, negosiasi, atau jika perlu, menunjuk pengacara yang tepat.",
            benefits: ["Penanganan cepat & responsif", "Analisis situasi dari ahli", "Saran langkah strategis", "Mencegah masalah menjadi lebih besar"],
            process: [
                { title: "Laporkan Masalah Mendesak", description: "Hubungi kami melalui hotline khusus dan jelaskan situasi yang Anda hadapi." },
                { title: "Analisis Kasus Cepat", description: "Tim kami akan segera menganalisis dokumen dan kronologi yang Anda berikan." },
                { title: "Rekomendasi Tindakan", description: "Kami akan memberikan rekomendasi langkah hukum awal yang harus diambil." },
                { title: "Fasilitasi Bantuan Lanjutan", description: "Jika diperlukan, kami akan membantu menghubungkan Anda dengan mitra hukum kami." }
            ]
        }
    ];

    const handleSelectService = (service: LegalService) => {
        setSelectedService(service);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBackToList = () => {
        setSelectedService(null);
    };

    if (selectedService) {
        return <ServiceDetailView service={selectedService} onBack={handleBackToList} />;
    }

  return (
    <div className="container mx-auto px-6 py-12">
      <SectionTitle 
        title="HalloHukum - Legal Partner UMKM"
        subtitle="Dapatkan kemudahan mengurus legalitas dan konsultasi hukum untuk usaha Anda."
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Chatbot Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-2xl border flex flex-col h-[70vh] max-h-[600px]">
            {/* Chat Header */}
            <div className="bg-red-600 text-white p-4 rounded-t-2xl flex items-center space-x-3">
                <span className="material-symbols-outlined">support_agent</span>
                <h3 className="font-bold text-lg">HUMI - AI Legal Advisor</h3>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                    <div className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl shadow-sm ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                    <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }}></p>
                    </div>
                </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start mb-4">
                        <div className="bg-gray-200 text-gray-800 rounded-2xl p-3 rounded-bl-none">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-75"></div>
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-150"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
                <div className="flex items-center space-x-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Tanyakan seputar legalitas UMKM..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                    disabled={isLoading}
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading}
                    className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 disabled:bg-red-300 transition-colors"
                >
                    <span className="material-symbols-outlined">send</span>
                </button>
                </div>
            </div>
        </div>

        {/* Quick Topics Section */}
        <div className="lg:col-span-1">
             <div className="bg-white p-6 rounded-lg shadow-lg border h-full">
                <h3 className="font-bold text-xl mb-4 text-gray-800">Tanya Cepat</h3>
                <p className="text-sm text-gray-500 mb-4">Klik salah satu topik di bawah untuk langsung menanyakannya pada HUMI.</p>
                <div className="space-y-3">
                    {quickTopics.map(topic => (
                        <button 
                            key={topic.question} 
                            onClick={() => handleQuickAsk(topic.prompt, topic.question)}
                            disabled={isLoading}
                            className="w-full text-left p-3 bg-gray-50 rounded-md hover:bg-red-50 transition-colors flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed border hover:border-red-200"
                        >
                            <span className="material-symbols-outlined text-red-500">{topic.icon}</span>
                            <span className="font-semibold text-gray-700">{topic.question}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </div>
      
      {/* Services Section */}
      <section className="mt-20">
        <SectionTitle 
            title="Layanan Hukum Terpadu"
            subtitle="Kami menyediakan berbagai layanan untuk memastikan usaha Anda aman dan patuh hukum."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {legalServices.map(service => (
                <ServiceCard key={service.title} service={service} onClick={() => handleSelectService(service)} />
            ))}
            {/* An extra card to balance the grid if there are 5 items */}
             <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed flex flex-col justify-center items-center text-center">
                <span className="material-symbols-outlined text-4xl text-gray-400">add</span>
                <h3 className="text-lg font-bold text-gray-800 mt-2">Layanan Lainnya</h3>
                <p className="text-gray-600 text-sm mt-1">Hubungi kami untuk kebutuhan hukum spesifik Anda.</p>
            </div>
        </div>
      </section>

    </div>
  );
};

export default HalloHukum;