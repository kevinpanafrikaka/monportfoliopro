document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. THEME CLAIR / SOMBRE
       ========================================================================== */
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

    // Appliquer le theme initial
    document.body.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', () => {
        const theme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateThemeIcon(theme);
    });

    function updateThemeIcon(theme) {
        const moonIcon = themeToggle.querySelector('.fa-moon');
        const sunIcon = themeToggle.querySelector('.fa-sun');
        if (theme === 'dark') {
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'block';
        } else {
            moonIcon.style.display = 'block';
            sunIcon.style.display = 'none';
        }
    }


    /* ==========================================================================
       2. MENU MOBILE (HAMBURGER)
       ========================================================================== */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Fermer le menu mobile en cliquant sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });


    /* ==========================================================================
       3. NAVIGATION ACTIVE AU SCROLL (SCROLL SPY)
       ========================================================================== */
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - varNavbarHeightOffset())) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    function varNavbarHeightOffset() {
        return window.innerWidth <= 768 ? 90 : 100;
    }


    /* ==========================================================================
       4. ANIMATIONS D'APPARITION (SCROLL REVEAL & SKILLS PROGRESS)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal');
    const skillProgresses = document.querySelectorAll('.skill-progress');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-reveal');
                observer.unobserve(entry.target); // Animation unique
                
                // Si la section contient des barres de progression, on les anime
                if (entry.target.classList.contains('skills-column') || entry.target.querySelector('.skills-column')) {
                    animateSkills();
                }
            }
        });
    }, {
        threshold: 0.15
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // Fonction pour animer les barres de competence
    function animateSkills() {
        skillProgresses.forEach(progress => {
            const level = progress.getAttribute('data-level');
            progress.style.width = level;
        });
    }


    /* ==========================================================================
       5. FILTRAGE DYNAMIQUE DES PROJETS
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Changer le bouton actif
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                
                // Animation de sortie
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || categories.includes(filterValue)) {
                        card.style.display = 'flex';
                        // Forcer le reflow
                        card.offsetHeight;
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    } else {
                        card.style.display = 'none';
                    }
                }, 200);
            });
        });
    });


    /* ==========================================================================
       6. FORMULAIRE DE CONTACT
       ========================================================================== */
    const contactForm = document.getElementById('portfolio-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Récupérer le bouton de soumission et son contenu d'origine
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            // Mettre le bouton en état de chargement
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Envoi en cours...';
            submitBtn.disabled = true;

            const name = document.getElementById('form-name').value;
            const email = document.getElementById('form-email').value;
            const subject = document.getElementById('form-subject').value;
            const message = document.getElementById('form-message').value;

            // Envoi des données à l'API de Web3Forms
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    // Remplacer "VOTRE_CLE_API_ICI" par la clé d'accès (Access Key) fournie par Web3Forms
                    access_key: 'c74d3647-f86c-46b1-8d76-13fa42101b43',
                    name: name,
                    email: email,
                    subject: subject,
                    message: message
                })
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status === 200) {
                    showNotification(`Merci ${name} ! Votre message a bien été envoyé. Vous recevrez une notification par email.`, 'success');
                    contactForm.reset();
                } else {
                    console.log(response);
                    showNotification("Erreur lors de l'envoi : " + (json.message || "Une erreur s'est produite."), 'error');
                }
            })
            .catch(error => {
                console.log(error);
                showNotification("Une erreur de réseau s'est produite. Veuillez vérifier votre connexion et réessayer.", 'error');
            })
            .then(() => {
                // Rétablir le bouton après la soumission
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }

});


/* ==========================================================================
   7. ONGLETS DE LA SECTION CANDIDATURE
   ========================================================================== */
function switchTab(event, tabId) {
    // Masquer tous les onglets
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));

    // Desactiver tous les boutons d'onglet
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));

    // Afficher l'onglet selectionne
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}


/* ==========================================================================
   8. MODAL LECTEUR PDF
   ========================================================================== */
