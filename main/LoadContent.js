// loadContent.js
// loadContent.js
async function loadContent(elementId, url) {
    const response = await fetch(url);
    const content = await response.text();
    document.getElementById(elementId).innerHTML = content;
}

document.addEventListener('DOMContentLoaded', () => {
    loadContent('navbar', 'navibar.html');
    loadContent('gallery-section', 'gallery.html');
    loadContent('services-section', 'services.html');
});
