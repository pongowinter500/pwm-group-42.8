import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Course, Instructor } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private courses$ = new BehaviorSubject<Course[]>([]);
  private instructors$ = new BehaviorSubject<Instructor[]>([]);
  private content$ = new BehaviorSubject<any>({});

  constructor() {
    this.loadCourses();
    this.loadContent();
  }

  private loadCourses(): void {
    // Cache in window for testing purposes
    const cachedCourses = (window as any).__PWM_COURSES_CACHE;
    if (cachedCourses) {
      this.courses$.next(cachedCourses);
      if (cachedCourses.length > 0 && cachedCourses[0].instructorId) {
        this.extractInstructors(cachedCourses);
      }
    }
  }

  private loadContent(): void {
    const cachedContent = (window as any).__PWM_CONTENT_CACHE;
    if (cachedContent) {
      this.content$.next(cachedContent);
    }
  }

  private extractInstructors(courses: Course[]): void {
    const instructorMap = new Map<number, Instructor>();
    courses.forEach(course => {
      if (!instructorMap.has(course.instructorId)) {
        instructorMap.set(course.instructorId, {
          id: course.instructorId,
          name: course.instructorName,
          title: course.instructorTitle,
          image: course.instructorImg,
          bio: '',
          specialization: [course.category]
        });
      }
    });
    this.instructors$.next(Array.from(instructorMap.values()));
  }

  getCourses(): Observable<Course[]> {
    return this.courses$.asObservable();
  }

  getCourseById(id: number): Observable<Course | undefined> {
    return new Observable(observer => {
      this.courses$.subscribe(courses => {
        observer.next(courses.find(c => c.id === id));
        observer.complete();
      });
    });
  }

  getNewCourses(): Observable<Course[]> {
    return new Observable(observer => {
      this.courses$.subscribe(courses => {
        observer.next(courses.filter(c => c.isNew));
        observer.complete();
      });
    });
  }

  getInstructors(): Observable<Instructor[]> {
    return this.instructors$.asObservable();
  }

  getContent(): Observable<any> {
    return this.content$.asObservable();
  }

  getContentValue(key: string): string {
    const content = this.content$.value;
    const keys = key.split('.');
    let value = content;
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return '';
      }
    }
    return typeof value === 'string' ? value : '';
  }
}
