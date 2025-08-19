
// Gestion de l'écran de chargement
let loadingProgress = 0;
const loadingSteps = [
    { progress: 10, text: "Initialisation..." },
    { progress: 25, text: "Chargement des ressources..." },
    { progress: 40, text: "Préparation de l'interface..." },
    { progress: 60, text: "Configuration des applications..." },
    { progress: 80, text: "Finalisation..." },
    { progress: 100, text: "Prêt !" }
];

function updateLoadingProgress(progress, text) {
    const loadingBar = document.getElementById('loadingBar');
    
    if (loadingBar) {
        loadingBar.style.width = progress + '%';
    }
}

function simulateLoading() {
    let currentStep = 0;
    let resourcesLoaded = 0;
    const totalResources = 5; // Nombre approximatif de ressources à charger
    
    // Vérifier le chargement des ressources importantes
    const checkResources = () => {
        const images = document.querySelectorAll('img');
        const videos = document.querySelectorAll('video');
        const totalElements = images.length + videos.length;
        
        if (totalElements > 0) {
            resourcesLoaded = Math.min(totalElements, totalResources);
        }
    };
    
    // Vérifier périodiquement les ressources
    const resourceCheckInterval = setInterval(() => {
        checkResources();
    }, 100);
    
    const loadingInterval = setInterval(() => {
        if (currentStep < loadingSteps.length) {
            const step = loadingSteps[currentStep];
            
            // Ajuster la progression en fonction des ressources chargées
            let adjustedProgress = step.progress;
            if (currentStep >= 1 && currentStep <= 3) {
                adjustedProgress = Math.min(step.progress, 25 + (resourcesLoaded / totalResources) * 35);
            }
            
            updateLoadingProgress(adjustedProgress, step.text);
            currentStep++;
        } else {
            clearInterval(loadingInterval);
            clearInterval(resourceCheckInterval);
            
            // Attendre un peu avant de masquer l'écran de chargement
            setTimeout(() => {
                const loadingScreen = document.getElementById('loadingScreen');
                if (loadingScreen) {
                    loadingScreen.classList.add('fade-out');
                    
                    // Masquer complètement après l'animation
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                    }, 800);
                }
            }, 500);
        }
    }, 300); // Chaque étape dure 300ms
}

function updateTime() {
    const now = new Date();
    const timeElement = document.querySelector('.date_actuel');

    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    const day = now.getDate();
    const monthNames = [
        'janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin',
        'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'
    ];
    const month = monthNames[now.getMonth()];

    timeElement.textContent = `${day} ${month} ${hours}:${minutes}`;
}


updateTime();


setInterval(updateTime, 1000);


class HoverOutlineEffect {
    constructor(element, options = {}) {
        this.element = element;
        this.letters = [];
        this.isHovering = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.maxDistance = options.maxDistance || 100;
        this.maxOutlineWidth = options.maxOutlineWidth || 10;
        this.maxLetterSpacing = options.maxLetterSpacing || 9;

        this.init();
    }

    init() {

        const text = this.element.textContent;
        this.element.textContent = '';

        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.className = 'letter';
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.dataset.index = index;
            this.element.appendChild(span);
            this.letters.push(span);
        });



        this.element.addEventListener('mouseenter', () => {
            this.isHovering = true;
        });

        this.element.addEventListener('mouseleave', () => {
            this.isHovering = false;
            this.fadeOutEffect();
        });

        this.element.addEventListener('mousemove', (e) => {
            if (this.isHovering) {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
                this.updateOutlines();
            }
        });


        document.addEventListener('mousemove', (e) => {
            const rect = this.element.getBoundingClientRect();
            const extendedRect = {
                left: rect.left - 50,
                right: rect.right + 50,
                top: rect.top - 50,
                bottom: rect.bottom + 50
            };

            const isNearElement = e.clientX >= extendedRect.left &&
                e.clientX <= extendedRect.right &&
                e.clientY >= extendedRect.top &&
                e.clientY <= extendedRect.bottom;

            if (isNearElement && !this.isHovering) {
                this.isHovering = true;
            } else if (!isNearElement && this.isHovering) {
                this.isHovering = false;
                this.fadeOutEffect();
            }

            if (this.isHovering) {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
                this.updateOutlines();
            }
        });
    }

    updateOutlines() {
        this.letters.forEach((letter, index) => {
            const rect = letter.getBoundingClientRect();
            const letterCenterX = rect.left + rect.width / 2;
            const letterCenterY = rect.top + rect.height / 2;

            const distance = Math.sqrt(
                Math.pow(this.mouseX - letterCenterX, 2) +
                Math.pow(this.mouseY - letterCenterY, 2)
            );

            if (distance <= this.maxDistance) {

                const intensity = 1 - (distance / this.maxDistance);
                const outlineWidth = Math.max(0, intensity * this.maxOutlineWidth);
                const letterSpacing = Math.max(0, intensity * this.maxLetterSpacing);

                letter.style.webkitTextStroke = `${outlineWidth}px var(--text-color)`;
                letter.style.textStroke = `${outlineWidth}px var(--text-color)`;
                letter.style.letterSpacing = `${letterSpacing}px`;
            } else {
                letter.style.webkitTextStroke = '0px var(--text-color)';
                letter.style.textStroke = '0px var(--text-color)';
                letter.style.letterSpacing = '0px';
            }
        });
    }

    fadeOutEffect() {

        const lastMouseX = this.mouseX;
        const lastMouseY = this.mouseY;

        let fadeIntensity = 1;
        const fadeInterval = setInterval(() => {
            fadeIntensity -= 0.05;

            if (fadeIntensity <= 0) {
                fadeIntensity = 0;
                clearInterval(fadeInterval);
            }

            this.letters.forEach(letter => {
                const rect = letter.getBoundingClientRect();
                const letterCenterX = rect.left + rect.width / 2;
                const letterCenterY = rect.top + rect.height / 2;

                const distance = Math.sqrt(
                    Math.pow(lastMouseX - letterCenterX, 2) +
                    Math.pow(lastMouseY - letterCenterY, 2)
                );

                if (distance <= this.maxDistance) {
                    const intensity = (1 - (distance / this.maxDistance)) * fadeIntensity;
                    const outlineWidth = Math.max(0, intensity * this.maxOutlineWidth);
                    const letterSpacing = Math.max(0, intensity * this.maxLetterSpacing);

                    letter.style.webkitTextStroke = `${outlineWidth}px var(--text-color)`;
                    letter.style.textStroke = `${outlineWidth}px var(--text-color)`;
                    letter.style.letterSpacing = `${letterSpacing}px`;
                } else {
                    letter.style.webkitTextStroke = '0px var(--text-color)';
                    letter.style.textStroke = '0px var(--text-color)';
                    letter.style.letterSpacing = '0px';
                }
            });
        }, 16);
    }

    resetOutlines() {
        this.letters.forEach(letter => {
            letter.style.webkitTextStroke = '0px var(--text-color)';
            letter.style.textStroke = '0px var(--text-color)';
            letter.style.letterSpacing = '0px';
        });
    }
}

// Variables globales pour la gestion des couches
let currentZIndex = 2000;
let activeWindow = null;
let openNotes = []; // Tableau pour stocker les notes ouvertes

