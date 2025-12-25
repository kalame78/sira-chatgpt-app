// =========================
// CONFIG OCH
// =========================

// URL de base de ton espace OCH
const OCH_BASE_URL = "https://deenvertissement.fr"; // ajuste si besoin
const OCH_LOGIN_PATH = "/login"; // ex: "/login", "/courses", etc.

const OCH_LOGIN_URL = `${OCH_BASE_URL}${OCH_LOGIN_PATH}`;

// =========================
// VARIABLES GLOBALES
// =========================

let profiles = [];
let currentProfile = null;

let profileScreen, mainScreen;
let profileList, addProfileBtn;
let profileModal, profileNameInput, cancelProfileBtn, saveProfileBtn;
let welcomeName, currentProfileCircle, changeProfileBtn;

let seasonModal, seasonTitleEl, seasonDescEl, seasonBadgeEl, seasonOchBtn;
let ochModal, ochIframe;

// =========================
// PROFILS (localStorage)
// =========================

const STORAGE_KEY_PROFILES = "sira_profiles";
const STORAGE_KEY_CURRENT = "sira_current_profile";

function loadProfiles() {
  try {
    const rawProfiles = localStorage.getItem(STORAGE_KEY_PROFILES);
    const rawCurrent = localStorage.getItem(STORAGE_KEY_CURRENT);

    profiles = rawProfiles ? JSON.parse(rawProfiles) : [];

    if (!Array.isArray(profiles)) profiles = [];

    currentProfile = rawCurrent || null;
  } catch (e) {
    console.warn("[SIRA] Erreur lecture profils :", e);
    profiles = [];
    currentProfile = null;
  }
}

function saveProfiles() {
  localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
}

function saveCurrentProfile() {
  if (currentProfile) {
    localStorage.setItem(STORAGE_KEY_CURRENT, currentProfile);
  } else {
    localStorage.removeItem(STORAGE_KEY_CURRENT);
  }
}

function renderProfiles() {
  profileList.innerHTML = "";

  if (profiles.length === 0) {
    const p = document.createElement("p");
    p.className = "text-sm text-slate-400 mt-4";
    p.textContent =
      "Ajoute ton prénom pour créer ton profil et garder ta progression.";
    profileList.appendChild(p);
    return;
  }

  profiles.forEach((name) => {
    const initial = name.trim().charAt(0).toUpperCase() || "?";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className =
      "flex flex-col items-center gap-2 animate-fade-in focus:outline-none";

    btn.innerHTML = `
      <div class="flex items-center justify-center h-24 w-24 sm:h-28 sm:w-28 rounded-3xl bg-blue-500 shadow-sira-soft text-3xl font-extrabold">
        ${initial}
      </div>
      <span class="text-sm text-slate-200">${name}</span>
    `;

    btn.addEventListener("click", () => {
      selectProfile(name);
    });

    profileList.appendChild(btn);
  });
}

function selectProfile(name) {
  currentProfile = name;
  saveCurrentProfile();
  updateWelcomeName();

  // passer à l'écran principal
  showMainScreen();
}

function updateWelcomeName() {
  if (!welcomeName || !currentProfileCircle) return;
  if (!currentProfile) {
    welcomeName.textContent = "toi";
    currentProfileCircle.textContent = "?";
    return;
  }

  const initial = currentProfile.trim().charAt(0).toUpperCase() || "?";
  welcomeName.textContent = currentProfile;
  currentProfileCircle.textContent = initial;
}

// =========================
// NAVIGATION ÉCRANS
// =========================

function showProfileScreen() {
  profileScreen.classList.remove("hidden");
  mainScreen.classList.add("hidden");
}

function showMainScreen() {
  profileScreen.classList.add("hidden");
  mainScreen.classList.remove("hidden");
}

// =========================
// MODAL PROFIL
// =========================

function openProfileModal() {
  profileNameInput.value = "";
  profileModal.classList.remove("hidden");
  profileModal.classList.add("flex");
  profileNameInput.focus();
}

function closeProfileModal() {
  profileModal.classList.add("hidden");
  profileModal.classList.remove("flex");
}

function handleSaveProfile() {
  const name = profileNameInput.value.trim();
  if (!name) return;

  if (!profiles.includes(name)) {
    profiles.push(name);
    saveProfiles();
    renderProfiles();
  }

  selectProfile(name);
  closeProfileModal();
}

// =========================
// MODAL SAISON
// =========================

function setupSeasonCards() {
  const cards = document.querySelectorAll(".season-card");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.dataset.seasonId || "";
      const title = card.dataset.seasonTitle || "Saison";
      const desc =
        card.dataset.seasonDescription ||
        "Retrouve les épisodes de cette saison dans ton espace de cours.";

      openSeasonModal(id, title, desc);
    });
  });
}

