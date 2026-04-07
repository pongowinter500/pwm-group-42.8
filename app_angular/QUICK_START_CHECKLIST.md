# ⚡ QUICK START CHECKLIST - CodeMaster Angular

La tua checklist per iniziare subito in 10 minuti!

---

## ✅ PRE-REQUISITI (2 min)

- [ ] Node.js 18+ installato
  - Verifica: `node --version`
- [ ] npm 9+ installato
  - Verifica: `npm --version`
- [ ] Git (opzionale)
- [ ] VS Code o editor a scelta

---

## 🚀 SETUP (3 min)

### Step 1: Aprire Terminal/PowerShell
```bash
# Windows PowerShell / MacOS Terminal / Linux bash
```

### Step 2: Navigare al progetto
```bash
cd c:\AltriProgrammi\pwm_es1\app_angular
# oppure su Mac/Linux
cd ~/AltriProgrammi/pwm_es1/app_angular
```

### Step 3: Installare dipendenze [CLICK E ASPETTA]
```bash
npm install
# Aspetta 2-3 minuti...
# ✅ Done: "added XXX packages"
```

### Step 4: Avviare dev server [CLICK]
```bash
npm start
# oppure
ng serve
```

**Output atteso:**
```
✔ Compiled successfully.
Local:        http://localhost:4200/
external:     http://x.x.x.x:4200/
Watch mode enabled...
```

---

## 🌐 BROWSER (1 min)

### Step 5: Apri Browser
- [ ] Apri **Chrome**, **Firefox**, o **Safari**
- [ ] Vai a **http://localhost:4200**
- [ ] Attendi il caricamento (5-10 sec)

### Step 6: Verifica Home Page
- [ ] Vedi il **logo** nel header
- [ ] Vedi il **menu di navigazione**
- [ ] Vedi il **slider di corsi**
- [ ] Vedi i **corsi nel catalogo**
- [ ] Vedi il **footer**

---

## ✨ TEST VELOCE (3 min)

### Test 1: Navigazione
- [ ] Clicca **"About"** → Pagina caricata ✅
- [ ] Clicca **"For Business"** → Pagina caricata ✅
- [ ] Clicca **"Home"** → Torna a home ✅

### Test 2: Corsi
- [ ] Clicca su un **corso** → Detail page aperta ✅
- [ ] Vedi i **dettagli del corso** ✅
- [ ] Clicca "← Back" → Torna a home ✅

### Test 3: Login
- [ ] Clicca **"Login"** nel menu ✅
- [ ] Inserisci email: `test@example.com` ✅
- [ ] Inserisci password: `password123` (min 6 char) ✅
- [ ] Clicca **"Login"** button ✅
- [ ] Vedi **"Logout"** nel menu ✅

### Test 4: Responsive (Mobile View)
- [ ] Premi **F12** (DevTools)
- [ ] Premi **Ctrl+Shift+M** (Toggle device)
- [ ] Seleziona **iPhone 12** ✅
- [ ] Menu diventa **hamburger** ✅
- [ ] Clicca hamburger → Menu apre ✅
- [ ] Clicca link → Menu chiude ✅

### Test 5: Console Errors
- [ ] Premi **Ctrl+Shift+J** (Console)
- [ ] Dovrebbe essere **PULITA** (no red errors) ✅

---

## 📝 VERIFICA FINALE

Se tutto è ✅, sei pronto!

**Checklist di verifica:**
- [x] npm install completato
- [x] npm start funzionante
- [x] Browser carica http://localhost:4200
- [x] Home page visualizzata
- [x] Menu di navigazione presente
- [x] Immagini caricate
- [x] Navigazione tra pagine OK
- [x] Login form funziona
- [x] Responsive design funziona
- [x] Console browser pulita

---

## 🎯 PROSSIMI STEP

### Opzione A: Esplora il Codice (10 min)
1. Apri VS Code: `code .`
2. Naviga a `src/app/pages/home/home.component.ts`
3. Leggi i commenti nel codice
4. Capisci la struttura

