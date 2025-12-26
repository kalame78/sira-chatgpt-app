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

// Modale ajout / renommage profil
const profileModal = document.getElementById("profile-modal");
const profileModalTitle = document.getElementById("profile-modal-title");
const profileModalSubtitle = document.getElementById("profile-modal-subtitle");
const profileNameInput = document.getElementById("profile-name-input");
const profileSaveBtn = document.getElementById("profile-save-btn");
const profileCancelBtn = document.getElementById("profile-cancel-btn");

// Modale actions profil (renommer / supprimer)
const profileActionsModal = document.getElementById("profile-actions-modal");
const profileActionsTitle = document.getElementById("profile-actions-title");
const profileActionsText = document.getElementById("profile-actions-text");
const profileRenameBtn = document.getElementById("profile-rename-btn");
const profileDeleteBtn = document.getElementById("profile-delete-btn");
const profileActionsCancelBtn = document.getElementById("profile-actions-cancel-btn");

// Nav & thème
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");
const themeToggleBtn = document.getElementById("theme-toggle");

let profiles = [];
let isEditingProfile = false;
let editingProfileId = null;
let activeProfileId = null;

/* ---------- Helpers couleur ---------- */

function makeGradientFromHue(hue) {
  const hue2 = (hue + 40) % 360;
  return `linear-gradient(135deg, hsl(${hue}, 85%, 60%), hsl(${hue2}, 90%, 50%))`;
}

function getProfileGradient(profile, index) {
  const baseHue =
    typeof profile.hue === "number" ? profile.hue : (index * 60) % 360;
  return makeGradientFromHue(baseHue);
}

function applyProfileTheme(profile) {
  const hue =
    typeof profile.hue === "number"
      ? profile.hue
      : 35;
  const gradient = makeGradientFromHue(hue);
  const solid = `hsl(${hue}, 90%, 65%)`;
  const solid2 = `hsl(${(hue + 25) % 360}, 85%, 55%)`;

  // avatar dans le header
  if (currentUserInitial) {
    currentUserInitial.style.background = gradient;
  }

  // point de logo
  const logoDot = document.querySelector(".logo-dot");
  if (logoDot) {
    logoDot.style.background = `radial-gradient(circle at 30% 30%, ${solid}, ${solid2})`;
  }

  // boutons principaux
  document.querySelectorAll(".primary-btn").forEach(btn => {
    if (!btn.classList.contains("secondary-variant")) {
      btn.style.background = gradient;
      btn.style.color = "#111827";
    }
  });

  // kicker du hero
  document.querySelectorAll(".hero-kicker").forEach(el => {
    el.style.color = solid;
  });

  // bouton OCH (bientôt si on l'ajoute ailleurs)
  document.querySelectorAll(".och-btn").forEach(btn => {
    btn.style.borderColor = solid;
    btn.style.color = solid;
  });
}

/* ---------- Profils : load / save / render ---------- */

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
      { id: Date.now(), name: "Invité", hue: 40 }
    ];
    saveProfiles();
  }

  renderProfiles();
}

function saveProfiles() {
  localStorage.setItem("siraProfiles", JSON.stringify(profiles));
}

function renderProfiles() {
  if (!profileListEl) return;
  profileListEl.innerHTML = "";

  // Cartes pour chaque profil existant
  profiles.forEach((profile, index) => {
    const card = document.createElement("div");
    card.className = "profile-card";
    card.tabIndex = 0;
    card.addEventListener("click", () => selectProfile(profile.id));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectProfile(profile.id);
      }
    });

    // Bouton gear (réglages)
    const gearBtn = document.createElement("button");
    gearBtn.type = "button";
    gearBtn.className = "profile-gear";
    gearBtn.textContent = "⚙";
    gearBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openProfileActions(profile.id);
    });

    const avatar = document.createElement("div");
    avatar.className = "avatar-circle";
    avatar.textContent = profile.name.charAt(0).toUpperCase();
    avatar.style.background = getProfileGradient(profile, index);

    const span = document.createElement("span");
    span.textContent = profile.name;

    card.appendChild(gearBtn);
    card.appendChild(avatar);
    card.appendChild(span);
    profileListEl.appendChild(card);
  });

  // Carte "Ajouter"
  const addBtn = document.createElement("div");
  addBtn.className = "profile-card profile-add";
  addBtn.tabIndex = 0;
  addBtn.addEventListener("click", openProfileModalForAdd);
  addBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openProfileModalForAdd();
    }
  });

  const plusAvatar = document.createElement("div");
  plusAvatar.className = "avatar-circle plus";
  plusAvatar.textContent = "+";

  const span = document.createElement("span");
  span.textContent = "Ajouter";

  addBtn.appendChild(plusAvatar);
  addBtn.appendChild(span);
  profileListEl.appendChild(addBtn);
}

/* ---------- Modale Ajout / Renommage ---------- */

function openProfileModalForAdd() {
  if (!profileModal) return;
  isEditingProfile = false;
  editingProfileId = null;
  profileModalTitle.textContent = "Nouveau profil";
  profileModalSubtitle.innerHTML =
    'Écris ton prénom ou ton pseudo pour que tu retrouves ton espace à chaque connexion.<br><br>' +
    '<strong>Important :</strong> ton profil est gardé seulement sur cet appareil. ' +
    "Si tu changes d’ordinateur, de tablette ou de téléphone, il faudra le recréer.";
  profileNameInput.value = "";
  profileModal.classList.add("show");
  setTimeout(() => {
    profileNameInput.focus();
  }, 50);
}

