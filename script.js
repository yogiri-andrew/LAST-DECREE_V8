"use strict";

/* =========================================================
   LAST DECREE V8 — FREE EDITION
   ORACLE LOCAL • XP • DÉCRETS • NAVIGATION
========================================================= */


/* =========================================================
   1. DONNÉES
========================================================= */

const defaultState = {
    username: "SHIDO",
    rank: "DECREE AGENT",
    level: 1,
    xp: 0,

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


/* =========================================================
   2. CHARGEMENT DES DONNÉES
========================================================= */

let state;

try {

    const saved =
        localStorage.getItem("LAST_DECREE_V8");

    if (saved) {

        state = {
            ...defaultState,
            ...JSON.parse(saved)
        };

    } else {

        state = JSON.parse(
            JSON.stringify(defaultState)
        );

    }

} catch (error) {

    console.warn(
        "Erreur de sauvegarde :",
        error
    );

    state = JSON.parse(
        JSON.stringify(defaultState)
    );
}


function saveState() {

    try {

        localStorage.setItem(
            "LAST_DECREE_V8",
            JSON.stringify(state)
        );

    } catch (error) {

        console.warn(
            "Impossible de sauvegarder.",
            error
        );
    }
}


/* =========================================================
   3. ÉCRAN DE DÉMARRAGE
========================================================= */

window.addEventListener("load", () => {

    const boot =
        document.getElementById("bootScreen");

    if (!boot) return;

    setTimeout(() => {

        boot.classList.add("hidden");

    }, 1000);

});


/* =========================================================
   4. NAVIGATION
========================================================= */

const sections =
    document.querySelectorAll(".section");

const navButtons =
    document.querySelectorAll("[data-section]");

const menuButton =
    document.getElementById("menuBtn");

const nav =
    document.querySelector("nav");


function showSection(id) {

    sections.forEach(section => {

        section.classList.remove("active");

    });


    const target =
        document.getElementById(id);

    if (!target) return;


    target.classList.add("active");


    navButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.section === id
        );

    });


    if (nav) {

        nav.classList.remove("open");

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

            nav.classList.toggle("open");

        }
    );

}


/* =========================================================
   5. XP / NIVEAU
========================================================= */

function addXP(amount) {

    if (
        typeof amount !== "number" ||
        amount <= 0
    ) {
        return;
    }


    state.xp += amount;


    while (
        state.xp >=
        state.level * 100
    ) {

        state.xp -=
            state.level * 100;

        state.level++;

        showToast(
            "NIVEAU " +
            state.level +
            " ATTEINT"
        );

    }


    saveState();

    updateProfile();

}


function updateProfile() {

    document
        .querySelectorAll("[data-level]")
        .forEach(element => {

            element.textContent =
                state.level;

        });


    document
        .querySelectorAll("[data-xp]")
        .forEach(element => {

            element.textContent =
                state.xp;

        });


    document
        .querySelectorAll("[data-username]")
        .forEach(element => {

            element.textContent =
                state.username;

        });


    document
        .querySelectorAll("[data-rank]")
        .forEach(element => {

            element.textContent =
                state.rank;

        });

}


/* =========================================================
   6. NOTIFICATIONS
========================================================= */

function addNotification(text) {

    state.notifications.unshift({

        text: text,

        date:
            new Date().toLocaleTimeString(
                "fr-FR"
            )

    });


    state.notifications =
        state.notifications.slice(0, 20);


    saveState();

    showToast(text);

}


function showToast(text) {

    const toast =
        document.createElement("div");

    toast.className =
        "ld-toast";


    const title =
        document.createElement("strong");

    title.textContent =
        "LAST DECREE";


    const message =
        document.createElement("span");

    message.textContent =
        text;


    toast.appendChild(title);
    toast.appendChild(message);


    document.body.appendChild(toast);


    setTimeout(() => {

        toast.classList.add("show");

    }, 20);


    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        }, 400);

    }, 3000);

}


/* =========================================================
   7. DÉCRETS
========================================================= */

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


        const number =
            document.createElement("div");

        number.className =
            "decree-number";

        number.textContent =
            "#" +
            String(decree.id).padStart(3, "0");


        const title =
            document.createElement("h3");

        title.textContent =
            decree.title;


        const description =
            document.createElement("p");

        description.textContent =
            decree.description;


        const status =
            document.createElement("span");

        status.className =
            "decree-status";

        status.textContent =
            decree.status;


        card.appendChild(number);
        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(status);


        decreeContainer.appendChild(card);

    });

}


/* =========================================================
   8. CRÉER UN DÉCRET
========================================================= */

