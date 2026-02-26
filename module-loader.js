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
    
    // Mappa dei data-attributes ai campi di courseData
    const fieldMap = {
        '[data-course-title]': 'courseTitle',
        '[data-course-subtitle]': 'courseSubtitle',
        '[data-instructor-img]': 'instructorImg',
        '[data-instructor-name]': 'instructorName',
        '[data-instructor-title]': 'instructorTitle',
        '[data-section-1-title]': 'section1Title',
        '[data-section-1-text]': 'section1Text',
        '[data-section-2-title]': 'section2Title'
    };
    
    // Popola i campi tramite la mappa
    Object.entries(fieldMap).forEach(([selector, fieldName]) => {
        const element = document.querySelector(selector);
        if (element && courseData[fieldName]) {
            if (selector === '[data-instructor-img]') {
                element.src = courseData[fieldName];
            } else {
                element.textContent = courseData[fieldName];
            }
        }
    });
    
    // Popola la lista di argomenti
    const topicsList = document.querySelector('[data-topics-list]');
    if (topicsList && courseData.topics) {
        topicsList.innerHTML = courseData.topics.map(topic => `<li>${topic}</li>`).join('');
    }
}

/**
 * Gestisce i link della pagina: corregge i percorsi e evidenzia il link attivo
 */
function processPageLinks() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    const isInHtmlFolder = currentPath.includes('/html/');
    const pathParts = currentPath.split('/').filter(Boolean);
    const currentPageFolderDepth = pathParts.length - 1; // -1 because last part is the filename
    
    document.querySelectorAll('a[href]').forEach(link => {
        let href = link.getAttribute('href');
        
        // Ignora link speciali (anchor, mailto, http/https)
        if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http')) {
            return;
        }
        
        // handle any link pointing to index.html: make sure it reaches the actual landing page
        if (href.endsWith('index.html')) {
            if (isInHtmlFolder) {
                // pages inside html need to go up to root
                // depth 1 (html folder): go up 1 level
                // depth 2+ (subfolders): go up appropriate levels
                const upLevels = currentPageFolderDepth;
                link.setAttribute('href', '../'.repeat(upLevels) + 'index.html');
            } else {
                link.setAttribute('href', 'index.html');
            }
            // keep normalized value for highlighting
            href = link.getAttribute('href');
        }
        
        // Normalizza il percorso per il confronto
        let hrefNormalized = href.replace(/\.\.\//g, '').replace('html/', '');
        
        // Correggi i percorsi in base alla posizione corrente
        if (isInHtmlFolder) {
            if (href.startsWith('html/')) {
                link.setAttribute('href', href.replace('html/', ''));
                href = link.getAttribute('href');
            }
            // For simple filenames: only add ../ if we're deeper than just the html folder
            if (/^[a-z-]+\.html$/.test(href) && href !== currentPage) {
                if (currentPageFolderDepth > 1) {
                    // We're in a subfolder like courses/, need to go up one level to reach html/
                    link.setAttribute('href', '../' + href);
                    href = link.getAttribute('href');
                }
            }
        } else {
            if (href.match(/^[a-z-]+\.html$/) && href !== 'index.html') {
                link.setAttribute('href', 'html/' + href);
            }
        }
        
        // Evidenzia il link della pagina attuale (solo per nav)
        if (link.closest('nav')) {
            link.classList.toggle('active', hrefNormalized === currentPage);
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

// Corregge percorso del logo in base alla profondità della pagina
function adjustHeaderLogo() {
    const logo = document.querySelector('.company-logo');
    if (!logo) return;
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    // number of directory levels before the file
    const prefix = pathParts.length > 1 ? '../'.repeat(pathParts.length - 1) : '';
    logo.src = prefix + 'images/company_icon.png';
}

// Carica i moduli e processa i link quando il DOM è pronto
document.addEventListener('DOMContentLoaded', async () => {
    await loadHTMLModules();
    processPageLinks();
    populateCourseData();
    adjustHeaderLogo();
});

