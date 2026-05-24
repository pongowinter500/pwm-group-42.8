import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginPage } from './pages/login/login.page';
import { RegisterPage } from './pages/register/register.page';
import { HomePage } from './pages/home/home.page';
import { FavoritesPage } from './pages/favorites/favorites.page';
import { DetailPage } from './pages/detail/detail.page';
import { ProfilePage } from './pages/profile/profile.page';

export const routes: Routes = [
  // Public routes
  {
    path: 'login',
    component: LoginPage
  },
  {
    path: 'register',
    component: RegisterPage
  },

  // Protected routes
  {
    path: 'home',
    component: HomePage,
    canActivate: [AuthGuard]
  },
  {
    path: 'favorites',
    component: FavoritesPage,
    canActivate: [AuthGuard]
  },
  {
    path: 'detail/:id',
    component: DetailPage,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: ProfilePage,
    canActivate: [AuthGuard]
  },

  // Default redirect
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

