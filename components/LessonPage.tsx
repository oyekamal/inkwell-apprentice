import React from 'react';
import type { Lesson } from '../types';

interface LessonPageProps {
  lesson: Lesson;
  theme: string;
  level: string;
  pageNumber: number;
  totalPages: number;
}

export const LessonPage: React.FC<LessonPageProps> = ({ lesson, theme, level, pageNumber, totalPages }) => {
  return (
    <div className="a4-page-container w-[794px] h-[1123px] bg-white text-black p-8 flex flex-col font-sans shadow-lg">
      <header className="flex justify-between items-center pb-4 border-b border-gray-300">
        <h2 className="text-lg font-semibold capitalize">{lesson.subject}</h2>
        <div className="text-sm text-gray-600">Page {pageNumber} of {totalPages}</div>
      </header>
      
      <main className="flex-grow grid grid-cols-2 gap-8 py-8">
        {/* Left Side: Example Drawing */}
        <div className="flex flex-col">
          <h3 className="text-center font-semibold text-gray-700 mb-4 border-b pb-2">Example Drawing</h3>
          <div className="flex-grow flex items-center justify-center p-4 border border-dashed border-gray-300 bg-gray-50 rounded-lg">
            <img 
              src={`data:image/png;base64,${lesson.imageBase64}`} 
              alt={lesson.subject} 
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>

        {/* Right Side: Practice Area */}
        <div className="flex flex-col">
          <h3 className="text-center font-semibold text-gray-700 mb-4 border-b pb-2">Practice Area</h3>
          <div className="flex-grow flex items-center justify-center p-4 border border-dashed border-gray-300 bg-gray-50 rounded-lg relative">
            <img 
              src={`data:image/png;base64,${lesson.imageBase64}`} 
              alt={`Practice guide for ${lesson.subject}`} 
              className="max-w-full max-h-full object-contain opacity-20"
            />
          </div>
        </div>
      </main>
      
      <footer className="text-center text-xs text-gray-500 pt-4 border-t border-gray-300">
        Inkwell Apprentice | {theme} - {level}
      </footer>
    </div>
  );
};