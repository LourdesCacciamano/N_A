const estado = document.getElementById("estado");
const tiempo = document.getElementById("tiempo");
const beep = document.getElementById("beep");
const pausaBtn = document.getElementById("pausar");
const restablecer = document.getElementById("restablecer");

let timer = null;
let segundos = 0;
let rondaActual;
let cicloActual;
let pausado = false;
let totalRondas = 0;
let totalCiclos = 0;
let tiempos = {};
let descansoActual = null;
let tipoEstado = "";
let enCuentaFinal = false;

function playBeep () {
    if (!beep.paused) return; // evita que se reinicie el audio
    beep.play();
}

function formatoTiempo(s) {
    const m = Math.floor(s/60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

function iniciarCuenta(nombre, duracion, restante) {
    clearInterval(timer);

    descansoActual = restante;
    pausado = false;
    enCuentaFinal = false;
    estado.textContent = nombre;
    background(nombre);
    animarEstados();
    segundos = duracion;
    tiempo.textContent = formatoTiempo(segundos);

    tipoEstado = (nombre == "PREPÁRATE") ? "PREP" : "NORMAL";

    if (tipoEstado === "PREP" && segundos > 0) {
            beep.currentTime = 0;
            playBeep();
    } 
    
    timer = setInterval(cuentaRegresiva, 1000);
}

function cuentaRegresiva() {
    if (pausado) {
        beep.pause(); //pausa el sonido si esta sonando
        return;
    }

    tiempo.textContent = formatoTiempo(segundos);

    

    if (segundos <= 3 && segundos > 0 && !enCuentaFinal) {
        enCuentaFinal = true;
        beep.currentTime = 0;
        playBeep();
    } 

    segundos--;

    if (segundos < 0) {
        clearInterval(timer);
        descansoActual && descansoActual();
    }
}

function iniciarRonda() {
    iniciarCuenta(
        `ENTRENAR: Ronda ${rondaActual}/${totalRondas}`,
        tiempos.entrenar,
        iniciarDescansoRonda
    );
}

function iniciarDescansoRonda() {
    iniciarCuenta(
        "DESCANSAR",
        tiempos.descansar,
        () => {
            if (rondaActual < totalRondas) {
                rondaActual++;
                iniciarRonda();
            } else {
                if (cicloActual < totalCiclos) {
                    iniciarDescansoCiclo();
                } else{
                    estado.innerHTML = `ENTRENAMIENTO COMPLETADO <i class="fa-regular fa-circle-check entrComp" style="color: #000000;"></i`;
                    background("ENTRENAMIENTO COMPLETADO")
                }
            }
        }
    );
}

function iniciarDescansoCiclo() {
    if (!tiempos.descansarCiclo || tiempos.descansarCiclo <= 0){
        cicloActual++;
        rondaActual = 1;
        iniciarRonda();
        return;
    }

    iniciarCuenta(
        `DESCANSO ENTRE CICLOS: ${cicloActual}/${totalCiclos}`,
        tiempos.descansarCiclo,
        () => {
            cicloActual++;
            rondaActual = 1;
            iniciarRonda();
        }
    );
}

function desbloquearAudio() {
    beep.play().then(() => {
        beep.pause();
        beep.currentTime = 0;
    }). catch(() => {});
}

function animarEstados () {
    estado.classList.remove("animate__animated" , "animate__fadeInRight");
    void estado.offsetWidth;
    estado.classList.add("animate__animated", "animate__fadeInRight");
}

function background(nombre){
    estado.classList.remove(
        "estatado-prep-desc",
        "estado-entre-compl"
    );
    if (nombre === "PREPÁRATE" || nombre.startsWith("DESCANSAR")){
        estado.classList.add("estado-prep-des");
    } else if(nombre.startsWith("ENTRENAR") || nombre.startsWith("ENTRENAMIENTO COMPLETADO")){
        estado.classList.add("estado-entre-compl");
    } 
}

document.getElementById("empezar").addEventListener("click", () => {
    beep.play().then(() => {beep.pause(); beep.currentTime = 0;}).catch(() => {});
    pausaBtn.innerHTML = `<i class="fa-solid fa-pause" style="color: #f3f3f1;"></i> PAUSAR`;

    tiempos = {
        preparate: 3, //fijo
        entrenar: +document.getElementById("entrenar").value || 0,
        descansar: +document.getElementById("descansar").value || 0,
        descansarCiclo: +document.getElementById("descansarCiclo").value || 0
    };

    totalRondas = +document.getElementById("rondas").value;
    totalCiclos = +document.getElementById("ciclos").value;

    rondaActual = 1;
    cicloActual = 1;

   iniciarCuenta("PREPÁRATE", tiempos.preparate, iniciarRonda);
});

pausaBtn.addEventListener("click", () => {
    if (!timer) return;

    pausado = !pausado;
    pausaBtn.innerHTML = pausado ? ` <i class="fa-solid fa-play" style="color: #ffffff;"></i>  REANUDAR` : `<i class="fa-solid fa-pause" style="color: #f3f3f1;"></i> PAUSAR`;

    if (pausado) {
        beep.pause();
    } else {
        if (enCuentaFinal && segundos > 0){
            playBeep();
        } else if (tipoEstado === "PREP" && segundos > 0) {
            playBeep();
        }
    }
});

restablecer.addEventListener("click", () => {
    clearInterval(timer);
    timer = null;
    pausado = false;

    segundos = 0;
    rondaActual = 1;
    cicloActual = 1;

    estado.textContent = "PREPÁRATE";
    tiempo.textContent = "00:00";

    pausaBtn.innerHTML = `<i class="fa-solid fa-pause" style="color: #f3f3f1;"></i> PAUSAR`;

    [beep].forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
});

/*para que el navegador en mobile no me bloquee el sonido */
document.addEventListener("touchstart", desbloquearAudio, { once: true });
document.addEventListener("click", desbloquearAudio, { once: true });