function openProfileModalForEdit(profileId) {
  if (!profileModal) return;
  const profile = profiles.find(p => p.id === profileId);
  if (!profile) return;

  isEditingProfile = true;
  editingProfileId = profileId;
  profileModalTitle.textContent = "Renommer le profil";
  profileModalSubtitle.innerHTML =
    "Change le nom de ce profil si tu veux corriger une faute ou utiliser un autre prénom.<br><br>" +
    "<strong>Rappel :</strong> le profil reste enregistré seulement sur cet appareil.";
  profileNameInput.value = profile.name;
  profileModal.classList.add("show");
  setTimeout(() => {
    profileNameInput.focus();
    profileNameInput.select();
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

  if (isEditingProfile && editingProfileId !== null) {
    // Renommage
    profiles = profiles.map(p =>
      p.id === editingProfileId ? { ...p, name } : p
    );
  } else {
    // Nouveau profil
    profiles.push({
      id: Date.now(),
      name,
      hue: Math.floor(Math.random() * 360)
    });
  }

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

/* ---------- Modale Actions (Renommer / Supprimer) ---------- */

function openProfileActions(profileId) {
  if (!profileActionsModal) return;
  const profile = profiles.find(p => p.id === profileId);
  if (!profile) return;

  activeProfileId = profileId;
  profileActionsTitle.textContent = profile.name;
  profileActionsText.innerHTML =
    "Que veux-tu faire avec ce profil ?<br />" +
    "Tu peux le renommer ou le supprimer.";
  profileActionsModal.classList.add("show");
}

function closeProfileActions() {
  if (!profileActionsModal) return;
  profileActionsModal.classList.remove("show");
  activeProfileId = null;
}

function handleRenameActiveProfile() {
  if (activeProfileId === null) return;
  const id = activeProfileId;
  closeProfileActions();
  openProfileModalForEdit(id);
}

function handleDeleteActiveProfile() {
  if (activeProfileId === null) return;

  if (profiles.length <= 1) {
    // Message simple pour les enfants : impossible de supprimer le dernier profil
    profileActionsText.innerHTML =
      "Tu dois garder au moins <strong>un profil</strong> dans l’application.<br />" +
      "Tu peux juste le renommer si tu veux changer de nom.";
    return;
  }

  profiles = profiles.filter(p => p.id !== activeProfileId);
  saveProfiles();
  renderProfiles();
  closeProfileActions();
}

if (profileRenameBtn) {
  profileRenameBtn.addEventListener("click", handleRenameActiveProfile);
}
if (profileDeleteBtn) {
  profileDeleteBtn.addEventListener("click", handleDeleteActiveProfile);
}
if (profileActionsCancelBtn) {
  profileActionsCancelBtn.addEventListener("click", closeProfileActions);
}
if (profileActionsModal) {
  profileActionsModal.addEventListener("click", (e) => {
    if (e.target === profileActionsModal) {
      closeProfileActions();
    }
  });
}

/* ---------- Sélection & écran d'accueil ---------- */

function selectProfile(profileId) {
  const profile = profiles.find(p => p.id === profileId);
  if (!profile) return;

  localStorage.setItem("siraUserId", String(profileId));
  localStorage.setItem("siraUser", profile.name); // rétro-compat
  showHome(profile);
}

function showHome(profileOrName) {
  const name =
    typeof profileOrName === "string" ? profileOrName : profileOrName.name;

  if (currentUserInitial) {
    currentUserInitial.textContent = name.charAt(0).toUpperCase();
  }
  if (currentUserNameEl) {
    currentUserNameEl.textContent = name;
  }

  if (typeof profileOrName === "object") {
    applyProfileTheme(profileOrName);
  }

  profileScreen.style.display = "none";
  homeScreen.style.display = "block";
}

function logout() {
  localStorage.removeItem("siraUserId");
  localStorage.removeItem("siraUser");
  homeScreen.style.display = "none";
  profileScreen.style.display = "flex";
  if (navMenu) navMenu.classList.remove("show");
}

// Charger les profils et l'utilisateur au démarrage
loadProfiles();
const savedUserId = localStorage.getItem("siraUserId");
const savedUserName = localStorage.getItem("siraUser");

if (savedUserId) {
  const p = profiles.find(p => String(p.id) === savedUserId);
  if (p) showHome(p);
} else if (savedUserName) {
  const pByName = profiles.find(p => p.name === savedUserName);
  if (pByName) showHome(pByName);
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

  if (navMenu) navMenu.classList.remove("show");
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

// -------- 5. Navigation & Thème --------
if (navToggle && navMenu) {
  navToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    navMenu.classList.toggle("show");
  });

  document.addEventListener("click", (e) => {
    if (!navMenu.contains(e.target) && e.target !== navToggle && !navToggle.contains(e.target)) {
      navMenu.classList.remove("show");
    }
  });
}

function applyTheme(theme) {
  if (!themeToggleBtn) return;
  if (theme === "light") {
    document.body.classList.add("light-mode");
    themeToggleBtn.textContent = "Passer en mode nuit";
  } else {
    document.body.classList.remove("light-mode");
    themeToggleBtn.textContent = "Passer en mode jour";
  }
}

let savedTheme = localStorage.getItem("siraTheme") || "dark";
applyTheme(savedTheme);

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    const isLight = document.body.classList.contains("light-mode");
    const newTheme = isLight ? "dark" : "light";
    localStorage.setItem("siraTheme", newTheme);
    applyTheme(newTheme);
  });
}