// Fonction pour créer une fenêtre de note
function createNoteWindow(noteType) {
    console.log('Création d\'une nouvelle note:', noteType);
    const noteModal = document.createElement('div');
    noteModal.className = 'note-modal';
    noteModal.id = `noteModal-${noteType}`;
    noteModal.style.display = 'block';
    noteModal.style.zIndex = '2000';
    
    // Contenu différent selon le type de note
    let noteContent = '';
    let noteTitle = '';
    
    switch(noteType) {
        case 'commprj1':
            noteContent = `
                <p>Pas finit</p>
            `;
            noteTitle = 'Client_Comment.txt';
            break;
        case 'commprj2':
            noteContent = `
                <p><strong>Server Maker</strong> — An AI that creates your Discord server in the blink of an eye!</p>
                <p>Simply describe the server you want, and the AI takes care of the rest. Chat with the AI to adjust everything to your needs:</p>
                <ul>
                    <li>Creation of the basic structure</li>
                    <li>Permission configuration</li>
                    <li>Setup of log channels</li>
                    <li>Ticket management</li>
                </ul>
            `;
            noteTitle = 'Project_Concept.txt';
            break;
        case 'commprj3':
            noteContent = `
                <p><strong>Pixels-Board</strong></p>
                <p>Pixels-Board is a web application that recreates the r/place (pixel war) experience, but on an infinite canvas with a wide range of creative tools. Collaborate with others in real time to place pixels, draw, and create massive artworks together.</p>
                <p><strong>Technologies used:</strong></p>
                <ul>
                    <li>WebSocket for real-time synchronization</li>
                    <li>Realtime database for instant updates</li>
                    <li>Custom drawing tools and color picker</li>
                    <li>Infinite canvas navigation</li>
                </ul>
            `;
            noteTitle = 'Project_Concept.txt';
            break;
        case 'commprj4':
            noteContent = `
                <p><strong>Sharealuxz Project</strong></p>
                <p>A service that enables secure file transfers without the server ever having access to your files.</p>
                <p><strong>Key Features:</strong></p>
                <ul>
                    <li>End-to-end encryption</li>
                    <li>No data storage on the server</li>
                    <li>Simple and intuitive interface</li>
                    <li>Client-server-client architecture</li>
                </ul>
            `;
            noteTitle = 'Project_Concept.txt';
            break;
    }
    
    noteModal.innerHTML = `
        <div class="note-window" id="noteWindow-${noteType}">
            <div class="note-header">
                <div class="note-dots">
                    <div class="note-dotr"></div>
                    <div class="note-doty"></div>
                    <div class="note-dotg"></div>
                </div>
                <div class="note-title">${noteTitle}</div>
            </div>
            <div class="note-content">
                ${noteContent}
            </div>
        </div>
    `;
    
    document.body.appendChild(noteModal);
    
    // Rendre la fenêtre déplaçable
    const noteWindow = noteModal.querySelector('.note-window');
    makeNoteWindowDraggable(noteWindow, noteType);
    
    // Ajouter les événements sur les boutons de la note
    const closeButton = noteModal.querySelector('.note-dotr');
    const minimizeButton = noteModal.querySelector('.note-doty');
    
    if (closeButton) {
        console.log(`Bouton rouge de la note ${noteType} trouvé, ajout de l'événement de fermeture`);
        closeButton.addEventListener('click', (e) => {
            console.log(`Clic sur le bouton rouge de la note ${noteType}`);
            e.preventDefault();
            e.stopPropagation();
            closeNoteWindow(noteType);
        });
    }
    
    if (minimizeButton) {
        console.log(`Bouton jaune de la note ${noteType} trouvé, ajout de l'événement de minimisation`);
        minimizeButton.addEventListener('click', (e) => {
            console.log(`Clic sur le bouton jaune de la note ${noteType}`);
            e.preventDefault();
            e.stopPropagation();
            minimizeNoteWindow(noteType);
        });
    }
    
    // Ajouter la note au tableau des notes ouvertes
    openNotes.push(noteModal);
    
    // Mettre au premier plan après 0.1 seconde
    setTimeout(() => {
        bringToFront(noteModal);
    }, 100);
    
    return noteModal;
}

// Fonction pour fermer une fenêtre de note spécifique
function closeNoteWindow(noteType) {
    console.log('Tentative de fermeture de la note:', noteType);
    const noteModal = document.getElementById(`noteModal-${noteType}`);
    if (noteModal) {
        noteModal.remove();
        // Retirer de la liste des notes ouvertes
        openNotes = openNotes.filter(note => note !== noteModal);
        console.log(`Note ${noteType} fermée avec succès`);
    } else {
        console.log(`Note ${noteType} non trouvée pour fermeture`);
    }
}

// Fonction pour ouvrir la fenêtre de note
function openNoteWindow(noteType) {
    console.log('Tentative d\'ouverture de la note:', noteType);
    
    // Vérifier si la note est déjà ouverte
    const existingNote = document.getElementById(`noteModal-${noteType}`);
    if (existingNote) {
        console.log('Note déjà ouverte, mise au premier plan');
        // Si déjà ouverte, la mettre au premier plan
        existingNote.style.display = 'block';
        bringToFront(existingNote);
        return;
    }
    
    console.log('Création d\'une nouvelle note');
    // Créer une nouvelle fenêtre de note
    createNoteWindow(noteType);
}

// Fonction utilitaire pour contraindre le déplacement d'une fenêtre
function constrainWindowPosition(windowElement, newLeft, newTop) {
    const windowsContainer = document.querySelector('.windows');
    const windowsRect = windowsContainer.getBoundingClientRect();
    const windowRect = windowElement.getBoundingClientRect();
    
    // Contraintes pour empêcher la fenêtre de sortir de .windows
    const maxLeft = windowsRect.right - windowRect.width;
    const maxTop = windowsRect.bottom - windowRect.height;
    const minLeft = windowsRect.left;
    const minTop = windowsRect.top;
    
    // Appliquer les contraintes
    const constrainedLeft = Math.max(minLeft, Math.min(maxLeft, newLeft));
    const constrainedTop = Math.max(minTop, Math.min(maxTop, newTop));
    
    return { left: constrainedLeft, top: constrainedTop };
}

// Fonction pour mettre une fenêtre au premier plan
function bringToFront(windowElement) {
    console.log('bringToFront appelé avec:', windowElement);
    
    // Déterminer quel modal correspond à cette fenêtre
    let modalElement;
    if (windowElement.classList.contains('finder-windows')) {
        modalElement = document.querySelector('.finder-modal');
        console.log('Modal finder trouvé:', modalElement);
    } else if (windowElement.classList.contains('note-window')) {
        // Pour les fenêtres de note, remonter au modal parent
        modalElement = windowElement.closest('.note-modal');
        console.log('Modal note trouvé:', modalElement);
    } else if (windowElement.classList.contains('note-modal')) {
        modalElement = windowElement;
        console.log('Modal note direct trouvé:', modalElement);
    } else if (windowElement.classList.contains('contact-window')) {
        modalElement = document.getElementById('contactModal');
        console.log('Modal contact trouvé:', modalElement);
    } else if (windowElement.classList.contains('photos-window')) {
        modalElement = document.getElementById('photosModal');
        console.log('Modal photos trouvé:', modalElement);
    } else if (windowElement.classList.contains('calculator-window')) {
        modalElement = document.getElementById('calculatorModal');
        console.log('Modal calculator trouvé:', modalElement);
    }
    
    if (modalElement) {
        // Vérifier si le modal est déjà au premier plan pour éviter les boucles
        if (modalElement.style.zIndex === '9999') {
            console.log('Modal déjà au premier plan, pas de changement');
            return; // Sortir de la fonction pour éviter la boucle
        }
        
        // Mettre ce modal au premier plan
        modalElement.style.zIndex = '9999';
        console.log('Modal mis au premier plan avec z-index 9999');
        
        // Mettre les autres modals en arrière-plan
        const finderModal = document.querySelector('.finder-modal');
        const noteModals = document.querySelectorAll('.note-modal');
        const contactModal = document.getElementById('contactModal');
        const photosModal = document.getElementById('photosModal');
        const calculatorModal = document.getElementById('calculatorModal');
        
        if (modalElement === finderModal) {
            // Si c'est le finder qui passe au premier plan, mettre toutes les autres fenêtres en arrière-plan
            noteModals.forEach(noteModal => {
                noteModal.style.zIndex = '2000';
            });
            if (contactModal && contactModal !== modalElement) {
                contactModal.style.zIndex = '2000';
            }
            if (photosModal && photosModal !== modalElement) {
                photosModal.style.zIndex = '2000';
            }
            if (calculatorModal && calculatorModal !== modalElement) {
                calculatorModal.style.zIndex = '2000';
            }
        } else if (modalElement.classList.contains('note-modal')) {
            // Si c'est une note qui passe au premier plan, mettre le finder, contact et les autres notes en arrière-plan
            if (finderModal) {
                finderModal.style.zIndex = '2000';
            }
            if (contactModal && contactModal !== modalElement) {
                contactModal.style.zIndex = '2000';
            }
            if (photosModal && photosModal !== modalElement) {
                photosModal.style.zIndex = '2000';
            }
            if (calculatorModal && calculatorModal !== modalElement) {
                calculatorModal.style.zIndex = '2000';
            }
            noteModals.forEach(noteModal => {
                if (noteModal !== modalElement) {
                    noteModal.style.zIndex = '2000';
                }
            });
        } else if (modalElement === contactModal) {
            // Si c'est contact qui passe au premier plan, mettre finder et notes en arrière-plan
            if (finderModal) {
                finderModal.style.zIndex = '2000';
            }
            noteModals.forEach(noteModal => {
                noteModal.style.zIndex = '2000';
            });
            if (photosModal) {
                photosModal.style.zIndex = '2000';
            }
            if (calculatorModal) {
                calculatorModal.style.zIndex = '2000';
            }
        } else if (modalElement === photosModal) {
            // Si c'est Photos au premier plan, envoyer le reste derrière
            if (finderModal) finderModal.style.zIndex = '2000';
            if (contactModal) contactModal.style.zIndex = '2000';
            noteModals.forEach(noteModal => { noteModal.style.zIndex = '2000'; });
            if (calculatorModal) calculatorModal.style.zIndex = '2000';
        } else if (modalElement === calculatorModal) {
            // Si c'est le calculatrice qui passe au premier plan, envoyer le reste derrière
            if (finderModal) finderModal.style.zIndex = '2000';
            if (contactModal) contactModal.style.zIndex = '2000';
            noteModals.forEach(noteModal => { noteModal.style.zIndex = '2000'; });
            if (photosModal) photosModal.style.zIndex = '2000';
        }
    }
    
    console.log('bringToFront terminé');
}


