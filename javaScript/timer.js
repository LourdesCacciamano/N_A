const estado = document.getElementById("estado");
const tiempo = document.getElementById("tiempo");
const tick = document.getElementById("tick");
const beep = document.getElementById("beep");
const longBeep = document.getElementById("longBeep");
const pausaBtn = document.getElementById("pausar");

let timer = null;
let segundos = 0;
let rondaActual;
let cicloActual;
let pausado = false;
let totalRondas = 0;
let totalCiclos = 0;
let tiempos = {};
let descansoActual = null;

//let estadoActual = "";


function formatoTiempo(s) {
    const m = Math.floor(s/60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

function sonarUltimosSeg(seg) {
    if (seg <= 3 && seg > 0) {
        beep.currentTime = 0;
        beep.play();
    } else{
        tick.currentTime = 0;
        tick.play();
    }
}

function iniciarCuenta(nombre, duracion, restante) {
    clearInterval(timer);

    //estadoActual = nombre;
    descansoActual = restante;
    pausado = false;
    estado.textContent = nombre;
    segundos =duracion;
    tiempo.textContent = formatoTiempo(segundos);
    longBeep.currentTime = 0;
    longBeep.play();

    timer = setInterval(cuentaRegresiva, 1000);
}

function cuentaRegresiva() {
    if (pausado) return;

    segundos--;
    tiempo.textContent = formatoTiempo(segundos);
    sonarUltimosSeg(segundos);

    if(segundos <= 0){
        clearInterval(timer);
        descansoActual && descansoActual();
    }
}

function iniciarRonda() {
    iniciarCuenta(
        `ENTRENAR (Ronda ${rondaActual}/${totalRondas})`,
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
                    estado.textContent = "ENTRENAMIENTO COMPLETADO 💪";
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
        `DESCANSO ENTRE CICLOS (${cicloActual}/${totalCiclos})`,
        tiempos.descansarCiclo,
        () => {
            cicloActual++;
            rondaActual = 1;
            iniciarRonda();
        }
    );
}


document.getElementById("empezar").addEventListener("click", () => {
    pausaBtn.textContent = "⏸️ PAUSAR";

    tiempos = {
        preparate: +document.getElementById("preparate").value || 0,
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
});