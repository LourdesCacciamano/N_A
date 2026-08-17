const estado = document.getElementById("estado");
const tiempo = document.getElementById("tiempo");
const beep = document.getElementById("beep");
const pausaBtn = document.getElementById("pausar");
const restablecer = document.getElementById("restablecer");
const vistaConfig = document.getElementById("vistaConfig");
const vistaCronometro = document.getElementById("vistaCronometro");
const volverBtn = document.getElementById("volver");
const predefinidoBtn = document.getElementById("predefinido");

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

// Valores del "Timer Predefinido" (los más comunes) — ajustá a gusto
const TIMER_PREDEFINIDO = {
    entrenar: 30,
    rondas: 4,
    descansar: 10,
    ciclos: 3,
    descansarCiclo: 20
};

function playBeep(reiniciar = false) {
    if (reiniciar) {
        beep.currentTime = 0;
    }

    const playPromise = beep.play();

    if (playPromise !== undefined) {
        playPromise.catch(() => { })
    }

}

function formatoTiempo(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

function mostrarVistaCronometro() {
    vistaConfig.classList.add("vista-oculta");
    vistaCronometro.classList.remove("vista-oculta");
}

function mostrarVistaConfig() {
    vistaCronometro.classList.add("vista-oculta");
    vistaConfig.classList.remove("vista-oculta");
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
        playBeep(true);
    }

    timer = setInterval(cuentaRegresiva, 1000);
}

function cuentaRegresiva() {
    if (pausado) {
        return;
    }

    tiempo.textContent = formatoTiempo(segundos);

    if (segundos <= 3 && segundos > 0) {
        enCuentaFinal = true;
        if (beep.paused) {
            beep.play().catch(() => { });
        }
    } else {
        enCuentaFinal = false;
    }

    segundos--;

    if (segundos < 0) {
        clearInterval(timer);

        setTimeout(() => {
            descansoActual && descansoActual();
        }, 200)
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
                } else {
                    estado.innerHTML = `COMPLETADO <i class="fa-regular fa-circle-check entrComp" style="color: #000000;"></i`;
                    background("ENTRENAMIENTO COMPLETADO")
                }
            }
        }
    );
}

