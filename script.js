const btnLluvia = document.getElementById("btnLluvia");
const btnFotos = document.getElementById("btnFotos");
const btnCartas = document.getElementById("btnCartas");
const volver = document.getElementById("volver");

if (btnLluvia) {
    btnLluvia.onclick = () => {
        location.href = "lluvia.html";
    };
}

if (btnFotos) {
    btnFotos.onclick = () => {
        location.href = "corazon.html";
    };
}

if (btnCartas) {
    btnCartas.onclick = () => {
        location.href = "cartas.html";
    };
}

if (volver) {
    volver.onclick = () => {
        location.href = "index.html";
    };
}
