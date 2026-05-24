import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { FirestoreService } from '../../services/firestore.service';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class ProfilePage implements OnInit {
  screenText: any = {};
  userProfile: any = null;
  currentUserId: string | null = null;
  isLoading = true;
  favoritesCount = 0;
  memberSince = '';
  isEditMode = false;
  isSaving = false;
  editFormData: any = {
    firstName: '',
    lastName: '',
    photoUrl: ''
  };
  previewImageUrl: string | null = null;

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private favoritesService: FavoritesService,
    private router: Router
  ) {
    this.currentUserId = authService.getCurrentUserId();
  }

  ngOnInit(): void {
    this.loadScreenText();
    this.loadUserProfile();
    this.loadFavoritesCount();
  }

  /**
   * Load screen text from Firestore
   */
  loadScreenText(): void {
    this.firestoreService.getScreenText('profile').subscribe({
      next: (text) => {
        this.screenText = text;
      },
      error: (err) => {
        console.error('Error loading screen text:', err);
        this.screenText = {
          title: 'Profile',
          memberSinceLabel: 'Member Since',
          favoritesCountLabel: 'Favorites',
          emailLabel: 'Email',
          editProfileBtn: 'Edit Profile',
          logoutBtn: 'Logout',
          logoutConfirm: 'Are you sure you want to logout?'
        };
      }
    });
  }

  /**
   * Load user profile from Firestore
   */
  loadUserProfile(): void {
    if (!this.currentUserId) {
      this.isLoading = false;
      return;
    }

    this.firestoreService.getUserProfile(this.currentUserId).subscribe({
      next: (profile) => {
        this.userProfile = profile;
        
        // Format member since date
        if (profile.createdAt) {
          const createdDate = new Date(profile.createdAt);
          const monthYear = createdDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
          });
          this.memberSince = `Member since ${monthYear}`;
        }
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading user profile:', err);
        this.isLoading = false;
      }
    });
  }

  /**
   * Load favorites count from SQLite
   */
  async loadFavoritesCount(): Promise<void> {
    try {
      this.favoritesCount = await this.favoritesService.getFavoritesCount();
    } catch (error) {
      console.error('Error loading favorites count:', error);
    }
  }

  /**
   * Logout user
   */
  async onLogout(): Promise<void> {
    try {
      await this.authService.logout();
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  /**
   * Show logout confirmation alert
   */
  async confirmLogout(): Promise<void> {
    // This would typically use ion-alert, but we'll simplify
    const confirmed = confirm(this.screenText.logoutConfirm || 'Are you sure you want to logout?');
    if (confirmed) {
      await this.onLogout();
    }
  }

  /**
   * Edit profile (placeholder for future implementation)
   */
  editProfile(): void {
    this.enterEditMode();
  }

  /**
   * Enter edit mode
   */
  enterEditMode(): void {
    this.isEditMode = true;
    // Copy current profile data to edit form
    this.editFormData = {
      firstName: this.userProfile?.firstName || '',
      lastName: this.userProfile?.lastName || '',
      photoUrl: this.userProfile?.photoUrl || ''
    };
    this.previewImageUrl = this.userProfile?.photoUrl || null;
  }

  /**
   * Cancel edit mode
   */
  cancelEdit(): void {
    this.isEditMode = false;
    this.editFormData = {
      firstName: '',
      lastName: '',
      photoUrl: ''
    };
    this.previewImageUrl = null;
  }

  /**
   * Handle image selection from file input
   */
  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImageUrl = e.target.result;
        this.editFormData.photoUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  /**
   * Save profile changes to Firestore
   */
  async saveProfileChanges(): Promise<void> {
    if (!this.currentUserId) return;

    // Validate inputs
    if (!this.editFormData.firstName.trim() || !this.editFormData.lastName.trim()) {
      alert('Please fill in all fields');
      return;
    }

    this.isSaving = true;
    try {
      const updateData = {
        firstName: this.editFormData.firstName.trim(),
        lastName: this.editFormData.lastName.trim(),
        photoUrl: this.editFormData.photoUrl || null,
        updatedAt: new Date().toISOString()
      };

      await this.firestoreService.saveUserProfile(this.currentUserId, updateData);
      
      // Update local profile data
      this.userProfile = {
        ...this.userProfile,
        ...updateData
      };
      
      this.isEditMode = false;
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      this.isSaving = false;
    }
  }

  /**
   * Get initials from user name for avatar
   */
  getInitials(): string {
    if (this.userProfile?.firstName && this.userProfile?.lastName) {
      return (
        this.userProfile.firstName.charAt(0) +
        this.userProfile.lastName.charAt(0)
      ).toUpperCase();
    }
    return 'U';
  }

  /**
   * Get initials for edit mode
   */
  getEditInitials(): string {
    if (this.editFormData?.firstName && this.editFormData?.lastName) {
      return (
        this.editFormData.firstName.charAt(0) +
        this.editFormData.lastName.charAt(0)
      ).toUpperCase();
    }
    return 'U';
  }
}
