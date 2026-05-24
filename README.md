# FavoritesApp

A production-ready Ionic 7 + Angular 17 mobile application for discovering and saving favorite destinations with Firebase Authentication, Firestore, and SQLite persistence.

## Features

- 🔐 **Secure Authentication**: Firebase Auth with email/password registration and login
- 📱 **6 Fully Functional Screens**: Login, Register, Home, Favorites, Detail, and Profile
- 🎨 **Premium UI Design**: Modern dark theme with gradient accents and glassmorphism effects
- 🔖 **Local Favorites**: SQLite database for fast, offline-first favorite destinations
- 🔥 **Real-time Data**: Firestore integration for all content (destinations, user profiles, UI text)
- ✨ **Smooth Animations**: Angular Animations with fade-in effects and page transitions
- 📊 **Responsive Design**: Optimized for both mobile phones and tablets
- 🌐 **Offline Support**: Capacitor SQLite for persistent local data

## Project Structure

```
src/
├── app/
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── services/
│   │   ├── auth.service.ts          # Firebase Auth wrapper
│   │   ├── firestore.service.ts     # Firestore data access
│   │   ├── database.service.ts      # SQLite favorites
│   │   └── favorites.service.ts     # Coordinates SQLite + Firestore
│   ├── pages/
│   │   ├── login/                   # Public auth screen
│   │   ├── register/                # Public registration
│   │   ├── home/                    # Featured + all destinations
│   │   ├── favorites/               # Saved favorites
│   │   ├── detail/:id/              # Single destination view
│   │   └── profile/                 # User profile + logout
│   ├── app-routing.module.ts
│   ├── app.component.ts
│   └── app.module.ts
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
├── theme/
│   └── variables.scss               # Ionic CSS variables + custom styles
├── index.html
├── main.ts
└── global.scss
```

## Installation & Setup

### Prerequisites
- Node.js 16+
- npm or yarn
- Ionic CLI: `npm install -g @ionic/cli`
- Angular CLI: `npm install -g @angular/cli`

### 1. Create the Project

```bash
ionic start FavoritesApp blank --type=angular
cd FavoritesApp
```

### 2. Install Dependencies

```bash
npm install @angular/fire firebase
npm install @capacitor-community/sqlite
npm install @capacitor/core @capacitor/cli
npm install rxjs tslib zone.js
```

### 3. Initialize Capacitor

```bash
npx cap init FavoritesApp com.example.favoritesapp
```

### 4. Copy Project Files

Copy all files from this project into your newly created Ionic project, overwriting as needed.

### 5. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Create Firestore Database (Start in test mode)
5. Copy your Firebase config
6. Update `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  }
};
```

### 6. Create Firestore Collections

Create the following collections in Firestore:

#### `siteConfig` collection (document: `appInfo`)
```json
{
  "appName": "FavoritesApp",
  "tagline": "Explore & Save Your Favorite Destinations",
  "description": "Discover amazing places around the world",
  "logoUrl": "https://...",
  "primaryColor": "#6C63FF",
  "accentColor": "#FF6584"
}
```

#### `screens` collection (one document per screen)
Documents: `register`, `login`, `home`, `favorites`, `detail`, `profile`

Example for `register` document:
```json
{
  "title": "Create Account",
  "firstNameLabel": "First Name",
  "lastNameLabel": "Last Name",
  "emailLabel": "Email",
  "passwordLabel": "Password",
  "photoUrlLabel": "Profile Photo URL",
  "registerButton": "Register",
  "loginLink": "Already have an account? Login",
  "registrationError": "Registration failed. Please try again."
}
```

#### `destinations` collection
Example document (ID: `dest_001`):
```json
{
  "name": "Paris",
  "shortDescription": "The City of Light",
  "longDescription": "Paris, the capital of France, is known for its romantic ambiance, iconic landmarks like the Eiffel Tower, and world-class museums.",
  "category": "City",
  "rating": 4.8,
  "continent": "Europe",
  "imageUrl": "https://...",
  "thumbnailUrl": "https://...",
  "tags": ["romantic", "museums", "architecture"],
  "featured": true
}
```

