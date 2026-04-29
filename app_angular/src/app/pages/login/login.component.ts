import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * LoginPage
 * User authentication and registration
 * Features:
 * - Email/Password login form
 * - Sign up form with toggle
 * - Form validation
 * - Loading state during submission
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
  isSignUp = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleAuthMode(): void {
    this.isSignUp = !this.isSignUp;
    this.resetForm();
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return;
    }

    this.loading = true;
    const auth$ = this.isSignUp 
      ? this.authService.register(this.email, this.password)
      : this.authService.login(this.email, this.password);

    auth$.subscribe(
      success => {
        this.loading = false;
        if (success) {
          this.router.navigate(['/']);
        } else {
          this.errorMessage = this.isSignUp 
            ? 'Registration failed. This email may already exist.'
            : 'Invalid credentials';
        }
      },
      error => {
        this.loading = false;
        this.errorMessage = 'An error occurred. Please try again.';
      }
    );
  }

  private resetForm(): void {
    this.email = '';
    this.password = '';
    this.showPassword = false;
    this.submitted = false;
    this.errorMessage = '';
  }
}
