/* ===== CONFIGURATION ===== */

/**
 * Centralized UI selectors config
 * Update selectors in one place instead of scattered across functions
 */
const UI_SELECTORS = {
    searchToggle: '.search-toggle',
    mobileSearchForm: '.mobile-search-form',
    searchInput: '.mobile-search-form input[type="search"]',
    
    siteNav: 'header .site-nav',
    menuToggle: '.menu-toggle',
    navMenu: '.nav-menu',
    navLinks: 'header nav ul li a',
    
    coursesSlider: 'section:first-child .courses-slider',
    prevBtn: '.slider-btn--prev',
    nextBtn: '.slider-btn--next',
    courseList: '[data-course-list="new"]',
    courseArticles: '[data-course-list="new"] article',
    
    descriptionToggle: '.description-toggle',
    descriptionContent: '.description-content',
    
    footerToggle: 'footer .footer-nav-toggle',
    footerNavMenu: 'footer .footer-nav-menu',
    
    passwordToggle: '.password-toggle',
    passwordInput: '#password',
    
    authForm: '#auth-form',
    loginLink: 'a[href="html/login.html"]'
};

/**
 * Global UI State Management
 * Single source of truth for all UI states
 */
const UIState = {
    searchOpen: false,
    menuOpen: false,
    sliderIndex: 0,
    initialized: new Set(),
    
    setState: function(key, value) {
        this[key] = value;
    },
    
    isInitialized: function(id) {
        return this.initialized.has(id);
    },
    
    markInitialized: function(id) {
        this.initialized.add(id);
    }
};

/**
 * Utility: Debounce function for performance optimization
 */
function debounce(func, delay = 250) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
}

/**
 * Utility: Factory function for creating reusable toggle handlers
 */
function createToggleHandler(toggleSelector, contentSelector, options = {}) {
    const toggle = document.querySelector(toggleSelector);
    const content = document.querySelector(contentSelector);
    
    if (!toggle || !content) return null;
    
    const {
        onOpen = null,
        onClose = null,
        focusSelector = null
    } = options;
    
    let isOpen = false;
    
    const setState = (state) => {
        isOpen = state;
        toggle.classList.toggle('active', state);
        content.classList.toggle('active', state);
        toggle.setAttribute('aria-expanded', String(state));
        
        if (state && onOpen) onOpen();
        if (!state && onClose) onClose();
        
        if (state && focusSelector) {
            const focusElement = content.querySelector(focusSelector);
            if (focusElement) setTimeout(() => focusElement.focus(), 100);
        }
    };
    
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        setState(!isOpen);
    });
    
    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !content.contains(e.target)) {
            setState(false);
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setState(false);
    });
    
    return { toggle, content, setState };
}

/**
 * Centralized resize event handler
 * Prevents multiple resize listeners
 */
function initResponsiveHandlers() {
    const handleResize = debounce(() => {
        if (window.innerWidth > 768) {
            // Close all mobile UI elements when resizing to desktop
            closeAllMobileUI();
        }
    }, 250);
    
    window.addEventListener('resize', handleResize);
}

/**
 * Close all mobile UI elements
 */
function closeAllMobileUI() {
    UIState.setState('searchOpen', false);
    UIState.setState('menuOpen', false);
    
    const searchHandler = window.__uiHandlers?.search;
    const menuHandler = window.__uiHandlers?.menu;
    const footerToggles = document.querySelectorAll(UI_SELECTORS.footerToggle);
    
    if (searchHandler) searchHandler.setState(false);
    if (menuHandler) menuHandler.setState(false);
    footerToggles.forEach(toggle => toggle.setAttribute('aria-expanded', 'false'));
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
                console.error(`Error loading ${file}: ${response.status}`);
            }
        } catch (error) {
            console.error(`Error loading ${file}:`, error);
        }
    }
}

