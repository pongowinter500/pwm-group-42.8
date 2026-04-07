import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { LoginComponent } from './pages/login/login.component';
import { BusinessComponent } from './pages/business/business.component';
import { CourseDetailComponent } from './pages/course-detail/course-detail.component';

/**
 * Application Routes
 * Defines all the available routes in the application
 */
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { title: 'Home - CodeMaster' }
  },
  {
    path: 'about',
    component: AboutComponent,
    data: { title: 'About - CodeMaster' }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Login - CodeMaster' }
  },
  {
    path: 'business',
    component: BusinessComponent,
    data: { title: 'For Business - CodeMaster' }
  },
  {
    path: 'course/:id',
    component: CourseDetailComponent,
    data: { title: 'Course Details - CodeMaster' }
  },
  // Wildcard route for 404
  {
    path: '**',
    redirectTo: ''
  }
];
