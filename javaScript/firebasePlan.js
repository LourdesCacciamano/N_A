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

    const tablaActivacion = document.getElementById("tablaActivacion");

    if (rutina.activacion && tablaActivacion) {

        // 👉 armamos todo el HTML en un string primero, y recién al
        // final lo pisamos UNA sola vez (antes se hacía innerHTML +=
        // fila por fila, que fuerza a reconstruir toda la tabla en
        // cada vuelta del loop)
        let html = "";
        let contador = 1;

        // Los títulos de cada grupo (ej: "Días 1 y 3") ya no se calculan
        // solos: se cargan desde Firestore (rutina.activacion.grupoNTitulo).
        // Tampoco hay un límite fijo de grupos: se leen todos los "grupoN"
        // que existan en el documento (grupo1, grupo2, grupo3, grupo4...),
        // para que cada usuario pueda tener tantos grupos como necesite.
        const clavesGrupos = Object.keys(rutina.activacion)
            .filter(k => /^grupo\d+$/.test(k) && rutina.activacion[k]?.length > 0)
            .sort((a, b) => parseInt(a.slice(5), 10) - parseInt(b.slice(5), 10));

        // Si hay un solo grupo cargado, por default es porque la rutina
        // no separa por días: se llama "Todos los días" en vez de "Día 1".
        clavesGrupos.forEach(clave => {
            const grupo = rutina.activacion[clave];

            const tituloDefault = clavesGrupos.length === 1
                ? "TODOS LOS DÍAS"
                : `Día ${clave.slice(5)}`;
            const titulo = rutina.activacion[`${clave}Titulo`] || tituloDefault;

            html += `<tr><td colspan="3" class="tituloGrupo">${titulo}</td></tr>`;

            grupo.forEach((ej) => {
                html += `<tr class="filaEj"><td>${contador++}</td><td>${ej.ejercicio}</td><td>${ej.cantidad}</td></tr>`;
            });
        });

        if (rutina.activacion.movilidad && rutina.activacion.movilidad.length > 0) {
            const titulo = rutina.activacion.movilidadTitulo || "Movilidad";

            html += `<tr><td colspan="3" class="tituloGrupo">${titulo}</td></tr>`;

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