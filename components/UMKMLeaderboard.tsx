
import React, { useMemo } from 'react';
import { UMKMProfile } from '../types';
import { MOCK_UMKM_DATA } from '../constants';
import { calculateReadinessScore } from '../utils/umkmUtils';

interface UMKMLeaderboardProps {
    onSelect: (umkm: UMKMProfile) => void;
}

const UMKMLeaderboard: React.FC<UMKMLeaderboardProps> = ({ onSelect }) => {

    const leaderboardData = useMemo(() => {
        return MOCK_UMKM_DATA
            .map(umkm => ({
                ...umkm,
                readinessScore: calculateReadinessScore(umkm)
            }))
            .sort((a, b) => b.readinessScore - a.readinessScore)
            .slice(0, 5);
    }, []);
    
    const rankColors = [
        'bg-yellow-400 text-yellow-900', // 1st
        'bg-gray-300 text-gray-800',   // 2nd
        'bg-amber-600 text-white',  // 3rd
        'bg-gray-100 text-gray-700',   // 4th
        'bg-gray-100 text-gray-700',   // 5th
    ];

    const rankIcons = ['workspace_premium', 'military_tech', 'emoji_events'];

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg border h-full">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Top 5 UMKM Digital</h3>
            <div className="space-y-4">
                {leaderboardData.map((umkm, index) => (
                    <div 
                        key={umkm.id}
                        onClick={() => onSelect(umkm)}
                        className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(umkm); }}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${rankColors[index]}`}>
                            {index < 3 ? <span className="material-symbols-outlined !text-xl">{rankIcons[index]}</span> : (index + 1)}
                        </div>
                        <img src={umkm.image} alt={umkm.businessName} className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex-1 overflow-hidden">
                            <p className="font-semibold text-gray-800 truncate">{umkm.businessName}</p>
                            <p className="text-sm text-gray-500">{umkm.category}</p>
                        </div>
                        <div className="font-bold text-lg text-blue-600">{umkm.readinessScore}%</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UMKMLeaderboard;