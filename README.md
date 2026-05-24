# PWM Group 42.8 - Destination Discovery App

A production-ready Ionic 7 + Angular 17 mobile and web application for discovering, exploring, and saving favorite travel destinations worldwide. Built with Firebase for real-time data sync and SQLite for offline-first functionality.

## Developed by
Andrea Pedrini
Alberto Federici 

## 📋 Quick Start

### Running the Development Server

```bash
# Install dependencies (first time only)
npm install

# Start the development server on http://localhost:4200
ng serve

# Or using Ionic CLI for live reload
ionic serve
```

The application will automatically open in your browser and reload when you make changes.

---

## ✨ Key Features

- 🔐 **Firebase Authentication**: Email/password registration, login, and secure logout
- 🏠 **Public Home Screen**: Browse featured and all destinations without authentication
- ⭐ **Personal Favorites**: User-specific saved destinations synced across all pages in real-time
- 🔍 **Search Functionality**: 1.5-second debounce search across destination names and descriptions
- 👤 **User Profile Management**: Edit name, surname, and profile photo stored in Firestore
- 📱 **Responsive Design**: Optimized for mobile phones, tablets, and desktop browsers
- 🎨 **Premium UI**: Modern dark theme with gradient effects and glassmorphism styling
- 💾 **Offline Support**: SQLite local caching for offline access to favorites
- ⚡ **Real-time Sync**: Firestore integration ensures data consistency across devices and pages
- 🎭 **Smooth Animations**: Angular transitions and fade-in effects for professional UX
- 🌐 **Multi-language Ready**: All UI text configurable from Firestore `screens` collection

---

## 📁 Project Architecture

```
src/
├── app/
│   ├── guards/
│   │   └── auth.guard.ts                    # Route protection for authenticated screens
│   │
│   ├── services/
│   │   ├── auth.service.ts                 # Firebase Auth wrapper (register, login, logout)
│   │   ├── firestore.service.ts            # Firestore read/write operations
│   │   ├── database.service.ts             # SQLite favorites database operations
│   │   └── favorites.service.ts            # Orchestrates SQLite + Firestore sync
│   │
│   ├── pages/
│   │   ├── login/                          # Public: Email/password login
│   │   │   ├── login.page.ts
│   │   │   ├── login.page.html
│   │   │   └── login.page.scss
│   │   │
│   │   ├── register/                       # Public: Create new account
│   │   │   ├── register.page.ts
│   │   │   ├── register.page.html
│   │   │   └── register.page.scss
│   │   │
│   │   ├── home/                           # Public: Featured & all destinations
│   │   │   ├── home.page.ts                # Search debounce, real-time favorites sync
│   │   │   ├── home.page.html              # Search bar, featured carousel, grid view
│   │   │   └── home.page.scss              # Dark theme with gradient backgrounds
│   │   │
│   │   ├── favorites/                      # Protected: User's saved destinations
│   │   │   ├── favorites.page.ts           # Load favorites from Firestore
│   │   │   ├── favorites.page.html         # Searchable favorites list with delete
│   │   │   └── favorites.page.scss
│   │   │
│   │   ├── detail/                         # Semi-public: Destination details
│   │   │   ├── detail.page.ts              # Full destination view with add/remove star
│   │   │   ├── detail.page.html            # Hero image, description, tags, rating
│   │   │   └── detail.page.scss
│   │   │
│   │   └── profile/                        # Protected: User account management
│   │       ├── profile.page.ts             # Edit name/photo, view stats, logout
│   │       ├── profile.page.html           # Profile card, edit mode form
│   │       └── profile.page.scss
│   │
│   ├── app-routing.module.ts               # Route definitions with AuthGuard
│   ├── app.component.ts                    # Root component with tab navigation
│   ├── app.component.html
│   ├── app.module.ts
│   └── app.component.scss
│
├── environments/
│   ├── environment.ts                      # Dev Firebase config
│   └── environment.prod.ts                 # Prod Firebase config
│
├── theme/
│   └── variables.scss                      # Ionic CSS variables + global styles
│
├── index.html                              # HTML entry point
├── main.ts                                 # Angular bootstrap
├── global.scss                             # Global styles
└── styles.scss                             # App-wide styling
```

---

## 🔒 User Experience & Routing

### Public Routes
- **`/login`** - Email/password login
- **`/register`** - Create new account
- **`/home`** - Browse all destinations (no auth required)
- **`/detail/:id`** - View single destination (non-authenticated users see "Sign In" prompt)

### Protected Routes (Require Authentication)
- **`/favorites`** - User's saved destinations
- **`/profile`** - Account settings and profile management

