// -------- 1. Service Worker minimal ----------
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then(reg => console.log("SW ok:", reg.scope))
      .catch(err => console.log("SW error:", err));
  });
}

// -------- 2. Gestion profils / écrans ----------
const profileScreen = document.getElementById("profile-screen");
const homeScreen = document.getElementById("home-screen");
const currentUserInitial = document.getElementById("current-user-initial");
const currentUserNameEl = document.getElementById("current-user-name");
const profileListEl = document.getElementById("profile-list");

// Modale ajout profil
const profileModal = document.getElementById("profile-modal");
const profileNameInput = document.getElementById("profile-name-input");
const profileSaveBtn = document.getElementById("profile-save-btn");
const profileCancelBtn = document.getElementById("profile-cancel-btn");

let profiles = [];

function loadProfiles() {
  const stored = localStorage.getItem("siraProfiles");
  if (stored) {
    try {
      profiles = JSON.parse(stored) || [];
    } catch (e) {
      profiles = [];
    }
  }
  if (!Array.isArray(profiles)) {
    profiles = [];
  }

  // S'il n'y a aucun profil, on crée un profil Invité par défaut
  if (profiles.length === 0) {
    profiles = [
      { id: Date.now(), name: "Invité" }
    ];
    saveProfiles();
  }

  renderProfiles();
}

function saveProfiles() {
  localStorage.setItem("siraProfiles", JSON.stringify(profiles));
}

// Génère un dégradé de couleur différent par index
function getProfileGradient(index) {
  const hue = (index * 60) % 360; // 6 couleurs avant de boucler
  const hue2 = (hue + 40) % 360;
  return `linear-gradient(135deg, hsl(${hue}, 85%, 60%), hsl(${hue2}, 90%, 50%))`;
}

function renderProfiles() {
  if (!profileListEl) return;
  profileListEl.innerHTML = "";

  // Cartes pour chaque profil existant
  profiles.forEach((profile, index) => {
    const btn = document.createElement("button");
    btn.className = "profile-card";
    btn.addEventListener("click", () => selectProfile(profile.name));

    const avatar = document.createElement("div");
    avatar.className = "avatar-circle";
    avatar.textContent = profile.name.charAt(0).toUpperCase();
    avatar.style.background = getProfileGradient(index);

    const span = document.createElement("span");
    span.textContent = profile.name;

    btn.appendChild(avatar);
    btn.appendChild(span);
    profileListEl.appendChild(btn);
  });

  // Carte "Ajouter"
  const addBtn = document.createElement("button");
  addBtn.className = "profile-card profile-add";
  addBtn.addEventListener("click", openProfileModal);

  const plusAvatar = document.createElement("div");
  plusAvatar.className = "avatar-circle plus";
  plusAvatar.textContent = "+";

  const span = document.createElement("span");
  span.textContent = "Ajouter";

  addBtn.appendChild(plusAvatar);
  addBtn.appendChild(span);
  profileListEl.appendChild(addBtn);
}

function openProfileModal() {
  if (!profileModal) return;
  profileNameInput.value = "";
  profileModal.classList.add("show");
  setTimeout(() => {
    profileNameInput.focus();
  }, 50);
}

function closeProfileModal() {
  if (!profileModal) return;
  profileModal.classList.remove("show");
}

function saveProfileFromModal() {
  if (!profileNameInput) return;
  const name = profileNameInput.value.trim();
  if (!name) {
    profileNameInput.focus();
    return;
  }
  profiles.push({
    id: Date.now(),
    name
  });
  saveProfiles();
  renderProfiles();
  closeProfileModal();
}

if (profileSaveBtn) {
  profileSaveBtn.addEventListener("click", saveProfileFromModal);
}
if (profileCancelBtn) {
  profileCancelBtn.addEventListener("click", closeProfileModal);
}
if (profileModal) {
  profileModal.addEventListener("click", (e) => {
    if (e.target === profileModal) {
      closeProfileModal();
    }
  });
}
if (profileNameInput) {
  profileNameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveProfileFromModal();
    }
  });
}

function selectProfile(name) {
  localStorage.setItem("siraUser", name);
  showHome(name);
}

function showHome(userName) {
  if (currentUserInitial) {
    currentUserInitial.textContent = userName.charAt(0).toUpperCase();
  }
  if (currentUserNameEl) {
    currentUserNameEl.textContent = userName;
  }
  profileScreen.style.display = "none";
  homeScreen.style.display = "block";
}

function logout() {
  localStorage.removeItem("siraUser");
  homeScreen.style.display = "none";
  profileScreen.style.display = "flex";
}

// Charger les profils et l'utilisateur au démarrage
loadProfiles();
const savedUser = localStorage.getItem("siraUser");
if (savedUser) {
  showHome(savedUser);
}

// -------- 3. Fiche épisode ----------
const episodeModal = document.getElementById("episode-modal");
const modalTitle = document.getElementById("modal-title");
const modalText = document.getElementById("modal-text");

function openEpisodeModal(id) {
  if (id === "episode1") {
    modalTitle.textContent = "Épisode 1 – Les Racines";
    modalText.textContent =
      "On découvre Ibrahim, Ismaël, la construction de la Kaaba et pourquoi cette maison est si importante pour tous les musulmans.";
  } else if (id === "episode2") {
    modalTitle.textContent = "Épisode 2 – L’Année de l’Éléphant";
    modalText.textContent =
      "Abraha veut détruire la Kaaba, mais Allah la protège avec des oiseaux spéciaux. Les enfants comprennent qu’Allah protège Sa Maison.";
  } else if (id === "episode3") {
    modalTitle.textContent = "Épisode 3 – Quraysh & les caravanes";
    modalText.textContent =
      "On suit les voyages d’hiver et d’été de Quraysh, et on voit comment le commerce est lié à la sécurité autour de la Kaaba (sourate Quraysh).";
  } else {
    modalTitle.textContent = "Épisode";
    modalText.textContent = "Détails de l’épisode.";
  }

  episodeModal.classList.add("show");
}

function closeEpisodeModal() {
  episodeModal.classList.remove("show");
}

// fermer la modal épisode si on clique en dehors
episodeModal.addEventListener("click", (e) => {
  if (e.target === episodeModal) {
    closeEpisodeModal();
  }
});

function scrollToSeasons() {
  const container = document.getElementById("seasons-container");
  if (container) {
    container.scrollIntoView({ behavior: "smooth" });
  }
}

// -------- 4. OCH iframe (plein écran intégré) ----------
const OCH_BASE_URL = "https://deenvertissement.fr";
const OCH_PATH = ""; // adapte si besoin (ex: "/login")
const OCH_URL = `${OCH_BASE_URL}${OCH_PATH}`;

const ochModal = document.getElementById("och-modal");
const ochIframe = document.getElementById("och-iframe");
const ochCloseBtn = document.getElementById("och-close");

function openOchModal() {
  if (!ochModal || !ochIframe) return;

  // 🔒 On ferme systématiquement la fiche épisode avant d'ouvrir OCH
  closeEpisodeModal();

  ochIframe.src = OCH_URL;
  ochModal.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeOchModal() {
  if (!ochModal) return;
  ochModal.classList.remove("show");
  document.body.style.overflow = "";

  // ✅ Garantie UX : aucune ancienne modale épisode ouverte
  closeEpisodeModal();
}

if (ochCloseBtn) {
  ochCloseBtn.addEventListener("click", closeOchModal);
}

// ⚠️ IMPORTANT : on NE ferme PLUS la modale OCH au clic sur le fond.
// On évite les fermetures accidentelles sur mobile.
