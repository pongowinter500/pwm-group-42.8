import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { AuthService } from '../../services/auth.service';
import { Course } from '../../models/course.model';
import { Observable } from 'rxjs';

/**
 * CourseDetailPage
 * Displays detailed information about a specific course
 * Features:
 * - Course information with topics
 * - Instructor details
 * - Expandable course description
 * - Enrollment CTA for students
 * - Edit mode for admins with Firebase save functionality
 */
@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.css',
  encapsulation: ViewEncapsulation.None
})
export class CourseDetailComponent implements OnInit {
  course: Course | undefined;
  loading = true;
  descriptionExpanded = false;
  isEditMode = false;
  isSaving = false;
  error: string | null = null;
  userRole$: Observable<string | null>;
  isAuthenticated$: Observable<boolean>;

  private readonly selectors = {
    courseTitle: '[data-course-title]',
    courseSubtitle: '[data-course-subtitle]',
    section1Text: '[data-course-section1-text]',
    instructorName: '[data-course-instructor-name]',
    instructorTitle: '[data-course-instructor-title]'
  };

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private authService: AuthService
  ) {
    this.userRole$ = this.authService.userRole$;
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }

  ngOnInit(): void {
    this.loadCourse();
  }

  private loadCourse(): void {
    const courseId = Number(this.route.snapshot.paramMap.get('id'));

    if (!courseId) {
      this.error = 'Invalid course ID';
      this.loading = false;
      return;
    }

    this.courseService.getCourseById(courseId).subscribe(
      course => {
        if (course) {
          this.course = course;
          this.resetEditableElements();
        } else {
          this.error = 'Course not found';
        }
        this.loading = false;
      }
    );
  }

  private resetEditableElements(): void {
    Object.entries(this.selectors).forEach(([key, selector]) => {
      const el = document.querySelector(selector) as HTMLElement;
      if (el && this.course) {
        el.textContent = (this.course as any)[key];
      }
    });

    const topicsEl = document.querySelector('[data-course-topics]') as HTMLElement;
    if (topicsEl && this.course) {
      const lis = topicsEl.querySelectorAll('li');
      lis.forEach((li, index) => {
        li.textContent = this.course!.topics[index] || '';
      });
    }
  }

  toggleDescription(): void {
    this.descriptionExpanded = !this.descriptionExpanded;
  }

  toggleEditMode(): void {
    this.isEditMode = true;
  }

  saveCourse(): void {
    if (!this.course) return;
    
    this.isSaving = true;
    const updates = this.captureChanges();
    
    this.courseService.updateCourse(this.course.courseName, updates).subscribe(
      () => {
        this.isEditMode = false;
        this.isSaving = false;
      },
      error => {
        this.error = 'Failed to save changes: ' + error.message;
        this.isSaving = false;
      }
    );
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.loadCourse();
  }

  private captureChanges(): Partial<Course> {
    if (!this.course) return {};
    
    const updates: Partial<Course> = {};

    Object.entries(this.selectors).forEach(([key, selector]) => {
      const el = document.querySelector(selector) as HTMLElement;
      const newValue = el?.textContent || '';
      if (newValue !== (this.course as any)[key]) {
        (updates as any)[key] = newValue;
        (this.course as any)[key] = newValue;
      }
    });

    const topicsEl = document.querySelector('[data-course-topics]') as HTMLElement;
    const newTopics = Array.from(topicsEl?.querySelectorAll('li') || [])
      .map(li => li.textContent || '');
    if (JSON.stringify(newTopics) !== JSON.stringify(this.course.topics)) {
      updates.topics = newTopics;
      this.course.topics = newTopics;
    }

    return updates;
  }
}

