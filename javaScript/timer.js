const estado = document.getElementById("estado");
const tiempo = document.getElementById("tiempo");
const tick = document.getElementById("tick");
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
//let estadoActual = "";

function playBeep () {
    if (!beep.paused) return; // evita que se reinicie el audio
    beep.currentTime = 0;
    beep.play();
}

function playTick() {
    if (!tick.paused) return;
    tick.currentTime = 0;
    tick.play();
}

function formatoTiempo(s) {
    const m = Math.floor(s/60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

function iniciarCuenta(nombre, duracion, restante) {
    clearInterval(timer);

    //estadoActual = nombre;
    descansoActual = restante;
    pausado = false;
    enCuentaFinal = false;
    estado.textContent = nombre;
    background(nombre);
    animarEstados();
    segundos =duracion;
    tiempo.textContent = formatoTiempo(segundos);

    tipoEstado = (nombre == "PREPÁRATE") ? "PREP" : "NORMAL";

    if (tipoEstado === "PREP" && segundos > 0) {
            playBeep();
    } else if (tipoEstado === "NORMAL") {
            playTick();
    }

    timer = setInterval(cuentaRegresiva, 1000);
}

function cuentaRegresiva() {
    if (pausado) {
        tick.pause(); //pausa el sonido si esta sonando
        return;
    }

    tiempo.textContent = formatoTiempo(segundos);

    if (tipoEstado === "PREP" && segundos > 0) {
        if (beep.paused) {
            playBeep();
        }
    }

    if (segundos <= 3 && segundos > 0 && !enCuentaFinal) {
        enCuentaFinal = true;
        playBeep();
        tick.pause();
    } 
    
    if (segundos > 3 && tipoEstado === "NORMAL") {
        if (tick.paused) {
            tick.loop = true; // hace que el sonido suene continuo
            tick.play();
        }
    }

    segundos--;


    if (segundos < 0) {
        clearInterval(timer);
        tick.pause() ; //detiene el sonido al finalizar
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
    pausaBtn.textContent = "⏸️ PAUSAR";

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
    pausaBtn.textContent = pausado ? "▶️ REANUDAR" : "⏸️ PAUSAR";

    if (pausado) {
        tick.pause(); //pausa el sonido si esta sonando
        beep.pause();
    } else {
        if(tipoEstado === "NORMAL" && segundos > 3) tick.play();
        else if (tipoEstado === "PREP" && segundos > 0) beep.play();
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

    pausaBtn.textContent = "⏸️ PAUSAR";

    [tick, beep].forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
});