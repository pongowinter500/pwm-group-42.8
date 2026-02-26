/**
 * Populates the course template data-attributes with specific data
 */
function populateCourseData() {
    if (typeof courseData === 'undefined') return;
    
    const courseHeroSection = document.querySelector('.course-hero');
    if (courseHeroSection && courseData.courseName) {
        courseHeroSection.setAttribute('data-course', courseData.courseName);
    }
    
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
    
    const topicsList = document.querySelector('[data-topics-list]');
    if (topicsList && courseData.topics) {
        topicsList.innerHTML = courseData.topics.map(topic => `<li>${topic}</li>`).join('');
    }
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
                
                const temp = document.createElement('div');
                temp.innerHTML = content;
                
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

// highlight current nav item based on URL
function markActiveNav() {
    const current = location.pathname.split('/').pop();
    if (!current) return;

    document.querySelectorAll('nav ul li a').forEach(a => {
        const target = a.getAttribute('href').split('/').pop();
        if (target === current) a.classList.add('active');
    });
}

// Carica i moduli e popola i dati dei corsi quando il DOM è pronto
document.addEventListener('DOMContentLoaded', async () => {
    await loadHTMLModules();
    populateCourseData();
    markActiveNav();
});

