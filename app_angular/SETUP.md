# 🚀 SETUP GUIDE - CodeMaster Angular Application

Guida completa per configurare e avviare l'applicazione Angular migrata.

---

## 📋 Prerequisiti

Prima di iniziare, assicurati di avere installato:

- **Node.js** 18+ → https://nodejs.org
- **npm** 9+ (incluso con Node.js)
- **Git** (opzionale)

Verifica le versioni:
```bash
node --version      # Dovrebbe mostrare v18.x o superiore
npm --version       # Dovrebbe mostrare 9.x o superiore
```

---

## 🏃 Quick Start (3 Minuti)

### 1️⃣ Accedere alla cartella del progetto
```bash
cd c:\AltriProgrammi\pwm_es1\app_angular
```

### 2️⃣ Installare dipendenze
```bash
npm install
```

Aspetta che finisca (~2-3 minuti a seconda della velocità internet)

### 3️⃣ Avviare dev server
```bash
npm start
```

oppure

```bash
ng serve
```

### 4️⃣ Aprire nel browser
```
http://localhost:4200
```

✅ **Fatto!** L'applicazione è ora in esecuzione!

---

## 📖 Guida Dettagliata

### Step 1: Preparazione Ambiente

#### Windows (PowerShell)
```powershell
# Verificare Node.js
node -v
npm -v

# Se non installato, scarica da nodejs.org poi riavvia PowerShell
```

#### Mac/Linux (Terminal)
```bash
# Check Node.js
node -v
npm -v

# Se non presente, usa Homebrew:
brew install node
```

### Step 2: Installazione Dipendenze

```bash
# Navigare alla cartella
cd app_angular

# Installare tutte le dipendenze dal package.json
npm install

# Output atteso: 
# > added XXX packages, and audited XXX packages in Xs
```

⏳ **Questo scaricherà ~500MB di dipendenze**

### Step 3: Verificare Installazione

```bash
# Controllare che Angular CLI sia disponibile
ng version

# Output atteso:
# Angular CLI: 18.x.x
# Angular: 18.x.x
# ...
```

### Step 4: Avviare Development Server

#### Opzione A: Usare npm start
```bash
npm start
```

#### Opzione B: Usare Angular CLI
```bash
ng serve
```

#### Opzione C: Con port personalizzato (se 4200 occupata)
```bash
ng serve --port 4201
```

**Output atteso:**
```
✔ Compiled successfully.
                        ░░░░░░░░░░░░░ 14% (5/8) 5s 18/18 modules 0 active
Application bundle generation complete. [0.234 seconds]
                        ░░░░░░░░░░░░░ 14% (5/8) 5s 18/18 modules 0 active
Watch mode enabled. Watching for file changes...
Local:        http://localhost:4200/
external:     http://x.x.x.x:4200/
```

### Step 5: Accedere all'Applicazione

Apri il browser a: **http://localhost:4200**

Dovresti vedere:
- Header con navigazione
- Home page con slider di corsi
- Footer con link

---

## 🧪 Prima Volta - Test Funzionalità

### Test 1: Navigazione
- Clicca su "About" nel menu
- Clicca su "For Business"
- Clicca su un corso per vederne i dettagli

### Test 2: Login
- Clicca su "Login" nel menu
- Inserisci qualsiasi email (es: test@example.com)
- Inserisci password (min 6 char, es: password123)
- Clicca "Login"
- Verifica che il menu mostri "Logout"

### Test 3: Responsive Design
- Premi F12 per aprire DevTools
- Clicca il bottone "Toggle device toolbar" (oppure Ctrl+Shift+M)
- Seleziona "iPhone 12" o altro device mobile
- Verifica che il menu diventi un hamburger menu

---

## 🔧 Configurazione Utilizzata

Il progetto è già pre-configurato con:

```json
{
  "dependencies": {
    "@angular/common": "^18.0.0",
    "@angular/core": "^18.0.0",
    "@angular/platform-browser": "^18.0.0",
    "@angular/router": "^18.0.0",
    "rxjs": "^7.8.0",
    "tslib": "^2.4.0"
  },
  "scripts": {
    "start": "ng serve",
    "build": "ng build",
    "test": "ng test",
    "lint": "ng lint"
  }
}
```

