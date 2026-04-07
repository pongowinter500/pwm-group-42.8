import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Course } from '../../models/course.model';

/**
 * CourseCardComponent
 * Reusable component for displaying a single course in a card format
 * Used in course listings and sliders
 */
@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './course-card.component.html',
  styleUrl: './course-card.component.css'
})
export class CourseCardComponent {
  @Input() course!: Course;
}
