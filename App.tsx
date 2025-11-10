
import React, { useState } from 'react';
import { Header } from './components/Header';
import { CourseView } from './components/CourseView';
import { PracticeView } from './components/PracticeView';

type AppView = 'course' | 'practice';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('course');

  const navButtonClasses = (isActive: boolean) => 
    `px-4 sm:px-6 py-3 text-md sm:text-lg font-semibold rounded-t-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 ${
      isActive
        ? 'bg-gray-800 text-white'
        : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
    }`;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        
        <nav className="mt-8 border-b border-gray-700">
          <div className="flex space-x-1 sm:space-x-2">
            <button onClick={() => setView('course')} className={navButtonClasses(view === 'course')}>
              Course Curriculum
            </button>
            <button onClick={() => setView('practice')} className={navButtonClasses(view === 'practice')}>
              Practice Area
            </button>
          </div>
        </nav>

        <main className="bg-gray-800 rounded-b-lg shadow-2xl p-6 backdrop-blur-sm border border-t-0 border-gray-700">
          {view === 'course' && <CourseView />}
          {view === 'practice' && <PracticeView />}
        </main>
      </div>
    </div>
  );
};

export default App;