### Route Flow
```
Not Authenticated:
  Login → Register → Home (public browsing)
  
Authenticated:
  Login → Home → [Browse] → [Add to Favorites] → Favorites/Profile/Detail
  
After Logout:
  Profile (Logout clicked) → Home (non-authenticated version)
```

---

## 🔧 Installation & Configuration

### Prerequisites
```bash
# Node.js 18+ and npm
node --version
npm --version

# Optional: Install Ionic CLI globally for enhanced development
npm install -g @ionic/cli

# Optional: Angular CLI for code generation
npm install -g @angular/cli
```

### 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd pwm-group-42.8
npm install
```

### 2. Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Create Project"
   - Name it and enable Google Analytics (optional)

2. **Enable Authentication**
   - In Firebase Console → Authentication → Sign-in method
   - Enable "Email/Password" provider

3. **Create Firestore Database**
   - In Firebase Console → Firestore Database
   - Start in **Test Mode** (for development)
   - Select region (e.g., `us-central1`)

4. **Get Firebase Config**
   - In Firebase Console → Project Settings → Web App
   - Copy the configuration object

5. **Update Environment File**
   - Edit `src/environments/environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     firebaseConfig: {
       apiKey: "YOUR_API_KEY",
       authDomain: "your-project.firebaseapp.com",
       projectId: "your-project-id",
       storageBucket: "your-project.appspot.com",
       messagingSenderId: "YOUR_SENDER_ID",
       appId: "YOUR_APP_ID",
       measurementId: "YOUR_MEASUREMENT_ID"
     }
   };
   ```

### 3. Create Firestore Collections & Data

#### Collection: `siteConfig` (Document: `appInfo`)
```json
{
  "appName": "PWM Group",
  "tagline": "Discover Amazing Destinations",
  "description": "Explore the world's most beautiful travel destinations",
  "primaryColor": "#6C63FF",
  "accentColor": "#FF6584"
}
```

#### Collection: `screens` (UI Text - One Document Per Screen)

**Document: `login`**
```json
{
  "title": "Welcome Back",
  "emailLabel": "Email Address",
  "passwordLabel": "Password",
  "loginButton": "Sign In",
  "registerLink": "Don't have an account? Register",
  "loginError": "Invalid email or password"
}
```

**Document: `register`**
```json
{
  "title": "Create Account",
  "firstNameLabel": "First Name",
  "lastNameLabel": "Last Name",
  "emailLabel": "Email Address",
  "passwordLabel": "Password",
  "photoUrlLabel": "Profile Photo URL (optional)",
  "registerButton": "Create Account",
  "loginLink": "Already have an account? Login",
  "registrationError": "Registration failed. Try another email."
}
```

**Document: `home`**
```json
{
  "title": "Explore",
  "searchPlaceholder": "Search destinations...",
  "featuredSection": "Featured Destinations",
  "allDestinationsSection": "All Destinations",
  "emptyState": "No destinations found"
}
```

**Document: `favorites`**
```json
{
  "title": "My Favorites",
  "searchPlaceholder": "Search your favorites...",
  "emptyState": "No favorites yet",
  "emptyDescription": "Start adding destinations to your favorites"
}
```

**Document: `detail`**
```json
{
  "addToFavoritesBtn": "Add to Favorites",
  "removeFromFavoritesBtn": "Remove from Favorites",
  "categoryLabel": "Category",
  "ratingLabel": "Rating",
  "continentLabel": "Continent",
  "tagsLabel": "Tags"
}
```

**Document: `profile`**
```json
{
  "title": "My Profile",
  "memberSinceLabel": "Member Since",
  "favoritesCountLabel": "Favorites",
  "emailLabel": "Email",
  "editProfileBtn": "Edit Profile",
  "logoutBtn": "Logout",
  "logoutConfirm": "Are you sure you want to logout?"
}
```

#### Collection: `destinations` (Travel Destinations)

**Document Structure (Example: `destination_001`)**
```json
{
  "name": "Paris",
  "shortDescription": "The City of Light - Iconic landmarks and romance",
  "longDescription": "Paris, the capital of France, is renowned for its romantic ambiance, world-class museums, iconic landmarks like the Eiffel Tower, and exquisite cuisine. A must-visit destination.",
  "category": "City",
  "continent": "Europe",
  "featured": true,
  "rating": 4.8,
  "imageUrl": "https://example.com/paris-full.jpg",
  "thumbnailUrl": "https://example.com/paris-thumb.jpg",
  "tags": ["romantic", "historic", "museums", "food"],
  "coordinates": {
    "latitude": 48.8566,
    "longitude": 2.3522
  }
}
```

Create multiple destination documents with different categories (Mountain, Beach, City, Nature) and continents (Europe, Asia, Africa, Americas, Oceania).

---

## 🚀 Development

### Start Development Server
```bash
# Using Angular CLI
ng serve

