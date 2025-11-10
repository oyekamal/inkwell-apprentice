import React, { useState, useCallback } from 'react';
import { Selector } from './Selector';
import { Loader } from './Loader';
import { LessonPage } from './LessonPage';
import { TitlePage } from './TitlePage';
import { THEMES, LEVELS, LESSON_COUNT } from '../constants';
import type { Lesson, Status } from '../types';
import { generateLessonPlan, generateDrawing } from '../services/geminiService';

declare const jspdf: any;
declare const html2canvas: any;

export const PracticeView: React.FC = () => {
  const [theme, setTheme] = useState<string>(THEMES[0]);
  const [level, setLevel] = useState<string>(LEVELS[0]);
  const [status, setStatus] = useState<Status>('idle');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ current: number; total: number }>({ current: 0, total: LESSON_COUNT });
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const handleGenerate = useCallback(async () => {
    setStatus('generatingPlan');
    setLessons([]);
    setError(null);
    setProgress({ current: 0, total: LESSON_COUNT });

    try {
      const subjects = await generateLessonPlan(theme, level);
      setStatus('generatingImages');
      
      const generatedLessons: Lesson[] = [];
      for (let i = 0; i < subjects.length; i++) {
        setProgress({ current: i + 1, total: subjects.length });
        const imageBase64 = await generateDrawing(subjects[i], theme, level);
        generatedLessons.push({ subject: subjects[i], imageBase64 });
      }
      
      setLessons(generatedLessons);
      setStatus('ready');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setStatus('error');
    }
  }, [theme, level]);

  const handleDownloadPdf = useCallback(async () => {
    const content = document.getElementById('pdf-content');
    if (!content || lessons.length === 0) return;

    setIsDownloading(true);
    try {
        const { jsPDF } = jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        const pages = content.querySelectorAll('.a4-page-container');
        for (let i = 0; i < pages.length; i++) {
            const page = pages[i] as HTMLElement;
            const canvas = await html2canvas(page, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            if (i > 0) {
                pdf.addPage();
            }
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        }
        
        pdf.save(`Inkwell-Apprentice-${theme}-${level}.pdf`);
    } catch (err) {
        console.error("Failed to generate PDF:", err);
        setError("Could not generate the PDF. Please try again.");
    } finally {
        setIsDownloading(false);
    }
  }, [lessons, theme, level]);
  
  const isGenerating = status === 'generatingPlan' || status === 'generatingImages';

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif font-bold text-gray-100">Practice Area</h2>
        <p className="mt-2 text-lg text-gray-400">
          Apply what you've learned. Generate personalized practice sheets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Selector label="Drawing Theme" options={THEMES} value={theme} onChange={setTheme} disabled={isGenerating} />
        <Selector label="Skill Level" options={LEVELS} value={level} onChange={setLevel} disabled={isGenerating} />
        <div className="md:col-span-2 lg:col-span-1 flex items-end">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full h-12 px-6 font-semibold tracking-wide text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isGenerating ? 'Generating...' : 'Create Practice Sheets'}
          </button>
        </div>
      </div>

      <div className="mt-8 min-h-[400px]">
        {status === 'idle' && (
          <div className="flex flex-col items-center justify-center text-center p-8 bg-gray-900/30 rounded-lg min-h-[400px]">
            <h3 className="text-2xl font-serif text-gray-300">Ready to Practice?</h3>
            <p className="mt-2 text-gray-400">Select a theme and skill level, then click "Create Practice Sheets" to begin.</p>
          </div>
        )}
        {isGenerating && <Loader status={status} progress={progress} />}
        {status === 'error' && <div className="text-center text-red-400 p-8 bg-red-900/20 rounded-lg">{error}</div>}
        {status === 'ready' && lessons.length > 0 && (
          <div className="flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-6 p-4 bg-gray-900 rounded-lg">
                <h2 className="text-xl font-serif text-indigo-300">Your Lessons are Ready!</h2>
                <button
                    onClick={handleDownloadPdf}
                    disabled={isDownloading}
                    className="px-6 py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    {isDownloading ? 'Downloading...' : 'Download PDF'}
                </button>
            </div>
            <p className="text-gray-400 mb-6 text-center">Below is a preview of your printable A4 lesson pages. Use the download button to save the complete PDF.</p>
            
            <div className="w-full max-w-[794px] transform scale-[0.8] sm:scale-[0.9] lg:scale-100 origin-top">
                <div id="pdf-content" className="space-y-4">
                  <TitlePage title={theme} subtitle={level} />
                  {lessons.map((lesson, index) => (
                      <LessonPage
                          key={index}
                          lesson={lesson}
                          theme={theme}
                          level={level}
                          pageNumber={index + 1}
                          totalPages={lessons.length}
                      />
                  ))}
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};