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
  const [isDownloading, setIs