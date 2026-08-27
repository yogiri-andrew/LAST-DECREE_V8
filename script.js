/* =========================================================
   LAST DECREE V8 — FREE EDITION
   Aucun abonnement • aucune API • aucune clé
========================================================= */

"use strict";

/* =========================
   ÉTAT DU SYSTÈME
========================= */

const defaultState = {
    username: "SHIDO",
    rank: "DECREE AGENT",
    xp: 0,
    level: 1,
    notifications: [],
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
        }
    ]
};

let state = loadState();


/* =========================
   SAUVEGARDE
========================= */

function loadState() {

    try {

        const saved = localStorage.getItem(
            "LAST_DECREE_V8"
        );

        if (!saved) {
            return structuredClone(defaultState);
        }

        return {
            ...structuredClone(defaultState),
            ...JSON.parse(saved)
        };

    } catch (error) {

        console.warn(
            "Impossible de charger les données.",
            error
        );

        return structuredClone(defaultState);
    }
}


function saveState() {

    localStorage.setItem(
        "LAST_DECREE_V8",
        JSON.stringify(state)
    );
}


/* =========================
   BOOT SCREEN
========================= */

const bootScreen =
    document.getElementById("bootScreen");

window.addEventListener("load", () => {

    setTimeout(() => {

        if (bootScreen) {
            bootScreen.classList.add("hidden");
        }

    }, 1600);

});


/* =========================
   NAVIGATION
========================= */

const sections =
    document.querySelectorAll(".section");

const navigationButtons =
    document.querySelectorAll("[data-section]");

const menuButton =
    document.getElementById("menuBtn");

const navigation =
    document.querySelector("nav");


function showSection(sectionId) {

    sections.forEach(section => {

        section.classList.remove("active");

    });


    const target =
        document.getElementById(sectionId);

    if (!target) return;


    target.classList.add("active");


    navigationButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.section === sectionId
        );

    });


    if (navigation) {
        navigation.classList.remove("open");
    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


navigationButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            showSection(
                button.dataset.section
            );

        }
    );

});


if (menuButton) {

    menuButton.addEventListener(
        "click",
        () => {

            navigation.classList.toggle(
                "open"
            );

        }
    );

}


/* =========================
   XP SYSTEM
========================= */

function addXP(amount) {

    if (
        typeof amount !== "number" ||
        amount <= 0
    ) {
        return;
    }


    state.xp += amount;


    const requiredXP =
        state.level * 100;


    if (state.xp >= requiredXP) {

        state.xp -= requiredXP;

        state.level++;

        addNotification(
            `NIVEAU ${state.level} ATTEINT`
        );

    }


    saveState();

    updateProfile();

}


function updateProfile() {

    const levelElements =
        document.querySelectorAll(
            "[data-level]"
        );

    const xpElements =
        document.querySelectorAll(
            "[data-xp]"
        );

    const usernameElements =
        document.querySelectorAll(
            "[data-username]"
        );


    levelElements.forEach(element => {

        element.textContent =
            state.level;

    });


    xpElements.forEach(element => {

        element.textContent =
            state.xp;

    });


    usernameElements.forEach(element => {

        element.textContent =
            state.username;

    });

}


/* =========================
   NOTIFICATIONS
========================= */

function addNotification(message) {

    state.notifications.unshift({

        message,

        date:
            new Date().toLocaleTimeString(
                "fr-FR"
            )

    });


    state.notifications =
        state.notifications.slice(0, 20);


    saveState();

    showToast(message);
}


function showToast(message) {

    const toast =
        document.createElement("div");

    toast.className = "ld-toast";

    toast.innerHTML = `
        <strong>LAST DECREE</strong>
        <span>${escapeHTML(message)}</span>
    `;

    document.body.appendChild(toast);


    requestAnimationFrame(() => {

        toast.classList.add("show");

    });


    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        }, 400);

    }, 3000);

}


/* =========================
   DÉCRETS
========================= */

