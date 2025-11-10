
export interface Lesson {
  subject: string;
  imageBase64: string;
}

export type Status = 'idle' | 'generatingPlan' | 'generatingImages' | 'ready' | 'error';

// New types for the course
export interface CourseLesson {
  title: string;
  content: string[]; // An array of paragraphs
}

export interface CourseModule {
  moduleTitle: string;
  description: string;
  lessons: CourseLesson[];
}
