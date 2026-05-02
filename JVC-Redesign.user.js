// ==UserScript==
// @name         JVC Redesign - Refonte de l'interface du forum
// @namespace    http://tampermonkey.net/
// @version      2.89
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

    if (location.pathname.includes('/forums/42-')) {
        GM_addStyle(`
            .icon-trash {
                color: #e4606d !important;
                filter: brightness(0.80) !important;
            }
        `);
    }
})();

(function() {
    'use strict';


    GM_addStyle(`
        /* Dé-stickifier la barre native */
        .buttonsNavbar__sticky {
            position: relative !important;
            top: 0 !important;
            order: 0 !important;
        }

        /* Contrer le forçage mobile du site :
           en dessous de 612px JVC force order:2 + bottom sur ce sélecteur,
           on l'écrase avec !important dans le même media query */
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
        .messageUser__signature {
            margin-top: 10px !important; padding-left: 0px !important; font-size: 0.85em !important; margin-bottom: 0px !important;
        }
        .messageUser__separator {
            border-top: 0.0625rem solid var(--border-color); width: 100%; margin-bottom: -2px;
        }

        .tablesForum__subjectText {
            font-weight: 500 !important;
            font-size: 14px !important;
        }

        .messageUser__main {
            min-height: 0 !important;
            overflow: visible !important;
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

        /* ───────────────────────────────────────────── */
        /* ICÔNES COLORÉES - Sans bordure, sans fond    */
        /* ───────────────────────────────────────────── */

        .messageUser__action:has(.icon-kick),
        .messageUser__action:has(.icon-trash),
        .messageUser__action:has(.icon-topic-restore) {
            border: none !important;
            background: none !important;
            background-color: transparent !important;
            box-shadow: none !important;
            outline: none !important;
        }

        .messageUser__actionIcon.icon-kick-active {
 filter: invert(58%) sepia(98%) saturate(2000%) hue-rotate(0deg) brightness(0.80) !important;
}

        /* Icône KICK - ORANGE */
        .icon-kick {
            filter: invert(58%) sepia(98%) saturate(2000%) hue-rotate(0deg) brightness(0.80) !important;
        }

        /* Icône DDB - Jaune */
        .icon-signaler {
            color: #D7D764 !important;
            filter: brightness(0.80) !important;
        }

        /* Icône RESTAURER - VERT */
        .icon-topic-restore {
            filter: invert(58%) sepia(78%) saturate(600%) hue-rotate(70deg) brightness(0.80) !important;
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

        .buttonsNavbar {
            background-color: #272A30 !important;
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

        .buttonsNavbar__button {
            color: #f2f2f2 !important;
            background-color: #272A30 !important;
           padding-left: 2px;
          padding-right: 4px;
        }

        .buttonsNavbar__label {
            display: block !important;
            font-size: 15px !important;
            font-weight: 500 !important;
            line-height: 1 !important;
        }

        .buttonsNavbar__button--highlighted:hover,
        .buttonsNavbar__button--highlighted:active,
        .buttonsNavbar__button--highlighted:focus {
            background-color: #272A30 !important;
            color: #F66031 !important;
        }

        .buttonsNavbar__button:has(.icon-refresh):hover {
            background-color: #272A30 !important;
            color: #F66031 !important;
        }

.listActions {
    margin-left: -8px;
}


.tablesForum--hotTopics, .tablesForum--listTopicsWithActions, .tablesForum--listTopics {
    --tables-forums-icon-size: 24px;
}


    `);


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
