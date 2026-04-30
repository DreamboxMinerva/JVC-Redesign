// ==UserScript==
// @name         Dezoomed JVMERDE Edition
// @namespace    http://tampermonkey.net/
// @version      2.1
// @author       BlackArch + Bakuredo + StrangerFruit + captain_cid31 + herolink + Can-02
// @description  Tentative de rendre l'UI le plus agréable possible
// @match        https://www.jeuxvideo.com/forums/0-*
// @match        https://www.jeuxvideo.com/forums/42-*
// @match        https://www.jeuxvideo.com/recherche/forums/0-*
// @match        https://www.jeuxvideo.com/recherche/forums/42-*
// @updateURL    https://raw.githubusercontent.com/DreamboxMinerva/Dezoomed-JVMERDE-Edition/main/Dezoomed-JVMERDE-Edition.user.js
// @downloadURL  https://raw.githubusercontent.com/DreamboxMinerva/Dezoomed-JVMERDE-Edition/main/Dezoomed-JVMERDE-Edition.user.js
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';


    let nosidebarEnabled     = localStorage.getItem('jvmerde-nosidebar') === 'on';
    let pendingNewMessages   = 0;
    let roueBtnListenerAdded = false;

    GM_addStyle(`
        /* Dé-stickifier la barre native */
        .buttonsNavbar__sticky { position: relative !important; top: 0 !important; }

        /* ── Barre bas : thème sombre (défaut) ── */
        #old-jvc-bar-v22 {
            display: flex; gap: 10px; margin: 20px 0; padding: 12px;
            background: #1e2125; border: 1px solid #32373d; border-radius: 4px; align-items: center;
        }
        .btn-jvc-v22 {
            background: #32373d; color: #fff !important; border: 1px solid #454d55;
            padding: 7px 15px; font-size: 13px; font-weight: bold; text-decoration: none !important;
            border-radius: 3px; cursor: pointer; display: inline-flex; align-items: center;
        }
        .btn-grey { background: #555 !important; border-color: #777 !important; }
        #jvmerde-refresh-status { font-size: 11px; color: #888; margin-left: auto; white-space: nowrap; }

        /* ── Barre bas : thème sombre par défaut via media query, clair si light ── */
        @media (prefers-color-scheme: light) {
            #old-jvc-bar-v22 { background: #e8e8e8 !important; border-color: #ccc !important; }
            .btn-jvc-v22 { background: #d0d0d0 !important; color: #1a1a1a !important; border-color: #aaa !important; }
            #jvmerde-refresh-status { color: #555 !important; }
        }
        /* Classe JVC explicite — priorité sur le media query */
        html.theme-dark #old-jvc-bar-v22 { background: #1e2125 !important; border-color: #32373d !important; }
        html.theme-dark .btn-jvc-v22 { background: #32373d !important; color: #fff !important; border-color: #454d55 !important; }
        html.theme-dark #jvmerde-refresh-status { color: #888 !important; }
        html.theme-light #old-jvc-bar-v22 { background: #e8e8e8 !important; border-color: #ccc !important; }
        html.theme-light .btn-jvc-v22 { background: #d0d0d0 !important; color: #1a1a1a !important; border-color: #aaa !important; }
        html.theme-light #jvmerde-refresh-status { color: #555 !important; }


    .tablesForum__cellSubject {
        padding-top: 0.5px;
      padding-bottom: 0.5px;
    }



        /* ── Messages : grid pour footer en haut à droite ── */
        .messageUser__card {
            display: grid !important;
            grid-template-areas: "header footer" "main main" !important;
            grid-template-columns: 1fr auto !important;
            grid-template-rows: auto 1fr !important;
            padding: 4px 8px !important;
            border-left: none !important;
        }
        .messageUser__header { grid-area: header !important; margin-bottom: 4px !important; }
        .messageUser__main   { grid-area: main !important; }
        .messageUser__footer {
            grid-area: footer !important;
            display: flex !important; align-items: flex-start !important;
            gap: 4px !important; padding: 4px 0 0 0 !important; margin: 0 !important;
            border-top: none !important; opacity: 0.5 !important; transition: opacity 0.2s !important;
        }
        .messageUser__card:hover .messageUser__footer,
        .messageUser__footer:hover { opacity: 1 !important; }
        .messageUser__overlay { pointer-events: none !important; }
        .messageUser { margin-bottom: 4px !important; }

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

.messageUser__header {
    margin-bottom: 0.9375rem !important;
}

.messageUser__card {
    padding: 14px !important;
}

.messageUser__msg span.message__urlImg {
    display: inline-block !important;
    width: 200px !important;
    height: 150px !important;
    background-size: contain !important;
    background-repeat: no-repeat !important;
    background-position: center !important;
}

  .messageUser__msg a span.message__urlImgLarge {
            height: 150px;
            width: 200px;
            padding-bottom: 0;
            display:inline-block;}

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
    display: inline;
    font-size: 1.1953125rem;
    font-weight: 700;;
}


    `);

    // ─── Helpers ───────────────────────────────────
    const isTopic    = () => window.location.pathname.startsWith('/forums/42-');
    const getForumUrl = () => {
        if (isTopic()) {
            const bread = document.querySelectorAll('.breadcrumb__item');
            for (const item of bread) {
                if (item.href && item.href.includes('/forums/0-')) return item.href;
            }
            return null;
        }
        return window.location.href.split('#')[0];
    };

    // ─── Pagination top ────────────────────────────
    const watchTopPagination = () => {
        if (!isTopic()) return;
        const paginationTop = document.querySelector('.js-pagination-top.container__pagination');
        if (!paginationTop) return;
        const replacePagination = () => {
            const bottom = document.querySelector('.container__pagination:not(.js-pagination-top)');
            if (bottom && paginationTop.innerHTML !== bottom.innerHTML) {
                paginationTop.innerHTML = bottom.innerHTML;
            }
        };
        replacePagination();
        const observer = new MutationObserver(() => {
            observer.disconnect();
            replacePagination();
            observer.observe(paginationTop, { childList: true, subtree: true });
        });
        observer.observe(paginationTop, { childList: true, subtree: true });
    };



    // ─── Auto-refresh ──────────────────────────────
    const isScrolledToBottom = () =>
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 150;

    const setStatus = (msg, clickable = false) => {
        const el = document.getElementById('jvmerde-refresh-status');
        if (!el) return;
        el.textContent = msg;
        el.style.cursor = clickable ? 'pointer' : 'default';
        el.style.textDecoration = clickable ? 'underline' : 'none';
        el.onclick = clickable ? () => location.reload() : null;
    };

    const updateToggleButton = () => {
        const btn = document.getElementById('jvmerde-toggle');
        if (!btn) return;
        if (autoRefreshEnabled) { btn.textContent = '\u27F3 Auto ON'; btn.classList.remove('btn-grey'); }
        else { btn.textContent = '\u27F3 Auto OFF'; btn.classList.add('btn-grey'); }
    };

    const MSG_SELECTOR = 'div[id^="message-"].messageUser';
    const REFRESH_DELAY = 30000;
    let knownIds = new Set();

    const collectExistingPosts = () => {
        document.querySelectorAll(MSG_SELECTOR).forEach(p => knownIds.add(p.id));
    };

    const fetchAndInjectNewPosts = async () => {
        if (!autoRefreshEnabled) return;
        try {
            setStatus('\u27F3 V\u00E9rification...');
            // credentials: 'include' requis pour envoyer les cookies JVC (sinon redirection)
            const res = await fetch(window.location.href, {
                cache: 'no-store',
                credentials: 'include'
            });
            if (!res.ok) { setStatus('\u26A0 Erreur ' + res.status); return; }
            const text = await res.text();
            const doc = new DOMParser().parseFromString(text, 'text/html');
            let added = 0;
            doc.querySelectorAll(MSG_SELECTOR).forEach(post => {
                if (!knownIds.has(post.id)) { knownIds.add(post.id); added++; }
            });
            const now = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
            if (added > 0) {
                pendingNewMessages += added;
                const shouldReload =
                    CONFIG.autoRefreshMode === 'force' ||
                    (CONFIG.autoRefreshMode === 'auto' && isScrolledToBottom());
                if (shouldReload) {
                    setStatus(`\u2705 ${pendingNewMessages} nouveau(x) \u2014 ${now}`);
                    sessionStorage.setItem('jvmerde-scroll', 'bottom');
                    location.reload();
                } else {
                    setStatus(`\u2B07 ${pendingNewMessages} nouveau(x) — cliquer pour voir`, true);
                }
            } else {
                pendingNewMessages = 0;
                setStatus(`\u27F3 RAS \u2014 ${now}`);
            }
        } catch (e) {
            setStatus('\u26A0 Erreur r\u00E9seau');
        }
    };

    const startAutoRefresh = () => {
        if (!isTopic()) return;
        collectExistingPosts();
        setInterval(fetchAndInjectNewPosts, REFRESH_DELAY);
    };


    // ─── Menu roue crantée ─────────────────────────
    const tryAttachRoueListener = () => {
        if (roueBtnListenerAdded) return;
        const roueBtn = document.querySelector('.dropdownCustom__button');
        if (!roueBtn) return;
        roueBtnListenerAdded = true;
        roueBtn.addEventListener('click', () => {
            setTimeout(() => {
                const menu = document.querySelector('.dropdownCustom__list');
                if (!menu || menu.querySelector('#jvmerde-dezoom-chk')) return;

                const liSidebar = document.createElement('li');
                liSidebar.className = 'dropdownCustom__item';
                liSidebar.innerHTML = `
                    <div class="userParameters__parameterItem">
                        <span class="userParameters__parameterText">Cacher la sidebar</span>
                        <div class="userParameters__switch">
                            <input type="checkbox" id="jvmerde-nosidebar-chk" class="userParameters__checkbox" ${nosidebarEnabled ? 'checked' : ''}>
                            <label for="jvmerde-nosidebar-chk" class="userParameters__label"></label>
                        </div>
                    </div>`;
                liSidebar.querySelector('#jvmerde-nosidebar-chk').addEventListener('change', (e) => {
                    nosidebarEnabled = e.target.checked;
                    localStorage.setItem('jvmerde-nosidebar', nosidebarEnabled ? 'on' : 'off');
                    document.body.classList.toggle('jvmerde-nosidebar', nosidebarEnabled);
                });
                menu.appendChild(liSidebar);

            }, 50);
        });
    };

    // ─── Init ──────────────────────────────────────
    window.addEventListener('DOMContentLoaded', () => {
        if (nosidebarEnabled) document.body.classList.add('jvmerde-nosidebar');
        document.addEventListener('mousedown', handleMiddleClick, true);
        if (isTopic()) {
            injectBottomBar();
            watchTopPagination();
            startAutoRefresh();
            fixLargeStickers();
            const savedScroll = sessionStorage.getItem('jvmerde-scroll');
            if (savedScroll === 'bottom') {
                window.scrollTo(0, document.documentElement.scrollHeight);
                sessionStorage.removeItem('jvmerde-scroll');
            }
        }
        setTimeout(tryAttachRoueListener, 500);
        setTimeout(tryAttachRoueListener, 1500);
        setTimeout(tryAttachRoueListener, 3000);
    });

    setInterval(() => {
        if (isTopic()) injectBottomBar();
        tryAttachRoueListener();
    }, 5000);

})();

