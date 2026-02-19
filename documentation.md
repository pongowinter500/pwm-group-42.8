# Documentazione CSS

Questa documentazione descrive la funzione di ogni file CSS utilizzato nel progetto della piattaforma di corsi online.

## Struttura dei File CSS

Il CSS è stato suddiviso in moduli separati per migliorare la manutenibilità e l'organizzazione del codice.

---

## reset.css

**Funzione:** Reset degli stili del browser

Questo file contiene gli stili di reset fondamentali che eliminano i margini e i padding predefiniti del browser e impostano il box-sizing su border-box per tutti gli elementi. Questo garantisce un comportamento coerente del layout su tutti i browser.

**Contenuto principale:**
- Azzeramento margin e padding globali
- Impostazione box-sizing: border-box per calcolo dimensioni consistente

---

## layout.css

**Funzione:** Layout generale e struttura base della pagina

Definisce gli stili per gli elementi strutturali principali del sito, come il body, il contenitore main e le sezioni generiche. Imposta la tipografia base, i colori di sfondo e il layout centrato a larghezza fissa.

**Contenuto principale:**
- Stili del body (font, colori, line-height)
- Contenitore main con larghezza massima e centratura
- Stili base delle sezioni (padding, background, bordi arrotondati, ombre)
- Stili dei titoli delle sezioni

---

## header.css

**Funzione:** Stili dell'intestazione e della barra di navigazione

Contiene tutti gli stili relativi all'header del sito, inclusa la barra di navigazione sticky, i link del menu, la barra di ricerca e il pulsante di login.

**Contenuto principale:**
- Header con posizione sticky e sfondo scuro
- Navigazione con layout flex e allineamento
- Stili per i link di navigazione con effetti hover
- Campo di ricerca con bordi arrotondati
- Pulsante Login con colore distintivo

---

## new-courses.css

**Funzione:** Stili per la sezione "New Courses"

Gestisce l'aspetto visivo della sezione dei nuovi corsi, incluso il layout tipo slider con frecce di navigazione e le card dei singoli corsi.

**Contenuto principale:**
- Layout flex per lo slider con pulsanti freccia circolari
- Card dei corsi con immagini, titoli e descrizioni
- Effetti hover sulle card (sollevamento e ombra)
- Pulsanti "View Course" con colore blu
- Stili per le frecce di navigazione sinistra/destra

---

## our-courses.css

**Funzione:** Stili per la sezione "Our Courses"

Definisce l'aspetto della sezione dei corsi principali con layout alternato (immagine-testo / testo-immagine). Ogni corso mostra l'immagine del professore, il nome del corso, il nome del professore e una descrizione dettagliata.

**Contenuto principale:**
- Layout flex per articoli con spaziatura generosa
- Immagini circolari dei professori con bordo colorato
- Stili per titoli, sottotitoli e descrizioni
- Pulsanti "Learn More" con colore verde
- Effetti hover sugli articoli (ombra più marcata)

---

## footer.css

**Funzione:** Stili del footer

Contiene tutti gli stili per il footer del sito, inclusi i link alle policy, le informazioni di contatto, il copyright e i link ai social media.

**Contenuto principale:**
- Footer con sfondo scuro e testo chiaro
- Layout flex per i link di navigazione
- Stili per l'indirizzo email con colore evidenziato
- Link ai social media con icone stilizzate
- Testo del copyright con colore tenue

---

## responsive.css

**Funzione:** Media queries per la responsività mobile

Contiene le regole CSS che adattano il layout per dispositivi con schermi più piccoli (massimo 768px di larghezza). Modifica il comportamento degli elementi per garantire una buona esperienza utente su smartphone e tablet.

**Contenuto principale:**
- Header con layout a colonna su mobile
- Barra di ricerca a larghezza piena
- Sezione New Courses con slider disabilitato (niente frecce)
- Sezione Our Courses con layout verticale invece che alternato
- Allineamento centrato per i contenuti su schermi piccoli

---

## Ordine di Importazione

I file CSS devono essere importati nel seguente ordine nell'HTML:

1. reset.css - per resettare gli stili del browser
2. layout.css - per la struttura base
3. header.css - per l'intestazione
4. new-courses.css - per la sezione nuovi corsi
5. our-courses.css - per la sezione corsi principali
6. footer.css - per il piè di pagina
7. responsive.css - per le regole responsive (deve essere ultimo)

Questo ordine garantisce che gli stili vengano applicati correttamente e che le media queries abbiano la precedenza necessaria.
