import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseCardComponent } from '../course-card/course-card.component';
import { Course } from '../../models/course.model';

/**
 * CourseSliderComponent
 * Reusable slider/carousel component for displaying courses
 * Features:
 * - Previous/Next navigation
 * - Responsive display (1-3 columns based on screen size)
 * - Keyboard accessible
 */
@Component({
  selector: 'app-course-slider',
  standalone: true,
  imports: [CommonModule, CourseCardComponent],
  templateUrl: './course-slider.component.html',
  styleUrl: './course-slider.component.css'
})
export class CourseSliderComponent implements OnInit, OnChanges {
  @Input() courses: Course[] = [];
  @Input() title: string = 'Courses';
  @Input() itemsPerView: number = 3;

  currentIndex = 0;
  visibleCourses: Course[] = [];

  ngOnInit(): void {
    this.updateVisibleCourses();
  }

  ngOnChanges(): void {
    this.updateVisibleCourses();
  }

  updateVisibleCourses(): void {
    const start = this.currentIndex;
    const end = start + this.itemsPerView;
    this.visibleCourses = this.courses.slice(start, end);
  }

  previousSlide(): void {
    this.currentIndex = Math.max(0, this.currentIndex - this.itemsPerView);
    this.updateVisibleCourses();
  }

  nextSlide(): void {
    const maxIndex = Math.max(0, this.courses.length - this.itemsPerView);
    this.currentIndex = Math.min(maxIndex, this.currentIndex + this.itemsPerView);
    this.updateVisibleCourses();
  }

  canGoPrevious(): boolean {
    return this.currentIndex > 0;
  }

  canGoNext(): boolean {
    return this.currentIndex + this.itemsPerView < this.courses.length;
  }
}