function openSeasonModal(id, title, description) {
  seasonTitleEl.textContent = title;
  seasonDescEl.textContent = description;

  // petite mise à jour du badge
  if (id) {
    seasonBadgeEl.textContent = `Saison ${id}`;
  } else {
    seasonBadgeEl.textContent = "Saison";
  }

  seasonModal.classList.remove("hidden");
  seasonModal.classList.add("flex");
}

function closeSeasonModal() {
  seasonModal.classList.add("hidden");
  seasonModal.classList.remove("flex");
}

// =========================
 // MODAL OCH (IFRAME)
// =========================

function openOchModal(event) {
  if (event) event.preventDefault();

  if (!ochModal || !ochIframe) return;

  ochIframe.src = OCH_LOGIN_URL;

  ochModal.classList.remove("hidden");
  ochModal.classList.add("flex");
  document.body.classList.add("overflow-hidden");
}

function closeOchModal() {
  if (!ochModal) return;

  ochModal.classList.add("hidden");
  ochModal.classList.remove("flex");
  document.body.classList.remove("overflow-hidden");
}

function setupOchModal() {
  ochModal = document.getElementById("och-modal");
  ochIframe = document.getElementById("och-iframe");

  if (!ochModal || !ochIframe) {
    console.warn("[SIRA] Modal OCH introuvable.");
    return;
  }

  // tous les boutons avec data-och
  const ochTriggers = document.querySelectorAll("[data-och]");
  ochTriggers.forEach((el) => {
    el.addEventListener("click", (e) => {
      // si on clique depuis la modale saison, on la ferme avant
      if (seasonModal && !seasonModal.classList.contains("hidden")) {
        closeSeasonModal();
      }
      openOchModal(e);
    });
  });

  // boutons de fermeture
  const closeButtons = document.querySelectorAll(".js-och-close");
  closeButtons.forEach((btn) => {
    btn.addEventListener("click", closeOchModal);
  });

  // clic sur le fond noir
  ochModal.addEventListener("click", (event) => {
    if (event.target === ochModal) {
      closeOchModal();
    }
  });

  // touche Echap
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeOchModal();
      closeSeasonModal();
      closeProfileModal();
    }
  });
}

// =========================
// AUDIO DE FOND
// =========================

function setupBackgroundAudio() {
  const audio = document.getElementById("bg-audio");
  if (!audio) return;

  audio.volume = 0.25;
}

// =========================
// INIT
// =========================

function initApp() {
  // refs DOM
  profileScreen = document.getElementById("profile-screen");
  mainScreen = document.getElementById("main-screen");
  profileList = document.getElementById("profile-list");
  addProfileBtn = document.getElementById("add-profile-btn");

  profileModal = document.getElementById("profile-modal");
  profileNameInput = document.getElementById("profile-name-input");
  cancelProfileBtn = document.getElementById("cancel-profile-btn");
  saveProfileBtn = document.getElementById("save-profile-btn");

  welcomeName = document.getElementById("welcome-name");
  currentProfileCircle = document.getElementById("current-profile-circle");
  changeProfileBtn = document.getElementById("change-profile-btn");

  seasonModal = document.getElementById("season-modal");
  seasonTitleEl = document.getElementById("season-title");
  seasonDescEl = document.getElementById("season-description");
  seasonBadgeEl = document.getElementById("season-badge");
  seasonOchBtn = document.getElementById("season-och-btn");

  // charger profils
  loadProfiles();
  renderProfiles();
  updateWelcomeName();

  if (currentProfile) {
    showMainScreen();
  } else {
    showProfileScreen();
  }

  // listeners profils
  addProfileBtn.addEventListener("click", openProfileModal);
  cancelProfileBtn.addEventListener("click", closeProfileModal);
  saveProfileBtn.addEventListener("click", handleSaveProfile);

  changeProfileBtn.addEventListener("click", () => {
    showProfileScreen();
  });

  // bouton "Voir la fiche du programme" : ouvrir la modale Saison 1
  const heroProgrammeBtn = document.getElementById("hero-programme-btn");
  if (heroProgrammeBtn) {
    heroProgrammeBtn.addEventListener("click", () => {
      openSeasonModal(
        "1",
        "Saison 1 — La Mecque : Les débuts de la Révélation",
        "Retrouve les premiers instants de la Révélation, les difficultés des premiers compagnons, la pression de Quraysh et la force intérieure du Prophète ﷺ. Un parcours pour comprendre que la foi grandit souvent dans les moments difficiles."
      );
    });
  }

  // modales
  setupSeasonCards();

  const closeSeasonButtons =
    document.querySelectorAll(".js-close-season");
  closeSeasonButtons.forEach((btn) => {
    btn.addEventListener("click", closeSeasonModal);
  });

  setupOchModal();
  setupBackgroundAudio();
}

// Lancement
document.addEventListener("DOMContentLoaded", initApp);
