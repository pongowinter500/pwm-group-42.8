/**
 * Populates the course template data-attributes with specific data
 */
function populateCourseData() {
    if (typeof courseData === 'undefined') return;
    
    // Populate the data-course attribute for theming
    const courseHeroSection = document.querySelector('.course-hero');
    if (courseHeroSection && courseData.courseName) {
        courseHeroSection.setAttribute('data-course', courseData.courseName);
    }
    
    // Map of data-attributes to courseData fields
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
    
    // Populate fields using the map
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
    
    // Populate the list of topics
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
    const pathParts = currentPath.split('/').filter(Boolean);
    const currentPage = pathParts[pathParts.length - 1] || 'index.html';
    const currentPageFolderDepth = pathParts.length - 1; // directories before the filename
    const isInHtmlFolder = pathParts.includes('html');
    
    document.querySelectorAll('a[href]').forEach(link => {
        let href = link.getAttribute('href');
        
        // Ignora link speciali (anchor, mailto, http/https)
        if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http')) {
            return;
        }
        
        // adjust index link so it always points to the root index.html
        if (href.endsWith('index.html')) {
            // the number of ".." segments needed to climb from the current
            // location back to the project root (where index.html lives)
            // if we are already in the root folder depth will be 0 and no prefix
            const upLevels = Math.max(currentPageFolderDepth - 1, 0);
            link.setAttribute('href', '../'.repeat(upLevels) + 'index.html');
            href = link.getAttribute('href');
        }
        
        // keep a normalized version for highlighting
        let hrefNormalized = href.replace(/\.\.\//g, '').replace(/^html\//, '');
        
        // Correggi i percorsi in base alla posizione corrente
        if (isInHtmlFolder) {
            // strip any leading "html/" that might have been added when on the
            // root page; once inside the folder we don't want that prefix
            if (href.startsWith('html/')) {
                link.setAttribute('href', href.replace(/^html\//, ''));
                href = link.getAttribute('href');
            }

            // handle links to the courses subfolder specially; they should be
            // relative to the html folder itself. when we are already inside a
            // deeper subfolder (like html/courses/) we need to climb one level
            // so that the path still begins at html/
            if (href.startsWith('courses/')) {
                if (currentPageFolderDepth > 2) {
                    link.setAttribute('href', '../' + href);
                    href = link.getAttribute('href');
                }
            }

            // for simple page filenames we only prepend ".." when we are inside
            // a subfolder of html (courses/, etc). pages directly under html
            // should reference each other by name only.
            if (/^[a-z-]+\.html$/.test(href) && href !== currentPage) {
                if (currentPageFolderDepth > 2) {
                    link.setAttribute('href', '../' + href);
                    href = link.getAttribute('href');
                }
            }
        } else {
            // when on the root index we prefix links so they point into html/
            if (href.startsWith('courses/')) {
                link.setAttribute('href', 'html/' + href);
            } else if (/^[a-z-]+\.html$/.test(href) && href !== 'index.html') {
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
 * Dynamically loads HTML blocks from external files into the page
 * Uses the data-include-html attribute to specify which file to load
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

// Adjusts logo path based on page depth
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