#### `users` collection
Auto-populated by the `AuthService` during registration.

### 7. Run the Application

```bash
# Development server
ionic serve

# Build for production
npm run build

# Sync with native platforms
npx cap sync

# Open in iOS
npx cap open ios

# Open in Android
npx cap open android
```

## API Reference

### AuthService

```typescript
register(email, password, firstName, lastName, photoUrl): Promise<User>
login(email, password): Promise<User>
logout(): Promise<void>
getCurrentUserId(): string | null
currentUser$: Observable<User | null>
```

### FirestoreService

```typescript
getScreenText(screenId: string): Observable<any>
getAppInfo(): Observable<any>
getAllDestinations(): Observable<Destination[]>
getDestinationById(id: string): Observable<Destination>
getFeaturedDestinations(): Observable<Destination[]>
saveUserProfile(uid, data): Promise<void>
getUserProfile(uid): Observable<any>
```

### DatabaseService

```typescript
initializeDatabase(): Promise<void>
addFavorite(id: string): Promise<void>
removeFavorite(id: string): Promise<void>
isFavorite(id: string): Promise<boolean>
getAllFavoriteIds(): Promise<string[]>
```

### FavoritesService

```typescript
addFavorite(id: string): Promise<void>
removeFavorite(id: string): Promise<void>
isFavorite(id: string): Promise<boolean>
toggleFavorite(id: string): Promise<boolean>
getFavoritedDestinations(): Observable<Destination[]>
getFavoritesCount(): Promise<number>
refreshFavorites(): void
```

## UI Theme

The app uses a premium dark theme with:
- **Primary Color**: `#6C63FF` (Indigo-Violet)
- **Accent Color**: `#FF6584` (Coral-Pink)
- **Background**: `#0F0F23` (Deep Dark)
- **Surface Cards**: `#1A1A3E`
- **Text Primary**: `#FFFFFF`
- **Text Secondary**: `#A0A0C0`

All colors are defined in `src/theme/variables.scss` and can be customized globally.

## Authentication Flow

1. **User Registration** (`/register`)
   - Form validation
   - Firebase Auth user creation
   - Firestore user profile stored

2. **User Login** (`/login`)
   - Email/password Firebase Auth
   - Redirects to `/home` on success

3. **Protected Routes**
   - AuthGuard checks Firebase auth state
   - Unauthenticated users redirected to `/login`

4. **Logout** (from `/profile`)
   - Signs out Firebase Auth
   - Clears SQLite session
   - Redirects to `/login`

## Favorites Flow

1. **Add to Favorites**
   - Destination ID saved to SQLite
   - UI updates immediately (star icon becomes solid)

2. **View Favorites** (`/favorites`)
   - Loads favorite IDs from SQLite
   - Fetches full destination data from Firestore
   - Search/filter functionality

3. **Remove from Favorites**
   - ID removed from SQLite
   - Firestore data not affected

## Deployment

### Building for Production

```bash
npm run build
# or
ionic build --prod
```

### iOS Deployment

```bash
npx cap sync ios
npx cap open ios
# Build and submit in Xcode
```

### Android Deployment

```bash
npx cap sync android
npx cap open android
# Build and submit in Android Studio
```

## Troubleshooting

### Firebase Connection Issues
- Verify Firebase config in `environment.ts`
- Check Firestore security rules allow read/write for authenticated users
- Ensure API keys are correct

### SQLite Errors
- Clear app cache and data
- Reinstall Capacitor SQLite: `npm install @capacitor-community/sqlite@latest`
- Check device storage space

### Page Not Loading
- Check browser console for errors
- Verify all services are provided in `app.module.ts`
- Ensure Firestore collections exist with correct names

## Performance Optimization

- Lazy loading components on each page
- Images optimized with `object-fit: cover`
- Skeletons shown during data loading
- SQLite for offline data access
- Efficient Firestore queries with filters

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - Feel free to use this project for personal and commercial purposes.

---

**Built with ❤️ using Ionic 7, Angular 17, Firebase, and Capacitor**