# Or using Ionic CLI for better mobile preview
ionic serve
```

Navigate to `http://localhost:4200/`. The app will auto-reload when you modify source files.

### Build for Production
```bash
ng build --configuration production
```

### Run Unit Tests
```bash
ng test
```

### Generate New Component
```bash
ng generate component pages/my-page
ng generate service services/my-service
```

---

## 📊 Data Models

### User Profile
```typescript
{
  uid: string;              // Firebase Auth UID
  firstName: string;
  lastName: string;
  email: string;
  photoUrl?: string;        // Base64 or URL
  createdAt: ISO8601;       // Timestamp
  updatedAt?: ISO8601;      // Last update timestamp
}
```

### Destination
```typescript
{
  id: string;               // Document ID in Firestore
  name: string;
  shortDescription: string;
  longDescription: string;
  category: string;         // "City", "Beach", "Mountain", "Nature"
  continent: string;        // Geographic region
  featured: boolean;
  rating: number;           // 0-5 stars
  imageUrl: string;         // Full-size hero image
  thumbnailUrl: string;     // List view thumbnail
  tags: string[];           // Searchable keywords
}
```

### Favorite (Firestore Path: `users/{uid}/favorites/{destinationId}`)
```typescript
{
  destinationId: string;    // Reference to destination
  addedAt: ISO8601;         // When favorited
}
```

---

## 🔄 Real-Time Sync Architecture

### Favorites Sync Flow
1. **User adds favorite** on Home → `FavoritesService.toggleFavorite()`
2. **Service writes to Firestore** at `users/{uid}/favorites/{destId}`
3. **Emit event** via `favoriteToggled$` BehaviorSubject
4. **All subscribed pages** (Home, Detail, Favorites) update UI instantly
5. **SQLite cached** locally for offline access

### Search Functionality
- **Debounce**: 1 second delay after user stops typing
- **Real-time filtering**: Searches destination names and descriptions
- **Featured destinations hide** during active search for cleaner UX

---

## 🎨 Styling & Theme

### Color Palette
```scss
$primary: #6C63FF;          // Primary brand color
$accent: #FF6584;           // Accent/secondary
$dark-bg: #0F0F23;          // Main background
$card-bg: #1A1A3E;          // Card/section background
$text-light: #FFFFFF;       // Primary text
$text-muted: #A0A0C0;       // Secondary text
```

### Customizing Theme
Edit `src/theme/variables.scss` to change colors, fonts, and Ionic component styling.

---

## 🐛 Troubleshooting

### Issue: "Cannot find module '@angular/fire'"
```bash
npm install @angular/fire firebase
```

### Issue: "SQLite not initialized"
```bash
npm install @capacitor-community/sqlite
npx cap sync
```

### Issue: Firebase authentication not working
- Verify Firebase credentials in `environment.ts`
- Check that Email/Password auth is enabled in Firebase Console
- Ensure Firestore security rules allow read/write in test mode

### Issue: Favorites not syncing across pages
- Check browser console for errors
- Verify `FavoritesService.favoriteToggled$` subscription in components
- Ensure user is authenticated when adding favorites

---

## 📱 Deployment

### Build for Android
```bash
npm run build
npx cap add android
npx cap copy
npx cap open android
```

### Build for iOS
```bash
npm run build
npx cap add ios
npx cap copy
npx cap open ios
```

### Deploy to Web
```bash
ng build --configuration production
# Upload dist/ folder to hosting service (Firebase Hosting, Netlify, Vercel)
```

---

## 🤝 Team Development Notes

### Key Technologies
- **Angular 17+**: Standalone components, modern decorators
- **Ionic 7**: Mobile UI framework with Material Design
- **Firebase**: Auth, Firestore real-time database
- **RxJS**: Reactive programming with Observables
- **SQLite**: Local offline storage via Capacitor
- **TypeScript**: Strong typing and OOP patterns

### Code Conventions
- **Naming**: camelCase for variables/methods, PascalCase for classes/components
- **Comments**: Concise JSDoc-style documentation for public methods
- **File Structure**: Organize by feature (pages), not by type
- **Error Handling**: Always catch and log errors with console.error()
- **Subscriptions**: Use `takeUntil()` to prevent memory leaks in ngOnDestroy

### Performance Tips
- Use `OnPush` change detection strategy where possible
- Implement lazy loading for route modules
- Optimize images (thumbnails vs full-size)
- Debounce search and API calls
- Track subscriptions and unsubscribe in ngOnDestroy

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👥 Support

For issues or questions, please open an issue in the repository or contact the development team.
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
