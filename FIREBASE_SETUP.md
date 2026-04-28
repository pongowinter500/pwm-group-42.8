# 📋 Configurazione Firebase & Firestore - Guida Completa

## ✅ Modifiche Implementate

### 1. **app.config.ts** - Inizializzazione Firestore
- Aggiunto `getFirestore()` e `provideFirestore()` per il supporto Firestore
- Firebase Authentication già configurato con `provideAuth()`

### 2. **auth.service.ts** - Firebase Authentication
**Cambiamenti principali:**
- Utilizza `Firebase Authentication` per login/register invece di JSON locale
- Legge il profilo utente dalla collection Firestore `users`
- Sincronizza lo stato di autenticazione con `onAuthStateChanged()`
- Nuovo metodo `register()` per creare nuovi utenti

**Metodi disponibili:**
```typescript
login(email: string, password: string): Observable<boolean>
register(email: string, password: string, role: string): Observable<boolean>
logout(): Observable<boolean>
isAuthenticated(): boolean
getCurrentUser(): string | null
getUserRole(): string | null
getUserProfile(): UserProfile | null
getAuthUser() // Firebase Auth User
```

### 3. **course.service.ts** - Firestore per Dati
**Cambiamenti principali:**
- Carica da **Firestore** invece di JSON locale
- Supporta tutte le collections: `courses`, `instructors`, `siteData`
- Metodi normalizati per caricare dati asincroni

**Collections supportate:**
- `courses` - Document IDs: courseName (es. "python", "database")
- `instructors` - Document IDs: id numerico
- `siteData` - Sottodocumenti: "about", "business", "siteInfo"

### 4. **auth.guard.ts** - Protezione Route
**Due approcci:**

#### **Approccio Class-based:**
```typescript
import { AuthGuard } from './guards/auth.guard';
// In routes: canActivate: [AuthGuard]
```

#### **Approccio Functional (Consigliato):**
```typescript
import { canActivateAuth, canActivateRole } from './guards/auth.guard';
// In routes: canActivate: [canActivateAuth]
```

### 5. **app.routes.ts** - Route Protette
Aggiunto supporto per proteggere route con guard:
```typescript
{
  path: 'admin',
  component: AdminComponent,
  canActivate: [canActivateRole],
  data: { requiredRole: 'admin' }
}
```

---

## 🔥 Struttura Firestore Richiesta

### **Collection: `courses`**
**Document ID:** courseName (es. "python", "database")
```json
{
  "id": 1,
  "courseName": "python",
  "courseTitle": "Python 101",
  "courseSubtitle": "Learn Python from scratch",
  "instructorId": 1,
  "instructorImg": "/assets/images/instructor1.jpg",
  "instructorName": "John Doe",
  "instructorTitle": "Senior Developer",
  "section1Title": "Getting Started",
  "section1Text": "Introduction to Python basics",
  "section2Title": "Advanced Topics",
  "topics": ["Variables", "Functions", "OOP"],
  "duration": "4 weeks",
  "level": "Beginner",
  "price": 99.99,
  "category": "programming",
  "icon": "python-icon.svg",
  "isNew": false,
  "catalogueDescription": "Learn Python fundamentals",
  "description": "Comprehensive Python course"
}
```

### **Collection: `instructors`**
**Document ID:** id numerico (es. "1", "2", "3")
```json
{
  "id": 1,
  "name": "John Doe",
  "title": "Senior Full-Stack Developer",
  "alternateTitle": "Tech Lead",
  "image": "john-doe.jpg",
  "bio": "10+ years of experience in web development",
  "specialization": ["Python", "JavaScript", "Docker"]
}
```

### **Collection: `siteData`**
#### **Document: `about`**
```json
{
  "hero": {
    "title": "About CodeMaster",
    "description": "Learn coding from industry experts"
  },
  "mission": {
    "title": "Our Mission",
    "description": "To make coding education accessible to everyone"
  },
  "offer": {
    "title": "What We Offer",
    "description": "High-quality courses with hands-on projects"
  }
}
```

#### **Document: `business`**
```json
{
  "hero": {
    "title": "For Business",
    "description": "Corporate training solutions",
    "contactEmail": "business@codemaster.com",
    "ctaText": "Contact Us"
  },
  "features": [
    {
      "id": 1,
      "title": "Custom Training",
      "description": "Tailored courses for your team",
      "icon": "custom-icon.svg"
    }
  ]
}
```

