import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';
import { FirestoreService } from '../../services/firestore.service';
import { FavoritesService } from '../../services/favorites.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class DetailPage implements OnInit {
  destinationId: string | null = null;
  destination: any = null;
  screenText: any = {};
  isLoading = true;
  isFavorited = false;
  currentUser$: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestoreService: FirestoreService,
    private favoritesService: FavoritesService,
    private authService: AuthService
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    this.loadScreenText();
    
    // Subscribe to authentication state changes
    this.currentUser$.subscribe(user => {
      if (user && this.destinationId) {
        this.checkIfFavorited();
      } else {
        this.isFavorited = false;
      }
    });
    
    // Get destination ID from route params
    this.route.paramMap.subscribe(params => {
      this.destinationId = params.get('id');
      if (this.destinationId) {
        this.loadDestination();
        // Check if favorited if user is authenticated
        const uid = this.authService.getCurrentUserId();
        if (uid) {
          this.checkIfFavorited();
        }
      }
    });
    
    // Subscribe to favorite changes to update UI in real-time
    this.favoritesService.favoriteToggled$.subscribe(toggle => {
      if (toggle && toggle.id === this.destinationId) {
        this.isFavorited = toggle.isFavorited;
      }
    });
  }

  /**
   * Load screen text from Firestore
   */
  loadScreenText(): void {
    this.firestoreService.getScreenText('detail').subscribe({
      next: (text) => {
        this.screenText = text;
      },
      error: (err) => {
        console.error('Error loading screen text:', err);
        this.screenText = {
          addToFavoritesBtn: 'Add to Favorites',
          removeFromFavoritesBtn: 'Remove from Favorites',
          categoryLabel: 'Category',
          ratingLabel: 'Rating',
          continentLabel: 'Continent',
          tagsLabel: 'Tags'
        };
      }
    });
  }

  /**
   * Load destination data from Firestore
   */
  loadDestination(): void {
    if (!this.destinationId) return;

    this.isLoading = true;
    this.firestoreService.getDestinationById(this.destinationId).subscribe({
      next: (destination) => {
        this.destination = destination;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading destination:', err);
        this.isLoading = false;
      }
    });
  }

  /**
   * Check if current destination is in favorites
   */
  async checkIfFavorited(): Promise<void> {
    if (!this.destinationId) return;
    
    try {
      this.isFavorited = await this.favoritesService.isFavorite(this.destinationId);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  }

  /**
   * Toggle favorite status
   */
  async toggleFavorite(): Promise<void> {
    if (!this.destinationId) return;

    // Require authentication to add favorites
    if (!this.authService.getCurrentUserId()) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      this.isFavorited = await this.favoritesService.toggleFavorite(this.destinationId);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }

  /**
   * Go back to previous page
   */
  goBack(): void {
    // If authenticated, go to favorites; otherwise go to home
    if (this.authService.getCurrentUserId()) {
      this.router.navigate(['/favorites']);
    } else {
      this.router.navigate(['/home']);
    }
  }

  /**
   * Navigate to login page
   */
  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  /**
   * Get star rating display as array of icon names
   */
  getStarDisplay(rating: number): string[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push('star');
      } else if (i === fullStars && rating % 1 !== 0) {
        stars.push('star-half');
      } else {
        stars.push('star-outline');
      }
    }
    return stars;
  }
}
