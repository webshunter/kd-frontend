import React from 'react';
import { type Feature, View } from '../types';

interface FeatureCardProps {
  feature: Feature;
  onClick: (view: View) => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, onClick }) => {
  return (
    <div 
      className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col items-center text-center"
      onClick={() => onClick(feature.view)}
    >
      <div className={`p-4 rounded-full bg-blue-100 mb-4 ${feature.color}`}>
        <span className="material-symbols-outlined text-4xl">{feature.icon}</span>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
      <p className="text-gray-600 text-sm">{feature.description}</p>
    </div>
  );
};

export default FeatureCard;
