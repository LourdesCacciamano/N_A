document.addEventListener("DOMContentLoaded", function () {
    const logueado = localStorage.getItem("usuarioLogueado");

    const menuMiPlan = document.getElementById("menuMiPlan");
    const menuCuota = document.getElementById("menuCuota");
    const btnLogin = document.getElementById("btnLogin");

    if (logueado === "true") {
        menuMiPlan.style.display = "block";
        menuCuota.style.display = "block";
        btnLogin.style.display = "none";
    } else {
        menuMiPlan.style.display = "none";
        menuCuota.style.display = "none";
        btnLogin.style.display = "block";
    }
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCpuRMkYLZOPTBm77KqTmEx94ZPgU3iQPE",
    authDomain: "asesoramiento-na.firebaseapp.com",
    projectId: "asesoramiento-na",
    storageBucket: "asesoramiento-na.firebasestorage.app",
    messagingSenderId: "774206761497",
    appId: "1:774206761497:web:042ed21a39fcee75329888",
    measurementId: "G-EJMVKDR61V"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.loginUsuario = async function () {
    const dni = document.getElementById("dniInput").value.trim();

    if (!dni) return;

    const docRef = doc(db, "usuarios", dni);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {

        // 👉 toast éxito
        const toastOk = new bootstrap.Toast(document.getElementById('toastSuccess'));
        document.querySelector('#toastSuccess .toast-body').innerText = "Bienvenido 👋";
        toastOk.show();

        // guardamos sesión
        localStorage.setItem("usuarioLogueado", "true");
        localStorage.setItem("dni", dni);

        // esperamos un toque para que se vea el toast
        setTimeout(() => {
            location.reload();
        }, 1200);

    } else {

        // 👉 toast error
        const toastError = new bootstrap.Toast(document.getElementById('toastError'));
        toastError.show();
    }
}