function createDecree() {

    const title =
        prompt(
            "Nom du nouveau décret :"
        );


    if (!title || !title.trim()) {
        return;
    }


    const description =
        prompt(
            "Description du décret :"
        );


    if (
        !description ||
        !description.trim()
    ) {
        return;
    }


    let id = 1;


    if (state.decrees.length > 0) {

        id =
            Math.max(
                ...state.decrees.map(
                    decree => decree.id
                )
            ) + 1;

    }


    state.decrees.push({

        id: id,

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


/* =========================================================
   9. ORACLE LOCAL
========================================================= */

const chatForm =
    document.getElementById(
        "chatForm"
    );

const chatInput =
    document.getElementById(
        "chatInput"
    );

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


    paragraph.textContent =
        text;


    message.appendChild(label);

    message.appendChild(paragraph);

    chatMessages.appendChild(message);


    chatMessages.scrollTop =
        chatMessages.scrollHeight;

}


/* =========================================================
   10. CERVEAU DE L'ORACLE
========================================================= */

function oracleResponse(input) {

    const text =
        input
            .toLowerCase()
            .trim();


    /* SALUT */

    if (
        text.includes("bonjour") ||
        text.includes("salut") ||
        text.includes("hello") ||
        text === "yo"
    ) {

        return (
            "Connexion établie. " +
            "Bienvenue dans LAST DECREE."
        );

    }


    /* QUI ES-TU */

    if (
        text.includes("qui es tu") ||
        text.includes("qui es-tu") ||
        text.includes("oracle")
    ) {

        return (
            "Je suis ORACLE, " +
            "l'intelligence locale de " +
            "LAST DECREE V8."
        );

    }


    /* ORGANISATION */

    if (
        text.includes("organisation") ||
        text.includes("last decree")
    ) {

        return (
            "LAST DECREE est une organisation " +
            "structurée autour de ses membres, " +
            "de ses rangs et de ses décrets."
        );

    }


    /* NIVEAU */

    if (
        text.includes("niveau") ||
        text.includes("level") ||
        text.includes("xp")
    ) {

        return (
            "Niveau actuel : " +
            state.level +
            ". XP : " +
            state.xp +
            "."
        );

    }


    /* RANG */

    if (
        text.includes("rang") ||
        text.includes("grade")
    ) {

        return (
            "Votre rang actuel est : " +
            state.rank +
            "."
        );

    }


    /* DÉCRETS */

    if (
        text.includes("décret") ||
        text.includes("decret")
    ) {

        return (
            "Les archives contiennent " +
            state.decrees.length +
            " décret(s)."
        );

    }


    /* AIDE */

    if (
        text.includes("aide") ||
        text.includes("help") ||
        text.includes("commande")
    ) {

        return (
            "Je peux vous renseigner sur " +
            "LAST DECREE, les décrets, " +
            "votre rang, votre niveau et votre XP."
        );

    }


    /* MERCI */

    if (
        text.includes("merci")
    ) {

        return (
            "Requête enregistrée. " +
            "Le système reste opérationnel."
        );

    }


    /* RÉPONSE PAR DÉFAUT */

    const responses = [

        "Requête analysée. Aucune correspondance précise trouvée.",

        "Signal reçu. Reformulez votre requête.",

        "Analyse terminée. Données insuffisantes.",

        "Oracle attend une nouvelle instruction.",

        "Requête enregistrée. Le système reste opérationnel."

    ];


    return responses[
        Math.floor(
            Math.random() *
            responses.length
        )
    ];

}


/* =========================================================
   11. CHAT
========================================================= */

if (
    chatForm &&
    chatInput &&
    chatMessages
) {

    chatForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const text =
                chatInput.value.trim();


            if (!text) return;


            addMessage(
                "user",
                text
            );


            chatInput.value = "";


            const loading =
                document.createElement(
                    "div"
                );


            loading.id =
                "oracleTyping";


            loading.className =
                "message oracle-message";


            loading.innerHTML = `
                <span>ORACLE</span>
                <p>Analyse en cours...</p>
            `;


            chatMessages.appendChild(
                loading
            );


            chatMessages.scrollTop =
                chatMessages.scrollHeight;


            setTimeout(() => {

                if (
                    document.getElementById(
                        "oracleTyping"
                    )
                ) {

                    document
                        .getElementById(
                            "oracleTyping"
                        )
                        .remove();

                }


                addMessage(
                    "oracle",
                    oracleResponse(text)
                );


                addXP(5);

            }, 700);

        }
    );

}


/* =========================================================
   12. RACCOURCI /
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "/" &&
            document.activeElement !== chatInput
        ) {

            event.preventDefault();

            showSection("ai");


            if (chatInput) {
                chatInput.focus();
            }

        }

    }
);


/* =========================================================
   13. BOUTON CRÉER DÉCRET
========================================================= */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-create-decree]"
            );


        if (!button) return;


        createDecree();

    }
);