document.addEventListener('DOMContentLoaded', () => {
    // Démarrer l'écran de chargement avec un délai de 0.1s
    setTimeout(() => {
        simulateLoading();
    }, 100);
    
    const welcomeText = document.getElementById('welcome-text');
    const portfolioText = document.getElementById('portfolio-text');
    const appleLogo = document.querySelector('header .left-part .icon');

    // Initialiser les effets de hover sur les textes
    if (welcomeText) new HoverOutlineEffect(welcomeText, {
        maxOutlineWidth: 1.6,
        maxLetterSpacing: 3
    });

    if (portfolioText) new HoverOutlineEffect(portfolioText, {
        maxOutlineWidth: 7,
        maxLetterSpacing: 9
    });

    // Initialiser la fonctionnalité du finder-modal
    initFinderModal();
    
    // Initialiser la fonctionnalité des fenêtres de notes
    initNoteWindows();
    
    // Initialiser la barre d'applications
    initDock();
    
    // Initialiser le menu déroulant Projects
    initProjectsMenu();
    
    // Initialiser le menu déroulant Contact
    initContactMenu();
    
    // Initialiser le premier projet comme actif
    const firstSidebarFolder = document.querySelector('.folder-finder');
    if (firstSidebarFolder) {
        firstSidebarFolder.classList.add('active');
        console.log('Premier projet initialisé comme actif');
    }
    
    // Permettre de cliquer sur le bureau pour mettre les fenêtres en arrière-plan
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.finder-modal') && !e.target.closest('.note-modal') && !e.target.closest('#contactModal') && !e.target.closest('#photosModal') && !e.target.closest('#calculatorModal')) {
            // Clic sur le bureau - mettre tous les modals en arrière-plan
            const finderModal = document.querySelector('.finder-modal');
            const noteModals = document.querySelectorAll('.note-modal');
            const contactModal = document.getElementById('contactModal');
            const photosModal = document.getElementById('photosModal');
            const calculatorModal = document.getElementById('calculatorModal');
            
            if (finderModal) finderModal.style.zIndex = '2000';
            noteModals.forEach(noteModal => { noteModal.style.zIndex = '2000'; });
            if (contactModal) contactModal.style.zIndex = '2000';
            if (photosModal) photosModal.style.zIndex = '2000';
            if (calculatorModal) calculatorModal.style.zIndex = '2000';
            
            console.log('Tous les modals remis en arrière-plan');
        }
    });

    // Lecture vidéo au clic sur le logo Apple
    if (appleLogo) {
        appleLogo.style.cursor = 'pointer';
        appleLogo.addEventListener('click', () => {
            const lb = document.getElementById('videoLightbox');
            const player = document.getElementById('videoPlayer');
            if (!lb || !player) return;
            player.src = 'assets/video/android-apple.mp4';
            lb.style.display = 'block';
            player.currentTime = 0;
            player.play().catch(() => {});
        });
    }
});

// Fonction pour initialiser le finder-modal
function initFinderModal() {
    const finderModal = document.querySelector('.finder-modal');
    const finderWindow = document.querySelector('.finder-windows');
    const folders = document.querySelectorAll('.fld');
    const sidebarFolders = document.querySelectorAll('.folder-finder');
    const headerContents = document.querySelectorAll('.header-content');
    const fileContents = document.querySelectorAll('.fils_content');
    
    console.log('Finder modal:', finderModal);
    console.log('Finder window:', finderWindow);
    console.log('Tous les éléments .finder-windows:', document.querySelectorAll('.finder-windows'));
    
    // Cacher le finder-modal par défaut
    if (finderModal) {
        finderModal.style.display = 'none';
        // S'assurer que le finder modal a un z-index initial
        if (!finderModal.style.zIndex) {
            finderModal.style.zIndex = '2000';
            console.log('Z-index initial appliqué au finder modal:', finderModal.style.zIndex);
        }
    }

    // Rendre le finder-modal déplaçable
    if (finderWindow) {
        console.log('Rendre le finder déplaçable');
        makeFinderWindowDraggable(finderWindow);
    } else {
        console.log('Finder window non trouvé!');
        // Essayer avec l'ID comme fallback
        const finderById = document.getElementById('finder');
        if (finderById) {
            console.log('Finder trouvé par ID, utiliser celui-ci');
            finderWindow = finderById;
            makeFinderWindowDraggable(finderWindow);
        }
    }

    // Ajouter l'événement de double-clic et clic simple sur chaque dossier
    folders.forEach((folder, index) => {
        let clickTimeout;
        let clickCount = 0;
        let isLongPress = false;
        let pressStartTime;
        
        folder.addEventListener('mousedown', (e) => {
            pressStartTime = Date.now();
            isLongPress = false;
        });
        
        folder.addEventListener('mouseup', (e) => {
            const pressDuration = Date.now() - pressStartTime;
            if (pressDuration > 100) {
                isLongPress = true;
            }
        });
        
        folder.addEventListener('click', (e) => {
            if (isLongPress) {
                return; // Ne pas traiter les clics longs
            }
            
            clickCount++;
            
            if (clickCount === 1) {
                clickTimeout = setTimeout(() => {
                    if (clickCount === 1 && !isLongPress) {
                        // Message différent selon le type d'élément
                        if (folder.classList.contains('discord-app')) {
                            showInfoMessage(folder, 'Double-cliquez pour rejoindre Discord');
                        } else if (folder.classList.contains('contact-app')) {
                            showInfoMessage(folder, 'Double-cliquez pour me contacter');
                        } else if (folder.classList.contains('photos-app')) {
                            showInfoMessage(folder, 'Double-cliquez pour ouvrir la galerie');
                        } else if (folder.classList.contains('other')) {
                            showInfoMessage(folder, 'Double-cliquez pour ouvrir Other Projects');
                        } else if (folder.classList.contains('calculator-app')) {
                            showInfoMessage(folder, 'Double-cliquez pour ouvrir la calculatrice');
                        } else {
                            showInfoMessage(folder, 'Double-cliquez pour ouvrir');
                        }
                    }
                }, 100); // Délai de 300ms pour détecter le double-clic
            }
        });
        
        folder.addEventListener('dblclick', (e) => {
            clearTimeout(clickTimeout);
            clickCount = 0;
            
            // Vérifier si c'est le dossier Trash
            if (folder.classList.contains('trash')) {
                console.log('Double-clic sur le dossier Trash du bureau');
                openFinderModal(0); // Ouvrir le finder
                setTimeout(() => {
                    showTrash(); // Puis afficher l'onglet Trash
                }, 100);
            } else if (folder.classList.contains('discord-app')) {
                // Ouvrir Discord dans un nouvel onglet
                console.log('Ouverture de Discord');
                window.open('https://discord.gg/nH9fWynF96', '_blank');
            } else if (folder.classList.contains('contact-app')) {
                // Ouvrir la fenêtre de contact
                console.log('Ouverture de la fenêtre de contact');
                openContactWindow();
            } else if (folder.classList.contains('photos-app')) {
                console.log('Ouverture de la galerie Photos');
                openPhotosWindow();
            } else if (folder.classList.contains('other')) {
                console.log('Ouverture Other Projects');
                window.open('https://projects.codealuxz.fr', '_blank');
            } else if (folder.classList.contains('calculator-app')) {
                console.log('Ouverture de la calculatrice');
                openCalculatorWindow();
            } else {
                openFinderModal(index);
            }
        });
    });

    sidebarFolders.forEach((sidebarFolder, index) => {
        sidebarFolder.addEventListener('click', () => {
            switchProject(index);
        });
    });
    
    // Ajouter l'événement de clic sur l'élément Trash
    const trashElement = document.querySelector('.trash-finder');
    if (trashElement) {
        console.log('Élément Trash trouvé, ajout de l\'événement de clic');
        trashElement.addEventListener('click', () => {
            showTrash();
        });
    } else {
        console.log('Élément Trash non trouvé dans la sidebar');
    }

    // Ajouter l'événement de fermeture sur le bouton rouge
    const closeButton = document.querySelector('.dotr');
    if (closeButton) {
        console.log('Bouton rouge du finder trouvé, ajout de l\'événement de fermeture');
        closeButton.addEventListener('click', (e) => {
            console.log('Clic sur le bouton rouge du finder détecté');
            e.preventDefault();
            e.stopPropagation();
            closeFinderModal();
        });
    } else {
        console.log('Bouton rouge du finder non trouvé!');
    }
    
    // Ajouter l'événement de minimisation sur le bouton jaune
    const minimizeButton = document.querySelector('.doty');
    if (minimizeButton) {
        console.log('Bouton jaune du finder trouvé, ajout de l\'événement de minimisation');
        minimizeButton.addEventListener('click', (e) => {
            console.log('Clic sur le bouton jaune du finder détecté');
            e.preventDefault();
            e.stopPropagation();
            const finderModal = document.querySelector('.finder-modal');
            if (finderModal) {
                finderModal.style.display = 'none';
                console.log('Finder minimisé');
            }
        });
    } else {
        console.log('Bouton jaune du finder non trouvé!');
    }
    
    // Ajouter la gestion des couches pour les clics sur la fenêtre
    if (finderWindow) {
        console.log('Ajouter les événements sur finderWindow');
        console.log('Z-index initial du finder:', finderWindow.style.zIndex);
        
        // S'assurer que le finder a un z-index initial
        if (!finderWindow.style.zIndex) {
            finderWindow.style.zIndex = '2000';
            console.log('Z-index initial appliqué au finder:', finderWindow.style.zIndex);
        }
        
        finderWindow.addEventListener('mousedown', (e) => {
            console.log('Clic sur finder-windows détecté!');
            if (!e.target.closest('.dots')) {
                bringToFront(finderWindow);
            }
        });
        
        // Ajouter la gestion des couches pour tous les éléments cliquables
        finderWindow.addEventListener('click', (e) => {
            console.log('Clic dans finder-windows détecté!');
            bringToFront(finderWindow);
        });
    } else {
        console.log('finderWindow est null, essayer de le récupérer');
        const finderById = document.getElementById('finder');
        if (finderById) {
            console.log('Ajouter les événements sur finderById');
            console.log('Z-index initial du finder (ID):', finderById.style.zIndex);
            
            // S'assurer que le finder a un z-index initial
            if (!finderById.style.zIndex) {
                finderById.style.zIndex = '2000';
                console.log('Z-index initial appliqué au finder (ID):', finderById.style.zIndex);
            }
            
            finderById.addEventListener('mousedown', (e) => {
                console.log('Clic sur finder (ID) détecté!');
                if (!e.target.closest('.dots')) {
                    bringToFront(finderById);
                }
            });
            
            finderById.addEventListener('click', (e) => {
                console.log('Clic dans finder (ID) détecté!');
                bringToFront(finderById);
            });
        }
    }
    
    // Ajouter aussi un événement sur le modal entier pour être sûr
    if (finderModal) {
        finderModal.addEventListener('click', (e) => {
            console.log('Clic sur finder-modal détecté!');
            const currentFinder = finderWindow || document.getElementById('finder');
            if (currentFinder) {
                bringToFront(currentFinder);
            }
        });
    }
}

