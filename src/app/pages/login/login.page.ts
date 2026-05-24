import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule]
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  screenText: any = {};
  isLoading = false;
  showPassword = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadScreenText();
  }

  /**
   * Initialize reactive form with validation
   */
  initializeForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Load screen text from Firestore
   */
  loadScreenText(): void {
    this.firestoreService.getScreenText('login').subscribe({
      next: (text) => {
        this.screenText = text;
      },
      error: (err) => {
        console.error('Error loading screen text:', err);
        // Provide default fallback text
        this.screenText = {
          title: 'Welcome Back',
          emailLabel: 'Email',
          passwordLabel: 'Password',
          loginButton: 'Login',
          registerLink: "Don't have an account? Register",
          emailError: 'Please enter a valid email',
          passwordError: 'Password must be at least 6 characters',
          invalidCredentials: 'Invalid email or password'
        };
      }
    });
  }

  /**
   * Attempt user login
   */
  async onLogin(): Promise<void> {
    if (!this.loginForm.valid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const { email, password } = this.loginForm.value;
      await this.authService.login(email, password);
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.errorMessage = this.screenText.invalidCredentials || 'Login failed. Please try again.';
      console.error('Login error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Navigate to registration page
   */
  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Get error message for a form field
   */
  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field?.hasError('email')) {
      return this.screenText.emailError || 'Invalid email format';
    }
    if (field?.hasError('minlength')) {
      return this.screenText.passwordError || 'Password must be at least 6 characters';
    }
    return '';
  }
}
