# 🚀 FavoritesApp - Quick Start Guide

## 5-Minute Setup

### Step 1: Install Dependencies (3 minutes)
```bash
cd c:\Users\Dell\Desktop\Ionic-Angular
npm install
```

### Step 2: Configure Firebase (2 minutes)

1. Go to https://console.firebase.google.com/
2. Click "Create Project" → Name it "FavoritesApp" → Create
3. Go to **Build > Authentication** → Get Started → Enable "Email/Password"
4. Go to **Build > Firestore Database** → Create Database → Test Mode
5. Click Project Settings (⚙️) → Copy web API config
6. Open `src/environments/environment.ts` and replace:

```typescript
firebaseConfig: {
  apiKey: "PASTE_YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
}
```

### Step 3: Add Sample Data to Firestore

In Firebase Console, create these collections:

**1. Collection: `siteConfig` → Document ID: `appInfo`**
```json
{
  "appName": "FavoritesApp",
  "tagline": "Explore Your Favorite Destinations",
  "description": "Discover amazing places around the world"
}
```

**2. Collection: `screens` → Create 6 documents**

Document: `login`
```json
{
  "title": "Welcome Back",
  "emailLabel": "Email",
  "passwordLabel": "Password",
  "loginButton": "Login",
  "registerLink": "Don't have an account? Register",
  "invalidCredentials": "Invalid email or password"
}
```

Document: `register`
```json
{
  "title": "Create Account",
  "firstNameLabel": "First Name",
  "lastNameLabel": "Last Name",
  "emailLabel": "Email",
  "passwordLabel": "Password",
  "photoUrlLabel": "Profile Photo URL",
  "registerButton": "Register",
  "loginLink": "Already have an account? Login"
}
```

Document: `home`
```json
{
  "title": "Explore",
  "searchPlaceholder": "Search destinations...",
  "featuredSection": "Featured Destinations",
  "allDestinationsSection": "All Destinations"
}
```

Document: `favorites`
```json
{
  "title": "My Favorites",
  "searchPlaceholder": "Search favorites...",
  "emptyState": "No Favorites Yet"
}
```

Document: `detail`
```json
{
  "categoryLabel": "Category",
  "ratingLabel": "Rating",
  "continentLabel": "Continent"
}
```

Document: `profile`
```json
{
  "title": "Profile",
  "memberSinceLabel": "Member Since",
  "favoritesCountLabel": "Favorites",
  "logoutBtn": "Logout"
}
```

**3. Collection: `destinations` → Add sample data**

Click "Add Document" and paste each:

```json
{
  "name": "Paris",
  "shortDescription": "City of Light",
  "longDescription": "Paris is the capital of France, known for the Eiffel Tower, museums, and romance.",
  "category": "City",
  "rating": 4.9,
  "continent": "Europe",
  "imageUrl": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200",
  "thumbnailUrl": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500",
  "tags": ["romantic", "museums"],
  "featured": true
}
```

```json
{
  "name": "Tokyo",
  "shortDescription": "Modern & Traditional",
  "longDescription": "Tokyo blends ancient temples with cutting-edge technology and innovation.",
  "category": "City",
  "rating": 4.7,
  "continent": "Asia",
  "imageUrl": "https://images.unsplash.com/photo-1540959375944-7049f642e9cc?w=1200",
  "thumbnailUrl": "https://images.unsplash.com/photo-1540959375944-7049f642e9cc?w=500",
  "tags": ["technology", "culture"],
  "featured": true
}
```

```json
{
  "name": "Bali",
  "shortDescription": "Tropical Paradise",
  "longDescription": "Bali offers stunning beaches, temples, and a vibrant culture.",
  "category": "Beach",
  "rating": 4.8,
  "continent": "Asia",
  "imageUrl": "https://images.unsplash.com/photo-1537225228614-56cc30dd6a80?w=1200",
  "thumbnailUrl": "https://images.unsplash.com/photo-1537225228614-56cc30dd6a80?w=500",
  "tags": ["beach", "tropical"],
  "featured": true
}
```

### Step 4: Run the App
```bash
npm start
```

Open http://localhost:4200

### Step 5: Test It!

1. **Register**: Click "Register" → Fill form → Submit
   - First Name: John
   - Last Name: Doe
   - Email: test@example.com
   - Password: password123
   - Photo URL: https://i.pravatar.cc/150?img=1

2. **You'll be logged in to Home** ✅

3. **Explore Home Page**
   - See featured destinations
   - Search destinations
   - Click any card to see details

4. **Add Favorites**
   - Click the star icon on any destination
   - Star turns gold

5. **View Favorites**
   - Click "Favorites" tab
   - See your saved destinations
   - Click remove to delete

6. **View Profile**
   - Click "Profile" tab
   - See your info and favorite count
   - Click "Logout" to test auth protection

---

## Common Issues

### "Firebase configuration is not available"
→ Make sure you updated `src/environments/environment.ts` with your Firebase config

### "No destinations showing"
→ Make sure you created the `destinations` collection with documents

### "Cannot add to favorites"
→ Check SQLite is initialized (check browser console)

### "Search not working"
→ Clear browser cache and reload

---

## File Locations

- **Firebase Config**: `src/environments/environment.ts`
- **Services**: `src/app/services/`
- **Pages**: `src/app/pages/`
- **Styling**: `src/theme/variables.scss`
- **Routes**: `src/app/app-routing.module.ts`

---

## Full Documentation

- 📖 **README.md** - Complete project docs
- 📋 **SETUP_GUIDE.md** - Detailed setup steps
- 📁 **FILE_MANIFEST.md** - All files explained
- 🎉 **DELIVERY_SUMMARY.md** - What was built

---

## Next: Build for Mobile

```bash
# Production build
npm run build

# Sync to Capacitor
npx cap sync ios    # or android

# Open in Xcode/Android Studio
npx cap open ios    # or android
```

---

**You're all set! Happy coding! 🚀**

Questions? Check the documentation files or review the inline code comments.
