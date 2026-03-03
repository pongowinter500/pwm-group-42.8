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
    let current = location.pathname.split('/').pop();
    if (!current) current = 'index.html';

    // clean previous active states
    document.querySelectorAll('nav ul li a').forEach(a => a.classList.remove('active'));

    // try exact filename match
    let matched = false;
    document.querySelectorAll('nav ul li a').forEach(a => {
        const href = a.getAttribute('href') || '';
        const target = href.split('/').pop() || '';
        if (target === current) {
            a.classList.add('active');
            matched = true;
        }
    });

    // fallback: if no exact match (e.g. root paths), try index link
    if (!matched && (current === '' || current === 'index.html')) {
        const idx = document.querySelector('nav ul li a[href="index.html"], nav ul li a[href="./index.html"]');
        if (idx) idx.classList.add('active');
    }
}

// Carica i moduli quando il DOM è pronto e inizializza tutta la logica
document.addEventListener('DOMContentLoaded', async () => {
    await loadHTMLModules();
    if (typeof populateCourseData === 'function') {
        try { populateCourseData(); } catch (e) { console.warn('populateCourseData error:', e); }
    }
    markActiveNav();

    // Emetti un evento custom per notificare che i moduli sono stati caricati
    window.dispatchEvent(new CustomEvent('modulesLoaded'));

    // Se siamo sulla pagina di login, colleghiamo il form
    const authForm = document.getElementById('auth-form');
    if (authForm) {
        authForm.addEventListener('submit', handleLogin);
    }

    // Verifichiamo se l'utente è già autenticato e mostriamo l'eventuale banner
    checkAuthStatus();
});

/**
 * Gestionează procesul de autentificare și validare
 */
async function handleLogin(event) {
    event.preventDefault(); // Oprește trimiterea standard a formularului

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Preleviamo i dati degli utenti dal file JSON (simuliamo un server).
        // Il percorso è diverso se ci troviamo dentro la cartella html/.
        const dataPath = location.pathname.includes('/html/') ?
            '../data/users.json' :
            'data/users.json';
        const response = await fetch(dataPath);
        const data = await response.json();

        // Căutăm utilizatorul în listă
        const user = data.users.find(u => u.email === email && u.password === password);

        if (user) {
            // Conserviamo lo stato di autenticazione
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userRole', user.role);
            localStorage.setItem('userEmail', user.email);

            alert(`Autenticazione riuscita! Bentornato, ${user.role}.`);
            window.location.href = 'index.html'; // rimandiamo alla home
        } else {
            alert("Email o password non validi.");
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
        // Modifichiamo il link di login in logout
        const loginLink = document.querySelector('a[href="html/login.html"]');
        if (loginLink) {
            loginLink.textContent = "Logout";
            loginLink.href = "#";
            loginLink.onclick = () => {
                localStorage.clear();
                window.location.reload();
            };
        }

        // Banner di notifica permanente in alto
        const statusMsg = document.createElement('div');
        let bannerStyle = "color: white; text-align: center; padding: 10px;";
        if (role === 'admin') {
            bannerStyle = "background: #e74c3c;" + bannerStyle;
            statusMsg.textContent = "Accesso amministratore attivo";
        } else {
            bannerStyle = "background: #2ecc71;" + bannerStyle;
            statusMsg.textContent = `Connesso come ${role}`;
        }
        statusMsg.style.cssText = bannerStyle;
        document.body.prepend(statusMsg);
    }
}