// Fonction pour rendre le finder-modal déplaçable
function makeFinderWindowDraggable(windowElement) {
    // FONCTION FINDER - DRAGGABLE
    const header = windowElement.querySelector('.sb-header');
    let isDragging = false;
    let startX, startY, startLeft, startTop;
    
    header.addEventListener('mousedown', (e) => {
        if (e.target.closest('.dots')) return; // Ne pas déplacer si on clique sur les boutons
        
        // Mettre la fenêtre au premier plan
        bringToFront(windowElement);
        
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        
        // Récupérer la position actuelle de la fenêtre
        const rect = windowElement.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;
        
        // Si c'est le premier déplacement, initialiser la position
        if (!windowElement.style.left && !windowElement.style.top) {
            windowElement.style.left = startLeft + 'px';
            windowElement.style.top = startTop + 'px';
            windowElement.style.transform = 'none';
        }
        
        document.body.style.userSelect = 'none';
        header.style.cursor = 'grabbing';
        
        // Empêcher la sélection de texte
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        // Calculer le déplacement relatif
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        // Calculer les nouvelles positions
        const newLeft = startLeft + deltaX;
        const newTop = startTop + deltaY;
        
        // Appliquer les contraintes
        const constrainedPosition = constrainWindowPosition(windowElement, newLeft, newTop);
        
        // Appliquer le déplacement contraint
        windowElement.style.left = constrainedPosition.left + 'px';
        windowElement.style.top = constrainedPosition.top + 'px';
        windowElement.style.transform = 'none'; // Retirer le transform initial
    });
    
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            document.body.style.userSelect = '';
            header.style.cursor = 'grab';
        }
    });
}

// Fonction pour ouvrir le finder-modal avec le bon projet
function openFinderModal(projectIndex) {
    const finderModal = document.querySelector('.finder-modal');
    const finderWindow = document.querySelector('.finder-windows');
    
    if (finderModal) {
        finderModal.style.display = 'block';
        
        // Mettre immédiatement le Finder au premier plan
        finderModal.style.zIndex = '9999';
        console.log('Finder ouvert et mis au premier plan');
        
        // Mettre la Note en arrière-plan
        const noteModals = document.querySelectorAll('.note-modal');
        noteModals.forEach(noteModal => {
            noteModal.style.zIndex = '2000';
            console.log('Note mise en arrière-plan');
        });
        
        // Mettre Contact en arrière-plan
        const contactModal = document.getElementById('contactModal');
        if (contactModal) {
            contactModal.style.zIndex = '2000';
            console.log('Contact mis en arrière-plan');
        }
        
        switchProject(projectIndex);
    }
}

// Fonction pour fermer le finder-modal
function closeFinderModal() {
    console.log('Tentative de fermeture du finder');
    const finderModal = document.querySelector('.finder-modal');
    if (finderModal) {
        finderModal.style.display = 'none';
        console.log('Finder fermé avec succès');
    } else {
        console.log('Finder non trouvé pour fermeture');
    }
}

// Fonction pour minimiser une fenêtre (bouton jaune)
function minimizeWindow(windowElement) {
    console.log('Tentative de minimisation de la fenêtre');
    if (windowElement) {
        windowElement.style.display = 'none';
        console.log('Fenêtre minimisée');
    }
}

// Fonction pour minimiser une note spécifique
function minimizeNoteWindow(noteType) {
    console.log('Tentative de minimisation de la note:', noteType);
    const noteModal = document.getElementById(`noteModal-${noteType}`);
    if (noteModal) {
        noteModal.style.display = 'none';
        console.log(`Note ${noteType} minimisée`);
    } else {
        console.log(`Note ${noteType} non trouvée pour minimisation`);
    }
}

// Fonction pour changer de projet dans le finder-modal
function switchProject(projectIndex) {
    const headerContents = document.querySelectorAll('.header-content');
    const fileContents = document.querySelectorAll('.fils_content');
    const sidebarFolders = document.querySelectorAll('.folder-finder');
    const trashElement = document.querySelector('.trash-finder');

    // Mettre à jour la sidebar (sélectionner le bon projet)
    sidebarFolders.forEach((folder, index) => {
        if (index === projectIndex) {
            folder.classList.add('active');
        } else {
            folder.classList.remove('active');
        }
    });
    
    // Désactiver le Trash dans la sidebar
    if (trashElement) {
        trashElement.classList.remove('active');
    }

    // Afficher le bon contenu d'en-tête
    headerContents.forEach((content, index) => {
        if (index === projectIndex) {
            content.style.display = 'flex';
        } else {
            content.style.display = 'none';
        }
    });

    // Afficher le bon contenu de fichiers
    fileContents.forEach((content, index) => {
        if (index === projectIndex) {
            content.style.display = 'grid';
        } else {
            content.style.display = 'none';
        }
    });
    
    // Masquer l'onglet Trash quand on change de projet
    const trashContent = document.querySelector('.trash.fils_content');
    if (trashContent) {
        trashContent.classList.remove('active');
        trashContent.style.display = 'none';
    }
    
    // Masquer aussi le header du Trash
    const trashHeader = document.querySelector('.trash.header-content');
    if (trashHeader) {
        trashHeader.style.display = 'none';
    }
}

