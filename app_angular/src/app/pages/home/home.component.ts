import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../services/course.service';
import { RouterLink } from '@angular/router';
import { Course } from '../../models/course.model';
import { Observable, map, shareReplay, tap } from 'rxjs';

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
  newCourses$!: Observable<Course[]>;
  catalogueCourses$!: Observable<Course[]>;
  loading$!: Observable<boolean>;
  currentNewCourseIndex = 0;
  private newCoursesLength = 0;

  constructor(private courseService: CourseService) {}

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
  }

  previousCourse(): void {
    if (this.newCoursesLength === 0) {
      return;
    }

    this.currentNewCourseIndex = (this.currentNewCourseIndex - 1 + this.newCoursesLength) % this.newCoursesLength;
  }

  nextCourse(): void {
    if (this.newCoursesLength === 0) {
      return;
    }

    this.currentNewCourseIndex = (this.currentNewCourseIndex + 1) % this.newCoursesLength;
  }
}
