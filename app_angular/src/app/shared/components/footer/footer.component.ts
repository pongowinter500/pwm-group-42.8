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
  currentYear = new Date().getFullYear();
  privacyMenuOpen = false;
  socialMenuOpen = false;

  togglePrivacyMenu(): void {
    this.privacyMenuOpen = !this.privacyMenuOpen;
  }

  toggleSocialMenu(): void {
    this.socialMenuOpen = !this.socialMenuOpen;
  }
}
