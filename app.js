// =========================
// Config accès OnlineCourseHost (OCH)
// =========================

// URL de base de ton espace OCH
const OCH_BASE_URL = "https://deenvertissement.fr";

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
 * Ouvre la modal OCH et charge OCH dans l'iframe
 */
function openOchModal(event) {
  if (event) event.preventDefault();

  if (!ochModal || !ochIframe) return;

  // Fermer toutes les modals épisode ouvertes
  const episodeModals = document.querySelectorAll(".episode-modal");
  episodeModals.forEach((modal) => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  });

  // On recharge systématiquement l'URL pour être sûr
  ochIframe.src = OCH_LOGIN_URL;

  ochModal.classList.remove("hidden");
  ochModal.classList.add("flex");
  document.body.classList.add("overflow-hidden");
}

/**
 * Ferme la modal OCH
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
// Gestion des fiches épisodes (modals internes SIRA)
// =========================

function setupEpisodeModals() {
  const episodeButtons = document.querySelectorAll(".js-open-episode");

  if (!episodeButtons.length) {
    console.warn("[SIRA] Aucun bouton d'ouverture d'épisode trouvé (.js-open-episode).");
    return;
  }

  episodeButtons.forEach((btn) => {
    const targetSelector = btn.dataset.target;
    if (!targetSelector) return;

    const modal = document.querySelector(targetSelector);
    if (!modal) {
      console.warn("[SIRA] Modal épisode introuvable pour le sélecteur :", targetSelector);
      return;
    }

    const closeButtons = modal.querySelectorAll(".js-episode-close");

    const open = () => {
      modal.classList.remove("hidden");
      modal.classList.add("flex");
      document.body.classList.add("overflow-hidden");
    };

    const close = () => {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
      document.body.classList.remove("overflow-hidden");
    };

    // Ouverture
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      open();
    });

    // Boutons de fermeture dans la modal
    closeButtons.forEach((closeBtn) => {
      closeBtn.addEventListener("click", (event) => {
        event.preventDefault();
        close();
      });
    });

    // Clic sur le fond noir pour fermer
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        close();
      }
    });

    // ESC pour fermer
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        close();
      }
    });
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
  setupEpisodeModals();
  setupBackgroundAudio();
}

document.addEventListener("DOMContentLoaded", initApp);