/* =========================================================
   14. INITIALISATION
========================================================= */

renderDecrees();

updateProfile();


console.log(
    "%c LAST DECREE V8 ",
    "background:#9d4edd;color:white;padding:8px;font-weight:bold"
);
/* =====================================================
   DASHBOARD V8
===================================================== */

function updateDashboard() {

    const xpFill =
        document.getElementById("xpFill");

    const decreeCount =
        document.getElementById("decreeCount");

    if (xpFill) {

        const required =
            state.level * 100;

        const percentage =
            Math.min(
                (state.xp / required) * 100,
                100
            );

        xpFill.style.width =
            percentage + "%";
    }

    if (decreeCount) {

        decreeCount.textContent =
            state.decrees.length;
    }

    renderNotifications();
}


function renderNotifications() {

    const container =
        document.getElementById(
            "notificationList"
        );

    if (!container) return;

    if (
        !state.notifications ||
        state.notifications.length === 0
    ) {

        container.innerHTML =
            `<p class="empty-log">
                Aucun événement enregistré.
            </p>`;

        return;
    }

    container.innerHTML =
        state.notifications
            .slice(0, 10)
            .map(notification => `
                <div class="log-entry">
                    <span>
                        ${notification.text}
                    </span>

                    <time>
                        ${notification.date}
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


updateDashboard();
console.log(
    "%c ORACLE LOCAL ONLINE ",
    "background:#00f5ff;color:#000;padding:5px"
);

console.log(
    "V8 FREE EDITION — SYSTEM READY"
);
/* =====================================================
   CLASSIFIED ACCESS V8
===================================================== */

const classifiedScreen =
    document.getElementById("classifiedScreen");

const agentName =
    document.getElementById("agentName");

const accessButton =
    document.getElementById("accessButton");

const accessStatus =
    document.getElementById("accessStatus");


function grantAccess() {

    const name =
        agentName.value.trim();

    if (!name) {

        accessStatus.textContent =
            "⚠ IDENTIFIANT REQUIS";

        return;
    }

    state.username =
        name.toUpperCase();

    saveState();

    updateProfile();

    accessStatus.style.color =
        "#55ff99";

    accessStatus.textContent =
        "✓ IDENTITÉ RECONNUE";

    accessButton.disabled = true;

    setTimeout(() => {

        classifiedScreen.classList.add(
            "access-granted"
        );

        addNotification(
            "Connexion de " +
            state.username +
            " établie."
        );

    }, 700);

}


if (accessButton) {

    accessButton.addEventListener(
        "click",
        grantAccess
    );

}


if (agentName) {

    agentName.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {
                grantAccess();
            }

        }
    );

}
/* =====================================================
   MEMBERS SYSTEM V8
===================================================== */

if (!state.members) {

    state.members = [

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

    ];

    saveState();

}


const membersContainer =
    document.getElementById(
        "membersContainer"
    );


function renderMembers() {

    if (!membersContainer) return;


    membersContainer.innerHTML = "";


    state.members.forEach(member => {

        const card =
            document.createElement("div");

        card.className =
            "member-card";


        const avatar =
            document.createElement("div");

        avatar.className =
            "member-avatar";

        avatar.textContent =
            member.name
                .charAt(0)
                .toUpperCase();


        const name =
            document.createElement("h3");

        name.textContent =
            member.name;


        const rank =
            document.createElement("div");

        rank.className =
            "member-rank";

        rank.textContent =
            member.rank;


        const level =
            document.createElement("div");

        level.className =
            "member-level";

        level.innerHTML = `
            <span>LEVEL</span>
            <strong>${member.level}</strong>
        `;


        const status =
            document.createElement("div");

        status.className =
            "member-status";

        status.textContent =
            member.status;


        card.appendChild(avatar);
        card.appendChild(name);
        card.appendChild(rank);
        card.appendChild(level);
        card.appendChild(status);


        membersContainer.appendChild(card);

    });

}


const addMemberBtn =
    document.getElementById(
        "addMemberBtn"
    );


if (addMemberBtn) {

    addMemberBtn.addEventListener(
        "click",
        () => {

            const name =
                prompt(
                    "Identifiant du nouveau membre :"
                );


            if (!name || !name.trim()) {
                return;
            }


            const rank =
                prompt(
                    "Rang du membre :",
                    "DECREE AGENT"
                );


            state.members.push({

                name:
                    name.trim().toUpperCase(),

                rank:
                    rank && rank.trim()
                        ? rank.trim().toUpperCase()
                        : "DECREE AGENT",

                level: 1,

                status: "ONLINE"

            });


            saveState();

            renderMembers();

            addXP(15);

            addNotification(
                "Nouveau membre ajouté : " +
                name.toUpperCase()
            );

        }
    );

}


renderMembers();