// highlight current nav item based on URL
function markActiveNav() {
    let current = location.pathname.split('/').pop();
    if (!current) current = 'index.html';

    // clean previous active states
    document.querySelectorAll(UI_SELECTORS.navLinks).forEach(a => a.classList.remove('active'));

    // try exact filename match
    let matched = false;
    document.querySelectorAll(UI_SELECTORS.navLinks).forEach(a => {
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
    if (UIState.isInitialized('search')) return;
    UIState.markInitialized('search');
    
    window.__uiHandlegitrs = window.__uiHandlers || {};
    window.__uiHandlers.search = createToggleHandler(
        UI_SELECTORS.searchToggle,
        UI_SELECTORS.mobileSearchForm,
        {
            focusSelector: UI_SELECTORS.searchInput
        }
    );
}

// initialize the mobile dropdown navigation behavior
function initMobileMenu() {
    if (UIState.isInitialized('menu')) return;
    UIState.markInitialized('menu');
    
    const nav = document.querySelector(UI_SELECTORS.siteNav);
    if (!nav) return;

    const toggleButton = nav.querySelector(UI_SELECTORS.menuToggle);
    const navMenu = nav.querySelector(UI_SELECTORS.navMenu);
    if (!toggleButton || !navMenu) return;

    let isOpen = false;
    
    window.__uiHandlers = window.__uiHandlers || {};
    window.__uiHandlers.menu = { setState: (state) => setMenuState(state) };

    const setMenuState = (state) => {
        isOpen = state;
        UIState.setState('menuOpen', state);
        nav.classList.toggle('menu-open', state);
        document.body.classList.toggle('mobile-menu-open', state);
        toggleButton.setAttribute('aria-expanded', String(state));
        toggleButton.setAttribute('aria-label', state ? 'Close menu' : 'Open menu');
    };

    toggleButton.addEventListener('click', (event) => {
        event.stopPropagation();
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
}

// initialize new courses slider for mobile
function initNewCoursesSlider() {
    if (UIState.isInitialized('slider')) return;
    UIState.markInitialized('slider');
    
    const coursesSlider = document.querySelector(UI_SELECTORS.coursesSlider);
    if (!coursesSlider) return;

    const prevBtn = coursesSlider.querySelector(UI_SELECTORS.prevBtn);
    const nextBtn = coursesSlider.querySelector(UI_SELECTORS.nextBtn);
    const courseList = coursesSlider.querySelector(UI_SELECTORS.courseList);
    
    if (!prevBtn || !nextBtn || !courseList) return;

    const articles = courseList.querySelectorAll('article');
    
    if (articles.length === 0) return;

    const showArticle = (index) => {
        UIState.setState('sliderIndex', index);
        articles.forEach((article, i) => {
            article.classList.toggle('active', i === index);
        });
    };

    // Initialize with first article active
    showArticle(0);

    prevBtn.addEventListener('click', () => {
        const newIndex = (UIState.sliderIndex - 1 + articles.length) % articles.length;
        showArticle(newIndex);
    });

    nextBtn.addEventListener('click', () => {
        const newIndex = (UIState.sliderIndex + 1) % articles.length;
        showArticle(newIndex);
    });
}

// initialize footer menu toggles for mobile
function initFooterMenus() {
    if (UIState.isInitialized('footer')) return;
    UIState.markInitialized('footer');
    
    const footerNavToggles = document.querySelectorAll(UI_SELECTORS.footerToggle);
    
    if (footerNavToggles.length === 0) return;

    footerNavToggles.forEach(toggle => {
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

// initialize course description dropdown toggle
function initDescriptionToggle() {
    if (UIState.isInitialized('description')) return;
    UIState.markInitialized('description');
    
    const descriptionToggle = document.querySelector(UI_SELECTORS.descriptionToggle);
    const descriptionContent = document.querySelector(UI_SELECTORS.descriptionContent);

    if (!descriptionToggle || !descriptionContent) return;

    let isOpen = false;
    
    const setDescriptionState = (state) => {
        isOpen = state;
        descriptionToggle.setAttribute('aria-expanded', String(state));
    };

    descriptionToggle.addEventListener('click', (event) => {
        event.preventDefault();
        setDescriptionState(!isOpen);
    });

    // Close with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && isOpen) {
            setDescriptionState(false);
        }
    });
}

// Loads modules when DOM is ready and initializes all logic
document.addEventListener('DOMContentLoaded', async () => {
    await loadHTMLModules();
    if (typeof populateCourseData === 'function') {
        try { populateCourseData(); } catch (e) { console.warn('populateCourseData error:', e); }
    }
    markActiveNav();
    initResponsiveHandlers();
    initSearchToggle();
    initMobileMenu();
    initFooterMenus();
    initNewCoursesSlider();
    initDescriptionToggle();
    initPasswordToggle();
    initLogoutTimer();

    // Dispatch custom event to notify that modules have been loaded
    window.dispatchEvent(new CustomEvent('modulesLoaded'));

    // If we are on the login page, attach the form event handler
    const authForm = document.getElementById('auth-form');
    if (authForm) {
        authForm.addEventListener('submit', handleLogin);
    }

    // Check if user is already authenticated and display the authentication banner
    checkAuthStatus();
});

/**
 * Handles the authentication process with native HTML5 validation
 */
async function handleLogin(event) {
    event.preventDefault();

    const form = event.target;
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const loginBtn = form.querySelector('.btn-login');

    // Reset error messages
    emailError.textContent = '';
    passwordError.textContent = '';
    emailInput.classList.remove('shake');
    passwordInput.classList.remove('shake');

    // HTML5 validation using Constraint Validation API
    let isValid = true;

    // Validate email
    if (!emailInput.validity.valid) {
        isValid = false;
        emailInput.classList.add('shake');
        if (emailInput.validity.valueMissing) {
            emailError.textContent = 'Email is required';
        } else if (emailInput.validity.typeMismatch || emailInput.validity.patternMismatch) {
            emailError.textContent = 'Please enter a valid email address';
        }
    }

    // Validate password
    if (!passwordInput.validity.valid) {
        isValid = false;
        passwordInput.classList.add('shake');
        if (passwordInput.validity.valueMissing) {
            passwordError.textContent = 'Password is required';
        } else if (passwordInput.validity.tooShort) {
            passwordError.textContent = `Password must be at least ${passwordInput.minLength} characters`;
        } else if (passwordInput.validity.tooLong) {
            passwordError.textContent = `Password must not exceed ${passwordInput.maxLength} characters`;
        }
    }

    // If form is invalid, stop submission
    if (!isValid) {
        return;
    }

    const email = emailInput.value;
    const password = passwordInput.value;

    // Enable loading state
    loginBtn.classList.add('loading');
    loginBtn.disabled = true;
    emailInput.disabled = true;
    passwordInput.disabled = true;

    try {
        // Fetch user data from JSON file (simulating a server)
        const dataPath = '/data/users.json';
        const response = await fetch(dataPath);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();

        // Search for user in the list
        const user = data.users.find(u => u.email === email && u.password === password);

        if (user) {
            // Store authentication state with timestamp
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userRole', user.role);
            localStorage.setItem('userEmail', user.email);
            localStorage.setItem('loginTime', Date.now().toString());

            // Clear form fields
            emailInput.value = '';
            passwordInput.value = '';

            alert(`Authentication successful! Welcome back, ${user.role}.`);
            window.location.href = 'index.html';
        } else {
            // Show error for invalid credentials with shake animation
            emailInput.classList.add('shake');
            passwordInput.classList.add('shake');
            emailError.textContent = 'Invalid email or password';
            passwordError.textContent = 'Invalid email or password';
            
            // Remove shake class after animation
            setTimeout(() => {
                emailInput.classList.remove('shake');
                passwordInput.classList.remove('shake');
            }, 500);
        }
    } catch (error) {
        console.error("Error loading user database:", error);
        emailInput.classList.add('shake');
        passwordInput.classList.add('shake');
        emailError.textContent = 'Network error. Please check your connection and try again.';
        passwordError.textContent = '';
        
        // Rimuovi shake class dopo l'animazione
        setTimeout(() => {
            emailInput.classList.remove('shake');
            passwordInput.classList.remove('shake');
        }, 500);
    } finally {
        // Disable loading state
        loginBtn.classList.remove('loading');
        loginBtn.disabled = false;
        emailInput.disabled = false;
        passwordInput.disabled = false;
    }
}

/**
 * Initializes the show/hide password toggle
 */
function initPasswordToggle() {
    const passwordToggle = document.querySelector(UI_SELECTORS.passwordToggle);
    const passwordInput = document.querySelector(UI_SELECTORS.passwordInput);

    if (!passwordToggle || !passwordInput) return;

    if (UIState.isInitialized('password')) return;
    UIState.markInitialized('password');

    passwordToggle.addEventListener('click', (event) => {
        event.preventDefault();
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        passwordToggle.classList.toggle('visible', isPassword);
    });
}

/**
 * Initializes automatic logout after 30 minutes of inactivity
 */
function initLogoutTimer() {
    const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
    let inactivityTimer;

    const resetTimer = () => {
        clearTimeout(inactivityTimer);
        
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        if (!isAuthenticated) return;

        inactivityTimer = setTimeout(() => {
            localStorage.clear();
            alert('Session expired due to inactivity. Please login again.');
            location.reload();
        }, INACTIVITY_TIMEOUT);
    };

    // Initialize timer on page load if user is authenticated
    if (localStorage.getItem('isAuthenticated') === 'true') {
        resetTimer();
    }

    // Reset timer on user activity
    ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'].forEach(event => {
        document.addEventListener(event, resetTimer, { passive: true });
    });
}

/**
 * Modifies the interface based on the user's role
 */
function checkAuthStatus() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const role = localStorage.getItem('userRole');

    if (isAuthenticated) {
        // Change login link to logout
        const loginLink = document.querySelector(UI_SELECTORS.loginLink);
        if (loginLink) {
            loginLink.textContent = "Logout";
            loginLink.href = "#";
            loginLink.onclick = () => {
                localStorage.clear();
                window.location.reload();
            };
        }

        // Permanent notification banner at the top
        const statusMsg = document.createElement('div');
        let bannerStyle = "color: white; text-align: center; padding: 10px;";
        if (role === 'admin') {
            bannerStyle = "background: #e74c3c;" + bannerStyle;
            statusMsg.textContent = "Admin access active";
        } else {
            bannerStyle = "background: #2ecc71;" + bannerStyle;
            statusMsg.textContent = `Logged in as ${role}`;
        }
        statusMsg.style.cssText = bannerStyle;
        document.body.prepend(statusMsg);
    }
}


