* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; }
body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: radial-gradient(circle at top, #1b2340 0%, #050816 50%, #020617 100%);
  color: #f9fafb;
}

.hidden { display: none !important; }

#app { min-height: 100vh; }

/* PROFILS */
#profile-screen {
  min-height: 100vh;
  display: flex;
}
#home-screen {
  min-height: 100vh;
  display: none;
}

.profile-container {
  margin: auto;
  text-align: center;
  padding: 2rem 1.5rem 3rem;
  max-width: 480px;
}
.app-title {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}
.app-subtitle {
  font-size: 0.95rem;
  color: #cbd5f5;
  margin-bottom: 2rem;
}
.profile-list {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}
.profile-card {
  border: none;
  background: #0b1220;
  border-radius: 1.25rem;
  padding: 1rem 0.75rem;
  width: 105px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #e5e7eb;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
}
.profile-card:hover {
  transform: translateY(-4px);
  background: #111827;
}
.profile-add { border: 1px dashed #4b5563; }

.avatar-circle {
  width: 52px;
  height: 52px;
  border-radius: 999px;
  background: linear-gradient(135deg, #f97316, #facc15); /* sera écrasé par le JS */
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.3rem;
  color: #111827;
}
.avatar-circle.plus {
  background: transparent !important;
  border: 1px dashed #4b5563;
  color: #9ca3af;
}

/* HEADER */
.main-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background: linear-gradient(to bottom, rgba(5, 8, 22, 0.95), rgba(5, 8, 22, 0.7));
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
  position: sticky;
  top: 0;
  z-index: 10;
}
.brand {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}
.logo-dot {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: radial-gradient(circle at 30% 30%, #facc15, #f97316);
  box-shadow: 0 0 12px rgba(250, 204, 21, 0.8);
}
.brand-title {
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.75rem;
  color: #e5e7eb;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.user-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.user-initial {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: linear-gradient(135deg, #2563eb, #22c55e);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 700;
}
.user-name {
  font-size: 0.8rem;
  color: #e5e7eb;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.logout-btn {
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.7);
  background: rgba(15, 23, 42, 0.9);
  color: #e5e7eb;
  font-size: 0.75rem;
  cursor: pointer;
  padding: 0.3rem 0.7rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
.logout-btn span.icon {
  font-size: 0.85rem;
}

/* BOUTONS */
.primary-btn,
.secondary-btn,
.och-btn {
  border-radius: 999px;
  border: none;
  padding: 0.55rem 1.1rem;
  font-size: 0.85rem;
  cursor: pointer;
  font-weight: 600;
}
.primary-btn {
  background: linear-gradient(135deg, #f97316, #facc15);
  color: #111827;
  box-shadow: 0 14px 35px rgba(248, 181, 24, 0.4);
}
.secondary-btn {
  background: rgba(15, 23, 42, 0.8);
  color: #e5e7eb;
  border: 1px solid rgba(148, 163, 184, 0.4);
}
.och-btn {
  background: transparent;
  border: 1px solid rgba(248, 181, 24, 0.7);
  color: #facc15;
}

.main-content { padding-bottom: 3rem; }

/* HERO */
.hero {
  position: relative;
  min-height: 230px;
  display: flex;
  align-items: flex-end;
  padding: 1.5rem 1.25rem;
  background-image: url("https://images.pexels.com/photos/1842623/pexels-photo-1842623.jpeg?auto=compress&cs=tinysrgb&w=1200");
  background-size: cover;
  background-position: center;
  border-radius: 1.5rem;
  margin: 1rem 1.25rem 0;
  overflow: hidden;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top, rgba(15, 23, 42, 0.85), rgba(3, 7, 18, 0.95));
}
.hero-content {
  position: relative;
  z-index: 1;
  max-width: 420px;
}
.hero-kicker {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: #facc15;
  margin-bottom: 0.5rem;
}
.hero-title {
  font-size: 1.6rem;
  font-weight: 800;
  margin-bottom: 0.35rem;
}
.hero-text {
  font-size: 0.9rem;
  color: #e5e7eb;
  margin-bottom: 0.9rem;
}
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

/* SAISON & ÉPISODES */
.seasons-section {
  margin: 1.5rem 1.25rem 0;
}
.section-header h2 {
  font-size: 1.1rem;
  font-weight: 700;
}
.section-header p {
  font-size: 0.85rem;
  color: #cbd5f5;
  margin-top: 0.2rem;
  margin-bottom: 0.8rem;
}
.episodes-row {
  display: flex;
  overflow-x: auto;
  gap: 0.75rem;
  padding-bottom: 0.25rem;
}
.episode-card {
  min-width: 220px;
  max-width: 240px;
  background: #020617;
  border-radius: 1rem;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.28);
}
.episode-thumb {
  height: 110px;
  background-size: cover;
  background-position: center;
}
.thumb-1 { background-image: linear-gradient(135deg, #22c55e, #16a34a); }
.thumb-2 { background-image: linear-gradient(135deg, #0ea5e9, #1d4ed8); }
.thumb-3 { background-image: linear-gradient(135deg, #f97316, #facc15); }

.episode-body {
  padding: 0.7rem 0.75rem 0.85rem;
}
.episode-body h3 {
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}
.episode-body p {
  font-size: 0.8rem;
  color: #cbd5f5;
}

/* MODALES (génériques) */
.modal {
  position: fixed;
  inset: 0;
  display: none;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.88);
  z-index: 50;
  padding: 1.25rem;
}
.modal.show {
  display: flex;
}
.modal-content {
  background: #020617;
  border-radius: 1.25rem;
  padding: 1.25rem 1.1rem;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.75);
}
.modal-text {
  font-size: 0.9rem;
  color: #e5e7eb;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
}
.modal-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

/* MODALE AJOUT PROFIL */
.profile-modal-title {
  font-size: 1.1rem;
  font-weight: 700;
}
.profile-modal-subtitle {
  font-size: 0.8rem;
  color: #9ca3af;
  margin-top: 0.35rem;
  margin-bottom: 0.9rem;
  line-height: 1.4;
}
.profile-input-group {
  margin-bottom: 1rem;
  text-align: left;
}
.profile-input-group label {
  display: block;
  font-size: 0.8rem;
  color: #cbd5f5;
  margin-bottom: 0.3rem;
}
.profile-input-group input {
  width: 100%;
  padding: 0.55rem 0.7rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(148, 163, 184, 0.6);
  background: #020617;
  color: #f9fafb;
  font-size: 0.9rem;
  outline: none;
}
.profile-input-group input:focus {
  border-color: #facc15;
  box-shadow: 0 0 0 1px rgba(250, 204, 21, 0.6);
}

/* MODALE OCH PLEIN ÉCRAN (spécifique) */
.modal-och-root {
  padding: 0;
  align-items: stretch;
  justify-content: stretch;
  background: rgba(15, 23, 42, 0.95);
}
.modal-och {
  border-radius: 0;
  padding: 0;
  width: 100%;
  max-width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-shadow: none;
}
.modal-och-header {
  padding: 0.9rem 1rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
  background: #020617;
}
.och-kicker {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: #facc15;
}
.och-title {
  font-size: 1rem;
  font-weight: 700;
}
.och-subtitle {
  font-size: 0.78rem;
  color: #9ca3af;
  margin-top: 0.25rem;
}
.close-btn {
  border: none;
  background: transparent;
  color: #9ca3af;
  font-size: 1.3rem;
  cursor: pointer;
}
.och-body {
  flex: 1;
  background: #020617;
  overflow: hidden;
}
.och-body iframe {
  width: 100%;
  height: 100%;
  border: none;
}

@media (min-width: 768px) {
  .hero {
    min-height: 280px;
    margin-top: 1.5rem;
  }
  .hero-title { font-size: 2rem; }
  .episodes-row { gap: 1rem; }
}