#### **Document: `siteInfo`**
```json
{
  "name": "CodeMaster",
  "description": "Learn to code",
  "contactEmail": "info@codemaster.com",
  "businessEmail": "business@codemaster.com"
}
```

#### **Document: `frontendConfig`** (opzionale)
```json
{
  "adminEditableSelectors": [
    ".hero-title",
    ".course-price"
  ]
}
```

### **Collection: `users`**
**Document ID:** Auto-generato da Firebase (UID)
```json
{
  "email": "user@example.com",
  "role": "user",
  "createdAt": "2024-01-15T10:30:00Z"
}
```
**Ruoli supportati:**
- `"user"` - Utente standard
- `"admin"` - Amministratore
- `"instructor"` - Istruttore

---

## 🚀 Come Usare

### **1. Login**
```typescript
constructor(private authService: AuthService) {}

login(email: string, password: string) {
  this.authService.login(email, password).subscribe(success => {
    if (success) {
      // User is authenticated
      console.log(this.authService.getCurrentUser());
    }
  });
}
```

### **2. Registrazione Nuovo Utente**
```typescript
register(email: string, password: string) {
  this.authService.register(email, password, 'user').subscribe(success => {
    if (success) {
      // User created and document added to Firestore
    }
  });
}
```

### **3. Caricare Corsi**
```typescript
constructor(private courseService: CourseService) {}

loadCourses() {
  this.courseService.getCourses().subscribe(courses => {
    console.log(courses);
  });
}
```

### **4. Proteggere Route**
```typescript
const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [canActivateAuth]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [canActivateRole],
    data: { requiredRole: 'admin' }
  }
];
```

### **5. Logout**
```typescript
logout() {
  this.authService.logout().subscribe(() => {
    // User logged out
    this.router.navigate(['/login']);
  });
}
```

---

## 🔒 Security Rules Firestore (consigliato)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection - Solo l'utente può leggere il suo documento
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId;
    }
    
    // Courses collection - Pubblico in lettura
    match /courses/{document=**} {
      allow read: if true;
      allow write: if request.auth.uid != null && getUserRole(request.auth.uid) == 'admin';
    }
    
    // Instructors collection - Pubblico in lettura
    match /instructors/{document=**} {
      allow read: if true;
      allow write: if request.auth.uid != null && getUserRole(request.auth.uid) == 'admin';
    }
    
    // SiteData collection - Pubblico in lettura
    match /siteData/{document=**} {
      allow read: if true;
      allow write: if request.auth.uid != null && getUserRole(request.auth.uid) == 'admin';
    }
    
    // Helper function to get user role
    function getUserRole(uid) {
      return get(/databases/$(database)/documents/users/$(uid)).data.role;
    }
  }
}
```

---

## ⚠️ Differenze Principali Rispetto a Prima

| Aspetto | Prima (JSON) | Adesso (Firebase) |
|---------|-------------|-------------------|
| **Autenticazione** | JSON locale + localStorage | Firebase Authentication |
| **Dati Utenti** | File JSON | Firestore collection `users` |
| **Corsi & Istruttori** | content.json | Firestore collections |
| **Stato Auth** | localStorage | Firebase real-time |
| **Sicurezza** | Bassa (client-side) | Alta (server-side con Security Rules) |

---

## 📝 Next Steps

1. **Popolare Firestore** con i dati seguendo la struttura sopra
2. **Testare** login/register in una pagina test
3. **Aggiungere route protette** usando i guard
4. **Configurare Security Rules** nel Firestore Console
5. **Testare** caricamento corsi e dati statici

---

## 🐛 Troubleshooting

**Problema:** "Collection 'courses' not found"
- **Soluzione:** Crea la collection in Firestore Console e aggiungi almeno un documento

**Problema:** "Auth not initialized"
- **Soluzione:** Assicurati che `environment.firebase` abbia le credenziali corrette

**Problema:** "User not found in Firestore"
- **Soluzione:** Crea manualmente un documento nella collection `users` con email e role, oppure usa il metodo `register()`

