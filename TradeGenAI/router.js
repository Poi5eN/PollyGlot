// Simple hash-based router for Vite
export function initRouter() {
    // Handle initial load
    handleRoute()
    
    // Handle hash changes
    window.addEventListener('hashchange', handleRoute)
    
    // Handle navigation clicks
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]')
        if (link) {
            e.preventDefault()
            const hash = link.getAttribute('href')
            window.location.hash = hash
            handleRoute()
        }
    })
}

function handleRoute() {
    const hash = window.location.hash.slice(1) || 'home'
    
    if (hash === 'generate') {
        loadPage('./generate.html')
    } else {
        loadPage('./index.html')
    }
}

function loadPage(url) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            // Parse the HTML
            const parser = new DOMParser()
            const doc = parser.parseFromString(html, 'text/html')
            
            // Update the page content
            document.title = doc.title
            document.body.innerHTML = doc.body.innerHTML
            
            // Re-execute scripts
            const scripts = doc.querySelectorAll('script')
            scripts.forEach(oldScript => {
                const newScript = document.createElement('script')
                if (oldScript.src) {
                    newScript.src = oldScript.src
                } else {
                    newScript.textContent = oldScript.textContent
                }
                newScript.type = 'module'
                document.body.appendChild(newScript)
            })
        })
        .catch(err => {
            console.error('Failed to load page:', err)
        })
}

