import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { AuthService } from '../../services/auth.service';
import { Course } from '../../models/course.model';
import { Observable } from 'rxjs';

/**
 * MyCoursesComponent
 * Displays all courses the student is enrolled in
 * Features:
 * - List of enrolled courses
 * - Delist button to unenroll from courses
 * - Real-time updates on enrollment changes
 */
@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-courses.component.html',
  styleUrl: './my-courses.component.css'
})
export class MyCoursesComponent implements OnInit {
  courses: Course[] = [];
  loading = true;
  error: string | null = null;
  delistingCourseId: number | null = null;
  userRole$: Observable<string | null>;

  private userId: string | null = null;

  constructor(
    private courseService: CourseService,
    private authService: AuthService
  ) {
    this.userRole$ = this.authService.userRole$;
    this.authService.userUid$.subscribe(uid => this.userId = uid);
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  private loadCourses(): void {
    if (!this.userId) {
      this.error = 'User not authenticated';
      this.loading = false;
      return;
    }

    this.courseService.getStudentCourses(this.userId).subscribe(
      courses => {
        this.courses = courses;
        this.loading = false;
      },
      error => {
        this.error = 'Failed to load courses: ' + error.message;
        this.loading = false;
      }
    );
  }

  delistCourse(courseId: number): void {
    if (!this.userId) return;

    this.delistingCourseId = courseId;
    this.courseService.disenrollCourse(this.userId, courseId).subscribe(
      () => {
        this.courses = this.courses.filter(c => c.id !== courseId);
        this.delistingCourseId = null;
      },
      error => {
        this.error = 'Failed to delist course: ' + error.message;
        this.delistingCourseId = null;
      }
    );
  }
}