// Fonction pour afficher l'onglet Trash
function showTrash() {
    console.log('Affichage de l\'onglet Trash');
    
    // Masquer tous les projets
    const headerContents = document.querySelectorAll('.header-content');
    const fileContents = document.querySelectorAll('.fils_content');
    
    console.log('Header contents trouvés:', headerContents.length);
    console.log('File contents trouvés:', fileContents.length);
    
    headerContents.forEach(content => {
        if (content.classList.contains('trash')) {
            content.style.display = 'flex';
            console.log('Header Trash affiché:', content);
        } else {
            content.style.display = 'none';
            console.log('Header content masqué:', content);
        }
    });
    
    fileContents.forEach(content => {
        if (!content.classList.contains('trash')) {
            content.style.display = 'none';
            console.log('File content masqué:', content);
        }
    });
    
    // Afficher l'onglet Trash
    const trashContent = document.querySelector('.trash.fils_content');
    console.log('Trash content trouvé:', trashContent);
    
    if (trashContent) {
        trashContent.style.display = 'grid';
        trashContent.classList.add('active');
        console.log('Onglet Trash affiché et activé');
    } else {
        console.log('ERREUR: Onglet Trash non trouvé!');
    }
    
    // Mettre à jour la sidebar
    const sidebarFolders = document.querySelectorAll('.folder-finder');
    const trashElement = document.querySelector('.trash-finder');
    
    console.log('Sidebar folders trouvés:', sidebarFolders.length);
    console.log('Trash element trouvé:', trashElement);
    
    // Désactiver tous les projets dans la sidebar
    sidebarFolders.forEach(folder => {
        folder.classList.remove('active');
        console.log('Folder reseté:', folder);
    });
    
    // Activer le Trash dans la sidebar
    if (trashElement) {
        trashElement.classList.add('active');
        console.log('Trash element activé dans la sidebar');
    } else {
        console.log('ERREUR: Trash element non trouvé dans la sidebar!');
    }
}

// Fonction pour afficher un message d'information
function showInfoMessage(element, message) {
    // Supprimer l'ancien message s'il existe
    const existingMessage = document.querySelector('.info-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Créer le nouveau message
    const infoMessage = document.createElement('div');
    infoMessage.className = 'info-message';
    infoMessage.textContent = message;
    
    // Positionner le message centré sous l'élément
    const rect = element.getBoundingClientRect();
    infoMessage.style.position = 'fixed';
    infoMessage.style.top = (rect.bottom + 10) + 'px';
    infoMessage.style.zIndex = '10000';
    
    // Ajouter puis centrer selon la largeur mesurée
    document.body.appendChild(infoMessage);
    const msgWidth = infoMessage.offsetWidth;
    const margin = 8;
    let left = rect.left + (rect.width - msgWidth) / 2;
    left = Math.max(margin, Math.min(left, window.innerWidth - msgWidth - margin));
    infoMessage.style.left = left + 'px';
    
    // Supprimer le message après 2 secondes
    setTimeout(() => {
        if (infoMessage.parentNode) {
            infoMessage.remove();
        }
    }, 2000);
}

// Fonction pour initialiser les fenêtres de notes
function initNoteWindows() {
    const noteFiles = document.querySelectorAll('.note_file');
    
    // Ajouter les événements de clic sur les fichiers de notes
    noteFiles.forEach(noteFile => {
        noteFile.addEventListener('click', () => {
            const noteType = noteFile.getAttribute('data-note');
            if (noteType) {
                openNoteWindow(noteType);
            }
        });
    });
    
    // S'assurer que le note modal a un z-index initial
    if (noteModal) {
        if (!noteModal.style.zIndex) {
            noteModal.style.zIndex = '2000';
            console.log('Z-index initial appliqué au note modal:', noteModal.style.zIndex);
        }
    }
    
    // Rendre la fenêtre déplaçable
    if (noteWindow) {
        makeNoteWindowDraggable(noteWindow);
        
        // Ajouter la gestion des couches pour les clics sur la fenêtre
        noteWindow.addEventListener('mousedown', (e) => {
            if (!e.target.closest('.note-dots')) {
                bringToFront(noteWindow);
            }
        });
        
        // Ajouter la gestion des couches pour tous les éléments cliquables
        noteWindow.addEventListener('click', (e) => {
            bringToFront(noteWindow);
        });
    }
}

// Fonction pour rendre la fenêtre de note déplaçable
function makeNoteWindowDraggable(windowElement, noteType) {
    // FONCTION NOTE - DRAGGABLE
    const header = windowElement.querySelector('.note-header');
    let isDragging = false;
    let startX, startY, startLeft, startTop;
    
    header.addEventListener('mousedown', (e) => {
        if (e.target.closest('.note-dots')) return; // Ne pas déplacer si on clique sur les boutons
        
        // Mettre la fenêtre au premier plan
        bringToFront(windowElement);
        
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        
        // Récupérer la position actuelle de la fenêtre
        const rect = windowElement.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;
        
        // Si c'est le premier déplacement, initialiser la position
        if (!windowElement.style.left && !windowElement.style.top) {
            windowElement.style.left = startLeft + 'px';
            windowElement.style.top = startTop + 'px';
            windowElement.style.transform = 'none';
        }
        
        document.body.style.userSelect = 'none';
        header.style.cursor = 'grabbing';
        
        // Empêcher la sélection de texte
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        // Calculer le déplacement relatif
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        // Calculer les nouvelles positions
        const newLeft = startLeft + deltaX;
        const newTop = startTop + deltaY;
        
        // Appliquer les contraintes
        const constrainedPosition = constrainWindowPosition(windowElement, newLeft, newTop);
        
        // Appliquer le déplacement contraint
        windowElement.style.left = constrainedPosition.left + 'px';
        windowElement.style.top = constrainedPosition.top + 'px';
        windowElement.style.transform = 'none'; // Retirer le transform initial
    });
    
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            document.body.style.userSelect = '';
            header.style.cursor = 'grab';
        }
    });
    
    // Ajouter la gestion des couches pour les clics sur la fenêtre
    windowElement.addEventListener('mousedown', (e) => {
        if (!e.target.closest('.note-dots')) {
            bringToFront(windowElement);
        }
    });
    
    // Ajouter la gestion des couches pour tous les éléments cliquables
    windowElement.addEventListener('click', (e) => {
        bringToFront(windowElement);
    });
}

// Fonction pour ouvrir la fenêtre de contact
function openContactWindow() {
    const contactModal = document.getElementById('contactModal');
    const contactWindow = document.getElementById('contactWindow');
    
    if (contactModal) {
        contactModal.style.display = 'block';
        
        // Mettre la fenêtre de contact au premier plan
        contactModal.style.zIndex = '9999';
        console.log('Fenêtre de contact ouverte et mise au premier plan');
        
        // Mettre les autres fenêtres en arrière-plan
        const finderModal = document.querySelector('.finder-modal');
        const noteModals = document.querySelectorAll('.note-modal');
        
        if (finderModal) {
            finderModal.style.zIndex = '2000';
            console.log('Finder mis en arrière-plan');
        }
        noteModals.forEach(noteModal => {
            noteModal.style.zIndex = '2000';
            console.log('Note mise en arrière-plan');
        });
        
        // Rendre la fenêtre déplaçable
        if (contactWindow) {
            makeContactWindowDraggable(contactWindow);
        }
        
        // Ajouter les événements sur les boutons de fermeture
        const closeButton = contactModal.querySelector('.contact-dotr');
        const minimizeButton = contactModal.querySelector('.contact-doty');
        
        if (closeButton) {
            console.log('Bouton rouge de contact trouvé, ajout de l\'événement de fermeture');
            closeButton.addEventListener('click', (e) => {
                console.log('Clic sur le bouton rouge de contact');
                e.preventDefault();
                e.stopPropagation();
                closeContactWindow();
            });
        }
        
        if (minimizeButton) {
            console.log('Bouton jaune de contact trouvé, ajout de l\'événement de minimisation');
            minimizeButton.addEventListener('click', (e) => {
                console.log('Clic sur le bouton jaune de contact');
                e.preventDefault();
                e.stopPropagation();
                minimizeContactWindow();
            });
        }
    }
}

