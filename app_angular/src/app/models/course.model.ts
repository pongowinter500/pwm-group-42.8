/**
 * Course Model
 * Defines the structure of a course object
 */
export interface Course {
  id: number;
  courseName: string;
  courseTitle: string;
  courseSubtitle: string;
  instructorId: number;
  instructorImg: string;
  instructorName: string;
  instructorTitle: string;
  section1Title: string;
  section1Text: string;
  section2Title: string;
  topics: string[];
  duration: string;
  level: string;
  price: number;
  category: string;
  icon: string;
  isNew: boolean;
  catalogueDescription: string;
  description: string;
}

/**
 * Instructor Model
 * Defines the structure of an instructor object
 */
export interface Instructor {
  id: number;
  name: string;
  title: string;
  alternateTitle?: string;
  image: string;
  bio: string;
  specialization: string[];
}

/**
 * Content Data Model
 * Root structure of content.json
 */
export interface ContentData {
  courses: Course[];
  instructors: Instructor[];
}

/**
 * Feature Model
 * For business page features
 */
export interface Feature {
  title: string;
  description: string;
  icon?: string;
}
