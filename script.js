const bootScreen = document.getElementById("bootScreen");
const sections = document.querySelectorAll(".section");
const navButtons = document.querySelectorAll("[data-section]");
const menuBtn = document.getElementById("menuBtn");
const nav = document.querySelector("nav");

window.addEventListener("load", () => {
    setTimeout(() => {
        bootScreen.classList.add("hidden");
    }, 1600);
});

function showSection(id) {

    sections.forEach(section => {
        section.classList.remove("active");
    });

    const target = document.getElementById(id);

    if (target) {
        target.classList.add("active");
    }

    navButtons.forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.section === id
        );
    });

    nav.classList.remove("open");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

navButtons.forEach(button => {

    button.addEventListener("click", () => {
        showSection(button.dataset.section);
    });

});

menuBtn.addEventListener("click", () => {
    nav.classList.toggle("open");
});


/* =========================
   ORACLE AI
========================= */

const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");

function addMessage(type, text) {

    const message = document.createElement("div");

    message.className =
        type === "user"
            ? "message user-message"
            : "message oracle-message";

    const label = document.createElement("span");
    label.textContent =
        type === "user"
            ? "YOU"
            : "ORACLE";

    const paragraph = document.createElement("p");

    paragraph.textContent = text;

    message.appendChild(label);
    message.appendChild(paragraph);

    chatMessages.appendChild(message);

    chatMessages.scrollTop =
        chatMessages.scrollHeight;
}

function setLoading() {

    const loading = document.createElement("div");

    loading.id = "oracleLoading";
    loading.className = "message oracle-message";

    loading.innerHTML = `
        <span>ORACLE</span>
        <p>Analyse en cours...</p>
    `;

    chatMessages.appendChild(loading);

    chatMessages.scrollTop =
        chatMessages.scrollHeight;
}

function removeLoading() {

    const loading =
        document.getElementById("oracleLoading");

    if (loading) {
        loading.remove();
    }
}

chatForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const message = chatInput.value.trim();

    if (!message) return;

    addMessage("user", message);

    chatInput.value = "";

    setLoading();

    try {

        const response = await fetch("/api/ai", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message
            })

        });

        const data = await response.json();

        removeLoading();

        if (!response.ok) {
            throw new Error(
                data.error || "Erreur serveur"
            );
        }

        addMessage(
            "oracle",
            data.reply
        );

    } catch (error) {

        removeLoading();

        addMessage(
            "oracle",
            "Connexion à l'Oracle impossible. Vérifiez le serveur."
        );

        console.error(error);
    }

});
