import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../services/course.service';
import { BusinessContent, Feature } from '../../models/course.model';

/**
 * BusinessPage
 * Enterprise solutions and features for businesses
 */
@Component({
  selector: 'app-business',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './business.component.html',
  styleUrl: './business.component.css'
})
export class BusinessComponent {
  businessContent$ = this.courseService.getBusinessContent();

  constructor(private courseService: CourseService) {}
