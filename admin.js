const authGate = document.getElementById("authGate");
const adminApp = document.getElementById("adminApp");
const pinInput = document.getElementById("pinInput");
const btnUnlock = document.getElementById("btnUnlock");
const btnLock = document.getElementById("btnLock");
const btnGoLetters = document.getElementById("btnGoLetters");
const authMessage = document.getElementById("authMessage");
const adminStatus = document.getElementById("adminStatus");
const adminLettersList = document.getElementById("adminLettersList");
const editorHeading = document.getElementById("editorHeading");
const tituloInput = document.getElementById("tituloInput");
const slugInput = document.getElementById("slugInput");
const fechaInput = document.getElementById("fechaInput");
const resumenInput = document.getElementById("resumenInput");
const ordenInput = document.getElementById("ordenInput");
const publicadaInput = document.getElementById("publicadaInput");
const contenidoInput = document.getElementById("contenidoInput");
const btnPreview = document.getElementById("btnPreview");
const btnSaveProject = document.getElementById("btnSaveProject");
const btnDeleteLetter = document.getElementById("btnDeleteLetter");
const btnNewLetter = document.getElementById("btnNewLetter");
const previewMeta = document.getElementById("previewMeta");
const previewTitle = document.getElementById("previewTitle");
const previewContent = document.getElementById("previewContent");
const jsonPreview = document.getElementById("jsonPreview");
const runtimeNote = document.getElementById("runtimeNote");
const saveMessage = document.getElementById("saveMessage");

const SESSION_KEY = "rocio-admin-pin";

let cartas = [];
let cartaSeleccionada = null;
let adminPin = sessionStorage.getItem(SESSION_KEY) || "";

function slugify(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function formatDate(isoDate) {
    if (!isoDate) {
        return "Sin fecha";
    }

    return new Date(isoDate).toLocaleDateString("es-GT", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function isoFromInput(value) {
    if (!value) {
        return new Date().toISOString();
    }

    return new Date(`${value}T12:00:00`).toISOString();
}

function updateSaveMessage(texto, isError = false) {
    saveMessage.textContent = texto;
    saveMessage.style.color = isError ? "#ffb3c7" : "rgba(255,255,255,0.78)";
}

function buildRecord() {
    const titulo = tituloInput.value.trim() || "Carta sin titulo";
    const slug = slugInput.value.trim() || slugify(titulo);

    return {
        id: cartaSeleccionada?.id,
        titulo,
        slug,
        fecha: isoFromInput(fechaInput.value),
        resumen: resumenInput.value.trim() || "",
        contenido: contenidoInput.value.trim(),
        orden: Number(ordenInput.value || 0),
        publicada: publicadaInput.checked
    };
}

function renderPreview() {
    const carta = buildRecord();
    previewMeta.textContent = `${formatDate(carta.fecha)} · ${carta.publicada ? "Publicada" : "Borrador"}`;
    previewTitle.textContent = carta.titulo;
    previewContent.textContent = carta.contenido || "Escribe aquí el texto completo de la carta para ver cómo se leerá.";
    jsonPreview.textContent = JSON.stringify(carta, null, 2);
}

function fillForm(carta) {
    cartaSeleccionada = carta;
    editorHeading.textContent = carta ? `Editando: ${carta.titulo}` : "Nueva carta";

    tituloInput.value = carta?.titulo || "";
    slugInput.value = carta?.slug || "";
    fechaInput.value = carta?.fecha ? new Date(carta.fecha).toISOString().slice(0, 10) : "";
    resumenInput.value = carta?.resumen || "";
    ordenInput.value = carta?.orden ?? 0;
    publicadaInput.checked = Boolean(carta?.publicada);
    contenidoInput.value = carta?.contenido || "";

    document.querySelectorAll(".admin-letter-item").forEach((item) => {
        item.classList.toggle("is-active", item.dataset.id === carta?.id);
    });

    btnDeleteLetter.disabled = !carta;
    renderPreview();
}

function renderLettersList() {
    adminLettersList.innerHTML = "";

    cartas.forEach((carta) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "admin-letter-item";
        button.dataset.id = carta.id;
        button.innerHTML = `
            <small>${formatDate(carta.fecha)}</small>
            <strong>${carta.titulo}</strong>
            <span>${carta.resumen || "Sin resumen"}</span>
        `;

        button.addEventListener("click", () => {
            fillForm(carta);
        });

        adminLettersList.appendChild(button);
    });
}

async function apiRequest(action, payload = {}) {
    const response = await fetch("/api/admin-cartas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            pin: adminPin,
            action,
            ...payload
        })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data.error || "No pude completar la operación");
    }

    return data;
}

