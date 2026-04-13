import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
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
 * Currently loads from content.json (can be replaced with Strapi API calls)
 */
@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private contentDataSubject = new BehaviorSubject<ContentData | null>(null);
  private coursesSubject = new BehaviorSubject<Course[]>([]);
  private instructorsSubject = new BehaviorSubject<Instructor[]>([]);

  public contentData$ = this.contentDataSubject.asObservable();
  public courses$ = this.coursesSubject.asObservable();
  public instructors$ = this.instructorsSubject.asObservable();

  private contentPath = '/data/content.json';

  constructor(private http: HttpClient) {
    this.loadContent();
  }

  /**
   * Load content from JSON file or API
   * This can be easily replaced with Strapi API calls
   */
  private loadContent(): void {
    if (this.contentDataSubject.value) {
      return; // Already loaded
    }

    this.http.get<ContentData>(this.contentPath)
      .pipe(
        tap(data => {
          const courses = data.courses.map(course => ({
            ...course,
            icon: this.normalizeAssetPath(course.icon),
            instructorImg: this.normalizeAssetPath(course.instructorImg)
          }));

          const instructors = data.instructors.map(instructor => ({
            ...instructor,
            image: this.normalizeAssetPath(instructor.image)
          }));

          this.contentDataSubject.next(data);
          this.coursesSubject.next(courses);
          this.instructorsSubject.next(instructors);
        }),
        catchError(error => {
          console.error('Error loading content:', error);
          return of(null);
        })
      )
      .subscribe();
  }

  /**
   * Get all courses
   */
  getCourses(): Observable<Course[]> {
    return this.courses$;
  }

  /**
   * Get about page content from JSON
   */
  getAboutContent(): Observable<AboutContent | null> {
    return new Observable(observer => {
      this.contentData$.subscribe(content => {
        observer.next(content?.about ?? null);
        observer.complete();
      });
    });
  }

  /**
   * Get business page content from JSON
   */
  getBusinessContent(): Observable<BusinessContent | null> {
    return new Observable(observer => {
      this.contentData$.subscribe(content => {
        observer.next(content?.business ?? null);
        observer.complete();
      });
    });
  }

  /**
   * Get business features list from JSON
   */
  getBusinessFeatures(): Observable<Feature[]> {
    return new Observable(observer => {
      this.contentData$.subscribe(content => {
        observer.next(content?.business?.features ?? []);
        observer.complete();
      });
    });
  }

  /**
   * Get global site information from JSON
   */
  getSiteInfo(): Observable<SiteInfo | null> {
    return new Observable(observer => {
      this.contentData$.subscribe(content => {
        observer.next(content?.siteInfo ?? null);
        observer.complete();
      });
    });
  }

  /**
   * Get a single course by ID
   */
  getCourseById(id: number): Observable<Course | undefined> {
    return new Observable(observer => {
      this.courses$.subscribe(courses => {
        const course = courses.find(c => c.id === id);
        observer.next(course);
        observer.complete();
      });
    });
  }

  /**
   * Get new courses (flagged with isNew: true)
   */
  getNewCourses(): Observable<Course[]> {
    return new Observable(observer => {
      this.courses$.subscribe(courses => {
        observer.next(courses.filter(c => c.isNew));
        observer.complete();
      });
    });
  }

  /**
   * Get courses by category
   */
  getCoursesByCategory(category: string): Observable<Course[]> {
    return new Observable(observer => {
      this.courses$.subscribe(courses => {
        observer.next(courses.filter(c => c.category === category));
        observer.complete();
      });
    });
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
    return new Observable(observer => {
      this.instructors$.subscribe(instructors => {
        const instructor = instructors.find(i => i.id === id);
        observer.next(instructor);
        observer.complete();
      });
    });
  }

  /**
   * Search courses by keyword
   */
  searchCourses(keyword: string): Observable<Course[]> {
    return new Observable(observer => {
      this.courses$.subscribe(courses => {
        const results = courses.filter(course =>
          course.courseTitle.toLowerCase().includes(keyword.toLowerCase()) ||
          course.description.toLowerCase().includes(keyword.toLowerCase())
        );
        observer.next(results);
        observer.complete();
      });
    });
  }

  /**
   * Force reload content data
   */
  reloadContent(): void {
    this.contentDataSubject.next(null);
    this.loadContent();
  }

  private normalizeAssetPath(path: string): string {
    if (!path || /^(https?:)?\/\//.test(path) || path.startsWith('/')) {
      return path;
    }

    return `/${path}`;
  }
}
