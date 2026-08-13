/**
 * CV - Mouhamadou Fadel Fall
 * Injection sécurisée des coordonnées de contact et fonctionnalités interactives.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Désobfuscation et affichage sécurisé de l'Email et du Téléphone
    initContactInfo();

    // 2. Téléchargement du CV en PDF (via la boîte de dialogue d'impression du navigateur)
    initPdfDownload();

    // 3. Bascule entre la vue Graphique (web) et la vue ATS (sobre, une colonne)
    initViewToggle();
});

/**
 * Déclenche l'impression de la page pour permettre à l'utilisateur
 * de l'enregistrer en PDF ("Enregistrer au format PDF" dans la boîte
 * de dialogue d'impression du navigateur). Aucune librairie externe
 * n'est requise, ce qui respecte la Content-Security-Policy en place.
 */
function initPdfDownload() {
    const btn = document.getElementById('download-pdf-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        window.print();
    });
}

/**
 * Bascule visuellement le CV entre deux formats :
 * - "Graphique" : mise en page à deux colonnes, couleurs, icônes (par défaut).
 * - "ATS" : une seule colonne, sans couleurs ni icônes ni éléments graphiques,
 *   pensée pour une lecture optimale par les logiciels de recrutement (ATS).
 * Le choix de l'utilisateur est mémorisé pour ses prochaines visites.
 */
function initViewToggle() {
    const btn = document.getElementById('toggle-view-btn');
    const label = document.getElementById('toggle-view-label');
    if (!btn || !label) return;

    const STORAGE_KEY = 'cv-view-mode';

    const applyMode = (mode) => {
        const isAts = mode === 'ats';
        document.body.classList.toggle('ats-view', isAts);
        btn.setAttribute('aria-pressed', String(isAts));
        label.textContent = isAts ? 'Basculer en vue Graphique' : 'Basculer en vue ATS';
    };

    // Restaure le dernier choix de l'utilisateur (localStorage), sinon vue Graphique par défaut
    let savedMode = 'graphique';
    try {
        savedMode = localStorage.getItem(STORAGE_KEY) || 'graphique';
    } catch (e) {
        // localStorage indisponible (mode privé strict, etc.) : on reste sur le défaut
    }
    applyMode(savedMode);

    btn.addEventListener('click', () => {
        const nextMode = document.body.classList.contains('ats-view') ? 'graphique' : 'ats';
        applyMode(nextMode);
        try {
            localStorage.setItem(STORAGE_KEY, nextMode);
        } catch (e) {
            // pas grave si on ne peut pas persister le choix
        }
    });
}

/**
 * Recompose et insère l'adresse email et le numéro de téléphone 
 * pour éviter le scraping automatique par les spambots.
 */
function initContactInfo() {
    // Configuration des coordonnées
    const user = "mouhamadoufadelfall";
    const domain = "gmail.com";
    const fullEmail = `${user}@${domain}`;
    const rawPhone = "+221775635350"; // Remplacez par votre vrai numéro sans espaces
    const displayPhone = "+221 77 563 53 50"; // Format affiché

    // Injection dynamique de l'email
    const emailLink = document.getElementById('email-link');
    const emailFallback = document.getElementById('email-fallback');

    if (emailLink && emailFallback) {
        emailLink.href = `mailto:${fullEmail}`;
        emailFallback.innerHTML = `<i class="fas fa-envelope"></i> ${fullEmail}`;
    }

    // Injection dynamique du téléphone
    const phoneLink = document.getElementById('phone-link');
    const phoneFallback = document.getElementById('phone-fallback');

    if (phoneLink && phoneFallback) {
        phoneLink.href = `tel:${rawPhone}`;
        phoneFallback.innerHTML = `<i class="fas fa-phone"></i> ${displayPhone}`;
    }
}