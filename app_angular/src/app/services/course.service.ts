import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs, query, where, updateDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { tap, catchError, switchMap, map } from 'rxjs/operators';
import {
  Course,
  Instructor,
  ContentData,
  AboutContent,
  BusinessContent,
  Feature,
  SiteInfo
} from '../models/course.model';

/**
 * CourseService
 * Manages all course-related data operations
 * Loads from Firestore collections: courses, instructors, siteData
 */
@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private firestore = inject(Firestore);

  private contentDataSubject = new BehaviorSubject<ContentData | null>(null);
  private coursesSubject = new BehaviorSubject<Course[]>([]);
  private instructorsSubject = new BehaviorSubject<Instructor[]>([]);
  private siteInfoSubject = new BehaviorSubject<SiteInfo | null>(null);
  private aboutContentSubject = new BehaviorSubject<AboutContent | null>(null);
  private businessContentSubject = new BehaviorSubject<BusinessContent | null>(null);

  public contentData$ = this.contentDataSubject.asObservable();
  public courses$ = this.coursesSubject.asObservable();
  public instructors$ = this.instructorsSubject.asObservable();
  public siteInfo$ = this.siteInfoSubject.asObservable();
  public aboutContent$ = this.aboutContentSubject.asObservable();
  public businessContent$ = this.businessContentSubject.asObservable();

  constructor() {
    this.loadAllContent();
  }

  /**
   * Load all content from Firestore
   * Loads courses, instructors, and static data (about, business, siteInfo)
   */
  private loadAllContent(): void {
    Promise.all([
      this.loadCourses(),
      this.loadInstructors(),
      this.loadStaticContent()
    ]).then(() => {
      // Compose ContentData object
      const contentData: ContentData = {
        courses: this.coursesSubject.value,
        instructors: this.instructorsSubject.value,
        about: this.aboutContentSubject.value || undefined,
        business: this.businessContentSubject.value || undefined,
        siteInfo: this.siteInfoSubject.value || undefined
      };
      this.contentDataSubject.next(contentData);
    }).catch(error => {
      console.error('Error loading content from Firestore:', error);
    });
  }

  /**
   * Load all courses from Firestore 'courses' collection
   * Document IDs are course names (e.g., 'python', 'database')
   */
  private async loadCourses(): Promise<void> {
    try {
      const coursesRef = collection(this.firestore, 'courses');
      const querySnapshot = await getDocs(coursesRef);
      const courses: Course[] = [];

      querySnapshot.forEach((doc) => {
        const courseData = doc.data();
        courses.push({
          ...courseData,
          icon: this.normalizeAssetPath(courseData['icon']),
          instructorImg: this.normalizeAssetPath(courseData['instructorImg'])
        } as Course);
      });

      this.coursesSubject.next(courses);
    } catch (error) {
      console.error('Error loading courses from Firestore:', error);
      this.coursesSubject.next([]);
    }
  }

  /**
   * Load all instructors from Firestore 'instructors' collection
   * Document IDs are numeric instructor IDs
   */
  private async loadInstructors(): Promise<void> {
    try {
      const instructorsRef = collection(this.firestore, 'instructors');
      const querySnapshot = await getDocs(instructorsRef);
      const instructors: Instructor[] = [];

      querySnapshot.forEach((doc) => {
        const instructorData = doc.data();
        instructors.push({
          ...instructorData,
          image: this.normalizeAssetPath(instructorData['image'])
        } as Instructor);
      });

      this.instructorsSubject.next(instructors);
    } catch (error) {
      console.error('Error loading instructors from Firestore:', error);
      this.instructorsSubject.next([]);
    }
  }

  /**
   * Load static content from Firestore 'siteData' collection
   * Loads documents: about, business, siteInfo, frontendConfig
   */
  private async loadStaticContent(): Promise<void> {
    try {
      // Load about content
      const aboutRef = doc(this.firestore, 'siteData', 'about');
      const aboutSnap = await getDoc(aboutRef);
      if (aboutSnap.exists()) {
        this.aboutContentSubject.next(aboutSnap.data() as AboutContent);
      }

      // Load business content
      const businessRef = doc(this.firestore, 'siteData', 'business');
      const businessSnap = await getDoc(businessRef);
      if (businessSnap.exists()) {
        this.businessContentSubject.next(businessSnap.data() as BusinessContent);
      }

      // Load site info
      const siteInfoRef = doc(this.firestore, 'siteData', 'siteInfo');
      const siteInfoSnap = await getDoc(siteInfoRef);
      if (siteInfoSnap.exists()) {
        this.siteInfoSubject.next(siteInfoSnap.data() as SiteInfo);
      }
    } catch (error) {
      console.error('Error loading static content from Firestore:', error);
    }
  }

  /**
   * Get all courses
   */
  getCourses(): Observable<Course[]> {
    return this.courses$;
  }

  /**
   * Get about page content
   */
  getAboutContent(): Observable<AboutContent | null> {
    return this.aboutContent$;
  }

  /**
   * Get business page content
   */
  getBusinessContent(): Observable<BusinessContent | null> {
    return this.businessContent$;
  }

  /**
   * Get business features list
   */
  getBusinessFeatures(): Observable<Feature[]> {
    return this.businessContent$.pipe(
      map(business => business?.features ?? [])
    );
  }

  /**
   * Get global site information
   */
  getSiteInfo(): Observable<SiteInfo | null> {
    return this.siteInfo$;
  }

  /**
   * Get a single course by ID
   * ID can be numeric or courseName string depending on implementation
   */
  getCourseById(id: number | string): Observable<Course | undefined> {
    return this.courses$.pipe(
      map(courses => {
        // Try numeric ID first
        if (typeof id === 'number') {
          return courses.find(c => c.id === id);
        }
        // Then try courseName
        return courses.find(c => c.courseName === id);
      })
    );
  }

  /**
   * Get new courses (flagged with isNew: true)
   */
  getNewCourses(): Observable<Course[]> {
    return this.courses$.pipe(
      map(courses => courses.filter(c => c.isNew))
    );
  }

  /**
   * Get courses by category
   */
  getCoursesByCategory(category: string): Observable<Course[]> {
    return this.courses$.pipe(
      map(courses => courses.filter(c => c.category === category))
    );
  }

  /**
   * Get all instructors
   */
  getInstructors(): Observable<Instructor[]> {
    return this.instructors$;
  }

  /**
   * Get an instructor by ID
   */
  getInstructorById(id: number): Observable<Instructor | undefined> {
    return this.instructors$.pipe(
      map(instructors => instructors.find(i => i.id === id))
    );
  }

  /**
   * Search courses by keyword
   */
  searchCourses(keyword: string): Observable<Course[]> {
    return this.courses$.pipe(
      map(courses => {
        const lowerKeyword = keyword.toLowerCase();
        return courses.filter(course =>
          course.courseTitle.toLowerCase().includes(lowerKeyword) ||
          course.description.toLowerCase().includes(lowerKeyword) ||
          course.courseName.toLowerCase().includes(lowerKeyword)
        );
      })
    );
  }

  /**
   * Update a course in Firestore and local state
   */
  updateCourse(courseName: string, updates: Partial<Course>): Observable<void> {
    return from(
      updateDoc(doc(this.firestore, 'courses', courseName), updates as any).then(() => {
        const courses = this.coursesSubject.value.map(c => 
          c.courseName === courseName ? { ...c, ...updates } : c
        );
        this.coursesSubject.next(courses);
      })
    ).pipe(
      catchError(error => {
        console.error('Error updating course:', error);
        throw error;
      })
    );
  }

  /**
   * Normalize asset paths
   * Handles paths from Firestore Storage or local assets
   */
  private normalizeAssetPath(path: string): string {
    if (!path) return '';
    
    // If it's already a Firebase Storage URL, return as is
    if (path.startsWith('gs://') || path.startsWith('http')) {
      return path;
    }
    
    // If it starts with '/', it's a local path
    if (path.startsWith('/')) {
      return path;
    }
    
    // Otherwise assume it's a relative asset path
    return `/assets/images/${path}`;
  }
}
