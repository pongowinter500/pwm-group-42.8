import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
export class AboutComponent {}
