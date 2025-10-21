import React from 'react';

interface SectionTitleProps {
  title: string;
  subtitle: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800">{title}</h2>
      <p className="text-md text-gray-500 mt-2 max-w-2xl mx-auto">{subtitle}</p>
      <div className="mt-4 h-1 w-24 bg-blue-600 mx-auto rounded-full"></div>
    </div>
  );
};

export default SectionTitle;
