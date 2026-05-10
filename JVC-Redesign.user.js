// ==UserScript==
// @name         JVC Redesign - Refonte de l'interface du forum
// @namespace    http://tampermonkey.net/
// @version      2.94
// @author       StrangerFruit + BlackArch + Bakuredo + captain_cid31 + herolink + Can-02
// @description  Tentative de rendre l'UI le plus agréable possible
// @match        https://www.jeuxvideo.com/forums/0-*
// @match        https://www.jeuxvideo.com/forums/42-*
// @match        https://www.jeuxvideo.com/recherche/forums/0-*
// @match        https://www.jeuxvideo.com/recherche/forums/42-*
// @match        https://www.jeuxvideo.com/forums/message/*
// @updateURL   https://raw.githubusercontent.com/DreamboxMinerva/JVC-Redesign/main/JVC-Redesign.user.js?nocache=1
// @downloadURL https://raw.githubusercontent.com/DreamboxMinerva/JVC-Redesign/main/JVC-Redesign.user.js?nocache=1
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // ── Détection du thème ──
    const isDarkByStorage = () => {
        const themeKey = localStorage.getItem('theme');
        if (themeKey) return themeKey === 'theme-dark';
        const darkMode = localStorage.getItem('topiclive_dark_mode');
        if (darkMode !== null) return darkMode === 'true';
        return null;
    };

    const isDarkByDOM = () => {
        const cl = document.documentElement.classList;
        if (cl.contains('theme-dark')) return true;
        if (cl.contains('theme-light')) return false;
        return null;
    };

    const applyTheme = () => {
        let isDark = isDarkByStorage();
        if (isDark === null) isDark = isDarkByDOM();
        if (isDark === null) isDark = true;
        document.documentElement.classList.remove('jvcr-dark', 'jvcr-light');
        document.documentElement.classList.add(isDark ? 'jvcr-dark' : 'jvcr-light');
    };

    applyTheme();
    window.addEventListener('DOMContentLoaded', () => applyTheme());

    // ─── Barre dupliquée : observer dès le début ───
    const obs = new MutationObserver(() => {
        if (tryInjectBottomBar()) obs.disconnect();
    });

    const startObs = () => {
        if (document.body) {
            obs.observe(document.body, { childList: true, subtree: true });
        } else {
            new MutationObserver((_, o) => {
                if (document.body) { o.disconnect(); obs.observe(document.body, { childList: true, subtree: true }); }
            }).observe(document.documentElement, { childList: true });
        }
    };
    startObs();

    GM_addStyle(`
        /* Dé-stickifier la barre native */
        .buttonsNavbar__sticky {
            position: relative !important;
            top: 0 !important;
            order: 0 !important;
        }

        /* Contrer le forçage mobile du site :
           en dessous de 612px JVC force order:2 + bottom sur ce sélecteur */
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

        /* ── Signature ── */
        .messageUser__separator {
            border-top: 0.0625rem solid var(--border-color); width: 100%;
        }

.container__postTitle {
   display:none !important;;
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
    box-shadow: none !important;;
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
        a.tablesForum__subjectLink:visited,
        .tablesForum__bodyRow a:visited { color: #777 !important; }
        a.pagination__button:visited { color: #aaa !important; border-color: #555 !important; }
        html.theme-dark a.pagination__button:visited { color: #666 !important; border-color: #444 !important; }

        /* ── Layout ── */
        @media (min-width: 1400px) {
            .layout { grid-template-columns: 1fr 51rem 24.5rem 1fr !important; }
            body.jvmerde-nosidebar .layout { grid-template-columns: 1fr 80rem 1fr !important; }
        }
        @media (max-width: 1399px) { .layout { grid-template-columns: unset !important; } }
        body.jvmerde-nosidebar .layout__row--gutter.layout__contentAside { display: none !important; }

        .tablesForum__bodyRow a:visited { color: var(--jv-text-muted-color) !important; }
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

        /* ── Navbar : tout custom uniquement en dark mode ── */
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
        .simpleButton {
            border-radius: 10px !important;
        }

        .userParameters {
            border-radius: 12px !important;
        }

        .forumSearchBar__formInput {
            padding-top: 4px !important;
        }

        .listActions {
            margin-left: -8px;
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
          margin-top: -14px !important;
        }


.pagination {
    margin-top: -12px;
}

.container__pagination {
    margin-bottom: 10px;
}


    `);

    // ─── Helpers ───────────────────────────────────
    const isTopic = () => window.location.pathname.startsWith('/forums/42-');

    // ─── Barre dupliquée en bas ────────────────────
    const buildBottomBar = () => {
        const sourceNavbar = document.querySelector('.buttonsNavbar');
        if (!sourceNavbar) return null;

        const sourceBtns = sourceNavbar.querySelectorAll(':scope > .buttonsNavbar__button');
        if (!sourceBtns.length) return null;

        const nav = document.createElement('div');
        nav.className = 'buttonsNavbar';

        sourceBtns.forEach((sourceBtn) => {
            if (sourceBtn.querySelector('.icon-reply')) return;
            if (sourceBtn.classList.contains('btn-jvchat')) return;

            if (sourceBtn.querySelector('.icon-refresh')) {
                const btn = document.createElement('button');
                btn.className = sourceBtn.className;
                btn.innerHTML = sourceBtn.innerHTML;
                btn.style.cssText = 'margin-left: auto !important;';
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

        const sourceNavbar = document.querySelector('.buttonsNavbar');
        if (!sourceNavbar) return false;

        const sourceBtns = sourceNavbar.querySelectorAll(':scope > .buttonsNavbar__button');
        if (!sourceBtns.length) return false;

        const allPagi = [...document.querySelectorAll('.container__pagination')]
            .filter(el => !el.classList.contains('js-pagination-top'));
        if (!allPagi.length) return false;
        const bottomPagi = allPagi[allPagi.length - 1];

        const existing = document.getElementById('jvcr-bottom-bar');
        if (existing) {
            const existingBtns = existing.querySelectorAll('.buttonsNavbar__button').length;
            const expectedBtns = [...sourceBtns].filter(b =>
                !b.querySelector('.icon-reply') && !b.classList.contains('btn-jvchat')
            ).length;
            if (
                existing.previousElementSibling === bottomPagi &&
                existingBtns === expectedBtns
            ) return true;
            existing.remove();
        }

        const bar = buildBottomBar();
        if (!bar) return false;

        const wrapper = document.createElement('div');
        wrapper.id = 'jvcr-bottom-bar';
        wrapper.appendChild(bar);

        bottomPagi.insertAdjacentElement('afterend', wrapper);
        return true;
    };

    window.addEventListener('DOMContentLoaded', () => {
        applyTheme();
        if (isTopic()) tryInjectBottomBar();
    });

    // Intervalle court au début pour capter les boutons ajoutés par d'autres scripts (ex: JVChat)
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

        e.stopImmediatePropagation();
        e.preventDefault();

        const post     = boutonCitation.closest(".messageUser__card");
        const fiberKey = Object.keys(boutonCitation).find(k => k.startsWith('__reactFiber$'));
        const props    = boutonCitation[fiberKey]?.return?.memoizedProps;
        const pseudo   = post.querySelector(".messageUser__label")?.textContent.trim();

        const citation = `> Le ${props.date} '''${pseudo}''' a écrit :\n> ${props.text.split("\n").join("\n> ")}\n\n`;

        unsafeWindow.jvc.getMessageEditor(".messageEditor__edit").insertText(citation);
    }, true);
}

Citations();