---

## ⚠️ Troubleshooting

### ❌ Errore: "Command not found: ng"
**Soluzione**:
```bash
# Reinstalla Angular CLI globalmente
npm install -g @angular/cli@18

# Oppure esegui comandi con npx
npx ng serve
```

### ❌ Errore: "Port 4200 already in use"
**Soluzione**:
```bash
# Usa un port diverso
ng serve --port 4201

# Oppure chiudi l'applicazione che usa il port 4200
# (su Windows, usa: netstat -ano | findstr :4200)
```

### ❌ Errore: "EACCES permission denied"
**Soluzione** (Mac/Linux):
```bash
sudo npm install
```

### ❌ Immagini non caricate
**Soluzione**:
1. Verifica che le immagini siano in `src/assets/images/`
2. Controlla il browser console per errori 404
3. Verifica che i path siano corretti (case-sensitive su Linux)

---

## 🎨 Cambiare Tema/Stili

I file CSS sono:
- **Global**: `src/styles.css`
- **Component**: Ogni componente ha il suo `.css`

Per modificare colori globali:
```css
/* src/styles.css */
:root {
  --primary-color: #2c5aa0;
  --dark-color: #27384a;
}
```

---

## 🏗️ Build per Production

Quando pronto per il deploy:

```bash
# Build ottimizzato
ng build --configuration production

# Output generato in: dist/app_angular/browser/
```

File generati:
- `index.html` - Main HTML
- `main.[hash].js` - JavaScript principal
- `styles.[hash].css` - CSS compilato
- Assets - Immagini, dati json

---

## 📦 Deploy Opzioni

### Deploy su GitHub Pages
```bash
npm install -g angular-cli-ghpages

ng build --base-href="/pwm_es1/"
ngh --dir=dist/app_angular/browser
```

### Deploy su Vercel
```bash
npm install -g vercel
vercel
```

### Deploy su Netlify
1. Trascinare la cartella `dist/app_angular/browser/`
2. O collegare il repository GitHub

---

## 🧹 Comandi Utili

```bash
# Avviare dev server
npm start

# Build per production
npm run build

# Eseguire tests
npm test

# Build con analisi bundling
ng build --configuration production --stats-json

# Servire il build production localmente
npx http-server dist/app_angular/browser/
```

---

## 💡 Suggerimenti

1. **Mantieni DevTools aperto** (F12) durante development
2. **Usa VS Code** con estensioni:
   - Angular Language Service
   - Prettier
   - ESLint
3. **Riavvia** dev server se ci sono errori strani
4. **Verifica** Node.js versione se hai problemi

---

## 📚 Documentazione

Per approfondire:
- **Architettura**: Vedi `PROJECT_SUMMARY.md`
- **Migrazione**: Vedi `MIGRATION_GUIDE.md`
- **Features**: Vedi `README_MIGRATION.md`
- **Codice**: Consulta i commenti nei file TypeScript

---

## ✅ Checklist Finale

- [ ] Node.js 18+ installato
- [ ] npm install eseguito
- [ ] npm start funzionante
- [ ] Browser aperto a localhost:4200
- [ ] Home page caricata
- [ ] Menu di navigazione visibile
- [ ] Immagini caricate
- [ ] Responsive design funzionante

---

## 🎉 Pronto!

Se tutto è caricato correttamente, sei pronto per:
1. ✅ Sviluppare nuove features
2. ✅ Modificare componenti
3. ✅ Integrare il backend
4. ✅ Deploy in produzione

---

## 📞 Supporto Rapido

| Problema | Soluzione |
|----------|-----------|
| Porta occupata | `ng serve --port 4201` |
| Immagini mancanti | Verifica `src/assets/images/` |
| Errore dipendenze | `rm -rf node_modules package-lock.json && npm install` |
| Hot reload non funziona | Riavvia dev server |
| CSS non applica | Controllo cache browser (Ctrl+Shift+R) |

---

**Status**: ✅ Pronto per lo sviluppo!

Happy Coding! 🚀
