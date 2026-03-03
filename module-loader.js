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

/**
 * Gestionează procesul de autentificare și validare
 */
async function handleLogin(event) {
    event.preventDefault(); // Oprește trimiterea standard a formularului

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Preluăm datele din fișierul JSON (simulăm un server)
        const response = await fetch('data/users.json');
        const data = await response.json();

        // Căutăm utilizatorul în listă
        const user = data.users.find(u => u.email === email && u.password === password);

        if (user) {
            // Salvăm sesiunea în localStorage
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userRole', user.role);
            localStorage.setItem('userEmail', user.email);

            alert(`Autentificare reușită! Bine ai venit, ${user.role}.`);
            window.location.href = 'index.html'; // Redirecționare
        } else {
            alert("Email sau parolă incorectă.");
        }
    } catch (error) {
        console.error("Eroare la încărcarea bazei de date de utilizatori:", error);
    }
}

/**
 * Modifică interfața în funcție de rolul utilizatorului
 */
function checkAuthStatus() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const role = localStorage.getItem('userRole');

    if (isAuthenticated) {
        // Schimbăm butonul de Login în Logout în header
        const loginLink = document.querySelector('a[href="html/login.html"]');
        if (loginLink) {
            loginLink.textContent = "Logout";
            loginLink.href = "#";
            loginLink.onclick = () => {
                localStorage.clear();
                window.location.reload();
            };
        }

        // Afișăm conținut specific dacă este Admin
        if (role === 'admin') {
            const adminMsg = document.createElement('div');
            adminMsg.style.cssText = "background: #e74c3c; color: white; text-align: center; padding: 10px;";
            adminMsg.textContent = "Panou Administrare: Acces Complet Activat";
            document.body.prepend(adminMsg);
        }
    }
}

// Actualizăm event listener-ul existent din module-loader.js
document.addEventListener('DOMContentLoaded', async () => {
    await loadHTMLModules();
    populateCourseData();
    markActiveNav();

    // Inițializăm logica de login dacă suntem pe pagina de login
    const authForm = document.getElementById('auth-form');
    if (authForm) {
        authForm.addEventListener('submit', handleLogin);
    }

    checkAuthStatus();
});

