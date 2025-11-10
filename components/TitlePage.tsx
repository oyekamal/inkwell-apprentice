import React from 'react';

interface TitlePageProps {
  title: string;
  subtitle: string;
}

export const TitlePage: React.FC<TitlePageProps> = ({ title, subtitle }) => {
  return (
    <div className="a4-page-container w-[794px] h-[1123px] bg-white text-black p-12 flex flex-col justify-center items-center font-serif shadow-lg">
      <div className="text-center border-4 border-black p-12">
          <h1 className="text-6xl font-bold">Inkwell Apprentice</h1>
          <p className="text-3xl mt-4">Drawing Lessons</p>
          <div className="my-16 h-1 w-32 bg-black mx-auto"></div>
          <h2 className="text-5xl font-semibold capitalize">{title}</h2>
          <p className="text-3xl mt-2 capitalize">{subtitle}</p>
      </div>
    </div>
  );
};
