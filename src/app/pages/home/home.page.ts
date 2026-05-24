import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../../services/firestore.service';
import { FavoritesService } from '../../services/favorites.service';
import { AuthService } from '../../services/auth.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { Subject, Observable } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
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
export class HomePage implements OnInit, OnDestroy {
  screenText: any = {};
  allDestinations: any[] = [];
  filteredDestinations: any[] = [];
  featuredDestinations: any[] = [];
  searchQuery = '';
  isLoading = true;
  isSearching = false;
  favoriteIds: Set<string> = new Set();
  currentUser$: Observable<any>;

  // Subject for search query with debounce
  private searchQuery$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private firestoreService: FirestoreService,
    private favoritesService: FavoritesService,
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    this.loadScreenText();
    this.loadDestinations();
    
    // Subscribe to authentication state
    this.currentUser$.subscribe(user => {
      if (user) {
        this.loadFavorites();
      } else {
        // Clear favorites if user is not authenticated
        this.favoriteIds.clear();
      }
    });
    
    // Subscribe to favorite changes to update UI in real-time
    this.favoritesService.favoriteToggled$.subscribe(toggle => {
      if (toggle) {
        if (toggle.isFavorited) {
          this.favoriteIds.add(toggle.id);
        } else {
          this.favoriteIds.delete(toggle.id);
        }
      }
    });
    
    // Subscribe to search query changes with debounce of 1 second
    this.searchQuery$
      .pipe(
        debounceTime(1000),
        takeUntil(this.destroy$)
      )
      .subscribe(query => {
        this.searchQuery = query;
        this.filterDestinations();
        this.isSearching = false;
      });
  }

  /**
   * Cleanup on component destroy
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load screen text from Firestore
   */
  loadScreenText(): void {
    this.firestoreService.getScreenText('home').subscribe({
      next: (text) => {
        this.screenText = text;
      },
      error: (err) => {
        console.error('Error loading screen text:', err);
        this.screenText = {
          title: 'Explore',
          searchPlaceholder: 'Search destinations...',
          featuredSection: 'Featured Destinations',
          allDestinationsSection: 'All Destinations',
          emptyState: 'No destinations found'
        };
      }
    });
  }

  /**
   * Load all destinations from Firestore
   */
  loadDestinations(): void {
    this.isLoading = true;
    this.firestoreService.getAllDestinations().subscribe({
      next: (destinations) => {
        this.allDestinations = destinations;
        this.filteredDestinations = destinations;
        
        // Load featured separately
        this.firestoreService.getFeaturedDestinations().subscribe({
          next: (featured) => {
            this.featuredDestinations = featured;
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error loading destinations:', err);
        this.isLoading = false;
      }
    });
  }

  /**
   * Load favorite IDs from Firestore (personalized per user)
   */
  async loadFavorites(): Promise<void> {
    try {
      const uid = this.authService.getCurrentUserId();
      if (!uid) return;
      
      // Import DatabaseService to call the method directly
      const favoritesService = this.favoritesService as any;
      const favoriteIds = await favoritesService['databaseService'].getAllFavoritesFromFirestore(uid);
      this.favoriteIds = new Set(favoriteIds);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }

  /**
   * Handle search input with debounce
   */
  onSearch(event: any): void {
    const query = event.detail.value?.toLowerCase() || '';
    if (query) {
      this.isSearching = true;
    }
    this.searchQuery$.next(query);
  }

  /**
   * Filter destinations based on search query
   */
  filterDestinations(): void {
    if (!this.searchQuery) {
      this.filteredDestinations = [...this.allDestinations];
    } else {
      this.filteredDestinations = this.allDestinations.filter(dest =>
        (dest.name || '').toLowerCase().includes(this.searchQuery) ||
        (dest.shortDescription || '').toLowerCase().includes(this.searchQuery)
      );
    }
  }

  /**
   * Navigate to destination detail page
   */
  goToDetail(destinationId: string): void {
    this.router.navigate(['/detail', destinationId]);
  }

  /**
   * Check if destination is favorited
   */
  isFavorited(id: string): boolean {
    return this.favoriteIds.has(id);
  }

  /**
   * Add/remove destination from favorites
   */
  async toggleFavorite(event: any, id: string): Promise<void> {
    event.stopPropagation();
    
    // Require authentication to add favorites
    if (!this.authService.getCurrentUserId()) {
      this.router.navigate(['/login']);
      return;
    }
    
    try {
      const isFav = await this.favoritesService.toggleFavorite(id);
      if (isFav) {
        this.favoriteIds.add(id);
      } else {
        this.favoriteIds.delete(id);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }

  /**
   * Navigate to login page
   */
  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  /**
   * Navigate to register page
   */
  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