// Fonction pour fermer la fenêtre de contact
function closeContactWindow() {
    console.log('Tentative de fermeture de la fenêtre de contact');
    const contactModal = document.getElementById('contactModal');
    if (contactModal) {
        contactModal.style.display = 'none';
        console.log('Fenêtre de contact fermée avec succès');
    } else {
        console.log('Fenêtre de contact non trouvée pour fermeture');
    }
}

// Fonction pour minimiser la fenêtre de contact
function minimizeContactWindow() {
    console.log('Tentative de minimisation de la fenêtre de contact');
    const contactModal = document.getElementById('contactModal');
    if (contactModal) {
        contactModal.style.display = 'none';
        console.log('Fenêtre de contact minimisée');
    } else {
        console.log('Fenêtre de contact non trouvée pour minimisation');
    }
}

// Fonction pour rendre la fenêtre de contact déplaçable
function makeContactWindowDraggable(windowElement) {
    // FONCTION CONTACT - DRAGGABLE
    const header = windowElement.querySelector('.contact-header');
    let isDragging = false;
    let startX, startY, startLeft, startTop;
    
    header.addEventListener('mousedown', (e) => {
        if (e.target.closest('.contact-dots')) return; // Ne pas déplacer si on clique sur les boutons
        
        // Mettre la fenêtre au premier plan
        const contactModal = document.getElementById('contactModal');
        if (contactModal) {
            contactModal.style.zIndex = '9999';
        }
        
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        
        // Récupérer la position actuelle de la fenêtre
        const rect = windowElement.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;
        
        // Si c'est le premier déplacement, initialiser la position
        if (!windowElement.style.left && !windowElement.style.top) {
            windowElement.style.left = startLeft + 'px';
            windowElement.style.top = startTop + 'px';
            windowElement.style.transform = 'none';
        }
        
        document.body.style.userSelect = 'none';
        header.style.cursor = 'grabbing';
        
        // Empêcher la sélection de texte
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        // Calculer le déplacement relatif
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        // Calculer les nouvelles positions
        const newLeft = startLeft + deltaX;
        const newTop = startTop + deltaY;
        
        // Appliquer les contraintes
        const constrainedPosition = constrainWindowPosition(windowElement, newLeft, newTop);
        
        // Appliquer le déplacement contraint
        windowElement.style.left = constrainedPosition.left + 'px';
        windowElement.style.top = constrainedPosition.top + 'px';
        windowElement.style.transform = 'none'; // Retirer le transform initial
    });
    
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            document.body.style.userSelect = '';
            header.style.cursor = 'grab';
        }
    });
    
    // Ajouter la gestion des couches pour les clics sur la fenêtre
    windowElement.addEventListener('mousedown', (e) => {
        if (!e.target.closest('.contact-dots')) {
            const contactModal = document.getElementById('contactModal');
            if (contactModal) {
                contactModal.style.zIndex = '9999';
            }
        }
    });
    
    // Ajouter la gestion des couches pour tous les éléments cliquables
    windowElement.addEventListener('click', (e) => {
        const contactModal = document.getElementById('contactModal');
        if (contactModal) {
            contactModal.style.zIndex = '9999';
        }
    });
}

// -----------------------------
// Photos App
// -----------------------------

const PHOTOS_DATA = [
    { src: 'assets/galerie/_MG_3097.webp', album: 'work', favorite: true },
    { src: 'assets/galerie/_MG_3432-topaz-sharpen-denoise.webp', album: 'travel', favorite: false },
    { src: 'assets/galerie/_MG_3637-topaz-denoise.webp', album: 'personal', favorite: true },
    { src: 'assets/galerie/_MG_3612-topaz-denoise.webp', album: 'work', favorite: false },
    { src: 'assets/galerie/img_8135.webp', album: 'travel', favorite: false },
    { src: 'assets/galerie/img_8279.webp', album: 'personal', favorite: false },
    { src: 'assets/galerie/img_9393.webp', album: 'work', favorite: true },
    { src: 'assets/galerie/img_8399-topaz-denoise-sharpen.webp', album: 'work', favorite: false },
    { src: 'assets/galerie/img_7306.webp', album: 'travel', favorite: true },
    { src: 'assets/galerie/img_7768-avec accentuation-bruit.webp', album: 'personal', favorite: false },
    { src: 'assets/galerie/img_6748.webp', album: 'travel', favorite: false },
    { src: 'assets/galerie/img_0222.webp', album: 'personal', favorite: true },
    { src: 'assets/galerie/thumb_double bulle.webp', album: 'work', favorite: false }
];

function openPhotosWindow() {
    const photosModal = document.getElementById('photosModal');
    const photosWindow = document.getElementById('photosWindow');
    if (!photosModal) return;

    photosModal.style.display = 'block';
    photosModal.style.zIndex = '9999';

    // Envoyer les autres fenêtres derrière
    const finderModal = document.querySelector('.finder-modal');
    const contactModal = document.getElementById('contactModal');
    const noteModals = document.querySelectorAll('.note-modal');
    const calculatorModal = document.getElementById('calculatorModal');
    if (finderModal) finderModal.style.zIndex = '2000';
    if (contactModal) contactModal.style.zIndex = '2000';
    noteModals.forEach(m => m.style.zIndex = '2000');
    if (calculatorModal) calculatorModal.style.zIndex = '2000';

    if (photosWindow) {
        makePhotosWindowDraggable(photosWindow);

        // Populate grid dynamically
        const grid = photosWindow.querySelector('.photos-grid');
        grid.innerHTML = PHOTOS_DATA.map(p => (
            `<div class="photo-item" data-album="${p.album}" data-favorite="${p.favorite}"><img src="${p.src}" alt="Photo" /></div>`
        )).join('');

        // Lightbox: click on image
        function bindLightbox() {
            photosWindow.querySelectorAll('.photo-item img').forEach(img => {
                img.addEventListener('click', () => {
                    const lb = document.getElementById('photosLightbox');
                    if (!lb) return;
                    const lbImg = lb.querySelector('.lightbox-image');
                    lbImg.src = img.src;
                    lb.style.display = 'block';
                });
            });
        }
        bindLightbox();

        // Segmented controls + filtering
        const segs = photosWindow.querySelectorAll('.photos-segments .seg');
        const items = Array.from(grid.querySelectorAll('.photo-item'));

        function applyFilter(mode) {
            items.forEach(it => {
                const fav = (it.getAttribute('data-favorite') === 'true');
                let show = true;
                if (mode === 'favorites') {
                    show = fav;
                }
                it.style.display = show ? '' : 'none';
            });
        }

        segs.forEach(seg => {
            seg.addEventListener('click', () => {
                segs.forEach(s => s.classList.remove('active'));
                seg.classList.add('active');

                const label = seg.textContent.trim().toLowerCase();
                if (label === 'all') {
                    applyFilter('all');
                } else if (label === 'favorites') {
                    applyFilter('favorites');
                }
            });
        });
    }

    // Boutons
    const closeBtn = photosModal.querySelector('.photos-dotr');
    const minBtn = photosModal.querySelector('.photos-doty');
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closePhotosWindow();
        });
    }
    if (minBtn) {
        minBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            minimizePhotosWindow();
        });
    }
}

function closePhotosWindow() {
    const photosModal = document.getElementById('photosModal');
    if (photosModal) photosModal.style.display = 'none';
}

function minimizePhotosWindow() {
    const photosModal = document.getElementById('photosModal');
    if (photosModal) photosModal.style.display = 'none';
}

