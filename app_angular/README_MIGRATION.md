# 🎓 CodeMaster - Angular Application

Applicazione Angular moderna per la gestione e visualizzazione di corsi online in computer science.

---

## 🚀 Quick Start

### Prerequisiti
- **Node.js** 18+ 
- **npm** 9+
- **Angular CLI** 18+

### Installazione

```bash
# Accedere alla cartella del progetto
cd app_angular

# Installare dipendenze
npm install

# Avviare development server
ng serve

# Oppure con npm
npm start
```

L'applicazione sarà disponibile a: **http://localhost:4200**

---

## 🏗️ Struttura del Progetto

```
app_angular/
├── src/
│   ├── app/
│   │   ├── shared/              # Componenti condivisi (Header, Footer)
│   │   ├── pages/               # Pagine dell'applicazione
│   │   ├── components/          # Componenti feature riutilizzabili
│   │   ├── services/            # Servizi di business logic
│   │   ├── models/              # TypeScript interfaces
│   │   └── app.*                # Root component & config
│   ├── assets/
│   │   ├── images/              # Immagini
│   │   ├── data/                # Dati JSON (content.json)
│   │   └── styles/              # CSS aggiuntivi (opzionale)
│   ├── styles.css               # Stili globali
│   └── main.ts                  # Entry point
├── package.json
├── angular.json
├── tsconfig.json
└── README.md
```

---

## 📱 Pagine Disponibili

| Pagina | URL | Descrizione |
|--------|-----|-------------|
| Home | `/` | Catalogo corsi + nuovi corsi in slider |
| About | `/about` | Informazioni aziendali e missione |
| Login | `/login` | Form di autenticazione |
| Business | `/business` | Soluzioni per le aziende |
| Course Detail | `/course/:id` | Dettagli specifici di un corso |

---

## 🔧 Componenti Principali

### Header (`shared/components/header/`)
- Navigazione sticky
- Menu mobile responsivo
- Ricerca corso
- Stato autenticazione

### HomeComponent (`pages/home/`)
- Slider corsi in evidenza
- Catalogo completo corsi
- Integrazione CourseService

### CourseCard (`components/course-card/`)
- Card reusable per corso
- Immagine, prezzo, livello
- Link al dettaglio corso

### CourseSlider (`components/course-slider/`)
- Carousel con navigazione
- Responsive (1-3 colonne)
- Animazioni smooth

---

## 🛠️ Servizi

### CourseService
Gestisce tutti i dati dei corsi:
```typescript
// Ottenere tutti i corsi
this.courseService.getCourses().subscribe(courses => {...});

// Cercare corso per ID
this.courseService.getCourseById(1).subscribe(course => {...});

// Filtrare corsi nuovi
this.courseService.getNewCourses().subscribe(courses => {...});

// Ricerca per keyword
this.courseService.searchCourses('python').subscribe(results => {...});
```

### AuthService
Gestisce autenticazione utente:
```typescript
// Login
this.authService.login(email, password).subscribe(success => {...});

// Logout
this.authService.logout();

// Controllare stato
this.authService.isAuthenticated$.subscribe(isAuth => {...});
```

---

## 🎨 Styling

- **Baseline**: `src/styles.css`
- **Component-scoped**: CSS incluso in ogni componente
- **Responsive**: Mobile-first con media queries
- **Design System**: 
  - Colori: `#2c3e50`, `#2c5aa0`, `#27384a`
  - Font: 'Segoe UI', Tahoma, Geneva, Verdana
  - Spacing: Sistema em/rem

---

## 📊 Build & Deployment

### Development Build
```bash
ng serve
# Application runs on http://localhost:4200 with hot reload
```

### Production Build
```bash
ng build --configuration production
# Output in dist/ folder
```

### Deploy su GitHub Pages (opzionale)
```bash
npm install -g angular-cli-ghpages
ng build --base-href="/pwm_es1/"
ngh --dir=dist/app_angular/browser
```

---

## 🔐 Autenticazione

**Attualmente**: Demo mode con localStorage
- Email qualsiasi
- Password: minimo 6 caratteri
- Token salvato in localStorage

**Per produzione**: Implementare autenticazione backend
```typescript
// Vedere AuthService.ts per i TODOs
```

---

## 📦 Dipendenze Principali

```json
{
  "@angular/core": "^18.0.0",
  "@angular/common": "^18.0.0",
  "@angular/platform-browser": "^18.0.0",
  "@angular/router": "^18.0.0",
  "rxjs": "^7.8.0",
  "tslib": "^2.4.0"
}
```

---

## 🧪 Testing

### Unit Tests
```bash
ng test
```

### End-to-End Tests
```bash
ng e2e
```

---

## 🐛 Troubleshooting

### Porta 4200 già in uso?
```bash
ng serve --port 4201
```

### Errore su immagini?
- Accertarsi che le immagini siano in `src/assets/images/`
- Controllare il path nei componenti

### Corso non trovato?
- Verificare che `src/assets/data/content.json` esista
- Controllare l'ID in URL
- Console browser per errori HTTP

---

## 📚 Documentazione

- **Migration Guide**: Vedi `MIGRATION_GUIDE.md` per dettagli sulla migrazione da HTML static
- **Angular Docs**: https://angular.dev
- **TypeScript**: https://www.typescriptlang.org

---

## 🚀 Prossimi Passi

1. **Backend Integration**: Integrare Strapi API
   ```typescript
   // Aggiornare CourseService.ts per usare API endpoints
   ```

2. **Advanced Features**:
   - Carrello e checkout
   - Pagamento Stripe/PayPal
   - Dashboard utente

3. **Performance**:
   - Lazy loading routes
   - Image optimization
   - Service Workers (PWA)

4. **Testing**:
   - Unit tests con Jasmine
   - E2E tests con Cypress

---

## 📝 Convenzioni di Codice

- **Componenti**: `PascalCase` (HomeComponent)
- **File**: `kebab-case` (home.component.ts)
- **Variabili**: `camelCase` (courseList)
- **Costanti**: `UPPER_SNAKE_CASE` (DEFAULT_PAGE_SIZE)
- **Interfacce**: `PascalCase` con `I` prefix (ICourse)

---

## 📄 Licenza

MIT - Libero da usare e modificare

---

**Ultima aggiornamento**: 2026-04-07  
**Versione**: 1.0.0  
**Status**: ✅ Prodotto e pronto all'uso