function openPdfModal(pdfPath) {
    const modal = document.getElementById('pdf-modal');
    const iframe = document.getElementById('pdf-frame');
    const title = document.getElementById('pdf-modal-title');

    // Adapter le titre
    if (pdfPath.includes('CV')) {
        title.innerHTML = '<i class="fa-solid fa-file-pdf"></i> Curriculum Vitae — Bangoura Kevin';
    } else {
        title.innerHTML = '<i class="fa-solid fa-envelope-open-text"></i> Lettre de Motivation — Bangoura Kevin';
    }

    iframe.src = pdfPath;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Bloquer le scroll de fond
}

function closePdfModal() {
    const modal = document.getElementById('pdf-modal');
    const iframe = document.getElementById('pdf-frame');
    
    modal.classList.remove('active');
    iframe.src = ''; // Vider la source pour arreter le chargement
    document.body.style.overflow = '';
}

// Fermeture des modals au clic en dehors du contenu
window.addEventListener('click', (e) => {
    const pdfModal = document.getElementById('pdf-modal');
    const projectModal = document.getElementById('project-modal');
    
    if (e.target === pdfModal) {
        closePdfModal();
    }
    if (e.target === projectModal) {
        closeProjectModal();
    }
});


/* ==========================================================================
   9. MODAL DETAILS PROJET & DONNEES
   ========================================================================== */
const projectsData = {
    kharan: {
        title: "KHARAN — EdTech propulsée par l'IA",
        category: "🎓 ÉducTech / 🤖 IA / 💻 Développement",
        image: "assets/images/image_haran.png",
        tags: ["Node.js", "PostgreSQL", "JavaScript", "Claude API", "PWA"],
        context: "KHARAN est né du constat que le soutien scolaire classique en Guinée est souvent inaccessible financièrement et non adapté au rythme individuel de chaque élève.",
        objectives: "Concevoir une plateforme web intelligente capable d'agir comme un tuteur privé disponible 24h/24. L'application évalue le niveau de l'étudiant à travers des exercices interactifs, détecte ses lacunes spécifiques grâce à un modèle d'IA et génère des leçons sur-mesure adaptées à sa vitesse de compréhension.",
        features: [
            "Génération dynamique d'exercices personnalisés via l'API Claude.",
            "Suivi de progression et base de données PostgreSQL pour stocker les profils utilisateurs.",
            "Interface Progressive Web App (PWA) fluide utilisable hors-ligne pour pallier les problèmes de connexion réseau.",
            "Module de chat interactif avec un tuteur virtuel pédagogique."
        ],
        stack: "Node.js (Backend), Express.js, PostgreSQL (Base de données), JavaScript Vanilla (Frontend), CSS3 Moderne, APIs Claude (Anthropic)."
    },
    cee: {
        title: "Le Grand Défi du CEE — Quiz Interactif",
        category: "🎓 ÉducTech / 💻 Développement",
        image: null,
        tags: ["JavaScript", "CSS3", "HTML5", "Éducation"],
        context: "Développé pour offrir aux candidats du Certificat d'Études Élémentaires (CEE) un outil de révision ludique et motivant.",
        objectives: "Proposer une application web simple et accessible sans inscription obligatoire, permettant aux élèves de tester leurs connaissances sur le programme officiel guinéen.",
        features: [
            "Base de questions couvrant les mathématiques, les sciences, l'histoire et la géographie.",
            "Système de score dynamique et chronomètre pour stimuler la concentration.",
            "Correction détaillée et explicative affichée immédiatement après chaque réponse.",
            "Design coloré et adaptatif pensé pour les smartphones des parents."
        ],
        stack: "HTML5 sémantique, CSS3 (animations et design responsive), JavaScript Vanilla (logique de jeu et stockage des scores locaux via LocalStorage)."
    },
    budget: {
        title: "Gestionnaire de Budget Automatisé",
        category: "💻 Développement / Outils Bureautique",
        image: null,
        tags: ["Excel", "VBA", "Automatisation", "Finance"],
        context: "Outil personnel conçu pour optimiser le suivi financier et l'organisation budgétaire mensuelle.",
        objectives: "Automatiser la saisie des dépenses et générer instantanément des visualisations graphiques de la répartition du budget.",
        features: [
            "Formulaires de saisie conviviaux programmés en VBA.",
            "Calcul automatique des soldes restants et des projections d'épargne.",
            "Catégorisation des dépenses et graphiques de synthèse interactifs."
        ],
        stack: "Microsoft Excel, Macros VBA (Visual Basic for Applications)."
    }
};

