# CodeMaster Angular - API & Service Reference

## 🔧 Services Documentation

### CourseService

**Location**: `src/app/services/course.service.ts`

Manages all course data and provides Observable streams for components.

#### Methods

##### `getCourses(): Observable<Course[]>`
Returns all courses from the cached data.

```typescript
// Usage in component
constructor(private courseService: CourseService) {}

ngOnInit() {
  this.courseService.getCourses().subscribe(courses => {
    this.allCourses = courses;
  });
}
```

##### `getCourseById(id: string | number): Observable<Course>`
Returns a single course by ID.

```typescript
// Usage in CourseDetail component
constructor(private route: ActivatedRoute, private courseService: CourseService) {}

ngOnInit() {
  this.route.params.subscribe(params => {
    this.courseService.getCourseById(params['id']).subscribe(course => {
      this.course = course;
    });
  });
}
```

##### `getNewCourses(): Observable<Course[]>`
Returns courses marked as "new" (filtered by `isNew` flag).

```typescript
this.courseService.getNewCourses().subscribe(newCourses => {
  this.newCourses = newCourses;
});
```

##### `getInstructors(): Observable<Instructor[]>`
Returns unique instructors extracted from course data.

```typescript
this.courseService.getInstructors().subscribe(instructors => {
  this.instructors = instructors;
});
```

#### Properties

**Private**:
- `coursesSubject: BehaviorSubject<Course[]>` - Internal course cache
- `courses$: Observable<Course[]>` - Public Observable stream

**Data Source**:
- Reads from `window.__PWM_COURSES_CACHE` (populated by `data-loader.js`)
- Loads on service initialization

---

### AuthService

**Location**: `src/app/services/auth.service.ts`

Manages user authentication state.

#### Properties (Public Observables)

##### `isAuthenticated$: Observable<boolean>`
Stream indicating whether user is logged in.

```typescript
constructor(private authService: AuthService) {}

ngOnInit() {
  this.authService.isAuthenticated$.subscribe(isAuth => {
    this.userIsLoggedIn = isAuth;
  });
}
```

##### `currentUser$: Observable<any>`
Stream of current authenticated user data.

```typescript
this.authService.currentUser$.subscribe(user => {
  console.log('Logged in as:', user.email);
});
```

#### Methods

##### `login(email: string, password: string): Observable<any>`
Authenticates user with email and password.

```typescript
this.authService.login(email, password).subscribe({
  next: (response) => {
    console.log('Login successful');
  },
  error: (error) => {
    console.error('Login failed:', error);
  }
});
```

**Parameters**:
- `email` (string) - User email address
- `password` (string) - User password

**Returns**: Observable with login response

**Current Implementation**: 
- Returns mock successful response
- Ready for API integration

##### `logout(): void`
Logs out the current user and clears authentication state.

```typescript
this.authService.logout();
```

#### Current State

⚠️ **Note**: AuthService is a stub implementation designed for easy API integration.

Current behavior:
- `login()` accepts any email/password and returns success
- User data is stored in component state
- No actual backend validation

To integrate with real API:
```typescript
// Replace in login() method
return this.http.post('/api/auth/login', { email, password });
```

---

## 📦 Models & Interfaces

### Course Interface

**Location**: `src/app/models/course.model.ts`

```typescript
export interface Course {
  id: number | string;              // Unique identifier
  courseTitle: string;              // Course name
  subtitle: string;                 // Short description
  description: string;              // Full description
  icon: string;                     // Icon/image filename
  price: string;                    // Price (e.g., "29.99" or "Free")
  level: string;                    // "Beginner", "Intermediate", "Advanced"
  duration: string;                 // Duration (e.g., "12 weeks")
  isNew?: boolean;                  // Mark as new course
  instructor?: Instructor;          // Course instructor
  topics?: string[];                // List of topics covered
}
```

**Example**:
```typescript
const course: Course = {
  id: 1,
  courseTitle: "Python Fundamentals",
  subtitle: "Learn Python basics",
  description: "Complete Python guide from fundamentals...",
  icon: "python.png",
  price: "$49.99",
  level: "Beginner",
  duration: "8 weeks",
  isNew: true,
  instructor: { /* ... */ },
  topics: ["Variables", "Functions", "Loops", "Lists"]
};
```

### Instructor Interface

**Location**: `src/app/models/course.model.ts`

```typescript
export interface Instructor {
  id: number | string;              // Unique identifier
  name: string;                     // Full name
  title: string;                    // Job title
  bio: string;                      // Biography
  image?: string;                   // Profile image filename
  email?: string;                   // Contact email
}
```

**Example**:
```typescript
const instructor: Instructor = {
  id: 1,
  name: "John Doe",
  title: "Senior Python Developer",
  bio: "10+ years experience teaching Python...",
  image: "instructor-john.jpg",
  email: "john@example.com"
};
```

---

## 🔌 Component Integration Examples

### Using CourseService in a Component

```typescript
import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-courses-list',
  standalone: true,
  template: `...`
})
export class CoursesListComponent implements OnInit {
  courses: Course[] = [];
  loading = true;
  error: string | null = null;

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load courses';
        this.loading = false;
      }
    });
  }
}
```

