// ==UserScript==
// @name         JVC Redesign - Refonte de l'interface du forum
// @namespace    http://tampermonkey.net/
// @version      4.0
// @author       StrangerFruit, sur la base d'un script de BlackArch + Bakuredo + captain_cid31 + herolink + Can-02 
// @description  Tentative de rendre l'UI le plus agréable possible
// @match        https://www.jeuxvideo.com/recherche/forums/*
// @match        https://www.jeuxvideo.com/forums/message/*
// @match        https://www.jeuxvideo.com/forums/*
// @updateURL   https://raw.githubusercontent.com/DreamboxMinerva/JVC-Redesign/main/JVC-Redesign.user.js?nocache=1
// @downloadURL https://raw.githubusercontent.com/DreamboxMinerva/JVC-Redesign/main/JVC-Redesign.user.js?nocache=1
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const root = document.documentElement;
    const isTopic = () => location.pathname.startsWith('/forums/42-');

    // ── Détection du thème ──
    const isDarkByStorage = () => {
        const themeKey = localStorage.getItem('theme');
        if (themeKey) return themeKey === 'theme-dark';
        const darkMode = localStorage.getItem('topiclive_dark_mode');
        if (darkMode !== null) return darkMode === 'true';
        return null;
    };

    const isDarkByDOM = () => {
        const cl = root.classList;
        if (cl.contains('theme-dark')) return true;
        if (cl.contains('theme-light')) return false;
        return null;
    };

    // Ne touche au DOM que si la classe doit réellement changer
    const applyTheme = () => {
        let isDark = isDarkByStorage();
        if (isDark === null) isDark = isDarkByDOM();
        if (isDark === null) isDark = true;
        const cible = isDark ? 'jvcr-dark' : 'jvcr-light';
        const autre = isDark ? 'jvcr-light' : 'jvcr-dark';
        const cl = root.classList;
        if (cl.contains(cible) && !cl.contains(autre)) return;
        cl.remove(autre);
        cl.add(cible);
    };

    applyTheme();

    // ─── CSS injecté le plus tôt possible (évite le flash du header d'origine) ───
    const styleJVCR = document.createElement('style');
    styleJVCR.textContent = `
        /* ── Palette (reprise de JVClean, thème sombre uniquement) ── */
        html.jvcr-dark,
        html.jvcr-dark * {
            --jv-header-bg-color: #18191b !important;
            --layout-bg-color: #22252a !important;
            --jv-buttons-navbar-bg-color: #191a1d !important;
            --jv-bg-color-light: #272a30 !important;
            --jv-block-bg-color: #2e3238 !important;
            --jv-block-even-bg-color: #363e49 !important;
            --jv-link-color: #7dc3f7 !important;
            --tables-forums-pin-off: #ff4d39 !important;
            --tables-forums-folder2: #ff4d39 !important;
        }

        /* ── Bandeau compact : pas d'animation, logo et accès rapides figés ── */
        @media (min-width: 75em) {
            #header-main,
            #header-main .headerAccount__dropdownContainer,
            #header-main .header-icon-next,
            #header-main .header-main-subcategory,
            #header-main > #header-nav-panel {
                transition: none !important;
            }

            #header-main .header-main-logo {
                transform: none !important;
            }

            #header-main .header-quick-access-link {
                opacity: 1 !important;
            }

            #header-main:has(#header-main-menu-icon[aria-expanded="false"]) > #header-nav-panel {
                visibility: hidden !important;
            }
        }

        /* ── Anti-flash : tout #header-main sans mode compact est masqué (y compris un header
           recréé par le site). Filet de sécurité : réaffiché au bout de 1,2 s quoi qu'il arrive ── */
        @media (min-width: 75em) {
            html.jvcr-dark #header-main:not(.header-main-compact) {
                visibility: hidden;
                animation: jvcr-header-failsafe 0s linear 1.2s forwards;
            }
        }
        @keyframes jvcr-header-failsafe {
            to { visibility: visible; }
        }

        .header__bottom {
            height: 0 !important;
        }

        .header__navList--platform {
            display: none !important;
        }

        /* Dé-stickifier la barre native */
        .buttonsNavbar__sticky {
            position: relative !important;
            top: 0 !important;
            order: 0 !important;
        }

        @media (max-width: 611.98px) {
            .buttonsNavbar__sticky {
                position: relative !important;
                top: 0 !important;
                bottom: unset !important;
                order: 0 !important;
            }
        }

        .tablesForum__cellSubject {
            padding-top: 0.5px !important;
            padding-bottom: 0.5px !important;
        }

        .messageUser__separator {
            border-top: 0.0625rem solid var(--border-color); width: 100%;
        }

        .container__postTitle {
            display: none !important;
        }

        .tablesForum__subjectText {
            font-weight: 500 !important;
            font-size: 14px !important;
        }

        .messageUser__main {
            min-height: 0 !important;
            overflow: visible !important;
        }

        .buttonsNavbar {
            box-shadow: none !important;
        }

        .messageUser__msg span.message__urlImg {
            display: inline-block !important;
            width: 68px !important;
            height: 51px !important;
            padding-bottom: 0 !important;
            border-radius: 0rem !important;
            background-color: #000 !important;
            background-size: contain !important;
            background-repeat: no-repeat !important;
            background-position: center !important;
        }

        .message__urlImgSticker {
            max-width: 83px !important; max-height: 62px !important;
            min-width: 68px !important; min-height: 51px !important;
            border-radius: 0rem !important;
        }

        .backTo__icon {
            margin-bottom: 3px !important;
        }

        .messageUser__msg a span.message__urlImgLarge {
            height: 150px;
            width: 200px;
            padding-bottom: 0;
            display: inline-block;
        }

        /* ── Divers ── */
        .tablesForum__remainingAvatars, .tablesForum__separator { display: none !important; }
        .tablesForum__rowLastMsg { margin-left: 5px !important; }
        .titleMessagesUsers__title {
            font-size: 1.725rem !important;
            line-height: 1.25 !important; word-break: break-word !important;
        }

        /* ── Visités ── */
        .tablesForum__subjectText a:visited,
        .tablesForum__subjectLink:visited,
        a.tablesForum__subjectLink:visited { color: #777 !important; }
        a.pagination__button:visited { color: #aaa !important; border-color: #555 !important; }
        html.theme-dark a.pagination__button:visited { color: #666 !important; border-color: #444 !important; }
        .tablesForum__bodyRow a:visited { color: var(--jv-text-muted-color) !important; }

        /* ── Layout ── */
        @media (min-width: 1400px) {
            .layout { grid-template-columns: 1fr 51rem 24.5rem 1fr !important; }
            body.jvmerde-nosidebar .layout { grid-template-columns: 1fr 80rem 1fr !important; }
        }

        .messageUser__label {
            display: inline !important;
            font-size: 1.1953125rem !important;
            font-weight: 700 !important;
        }

        .layout__contentAside.layout__row--gutter {
            margin-left: 6px !important;
        }

        .messageEditor__containerEdit {
            margin-top: 8px !important;
        }

        .layout--videoLarge .layout__contentMain,
        .layout--alternate .layout__contentHeader,
        .layout--alternate .layout__contentBefore,
        .layout--alternate .layout__contentMainMedia,
        .layout--alternate .layout__contentMainMediaContainer,
        .layout--alternate .layout__contentMain,
        .layout--forum .layout__contentMainMedia,
        .layout--forum .layout__contentMainMediaContainer,
        .layout--forum .layout__contentMain,
        .layout--classic .layout__contentMainMedia,
        .layout--classic .layout__contentMainMediaContainer,
        .layout--classic .layout__contentMain {
            margin-left: -6px !important;
        }

        /* ── Navbar dark mode ── */
        .jvcr-dark .buttonsNavbar {
            background-color: #272A30 !important;
        }

        .jvcr-dark .buttonsNavbar__button {
            color: #f2f2f2 !important;
            background-color: #272A30 !important;
            padding-left: 2px;
            padding-right: 4px;
        }

        .jvcr-dark .buttonsNavbar__label {
            display: block !important;
            font-size: 15px !important;
            font-weight: 500 !important;
            line-height: 1 !important;
        }

        .jvcr-dark .buttonsNavbar__button:hover,
        .jvcr-dark .buttonsNavbar__button:active,
        .jvcr-dark .buttonsNavbar__button:focus {
            background-color: #272A30 !important;
            color: #F66031 !important;
        }

        .messageUser__label:hover,
        .messageUser__label:active,
        .messageUser__label:focus {
            color: #F66031 !important;
        }

        .tablesForum,
        .buttonsNavbar,
        .sideCardForum__body,
        .messageEditor__containerEdit,
        .messageEditor__containerPreview,
        .survey__addSurvey,
        .messageUser__card,
        .topicTitle__input {
            border-radius: 8px !important;
        }

        .forumSearchBar__form,
        .buttonsNavbar__button,
        .simpleButton, .topicResolve, .userParameters {
            border-radius: 10px !important;
        }

        .forumSearchBar__formInput {
            padding-top: 4px !important;
        }

        .messageUser__level {
            color: var(--jv-text-muted-color);
        }

        .tablesForum--hotTopics, .tablesForum--listTopicsWithActions, .tablesForum--listTopics {
            --tables-forums-icon-size: 22px;
        }

        .messageUser__actionIcon.icon-kick-active {
            filter: invert(58%) sepia(98%) saturate(2000%) hue-rotate(0deg) brightness(0.80) !important;
        }

        /* ── Barre dupliquée en bas ── */
        #jvcr-bottom-bar {
            margin: 10px 0 6px 0;
        }
        #jvcr-bottom-bar .buttonsNavbar {
            display: flex !important;
            align-items: center !important;
            padding-left: 18px !important;
            margin-top: -10px !important;
        }

        /* ── Toolbar aligné avec la pagination ── */
        .pagination {
            margin-top: -8px !important;
        }

        .container__pagination {
            margin-bottom: 12px !important;
        }

        /* En large : Bloquer/Marquer remonté au niveau de la pagination */
        .listActions {
            margin-left: -8px;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            margin-bottom: 20px !important;
            margin-top: -54px !important;
            z-index: 1 !important;
            position: relative !important;
        }

        /* En dessous de 1260px : retour au comportement natif avec espace en bas */
        @media (max-width: 1260px) {
            .listActions {
                margin-top: 0 !important;
                margin-bottom: 8px !important;
                position: static !important;
                z-index: auto !important;
            }
        }

        .pagination__navigation--zone1 .pagination__button:nth-child(-n+10),
        .pagination__navigation--zone1 .pagination__item:nth-child(-n+10),
        .pagination__navigation--zone2 .pagination__button:nth-child(-n+9),
        .pagination__navigation--zone2 .pagination__item:nth-child(-n+9),
        .pagination__navigation--zone3 .pagination__button:nth-child(-n+8),
        .pagination__navigation--zone3 .pagination__item:nth-child(-n+8) {
            order: 2 !important;
            z-index: 2 !important;
            position: relative !important;
        }

        /* ── Bandeau plateformes + carrousel masqués ── */
        .link-bar-container,
        .roller-holder {
            display: none !important;
        }

        /* Espace réservé sous le header */
        .layout {
            --layout-mt: 2.2rem !important;
        }

        @media (max-width: 612px) {
            .messageUser__main {
                overflow: hidden !important;
            }
        }
    `;
    root.appendChild(styleJVCR);

    // ─── Bandeau compact forcé sur grand écran (repris de JVClean) ───
    const grandEcran = window.matchMedia('(min-width: 75em)');
    const classesCompactes = ['jvHeader--affix', 'header-main-compact'];
    let headerCourant = null;
    let obsClasse = null;

    const appliquerModeCompact = () => {
        if (headerCourant && grandEcran.matches &&
            !classesCompactes.every(c => headerCourant.classList.contains(c))) {
            headerCourant.classList.add(...classesCompactes);
        }
    };

    grandEcran.addEventListener('change', () => {
        if (!headerCourant) return;
        if (grandEcran.matches) appliquerModeCompact();
        else headerCourant.classList.remove(...classesCompactes);
    });

    // (Re)branche le mode compact dès qu'un #header-main apparaît ou est remplacé par le site
    const verifierBandeau = () => {
        const header = document.getElementById('header-main');
        if (!header || header === headerCourant) return;
        if (obsClasse) obsClasse.disconnect();
        headerCourant = header;
        appliquerModeCompact();
        obsClasse = new MutationObserver(appliquerModeCompact);
        obsClasse.observe(header, { attributes: true, attributeFilter: ['class'] });
    };

    verifierBandeau();
    const obsBandeau = new MutationObserver(verifierBandeau);
    obsBandeau.observe(document, { childList: true, subtree: true });
    // On continue de surveiller 3 s après le chargement (hydratation du site), puis on s'arrête
    document.addEventListener('DOMContentLoaded', () => setTimeout(() => obsBandeau.disconnect(), 3000), { once: true });

    // ─── Barre dupliquée en bas ────────────────────
    // Boutons de la barre native à dupliquer (null si la barre n'est pas prête)
    const lireBoutonsSource = () => {
        const navbar = document.querySelector('.buttonsNavbar');
        if (!navbar) return null;

        const tous = navbar.querySelectorAll(':scope > .buttonsNavbar__button');
        if (!tous.length) return null;

        return [...tous].filter(b =>
            !b.querySelector('.icon-reply') &&
            !b.classList.contains('tl-settings-button')
        );
    };

    const buildBottomBar = (boutons) => {
        const nav = document.createElement('div');
        nav.className = 'buttonsNavbar';

        boutons.forEach((sourceBtn) => {
            if (sourceBtn.querySelector('.icon-refresh')) {
                const btn = document.createElement('button');
                btn.className = sourceBtn.className;
                btn.innerHTML = sourceBtn.innerHTML;
                btn.addEventListener('click', () => location.reload());
                nav.appendChild(btn);
            } else {
                nav.appendChild(sourceBtn.cloneNode(true));
            }
        });

        return nav;
    };

    const tryInjectBottomBar = () => {
        if (!isTopic()) return false;

        const boutons = lireBoutonsSource();
        if (!boutons) return false;

        const allPagi = document.querySelectorAll('.container__pagination:not(.js-pagination-top)');
        const bottomPagi = allPagi[allPagi.length - 1];
        if (!bottomPagi) return false;

        const existing = document.getElementById('jvcr-bottom-bar');
        if (existing) {
            if (
                existing.previousElementSibling === bottomPagi &&
                existing.querySelectorAll('.buttonsNavbar__button').length === boutons.length
            ) return true;
            existing.remove();
        }

        const wrapper = document.createElement('div');
        wrapper.id = 'jvcr-bottom-bar';
        wrapper.appendChild(buildBottomBar(boutons));

        bottomPagi.insertAdjacentElement('afterend', wrapper);
        return true;
    };

    // Observer dès le début, jusqu'à la première injection réussie
    const obs = new MutationObserver(() => {
        if (tryInjectBottomBar()) obs.disconnect();
    });

    if (document.body) {
        obs.observe(document.body, { childList: true, subtree: true });
    } else {
        new MutationObserver((_, o) => {
            if (document.body) { o.disconnect(); obs.observe(document.body, { childList: true, subtree: true }); }
        }).observe(root, { childList: true });
    }

    window.addEventListener('DOMContentLoaded', () => {
        applyTheme();
        if (isTopic()) tryInjectBottomBar();
    });

    let intervalCount = 0;
    const fastInterval = setInterval(() => {
        if (isTopic()) tryInjectBottomBar();
        intervalCount++;
        if (intervalCount >= 20) {
            clearInterval(fastInterval);
            setInterval(() => { if (isTopic()) tryInjectBottomBar(); }, 5000);
        }
    }, 500);


})();

// ═══════════════════════════════════════════════════
// CITATION AVEC PSEUDO — par captain_cid31 & can-02 & herolink
// ═══════════════════════════════════════════════════
function Citations() {
    document.addEventListener('click', function(e) {
        const boutonCitation = e.target.closest('.messageUser__action[title="Citer le message"]');
        if (!boutonCitation) return;
        // Ignore les boutons reconstruits par TopicLive+ (pas de vrai composant React derrière)
        if (boutonCitation.closest('.tl-inline-actions')) return;
        const post     = boutonCitation.closest(".messageUser__card");
        const fiberKey = Object.keys(boutonCitation).find(k => k.startsWith('__reactFiber$'));
        const props    = boutonCitation[fiberKey]?.return?.memoizedProps;
        if (!props) return;
        e.stopImmediatePropagation();
        e.preventDefault();
        const pseudo   = post.querySelector(".messageUser__label")?.textContent.trim();
        const citation = `> Le ${props.date} '''${pseudo}''' a écrit :\n> ${props.text.split("\n").join("\n> ")}\n\n`;
        unsafeWindow.jvc.getMessageEditor(".messageEditor__edit").insertText(citation);
    }, true);
}
Citations();
