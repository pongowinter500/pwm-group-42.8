# PWM Group 42.8 - Destination Discovery App

A production-ready mobile and web application built with **Ionic 7 + Angular 17** that enables users to discover, explore, and save their favorite travel destinations worldwide. The app integrates **Firebase** for real-time data synchronization and **SQLite** for offline support.

## 👥 Development Team
- **Andrea Pedrini**
- **Alberto Federici**

---

## 🚀 Getting Started

### Installation
```bash
# 1. Install dependencies
npm install

# 2. Configure Firebase
# Update src/environments/environment.ts with your Firebase credentials
```

### Development
```bash
# Start the development server
ng serve

# The app will automatically open on http://localhost:4200
# Automatically reloads when you save files
```

**Note:** Use `ng serve` instead of `ionic serve` to avoid issues with libraries (SQLite, Firebase)

---

## 🎯 Project Overview

### What does it do?
The application is a travel destination discovery platform with the following main features:
- **Authentication**: Users register/login via email and password
- **Exploration**: Browse public destinations with a home page accessible to everyone
- **Personal Favorites**: Authenticated users can save/remove favorite destinations
- **User Profile**: Manage personal data (name, surname, photo)
- **Synchronization**: Data is synchronized in real-time with Firebase Firestore
- **Offline**: Favorite destinations remain accessible offline thanks to SQLite

### Technology Stack
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Angular** | 17.2.0 | Main framework for logic and components |
| **Ionic** | 7.5.0 | UI components and mobile functionality |
| **Firebase** | 9.23.0 | Authentication and cloud database (Firestore) |
| **SQLite** | @capacitor-community/sqlite 5.0.0 | Local database for offline support |
| **RxJS** | 7.8.0 | Stream and observable management |
| **Capacitor** | 5.0.0 | Bridge between web and native platforms (iOS/Android) |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── guards/
│   │   └── auth.guard.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── firestore.service.ts
│   │   ├── database.service.ts
│   │   └── favorites.service.ts
│   │
│   ├── pages/
│   │   ├── login/
│   │   ├── register/
│   │   ├── home/
│   │   ├── favorites/
│   │   ├── detail/
│   │   └── profile/
│   │
│   ├── app-routing.module.ts
│   ├── app.component.ts
│   ├── app.component.html
│   ├── app.component.scss
│   └── app.module.ts
│
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
│
├── theme/
│   └── variables.scss
│
├── global.scss
├── index.html
└── main.ts
```

---

## 🔧 File Details and Functions

### 📌 Main Configuration Files

#### **main.ts**
**Purpose:** Angular application entry point

**Main Functions:**
- Imports and initializes **jeep-sqlite** (SQLite driver for web)
- Configures **Firebase** with credentials from `environment.ts`
- Enables Angular animations
- Sets routing with routes defined in `app-routing.module.ts`
- Configures **@angular/fire** providers (Auth, Firestore)
- Configures Ionic for mobile interface

**Key Code:**
```typescript
jeepSqlite(window);  // Enable SQLite in browser
bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideIonicAngular()
  ]
});
```

#### **app-routing.module.ts**
**Purpose:** Defines all application routes with protection

**Main Functions:**
- Maps URLs to pages (components)
- Applies **AuthGuard** to protected routes (favorites, profile)
- Public routes (login, register, home, detail) are accessible to everyone
- Redirects unauthorized access to login page

---

### 🔐 Guard (Route Protection)

#### **auth.guard.ts**
**Purpose:** Protects routes that require authentication

**Main Functions:**
```typescript
canActivate()  // Verifies if user is logged in
               // If YES → allows navigation (return true)
               // If NO → redirects to /login (return false)
