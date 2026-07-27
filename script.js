// ======================================
// CANVAS
// ======================================

const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener("resize", () => {
    resizeCanvas();
    iniciarLluvia();
});

// ======================================
// MENSAJES QUE IRÁN CAMBIANDO
// ======================================

const mensajes = [

    "Querida ❤️",

    "Bonita 💖",

    "Princesa 👑",

    "Niña Bonita 💞",

    "Dulce Sonrisa ❤️",

    "Ojos hermosos 💕",

    "Corazón De luz ❤️",

    "Hermosa 🌹",

    "Te quiero 💗"

];

// mensaje actual

let indiceMensaje = 0;

// cambia cada 8 segundos

setInterval(() => {

    indiceMensaje++;

    if (indiceMensaje >= mensajes.length) {

        indiceMensaje = 0;

    }

}, 8000);

// ======================================
// CONFIGURACIÓN MATRIX
// ======================================

const fontSize = 20;

let columnas;

let drops;

// ======================================

function iniciarLluvia(){

    columnas = Math.floor(canvas.width / (fontSize * 4));

    drops = [];

    for(let i=0;i<columnas;i++){

        drops.push(Math.random()*-100);

    }

}

iniciarLluvia();

// ======================================
// DIBUJAR LLUVIA
// ======================================

function dibujarMatrix(){

    ctx.fillStyle = "rgba(0,0,0,.08)";

    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = "#ff66b2";

    ctx.font = "bold 20px Arial";

    ctx.textAlign = "center";

    for(let i=0;i<columnas;i++){

        const x = i * fontSize * 4 + fontSize;

        const y = drops[i] * fontSize;

        ctx.fillText(

            mensajes[indiceMensaje],

            x,

            y

        );

        if(y > canvas.height + Math.random()*600){

            drops[i] = Math.random()*-40;

        }

        drops[i] += 0.8;

    }

    requestAnimationFrame(dibujarMatrix);

}

dibujarMatrix();

// ======================================
// ESTRELLAS
// ======================================

for(let i=0;i<140;i++){

    crearEstrella();

}

function crearEstrella(){

    const estrella = document.createElement("div");

    estrella.className="star";

    estrella.style.left=Math.random()*100+"vw";

    estrella.style.top=Math.random()*100+"vh";

    const size=Math.random()*3+1;

    estrella.style.width=size+"px";

    estrella.style.height=size+"px";

    estrella.style.animationDuration=

    (2+Math.random()*5)+"s";

    document.body.appendChild(estrella);

}
// ======================================
// MÚSICA
// ======================================

const music = document.getElementById("music");
const playButton = document.getElementById("playButton");
const hint = document.getElementById("hint");

let reproduciendo = false;

// ======================================
// EXPLOSIÓN DE CORAZONES
// ======================================

function explosionCorazones() {

    for (let i = 0; i < 200; i++) {

        const heart = document.createElement("div");

        heart.className = "heart";

        heart.innerHTML = Math.random() > .5 ? "❤️" : "💕";

        const x = window.innerWidth / 2;
        const y = window.innerHeight / 2;

        heart.style.left = x + "px";
        heart.style.top = y + "px";

        const angulo = Math.random() * Math.PI * 2;
        const distancia = 100 + Math.random() * 350;

        const dx = Math.cos(angulo) * distancia;
        const dy = Math.sin(angulo) * distancia;

        heart.style.transition =
            (2 + Math.random()) + "s ease-out";

        document.body.appendChild(heart);

        requestAnimationFrame(() => {

            heart.style.transform =
                `translate(${dx}px,${dy}px)
                 scale(${0.5 + Math.random()})`;

            heart.style.opacity = "0";

        });

        setTimeout(() => {

            heart.remove();

        }, 3000);

    }

}

// ======================================
// CORAZONES FLOTANTES
// ======================================

function crearCorazon() {

    const heart = document.createElement("div");

    heart.className = "heart";

    const emojis = [

        "❤️",
        "💕",
        "💖",
        "💗",
        "💓"

    ];

    heart.innerHTML =
        emojis[Math.floor(Math.random()*emojis.length)];

    heart.style.left =
        Math.random()*100 + "vw";

    heart.style.bottom = "-20px";

    heart.style.fontSize =
        (16 + Math.random()*20) + "px";

    heart.style.animationDuration =
        (4 + Math.random()*4) + "s";

    document.body.appendChild(heart);

    setTimeout(() => {

        heart.remove();

    }, 8000);

}

// ======================================
// BOTÓN CENTRAL
// ======================================

playButton.addEventListener("click", async () => {

    try {

        if (!reproduciendo) {

            await music.play();

            reproduciendo = true;

            hint.style.display = "none";

            explosionCorazones();

            playButton.innerHTML = "💖 Rocio 💖";

            playButton.style.color = "#ff1493";

            setInterval(() => {

                if (reproduciendo) {

                    crearCorazon();

                }

            }, 250);

        } else {

            if (music.paused) {

                music.play();

            } else {

                music.pause();

            }

        }

    } catch (e) {

        console.log(e);

    }

});
// ======================================
// PÉTALOS DE ROSA
// ======================================

function crearPetalo(){

    const petalo = document.createElement("div");

    petalo.className = "petal";

    const petalos = [
        "🌸",
        "🌹",
        "💮",
        "🌺"
    ];

    petalo.innerHTML =
        petalos[Math.floor(Math.random()*petalos.length)];

    petalo.style.left =
        Math.random()*100 + "vw";

    petalo.style.top = "-50px";

    petalo.style.fontSize =
        (18 + Math.random()*20) + "px";

    petalo.style.animationDuration =
        (8 + Math.random()*8) + "s";

    document.body.appendChild(petalo);

    setTimeout(() => {

        petalo.remove();

    },16000);

}

