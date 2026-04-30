import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Observable } from 'rxjs';

/**
 * HeaderComponent
 * Shared header and navigation component
 * Features:
 * - Responsive mobile menu
 * - Search functionality
 * - Navigation links
 * - User authentication status
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  menuOpen = false;
  searchOpen = false;
  userMenuOpen = false;
  isAuthenticated = false;
  currentUser: string | null = null;
  userRole$: Observable<string | null>;

  constructor(private authService: AuthService) {
    this.userRole$ = this.authService.userRole$;
  }

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(
      (isAuth: boolean) => this.isAuthenticated = isAuth
    );
    this.authService.currentUser$.subscribe(
      (user: string | null) => this.currentUser = user
    );
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  toggleSearch(): void {
    this.searchOpen = !this.searchOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
    this.userMenuOpen = false;
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  getInitials(name: string | null): string {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  }

  logout(): void {
    this.authService.logout();
    this.closeMenu();
    this.userMenuOpen = false;
  }
}
