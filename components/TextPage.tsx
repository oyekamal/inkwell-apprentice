import React from 'react';

interface TextPageProps {
  title: string;
  content: string[];
  pageNumber: number;
  totalPages: number;
}

export const TextPage: React.FC<TextPageProps> = ({ title, content, pageNumber, totalPages }) => {
  return (
    <div className="a4-page-container w-[794px] h-[1123px] bg-white text-black p-12 flex flex-col font-serif shadow-lg">
      <header className="flex justify-between items-center pb-4 border-b border-gray-400">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="text-sm text-gray-600">Page {pageNumber} of {totalPages}</div>
      </header>
      <main className="flex-grow pt-8 text-lg text-gray-800">
        {content.map((paragraph, index) => (
          <p key={index} className="leading-relaxed mb-6">{paragraph}</p>
        ))}
      </main>
      <footer className="text-center text-xs text-gray-500 pt-4 border-t border-gray-300">
        Inkwell Apprentice | Course Curriculum
      </footer>
    </div>
  );
};
