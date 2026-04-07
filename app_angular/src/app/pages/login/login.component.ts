import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * LoginPage
 * User authentication form
 * Features:
 * - Email/Password form
 * - Form validation
 * - Loading state during submission
 * - Integration with AuthService
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  showPassword = false;
  loading = false;
  submitted = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    // Basic validation
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return;
    }

    this.loading = true;

    this.authService.login(this.email, this.password).subscribe(
      success => {
        this.loading = false;
        if (success) {
          this.router.navigate(['/']);
        } else {
          this.errorMessage = 'Invalid credentials';
        }
      },
      error => {
        this.loading = false;
        this.errorMessage = 'An error occurred. Please try again.';
      }
    );
  }
}
