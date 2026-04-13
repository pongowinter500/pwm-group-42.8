import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';

/**
 * CourseDetailPage
 * Displays detailed information about a specific course
 * Features:
 * - Course information with topics
 * - Instructor details
 * - Expandable course description
 * - Enrollment CTA
 */
@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.css'
})
export class CourseDetailComponent implements OnInit {
  course: Course | undefined;
  loading = true;
  descriptionExpanded = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
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
        } else {
          this.error = 'Course not found';
        }
        this.loading = false;
      }
    );
  }

  toggleDescription(): void {
    this.descriptionExpanded = !this.descriptionExpanded;
  }
}
