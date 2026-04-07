import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  features = [
    {
      title: 'Custom Curriculum',
      description: 'Tailored training programs designed for your team needs and skill levels.'
    },
    {
      title: 'Expert Instructors',
      description: 'Learn from industry professionals with years of real-world experience.'
    },
    {
      title: 'Flexible Scheduling',
      description: 'Training sessions scheduled at times that work best for your organization.'
    },
    {
      title: 'Progress Tracking',
      description: 'Comprehensive analytics to monitor team progress and skill development.'
    },
    {
      title: 'Certification Programs',
      description: 'Industry-recognized certifications that boost your team credentials.'
    },
    {
      title: 'Dedicated Support',
      description: '24/7 support team to assist with implementation and course management.'
    }
  ];
}
