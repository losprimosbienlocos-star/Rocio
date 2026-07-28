//====================================================
// CORAZÓN DE FOTOS
// PARTE 1
//====================================================

//===============================
// CONFIGURACIÓN
//===============================

const CONFIG = {

    nombre: "Rocío",

    carpeta: "fotos",

    extension: "jpeg",

    totalFotos: 12,

    musica: "musica.mp3"

};

//===============================
// REFERENCIAS HTML
//===============================

const heartContainer = document.getElementById("heartContainer");

const mensaje = document.getElementById("mensaje");

const volver = document.getElementById("volver");

//===============================
// BOTÓN VOLVER
//===============================

volver.addEventListener("click",()=>{

    window.location.href="index.html";

});

//===============================
// AUDIO
//===============================

const audio = new Audio(CONFIG.musica);

audio.loop=true;

//===============================
// MENSAJE
//===============================

mensaje.innerHTML=`

❤️

<br>

${CONFIG.nombre}

<br>

❤️

`;

//===============================
// CARGAR FOTOS
//===============================

const fotos=[];

for(let i=1;i<=CONFIG.totalFotos;i++){

    fotos.push(

        `${CONFIG.carpeta}/imagen${i}.${CONFIG.extension}`

    );

}

console.table(fotos);

//===============================
// MATRIZ DE FOTOS
//===============================

const imagenes=[];

//===============================
// CENTRO DEL CORAZÓN
//===============================

const CENTRO_X=350;

const CENTRO_Y=300;

//===============================
// ESCALA
//===============================

const ESCALA=18;

//===============================
// PUNTOS
//===============================

const puntos=[];

//===============================
// GENERAR CONTORNO
//===============================

function generarCorazon(){

    puntos.length=0;

    for(let t=0;t<Math.PI*2;t+=0.18){

        const x=16*Math.pow(Math.sin(t),3);

        const y=-(13*Math.cos(t)

        -5*Math.cos(2*t)

        -2*Math.cos(3*t)

        -Math.cos(4*t));

        puntos.push({

            x:x*ESCALA,

            y:y*ESCALA

        });

    }

}

generarCorazon();

console.log("Puntos:",puntos.length);

//====================================================
// PARTE 2
// CREAR LAS FOTOGRAFÍAS
//====================================================

//===============================
// CREAR UNA FOTO
//===============================

function crearFoto(src){

    const img = document.createElement("img");

    img.src = src;

    img.className = "foto";

    // Empieza invisible

    img.style.opacity = "0";

    // Empieza en el centro

    img.style.left = CENTRO_X + "px";

    img.style.top = CENTRO_Y + "px";

    // Rotación aleatoria

    const angulo = Math.random()*60-30;

    img.dataset.angulo = angulo;

    img.style.transform = `rotate(${angulo}deg) scale(.2)`;

    heartContainer.appendChild(img);

    return img;

}

//===============================
// CREAR TODAS LAS FOTOS
//===============================

function crearFotos(){

    heartContainer.innerHTML="";

    imagenes.length=0;

    fotos.forEach((foto)=>{

        const img = crearFoto(foto);

        imagenes.push(img);

    });

}

crearFotos();

console.log("Fotos creadas:",imagenes.length);

//===============================
// PREPARAR MENSAJE
//===============================

mensaje.style.opacity="0";

//====================================================
// POSICIONES DEL CORAZÓN
//====================================================

function obtenerPosicion(indice){

    const punto = puntos[indice % puntos.length];

    return {

        x:CENTRO_X+punto.x,

        y:CENTRO_Y+punto.y

    };

}
//====================================================
// VERIFICACIÓN
//====================================================

imagenes.forEach((img,index)=>{

    console.log(

        index,

        obtenerPosicion(index)

    );

});

//====================================================
// PARTE 3
// ANIMACIÓN DE FORMACIÓN DEL CORAZÓN
//====================================================

function animarCorazon(){

    imagenes.forEach((img,index)=>{

        const destino = obtenerPosicion(index);

        // Punto inicial aleatorio
        const inicioX = Math.random()*window.innerWidth;
        const inicioY = Math.random()*window.innerHeight;

        img.style.left = inicioX + "px";
        img.style.top = inicioY + "px";

        img.style.opacity = "0";

        img.style.transform =
        `rotate(${Math.random()*360}deg) scale(.2)`;

        setTimeout(()=>{

            img.style.transition = `
                left 1.4s ease,
                top 1.4s ease,
                transform 1.4s ease,
                opacity .8s ease
            `;

            img.style.opacity = "1";

            img.style.left = destino.x + "px";
            img.style.top = destino.y + "px";

            img.style.transform =
            `rotate(${img.dataset.angulo}deg) scale(1)`;

        },index*180);

    });

}

