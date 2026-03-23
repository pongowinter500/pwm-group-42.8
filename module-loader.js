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
    document.querySelectorAll('header nav ul li a').forEach(a => a.classList.remove('active'));

    // try exact filename match
    let matched = false;
    document.querySelectorAll('header nav ul li a').forEach(a => {
        const href = a.getAttribute('href') || '';
        const target = href.split('/').pop() || '';
        if (target === current) {
            a.classList.add('active');
            matched = true;
        }
    });

    // fallback: if no exact match (e.g. root paths), try index link
    if (!matched && (current === '' || current === 'index.html')) {
        const idx = document.querySelector('header nav ul li a[href="index.html"], header nav ul li a[href="./index.html"]');
        if (idx) idx.classList.add('active');
    }
}

// initialize the mobile search toggle behavior
function initSearchToggle() {
    const searchToggle = document.querySelector('.search-toggle');
    const mobileSearchForm = document.querySelector('.mobile-search-form');

    if (!searchToggle || !mobileSearchForm) return;

    if (searchToggle.dataset.searchToggleInitialized === 'true') return;
    searchToggle.dataset.searchToggleInitialized = 'true';

    const setSearchState = (isOpen) => {
        searchToggle.classList.toggle('active', isOpen);
        mobileSearchForm.classList.toggle('active', isOpen);
        searchToggle.setAttribute('aria-expanded', String(isOpen));

        if (isOpen) {
            // Focus sull'input di ricerca quando viene aperto
            const searchInput = mobileSearchForm.querySelector('input[type="search"]');
            if (searchInput) {
                setTimeout(() => searchInput.focus(), 100);
            }
        }
    };

    searchToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        const isOpen = mobileSearchForm.classList.contains('active');
        setSearchState(!isOpen);
    });

    // Chiudi la ricerca quando si clicca fuori
    document.addEventListener('click', (event) => {
        if (!searchToggle.contains(event.target) && !mobileSearchForm.contains(event.target)) {
            setSearchState(false);
        }
    });

    // Chiudi con il tasto Escape
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            setSearchState(false);
        }
    });

    // Chiudi quando si ridimensiona la finestra a desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            setSearchState(false);
        }
    });
}

// initialize the mobile dropdown navigation behavior
function initMobileMenu() {
    const nav = document.querySelector('header .site-nav');
    if (!nav) return;

    const toggleButton = nav.querySelector('.menu-toggle');
    const navMenu = nav.querySelector('.nav-menu');
    if (!toggleButton || !navMenu) return;

    if (nav.dataset.mobileMenuInitialized === 'true') return;
    nav.dataset.mobileMenuInitialized = 'true';

    const setMenuState = (isOpen) => {
        nav.classList.toggle('menu-open', isOpen);
        document.body.classList.toggle('mobile-menu-open', isOpen);
        toggleButton.setAttribute('aria-expanded', String(isOpen));
        toggleButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    };

    toggleButton.addEventListener('click', (event) => {
        event.stopPropagation();
        const isOpen = nav.classList.contains('menu-open');
        setMenuState(!isOpen);
    });

    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => setMenuState(false));
    });

    document.addEventListener('click', (event) => {
        if (!nav.contains(event.target)) {
            setMenuState(false);
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            setMenuState(false);
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            setMenuState(false);
        }
    });
}

// initialize footer menu toggles for mobile
function initFooterMenus() {
    const footerNavToggles = document.querySelectorAll('footer .footer-nav-toggle');
    
    if (footerNavToggles.length === 0) return;

    footerNavToggles.forEach(toggle => {
        if (toggle.dataset.footerMenuInitialized === 'true') return;
        toggle.dataset.footerMenuInitialized = 'true';

        const setMenuState = (isOpen) => {
            toggle.setAttribute('aria-expanded', String(isOpen));
        };

        toggle.addEventListener('click', (event) => {
            event.stopPropagation();
            const isOpen = toggle.getAttribute('aria-expanded') === 'true';
            setMenuState(!isOpen);
        });
    });

    // Close menus when clicking outside
    document.addEventListener('click', (event) => {
        const footer = document.querySelector('footer');
        if (footer && !footer.contains(event.target)) {
            footerNavToggles.forEach(toggle => {
                toggle.setAttribute('aria-expanded', 'false');
            });
        }
    });

    // Close with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            footerNavToggles.forEach(toggle => {
                toggle.setAttribute('aria-expanded', 'false');
            });
        }
    });
}

// Carica i moduli quando il DOM è pronto e inizializza tutta la logica
document.addEventListener('DOMContentLoaded', async () => {
    await loadHTMLModules();
    if (typeof populateCourseData === 'function') {
        try { populateCourseData(); } catch (e) { console.warn('populateCourseData error:', e); }
    }
    markActiveNav();
    initMobileMenu();
    initSearchToggle();
    initFooterMenus();

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
 * Gestisce il processo di autenticazione con validazione HTML5 nativa
 */
async function handleLogin(event) {
    event.preventDefault();

    const form = event.target;
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');

    // Reset messaggi di errore
    emailError.textContent = '';
    passwordError.textContent = '';

    // Validazione HTML5 usando l'API Constraint Validation
    let isValid = true;

    // Valida email
    if (!emailInput.validity.valid) {
        isValid = false;
        if (emailInput.validity.valueMissing) {
            emailError.textContent = 'Email is required';
        } else if (emailInput.validity.typeMismatch || emailInput.validity.patternMismatch) {
            emailError.textContent = 'Please enter a valid email address';
        }
    }

    // Valida password
    if (!passwordInput.validity.valid) {
        isValid = false;
        if (passwordInput.validity.valueMissing) {
            passwordError.textContent = 'Password is required';
        } else if (passwordInput.validity.tooShort) {
            passwordError.textContent = `Password must be at least ${passwordInput.minLength} characters`;
        } else if (passwordInput.validity.tooLong) {
            passwordError.textContent = `Password must not exceed ${passwordInput.maxLength} characters`;
        }
    }

    // Se il form non è valido, ferma l'invio
    if (!isValid) {
        return;
    }

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        // Preleviamo i dati degli utenti dal file JSON (simuliamo un server)
        const dataPath = location.pathname.includes('/html/') ?
            '../data/users.json' :
            'data/users.json';
        const response = await fetch(dataPath);
        const data = await response.json();

        // Cerchiamo l'utente nella lista
        const user = data.users.find(u => u.email === email && u.password === password);

        if (user) {
            // Conserviamo lo stato di autenticazione
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userRole', user.role);
            localStorage.setItem('userEmail', user.email);

            alert(`Autenticazione riuscita! Bentornato, ${user.role}.`);
            window.location.href = 'index.html';
        } else {
            // Mostra errore per credenziali non valide
            emailError.textContent = 'Invalid email or password';
            passwordError.textContent = 'Invalid email or password';
        }
    } catch (error) {
        console.error("Errore nel caricamento del database utenti:", error);
        emailError.textContent = 'An error occurred. Please try again later.';
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