async function loadLetters() {
    adminStatus.textContent = "Cargando cartas...";

    try {
        const data = await apiRequest("list");
        cartas = Array.isArray(data.cartas) ? data.cartas : [];
        adminStatus.textContent = `${cartas.length} carta(s) cargadas`;
        runtimeNote.textContent = "Conexión activa con Supabase mediante API privada.";
        renderLettersList();
        fillForm(null);
    } catch (error) {
        adminStatus.textContent = "No pude leer las cartas";
        runtimeNote.textContent = "Revisa las variables de entorno y el PIN configurado en Vercel.";
        updateSaveMessage(error.message, true);
    }
}

async function saveLetter() {
    const carta = buildRecord();

    if (!carta.titulo || !carta.slug || !carta.contenido) {
        updateSaveMessage("Título, slug y contenido son obligatorios.", true);
        return;
    }

    btnSaveProject.disabled = true;
    updateSaveMessage("Guardando carta...");

    try {
        const data = await apiRequest("save", { carta });
        const saved = data.carta;

        if (cartaSeleccionada?.id) {
            cartas = cartas.map((item) => item.id === saved.id ? saved : item);
        } else {
            cartas.unshift(saved);
        }

        cartas.sort((a, b) => {
            if ((a.orden ?? 0) !== (b.orden ?? 0)) {
                return (a.orden ?? 0) - (b.orden ?? 0);
            }
            return new Date(b.fecha) - new Date(a.fecha);
        });

        renderLettersList();
        fillForm(saved);
        adminStatus.textContent = `${cartas.length} carta(s) cargadas`;
        updateSaveMessage("Carta guardada correctamente.");
    } catch (error) {
        updateSaveMessage(error.message, true);
    } finally {
        btnSaveProject.disabled = false;
    }
}

async function deleteLetter() {
    if (!cartaSeleccionada) {
        return;
    }

    if (!confirm(`¿Eliminar "${cartaSeleccionada.titulo}"?`)) {
        return;
    }

    try {
        await apiRequest("delete", { id: cartaSeleccionada.id });
        cartas = cartas.filter((item) => item.id !== cartaSeleccionada.id);
        renderLettersList();
        fillForm(null);
        adminStatus.textContent = `${cartas.length} carta(s) cargadas`;
        updateSaveMessage("Carta eliminada.");
    } catch (error) {
        updateSaveMessage(error.message, true);
    }
}

function unlock() {
    authGate.classList.add("is-hidden");
    adminApp.classList.remove("is-hidden");
}

function lock() {
    sessionStorage.removeItem(SESSION_KEY);
    adminPin = "";
    authGate.classList.remove("is-hidden");
    adminApp.classList.add("is-hidden");
    authMessage.textContent = "Panel cerrado.";
    pinInput.value = "";
}

btnUnlock.addEventListener("click", async () => {
    adminPin = pinInput.value.trim();
    authMessage.textContent = "Verificando PIN...";

    try {
        await apiRequest("list");
        sessionStorage.setItem(SESSION_KEY, adminPin);
        authMessage.textContent = "PIN correcto.";
        unlock();
        await loadLetters();
    } catch (error) {
        authMessage.textContent = error.message;
    }
});

pinInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        btnUnlock.click();
    }
});

btnLock.addEventListener("click", lock);
btnGoLetters.addEventListener("click", () => {
    location.href = "cartas.html";
});

tituloInput.addEventListener("input", () => {
    if (!slugInput.value || !cartaSeleccionada) {
        slugInput.value = slugify(tituloInput.value);
    }
    renderPreview();
});

[slugInput, fechaInput, resumenInput, ordenInput, contenidoInput, publicadaInput].forEach((input) => {
    input.addEventListener("input", renderPreview);
    input.addEventListener("change", renderPreview);
});

btnPreview.addEventListener("click", renderPreview);
btnSaveProject.addEventListener("click", saveLetter);
btnDeleteLetter.addEventListener("click", deleteLetter);
btnNewLetter.addEventListener("click", () => {
    fillForm(null);
    updateSaveMessage("Lista para una nueva carta.");
});

if (adminPin) {
    unlock();
    loadLetters();
} else {
    lock();
}
