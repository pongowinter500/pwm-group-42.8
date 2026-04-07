import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../services/course.service';
import { CourseSliderComponent } from '../../components/course-slider/course-slider.component';
import { CourseCardComponent } from '../../components/course-card/course-card.component';
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
  imports: [CommonModule, CourseSliderComponent, CourseCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  newCourses: Course[] = [];
  allCourses: Course[] = [];
  loading = true;

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.courseService.courses$.subscribe(courses => {
      this.allCourses = courses;
      this.newCourses = courses.filter(c => c.isNew);
      this.loading = false;
    });
  }
}
