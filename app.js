// =========================
// Config accès OnlineCourseHost (OCH)
// =========================

// URL de base de ton espace OCH
const OCH_BASE_URL = "https://deenvertissement.fr"; // ajuste si besoin

// Si ta page d'accès est différente (ex: /courses, /login, /?via=sira)
// tu peux modifier uniquement cette ligne :
const OCH_LOGIN_PATH = "/login";

// URL finale utilisée dans l'iframe
const OCH_LOGIN_URL = `${OCH_BASE_URL}${OCH_LOGIN_PATH}`;

// =========================
// Gestion de la modal OCH
// =========================

let ochModal = null;
let ochIframe = null;

/**
 * Ouvre la modal et charge OCH dans l'iframe
 */
function openOchModal(event) {
  if (event) event.preventDefault();

  if (!ochModal || !ochIframe) return;

  // On recharge systématiquement l'URL pour être sûr
  ochIframe.src = OCH_LOGIN_URL;

  ochModal.classList.remove("hidden");
  ochModal.classList.add("flex");
  document.body.classList.add("overflow-hidden");
}

/**
 * Ferme la modal
 */
function closeOchModal() {
  if (!ochModal) return;

  ochModal.classList.add("hidden");
  ochModal.classList.remove("flex");
  document.body.classList.remove("overflow-hidden");
}

/**
 * Installe les écouteurs sur tous les boutons d'accès aux cours
 * et sur la modal (fermeture).
 */
function setupOchModal() {
  ochModal = document.getElementById("och-modal");
  ochIframe = document.getElementById("och-iframe");

  if (!ochModal || !ochIframe) {
    console.warn(
      "[SIRA] Modal OCH non trouvée dans le HTML (id='och-modal' / 'och-iframe')."
    );
    return;
  }

  // Tous les boutons / liens avec l'attribut data-och
  const ochTriggers = document.querySelectorAll("[data-och]");
  ochTriggers.forEach((el) => {
    el.addEventListener("click", openOchModal);
  });

  // Boutons de fermeture (croix, bouton "Fermer", etc.)
  const closeButtons = document.querySelectorAll(".js-och-close");
  closeButtons.forEach((btn) => {
    btn.addEventListener("click", closeOchModal);
  });

  // Clic sur le fond noir pour fermer
  ochModal.addEventListener("click", (event) => {
    if (event.target === ochModal) {
      closeOchModal();
    }
  });

  // Fermeture avec la touche Echap
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeOchModal();
    }
  });
}

// =========================
// Autres petits comportements
// =========================

function setupBackgroundAudio() {
  const audio = document.getElementById("bg-audio");
  if (!audio) return;

  // Volume plus doux
  audio.volume = 0.25;
}

// =========================
// Lancement global
// =========================

function initApp() {
  setupOchModal();
  setupBackgroundAudio();
}

document.addEventListener("DOMContentLoaded", initApp);