```

**Implementation:**
- Reads authentication state from Firebase Auth
- Uses RxJS `map()` and `take(1)` to check if a user exists
- Automatically redirects unauthenticated users

---

### 🛠️ Services (Application Logic)

#### **auth.service.ts**
**Purpose:** Manages Firebase authentication and user data

**Main Functions:**

1. **`register(email, password, firstName, lastName, photoUrl)`**
   - Creates a new Firebase account with email and password
   - Saves additional profile data to Firestore `users` collection
   - Initializes user profile with name, surname, photo

2. **`login(email, password)`**
   - Authenticates user with Firebase
   - Returns user object after login

3. **`logout()`**
   - Logs out the user from Firebase session

4. **`currentUser$`** (Observable)
   - Stream that emits current user state
   - Available for binding in components

5. **`getCurrentUserId()`**
   - Returns UID of authenticated user
   - Used for user-specific Firestore operations

#### **firestore.service.ts**
**Purpose:** Manages reads and writes to Firebase Firestore

**Main Functions:**

1. **`loadDestinations()`**
   - Loads all destinations from `destinations` collection
   - Returns Observable with complete list

2. **`getDestinationById(id)`**
   - Retrieves details of a single destination by ID

3. **`getUserProfile(uid)`**
   - Loads user profile from `users` collection
   - Contains: firstName, lastName, photoUrl, email

4. **`updateUserProfile(uid, profileData)`**
   - Updates user profile (name, surname, photo)

5. **`getUserFavorites(uid)`**
   - Loads list of user's favorite destinations

#### **database.service.ts**
**Purpose:** Manages local SQLite database for offline support

**Main Functions:**

1. **`initializeDatabase()`**
   - Creates SQLite tables on first run
   - Initializes local database structure

2. **`addFavorite(destinationId)`**
   - Saves a destination to local SQLite table

3. **`removeFavorite(destinationId)`**
   - Removes a destination from local database

4. **`getFavorites()`**
   - Retrieves list of favorite destinations from local database
   - Used when offline to maintain access to favorites

5. **`addFavoriteToFirestore(uid, destinationId)`**
   - Syncs favorite with cloud Firestore database

#### **favorites.service.ts**
**Purpose:** Orchestrates synchronization between SQLite and Firestore

**Main Functions:**

1. **`addFavorite(id)`**
   - Adds a destination to favorites
   - Saves to both SQLite (offline) and Firestore (cloud)
   - Notifies listeners via `favoriteToggled$` Observable

2. **`removeFavorite(id)`**
   - Removes a destination from favorites
   - Syncs with both databases
   - Notifies all listeners in real-time

3. **`isFavorite(id)`**
   - Checks if a destination is in favorites
   - Used to show/hide star icon

4. **`getFavorites()`**
   - Loads list of user's favorite destinations

5. **`favoritesUpdated$`** (BehaviorSubject)
   - Emits signal when favorites list changes
   - Allows real-time refresh across multiple pages

6. **`favoriteToggled$`** (BehaviorSubject)
   - Notifies when a single favorite is added/removed
   - Allows other components to react immediately

---

### 📄 Pages (Components)

#### **login/** 
**Purpose:** Public page for account access

**Files:**
- `login.page.ts` - Authentication logic
- `login.page.html` - Form with email/password fields
- `login.page.scss` - Dark theme styles

**Main Functions:**
- Login form with validation
- Calls `authService.login(email, password)`
- Redirects to home if login succeeds
- Shows error messages if credentials are wrong

#### **register/** 
**Purpose:** Public page for new account registration

**Files:**
- `register.page.ts` - Registration logic
- `register.page.html` - Form for email, password, name, surname, photo
- `register.page.scss` - Styles

**Main Functions:**
- Registration form with validation
- Loads photo from gallery/camera
- Calls `authService.register(email, password, firstName, lastName, photoUrl)`
- Creates user profile in Firestore
- Redirects to login after registration

#### **home/** 
**Purpose:** Main public page with destination catalog

**Files:**
- `home.page.ts` - Search and destination loading logic
- `home.page.html` - Featured carousel section + destination grid + search bar
- `home.page.scss` - Gradient and responsive styles

**Main Functions:**
- **Load destinations**: Fetches from Firestore on load
- **Real-time search**: Implements 1.5-second debounce
  - Filters by destination name and description
- **Real-time favorites**: 
  - Subscribes to `favoriteToggled$` to update star icons
  - Shows immediately if destination is favorited
- **Featured carousel**: Shows subset of destinations in highlight
- **Responsive grid**: Mobile/tablet/desktop layout

#### **favorites/** 
**Purpose:** Protected page (requires login) with user's favorite destinations

**Files:**
- `favorites.page.ts` - Loads and manages favorites list
- `favorites.page.html` - Searchable list with delete option
- `favorites.page.scss` - Styles

**Main Functions:**
- **Load favorites**: Fetches from Firestore on load
- **Local search**: Filters favorites by name
- **Removal**: Removes a destination from favorites
- **Real-time sync**: Listens to `favoritesUpdated$` for automatic refresh
- **Protected access**: Only logged-in users can access

#### **detail/** 
**Purpose:** Semi-public page with complete destination details

**Files:**
- `detail.page.ts` - Details logic and favorites management
- `detail.page.html` - Hero image, description, tags, rating, star button
- `detail.page.scss` - Styles

**Main Functions:**
- **Load details**: Fetches destination from Firestore by ID
- **Star icon**: Shows if destination is favorited
- **Toggle favorite**: Clicking star adds/removes from favorites
- **Real-time update**: Listens to `favoriteToggled$` to update icon
- **Display**: Shows image, description, rating, tags

#### **profile/** 
**Purpose:** Protected page for user profile management

**Files:**
- `profile.page.ts` - Profile loading/editing logic and logout
- `profile.page.html` - Profile card with view/edit modes
- `profile.page.scss` - Styles

**Main Functions:**
- **Load profile**: Fetches data from Firestore
- **Edit mode**: Form to modify name, surname, photo
- **Photo upload**: Uploads new photo and saves to Firestore
- **Save**: Updates profile with `firestoreService.updateUserProfile()`
- **Logout**: Logs out user and returns to login
- **Statistics**: Can show number of favorites and other info

#### **app.component**
**Purpose:** Root component with main navigation

**Files:**
- `app.component.ts` - Navigation logic and state management
- `app.component.html` - Tab bar for page navigation
- `app.component.scss` - Styles

**Main Functions:**
- **Tab bar**: Allows switching between home, favorites, profile
- **Visibility management**: Shows/hides tabs based on page
- **Routing**: Coordinates navigation between pages

---

### 🎨 Theme and Styles

#### **theme/variables.scss**
**Purpose:** Defines global CSS variables and dark theme

**Contains:**
- Primary, secondary, background colors
- Font family and sizes
- Standard spacing (margin, padding)
- Dark mode styles
- Pre-configured Ionic variables

#### **global.scss**
**Purpose:** Global styles applied to entire application

**Contains:**
- CSS reset
- Styles for body, html
- Global animations
- Common utility classes

---

### ⚙️ Configuration Files

#### **environments/environment.ts**
**Purpose:** Configuration for development

**Contains:**
- **firebaseConfig**: Development Firebase credentials
  - apiKey
  - authDomain
  - projectId
  - storageBucket
  - messagingSenderId
  - appId

#### **environments/environment.prod.ts**
**Purpose:** Configuration for production

**Contains:**
- **firebaseConfig**: Production Firebase credentials (different from dev)

#### **package.json**
**Purpose:** Manages dependencies and npm scripts

**Main Scripts:**
```bash
npm start          # Starts ng serve
npm build          # Builds for production
npm test           # Runs tests
npm run watch      # Build in watch mode
```

#### **angular.json**
**Purpose:** Angular CLI configuration

**Contains:**
- Build configuration
- Asset paths
- Global styles
- Development/production options

#### **ionic.config.json**
**Purpose:** Ionic configuration

**Contains:**
- App name
- Capacitor settings
- Platform configurations

#### **capacitor.config.json**
**Purpose:** Capacitor configuration for native builds

**Contains:**
- appId
- appName
- Permissions and platform configurations

---

## 🔄 Data Flow

### User Registration
```
User (register.html) 
  → authService.register() 
  → Firebase Auth creates account
  → Firestore saves profile to /users/{uid}
  → Redirects to /login
