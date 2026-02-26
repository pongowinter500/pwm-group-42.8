# WebMaster

Piattaforma online per corsi di informatica sviluppata dal **Gruppo 42.8**.

## Team
- **Alberto Federici**
- **Andrea Pedrini**
- **Daniel Radoi**

## Descrizione
WebMaster è una piattaforma web interattiva che offre corsi di informatica in diverse aree tecnologiche. Il progetto presenta un'interfaccia moderna e responsive con un'architettura modulare.

## Struttura del Progetto

### Pagine Principali
- **`index.html`** - Implementa Landing page
- **`about.html`** - Implementa about/business page
- **`business.html`** - Implementa about/business page
- **`login.html`** - Implementa login page

### Pagine Corsi (Course Details)
I dettagli dei corsi sono ora raccolti nella cartella `html/courses/`.
- **`html/courses/ml.html`** - Machine Learning Bootcamp
- **`html/courses/cybersecurity.html`** - Cybersecurity Fundamentals
- **`html/courses/cloud.html`** - Cloud Computing
- **`html/courses/fullstack.html`** - Full-Stack Development
- **`html/courses/python.html`** - Python per Principianti
- **`html/courses/database.html`** - Database Design e SQL
- **`html/courses/devops.html`** - DevOps e Docker

### Moduli HTML (codice che viene usato solo dalla landing page, diviso per chiarezza)
- **`new_courses.html`** - Sezione nuovi corsi con slider
- **`catalougue.html`** - Catalogo completo dei corsi

### Template HTML
I file HTML modulari sono ora raggruppati all'interno della cartella `html/templates/`.
- **`html/templates/header.html`** - Intestazione e navigazione
- **`html/templates/footer.html`** - Footer del sito
- **`html/templates/course-template.html`** - Template standardizzato per pagine di dettaglio corsi

### Risorse
- **`figma_mockups/`** - Mockup di design del progetto in formato pdf e in formato png 
- **`css/`** - Fogli di stile modulari
- **`images/`** - Risorse grafiche

## Funzionalità

**Interfaccia Utente**
- Design moderno e professionale
- Layout responsive per dispositivi mobili e desktop
- Navigazione sticky con effetti hover
- Barra di ricerca

**Catalogo Corsi**
- Visualizzazione corsi in formato slider
- Pagine di dettaglio per ogni corso
- Informazioni su docenti e programma

**Architettura Modulare**
- Componenti HTML riutilizzabili (header, footer)
- CSS modulare per facile manutenibilità
- Sistema di caricamento dinamico dei moduli
- Temi personalizzati per ogni corso

**Sistema di Accesso**
- Pagina di login dedicata
- Sezione Business per aziende

## Tecnologie Utilizzate
- HTML5
- CSS3 (architettura modulare)
- JavaScript (caricamento dinamico componenti)

## Come Iniziare
Aprire `index.html` nel browser per accedere alla landing page della piattaforma. 
