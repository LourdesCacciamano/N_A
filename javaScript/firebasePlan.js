// ============================================================
// MI PLAN - lee Firestore directo por REST (sin el SDK)
// ============================================================
// Por qué: el SDK de Firestore negocia una conexión de streaming
// (WebChannel) antes de responder, incluso para una lectura única.
// En un sitio estático (cada página = carga nueva) esa negociación
// se paga de cero en cada visita. Pidiendo el documento por REST
// con fetch() nos ahorramos esa negociación por completo: es una
// sola llamada HTTP normal.
// ============================================================

const PROJECT_ID = "asesoramiento-na";
const dni = localStorage.getItem("dni");
const dias = ["Dia1", "Dia2", "Dia3", "Dia4", "Dia5"];

function obtenerGruposDias(totalDias) {
    if (totalDias === 5) return ["Días 1, 3 y 5", "Días 2 y 4"];
    if (totalDias === 4) return ["Días 1 y 3", "Días 2 y 4"];
    if (totalDias === 3) return ["Días 1 y 3", "Día 2"];
    if (totalDias === 6) return ["Días 1, 3 y 5", "Días 2, 4 y 6"];
    return ["Días", ""];
}

// Convierte el JSON "tipado" que devuelve la API REST de Firestore
// ({ fields: { x: { stringValue: "..." } } }) a un objeto JS normal.
function parseFirestoreValue(value) {
    if (value == null) return null;
    if ("stringValue" in value) return value.stringValue;
    if ("integerValue" in value) return parseInt(value.integerValue, 10);
    if ("doubleValue" in value) return value.doubleValue;
    if ("booleanValue" in value) return value.booleanValue;
    if ("nullValue" in value) return null;
    if ("timestampValue" in value) return new Date(value.timestampValue);
    if ("mapValue" in value) return parseFirestoreFields(value.mapValue.fields || {});
    if ("arrayValue" in value) return (value.arrayValue.values || []).map(parseFirestoreValue);
    return null;
}

function parseFirestoreFields(fields) {
    const out = {};
    for (const key in fields) {
        out[key] = parseFirestoreValue(fields[key]);
    }
    return out;
}

async function obtenerUsuario(dni) {
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/usuarios/${dni}`;
    const claveCache = `rutinaCache_${dni}`;

    try {
        const res = await fetch(url);

        if (!res.ok) {
            // 404 = no existe el documento; cualquier otro código = error real
            return null;
        }

        const json = await res.json();
        const datos = parseFirestoreFields(json.fields || {});

        // Guardamos la última rutina obtenida con éxito, por si después no hay internet
        localStorage.setItem(claveCache, JSON.stringify(datos));

        return datos;
    } catch (err) {
        // fetch() tira error cuando no hay conexión (a diferencia de un 404, que sí responde)
        const cacheGuardado = localStorage.getItem(claveCache);

        if (cacheGuardado) {
            console.log("Sin conexión: mostrando la última rutina guardada");
            return JSON.parse(cacheGuardado);
        }

        console.log("Sin conexión y sin datos guardados previamente");
        return null;
    }
}

async function cargarRutina() {


    if (!navigator.onLine) {
        const aviso = document.createElement("div");
        aviso.className = "avisoOffline";
        aviso.innerText = "📡 Estás sin conexión — mostrando la última rutina guardada";
        document.body.prepend(aviso);
    }

    const data = await obtenerUsuario(dni);

    if (!data) {
        console.log("No se encontró usuario");
        return;
    }

    const rutina = data.rutina;

    const nombreSpan = document.getElementById("nombreUsuario");
    if (data.nombre) {
        nombreSpan.innerText = data.nombre;
    }

    const cantidadDias = Object.keys(rutina)
        .filter(k => k.includes("dia")).length;

    const grupos = obtenerGruposDias(cantidadDias);

    const tablaActivacion = document.getElementById("tablaActivacion");

    if (rutina.activacion && tablaActivacion) {

        const tieneGrupo1 = rutina.activacion?.grupo1?.length > 0;
        const tieneGrupo2 = rutina.activacion?.grupo2?.length > 0;
        const tieneGrupo3 = rutina.activacion?.grupo3?.length > 0;

        // 👉 armamos todo el HTML en un string primero, y recién al
        // final lo pisamos UNA sola vez (antes se hacía innerHTML +=
        // fila por fila, que fuerza a reconstruir toda la tabla en
        // cada vuelta del loop)
        let html = "";
        let contador = 1;

        if (tieneGrupo1) {
            let titulo;
            if (!tieneGrupo2 && !tieneGrupo3) {
                titulo = "Todos los días";
            } else if (tieneGrupo3 && cantidadDias === 5) {
                titulo = "Días 1 y 3";
            } else {
                titulo = grupos[0];
            }

            html += `<tr><td colspan="3" class="tituloGrupo">${titulo}</td></tr>`;

            rutina.activacion.grupo1.forEach((ej) => {
                html += `<tr class="filaEj"><td>${contador++}</td><td>${ej.ejercicio}</td><td>${ej.cantidad}</td></tr>`;
            });
        }

        if (tieneGrupo2) {
            let titulo;
            if (tieneGrupo3 && cantidadDias === 5) {
                titulo = "Días 2 y 4";
            } else {
                titulo = grupos[1];
            }

            html += `<tr><td colspan="3" class="tituloGrupo">${titulo}</td></tr>`;

            rutina.activacion.grupo2.forEach((ej) => {
                html += `<tr class="filaEj"><td>${contador++}</td><td>${ej.ejercicio}</td><td>${ej.cantidad}</td></tr>`;
            });
        }

        if (tieneGrupo3) {
            html += `<tr><td colspan="3" class="tituloGrupo">Día 5</td></tr>`;

            rutina.activacion.grupo3.forEach((ej) => {
                html += `<tr class="filaEj"><td>${contador++}</td><td>${ej.ejercicio}</td><td>${ej.cantidad}</td></tr>`;
            });
        }

        if (rutina.activacion.movilidad && rutina.activacion.movilidad.length > 0) {
            html += `<tr><td colspan="3" class="tituloGrupo">Movilidad</td></tr>`;

            rutina.activacion.movilidad.forEach((ej) => {
                html += `<tr class="filaEj"><td>${contador++}</td><td>${ej.ejercicio}</td><td>${ej.cantidad}</td></tr>`;
            });
        }

        tablaActivacion.innerHTML = html;
    }

    dias.forEach(nombre => {
        const tabla = document.getElementById(`tabla${nombre}`);
        const bloque = document.getElementById(`bloque${nombre}`);
        const tituloSpan = document.getElementById(`titulo${nombre}`); // 👈 nuevo
        const clave = nombre.toLowerCase();

        if (rutina[clave] && tabla) {
            let html = "";
            rutina[clave].forEach((ej, index) => {
                html += `<tr><td>${index + 1}</td><td>${ej.ejercicio.replace(/\n/g, '<br>')}</td><td>${ej.cantidad.replace(/\n/g, '<br>')}</td></tr>`;
            });
            tabla.innerHTML = html;

            // 👇 nuevo: pinta el título si existe
            const tituloDia = rutina[`${clave}Titulo`];
            if (tituloSpan) {
                tituloSpan.innerText = tituloDia ? ` | ${tituloDia}` : "";
            }
        } else {
            if (bloque) bloque.style.display = "none";
        }
    });
}

cargarRutina();