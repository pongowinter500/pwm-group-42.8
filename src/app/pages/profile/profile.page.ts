import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { FirestoreService } from '../../services/firestore.service';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class ProfilePage implements OnInit {
  screenText: any = {};
  userProfile: any = null;
  currentUserId: string | null = null;
  isLoading = true;
  favoritesCount = 0;
  memberSince = '';

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
      this.router.navigate(['/login']);
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
    // This could navigate to an edit profile modal/page
    console.log('Edit profile feature coming soon');
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
}
