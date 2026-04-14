import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Course } from '../../models/course.model';

/**
 * CourseCardComponent
 * Reusable component for displaying course information
 */
@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './course-card.component.html',
  styleUrl: './course-card.component.css'
})
export class CourseCardComponent {
  @Input() course!: Course;
}
