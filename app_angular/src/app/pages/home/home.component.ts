import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { Course } from '../../models/course.model';
import { Observable, map, shareReplay, tap } from 'rxjs';

/**
 * HomePage
 * Main landing page with:
 * - New courses slider
 * - Full course catalogue
 * - Admin: Create new course form
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  newCourses$!: Observable<Course[]>;
  catalogueCourses$!: Observable<Course[]>;
  loading$!: Observable<boolean>;
  userRole$!: Observable<string | null>;
  
  currentNewCourseIndex = 0;
  private newCoursesLength = 0;

  // Form state
  showCreateForm = false;
  isCreating = false;
  createError = '';
  createSuccess = '';
  deletingCourseId: number | null = null;

  // Form data
  newCourse = {
    courseName: '',
    courseTitle: '',
    courseSubtitle: '',
    instructorName: '',
    instructorTitle: '',
    instructorImg: '',
    section1Title: '',
    section1Text: '',
    section2Title: 'Advanced Topics',
    topics: [] as string[],
    category: 'programming',
    duration: '4 weeks',
    level: 'Beginner',
    price: 99.99,
    icon: '',
    description: '',
    catalogueDescription: ''
  };

  constructor(
    private courseService: CourseService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.newCourses$ = this.courseService.courses$.pipe(
      map(courses => courses.filter(c => c.isNew)),
      tap(courses => this.newCoursesLength = courses.length),
      shareReplay(1)
    );

    this.catalogueCourses$ = this.courseService.courses$.pipe(
      map(courses => courses.filter(c => !c.isNew)),
      shareReplay(1)
    );

    this.loading$ = this.courseService.courses$.pipe(
      map(courses => courses.length === 0),
      shareReplay(1)
    );

    this.userRole$ = this.authService.userRole$.pipe(
      shareReplay(1)
    );
  }

  previousCourse(): void {
    if (this.newCoursesLength === 0) return;
    this.currentNewCourseIndex = (this.currentNewCourseIndex - 1 + this.newCoursesLength) % this.newCoursesLength;
  }

  nextCourse(): void {
    if (this.newCoursesLength === 0) return;
    this.currentNewCourseIndex = (this.currentNewCourseIndex + 1) % this.newCoursesLength;
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) this.resetForm();
  }

  submitNewCourse(): void {
    if (!this.newCourse.courseName.trim() || !this.newCourse.courseTitle.trim() || !this.newCourse.instructorImg.trim()) {
      this.createError = 'Course name, title, and instructor image URL are required';
      return;
    }

    this.isCreating = true;
    this.createError = '';
    this.createSuccess = '';

    this.courseService.createCourse(this.newCourse as Omit<Course, 'id'>).subscribe({
      next: () => {
        this.createSuccess = 'Course created successfully!';
        setTimeout(() => {
          this.resetForm();
          this.showCreateForm = false;
          this.isCreating = false;
        }, 1500);
      },
      error: (err) => {
        this.createError = 'Error creating course. Please try again.';
        this.isCreating = false;
        console.error(err);
      }
    });
  }

  private resetForm(): void {
    this.newCourse = {
      courseName: '',
      courseTitle: '',
      courseSubtitle: '',
      instructorName: '',
      instructorTitle: '',
      instructorImg: '',
      section1Title: '',
      section1Text: '',
      section2Title: 'Advanced Topics',
      topics: [],
      category: 'programming',
      duration: '4 weeks',
      level: 'Beginner',
      price: 99.99,
      icon: '',
      description: '',
      catalogueDescription: ''
    };
    this.createError = '';
    this.createSuccess = '';
  }

  deleteCourse(course: Course): void {
    if (!confirm(`Delete "${course.courseTitle}"? This cannot be undone.`)) return;
    
    this.deletingCourseId = course.id;
    this.courseService.deleteCourse(course.courseName).subscribe(
      () => this.deletingCourseId = null,
      (error: Error) => {
        console.error('Failed to delete course:', error.message);
        this.deletingCourseId = null;
      }
    );
  }
}