function iniciarDescansoCiclo() {
    if (!tiempos.descansarCiclo || tiempos.descansarCiclo <= 0) {
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
    beep.muted = true
    beep.play().then(() => {
        beep.pause();
        beep.currentTime = 0;
        beep.muted = false
    }).catch(() => { });
}

function animarEstados() {
    estado.classList.remove("animate__animated", "animate__fadeInRight");
    void estado.offsetWidth;
    estado.classList.add("animate__animated", "animate__fadeInRight");
}

function background(nombre) {
    estado.classList.remove(
        "estatado-prep-desc",
        "estado-entre-compl"
    );
    if (nombre === "PREPÁRATE" || nombre.startsWith("DESCANSAR")) {
        estado.classList.add("estado-prep-des");
    } else if (nombre.startsWith("ENTRENAR") || nombre.startsWith("ENTRENAMIENTO COMPLETADO")) {
        estado.classList.add("estado-entre-compl");
    }
}

// Arranca el entrenamiento leyendo los valores actuales de los inputs
function iniciarEntrenamiento() {
    activarWakeLock();
    beep.play().then(() => { beep.pause(); beep.currentTime = 0; }).catch(() => { });

    beep.play().then(() => { beep.pause(); beep.currentTime = 0; }).catch(() => { });
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

    mostrarVistaCronometro();
    iniciarCuenta("PREPÁRATE", tiempos.preparate, iniciarRonda);
}

document.getElementById("empezar").addEventListener("click", iniciarEntrenamiento);

predefinidoBtn.addEventListener("click", () => {
    Swal.fire({
        title: "Timer Predefinido",
        html: `
            <div style="text-align:left; font-size:1rem; line-height:1.8;">
                <p><b>Entrenar:</b> ${TIMER_PREDEFINIDO.entrenar} seg</p>
                <p><b>Rondas:</b> ${TIMER_PREDEFINIDO.rondas}</p>
                <p><b>Descanso entre rondas:</b> ${TIMER_PREDEFINIDO.descansar} seg</p>
                <p><b>Ciclos:</b> ${TIMER_PREDEFINIDO.ciclos}</p>
                <p><b>Descanso entre ciclos:</b> ${TIMER_PREDEFINIDO.descansarCiclo} seg</p>
            </div>
        `,
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Usar estos valores",
        cancelButtonText: "Cancelar"
    }).then((resultado) => {
        if (resultado.isConfirmed) {
            document.getElementById("entrenar").value = TIMER_PREDEFINIDO.entrenar;
            document.getElementById("rondas").value = TIMER_PREDEFINIDO.rondas;
            document.getElementById("descansar").value = TIMER_PREDEFINIDO.descansar;
            document.getElementById("ciclos").value = TIMER_PREDEFINIDO.ciclos;
            document.getElementById("descansarCiclo").value = TIMER_PREDEFINIDO.descansarCiclo;

            iniciarEntrenamiento();
        }
    });
});

pausaBtn.addEventListener("click", () => {
    if (!timer) return;

    pausado = !pausado;
    pausaBtn.innerHTML = pausado ? ` <i class="fa-solid fa-play" style="color: #ffffff;"></i>  REANUDAR` : `<i class="fa-solid fa-pause" style="color: #f3f3f1;"></i> PAUSAR`;

    if (pausado) {
        beep.pause();
        liberarWakeLock();
    } else {
        if (enCuentaFinal && segundos > 0) {
            beep.play().catch(() => { });
        }
        activarWakeLock();
    }
});

restablecer.addEventListener("click", () => {
    clearInterval(timer);
    timer = null;
    pausado = false;
    segundos = 0;

    rondaActual = 1;
    cicloActual = 1;

    pausaBtn.innerHTML = `<i class="fa-solid fa-pause" style="color: #f3f3f1;"></i> PAUSAR`;

    [beep].forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });

    // Vuelve a arrancar el entrenamiento completo desde "Prepárate"
    iniciarCuenta("PREPÁRATE", tiempos.preparate, iniciarRonda);
});

// Botón "volver": detiene el timer y vuelve a la pantalla de configuración
// para poder editar los números, sin borrar lo que ya cargó el usuario
volverBtn.addEventListener("click", () => {
    clearInterval(timer);
    timer = null;
    pausado = false;
    segundos = 0;

    estado.textContent = "PREPÁRATE";
    tiempo.textContent = "00:00";
    pausaBtn.innerHTML = `<i class="fa-solid fa-pause" style="color: #f3f3f1;"></i> PAUSAR`;

    [beep].forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });

    liberarWakeLock();
    mostrarVistaConfig();
});

document.querySelectorAll(".stepper-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const input = document.getElementById(btn.dataset.target);
        const step = parseInt(btn.dataset.step, 10);
        const nuevoValor = Math.max(0, (parseInt(input.value, 10) || 0) + step);
        input.value = nuevoValor;
    });
});

let wakeLock = null;

async function activarWakeLock() {
    try {
        if ("wakeLock" in navigator) {
            wakeLock = await navigator.wakeLock.request("screen");

            wakeLock.addEventListener("release", () => {
                wakeLock = null;
            });
        }
    } catch (err) {
        console.log("No se pudo activar wakeLock:", err);
    }
}

async function liberarWakeLock() {
    if (wakeLock) {
        try {
            await wakeLock.release();
        } catch (err) { }
        wakeLock = null;
    }
}

// Si el usuario cambia de pestaña/app y vuelve, el wakeLock se pierde solo:
// hay que volver a pedirlo si el timer sigue corriendo
document.addEventListener("visibilitychange", async () => {
    if (document.visibilityState === "visible" && timer && !pausado) {
        await activarWakeLock();
    }
});

/*para que el navegador en mobile no me bloquee el sonido */
document.addEventListener("touchstart", desbloquearAudio, { once: true });
document.addEventListener("click", desbloquearAudio, { once: true });