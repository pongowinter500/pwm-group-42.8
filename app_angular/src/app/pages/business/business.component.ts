import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../services/course.service';
import { BusinessContent, Feature } from '../../models/course.model';
import { Observable } from 'rxjs';

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
export class BusinessComponent implements OnInit {
  businessContent$!: Observable<BusinessContent | null>;

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.businessContent$ = this.courseService.getBusinessContent();
  }
}