//====================================================
// LATIDO
//====================================================

function iniciarLatido(){

    heartContainer.classList.add("latir");

}

//====================================================
// MENSAJE
//====================================================

function mostrarMensaje(){

    mensaje.style.opacity="1";

}

//====================================================
// INICIAR TODO
//====================================================

const tiempoAnimacion =
(CONFIG.totalFotos*180)+1800;

animarCorazon();

setTimeout(()=>{

    iniciarLatido();

    mostrarMensaje();

    audio.play().catch(()=>{});

},tiempoAnimacion);

//====================================================
// PARTE 4
// RELLENAR EL CORAZÓN
//====================================================

// Esta función comprueba si un punto pertenece
// al corazón matemático

function dentroDelCorazon(x,y){

    x /= 18;
    y /= 18;

    const ecuacion =
    Math.pow(x*x+y*y-1,3)-x*x*Math.pow(y,3);

    return ecuacion <= 0;

}

//====================================================
// GENERAR MUCHOS PUNTOS
//====================================================

function generarCorazonLleno(){

    puntos.length = 0;

    const espacio = 42;

    for(let y=-260;y<=260;y+=espacio){

        for(let x=-260;x<=260;x+=espacio){

            if(dentroDelCorazon(x,y)){

                puntos.push({

                    x:x,

                    y:y

                });

            }

        }

    }

}

generarCorazonLleno();

console.log("Puntos llenos:",puntos.length);

//====================================================
// REDIBUJAR EL CORAZÓN
//====================================================

function reconstruirCorazon(){

    heartContainer.innerHTML="";

    imagenes.length=0;

    fotos.forEach((foto,index)=>{

        const img=crearFoto(foto);

        imagenes.push(img);

    });

    animarCorazon();

}

reconstruirCorazon();

//====================================================
// PARTE 5
// EFECTOS VISUALES
//====================================================

//===============================
// BRILLO EN LAS FOTOS
//===============================

function activarHover(){

    imagenes.forEach(img=>{

        img.addEventListener("mouseenter",()=>{

            img.style.transition=".4s";

            img.style.transform+=
            " scale(1.15)";

            img.style.boxShadow=

            "0 0 35px hotpink";

        });

        img.addEventListener("mouseleave",()=>{

            img.style.transform=

            `rotate(${img.dataset.angulo}deg) scale(1)`;

            img.style.boxShadow=

            "0 10px 25px rgba(0,0,0,.45)";

        });

    });

}

//===============================
// CORAZONES FLOTANTES
//===============================

function crearCorazon(x,y){

    const h=document.createElement("div");

    h.innerHTML="💖";

    h.className="heartParticle";

    h.style.left=x+"px";

    h.style.top=y+"px";

    h.style.fontSize=

    (18+Math.random()*18)+"px";

    document.body.appendChild(h);

    h.animate(

    [

    {

    transform:"translateY(0px)",

    opacity:1

    },

    {

    transform:

    `translate(

    ${(Math.random()*80)-40}px,

    -140px

    ) scale(1.5)`,

    opacity:0

    }

    ],

    {

    duration:1800

    });

    setTimeout(()=>{

        h.remove();

    },1800);

}

//===============================
// CORAZONES AL PASAR EL MOUSE
//===============================

function activarCorazones(){

    imagenes.forEach(img=>{

        img.addEventListener("mousemove",(e)=>{

            if(Math.random()>.65){

                crearCorazon(

                    e.pageX,

                    e.pageY

                );

            }

        });

    });

}

//===============================
// PÉTALOS
//===============================

function crearPetalo(){

    const p=document.createElement("div");

    p.className="petal";

    const flores=[

        "🌸",

        "🌹",

        "💮",

        "🌺"

    ];

    p.innerHTML=

    flores[

    Math.floor(Math.random()*flores.length)

    ];

    p.style.left=

    Math.random()*100+"vw";

    p.style.top="-50px";

    p.style.fontSize=

    (20+Math.random()*18)+"px";

    p.style.animationDuration=

    (8+Math.random()*8)+"s";

    document.body.appendChild(p);

    setTimeout(()=>{

        p.remove();

    },16000);

}

setInterval(crearPetalo,700);

//===============================
// ACTIVAR EFECTOS
//===============================

setTimeout(()=>{

    activarHover();

    activarCorazones();

},tiempoAnimacion);