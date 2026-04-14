import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * FooterComponent
 * Shared footer component with navigation and social links
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  privacyExpanded = false;
  socialExpanded = false;

  togglePrivacy(): void {
    this.privacyExpanded = !this.privacyExpanded;
  }

  toggleSocial(): void {
    this.socialExpanded = !this.socialExpanded;
  }
}
