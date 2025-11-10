import React, { useState, useCallback } from 'react';
import { COURSE_CURRICULUM } from '../courseContent';
import type { CourseLesson, CourseModule, Status, Lesson } from '../types';
import { generateCourseExercises, generateDrawing } from '../services/geminiService';
import { Loader } from './Loader';
import { TitlePage } from './TitlePage';
import { TextPage } from './TextPage';
import { LessonPage } from './LessonPage';

declare const jspdf: any;
declare const html2canvas: any;

interface SelectedLessonInfo {
  lesson: CourseLesson;
  module: CourseModule;
}

export const CourseView: React.FC = () => {
  const [selectedLessonInfo, setSelectedLessonInfo] = useState<SelectedLessonInfo | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [generatedExercises, setGeneratedExercises] = useState<Lesson[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ current: number; total: number }>({ current: 0, total: 2 });
  const [isDownloading, setIsDownloading] = useState(false);

  const resetGeneratorState = () => {
    setStatus('idle');
    setGeneratedExercises([]);
    setError(null);
    setProgress({ current: 0, total: 2 });
  };
  
  const handleSelectLesson = (lesson: CourseLesson, module: CourseModule) => {
    setSelectedLessonInfo({ lesson, module });
    resetGeneratorState();
  }
  
  const handleBackToCurriculum = () => {
    setSelectedLessonInfo(null);
  };

  const handleGenerate = useCallback(async () => {
    if (!selectedLessonInfo) return;
    const { lesson, module } = selectedLessonInfo;

    setStatus('generatingPlan');
    setError(null);
    setGeneratedExercises([]);

    try {
      const subjects = await generateCourseExercises(lesson.title, lesson.content);
      setProgress({ current: 0, total: subjects.length });
      setStatus('generatingImages');

      const exercises: Lesson[] = [];
      for (let i = 0; i < subjects.length; i++) {
        setProgress({ current: i + 1, total: subjects.length });
        const imageBase64 = await generateDrawing(subjects[i], module.moduleTitle, "Course");
        exercises.push({ subject: subjects[i], imageBase64 });

        // Add a delay to avoid hitting API rate limits
        if (i < subjects.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }

      setGeneratedExercises(exercises);
      setStatus('ready');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setStatus('error');
    }
  }, [selectedLessonInfo]);
  
  const handleDownloadPdf = useCallback(async () => {
    if (!selectedLessonInfo) return;
    
    const content = document.getElementById('pdf-content-course');
    if (!content) return;

    setIsDownloading(true);
    try {
        const { jsPDF } = jspdf;
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const pages = content.querySelectorAll('.a4-page-container');

        for (let i = 0; i < pages.length; i++) {
            const page = pages[i] as HTMLElement;
            const canvas = await html2canvas(page, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            if (i > 0) pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        }
        
        pdf.save(`Inkwell-Apprentice-${selectedLessonInfo.lesson.title}.pdf`);
    } catch (err) {
        console.error("Failed to generate PDF:", err);
        setError("Could not generate the PDF. Please try again.");
    } finally {
        setIsDownloading(false);
    }
  }, [selectedLessonInfo]);

  // View for a single, selected lesson
  if (selectedLessonInfo) {
    const { lesson, module } = selectedLessonInfo;
    const isGenerating = status === 'generatingPlan' || status === 'generatingImages';
    const totalPdfPages = 1 + 1 + generatedExercises.length; // Title, Text, Exercises

    return (
      <div className="animate-fade-in">
        <button
          onClick={handleBackToCurriculum}
          className="mb-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-200 bg-indigo-800/50 hover:bg-indigo-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors"
        >
          &larr; Back to Curriculum
        </button>
        <article className="prose prose-invert prose-lg max-w-none bg-gray-900/30 p-6 rounded-lg">
          <h2 className="font-serif text-3xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-400">
            {lesson.title}
          </h2>
          {lesson.content.map((paragraph, index) => (
            <p key={index} className="text-gray-300 leading-relaxed">{paragraph}</p>
          ))}
        </article>

        <div className="mt-8 pt-8 border-t border-gray-700">
          {status === 'idle' && (
            <div className="text-center p-6 bg-gray-900/30 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-200">Ready to put theory into practice?</h3>
                <p className="text-gray-400 mt-2 mb-4">Generate a printable PDF of this lesson, complete with custom practice exercises.</p>
                <button 
                  onClick={handleGenerate}
                  className="px-6 py-3 font-semibold tracking-wide text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all duration-300"
                >
                  Generate Printable Lesson
                </button>
            </div>
          )}
          
          {isGenerating && <Loader status={status} progress={progress} />}
          {status === 'error' && <div className="text-center text-red-400 p-8 bg-red-900/20 rounded-lg">{error}</div>}
          
          {status === 'ready' && (
            <div className="flex flex-col items-center">
              <div className="w-full flex justify-between items-center mb-6 p-4 bg-gray-900 rounded-lg">
                  <h2 className="text-xl font-serif text-indigo-300">Your Lesson PDF is Ready!</h2>
                  <button onClick={handleDownloadPdf} disabled={isDownloading} className="px-6 py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed">
                      {isDownloading ? 'Downloading...' : 'Download PDF'}
                  </button>
              </div>
              <p className="text-gray-400 mb-6 text-center">Below is a preview of your printable lesson. Use the download button to save the complete PDF.</p>
              
              <div className="w-full max-w-[794px] transform scale-[0.8] sm:scale-[0.9] lg:scale-100 origin-top">
                  <div id="pdf-content-course" className="space-y-4">
                    <TitlePage title={lesson.title} subtitle={module.moduleTitle} />
                    <TextPage title={lesson.title} content={lesson.content} pageNumber={2} totalPages={totalPdfPages} />
                    {generatedExercises.map((exercise, index) => (
                      <LessonPage 
                        key={index}
                        lesson={exercise}
                        theme={module.moduleTitle}
                        level={lesson.title}
                        pageNumber={3 + index}
                        totalPages={totalPdfPages}
                      />
                    ))}
                  </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main view showing all modules and lessons
  return (
    <div className="space-y-10 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-serif font-bold text-gray-100">Course Curriculum</h2>
        <p className="mt-2 text-lg text-gray-400">
          Learn the principles of ink drawing from the ground up. Select a lesson to begin.
        </p>
      </div>
      <div className="space-y-8">
        {COURSE_CURRICULUM.map((module) => (
          <div key={module.moduleTitle} className="p-6 bg-gray-900/50 rounded-lg border border-gray-700">
            <h3 className="text-2xl font-serif font-semibold text-indigo-300">
              {module.moduleTitle}
            </h3>
            <p className="mt-1 text-gray-400">{module.description}</p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {module.lessons.map((lesson) => (
                <button
                  key={lesson.title}
                  onClick={() => handleSelectLesson(lesson, module)}
                  className="p-4 text-left bg-gray-800 hover:bg-gray-700/80 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
                >
                  <p className="font-semibold text-gray-200">{lesson.title}</p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};