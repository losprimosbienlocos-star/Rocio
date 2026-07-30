const lettersList = document.getElementById("lettersList");
const lettersStatus = document.getElementById("lettersStatus");
const letterMeta = document.getElementById("letterMeta");
const letterTitle = document.getElementById("letterTitle");
const letterContent = document.getElementById("letterContent");
const btnReplay = document.getElementById("btnReplay");

let cartas = [];
let cartaActiva = null;
let typingTimer = null;

function formatDate(isoDate) {
    if (!isoDate) {
        return "Carta";
    }

    return new Date(isoDate).toLocaleDateString("es-GT", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function escribirContenido(texto) {
    clearTimeout(typingTimer);
    letterContent.textContent = "";
    letterContent.classList.add("is-typing");

    let index = 0;
    const velocidad = 24;

    function tick() {
        letterContent.textContent = texto.slice(0, index);
        index += 1;

        if (index <= texto.length) {
            typingTimer = setTimeout(tick, velocidad);
            return;
        }

        letterContent.classList.remove("is-typing");
    }

    tick();
}

function openLetter(carta) {
    cartaActiva = carta;
    btnReplay.disabled = false;

    document.querySelectorAll(".letter-card").forEach((card) => {
        card.classList.toggle("is-active", card.dataset.id === carta.id);
    });

    letterMeta.textContent = formatDate(carta.fecha);
    letterTitle.textContent = carta.titulo;
    escribirContenido(carta.contenido || "");
}

function createLetterButton(carta) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "letter-card";
    button.dataset.id = carta.id;
    button.innerHTML = `
        <small>${formatDate(carta.fecha)}</small>
        <strong>${carta.titulo}</strong>
        <span>${carta.resumen || "Abrir carta"}</span>
    `;

    button.addEventListener("click", () => {
        openLetter(carta);
    });

    return button;
}

async function loadLetters() {
    lettersStatus.textContent = "Cargando cartas...";

    try {
        const response = await fetch("/api/public-cartas");
        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(payload.error || "No pude cargar las cartas");
        }

        cartas = Array.isArray(payload.cartas) ? payload.cartas : [];
    } catch (error) {
        lettersStatus.textContent = "No pude cargar las cartas";
        letterMeta.textContent = "Error";
        letterTitle.textContent = "No pude leer las cartas públicas";
        letterContent.textContent = error.message;
        return;
    }

    lettersList.innerHTML = "";

    cartas.forEach((carta) => {
        lettersList.appendChild(createLetterButton(carta));
    });

    lettersStatus.textContent = `${cartas.length} carta(s) disponibles`;

    if (cartas.length > 0) {
        openLetter(cartas[0]);
        return;
    }

    letterMeta.textContent = "Sin cartas";
    letterTitle.textContent = "Todavia no hay cartas publicadas";
    letterContent.textContent = "Guarda una carta en el panel privado y marca publicada para verla aqui.";
    btnReplay.disabled = true;
}

btnReplay.addEventListener("click", () => {
    if (cartaActiva) {
        openLetter(cartaActiva);
    }
});

loadLetters();