function makePhotosWindowDraggable(windowElement) {
    // FONCTION PHOTOS - DRAGGABLE
    const header = windowElement.querySelector('.photos-header');
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    header.addEventListener('mousedown', (e) => {
        if (e.target.closest('.photos-dots')) return;
        // premier plan via gestion centrale
        bringToFront(windowElement);

        isDragging = true;
        startX = e.clientX; startY = e.clientY;
        const rect = windowElement.getBoundingClientRect();
        startLeft = rect.left; startTop = rect.top;
        if (!windowElement.style.left && !windowElement.style.top) {
            windowElement.style.left = startLeft + 'px';
            windowElement.style.top = startTop + 'px';
            windowElement.style.transform = 'none';
        }
        document.body.style.userSelect = 'none';
        header.style.cursor = 'grabbing';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        
        // Calculer les nouvelles positions
        const newLeft = startLeft + dx;
        const newTop = startTop + dy;
        
        // Appliquer les contraintes
        const constrainedPosition = constrainWindowPosition(windowElement, newLeft, newTop);
        
        // Appliquer le déplacement contraint
        windowElement.style.left = constrainedPosition.left + 'px';
        windowElement.style.top = constrainedPosition.top + 'px';
        windowElement.style.transform = 'none';
    });

    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        document.body.style.userSelect = '';
        header.style.cursor = 'grab';
    });

    // focus au clic
    windowElement.addEventListener('mousedown', () => {
        bringToFront(windowElement);
    });
}

// Lightbox events (global)
document.addEventListener('DOMContentLoaded', () => {
    const lb = document.getElementById('photosLightbox');
    if (!lb) return;
    const closeBtn = lb.querySelector('.lightbox-close');
    const backdrop = lb.querySelector('.lightbox-backdrop');
    const hide = () => { lb.style.display = 'none'; };
    closeBtn.addEventListener('click', hide);
    backdrop.addEventListener('click', hide);
});

// Video lightbox events (global)
document.addEventListener('DOMContentLoaded', () => {
    const vlb = document.getElementById('videoLightbox');
    if (!vlb) return;
    const closeBtn = vlb.querySelector('.video-close');
    const backdrop = vlb.querySelector('.video-backdrop');
    const player = document.getElementById('videoPlayer');
    const hide = () => { vlb.style.display = 'none'; if (player) { player.pause(); player.currentTime = 0; player.removeAttribute('src'); player.load(); } };
    closeBtn.addEventListener('click', hide);
    backdrop.addEventListener('click', hide);
});


(function () {
    const TOP_Z_START = 10;
    let topZ = TOP_Z_START;

    function ensurePositioning(el) {
        const cs = getComputedStyle(el);
        el.style.touchAction = 'none';
        el.style.cursor = 'grab';

        // S'assurer qu'on peut le déplacer
        if (cs.position === 'static') el.style.position = 'absolute';

        const op = el.offsetParent || document.documentElement;
        const opRect = op.getBoundingClientRect();

        // Si top/left sont déjà définis (en % côté CSS), getComputedStyle renvoie des px -> on les fige en inline
        if (cs.left !== 'auto' && cs.top !== 'auto') {
            el.style.left = parseFloat(cs.left) + 'px';
            el.style.top = parseFloat(cs.top) + 'px';
            return;
        }

        // Sinon, on calcule depuis la position visuelle actuelle
        const r = el.getBoundingClientRect();
        const left = r.left - opRect.left + (op.scrollLeft || 0);
        const top = r.top - opRect.top + (op.scrollTop || 0);
        el.style.left = left + 'px';
        el.style.top = top + 'px';
    }

    function makeDraggable(el) {
        ensurePositioning(el);

        let startX, startY, startLeft, startTop;
        let dragging = false;

        el.addEventListener('pointerdown', (e) => {
            if (e.button !== 0) return; // clic principal
            dragging = true;
            el.setPointerCapture(e.pointerId);
            document.body.style.userSelect = 'none';
            el.style.cursor = 'grabbing';
            el.style.zIndex = ++topZ;

            startX = e.clientX;
            startY = e.clientY;
            startLeft = parseFloat(el.style.left) || 0;
            startTop = parseFloat(el.style.top) || 0;
        });

        el.addEventListener('pointermove', (e) => {
            if (!dragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            el.style.left = (startLeft + dx) + 'px';
            el.style.top = (startTop + dy) + 'px';
        });

        function endDrag(e) {
            if (!dragging) return;
            dragging = false;
            try { el.releasePointerCapture(e.pointerId); } catch { }
            document.body.style.userSelect = '';
            el.style.cursor = 'grab';
        }

        el.addEventListener('pointerup', endDrag);
        el.addEventListener('pointercancel', endDrag);
        el.addEventListener('lostpointercapture', endDrag);
    }

    function initAll() {
        document.querySelectorAll('.fld').forEach(makeDraggable);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }

    // Rendre draggable les .fld ajoutés dynamiquement
    const mo = new MutationObserver((muts) => {
        for (const m of muts) {
            m.addedNodes.forEach((n) => {
                if (!(n instanceof Element)) return;
                if (n.matches?.('.fld')) makeDraggable(n);
                n.querySelectorAll?.('.fld').forEach(makeDraggable);
            });
        }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
})();

// -----------------------------
// Calculator App
// -----------------------------

let calculatorState = {
    currentValue: '0',
    previousValue: null,
    operation: null,
    waitingForOperand: false
};

function openCalculatorWindow() {
    const calculatorModal = document.getElementById('calculatorModal');
    const calculatorWindow = document.getElementById('calculatorWindow');
    if (!calculatorModal) return;

    calculatorModal.style.display = 'block';
    calculatorModal.style.zIndex = '9999';

    // Envoyer les autres fenêtres derrière
    const finderModal = document.querySelector('.finder-modal');
    const contactModal = document.getElementById('contactModal');
    const photosModal = document.getElementById('photosModal');
    const noteModals = document.querySelectorAll('.note-modal');
    
    if (finderModal) finderModal.style.zIndex = '2000';
    if (contactModal) contactModal.style.zIndex = '2000';
    if (photosModal) photosModal.style.zIndex = '2000';
    noteModals.forEach(m => m.style.zIndex = '2000');

    if (calculatorWindow) {
        makeCalculatorWindowDraggable(calculatorWindow);
        initCalculator();
    }

    // Boutons
    const closeBtn = calculatorModal.querySelector('.calculator-dotr');
    const minBtn = calculatorModal.querySelector('.calculator-doty');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeCalculatorWindow();
        });
    }
    
    if (minBtn) {
        minBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            minimizeCalculatorWindow();
        });
    }
}

function closeCalculatorWindow() {
    const calculatorModal = document.getElementById('calculatorModal');
    if (calculatorModal) calculatorModal.style.display = 'none';
}

function minimizeCalculatorWindow() {
    const calculatorModal = document.getElementById('calculatorModal');
    if (calculatorModal) calculatorModal.style.display = 'none';
}

function makeCalculatorWindowDraggable(windowElement) {
    // FONCTION CALCULATOR - DRAGGABLE
    const header = windowElement.querySelector('.calculator-header');
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    header.addEventListener('mousedown', (e) => {
        if (e.target.closest('.calculator-dots')) return;
        bringToFront(windowElement);

        isDragging = true;
        startX = e.clientX; startY = e.clientY;
        const rect = windowElement.getBoundingClientRect();
        startLeft = rect.left; startTop = rect.top;
        if (!windowElement.style.left && !windowElement.style.top) {
            windowElement.style.left = startLeft + 'px';
            windowElement.style.top = startTop + 'px';
            windowElement.style.transform = 'none';
        }
        document.body.style.userSelect = 'none';
        header.style.cursor = 'grabbing';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        
        // Calculer les nouvelles positions
        const newLeft = startLeft + dx;
        const newTop = startTop + dy;
        
        // Appliquer les contraintes
        const constrainedPosition = constrainWindowPosition(windowElement, newLeft, newTop);
        
        // Appliquer le déplacement contraint
        windowElement.style.left = constrainedPosition.left + 'px';
        windowElement.style.top = constrainedPosition.top + 'px';
        windowElement.style.transform = 'none';
    });

    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        document.body.style.userSelect = '';
        header.style.cursor = 'grab';
    });

    windowElement.addEventListener('mousedown', () => {
        bringToFront(windowElement);
    });
}

function initCalculator() {
    const buttons = document.querySelectorAll('.calc-btn');
    const display = document.getElementById('calculatorResult');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.getAttribute('data-action');
            const number = button.getAttribute('data-number');

            if (number) {
                inputNumber(number);
            } else if (action) {
                performAction(action);
            }
            updateDisplay();
        });
    });
}

