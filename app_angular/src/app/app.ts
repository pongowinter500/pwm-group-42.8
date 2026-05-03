import { Component, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { Title } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';

/**
 * Root App Component
 * Main application component that wraps all pages
 * Includes Header, Router Outlet, and Footer
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(
    private router: Router,
    private titleService: Title
  ) {
    this.setupPageTitleUpdates();
  }

  /**
   * Setup page title updates based on route data
   */
  private setupPageTitleUpdates(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const routeData = this.router.routerState.root.firstChild?.data as any;
        if (routeData && routeData['title']) {
          this.titleService.setTitle(routeData['title']);
        } else {
          this.titleService.setTitle('CodeMaster');
        }
      });
  }
}
