import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Course, Instructor, ContentData } from '../models/course.model';

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
          this.contentDataSubject.next(data);
          this.coursesSubject.next(data.courses);
          this.instructorsSubject.next(data.instructors);
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
}
