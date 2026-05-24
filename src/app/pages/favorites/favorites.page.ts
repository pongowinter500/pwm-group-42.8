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
  searchQuery = '';
  isLoading = true;

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
    
    // Subscribe to favorite changes to reload favorites list in real-time
    this.favoritesService.favoriteToggled$.subscribe(() => {
      this.loadFavorites();
    });
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
    
    // Get all destinations
    this.firestoreService.getAllDestinations().subscribe({
      next: (destinations) => {
        // Get favorite IDs from Firestore
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
   * Filter favorites by search query
   */
  filterFavorites(): void {
    if (this.searchQuery) {
      this.filteredFavorites = this.favorites.filter(fav =>
        (fav.name || '').toLowerCase().includes(this.searchQuery) ||
        (fav.shortDescription || '').toLowerCase().includes(this.searchQuery)
      );
    } else {
      this.filteredFavorites = [...this.favorites];
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

}
