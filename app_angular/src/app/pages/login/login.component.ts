import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

/**
 * LoginPage
 * User authentication page
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  passwordVisible = false;
  isLoading = false;
  emailError = '';
  passwordError = '';

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit(): void {
    this.validateForm();
    if (!this.emailError && !this.passwordError) {
      this.isLoading = true;
      // Simulate login
      setTimeout(() => {
        this.isLoading = false;
        alert('Login successful!');
      }, 1500);
    }
  }

  private validateForm(): void {
    this.emailError = '';
    this.passwordError = '';

    if (!this.email) {
      this.emailError = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.emailError = 'Please enter a valid email address';
    }

    if (!this.password) {
      this.passwordError = 'Password is required';
    } else if (this.password.length < 6) {
      this.passwordError = 'Password must be at least 6 characters';
    }
  }
}
