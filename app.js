/* ========= LIEN GLOBAL OCH (par défaut) ========= */
        const OCH_URL = "https://ihaveadeen.onlinecoursehost.com/courses/KQJcx3Zru1y5GE3K5ZSh/3/lessons/1";

        /* ========= PROGRAMMES (pour la fiche) ========= */
        const PROGRAMS = {
            hero: {
                id: 'hero',
                title: "Programme SIRA CORANIQUE",
                subtitle: "Un voyage immersif à la rencontre de la Sira",
                tag: "Parcours complet",
                image: "https://i.postimg.cc/25Jybx2z/1764964492743.png",
                description: "Entre dans un univers où chaque épisode relie ton cœur à la vie du Prophète ﷺ. Vidéos, défis, quiz, réflexion personnelle : tout est conçu pour que tu vives la Sira, pas juste que tu l'écoutes.",
                details: "Public : 8–10 ans • Accès sécurisé via ton espace Deenvertissement.",
                ochUrl: OCH_URL
            },

            saison1: {
                id: 'saison1',
                title: "Saison 1 — La Mecque : Les débuts de la Révélation",
                subtitle: "Épreuve, patience, premiers croyants… la foi sous pression.",
                tag: "Saison 1",
                image: "https://i.postimg.cc/7hb7rc2p/pexels-ahmed-aqtai-1804912-3332857.jpg",
                description: "Premiers pas de la Révélation, opposition de Quraysh, courage incroyable des premiers compagnons et confiance totale en Allah. Une saison pour comprendre que la foi se renforce face aux tempêtes.",
                details: "Parcours avec épisodes guidés, quiz et défis spirituels à vivre au quotidien.",
                ochUrl: OCH_URL // plus tard : URL spécifique du module Mecque
            },

            saison2: {
                id: 'saison2',
                title: "Saison 2 — Médine : Construire une communauté",
                subtitle: "Fraternité, justice, lumière pour le monde.",
                tag: "Saison 2",
                image: "https://i.postimg.cc/4xBFp9bB/pexels-shymar-salas-12263070.jpg",
                description: "Après l’exil, Allah offre stabilité et fraternité. Médine devient un laboratoire vivant : liens fraternels, justice, organisation, spiritualité vivante.",
                details: "Idéal pour réfléchir à ta place dans ta famille, ton groupe, ta communauté.",
                ochUrl: OCH_URL // plus tard : URL spécifique du module Médine
            }
        };

        /* ========= THEMES DE PROFIL ========= */
        const THEMES = [
            { name: 'blue', color: '#3b82f6', shadow: 'rgba(59,130,246,0.6)' },
            { name: 'green', color: '#10b981', shadow: 'rgba(16,185,129,0.6)' },
            { name: 'pink', color: '#ec4899', shadow: 'rgba(236,72,153,0.6)' },
            { name: 'orange', color: '#f97316', shadow: 'rgba(249,115,22,0.6)' },
            { name: 'purple', color: '#a855f7', shadow: 'rgba(168,85,247,0.6)' },
        ];

        /* ========= STATE GLOBAL ========= */
        let state = {
            screen: 'GATE',
            profiles: [],
            currentProfile: null,
            modal: null,       // 'CREATE_PROFILE' | 'PROGRAM_CARD' | 'OCH'
            program: null,     // données du programme sélectionné
            isMuted: false,
            ochUrlToOpen: OCH_URL, // lien OCH à utiliser dans la modale
        };

        /* ========= INIT ========= */
        function init() {
            const saved = localStorage.getItem('sira_profiles');
            if (saved) state.profiles = JSON.parse(saved);

            const audio = document.getElementById('bg-audio');
            if (audio) audio.volume = 0.3;

            render();
            window.addEventListener('scroll', handleScroll);
        }

        function handleScroll() {
            const navbar = document.getElementById('navbar');
            if (!navbar) return;
            if (window.scrollY > 20) {
                navbar.classList.add('bg-sira-dark/95', 'backdrop-blur-md', 'shadow-lg');
                navbar.classList.remove('bg-gradient-to-b', 'from-black/80', 'to-transparent');
            } else {
                navbar.classList.remove('bg-sira-dark/95', 'backdrop-blur-md', 'shadow-lg');
                navbar.classList.add('bg-gradient-to-b', 'from-black/80', 'to-transparent');
            }
        }

        function toggleSound() {
            const audio = document.getElementById('bg-audio');
            state.isMuted = !state.isMuted;
            if (state.isMuted) audio.pause();
            else audio.play().catch(()=>{});
            render();
        }

        /* ========= PROFILS ========= */
        function createProfile(name) {
            if (!name) return alert("Entrez un prénom");
            const theme = THEMES[Math.floor(Math.random() * THEMES.length)];
            const newProfile = { id: Date.now(), name, theme, score: 0 };
            state.profiles.push(newProfile);
            localStorage.setItem('sira_profiles', JSON.stringify(state.profiles));
            login(newProfile.id);
        }

        function login(id) {
            state.currentProfile = state.profiles.find(p => p.id === id);
            state.screen = 'APP';
            const t = state.currentProfile.theme;
            document.documentElement.style.setProperty('--user-color', t.color);
            document.documentElement.style.setProperty('--user-shadow', t.shadow);
            render();
        }

        function logout() {
            state.currentProfile = null;
            state.screen = 'GATE';
            state.modal = null;
            state.program = null;
            render();
        }

        /* ========= MODALES ========= */
        function openModal(type) {
            state.modal = type;
            render();
        }

        function closeModal() {
            state.modal = null;
            state.program = null;
            render();
        }

        // Ouvrir une fiche programme dynamique
        function openProgramCard(key) {
            const program = PROGRAMS[key];
            if (!program) return;
            state.program = program;
            state.modal = 'PROGRAM_CARD';
            render();
        }

        // Depuis la fiche programme → ouvrir OCH avec le bon lien
        function openOchFromProgram() {
            const fallback = OCH_URL;
            const url = state.program && state.program.ochUrl ? state.program.ochUrl : fallback;
            state.ochUrlToOpen = url;
            state.modal = 'OCH';
            render();
        }

        /* ========= RENDER GLOBAL ========= */
        function render() {
            const app = document.getElementById('app');

            app.innerHTML = (state.screen === 'GATE') ? renderGate() : renderApp();

            if (window.lucide && typeof lucide.createIcons === 'function') {
                lucide.createIcons();
            }

            if (state.screen === 'APP') handleScroll();
        }

        /* ========= ÉCRAN D’ACCUEIL (PROFILS) ========= */
        function renderGate() {
            let profs = state.profiles.map(p => `
                <div onclick="login(${p.id})" class="flex flex-col items-center gap-3 cursor-pointer group">
                    <div class="w-24 h-24 rounded-md flex items-center justify-center text-3xl font-bold text-white border-2 group-hover:border-white transition"
                        style="background-color:${p.theme.color}; box-shadow:0 0 20px ${p.theme.shadow};">
                        ${p.name.charAt(0)}
                    </div>
                    <span class="text-gray-400 group-hover:text-white">${p.name}</span>
                </div>
            `).join('');

            return `
            <div class="min-h-screen flex flex-col items-center justify-center text-center px-4">
                <h1 class="text-4xl font-black text-sira-gold mb-10">SIRA CORANIQUE</h1>
                <h2 class="text-xl mb-6 text-gray-200">Qui se connecte ?</h2>
                <div class="flex flex-wrap justify-center gap-8 mb-12">
                    ${profs}
                    <div onclick="openModal('CREATE_PROFILE')" class="flex flex-col items-center gap-3 cursor-pointer group">
                        <div class="w-24 h-24 rounded-full border-2 border-gray-600 flex items-center justify-center text-gray-500 group-hover:border-white group-hover:text-white transition">
                            <i data-lucide="plus" class="w-10 h-10"></i>
                        </div>
                        <span class="text-gray-500 group-hover:text-white">Ajouter</span>
                    </div>
                </div>
                ${state.modal === 'CREATE_PROFILE' ? renderCreateProfileModal() : ''}
            </div>`;
        }

        function renderCreateProfileModal() {
            return `
            <div class="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                <div class="bg-gray-900 p-8 rounded-xl text-center w-full max-w-md border border-gray-800">
                    <h3 class="text-2xl mb-6 font-bold text-white">Nouveau Profil</h3>
                    <input id="new-profile-name" type="text" placeholder="Ton prénom"
                        class="w-full bg-gray-800 text-white p-4 rounded mb-6 border border-gray-700 focus:border-sira-gold outline-none">
                    <div class="flex gap-4">
                        <button onclick="closeModal()" class="flex-1 py-3 text-gray-300">Annuler</button>
                        <button onclick="createProfile(document.getElementById('new-profile-name').value)" class="flex-1 bg-sira-gold text-black font-bold py-3 rounded">Créer</button>
                    </div>
                </div>
            </div>`;
        }

        /* ========= VUE APP ========= */
        function renderApp() {
            return `
            <div class="min-h-screen pb-24">
                ${renderNavbar()}
                ${renderHero()}
                ${renderSeasonsRail()}
                ${state.modal === 'PROGRAM_CARD' ? renderProgramCardModal() : ''}
                ${state.modal === 'OCH' ? renderOchModal() : ''}
            </div>`;
        }

        function renderNavbar() {
            const initial = state.currentProfile ? state.currentProfile.name.charAt(0) : '?';
            return `
            <nav id="navbar" class="fixed top-0 w-full bg-gradient-to-b from-black/80 to-transparent z-40 px-4 py-4 flex justify-between items-center">
                <h1 class="text-xl font-black text-sira-gold">SIRA</h1>
                <div class="flex items-center gap-3">
                    <button onclick="toggleSound()" class="text-gray-400 hover:text-sira-gold">
                        <i data-lucide="${state.isMuted ? 'volume-x' : 'volume-2'}" class="w-5 h-5"></i>
                    </button>
                    <div class="flex items-center gap-2 bg-gray-900/80 px-3 py-1 rounded-full border border-gray-700">
                        <div class="w-8 h-8 rounded-full theme-bg flex items-center justify-center text-white font-bold text-sm">${initial}</div>
                        <button onclick="logout()" class="text-xs text-gray-400 hover:text-white">Changer</button>
                    </div>
                </div>
            </nav>`;
        }

        /* ========= HERO ========= */
        function renderHero() {
            const name = state.currentProfile ? state.currentProfile.name : '';
            return `
            <div class="min-h-[60vh] flex flex-col justify-end pb-16 pt-24 relative">
                <div class="absolute inset-0 bg-cover bg-center opacity-60"
                    style="background-image: linear-gradient(to top, #0a0e17 5%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.2) 80%), url('https://i.postimg.cc/25Jybx2z/1764964492743.png');">
                </div>
                <div class="relative z-10 px-6">
                    <p class="text-sm text-sira-gold mb-1">Bienvenue ${name}</p>
                    <h1 class="text-3xl font-black text-white mb-2">Un parcours SIRA pensé pour toi</h1>
                    <p class="text-sm text-gray-200 max-w-md mb-6">
                        Découvre la vie du Prophète ﷺ comme une série : épisodes, saisons, défis, réflexions… tout en restant fidèle au Coran et à la Sunna.
                    </p>
                    <div class="flex flex-wrap gap-3">
                        <button
                            onclick="openProgramCard('hero')"
                            class="bg-sira-gold text-black px-6 py-3 rounded-full font-bold shadow">
                            Voir la fiche du programme
                        </button>
                        <button
                            onclick="document.getElementById('sira-seasons')?.scrollIntoView({behavior:'smooth'})"
                            class="bg-white/10 text-white px-5 py-3 rounded-full text-sm border border-white/20">
                            Parcourir les saisons
                        </button>
                    </div>
                </div>
            </div>`;
        }

        /* ========= RAIL SAISONS ========= */
        function renderSeasonsRail() {
            return `
            <section id="sira-seasons" class="px-6 pt-4">
                <h2 class="text-xl font-bold mb-3">Saisons SIRA</h2>
                <p class="text-xs text-gray-400 mb-4">
                    Clique sur une saison pour lire le résumé avant d’entrer dans les cours.
                </p>
                <div class="flex gap-4 overflow-x-auto pb-3 hide-scrollbar">
                    <!-- Saison 1 -->
                    <div
                        class="min-w-[230px] bg-white/5 rounded-2xl overflow-hidden cursor-pointer hover:bg-white/10 transition"
                        onclick="openProgramCard('saison1')">
                        <div class="h-32 bg-cover bg-center"
                             style="background-image:url('https://i.postimg.cc/7hb7rc2p/pexels-ahmed-aqtai-1804912-3332857.jpg');">
                        </div>
                        <div class="p-3">
                            <p class="text-[10px] uppercase tracking-wide text-sira-gold font-semibold mb-1">Saison 1</p>
                            <h3 class="text-sm font-bold">La Mecque – Les débuts de la Révélation</h3>
                            <p class="text-[11px] text-gray-300 mt-1">
                                La foi au milieu des moqueries, de la pression et des premières persécutions.
                            </p>
                        </div>
                    </div>

                    <!-- Saison 2 -->
                    <div
                        class="min-w-[230px] bg-white/5 rounded-2xl overflow-hidden cursor-pointer hover:bg-white/10 transition"
                        onclick="openProgramCard('saison2')">
                        <div class="h-32 bg-cover bg-center"
                             style="background-image:url('https://i.postimg.cc/4xBFp9bB/pexels-shymar-salas-12263070.jpg');">
                        </div>
                        <div class="p-3">
                            <p class="text-[10px] uppercase tracking-wide text-sira-gold font-semibold mb-1">Saison 2</p>
                            <h3 class="text-sm font-bold">Médine – Construire une communauté</h3>
                            <p class="text-[11px] text-gray-300 mt-1">
                                Fraternité, justice, solidarité : comment la Sira construit une société lumière.
                            </p>
                        </div>
                    </div>
                </div>
            </section>`;
        }

        /* ========= MODALE FICHE PROGRAMME ========= */
        function renderProgramCardModal() {
            const p = state.program;
            if (!p) return '';

            const bg = p.image || "https://i.postimg.cc/25Jybx2z/1764964492743.png";

            return `
            <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-fade-in">
                <div class="bg-sira-dark border border-gray-800 rounded-2xl w-full max-w-lg overflow-hidden animate-slide-up">
                    <!-- Image -->
                    <div class="h-40 bg-cover bg-center" style="background-image:url('${bg}');">
                        <div class="w-full h-full bg-gradient-to-t from-black/70 via-black/10 to-transparent flex items-start justify-between px-4 py-3">
                            <span class="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-black/40 text-sira-gold font-semibold uppercase tracking-wide">
                                <i data-lucide="sparkles" class="w-3 h-3"></i>
                                ${p.tag || 'Programme'}
                            </span>
                            <button onclick="closeModal()" class="p-1 rounded-full bg-black/50 hover:bg-black/70">
                                <i data-lucide="x" class="w-4 h-4 text-gray-200"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Contenu -->
                    <div class="p-5 space-y-3">
                        <div>
                            <h2 class="text-lg font-bold mb-1">${p.title}</h2>
                            ${p.subtitle ? `<p class="text-xs text-gray-300">${p.subtitle}</p>` : ''}
                        </div>
                        <p class="text-sm text-gray-200 leading-relaxed">
                            ${p.description}
                        </p>
                        ${p.details ? `<p class="text-[11px] text-gray-400">${p.details}</p>` : ''}

                        <div class="flex flex-wrap gap-3 pt-3">
                            <button
                                onclick="openOchFromProgram()"
                                class="flex-1 bg-sira-gold text-black font-semibold py-2.5 rounded-full text-sm shadow">
                                Accéder aux cours
                            </button>
                            <button
                                onclick="closeModal()"
                                class="px-4 py-2 text-xs text-gray-300 border border-gray-700 rounded-full">
                                Fermer
                            </button>
                        </div>

                        <p class="text-[10px] text-gray-500 pt-1">
                            L’accès se fait via ton espace sécurisé OCH (OnlineCourseHost).
                        </p>
                    </div>
                </div>
            </div>`;
        }

        /* ========= MODALE OCH ========= */
        function renderOchModal() {
            return `
            <div class="fixed inset-0 z-50 flex flex-col bg-black/90 animate-fade-in">
                <div class="flex items-center justify-between px-4 py-3 bg-sira-dark border-b border-gray-800">
                    <div class="flex items-center gap-2">
                        <i data-lucide="tv-minimal" class="w-4 h-4 text-sira-gold"></i>
                        <h2 class="text-sm font-bold text-white">Espace de cours — Deenvertissement / OCH</h2>
                    </div>
                    <button onclick="closeModal()" class="p-2 rounded-full bg-gray-800 hover:bg-gray-700">
                        <i data-lucide="x" class="w-5 h-5 text-gray-300"></i>
                    </button>
                </div>
                <iframe src="${state.ochUrlToOpen || OCH_URL}" class="w-full h-full border-none"></iframe>
            </div>`;
        }

        /* ========= LANCEMENT ========= */
        init();