### Opzione B: Leggi la Documentazione (15 min)
1. Apri [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)
2. Capisci l'architettura
3. Conosci i componenti

### Opzione C: Modifica Qualcosa (10 min)
1. Apri `src/styles.css`
2. Cambia un colore
3. Salva e vedi il cambio live!

### Opzione D: Leggi SETUP.md (5 min)
1. Apri [SETUP.md](./SETUP.md)
2. Approfondisci i comandi
3. Scopri troubleshooting

---

## 🆘 PROBLEMI COMUNI

| Problema | Soluzione Rapida |
|----------|-----------------|
| Porta 4200 occupata | `ng serve --port 4201` |
| npm install lento | Aspetta, è normale (2-3 min) |
| Immagini non caricate | Ricarica pagina (Ctrl+Shift+R) |
| Errori in console | Vedi [SETUP.md Troubleshooting](./SETUP.md#troubleshooting) |
| Angular cli not found | `npm install -g @angular/cli@18` |

---

## 💾 COMANDI ESSENZIALI

```bash
# Avviare dev server
npm start
# oppure
ng serve

# Stoppare dev server
Ctrl+C

# Build per production
npm run build
# oppure
ng build --configuration production

# Eseguire tests
npm test

# Installare package nuovo
npm install nome-pacchetto
```

---

## 📂 FILE IMPORTANTI DA SAPERE

```
app_angular/
├── 📍 INDEX.md                      ← Indice documentazione
├── 📍 SETUP.md                      ← Setup dettagliato
├── 📍 PROJECT_SUMMARY.md            ← Architettura
├── 📍 package.json                  ← Dipendenze (non modificare!)
├── src/
│   ├── app/
│   │   ├── 📍 app.ts               ← Root component
│   │   ├── 📍 app.routes.ts        ← Routing
│   │   └── pages/home/
│   │       └── 📍 home.component.ts ← Home page
│   └── 📍 styles.css               ← Stili globali
└── angular.json                     ← Configurazione Angular
```

---

## 🎓 Vuoi Imparare Di Più?

After setup:
1. **Per Angular basics**: https://angular.dev
2. **Per TypeScript**: https://typescriptlang.org
3. **Per RxJS**: https://rxjs.dev

---

## ✅ HOW TO PROCEED

### Opzione 1: Rapid Fire (Se vuoi iniziare subito)
```
1. npm install
2. npm start
3. http://localhost:4200
4. Inizia a esplorare!
```

### Opzione 2: Structured Learning (Se vuoi capire tutto)
```
1. Leggi SETUP.md (5 min)
2. npm install & npm start (3 min)
3. Esplora interfaccia (5 min)
4. Leggi PROJECT_SUMMARY.md (15 min)
5. Esamina il codice (20 min)
```

### Opzione 3: Hands-On Development (Se sei già bravo)
```
1. npm install
2. npm start
3. Apri VS Code
4. Modifica un componente
5. Vedi i cambiamenti live!
```

---

## 🎯 GOAL RAGGIUNTO

```
       ___
      / _ \
     / /_\ \____
    / \___/\/___\
   / / \__      \
  /__/   /\____/
        /\ /\
       /  V  \
      /______\

✅ Setup Completato!
✅ App è Online!
✅ Sei Pronto per Sviluppare!

Happy Coding! 🚀

```

---

**Tempo Totale: ~10 minuti**  
**Difficoltà: ⭐ Molto Facile**  
**Status**: ✅ Pronto!

---

### 📞 STILL STUCK?

- Guarda [SETUP.md Troubleshooting](./SETUP.md#troubleshooting)
- Consulta [README_MIGRATION.md FAQ](./README_MIGRATION.md#faq-rapido)
- Controlla Google con l'errore
- Chiedi nel team

---

**Last Update**: 2026-04-07  
**Status**: Ready to Go! 🚀
