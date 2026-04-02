document.addEventListener("DOMContentLoaded", function () {

    const dni = localStorage.getItem("dni");

    const menuMiPlan = document.getElementById("menuMiPlan");
    const menuCuota = document.getElementById("menuCuota");
    const btnLogin = document.getElementById("btnLogin");
    const btnLogout = document.getElementById("btnLogout");

    if (dni) {
        // usuario logueado
        if (menuMiPlan) menuMiPlan.style.display = "block";
        if (menuCuota) menuCuota.style.display = "block";
        if (btnLogin) btnLogin.style.display = "none";
        if (btnLogout) btnLogout.style.display = "block";

    } else {
        // usuario NO logueado
        if (menuMiPlan) menuMiPlan.style.display = "none";
        if (menuCuota) menuCuota.style.display = "none";
        if (btnLogin) btnLogin.style.display = "block";
        if (btnLogout) btnLogout.style.display = "none"; // 🔥 ESTA LÍNEA ES LA CLAVE
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

const btnLogout = document.getElementById("btnLogout");

if (btnLogout) {
    btnLogout.addEventListener("click", (e) => {
        e.preventDefault();

        Swal.fire({
            title: "¿Cerrar sesión?",
            text: "Vas a salir de tu cuenta",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, salir",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {

                localStorage.removeItem("dni");
                localStorage.removeItem("usuarioLogueado");

                window.location.href = "./index.html";
            }
        });
    });
}