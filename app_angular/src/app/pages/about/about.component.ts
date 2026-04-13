import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../services/course.service';
import { AboutContent } from '../../models/course.model';

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
export class AboutComponent {
  aboutContent: AboutContent | null = null;

  constructor(private courseService: CourseService) {
    this.courseService.getAboutContent().subscribe(content => {
      this.aboutContent = content;
    });
  }
}