```

### User Login
```
User (login.html)
  → authService.login()
  → Firebase Auth authenticates
  → currentUser$ emits user
  → App redirects to /home
```

### Adding a Favorite
```
User clicks star (detail.html or home.html)
  → favoritesService.addFavorite(id)
  → databaseService.addFavorite(id) [Local SQLite]
  → databaseService.addFavoriteToFirestore(uid, id) [Cloud]
  → favoriteToggled$ notifies all listeners
  → Star icons updated in real-time
  → FavoritesService.favoritesUpdated$ notifies refresh
```

### Loading Favorites
```
User accesses /favorites
  → favoritesService.getFavorites()
  → Firestore loads favorites from /users/{uid}/favorites
  → favorites.page.ts populates list
  → Listens to favoritesUpdated$ for refresh
```

---

## 💾 Offline Synchronization

The app uses a **SQLite + Firestore** strategy:

1. **When online**:
   - Data is saved to Firestore (source of truth)
   - Local copy to SQLite for fast access

2. **When offline**:
   - SQLite continues to work locally
   - User can still view favorites
   - Changes are stored locally

3. **When back online**:
   - App syncs local changes with Firestore
   - Resolves any conflicts

---

## 🔐 Security

- **Firebase Auth**: Handles secure authentication with password hashing
- **Firestore Rules**: Limit access to personal data
  - Users can only read/write their own data
  - Public data (destinations) is readable by all
- **No hardcoded credentials**: Uses `environment.ts` for config

---

## 📱 Mobile Features

- **Capacitor**: Bridge to access native features (camera, storage)
- **Responsive Design**: Optimized for phone, tablet, desktop
- **Touch Gestures**: Touch gesture support on mobile
- **App Icons and Splash**: Configurable via `ionic.config.json`

---

## ✨ Future Improvements

- Add unit tests for services
- Implement PWA (Progressive Web App)
- Add push notifications
- Implement lazy loading for images
- Add advanced filters for destinations
- Save search history
- Share destinations on social media

