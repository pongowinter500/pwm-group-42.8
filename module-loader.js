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

// Carica i moduli quando il DOM è pronto
document.addEventListener('DOMContentLoaded', async () => {
    await loadHTMLModules();
    markActiveNav();
    
    // Emetti un evento custom per notificare che i moduli sono stati caricati
    window.dispatchEvent(new CustomEvent('modulesLoaded'));
});

