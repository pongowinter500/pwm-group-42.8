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
  about?: AboutContent;
  business?: BusinessContent;
  siteInfo?: SiteInfo;
  frontendConfig?: {
    adminEditableSelectors?: string[];
  };
}

/**
 * Feature Model
 * For business page features
 */
export interface Feature {
  id?: number;
  title: string;
  description: string;
  icon?: string;
}

export interface AboutContent {
  hero: {
    title: string;
    description: string;
  };
  mission: {
    title: string;
    description: string;
  };
  offer: {
    title: string;
    description: string;
  };
}

export interface BusinessContent {
  hero: {
    title: string;
    description: string;
    contactEmail?: string;
    ctaText?: string;
  };
  features: Feature[];
}

export interface SiteInfo {
  name?: string;
  description?: string;
  contactEmail?: string;
  businessEmail?: string;
}
