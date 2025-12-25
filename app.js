// =========================
// Config accès OnlineCourseHost (OCH)
// =========================

// IMPORTANT : on pointe vers la racine du site.
// Si tu es déjà connecté, tu arrives sur le dashboard.
// Si tu n'es pas connecté, OCH te redirige lui-même vers le login.
const OCH_BASE_URL = "https://deenvertissement.fr";
const OCH_LOGIN_PATH = "/"; // ne plus utiliser /login directement
const OCH_LOGIN_URL = `${OCH_BASE_URL}${OCH_LOGIN_PATH}`;

// =========================
// Données des épisodes (Saison 1 – 8-10 ans)
// =========================

const EPISODES = {
  1: {
    tag: "Saison 1 · Épisode 1",
    title: "Les Racines : Ibrahim & la Kaaba",
    summary:
      "Comment La Mecque est devenue une ville spéciale et pourquoi la Kaaba a été construite. On remonte jusqu’à Ibrahim عليه السلام pour comprendre les origines de cette Maison.",
    verse:
      "Verset clé : “Et quand Ibrahim et Ismaël élevaient les fondations de la Maison…” (Sourate Al-Baqara).",
  },
  2: {
    tag: "Saison 1 · Épisode 2",
    title: "L’Année de l’Éléphant",
    summary:
      "Abraha voulait détruire la Kaaba… mais Allah a protégé Sa Maison d’une façon incroyable ! On découvre comment une armée immense a été vaincue par de petits oiseaux.",
    verse:
      "Verset clé : Sourate Al-Fil – “N’as-tu pas vu comment ton Seigneur a agi avec les gens de l’Éléphant ?”.",
  },
  3: {
    tag: "Saison 1 · Épisode 3",
    title: "Les Quraysh",
    summary:
      "Qui étaient la tribu du Prophète ﷺ ? Pourquoi ils étaient importants à La Mecque ? On parle de leurs voyages, de leur commerce et de leur responsabilité autour de la Kaaba.",
    verse:
      "Verset clé : Sourate Quraysh – “À cause des pactes des Quraysh…”.",
  },
  4: {
    tag: "Saison 1 · Épisode 4",
    title: "L’Orphelin du Désert : Amina & Halima",
    summary:
      "Le Prophète ﷺ a perdu ses parents très jeune, mais Allah l’a protégé et entouré de personnes pleines de miséricorde, comme Halima et son grand-père.",
    verse:
      "Verset clé : Sourate Ad-Duha – “Ne t’a-t-Il pas trouvé orphelin, puis Il t’a accordé un refuge ?”.",
  },
  5: {
    tag: "Saison 1 · Épisode 5",
    title: "L’Ouverture de la Poitrine",
    summary:
      "L’épisode où le cœur du Prophète ﷺ est purifié pour recevoir la lumière de la Révélation. On parle de la fitra, du cœur et de ce que signifie être préparé par Allah.",
    verse:
      "Verset clé : Sourate Ash-Sharh – “N’avons-nous pas ouvert pour toi ta poitrine ?”.",
  },
  6: {
    tag: "Saison 1 · Épisode 6",
    title: "Le Moine Bahira",
    summary:
      "Lors d’un voyage commercial en Syrie, un moine chrétien reconnaît les signes de la prophétie chez le jeune Muhammad ﷺ. On découvre les signes annoncés dans les anciennes écritures.",
    verse:
      "Verset clé : Sourate Al-Qalam – “Tu es, certes, d’une moralité éminente”.",
  },
  7: {
    tag: "Saison 1 · Épisode 7",
    title: "Al-Amin & Khadija",
    summary:
      "Comment le Prophète ﷺ est devenu “Al-Amîn” (le digne de confiance) et comment Khadija رضي الله عنها a cru en lui, soutenu et rassuré dans tous les moments difficiles.",
    verse:
      "Verset clé : “Et tu es certes, d’un immense caractère.” (Al-Qalam 68:4).",
  },
};

// =========================
// Modale OCH (plateforme de cours)
// =========================

let ochModal = null;
let ochIframe = null;

