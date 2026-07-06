const { google } = require("googleapis");
const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const fetch = require("node-fetch");
const path = require("path");

// ─── CONFIGURACIÓN ───────────────────────────────────────────────
const SHEET_ID = "1SPCuHNxKMLrJsIsnYw2TqSWzALIp7KJ9igWAPhklHVM";
const SHEET_RANGO = "CONTROL DE PAGO!A3:J200";

const EMAILJS_SERVICE_ID = "service_2dnwbtb";
const EMAILJS_TEMPLATE_ID = "template_gta9vkl";
const EMAILJS_PUBLIC_KEY = "GzCo-Bpl2dSrUjLIr";
const EMAILJS_PRIVATE_KEY = "ALBY1-i5KqMD5DyZmouWh"

const CREDENCIALES_PATH = path.join(__dirname, "credenciales.json");
// ─────────────────────────────────────────────────────────────────

// Inicializar Firebase Admin
const serviceAccount = require(CREDENCIALES_PATH);

if (!getApps().length) {
    initializeApp({
        credential: cert(serviceAccount),
        projectId: "asesoramiento-na"
    });
}

const db = getFirestore();

// Parsear fechas dd/mm/yyyy
function parsearFecha(str) {
    if (!str || str === "-" || str.trim() === "") return null;
    const partes = str.trim().split("/");
    if (partes.length !== 3) return null;
    const dia = parseInt(partes[0]);
    const mes = parseInt(partes[1]) - 1;
    const anio = parseInt(partes[2]);
    if (isNaN(dia) || isNaN(mes) || isNaN(anio)) return null;
    return new Date(anio, mes, dia);
}

// Mandar mail via EmailJS
async function mandarMail(nombre, email, fechaVencimiento) {
    const body = {
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        accessToken: EMAILJS_PRIVATE_KEY,
        template_params: {
            nombre: nombre,
            fecha_vencimiento: fechaVencimiento,
            email: email
        }
    };

    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    if (response.ok) {
        console.log(`   ✅ Mail enviado a ${email}`);
    } else {
        const error = await response.text();
        console.log(`   ❌ Error al mandar mail a ${email}: ${error}`);
    }
}

// Función principal
async function actualizarCuotas() {
    console.log("🚀 Iniciando actualización de cuotas...\n");

    const auth = new google.auth.GoogleAuth({
        keyFile: CREDENCIALES_PATH,
        scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
    });

    const sheets = google.sheets({ version: "v4", auth });
    const respuesta = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: SHEET_RANGO
    });

    const filas = respuesta.data.values;
    if (!filas || filas.length === 0) {
        console.log("No se encontraron datos en la planilla.");
        return;
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    let actualizados = 0;
    let mailsEnviados = 0;
    let errores = 0;

    for (const fila of filas) {
        const nombre = fila[0];
        const fechaVencStr = fila[4];
        const dni = fila[8];
        const email = fila[9];

        if (!dni || !nombre || dni === "-" || dni.trim() === "") continue;

        const fechaVenc = parsearFecha(fechaVencStr);

        if (!fechaVenc) {
            console.log(`⏭️  ${nombre} - sin fecha de vencimiento, se omite`);
            continue;
        }

        const vencido = fechaVenc < hoy;
        const nuevoEstado = vencido ? "vencido" : "al_dia";

        const fechaFormateada = fechaVenc.toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });

        try {
            const usuarioRef = db.collection("usuarios").doc(dni.trim());
            const usuarioSnap = await usuarioRef.get();

            if (!usuarioSnap.exists) {
                console.log(`⚠️  ${nombre} (DNI: ${dni}) - no encontrado en Firebase`);
                continue;
            }

            const estadoActual = usuarioSnap.data()?.cuota?.estado;

            await usuarioRef.update({
                "cuota.estado": nuevoEstado,
                "cuota.vencimiento": fechaVencStr
            });

            console.log(`✔️  ${nombre} → ${nuevoEstado.toUpperCase()} (vence ${fechaFormateada})`);
            actualizados++;

           if (vencido && email && email.includes("@")) {
                console.log(`   📧 Mandando mail a ${nombre}...`);
                await mandarMail(nombre, email, fechaFormateada);
                mailsEnviados++;
            }

        } catch (error) {
            console.log(`❌ Error con ${nombre}: ${error.message}`);
            errores++;
        }
    }

    console.log(`\n✅ Listo!`);
    console.log(`   Usuarios actualizados: ${actualizados}`);
    console.log(`   Mails enviados: ${mailsEnviados}`);
    console.log(`   Errores: ${errores}`);
}

actualizarCuotas();