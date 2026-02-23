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
});