function openOchModal(event) {
  if (event) event.preventDefault();
  if (!ochModal || !ochIframe) return;

  // On charge toujours l’URL racine
  ochIframe.src = OCH_LOGIN_URL;

  ochModal.classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
}

function closeOchModal() {
  if (!ochModal) return;

  ochModal.classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
}

function setupOchModal() {
  ochModal = document.getElementById("och-modal");
  ochIframe = document.getElementById("och-iframe");

  if (!ochModal || !ochIframe) {
    console.warn("[SIRA] Modal OCH non trouvée (id='och-modal').");
    return;
  }

  // Tous les déclencheurs génériques data-och
  const ochTriggers = document.querySelectorAll("[data-och]");
  ochTriggers.forEach((el) => {
    el.addEventListener("click", openOchModal);
  });

  // Boutons "Accéder à la leçon" dans la modale épisode
  const episodeOchButtons = document.querySelectorAll(".js-episode-open-och");
  episodeOchButtons.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      openOchModal();
    });
  });

  // Boutons de fermeture OCH
  const closeButtons = document.querySelectorAll(".js-och-close");
  closeButtons.forEach((btn) => btn.addEventListener("click", closeOchModal));

  // Echap
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeOchModal();
    }
  });
}

// =========================
// Modale Épisode
// =========================

let episodeModal = null;
let episodeModalTag = null;
let episodeModalTitle = null;
let episodeModalSummary = null;
let episodeModalVerse = null;
let episodeModalExtra = null;

function openEpisodeModal(event) {
  event.preventDefault();
  const trigger = event.currentTarget;
  const id = parseInt(trigger.dataset.episodeId, 10);
  const data = EPISODES[id];

  if (!data || !episodeModal) {
    console.warn("[SIRA] Épisode introuvable :", id);
    return;
  }

  episodeModalTag.textContent = data.tag;
  episodeModalTitle.textContent = data.title;
  episodeModalSummary.textContent = data.summary;
  episodeModalVerse.textContent = data.verse;
  episodeModalExtra.textContent =
    "Durée ~45 min · Niveau 8–10 ans · Le détail complet du cours est disponible dans ton espace sécurisé Deenvertissement.";

  episodeModal.classList.remove("hidden");
  episodeModal.classList.add("flex");
  document.body.classList.add("overflow-hidden");
}

function closeEpisodeModal() {
  if (!episodeModal) return;
  episodeModal.classList.add("hidden");
  episodeModal.classList.remove("flex");
  document.body.classList.remove("overflow-hidden");
}

function setupEpisodeModal() {
  episodeModal = document.getElementById("episode-modal");
  if (!episodeModal) {
    console.warn("[SIRA] Modal épisode non trouvée (id='episode-modal').");
    return;
  }

  episodeModalTag = document.getElementById("episode-modal-tag");
  episodeModalTitle = document.getElementById("episode-modal-title");
  episodeModalSummary = document.getElementById("episode-modal-summary");
  episodeModalVerse = document.getElementById("episode-modal-verse");
  episodeModalExtra = document.getElementById("episode-modal-extra");

  // Tous les boutons avec data-episode-id (hero + cartes)
  const episodeTriggers = document.querySelectorAll("[data-episode-id]");
  episodeTriggers.forEach((btn) =>
    btn.addEventListener("click", openEpisodeModal)
  );

  // Boutons de fermeture
  const closeButtons = episodeModal.querySelectorAll(".js-episode-close");
  closeButtons.forEach((btn) =>
    btn.addEventListener("click", closeEpisodeModal)
  );

  // Fermeture en cliquant sur le fond
  episodeModal.addEventListener("click", (event) => {
    if (event.target === episodeModal) {
      closeEpisodeModal();
    }
  });

  // Echap
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeEpisodeModal();
    }
  });
}

// =========================
// Audio de fond
// =========================

function setupBackgroundAudio() {
  const audio = document.getElementById("bg-audio");
  if (!audio) return;
  audio.volume = 0.25;
}

// =========================
// Lancement global
// =========================

function initApp() {
  setupBackgroundAudio();
  setupEpisodeModal();
  setupOchModal();
}

document.addEventListener("DOMContentLoaded", initApp);
