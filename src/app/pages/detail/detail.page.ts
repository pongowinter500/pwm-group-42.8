import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FirestoreService } from '../../services/firestore.service';
import { FavoritesService } from '../../services/favorites.service';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestoreService: FirestoreService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.loadScreenText();
    
    // Get destination ID from route params
    this.route.paramMap.subscribe(params => {
      this.destinationId = params.get('id');
      if (this.destinationId) {
        this.loadDestination();
        this.checkIfFavorited();
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
    this.router.navigate(['/favorites']);
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
