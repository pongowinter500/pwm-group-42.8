import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from '../../services/database.service';
import { FirestoreService } from '../../services/firestore.service';
import { FavoritesService } from '../../services/favorites.service';
import { AuthService } from '../../services/auth.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-in', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class FavoritesPage implements OnInit {
  screenText: any = {};
  favorites: any[] = [];
  filteredFavorites: any[] = [];
  allDestinations: any[] = [];
  searchQuery = '';
  isLoading = true;
  showOnlyFavorites = true;

  constructor(
    private databaseService: DatabaseService,
    private firestoreService: FirestoreService,
    private favoritesService: FavoritesService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadScreenText();
    this.loadFavorites();
  }

  /**
   * Load screen text from Firestore
   */
  loadScreenText(): void {
    this.firestoreService.getScreenText('favorites').subscribe({
      next: (text) => {
        this.screenText = text;
      },
      error: (err) => {
        console.error('Error loading screen text:', err);
        this.screenText = {
          title: 'My Favorites',
          searchPlaceholder: 'Search favorites...',
          emptyState: 'No favorites yet',
          emptyDescription: 'Start adding destinations to your favorites',
          showAllToggle: 'Show All',
          showFavoritesToggle: 'Show Favorites'
        };
      }
    });
  }

  /**
   * Load favorites from Firestore (personalized per user) and get full destination data
   */
  loadFavorites(): void {
    this.isLoading = true;
    const uid = this.authService.getCurrentUserId();
    
    if (!uid) {
      console.error('User not authenticated');
      this.isLoading = false;
      return;
    }
    
    // First, get all destinations
    this.firestoreService.getAllDestinations().subscribe({
      next: (destinations) => {
        this.allDestinations = destinations;
        
        // Then get favorite IDs from Firestore
        this.databaseService.getAllFavoritesFromFirestore(uid).then(favoriteIds => {
          this.favorites = destinations.filter(d => favoriteIds.includes(d.id));
          this.filteredFavorites = [...this.favorites];
          this.isLoading = false;
        }).catch(err => {
          console.error('Error loading favorite IDs:', err);
          this.isLoading = false;
        });
      },
      error: (err) => {
        console.error('Error loading destinations:', err);
        this.isLoading = false;
      }
    });
  }

  /**
   * Filter favorites by search query
   */
  onSearch(event: any): void {
    this.searchQuery = event.detail.value?.toLowerCase() || '';
    this.filterFavorites();
  }

  /**
   * Filter based on search and toggle settings
   */
  filterFavorites(): void {
    let results = this.favorites;

    if (this.searchQuery) {
      results = results.filter(fav =>
        (fav.name || '').toLowerCase().includes(this.searchQuery) ||
        (fav.shortDescription || '').toLowerCase().includes(this.searchQuery)
      );
    }

    this.filteredFavorites = results;
  }

  /**
   * Toggle filter between favorites and all
   */
  toggleFilter(): void {
    this.showOnlyFavorites = !this.showOnlyFavorites;
    if (!this.showOnlyFavorites) {
      // Show all destinations
      this.filteredFavorites = [...this.allDestinations];
      this.filterFavorites();
    } else {
      // Show only favorites
      this.filteredFavorites = [...this.favorites];
      this.filterFavorites();
    }
  }

  /**
   * Navigate to detail page
   */
  goToDetail(destinationId: string): void {
    this.router.navigate(['/detail', destinationId]);
  }

  /**
   * Remove from favorites
   */
  async removeFavorite(event: any, id: string): Promise<void> {
    event.stopPropagation();
    try {
      await this.favoritesService.removeFavorite(id);
      this.favorites = this.favorites.filter(f => f.id !== id);
      this.loadFavorites();
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  }

  /**
   * Reload favorites
   */
  async doRefresh(event: any): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.loadFavorites();
    event.target.complete();
  }

  /**
   * Get star rating display
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
