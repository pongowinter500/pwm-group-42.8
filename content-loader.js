/**
 * Content Loader - Carica dinamicamente i contenuti da content.json
 * Lavora insieme a module-loader.js per popolare elementi HTML con dati dal JSON
 */

// Cache per i dati caricati
let contentData = null;
let isAdminEditMode = false;

// Mappa per i nomi dei file che non corrispondono al courseName
const COURSE_FILE_NAME_MAP = {
    'cyber': 'cybersecurity'
};

const DEFAULT_ADMIN_EDITABLE_SELECTORS = [
    '[data-course-title]',
    '[data-course-subtitle]',
    '[data-course-instructor-name]',
    '[data-course-instructor-title]',
    '[data-course-section1-text]',
    '[data-course-topics] li'
];

/**
 * Legge dal JSON i selettori modificabili per admin.
 * Se non presenti o non validi, usa il fallback locale.
 */
function getAdminEditableSelectors() {
    const selectors = contentData?.frontendConfig?.adminEditableSelectors;

    if (Array.isArray(selectors) && selectors.length > 0) {
        return selectors;
    }

    return DEFAULT_ADMIN_EDITABLE_SELECTORS;
}

/**
 * Carica il file content.json
 */
async function loadContentData() {
    if (contentData) return contentData;
    
    try {
        const response = await fetch('data/content.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        contentData = await response.json();
        return contentData;
    } catch (error) {
        console.error('Errore nel caricamento di content.json:', error);
        return null;
    }
}

/**
 * Trova un corso per nome o ID
 */
function getCourse(identifier) {
    if (!contentData || !contentData.courses) return null;
    
    if (typeof identifier === 'number') {
        return contentData.courses.find(c => c.id === identifier);
    }
    return contentData.courses.find(c => c.courseName === identifier);
}

/**
 * Trova un istruttore per ID
 */
function getInstructor(instructorId) {
    if (!contentData || !contentData.instructors) return null;
    return contentData.instructors.find(i => i.id === instructorId);
}

/**
 * Popola gli elementi con attributo data-content-type
 * Esempi:
 * - data-content-type="about.hero.title"
 * - data-content-type="business.hero.description"
 * - data-content-type="siteInfo.name"
 */
function populateContentElements() {
    if (!contentData) return;
    
    const elements = document.querySelectorAll('[data-content-type]');
    
    elements.forEach(element => {
        const path = element.getAttribute('data-content-type');
        const value = getNestedValue(contentData, path);
        
        if (value !== undefined && value !== null) {
            if (element.tagName === 'IMG') {
                element.src = value;
                element.alt = element.alt || value;
            } else if (element.tagName === 'A' && path.includes('Email')) {
                element.href = `mailto:${value}`;
                element.textContent = value;
            } else {
                element.textContent = value;
            }
        }
    });
}

/**
 * Ottiene un valore da un oggetto usando un path con notazione dot
 * Es: "about.hero.title" -> contentData.about.hero.title
 */
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Popola i corsi nella pagina catalogue o new_courses
 * Cerca elementi con data-course-list="all" o data-course-list="new"
 */
function populateCourseList() {
    if (!contentData || !contentData.courses) {
        console.error('contentData o courses non trovati');
        return;
    }
    
    const courseListContainers = document.querySelectorAll('[data-course-list]');
    
    courseListContainers.forEach(container => {
        const listType = container.getAttribute('data-course-list');
        
        // Verifica se i corsi sono già stati caricati
        if (container.dataset.loaded === 'true') {
            return;
        }
        
        let coursesToShow = contentData.courses;
        
        // Filtra solo i corsi nuovi se richiesto
        if (listType === 'new') {
            coursesToShow = contentData.courses.filter(c => c.isNew === true);
            
            // Layout per new courses (card con icone)
            const coursesHTML = coursesToShow.map((course, index) => {
                const fileName = COURSE_FILE_NAME_MAP[course.courseName] || course.courseName;
                const isFirst = index === 0 ? ' class="active"' : '';
                return `
                <article${isFirst}>
                    <p>${course.description || course.courseSubtitle}</p>
                    <h2><img src="${course.icon}" alt="${course.courseTitle}" class="course-icon"> ${course.courseTitle}</h2>
                    <a href="html/courses/${fileName}.html">View Course</a>
                </article>
            `;
            }).join('');
            
            // Se container è una section, aggiungi dopo l'h1
            if (container.tagName === 'SECTION') {
                const title = container.querySelector('h1');
                if (title) {
                    title.insertAdjacentHTML('afterend', coursesHTML);
                    
                    // Aggiungi logica carousel per le frecce su mobile
                    const section = container;
                    const articles = section.querySelectorAll('[data-course-list="new"] article');
                    const prevBtn = section.querySelector('.slider-btn--prev');
                    const nextBtn = section.querySelector('.slider-btn--next');
                    let currentIndex = 0;
                    
                    if (articles.length > 1 && prevBtn && nextBtn) {
                        const showCourse = (index) => {
                            articles.forEach((article, idx) => {
                                article.classList.remove('active');
                                if (idx === index) {
                                    article.classList.add('active');
                                }
                            });
                        };
                        
                        prevBtn.addEventListener('click', () => {
                            currentIndex = (currentIndex - 1 + articles.length) % articles.length;
                            showCourse(currentIndex);
                        });
                        
                        nextBtn.addEventListener('click', () => {
                            currentIndex = (currentIndex + 1) % articles.length;
                            showCourse(currentIndex);
                        });
                    }
                }
            } else {
                container.innerHTML = coursesHTML;
            }
            
        } else {
            // Per il catalogo, mostra solo i corsi che NON sono nuovi
            coursesToShow = contentData.courses.filter(c => c.isNew !== true);
            
            // Layout per catalogue (immagine sempre in alto)
            const coursesHTML = coursesToShow.map((course, index) => {
                const fileName = COURSE_FILE_NAME_MAP[course.courseName] || course.courseName;
                const imgElement = `<img src="${course.instructorImg}" alt="${course.instructorName}">`;
                const contentElement = `
                    <div>
                        <h2>${course.courseTitle}</h2>
                        <h3>${course.instructorName}</h3>
                        <p class="section1-text">${course.section1Text || ''}</p>
                        <p data-catalogue-description>${course.catalogueDescription || course.section1Text}</p>
                        <a href="html/courses/${fileName}.html">Learn More</a>
                    </div>
                `;
                
                // Immagine sempre in alto su mobile e tablet
                return `<article>${imgElement + contentElement}</article>`;
            }).join('');
            
            // Se container è una section, aggiungi dopo l'h1
            if (container.tagName === 'SECTION') {
                const title = container.querySelector('h1');
                if (title) {
                    title.insertAdjacentHTML('afterend', coursesHTML);
                }
            } else {
                container.innerHTML = coursesHTML;
            }
        }
        
        // Marca il container come caricato
        container.dataset.loaded = 'true';
    });
}

/**
 * Popola le feature nella pagina business
 * Cerca elementi con data-features-list
 */
function populateBusinessFeatures() {
    if (!contentData || !contentData.business || !contentData.business.features) return;
    
    const featuresContainer = document.querySelector('[data-features-list]');
    if (!featuresContainer) return;
    
    const featuresHTML = contentData.business.features.map(feature => `
        <div class="feature-card">
            <h3>${feature.title}</h3>
            <p>${feature.description}</p>
        </div>
    `).join('');
    
    featuresContainer.innerHTML = featuresHTML;
}

/**
 * Popola i dettagli del corso per le pagine individuali dei corsi
 * Usa il nome del corso dall'URL o da un attributo data-course
 */
function populateCourseDetails() {
    if (!contentData) return;
    
    // Cerca il data-course attribute nell'hero section o nel body
    const courseHero = document.querySelector('[data-course]');
    if (!courseHero) return;
    
    let courseName = courseHero.getAttribute('data-course');
    
    // Se data-course è vuoto, prova a estrarre il nome del corso dall'URL
    if (!courseName) {
        const path = window.location.pathname;
        const match = path.match(/\/courses\/([^/.]+)\.html/);
        if (match) {
            courseName = match[1] === 'cybersecurity' ? 'cyber' : match[1];
            courseHero.setAttribute('data-course', courseName);
        }
    }
    
    const course = getCourse(courseName);
    
    if (!course) {
        console.warn(`Corso non trovato: ${courseName}`);
        return;
    }
    
    // Popola tutti gli elementi con data-course-field
    const fieldMap = {
        'title': 'courseTitle',
        'subtitle': 'courseSubtitle',
        'instructor-img': 'instructorImg',
        'instructor-name': 'instructorName',
        'instructor-title': 'instructorTitle',
        'section1-text': 'section1Text'
    };
    
    Object.entries(fieldMap).forEach(([dataAttr, fieldName]) => {
        const element = document.querySelector(`[data-course-${dataAttr}]`);
        if (element && course[fieldName]) {
            if (dataAttr === 'instructor-img') {
                element.src = course[fieldName];
            } else if (dataAttr === 'price') {
                element.textContent = `€${course[fieldName]}`;
            } else {
                element.textContent = course[fieldName];
            }
        }
    });
    
    // Popola i topics se presenti
    const topicsList = document.querySelector('[data-course-topics]');
    if (topicsList && course.topics) {
        const topicsHTML = course.topics.map(topic => `<li>${topic}</li>`).join('');
        topicsList.innerHTML = topicsHTML;
    }
    
    // Popola la catalogueDescription se presente
    const descriptionElement = document.querySelector('[data-catalogue-description]');
    if (descriptionElement && course.catalogueDescription) {
        descriptionElement.textContent = course.catalogueDescription;
    }
}

/**
 * Popola gli istruttori
 */
function populateInstructors() {
    if (!contentData || !contentData.instructors) return;
    
    const instructorsContainer = document.querySelector('[data-instructors-list]');
    if (!instructorsContainer) return;
    
    const instructorsHTML = contentData.instructors.map(instructor => `
        <div class="instructor-card">
            <img src="${instructor.image}" alt="${instructor.name}">
            <h3>${instructor.name}</h3>
            <p class="title">${instructor.title}</p>
            <p class="bio">${instructor.bio}</p>
            <div class="specializations">
                ${instructor.specialization.map(spec => `<span class="tag">${spec}</span>`).join('')}
            </div>
        </div>
    `).join('');
    
    instructorsContainer.innerHTML = instructorsHTML;
}

/**
 * Modifica il pulsante "Enroll Now" in "Modify Course" per gli admin
 */
function updateEnrollButtonForAdmin() {
    const isAdmin = localStorage.getItem('userRole') === 'admin';
    
    if (isAdmin) {
        const enrollButton = document.querySelector('.btn-enroll');
        if (enrollButton) {
            enrollButton.textContent = 'Edit Course';
            enrollButton.href = '#edit-course';
            if (enrollButton.dataset.adminEditBound !== 'true') {
                enrollButton.addEventListener('click', handleAdminEditButtonClick);
                enrollButton.dataset.adminEditBound = 'true';
            }
        }
    }
}

/**
 * Ritorna gli elementi testuali modificabili nella pagina corso.
 */
function getAdminEditableElements() {
    const selectors = getAdminEditableSelectors();

    return selectors.flatMap(selector =>
        Array.from(document.querySelectorAll(selector))
    );
}

/**
 * Attiva/disattiva la modalita di modifica inline per gli admin.
 * Solo frontend: modifica il DOM in memoria, senza scrivere su JSON.
 */
function toggleAdminEditMode(enable) {
    const courseContent = document.querySelector('.course-content');
    const editableElements = getAdminEditableElements();

    editableElements.forEach(element => {
        element.contentEditable = enable ? 'true' : 'false';
        element.classList.toggle('admin-editable-field', enable);
        element.setAttribute('spellcheck', 'false');
    });

    if (courseContent) {
        courseContent.classList.toggle('admin-edit-mode', enable);
    }

    isAdminEditMode = enable;
}

/**
 * Gestisce il click del bottone corso in modalita admin.
 */
function handleAdminEditButtonClick(event) {
    event.preventDefault();

    const button = event.currentTarget;
    if (!button) return;

    const shouldEnableEdit = !isAdminEditMode;
    toggleAdminEditMode(shouldEnableEdit);

    button.textContent = shouldEnableEdit ? 'Save Changes' : 'Edit Course';
    button.href = shouldEnableEdit ? '#save-course' : '#edit-course';
}

/**
 * Funzione principale che carica e popola tutti i contenuti
 */
async function initContentLoader() {
    // Carica i dati
    await loadContentData();
    
    if (!contentData) {
        console.error('Impossibile caricare i dati del contenuto');
        return;
    }
    
    // Popola i vari tipi di contenuto presenti nella pagina
    populateContentElements();
    populateCourseList();
    populateCourseDetails();
    populateBusinessFeatures();
    populateInstructors();
    
    // Aggiorna il pulsante Enroll per gli admin
    updateEnrollButtonForAdmin();
    
    // Reinizializza lo slider dei nuovi corsi dopo che i corsi sono stati caricati
    // Reset lo stato UIState per permettere la reinizializzazione
    if (typeof UIState !== 'undefined' && UIState.initialized) {
        UIState.initialized.delete('slider');
    }
    
    if (typeof initNewCoursesSlider === 'function') {
        initNewCoursesSlider();
    }
}

// Inizializza il content loader dopo che i moduli HTML sono stati caricati
// Ascolta l'evento 'modulesLoaded' emesso da module-loader.js
window.addEventListener('modulesLoaded', initContentLoader);

// Se i moduli sono già stati caricati (pagine senza module-loader), inizializza subito
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Aspetta un tick per dare tempo a module-loader di emetterne l'evento
        setTimeout(() => {
            if (!contentData) initContentLoader();
        }, 100);
    });
} else {
    // Se il DOM è già pronto e non ci sono moduli da caricare
    setTimeout(() => {
        if (!contentData) initContentLoader();
    }, 100);
}

// Esporta le funzioni per uso esterno se necessario
if (typeof window !== 'undefined') {
    window.contentLoader = {
        loadContentData,
        getCourse,
        getInstructor,
        initContentLoader,
        populateContentElements,
        populateCourseList,
        populateCourseDetails,
        updateEnrollButtonForAdmin,
        toggleAdminEditMode
    };
}