setInterval(()=>{

    crearPetalo();

},600);

// ======================================
// PARTÍCULAS CERCA DEL TEXTO
// ======================================

function crearParticula(){

    const boton =
        document.getElementById("playButton");

    const r =
        boton.getBoundingClientRect();

    const p =
        document.createElement("div");

    p.className="heart";

    const iconos=[

        "✨",
        "⭐",
        "💖",
        "💕"

    ];

    p.innerHTML=
        iconos[Math.floor(Math.random()*iconos.length)];

    p.style.left=
        (r.left + Math.random()*r.width)+"px";

    p.style.top=
        (r.top + Math.random()*r.height)+"px";

    p.style.fontSize=
        (10+Math.random()*15)+"px";

    p.style.animationDuration=
        (2+Math.random()*2)+"s";

    document.body.appendChild(p);

    setTimeout(()=>{

        p.remove();

    },4000);

}

setInterval(()=>{

    crearParticula();

},250);

// ======================================
// CAMBIO SUAVE DE COLOR
// ======================================

const colores=[

"#ff69b4",
"#ff1493",
"#ff4fa5",
"#ff85c2",
"#ff5cb8"

];

setInterval(()=>{

    playButton.style.color=

        colores[
            Math.floor(Math.random()*colores.length)
        ];

},3000);

// ======================================
// DESTELLO CUANDO CAMBIA EL MENSAJE
// ======================================

let mensajeAnterior = indiceMensaje;

function revisarCambioMensaje(){

    if(mensajeAnterior!==indiceMensaje){

        mensajeAnterior=indiceMensaje;

        playButton.animate(

            [

                {
                    transform:"scale(1)"
                },

                {
                    transform:"scale(1.25)"
                },

                {
                    transform:"scale(1)"
                }

            ],

            {

                duration:700

            }

        );

    }

    requestAnimationFrame(

        revisarCambioMensaje

    );

}

revisarCambioMensaje();
// ======================================
// MENSAJE ESCRITO LETRA POR LETRA
// ======================================

const mensajeRomantico =
"Gracias por llegar a mi vida. ❤️ Eres el mejor poema, la mejor melodia que nunca se escribio y espero que esta pequeña sorpresa te saque una sonrisa.";

const mensajeDiv = document.createElement("div");

mensajeDiv.id = "mensajeFinal";

mensajeDiv.style.position = "absolute";
mensajeDiv.style.bottom = "70px";
mensajeDiv.style.left = "50%";
mensajeDiv.style.transform = "translateX(-50%)";
mensajeDiv.style.color = "white";
mensajeDiv.style.fontSize = "22px";
mensajeDiv.style.textAlign = "center";
mensajeDiv.style.maxWidth = "900px";
mensajeDiv.style.width = "90%";
mensajeDiv.style.lineHeight = "1.6";
mensajeDiv.style.zIndex = "20";

document.body.appendChild(mensajeDiv);

let escribiendo = false;

function escribirMensaje(){

    if(escribiendo) return;

    escribiendo = true;

    let i = 0;

    function escribir(){

        if(i < mensajeRomantico.length){

            mensajeDiv.innerHTML += mensajeRomantico.charAt(i);

            i++;

            setTimeout(escribir,45);

        }

    }

    escribir();

}

// ======================================
// FUEGOS ARTIFICIALES DE CORAZONES
// ======================================

function fuegosArtificiales(){

    for(let j=0;j<4;j++){

        setTimeout(()=>{

            explosionCorazones();

        },j*900);

    }

}

// ======================================
// SE EJECUTA CUANDO INICIA LA MÚSICA
// ======================================

music.addEventListener("play",()=>{

    escribirMensaje();

    fuegosArtificiales();

});

// ======================================
// EFECTO DEL MOUSE
// ======================================

document.addEventListener("mousemove",(e)=>{

    if(Math.random()>.55){

        const h=document.createElement("div");

        h.className="heart";

        h.innerHTML="💖";

        h.style.left=e.clientX+"px";

        h.style.top=e.clientY+"px";

        h.style.fontSize=(12+Math.random()*12)+"px";

        h.style.animationDuration="2s";

        document.body.appendChild(h);

        setTimeout(()=>{

            h.remove();

        },2000);

    }

});

// ======================================
// MENSAJES EN EL TÍTULO
// ======================================

const titulos=[

"❤️ Rocio ❤️",

"💕 Linda 💕",

"💖 Siempre Tú 💖",

"🌹 Princesa 🌹",

"❤️ SOLO TU ❤️"

];

let titulo=0;

setInterval(()=>{

titulo++;

if(titulo>=titulos.length){

titulo=0;

}

document.title=titulos[titulo];

},2500);

// ======================================
// CAMBIO AUTOMÁTICO DEL TEXTO CENTRAL
// ======================================

const centro=[

"❤️ Rocio ❤️",

"💕 Linda 💕",

"💖 PRINCESA 💖",

"🌹 NIÑA HERMOSA 🌹",

"👑 HERMOSA SONRISA 👑",

"💞 ABRAZOS 💞"

];

let centroActual=0;

setInterval(()=>{

centroActual++;

if(centroActual>=centro.length){

centroActual=0;

}

playButton.innerHTML=centro[centroActual];

},12000);

// ======================================
// FONDO CON PEQUEÑO BRILLO
// ======================================

let brillo=0;

setInterval(()=>{

brillo++;

canvas.style.filter=
`brightness(${1+Math.sin(brillo/15)*0.15})`;

},40);

// ======================================
// FINAL
// ======================================

console.log("❤️ Cargando para ti ❤️");