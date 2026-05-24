# COMPLETE SETUP GUIDE - FavoritesApp

This comprehensive guide walks you through setting up the complete FavoritesApp project from scratch.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Initialization](#project-initialization)
3. [Firebase Configuration](#firebase-configuration)
4. [Firestore Data Setup](#firestore-data-setup)
5. [Running the Application](#running-the-application)
6. [Building for Mobile](#building-for-mobile)
7. [Deployment](#deployment)

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js** 16+ ([Download](https://nodejs.org/))
- **npm** 8+ (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **Ionic CLI**: `npm install -g @ionic/cli`
- **Angular CLI**: `npm install -g @angular/cli`
- **Xcode** (for iOS development - macOS only)
- **Android Studio** (for Android development)

Verify installations:
```bash
node --version
npm --version
ionic --version
ng version
```

---

## Project Initialization

### Step 1: Copy Project Files

All files have already been generated in this directory. The project structure is complete with:
- Source code files (TypeScript, HTML, SCSS)
- Configuration files (angular.json, tsconfig.json, etc.)
- Firebase configuration templates
- Capacitor setup

### Step 2: Install Dependencies

```bash
cd c:\Users\Dell\Desktop\oppencode_try
npm install
```

This will install:
- Angular 17 and required packages
- Ionic 7 and IonicModule
- Firebase SDK and AngularFire
- Capacitor for mobile
- SQLite plugin for local database
- Additional utilities

The installation may take 5-10 minutes.

### Step 3: Verify Installation

```bash
npm list @ionic/angular
npm list @angular/fire
npm list @capacitor-community/sqlite
```

---

## Firebase Configuration

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: "FavoritesApp" (or any name)
4. Accept terms and create
5. Wait for project to be provisioned

### Step 2: Enable Services

#### Enable Firebase Authentication

1. In Firebase Console, go to **Build > Authentication**
2. Click **Get Started**
3. Choose **Email/Password**
4. Enable email/password authentication
5. Click **Save**

#### Create Firestore Database

1. Go to **Build > Firestore Database**
2. Click **Create Database**
3. Choose **Start in test mode** (for development)
4. Select region closest to you
5. Click **Create**

**Important**: Test mode allows read/write for all users. In production, configure proper security rules.

### Step 3: Get Firebase Config

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Under "Your apps", click the web icon `</>`
3. Register an app named "FavoritesApp"
4. Copy the firebaseConfig object
5. Update `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxX",
    authDomain: "favoritesapp-12345.firebaseapp.com",
    projectId: "favoritesapp-12345",
    storageBucket: "favoritesapp-12345.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdefg1234567"
  }
};
```

Also update `src/environments/environment.prod.ts` with the same values.

### Step 4: Verify Firebase Connection

Run the development server:
```bash
npm start
```

Navigate to http://localhost:4200 and check the console for Firebase initialization messages.

---

## Firestore Data Setup

### Step 1: Create Collections and Documents

Use the Firebase Console to manually create the following structure:

#### 1. Create `siteConfig` Collection

Collection name: **siteConfig**

Document ID: **appInfo**

Document content:
```json
{
  "appName": "FavoritesApp",
  "tagline": "Explore & Save Your Favorite Destinations",
  "description": "Discover amazing places around the world",
  "logoUrl": "https://via.placeholder.com/256",
  "primaryColor": "#6C63FF",
  "accentColor": "#FF6584"
}
```

#### 2. Create `screens` Collection

Collection name: **screens**

Create 6 documents with these IDs and contents:

**Document: register**
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
  "registrationError": "Registration failed. Please try again.",
  "emailError": "Please enter a valid email",
  "passwordError": "Password must be at least 6 characters",
  "photoUrlError": "Please enter a valid URL (starting with http:// or https://)"
}
```

**Document: login**
```json
{
  "title": "Welcome Back",
  "emailLabel": "Email",
  "passwordLabel": "Password",
  "loginButton": "Login",
  "registerLink": "Don't have an account? Register",
  "emailError": "Please enter a valid email",
  "passwordError": "Password must be at least 6 characters",
  "invalidCredentials": "Invalid email or password"
}
```

**Document: home**
```json
{
  "title": "Explore",
  "searchPlaceholder": "Search destinations...",
  "featuredSection": "Featured Destinations",
  "allDestinationsSection": "All Destinations",
  "emptyState": "No destinations found"
}
```

**Document: favorites**
```json
{
  "title": "My Favorites",
  "searchPlaceholder": "Search favorites...",
  "emptyState": "No Favorites",
  "emptyDescription": "Start adding to your favorites",
  "showAllToggle": "Show All",
  "showFavoritesToggle": "Show Favorites"
}
```

**Document: detail**
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

**Document: profile**
```json
{
  "title": "Profile",
  "memberSinceLabel": "Member Since",
  "favoritesCountLabel": "Favorites",
  "emailLabel": "Email",
  "editProfileBtn": "Edit Profile",
  "logoutBtn": "Logout",
  "logoutConfirm": "Are you sure you want to logout?"
}
```

#### 3. Create `destinations` Collection

Collection name: **destinations**

Create multiple documents with auto-generated IDs and this structure:

**Document 1**
```json
{
  "name": "Paris",
  "shortDescription": "The City of Light and love",
  "longDescription": "Paris, the capital of France, is renowned for its iconic Eiffel Tower, world-class museums like the Louvre, charming cafés, and romantic ambiance. Stroll along the Seine, explore historic neighborhoods like Montmartre, and experience exquisite French cuisine.",
  "category": "City",
  "rating": 4.9,
  "continent": "Europe",
  "imageUrl": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200",
  "thumbnailUrl": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500",
  "tags": ["romantic", "museums", "architecture", "food"],
  "featured": true
}
```

**Document 2**
```json
{
  "name": "Tokyo",
  "shortDescription": "A blend of ancient tradition and cutting-edge technology",
  "longDescription": "Tokyo, Japan's vibrant capital, seamlessly blends ancient temples with ultramodern skyscrapers. Experience bustling markets, serene gardens, world-class restaurants, and unique cultural traditions in one of the world's most exciting cities.",
  "category": "City",
  "rating": 4.7,
  "continent": "Asia",
  "imageUrl": "https://images.unsplash.com/photo-1540959375944-7049f642e9cc?w=1200",
  "thumbnailUrl": "https://images.unsplash.com/photo-1540959375944-7049f642e9cc?w=500",
  "tags": ["technology", "culture", "food", "nature"],
  "featured": true
}
```

**Document 3**
```json
{
  "name": "New York",
  "shortDescription": "The city that never sleeps",
  "longDescription": "New York City is the epitome of urban energy. From the iconic Statue of Liberty and Broadway theaters to world-renowned museums and diverse neighborhoods like Chinatown and Harlem, NYC offers endless entertainment, dining, and cultural experiences.",
  "category": "City",
  "rating": 4.6,
  "continent": "North America",
  "imageUrl": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200",
  "thumbnailUrl": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=500",
  "tags": ["urban", "entertainment", "museums", "food"],
  "featured": false
}
```

**Document 4**
```json
{
  "name": "Bali",
  "shortDescription": "Tropical paradise with stunning beaches and temples",
  "longDescription": "Bali, Indonesia's most famous island, captivates visitors with its lush rice terraces, ancient Hindu temples, pristine beaches, and spiritual culture. Perfect for beach relaxation, water sports, yoga retreats, and discovering local traditions.",
  "category": "Beach",
  "rating": 4.8,
  "continent": "Asia",
  "imageUrl": "https://images.unsplash.com/photo-1537225228614-56cc30dd6a80?w=1200",
  "thumbnailUrl": "https://images.unsplash.com/photo-1537225228614-56cc30dd6a80?w=500",
  "tags": ["beach", "tropical", "spiritual", "water-sports"],
  "featured": true
}
```

**Document 5**
```json
{
  "name": "Swiss Alps",
  "shortDescription": "Majestic mountains and alpine villages",
  "longDescription": "The Swiss Alps offer breathtaking mountain scenery, charming alpine villages, world-class skiing, and excellent hiking trails. Experience Swiss hospitality, traditional chalets, and stunning panoramic views that inspire adventurers and nature lovers.",
  "category": "Nature",
  "rating": 4.8,
  "continent": "Europe",
  "imageUrl": "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200",
  "thumbnailUrl": "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=500",
  "tags": ["mountains", "skiing", "hiking", "scenic"],
  "featured": true
}
```

**Document 6**
```json
{
  "name": "Cairo",
  "shortDescription": "Ancient wonders meet modern metropolis",
  "longDescription": "Cairo, Egypt's bustling capital, is home to the iconic Great Pyramids and Sphinx. Explore the Egyptian Museum, navigate the vibrant Khan el-Khalili bazaar, cruise the Nile River, and discover 5,000 years of human history in this enchanting city.",
  "category": "Historical",
  "rating": 4.5,
  "continent": "Africa",
  "imageUrl": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200",
  "thumbnailUrl": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200",
  "tags": ["ancient", "history", "monuments", "culture"],
  "featured": false
}
```

#### 4. `users` Collection

This collection is automatically populated when users register. No manual setup needed.

---

## Running the Application

### Development Server

```bash
npm start
# or
ionic serve
```

The app will be available at `http://localhost:4200`

### First-Time Test

1. Navigate to http://localhost:4200
2. You should be redirected to `/login`
3. Click "Don't have an account? Register"
4. Fill out registration form:
   - First Name: John
   - Last Name: Doe
   - Email: test@example.com
   - Password: password123
   - Profile Photo URL: https://i.pravatar.cc/150?img=1
5. Click Register
6. Should redirect to `/home` showing destinations

### Navigation Test

- **Home**: Shows featured and all destinations with search
- **Favorites**: Initially empty (add some!)
- **Profile**: Shows your account info
- Click star icon on any destination to add/remove favorites
- Click any destination card to view details

---

## Building for Mobile

### Prerequisites for iOS

- macOS (required for iOS builds)
- Xcode 14+
- CocoaPods

### Prerequisites for Android

- Android Studio
- Android SDK 12+
- JDK 11+

### Build Steps

#### 1. Create Production Build

```bash
npm run build
# or for Ionic specific build
ionic build --prod
```

#### 2. Initialize Capacitor (if not done)

```bash
npx cap init
```

When prompted:
- App name: FavoritesApp
- App package ID: com.example.favoritesapp

#### 3. Add Platforms

```bash
# Add iOS
npx cap add ios

# Add Android
npx cap add android
```

#### 4. Sync Native Code

```bash
npx cap sync
```

This copies your web build into the native projects.

#### 5. Build for iOS

```bash
npx cap open ios
```

This opens Xcode. Then:
1. Select your team in signing
2. Click Play button to build and run
3. Or go to Product > Archive for App Store submission

#### 6. Build for Android

```bash
npx cap open android
```

This opens Android Studio. Then:
1. Click "Run 'app'" button to build and run on emulator/device
2. Or go to Build > Generate Signed Bundle for Play Store submission

---

## Deployment

### To iOS App Store

1. Generate production build:
```bash
npm run build -- --prod
npx cap sync ios
```

2. In Xcode:
   - Select "Any iOS Device" (not simulator)
   - Product > Archive
   - Follow App Store Connect instructions

### To Google Play Store

1. Generate production build:
```bash
npm run build -- --prod
npx cap sync android
```

2. In Android Studio:
   - Build > Generate Signed Bundle/APK
   - Create/select signing key
   - Build release APK or AAB
   - Upload to Play Console

### Environment Variables for Production

Update `src/environments/environment.prod.ts` with production Firebase config (same as development for now).

For real security, use Firebase Security Rules to restrict data access.

---

## Troubleshooting

### Port Already in Use (4200)

```bash
ionic serve --port 4300
```

### Firebase Auth Not Working

- Verify Firebase config in environment.ts
- Check Firebase Console for email/password enabled
- Check browser console for errors

### SQLite Not Working

- Clear browser cache
- Reinstall: `npm install @capacitor-community/sqlite@latest`
- Check device has storage space

### Build Errors

```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Rebuild Angular
ng build --prod
```

### Port Conflicts on Android

```bash
adb reverse tcp:8080 tcp:8080
```

---

## Next Steps

1. **Customize Theme**: Edit `src/theme/variables.scss`
2. **Add Features**: Extend pages and services
3. **Optimize Images**: Compress image URLs before adding to Firestore
4. **Configure Security Rules**: Set up proper Firestore rules for production
5. **Add Push Notifications**: Use Firebase Cloud Messaging
6. **Setup CI/CD**: Use GitHub Actions or similar for automated builds

---

## Support Resources

- [Ionic Documentation](https://ionicframework.com/docs)
- [Angular Documentation](https://angular.io/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [AngularFire Documentation](https://github.com/angular/angularfire)

---

**Happy coding! 🚀**