function openProjectModal(projectId) {
    const modal = document.getElementById('project-modal');
    const body = document.getElementById('project-modal-body');
    const project = projectsData[projectId];

    if (!project) return;

    // Generer le HTML du detail du projet
    let tagsHtml = project.tags.map(t => `<span class="project-tag" style="background-color: var(--bg-tertiary); color: var(--text-muted); font-size: 0.8rem; font-weight: 600; padding: 0.3rem 0.8rem; border-radius: 4px; margin-right: 0.5rem; margin-bottom: 0.5rem; display: inline-block;">#${t}</span>`).join('');
    
    let featuresHtml = '';
    if (project.features) {
        featuresHtml = `
            <div style="margin-top: 1.5rem;">
                <h4 style="font-family: 'Inter', sans-serif; font-size: 1.1rem; font-weight: 600; color: var(--color-accent); margin-bottom: 0.5rem;"><i class="fa-solid fa-list-check"></i> Fonctionnalités clés :</h4>
                <ul style="padding-left: 1.5rem; color: var(--text-secondary); font-size: 0.95rem; display: flex; flex-direction: column; gap: 0.4rem;">
                    ${project.features.map(f => `<li>${f}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    let imageHtml = '';
    if (project.image) {
        imageHtml = `
            <div style="width: 100%; max-height: 250px; overflow: hidden; border-radius: 6px; margin-bottom: 1.5rem; border: 1px solid var(--border-color);">
                <img src="${project.image}" alt="${project.title}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
        `;
    }

    body.innerHTML = `
        ${imageHtml}
        <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--color-accent); letter-spacing: 1px;">${project.category}</span>
        <h3 style="font-size: 1.8rem; margin-top: 0.25rem; margin-bottom: 1rem; font-family: 'Playfair Display', serif;">${project.title}</h3>
        
        <div style="margin-bottom: 1.5rem;">
            ${tagsHtml}
        </div>

        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <div>
                <h4 style="font-family: 'Inter', sans-serif; font-size: 1.1rem; font-weight: 600; color: var(--color-primary); margin-bottom: 0.5rem;"><i class="fa-solid fa-circle-question"></i> Contexte :</h4>
                <p style="color: var(--text-secondary); font-size: 0.95rem;">${project.context}</p>
            </div>
            
            <div>
                <h4 style="font-family: 'Inter', sans-serif; font-size: 1.1rem; font-weight: 600; color: var(--color-primary); margin-bottom: 0.5rem;"><i class="fa-solid fa-bullseye"></i> Objectifs & Rôle :</h4>
                <p style="color: var(--text-secondary); font-size: 0.95rem;">${project.objectives}</p>
            </div>

            ${featuresHtml}

            <div style="background-color: var(--bg-tertiary); padding: 1.25rem; border-radius: 6px; border-left: 4px solid var(--color-accent); margin-top: 1rem;">
                <h4 style="font-family: 'Inter', sans-serif; font-size: 1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.4rem;"><i class="fa-solid fa-layer-group"></i> Stack technique :</h4>
                <p style="color: var(--text-secondary); font-size: 0.9rem; font-weight: 500;">${project.stack}</p>
            </div>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

/* ==========================================================================
   NOTIFICATION SYSTEM (TOAST)
   ========================================================================== */
function showNotification(message, type = 'success') {
    // Supprimer une notification existante
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }

    // Créer la structure HTML du toast
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;

    const iconClass = type === 'success' ? 'fa-circle-check' : 'fa-circle-xmark';
    
    toast.innerHTML = `
        <i class="fa-solid ${iconClass} toast-icon"></i>
        <div style="flex-grow: 1;">${message}</div>
    `;

    document.body.appendChild(toast);

    // Déclencher la transition d'apparition
    setTimeout(() => {
        toast.classList.add('active');
    }, 10);

    // Faire disparaître après 5 secondes
    setTimeout(() => {
        toast.classList.remove('active');
        // Supprimer complètement du DOM après disparition de l'opacité
        setTimeout(() => {
            toast.remove();
        }, 400);
    }, 5000);
}
