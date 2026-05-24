import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { FirestoreService } from '../../services/firestore.service';
import { filter, take, timeout } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule]
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup;
  screenText: any = {};
  isLoading = false;
  showPassword = false;
  errorMessage = '';
  successMessage = '';

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
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      photoUrl: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/i)]]
    });
  }

  /**
   * Load screen text from Firestore
   */
  loadScreenText(): void {
    this.firestoreService.getScreenText('register').subscribe({
      next: (text) => {
        this.screenText = text;
      },
      error: (err) => {
        console.error('Error loading screen text:', err);
        // Provide default fallback text
        this.screenText = {
          title: 'Create Account',
          firstNameLabel: 'First Name',
          lastNameLabel: 'Last Name',
          emailLabel: 'Email',
          passwordLabel: 'Password',
          photoUrlLabel: 'Profile Photo URL',
          registerButton: 'Register',
          loginLink: 'Already have an account? Login',
          emailError: 'Please enter a valid email',
          passwordError: 'Password must be at least 6 characters',
          photoUrlError: 'Please enter a valid URL (starting with http:// or https://)',
          registrationError: 'Registration failed. Please try again.'
        };
      }
    });
  }

  /**
   * Attempt user registration
   */
  async onRegister(): Promise<void> {
    if (!this.registerForm.valid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const { firstName, lastName, email, password, photoUrl } = this.registerForm.value;
      
      await this.authService.register(email, password, firstName, lastName, photoUrl);
      
      this.successMessage = 'Account created successfully! Redirecting...';
      
      // Wait for Firebase to update the user state before navigating
      this.authService.currentUser$.pipe(
        filter(authUser => !!authUser),
        take(1),
        timeout(5000)
      ).subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: () => {
          // Fallback: navigate anyway after a delay if auth state doesn't update in time
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 1500);
        }
      });
    } catch (error: any) {
      let errorMsg = this.screenText.registrationError || 'Registration failed. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMsg = 'This email is already registered.';
      } else if (error.code === 'auth/weak-password') {
        errorMsg = 'Password is too weak.';
      }
      
      this.errorMessage = errorMsg;
      console.error('Registration error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Navigate to login page
   */
  goToLogin(): void {
    this.router.navigate(['/login']);
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
    const field = this.registerForm.get(fieldName);
    
    if (field?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    
    if (fieldName === 'email' && field?.hasError('email')) {
      return this.screenText.emailError || 'Invalid email format';
    }
    
    if (fieldName === 'password' && field?.hasError('minlength')) {
      return this.screenText.passwordError || 'Password must be at least 6 characters';
    }
    
    if (fieldName === 'photoUrl' && field?.hasError('pattern')) {
      return this.screenText.photoUrlError || 'Please enter a valid URL';
    }
    
    if ((fieldName === 'firstName' || fieldName === 'lastName') && field?.hasError('minlength')) {
      return `${fieldName} must be at least 2 characters`;
    }
    
    return '';
  }
}
