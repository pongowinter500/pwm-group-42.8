import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { BusinessComponent } from './pages/business/business.component';
import { LoginComponent } from './pages/login/login.component';
import { CourseDetailComponent } from './pages/course-detail/course-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'business', component: BusinessComponent },
  { path: 'login', component: LoginComponent },
  { path: 'course/:id', component: CourseDetailComponent },
  { path: '**', redirectTo: '' }
];
