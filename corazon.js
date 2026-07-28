const CONFIG = {
    nombre: "Rocio",
    carpeta: "fotos",
    extension: "jpeg",
    totalFotos: 12,
    musica: "musica.mp3"
};

const heartContainer = document.getElementById("heartContainer");
const mensaje = document.getElementById("mensaje");
const volver = document.getElementById("volver");

volver.addEventListener("click", () => {
    window.location.href = "index.html";
});

const audio = new Audio(CONFIG.musica);
audio.loop = true;

mensaje.innerHTML = `&hearts;<br>${CONFIG.nombre}<br>&hearts;`;

const fotos = [];
for (let i = 1; i <= CONFIG.totalFotos; i++) {
    fotos.push(`${CONFIG.carpeta}/imagen${i}.${CONFIG.extension}`);
}

let imagenes = [];
let puntos = [];
let centroX = 0;
let centroY = 0;
let photoSize = 0;
let animationDelay = 140;
let totalSlots = 24;

function getViewportSize() {
    const minSide = Math.min(window.innerWidth, window.innerHeight);
    return Math.max(260, Math.min(minSide * 0.88, 720));
}

function updateLayoutMetrics() {
    const size = getViewportSize();
    heartContainer.style.width = `${size}px`;
    heartContainer.style.height = `${size}px`;

    centroX = size / 2;
    centroY = size / 2;
    photoSize = Math.max(44, Math.min(size * 0.14, 92));
    animationDelay = size < 420 ? 110 : 140;
    totalSlots = size < 420 ? 18 : size < 560 ? 22 : 26;

    document.documentElement.style.setProperty("--heart-size", `${size}px`);
    document.documentElement.style.setProperty("--photo-size", `${photoSize}px`);
    document.documentElement.style.setProperty("--photo-border", `${Math.max(3, Math.round(photoSize * 0.06))}px`);
}

function generarPuntos() {
    puntos = [];
    const escala = heartContainer.clientWidth / 38;

    for (let i = 0; i < totalSlots; i++) {
        const t = (i / totalSlots) * Math.PI * 2;
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(
            13 * Math.cos(t) -
            5 * Math.cos(2 * t) -
            2 * Math.cos(3 * t) -
            Math.cos(4 * t)
        );

        puntos.push({
            x: x * escala,
            y: y * escala
        });
    }
}

function crearFoto(src, index) {
    const img = document.createElement("img");
    const angulo = Math.random() * 24 - 12;

    img.src = src;
    img.className = "foto";
    img.alt = `Foto ${index + 1} de ${CONFIG.nombre}`;
    img.dataset.angulo = angulo.toFixed(2);
    img.style.left = `${centroX}px`;
    img.style.top = `${centroY}px`;
    img.style.opacity = "0";
    img.style.transform = "translate(-50%, -50%) rotate(0deg) scale(0.7)";

    heartContainer.appendChild(img);
    return img;
}

function crearFotos() {
    heartContainer.innerHTML = "";
    imagenes = [];

    for (let i = 0; i < totalSlots; i++) {
        imagenes.push(crearFoto(fotos[i % fotos.length], i % fotos.length));
    }
}

function obtenerPosicion(indice) {
    const punto = puntos[indice % puntos.length];
    return {
        x: centroX + punto.x,
        y: centroY + punto.y
    };
}

function animarCorazon() {
    heartContainer.classList.remove("latir");
    mensaje.style.opacity = "0";

    imagenes.forEach((img, index) => {
        const destino = obtenerPosicion(index);
        const angulo = img.dataset.angulo;

        img.style.left = `${centroX}px`;
        img.style.top = `${centroY}px`;
        img.style.opacity = "0";
        img.style.transform = "translate(-50%, -50%) rotate(0deg) scale(0.7)";

        setTimeout(() => {
            img.style.opacity = "1";
            img.style.left = `${destino.x}px`;
            img.style.top = `${destino.y}px`;
            img.style.transform = `translate(-50%, -50%) rotate(${angulo}deg) scale(1)`;
        }, index * animationDelay);
    });

    const tiempoTotal = imagenes.length * animationDelay + 700;
    setTimeout(() => {
        heartContainer.classList.add("latir");
        mensaje.style.opacity = "1";
        audio.play().catch(() => {});
    }, tiempoTotal);
}

function renderCorazon() {
    updateLayoutMetrics();
    generarPuntos();
    crearFotos();
    animarCorazon();
}

let resizeTimer;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(renderCorazon, 180);
});

renderCorazon();