const decreeContainer =
    document.getElementById(
        "decreeContainer"
    );


function renderDecrees() {

    if (!decreeContainer) return;


    decreeContainer.innerHTML = "";


    state.decrees.forEach(decree => {

        const card =
            document.createElement("article");

        card.className =
            "decree-card";


        card.innerHTML = `

            <div class="decree-number">
                #${String(decree.id).padStart(3, "0")}
            </div>

            <h3>
                ${escapeHTML(decree.title)}
            </h3>

            <p>
                ${escapeHTML(
                    decree.description
                )}
            </p>

            <span class="decree-status">
                ${escapeHTML(decree.status)}
            </span>

        `;


        decreeContainer.appendChild(card);

    });

}


function createDecree() {

    const title =
        prompt("Titre du décret :");

    if (!title || !title.trim()) {
        return;
    }


    const description =
        prompt("Description du décret :");

    if (
        !description ||
        !description.trim()
    ) {
        return;
    }


    const nextId =
        state.decrees.length > 0
            ? Math.max(
                ...state.decrees.map(
                    decree => decree.id
                )
              ) + 1
            : 1;


    state.decrees.push({

        id: nextId,

        title:
            title.trim(),

        description:
            description.trim(),

        status:
            "ACTIVE"

    });


    saveState();

    renderDecrees();

    addXP(25);

    addNotification(
        "Nouveau décret enregistré."
    );

}


/* =========================
   ORACLE LOCAL
========================= */

const chatForm =
    document.getElementById("chatForm");

const chatInput =
    document.getElementById("chatInput");

const chatMessages =
    document.getElementById(
        "chatMessages"
    );


function addMessage(type, text) {

    if (!chatMessages) return;


    const message =
        document.createElement("div");

    message.className =
        type === "user"
            ? "message user-message"
            : "message oracle-message";


    const label =
        document.createElement("span");

    label.textContent =
        type === "user"
            ? "YOU"
            : "ORACLE";


    const paragraph =
        document.createElement("p");

    paragraph.textContent = text;


    message.appendChild(label);

    message.appendChild(paragraph);

    chatMessages.appendChild(message);


    chatMessages.scrollTop =
        chatMessages.scrollHeight;

}


/* =========================
   RÉPONSES ORACLE
========================= */

function oracleResponse(input) {

    const message =
        input
            .toLowerCase()
            .trim();


    if (
        message.includes("bonjour") ||
        message.includes("salut") ||
        message.includes("yo")
    ) {

        return (
            "Connexion établie. " +
            "Bienvenue dans LAST DECREE."
        );

    }


    if (
        message.includes("last decree") ||
        message.includes("organisation")
    ) {

        return (
            "LAST DECREE est une organisation " +
            "structurée autour de ses membres, " +
            "de ses rangs et de ses décrets."
        );

    }


    if (
        message.includes("mon niveau") ||
        message.includes("level")
    ) {

        return (
            `Votre niveau actuel est ${state.level}. ` +
            `XP : ${state.xp}.`
        );

    }


    if (
        message.includes("mon rang") ||
        message.includes("grade")
    ) {

        return (
            `Votre rang actuel est ${state.rank}.`
        );

    }


    if (
        message.includes("décret") ||
        message.includes("decret")
    ) {

        return (
            `Les archives contiennent actuellement ` +
            `${state.decrees.length} décret(s).`
        );

    }


    if (
        message.includes("qui es-tu") ||
        message.includes("qui es tu") ||
        message.includes("oracle")
    ) {

        return (
            "Je suis ORACLE, le système local " +
            "d'assistance de LAST DECREE V8."
        );

    }


    if (
        message.includes("aide") ||
        message.includes("help")
    ) {

        return (
            "Commandes disponibles : " +
            "décrets, niveau, rang, organisation, " +
            "Oracle et profil."
        );

    }


    if (
        message.includes("merci")
    ) {

        return (
            "Requête enregistrée. " +
            "Le système reste opérationnel."
        );
