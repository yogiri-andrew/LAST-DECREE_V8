window.addEventListener("load", () => {
    console.log("LAST DECREE V8 OK");

    const boot = document.getElementById("bootScreen");

    if (boot) {
        setTimeout(() => {
            boot.style.display = "none";
        }, 1000);
    }
});
