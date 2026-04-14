import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * HeaderComponent
 * Shared header and navigation component
 * Features:
 * - Responsive mobile menu
 * - Navigation links
 * - Search functionality
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  menuOpen = false;
  searchOpen = false;

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  toggleSearch(): void {
    this.searchOpen = !this.searchOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

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
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  menuOpen = false;
  searchOpen = false;
  isAuthenticated = false;
  currentUser: string | null = null;

  constructor(private authService: AuthService) {}

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
  }

  logout(): void {
    this.authService.logout();
    this.closeMenu();
  }
}
