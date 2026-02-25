/**
 * Popola i data-attributes del template del corso con i dati specifici
 */
function populateCourseData() {
    if (typeof courseData === 'undefined') return;
    
    // Popola l'attributo data-course per il tema colore
    const courseHeroSection = document.querySelector('.course-hero');
    if (courseHeroSection && courseData.courseName) {
        courseHeroSection.setAttribute('data-course', courseData.courseName);
    }
    
    // Popola i campi semplici
    const courseTitle = document.querySelector('[data-course-title]');
    if (courseTitle) courseTitle.textContent = courseData.courseTitle;
    
    const courseSubtitle = document.querySelector('[data-course-subtitle]');
    if (courseSubtitle) courseSubtitle.textContent = courseData.courseSubtitle;
    
    const instructorImg = document.querySelector('[data-instructor-img]');
    if (instructorImg) instructorImg.src = courseData.instructorImg;
    
    const instructorName = document.querySelector('[data-instructor-name]');
    if (instructorName) instructorName.textContent = courseData.instructorName;
    
    const instructorTitle = document.querySelector('[data-instructor-title]');
    if (instructorTitle) instructorTitle.textContent = courseData.instructorTitle;
    
    const section1Title = document.querySelector('[data-section-1-title]');
    if (section1Title) section1Title.textContent = courseData.section1Title;
    
    const section1Text = document.querySelector('[data-section-1-text]');
    if (section1Text) section1Text.textContent = courseData.section1Text;
    
    const section2Title = document.querySelector('[data-section-2-title]');
    if (section2Title) section2Title.textContent = courseData.section2Title;
    
    // Popola la lista di argomenti
    const topicsList = document.querySelector('[data-topics-list]');
    if (topicsList && courseData.topics) {
        topicsList.innerHTML = courseData.topics.map(topic => `<li>${topic}</li>`).join('');
    }
}

/**
 * Evidenzia il link di navigazione attivo sulla pagina corrente
 */
function highlightActiveNavLink() {
    // Ottiene il nome del file corrente (es: "index.html" o "about.html")
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Mappa le pagine ai loro link di navigazione
    const pageToLink = {
        'index.html': 'index.html',
        'about.html': 'about.html',
        'business.html': 'business.html',
        '': 'index.html' // Se è la radice, assume index.html
    };
    
    const linkPage = pageToLink[currentPage] || currentPage;
    
    // Trova tutti i link nei menu di navigazione
    document.querySelectorAll('nav a[href]').forEach(link => {
        const href = link.getAttribute('href');
        
        // Rimuove la classe active da tutti i link
        link.classList.remove('active');
        
        // Aggiunge la classe active al link della pagina corrente
        if (href === linkPage || href === 'index.html' && currentPage === '') {
            link.classList.add('active');
        }
    });
}

/**
 * Carica dinamicamente blocchi HTML da file esterni nella pagina
 * Usa l'attributo data-include-html per specificare il file da caricare
 */
async function loadHTMLModules() {
    const elements = document.querySelectorAll('[data-include-html]');
    
    for (const element of elements) {
        const file = element.getAttribute('data-include-html');
        
        try {
            const response = await fetch(file);
            
            if (response.ok) {
                const content = await response.text();
                
                // Crea un elemento temporaneo per il parsing
                const temp = document.createElement('div');
                temp.innerHTML = content;
                
                // Sostituisce il div wrapper con il contenuto caricato
                while (temp.firstChild) {
                    element.parentNode.insertBefore(temp.firstChild, element);
                }
                element.parentNode.removeChild(element);
            } else {
                console.error(`Errore nel caricamento di ${file}: ${response.status}`);
            }
        } catch (error) {
            console.error(`Errore nel caricamento di ${file}:`, error);
        }
    }
}

// Carica i moduli e evidenzia il link attivo quando il DOM è pronto
document.addEventListener('DOMContentLoaded', async () => {
    await loadHTMLModules();
    highlightActiveNavLink();
    populateCourseData();
});

