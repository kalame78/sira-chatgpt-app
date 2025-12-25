// --- 1. Service Worker Registration (PWA) ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Assure-toi que service-worker.js est bien à la racine
        navigator.serviceWorker.register('./service-worker.js')
            .then(reg => console.log('SW enregistré:', reg.scope))
            .catch(err => console.error('SW échec:', err));
    });
}

// --- 2. Gestion des Écrans (Profils vs Accueil) ---
const profileScreen = document.getElementById('profile-screen');
const homeScreen = document.getElementById('home-screen');
const currentUserInitial = document.getElementById('current-user-initial');

// Vérifie si un profil est déjà sauvegardé
const savedUser = localStorage.getItem('siraUser');
if (savedUser) {
    showHome(savedUser);
}

function selectProfile(name) {
    console.log(`Profil choisi : ${name}`);
    localStorage.setItem('siraUser', name); 
    showHome(name);
}

function showHome(userName) {
    // Met à jour l'initiale
    if(currentUserInitial) {
        currentUserInitial.innerText = userName.charAt(0);
        
        // Couleur dynamique selon le user
        const parentStyle = currentUserInitial.parentElement.style;
        if(userName === 'Reda') parentStyle.background = '#e50914';
        else if(userName === 'Testé') parentStyle.background = '#b81d24';
        else parentStyle.background = '#0071eb';
    }
    
    // Transition
    profileScreen.classList.remove('active');
    profileScreen.classList.add('hidden');
    
    homeScreen.classList.remove('hidden');
    homeScreen.classList.add('active');
}

function logout() {
    localStorage.removeItem('siraUser');
    homeScreen.classList.remove('active');
    homeScreen.classList.add('hidden');
    
    profileScreen.classList.remove('hidden');
    profileScreen.classList.add('active');
}

// --- 3. Gestion de la Modale ---
const modal = document.getElementById('info-modal');

function openModal() {
    modal.classList.remove('hidden');
}

function closeModal() {
    modal.classList.add('hidden');
}

// Fermer au clic extérieur
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}

function scrollToSeasons() {
    const container = document.getElementById('seasons-container');
    if(container) {
        container.scrollIntoView({ behavior: 'smooth' });
    }
}
