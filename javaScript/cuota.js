// ============================================================
// CUOTA - lee Firestore directo por REST (sin el SDK)
// Mismo motivo que firebasePlan.js: evitar la negociación del
// canal de streaming del SDK para una lectura única.
// ============================================================

const PROJECT_ID = "asesoramiento-na";
const dni = localStorage.getItem("dni");

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

// Intenta interpretar la fecha venga como venga: objeto Date ya
// parseado, string "yyyy-mm-dd", o string "dd/mm/yyyy".
function parsearVencimiento(valor) {
    if (!valor) return null;

    if (valor instanceof Date && !isNaN(valor)) {
        return valor;
    }

    if (typeof valor === "string") {
        if (valor.includes("-")) {
            const [a, m, d] = valor.split("-");
            const f = new Date(a, m - 1, d);
            if (!isNaN(f)) return f;
        }
        if (valor.includes("/")) {
            const [d, m, a] = valor.split("/");
            const f = new Date(a, m - 1, d);
            if (!isNaN(f)) return f;
        }
        const f = new Date(valor);
        if (!isNaN(f)) return f;
    }

    return null;
}

async function obtenerUsuario(dni) {
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/usuarios/${dni}`;
    const res = await fetch(url);

    if (!res.ok) return null;

    const json = await res.json();
    return parseFirestoreFields(json.fields || {});
}

async function cargarCuota() {

    if (!dni) {
        console.log("No hay DNI");
        return;
    }

    const data = await obtenerUsuario(dni);

    if (!data) {
        console.log("Usuario no encontrado");
        return;
    }

    const cuota = data.cuota;

    document.getElementById("planCuota").innerText = cuota.plan;
    document.getElementById("valorCuota").innerText = cuota.valor;

    console.log("vencimiento crudo:", cuota.vencimiento, typeof cuota.vencimiento);

    const fecha = parsearVencimiento(cuota.vencimiento);

    if (!fecha) {
        console.error("No se pudo interpretar la fecha de vencimiento:", cuota.vencimiento);
        document.getElementById("vntoCuota").innerText = "-";
    } else {
        const fechaFormateada = fecha.toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
        document.getElementById("vntoCuota").innerText = fechaFormateada;
    }

    const estadoBtn = document.getElementById("estadoCuota");

    if (cuota.estado === "al_dia") {
        estadoBtn.innerText = "ACTIVO";
        estadoBtn.classList.add("estado-verde");
    } else {
        estadoBtn.innerText = "VENCIDO";
        estadoBtn.classList.add("estado-rojo");
    }

    const hoy = new Date();
    const mes = hoy.toLocaleString('es-AR', { month: 'long' });
    document.getElementById("mesCuota").innerText = "Mes: " + mes;
}

window.addEventListener("DOMContentLoaded", cargarCuota);