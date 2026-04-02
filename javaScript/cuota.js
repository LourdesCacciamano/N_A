import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
     apiKey: "AIzaSyCpuRMkYLZOPTBm77KqTmEx94ZPgU3iQPE",
    authDomain: "asesoramiento-na.firebaseapp.com",
    projectId: "asesoramiento-na",
    storageBucket: "asesoramiento-na.firebasestorage.app",
    messagingSenderId: "774206761497",
    appId: "1:774206761497:web:042ed21a39fcee75329888",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const dni = localStorage.getItem("dni");

async function cargarCuota() {

    if (!dni) {
        console.log("No hay DNI");
        return;
    }

    const docRef = doc(db, "usuarios", dni);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        console.log("Usuario no encontrado");
        return;
    }

    const data = docSnap.data();
    const cuota = data.cuota;

    // 👉 mostrar datos
    document.getElementById("planCuota").innerText = cuota.plan;
    document.getElementById("valorCuota").innerText = cuota.valor;

    const fecha = new Date(cuota.vencimiento);
    document.getElementById("vntoCuota").innerText =
        fecha.toLocaleDateString();

    // 👉 estado visual
    const estadoBtn = document.getElementById("estadoCuota");

    if (cuota.estado === "al_dia") {
        estadoBtn.innerText = "Al día";
        estadoBtn.classList.add("estado-verde");
    } else {
        estadoBtn.innerText = "Atrasado";
        estadoBtn.classList.add("estado-rojo");
    }

    // 👉 mes actual
    const hoy = new Date();
    const mes = hoy.toLocaleString('es-AR', { month: 'long' });
    document.getElementById("mesCuota").innerText = "Mes: " + mes;
}

// esperar DOM
window.addEventListener("DOMContentLoaded", cargarCuota);