# CodeMaster Angular - Developer Quick Reference

## 🚀 Quick Start (Copy & Paste)

### First Time Setup
```bash
cd app_angular

# Windows
setup.bat

# macOS/Linux
chmod +x setup.sh
./setup.sh

npm install
npm start
```

Access at: **http://localhost:4200**

---

## 📁 Directory Quick Map

```
src/app/
├── shared/components/header/     ← Navigation & branding
├── components/
│   ├── footer/                   ← Site footer
│   └── course-card/              ← Reusable course card
├── pages/
│   ├── home/                     ← Landing page + slider
│   ├── about/                    ← Company info
│   ├── business/                 ← B2B solutions
│   ├── login/                    ← Auth form
│   └── course-detail/            ← Single course view
├── services/
│   ├── course.service.ts         ← Course data management
│   └── auth.service.ts           ← Authentication
├── models/
│   └── course.model.ts           ← Interfaces
└── app.routes.ts                 ← Routing rules
```

---

## 🛣️ Routes

| URL | Component | Purpose |
|-----|-----------|---------|
| `/` | HomeComponent | Landing page |
| `/about` | AboutComponent | About us |
| `/business` | BusinessComponent | B2B |
| `/login` | LoginComponent | Login form |
| `/course/:id` | CourseDetailComponent | Course page |

---

## 🔄 Data Flow

```
content.json
    ↓
data-loader.js (preload on page init)
    ↓
window.__PWM_COURSES_CACHE
    ↓
CourseService (reads cache, creates Observables)
    ↓
Components (subscribe to Observables)
    ↓
UI (displays data)
```

---

## 🎨 Responsive Breakpoints

```css
/* Mobile First */
/* No queries: 0-480px - base styles apply */

@media (min-width: 481px) {
  /* Tablet: 481-768px */
}

@media (min-width: 769px) {
  /* Desktop: 769px+ */
}
```

---

## 📦 Key Dependencies

| Package | Version | Usage |
|---------|---------|-------|
| `@angular/core` | 18.0.0 | Framework |
| `@angular/common` | 18.0.0 | Directives, pipes |
| `@angular/router` | 18.0.0 | Routing |
| `rxjs` | 7.8.0 | Observables |
| `typescript` | 5.4.5 | Language |

---

## 🔨 Common Commands

```bash
# Development
npm start                  # Start dev server (port 4200)
ng serve --port 4300      # Custom port

# Testing
npm test                   # Run unit tests
ng test --poll 2000       # With file watching

# Building
npm run build             # Build for production
ng build --prod           # Optimized build

# Linting
ng lint                   # Check code quality

# Clean
rm -rf .angular/cache    # Clear Angular cache
npm cache clean --force  # Clear npm cache
```

---

## 💾 Component Template

When creating a new component:

```typescript
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-component.component.html',
  styleUrls: ['./my-component.component.css']
})
export class MyComponentComponent implements OnInit {
  @Input() data: any;

  constructor() {}

  ngOnInit() {}
}
```

---

## 🎯 Service Template

When creating a new service:

```typescript
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyService {
  private data$ = new BehaviorSubject<any>(null);

  constructor() {}

  getData(): Observable<any> {
    return this.data$.asObservable();
  }

  setData(data: any) {
    this.data$.next(data);
  }
}
```

---

## 🔌 Common Patterns

### Subscribe to Service
```typescript
this.courseService.getCourses().subscribe(courses => {
  this.courses = courses;
});
```

### Router Navigation
```typescript
this.router.navigate(['/course', id]);
```

### Route Parameters
```typescript
this.route.params.subscribe(params => {
  const id = params['id'];
});
```

### Two-Way Binding
```html
<input [(ngModel)]="variable" />
```

### Conditional Rendering
```html
<div *ngIf="condition">Show this</div>
<div *ngIf="condition; else template">
  Show this
</div>
<ng-template #template>
  Show instead
</ng-template>
```

### Loops
```html
<div *ngFor="let item of items; let i = index">
  {{ i }}: {{ item.name }}
</div>
```

### Event Binding
```html
<button (click)="onButtonClick()">Click me</button>
<input (change)="onChange($event)" />
```

### Class & Style Binding
```html
<div [class.active]="isActive">Conditional class</div>
<div [style.color]="myColor">Dynamic color</div>
```

---

## 🐞 Debugging Tips

### Chrome DevTools
- **F12** - Open DevTools
- **Sources** tab - Debug TypeScript
- **Console** - Log messages
- **Network** - Check data loading

### Angular DevTools Extension
- Install from Chrome Web Store
- View component tree
- Inspect component properties
- Track change detection

### Console Logs
```typescript
console.log(this.data);           // Basic log
console.table(this.array);        // Table format
console.time('label');            // Performance check
console.timeEnd('label');
```

---

## 📱 Testing Responsiveness

```bash
# Open Chrome DevTools
Ctrl+Shift+I (Windows) or Cmd+Option+I (Mac)

# Toggle device toolbar
Ctrl+Shift+M (Windows) or Cmd+Shift+M (Mac)

# Test common sizes:
- iPhone 12: 390 × 844
- iPad: 768 × 1024
- Desktop: 1920 × 1080
```

---

## ⚙️ Configuration Files

| File | Purpose |
|------|---------|
| `angular.json` | Build & serve config |
| `tsconfig.json` | TypeScript config |
| `package.json` | Dependencies |
| `public/data/content.json` | Static course data |

---

## 🚨 Common Errors & Fixes

### Port 4200 Already in Use
```bash
ng serve --port 4300
```

### Module not found
```bash
# Reinstall
rm -rf node_modules
npm install
```

### CSS Not Updating
```bash
# Clear cache
rm -rf .angular/cache
npm start
```

### Images Not Loading
1. Check `public/assets/images/` exists
2. Verify paths in `content.json` match actual files
3. Check browser console for 404 errors

---

## 📚 Quick Links

- [Angular Docs](https://angular.io)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [RxJS Documentation](https://rxjs.dev)
- [MDN CSS Reference](https://developer.mozilla.org/docs/Web/CSS)

---

## 💡 Pro Tips

1. **Use Observables** - Never unsubscribe if you use `async` pipe
2. **Create Reusable Components** - Keep DRY principle
3. **Use Services** - Centralize business logic
4. **Type Everything** - Use strict TypeScript
5. **Keep CSS Scoped** - Use component CSS, not global
6. **Use Standalone Components** - Simpler than modules

---

## 🎯 Development Workflow

1. **Branch**: `git checkout -b feature/new-feature`
2. **Develop**: Make changes in your editor
3. **Test**: Run `npm test` and `npm start`
4. **Build**: Run `npm run build`
5. **Commit**: `git commit -m "Add new feature"`
6. **Push**: `git push origin feature/new-feature`
7. **PR**: Create Pull Request on GitHub

---

**Need help?** See `README.md` or `INSTALLATION.md`