### Using AuthService in a Component

```typescript
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `...`
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin() {
    this.loading = true;
    this.error = null;

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Invalid credentials';
      }
    });
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
```

### Using Async Pipe (Recommended)

Instead of manually subscribing, use the `async` pipe:

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngFor="let course of courses$ | async">
      <h3>{{ course.courseTitle }}</h3>
      <p>{{ course.price }}</p>
    </div>
  `
})
export class CoursesComponent {
  courses$ = this.courseService.getCourses();

  constructor(private courseService: CourseService) {}
}
```

**Benefits**:
- Automatic unsubscription (prevents memory leaks)
- Simpler component code
- Better change detection

---

## 📡 Data Flow

### Startup Sequence

```
1. Application starts (main.ts)
2. index.html loads and executes data-loader.js
3. data-loader.js fetches public/data/content.json
4. Data stored in window.__PWM_COURSES_CACHE
5. App components initialize
6. Services inject and read from cache
7. Components subscribe to service Observables
8. UI renders with data
```

### Component -> Service -> Data

```
HomeComponent
    |
    v
CourseService.getCourses()
    |
    v
BehaviorSubject (cached data)
    |
    v
Observable stream
    |
    v
Component.courses (display in template)
```

---

## 🗂️ Dependency Injection

All services use Angular's dependency injection:

```typescript
// In component
constructor(private courseService: CourseService) {}

// Service is automatically provided
// No need for manual instantiation
```

Services are configured with `providedIn: 'root'`:

```typescript
@Injectable({
  providedIn: 'root'  // Available app-wide
})
export class CourseService { }
```

---

## 🔄 RxJS Operators Used

### BehaviorSubject
Maintains current value and emits to new subscribers:

```typescript
private coursesSubject = new BehaviorSubject<Course[]>([]);
this.courses$ = this.coursesSubject.asObservable();
```

### map()
Transforms Observable data:

```typescript
getCourseById(id: string): Observable<Course> {
  return this.courses$.pipe(
    map(courses => courses.find(c => c.id == id)),
    filter(course => course !== undefined)
  );
}
```

### filter()
Only emits values that match condition:

```typescript
getNewCourses(): Observable<Course[]> {
  return this.courses$.pipe(
    map(courses => courses.filter(c => c.isNew))
  );
}
```

---

## ⚙️ Configuration

### Environment Variables

**Development** (`src/environments/environment.ts`):
```typescript
export const environment = {
  production: false,
  apiUrl: '',
  dataUrl: '/data/content.json',
  coursesImagePath: '/assets/images/'
};
```

**Production** (`src/environments/environment.prod.ts`):
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.example.com',
  dataUrl: '/data/content.json',
  coursesImagePath: '/assets/images/'
};
```

Use in components:
```typescript
import { environment } from '../environments/environment';

if (environment.production) {
  // Production-specific code
}
```

---

## 🔐 Error Handling

### In Components

```typescript
this.courseService.getCourses().subscribe({
  next: (data) => {
    // Handle success
  },
  error: (error) => {
    // Handle error
    console.error('Error:', error.message);
  },
  complete: () => {
    // Handle completion
  }
});
```

### Error Handling in Services

```typescript
getCourses(): Observable<Course[]> {
  return this.courses$.pipe(
    catchError(error => {
      console.error('Error loading courses:', error);
      return of([]); // Return empty array on error
    })
  );
}
```

---

## 📋 Type Checking

All services and components use strict TypeScript:

```typescript
// ✅ Good - type-safe
const courses: Course[] = this.courseService.getCourses();

// ❌ Bad - loses type information
const courses: any = this.courseService.getCourses();
```

---

## 🚀 Performance Tips

1. **Use OnPush Change Detection**:
   ```typescript
   @Component({
     changeDetection: ChangeDetectionStrategy.OnPush
   })
   ```

2. **Unsubscribe Pattern**:
   ```typescript
   private destroy$ = new Subject<void>();
   
   ngOnInit() {
     this.courseService.getCourses()
       .pipe(takeUntil(this.destroy$))
       .subscribe(...);
   }
   
   ngOnDestroy() {
     this.destroy$.next();
   }
   ```

3. **Or use Async Pipe** (best practice):
   ```html
   <div *ngFor="let course of courses$ | async">
     {{ course.courseTitle }}
   </div>
   ```

---

## 📚 Related Files

- **Services**: `src/app/services/`
- **Models**: `src/app/models/`
- **Components**: `src/app/components/`, `src/app/pages/`
- **Routing**: `src/app/app.routes.ts`

---

## 🔗 References

- [Angular Services & Dependency Injection](https://angular.io/guide/dependency-injection)
- [RxJS Observables](https://rxjs.dev/guide/observable)
- [Angular HTTP Client](https://angular.io/guide/http)
- [Angular Understanding Services](https://angular.io/guide/services-and-dependency-injection)

---

**Last Updated**: 2024

**Next**: Review [README.md](README.md) for architecture overview
