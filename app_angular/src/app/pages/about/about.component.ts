import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../services/course.service';
import { AboutContent } from '../../models/course.model';
import { Observable } from 'rxjs';

/**
 * AboutPage
 * Company information and mission section
 */
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit {
  aboutContent$!: Observable<AboutContent | null>;

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.aboutContent$ = this.courseService.getAboutContent();
  }
}