function inputNumber(number) {
    if (calculatorState.waitingForOperand) {
        calculatorState.currentValue = number;
        calculatorState.waitingForOperand = false;
    } else {
        if (number === '.' && calculatorState.currentValue.includes('.')) return;
        if (calculatorState.currentValue === '0' && number !== '.') {
            calculatorState.currentValue = number;
        } else {
            calculatorState.currentValue += number;
        }
    }
}

function performAction(action) {
    const current = parseFloat(calculatorState.currentValue);
    
    switch (action) {
        case 'clear':
            calculatorState = {
                currentValue: '0',
                previousValue: null,
                operation: null,
                waitingForOperand: false
            };
            break;
        case 'sign':
            calculatorState.currentValue = (current * -1).toString();
            break;
        case 'percent':
            calculatorState.currentValue = (current / 100).toString();
            break;
        case 'add':
        case 'subtract':
        case 'multiply':
        case 'divide':
            if (calculatorState.previousValue !== null && !calculatorState.waitingForOperand) {
                performCalculation();
            }
            calculatorState.previousValue = current;
            calculatorState.operation = action;
            calculatorState.waitingForOperand = true;
            break;
        case 'equals':
            if (calculatorState.previousValue !== null && !calculatorState.waitingForOperand) {
                performCalculation();
                calculatorState.previousValue = null;
                calculatorState.operation = null;
            }
            break;
    }
}

function performCalculation() {
    const current = parseFloat(calculatorState.currentValue);
    const previous = calculatorState.previousValue;
    let result;

    switch (calculatorState.operation) {
        case 'add':
            result = previous + current;
            break;
        case 'subtract':
            result = previous - current;
            break;
        case 'multiply':
            result = previous * current;
            break;
        case 'divide':
            result = previous / current;
            break;
        default:
            return;
    }

    calculatorState.currentValue = result.toString();
    calculatorState.waitingForOperand = true;
}

function updateDisplay() {
    const display = document.getElementById('calculatorResult');
    if (display) {
        display.textContent = calculatorState.currentValue;
    }
}

// -----------------------------
// Menu déroulant Projects
// -----------------------------

// Initialiser le menu déroulant Projects
function initProjectsMenu() {
    console.log('Initialisation du menu Projects...');
    const menuTrigger = document.querySelector('.menu-trigger');
    const projectsDropdown = document.getElementById('projectsDropdown');
    const menuOptions = document.querySelectorAll('.menu-option');
    
    console.log('Menu trigger trouvé:', menuTrigger);
    console.log('Projects dropdown trouvé:', projectsDropdown);
    console.log('Menu options trouvées:', menuOptions.length);
    
    if (menuTrigger && projectsDropdown) {
        // Gérer l'ouverture/fermeture du menu au clic
        menuTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Fermer le menu Contact s'il est ouvert
            const contactDropdown = document.getElementById('contactDropdown');
            if (contactDropdown) {
                contactDropdown.classList.remove('active');
            }
            
            // Positionner le menu sous le bouton Projects
            const triggerRect = menuTrigger.getBoundingClientRect();
            projectsDropdown.style.left = triggerRect.left + 'px';
            projectsDropdown.style.top = (triggerRect.bottom + 5) + 'px';
            
            projectsDropdown.classList.toggle('active');
        });
        
        // Fermer le menu quand on clique ailleurs
        document.addEventListener('click', (e) => {
            if (!menuTrigger.contains(e.target) && !projectsDropdown.contains(e.target)) {
                projectsDropdown.classList.remove('active');
            }
            // Fermer aussi le menu Contact si on clique ailleurs
            const contactDropdown = document.getElementById('contactDropdown');
            if (contactDropdown && !e.target.closest('.menu-trigger-contact') && !contactDropdown.contains(e.target)) {
                contactDropdown.classList.remove('active');
            }
        });
        
        // Gérer les options du menu
        menuOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const project = option.getAttribute('data-project');
                openProjectFromMenu(project);
                projectsDropdown.classList.remove('active');
            });
        });
    }
}

// Fonction pour ouvrir un projet depuis le menu
function openProjectFromMenu(project) {
    console.log('Ouverture du projet depuis le menu:', project);
    
    switch(project) {
        case 'irza':
            openFinderModal(0);
            break;
        case 'sm':
            openFinderModal(1);
            break;
        case 'pb':
            openFinderModal(2);
            break;
        case 'share':
            openFinderModal(3);
            break;
        case 'other':
            window.open('https://projects.codealuxz.fr', '_blank');
            break;
        default:
            console.log('Projet non reconnu:', project);
    }
}

// -----------------------------
// Menu déroulant Contact
// -----------------------------

// Initialiser le menu déroulant Contact
function initContactMenu() {
    console.log('Initialisation du menu Contact...');
    const menuTriggerContact = document.querySelector('.menu-trigger-contact');
    const contactDropdown = document.getElementById('contactDropdown');
    const contactOptions = contactDropdown.querySelectorAll('.menu-option');
    
    console.log('Menu trigger contact trouvé:', menuTriggerContact);
    console.log('Contact dropdown trouvé:', contactDropdown);
    console.log('Contact options trouvées:', contactOptions.length);
    
    if (menuTriggerContact && contactDropdown) {
        // Gérer l'ouverture/fermeture du menu au clic
        menuTriggerContact.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Fermer le menu Projects s'il est ouvert
            const projectsDropdown = document.getElementById('projectsDropdown');
            if (projectsDropdown) {
                projectsDropdown.classList.remove('active');
            }
            
            // Positionner le menu sous le bouton Contact
            const triggerRect = menuTriggerContact.getBoundingClientRect();
            contactDropdown.style.left = triggerRect.left + 'px';
            contactDropdown.style.top = (triggerRect.bottom + 5) + 'px';
            
            contactDropdown.classList.toggle('active');
        });
        
        // Fermer le menu quand on clique ailleurs
        document.addEventListener('click', (e) => {
            if (!menuTriggerContact.contains(e.target) && !contactDropdown.contains(e.target)) {
                contactDropdown.classList.remove('active');
            }
            // Fermer aussi le menu Projects si on clique ailleurs
            const projectsDropdown = document.getElementById('projectsDropdown');
            if (projectsDropdown && !e.target.closest('.menu-trigger') && !projectsDropdown.contains(e.target)) {
                projectsDropdown.classList.remove('active');
            }
        });
        
        // Gérer les options du menu
        contactOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const contact = option.getAttribute('data-contact');
                openContactFromMenu(contact);
                contactDropdown.classList.remove('active');
            });
        });
    }
}

// Fonction pour ouvrir un contact depuis le menu
function openContactFromMenu(contact) {
    console.log('Ouverture du contact depuis le menu:', contact);
    
    switch(contact) {
        case 'email':
            window.open('mailto:contact@codealuxz.fr', '_blank');
            break;
        case 'website':
            window.open('https://tally.so/forms/nG5BD2', '_blank');
            break;
        case 'discord':
            window.open('https://discord.com/users/1054876714301411390', '_blank');
            break;
        default:
            console.log('Contact non reconnu:', contact);
    }
}

// -----------------------------
// Dock (Barre d'applications macOS)
// -----------------------------

// Initialiser la barre d'applications
function initDock() {
    const dockItems = document.querySelectorAll('.dock-item');
    
    dockItems.forEach(item => {
        item.addEventListener('click', () => {
            const app = item.getAttribute('data-app');
            openAppFromDock(app);
        });
        
        // Animation au survol
        item.addEventListener('mouseenter', () => {
            // Ajouter un effet de rebond
            item.style.transform = 'scale(1.1) translateY(-4px)';
        });
        
        item.addEventListener('mouseleave', () => {
            // Retour à la normale
            item.style.transform = 'scale(1) translateY(0)';
        });
    });
}

// Fonction pour ouvrir une application depuis la barre d'applications
function openAppFromDock(app) {
    console.log('Ouverture de l\'application depuis le dock:', app);
    
    switch(app) {
        case 'finder':
            // Ouvrir le finder avec le premier projet
            openFinderModal(0);
            break;
        case 'photos':
            // Ouvrir la galerie Photos
            openPhotosWindow();
            break;
        case 'calculator':
            // Ouvrir la calculatrice
            openCalculatorWindow();
            break;
        case 'contact':
            // Ouvrir la fenêtre de contact
            openContactWindow();
            break;
        case 'trash':
            // Ouvrir le finder avec l'onglet Trash
            openFinderModal(0);
            setTimeout(() => {
                showTrash();
            }, 100);
            break;
        default:
            console.log('Application non reconnue:', app);
    }
}

