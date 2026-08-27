"use strict";

/* =========================================================
   LAST DECREE V8.2 — FREE EDITION
   SYSTEME COMPLET
   • CLASSIFIED ACCESS
   • DASHBOARD
   • XP / LEVEL
   • RANKS
   • MEMBERS
   • SEARCH
   • MEMBER PROFILE
   • ADMIN
   • DECREES
   • ORACLE LOCAL
   • NOTIFICATIONS
   • LOCAL STORAGE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       1. RANK SYSTEM
    ===================================================== */

    const rankSystem = [
        {
            name: "THE DECREE",
            level: 10,
            permission: "TOTAL AUTHORITY"
        },
        {
            name: "OVERLORD",
            level: 9,
            permission: "COMMAND"
        },
        {
            name: "EXECUTOR",
            level: 8,
            permission: "EXECUTION"
        },
        {
            name: "ARCHON",
            level: 7,
            permission: "HIGH COMMAND"
        },
        {
            name: "SHINIGAMI",
            level: 6,
            permission: "ELITE ACCESS"
        },
        {
            name: "WARDEN",
            level: 5,
            permission: "SECURITY"
        },
        {
            name: "ELITE AGENT",
            level: 4,
            permission: "ADVANCED ACCESS"
        },
        {
            name: "DECREE AGENT",
            level: 3,
            permission: "STANDARD ACCESS"
        },
        {
            name: "INITIATE",
            level: 2,
            permission: "LIMITED ACCESS"
        },
        {
            name: "RECRUIT",
            level: 1,
            permission: "BASIC ACCESS"
        }
    ];


    /* =====================================================
       2. DEFAULT STATE
    ===================================================== */

    const defaultState = {
        username: "SHIDO",

        rank: "DECREE AGENT",

        level: 1,

        xp: 0,

        members: [
            {
                name: "SHIDO",
                rank: "DECREE AGENT",
                level: 1,
                status: "ONLINE"
            },

            {
                name: "YOGIRI",
                rank: "EXECUTOR",
                level: 12,
                status: "ONLINE"
            },

            {
                name: "UNKNOWN",
                rank: "SHINIGAMI",
                level: 8,
                status: "OFFLINE"
            }
        ],

        decrees: [
            {
                id: 1,
                title: "THE FIRST DECREE",
                description:
                    "Le système reconnaît officiellement l'existence de LAST DECREE.",
                status: "ARCHIVED"
            },

            {
                id: 2,
                title: "THE SECOND DECREE",
                description:
                    "Toute décision majeure doit être enregistrée dans les archives.",
                status: "ACTIVE"
            },

            {
                id: 3,
                title: "THE THIRD DECREE",
                description:
                    "Le système doit évoluer avec l'organisation.",
                status: "ACTIVE"
            }
        ],

        notifications: []
    };


    /* =====================================================
       3. LOAD STATE
    ===================================================== */

    let state;

    try {

        const saved =
            localStorage.getItem(
                "LAST_DECREE_V8"
            );

        if (saved) {

            const parsed =
                JSON.parse(saved);

            state = {
                ...defaultState,
                ...parsed
            };

        } else {

            state =
                JSON.parse(
                    JSON.stringify(
                        defaultState
                    )
                );

        }

    } catch (error) {

        console.warn(
            "LAST DECREE : sauvegarde invalide.",
            error
        );

        state =
            JSON.parse(
                JSON.stringify(
                    defaultState
                )
            );

    }


    /* =====================================================
       4. DATA REPAIR
    ===================================================== */

    if (!Array.isArray(state.members)) {

        state.members =
            JSON.parse(
                JSON.stringify(
                    defaultState.members
                )
            );

    }

    if (!Array.isArray(state.decrees)) {

        state.decrees = [];

    }

    if (!Array.isArray(state.notifications)) {

        state.notifications = [];

    }

    if (!state.username) {

        state.username = "SHIDO";

    }

    if (!state.rank) {

        state.rank = "DECREE AGENT";

    }

    if (!state.level || state.level < 1) {

        state.level = 1;

    }

    if (
        typeof state.xp !== "number" ||
        state.xp < 0
    ) {

        state.xp = 0;

    }


    function saveState() {

        try {

            localStorage.setItem(
                "LAST_DECREE_V8",
                JSON.stringify(state)
            );

        } catch (error) {

            console.warn(
                "LAST DECREE : impossible de sauvegarder.",
                error
            );

        }

    }


    /* =====================================================
       5. LOADER — NE BLOQUE JAMAIS
    ===================================================== */

    function hideLoader() {

        const loaders = [

            document.getElementById(
                "bootScreen"
            ),

            document.getElementById(
                "loader"
            )

        ];

        loaders.forEach(loader => {

            if (!loader) return;

            loader.classList.add(
                "hidden"
            );

            loader.style.opacity = "0";

            loader.style.pointerEvents =
                "none";

            setTimeout(() => {

                loader.style.display =
                    "none";

            }, 1000);

        });

    }


    setTimeout(
        hideLoader,
        1200
    );


    window.addEventListener(
        "load",
        () => {

            setTimeout(
                hideLoader,
                300
            );

        }
    );


    /* =====================================================
       6. NAVIGATION
    ===================================================== */

    const sections =
        document.querySelectorAll(
            ".section"
        );

    const navButtons =
        document.querySelectorAll(
            "[data-section]"
        );

    const menuButton =
        document.getElementById(
            "menuBtn"
        );

    const nav =
        document.querySelector("nav");


    function showSection(id) {

        if (!id) return;


        sections.forEach(section => {

            section.classList.remove(
                "active"
            );

        });


        const target =
            document.getElementById(id);


        if (!target) {

            console.warn(
                "Section introuvable :",
                id
            );

            return;

        }


        target.classList.add(
            "active"
        );


        navButtons.forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.section === id
            );

        });


        if (nav) {

            nav.classList.remove(
                "open"
            );

        }


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    navButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                showSection(
                    button.dataset.section
                );

            }
        );

    });


    if (menuButton && nav) {

        menuButton.addEventListener(
            "click",
            () => {

                nav.classList.toggle(
                    "open"
                );

            }
        );

    }


    /* =====================================================
       7. PROFILE
    ===================================================== */

    function updateProfile() {

        document
            .querySelectorAll(
                "[data-username]"
            )
            .forEach(element => {

                element.textContent =
                    state.username;

            });


        document
            .querySelectorAll(
                "[data-rank]"
            )
            .forEach(element => {

                element.textContent =
                    state.rank;

            });


        document
            .querySelectorAll(
                "[data-level]"
            )
            .forEach(element => {

                element.textContent =
                    state.level;

            });


        document
            .querySelectorAll(
                "[data-xp]"
            )
            .forEach(element => {

                element.textContent =
                    state.xp;

            });

    }


    /* =====================================================
       8. NOTIFICATIONS
    ===================================================== */

    function addNotification(text) {

        state.notifications.unshift({

            text: text,

            date:
                new Date()
                    .toLocaleTimeString(
                        "fr-FR"
                    )

        });


        state.notifications =
            state.notifications.slice(
                0,
                30
            );


        saveState();

        showToast(text);

        renderNotifications();

    }


    function showToast(text) {

        const toast =
            document.createElement(
                "div"
            );


        toast.className =
            "ld-toast";


        toast.innerHTML = `

            <strong>
                LAST DECREE
            </strong>

            <span>
                ${escapeHTML(text)}
            </span>

        `;


        document.body.appendChild(
            toast
        );


        requestAnimationFrame(() => {

            toast.classList.add(
                "show"
            );

        });


        setTimeout(() => {

            toast.classList.remove(
                "show"
            );


            setTimeout(() => {

                toast.remove();

            }, 400);

        }, 3000);

    }


    function renderNotifications() {

        const container =
            document.getElementById(
                "notificationList"
            );


        if (!container) return;


        if (
            state.notifications.length === 0
        ) {

            container.innerHTML = `
                <p class="empty-log">
                    Aucun événement enregistré.
                </p>
            `;

            return;

        }


        container.innerHTML =
            state.notifications
                .slice(0, 10)
                .map(notification => `

                    <div class="log-entry">

                        <span>
                            ${escapeHTML(
                                notification.text
                            )}
                        </span>

                        <time>
                            ${escapeHTML(
                                notification.date
                            )}
                        </time>

                    </div>

                `)
                .join("");

    }


    const clearNotifications =
        document.getElementById(
            "clearNotifications"
        );


    if (clearNotifications) {

        clearNotifications.addEventListener(
            "click",
            () => {

                state.notifications = [];

                saveState();

                renderNotifications();

            }
        );

    }


    /* =====================================================
       9. XP / LEVEL
    ===================================================== */

    function addXP(amount) {

        amount =
            Number(amount) || 0;


        if (amount <= 0) return;


        state.xp += amount;


        let levelUp = false;


        while (
            state.xp >=
            state.level * 100
        ) {

            state.xp -=
                state.level * 100;

            state.level++;

            levelUp = true;


            showToast(
                "NIVEAU " +
                state.level +
                " ATTEINT"
            );

        }


        checkRankUpgrade();

        saveState();

        updateProfile();

        updateDashboard();

    }


    /* =====================================================
       10. AUTOMATIC RANK
    ===================================================== */

    function checkRankUpgrade() {

        const possible =
            rankSystem.filter(
                rank =>
                    state.level >=
                    rank.level
            );


        if (
            possible.length === 0
        ) return;


        const highest =
            possible[0];


        if (
            highest.name !==
            state.rank
        ) {

            const oldRank =
                state.rank;


            state.rank =
                highest.name;


            saveState();


            addNotification(
                "PROMOTION : " +
                oldRank +
                " → " +
                state.rank
            );

        }

    }


    /* =====================================================
       11. DASHBOARD
    ===================================================== */

    function updateDashboard() {

        const xpFill =
            document.getElementById(
                "xpFill"
            );


        const decreeCount =
            document.getElementById(
                "decreeCount"
            );


        const levelDisplay =
            document.getElementById(
                "levelDisplay"
            );


        const xpDisplay =
            document.getElementById(
                "xpDisplay"
            );


        if (xpFill) {

            const required =
                state.level * 100;


            const percentage =
                Math.min(
                    (
                        state.xp /
                        required
                    ) * 100,
                    100
                );


            xpFill.style.width =
                percentage + "%";

        }


        if (decreeCount) {

            decreeCount.textContent =
                state.decrees.length;

        }


        if (levelDisplay) {

            levelDisplay.textContent =
                state.level;

        }


        if (xpDisplay) {

            xpDisplay.textContent =
                state.xp;

        }


        renderNotifications();

    }


    /* =====================================================
       12. DECREES
    ===================================================== */

    const decreeContainer =
        document.getElementById(
            "decree
