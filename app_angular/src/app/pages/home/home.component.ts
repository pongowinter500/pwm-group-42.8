import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../services/course.service';
import { RouterLink } from '@angular/router';
import { Course } from '../../models/course.model';

/**
 * HomePage
 * Main landing page with:
 * - New courses slider
 * - Full course catalogue
 * - Integrated with CourseService for data
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  newCourses: Course[] = [];
  catalogueCourses: Course[] = [];
  loading = true;
  currentNewCourseIndex = 0;

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.courseService.courses$.subscribe(courses => {
      this.newCourses = courses.filter(c => c.isNew);
      this.catalogueCourses = courses.filter(c => !c.isNew);
      this.currentNewCourseIndex = 0;
      this.loading = false;
    });
  }

  previousCourse(): void {
    if (this.newCourses.length === 0) {
      return;
    }

    this.currentNewCourseIndex = (this.currentNewCourseIndex - 1 + this.newCourses.length) % this.newCourses.length;
  }

  nextCourse(): void {
    if (this.newCourses.length === 0) {
      return;
    }

    this.currentNewCourseIndex = (this.currentNewCourseIndex + 1) % this.newCourses.length;
  }
}