function Citations() {
const posts = JSON.parse(atob(unsafeWindow.jvc.forumsAppPayload)).listMessage;
const mapPosts= new Map(posts.map(m => [m.id, m]));

document.addEventListener('click', function(e) {
    const bouton = e.target.closest('.messageUser__action[title="Citer le message"]');
    if (!bouton) return;
    e.stopImmediatePropagation();
    e.preventDefault();

    const post = bouton.closest(".messageUser__card");
    const pseudo = post.querySelector(".messageUser__label").textContent;
    const texte = mapPosts.get(parseInt(post.querySelector('a.messageUser__date')?.href.match(/\/message\/(\d+)/)?.[1]));
    const citation = `> Le ${texte.publishedDate} ${pseudo} a écrit :\n> ${texte.text.split("\n").join("\n> ")}\n\n`;

    unsafeWindow.jvc.getMessageEditor(".messageEditor__edit").insertText(citation);
}, true);
}

// ═══════════════════════════════════════════════════
// CITATION AVEC PSEUDO — par captain_cid31 & can-02 & herolink
// ═══════════════════════════════════════════════════
function Citations() {
    document.addEventListener('click', function(e) {
        const boutonCitation = e.target.closest('.messageUser__action[title="Citer le message"]');
        if (!boutonCitation) return;

        e.stopImmediatePropagation();
        e.preventDefault();

        const post = boutonCitation.closest(".messageUser__card");

        const fiberKey = Object.keys(boutonCitation).find(k => k.startsWith('__reactFiber$'));
        const props = boutonCitation[fiberKey]?.return?.memoizedProps;

        const pseudo = post.querySelector(".messageUser__label")?.textContent.trim();

        const citation = `> Le ${props.date} '''${pseudo}''' a écrit :\n> ${props.text.split("\n").join("\n> ")}\n\n`;

        unsafeWindow.jvc.getMessageEditor(".messageEditor__edit").insertText(citation);
    }, true);
}


Citations();
