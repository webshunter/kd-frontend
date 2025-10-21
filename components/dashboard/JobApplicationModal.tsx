import React, { useState, useEffect } from 'react';
import { Job } from '../../types';

interface JobApplicationModalProps {
    job: Job | null;
    onClose: () => void;
}

const JobApplicationModal: React.FC<JobApplicationModalProps> = ({ job, onClose }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', cv: null as File | null, coverLetter: '' });
    const [formErrors, setFormErrors] = useState({ fullName: '', email: '', phone: '', cv: '' });

    useEffect(() => {
        // Reset state when the job prop changes (modal opens for a new job)
        setIsSubmitted(false);
        setFormData({ fullName: '', email: '', phone: '', cv: null, coverLetter: '' });
        setFormErrors({ fullName: '', email: '', phone: '', cv: '' });
    }, [job]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value, type } = e.target;
        if (type === 'file') {
            const files = (e.target as HTMLInputElement).files;
            setFormData(prev => ({ ...prev, [id]: files ? files[0] : null }));
        } else {
            setFormData(prev => ({ ...prev, [id]: value }));
        }
    };

    const validate = () => {
        const errors = { fullName: '', email: '', phone: '', cv: '' };
        let isValid = true;
        
        if (formData.fullName.trim().length < 3) {
            errors.fullName = 'Nama lengkap harus diisi.';
            isValid = false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Format email tidak valid.';
            isValid = false;
        }
        if (!/^08[1-9][0-9]{7,10}$/.test(formData.phone)) {
            errors.phone = 'Format nomor telepon tidak valid (contoh: 08123456789).';
            isValid = false;
        }
        if (!formData.cv) {
            errors.cv = 'CV/Resume wajib diunggah.';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            console.log('Submitting application:', formData);
            setIsSubmitting(false);
            setIsSubmitted(true);
        }, 1500);
    };

    if (!job) return null;

    return (
         <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="application-modal-title"
                className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col transform transition-all duration-300 scale-95 animate-scale-in"
                onClick={e => e.stopPropagation()}
            >
                {isSubmitted ? (
                    <div className="text-center p-8 flex flex-col items-center justify-center h-full">
                        <span className="material-symbols-outlined text-6xl text-green-500">check_circle</span>
                        <h2 className="text-2xl font-bold text-gray-800 mt-4">Lamaran Terkirim!</h2>
                        <p className="mt-2 text-gray-600">
                            Lamaran Anda untuk posisi <strong>{job.title}</strong> di <strong>{job.company}</strong> telah berhasil dikirim. Harap tunggu kabar selanjutnya dari perusahaan.
                        </p>
                        <button onClick={onClose} className="mt-6 w-full bg-blue-600 text-white font-bold py-3 rounded-full hover:bg-blue-700">
                            Tutup
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="p-6 border-b flex justify-between items-center flex-shrink-0">
                            <div>
                                <h2 id="application-modal-title" className="text-xl font-bold text-gray-800">Lamar Posisi</h2>
                                <p className="text-gray-600">{job.title} di {job.company}</p>
                            </div>
                             <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                                <input type="text" id="fullName" value={formData.fullName} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                                {formErrors.fullName && <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>}
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                                {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
                                <input type="tel" id="phone" value={formData.phone} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                                {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                            </div>
                            <div>
                                 <label htmlFor="cv" className="block text-sm font-medium text-gray-700">Unggah CV/Resume (PDF)</label>
                                 <input type="file" id="cv" onChange={handleChange} required accept=".pdf" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                 {formErrors.cv && <p className="text-red-500 text-xs mt-1">{formErrors.cv}</p>}
                            </div>
                            <div>
                                <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700">Surat Lamaran (Opsional)</label>
                                <textarea id="coverLetter" value={formData.coverLetter} onChange={handleChange} rows={4} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
                            </div>
                        </form>
                         <div className="p-4 bg-gray-50 border-t flex justify-end items-center space-x-3 flex-shrink-0">
                            <button onClick={onClose} type="button" className="bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-full hover:bg-gray-300">
                                Batal
                            </button>
                            <button onClick={handleSubmit} disabled={isSubmitting} type="submit" className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-blue-700 disabled:bg-blue-300 flex items-center">
                                 {isSubmitting && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                                {isSubmitting ? 'Mengirim...' : 'Kirim Lamaran'}
                            </button>
                        </div>
                    </>
                )}
            </div>
         </div>
    );
};

export default JobApplicationModal;
