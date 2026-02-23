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

// Carica i moduli quando il DOM è pronto
document.addEventListener('DOMContentLoaded', loadHTMLModules);
