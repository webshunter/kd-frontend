

import React, { useState, useMemo } from 'react';
import { MOCK_UMKM_DATA } from '../../constants';
import { UMKMProfile } from '../../types';

// --- Readiness Score Logic ---
const SCORE_MAP = {
    financialRecording: { none: 0, manual: 1, spreadsheet: 2, app: 3 },
    productPackaging: { basic: 0, labeled: 1, professional: 2, irrelevant: 2 },
    digitalPaymentAdoption: { cash_only: 0, transfer: 1, ewallet: 2, qris: 3 },
    onlinePresence: { none: 0, social_media: 1, marketplace: 2, website: 3 },
};
const MAX_SCORES = {
    financialRecording: 3,
    productPackaging: 2,
    digitalPaymentAdoption: 3,
    onlinePresence: 3,
};
const calculateReadinessScore = (umkm: UMKMProfile) => {
    const totalScore = 
        (SCORE_MAP.financialRecording[umkm.financialRecording || 'none']) +
        (SCORE_MAP.productPackaging[umkm.productPackaging || 'basic']) +
        (SCORE_MAP.digitalPaymentAdoption[umkm.digitalPaymentAdoption || 'cash_only']) +
        (SCORE_MAP.onlinePresence[umkm.onlinePresence || 'none']);
    
    const maxScore = Object.values(MAX_SCORES).reduce((acc, val) => acc + val, 0);
    return Math.round((totalScore / maxScore) * 100);
};

// --- Types for Sorting ---
type SortableKey = 'businessName' | 'ownerName' | 'category' | 'readinessScore';
type SortDirection = 'ascending' | 'descending';
interface SortConfig {
    key: SortableKey;
    direction: SortDirection;
}

// --- Helper Component for Sort Icon ---
const SortIcon: React.FC<{ direction: SortDirection }> = ({ direction }) => (
    <span className="material-symbols-outlined !text-base ml-1">
        {direction === 'ascending' ? 'arrow_upward' : 'arrow_downward'}
    </span>
);

// --- Main Table Component ---
const ManageUMKMView: React.FC = () => {
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

    const sortedData = useMemo(() => {
        let sortableData = MOCK_UMKM_DATA.map(umkm => ({
            ...umkm,
            readinessScore: calculateReadinessScore(umkm)
        }));

        if (sortConfig !== null) {
            sortableData.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableData;
    }, [sortConfig]);

    const requestSort = (key: SortableKey) => {
        let direction: SortDirection = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };
    
    const getReadinessBadge = (score: number) => {
        if (score >= 75) return 'bg-green-100 text-green-800';
        if (score >= 40) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };
    
    const TableHeader: React.FC<{ sortKey: SortableKey, children: React.ReactNode }> = ({ sortKey, children }) => (
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <button onClick={() => requestSort(sortKey)} className="flex items-center group focus:outline-none">
                <span className="group-hover:text-gray-800">{children}</span>
                {sortConfig?.key === sortKey 
                    ? <SortIcon direction={sortConfig.direction} />
                    : <span className="material-symbols-outlined !text-base ml-1 text-gray-300 group-hover:text-gray-500 transition-colors">unfold_more</span>
                }
            </button>
        </th>
    );

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg border animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Daftar UMKM Terdaftar</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <TableHeader sortKey="businessName">Nama Usaha</TableHeader>
                            <TableHeader sortKey="ownerName">Nama Pemilik</TableHeader>
                            <TableHeader sortKey="category">Kategori</TableHeader>
                            <TableHeader sortKey="readinessScore">Kesiapan Digital</TableHeader>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedData.map(umkm => (
                            <tr key={umkm.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-full object-cover" src={umkm.image} alt={umkm.businessName} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{umkm.businessName}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{umkm.ownerName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{umkm.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getReadinessBadge(umkm.readinessScore)}`}>
                                        {umkm.readinessScore}%
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUMKMView;