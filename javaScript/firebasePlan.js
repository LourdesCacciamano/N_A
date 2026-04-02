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

// DNI guardado
const dni = localStorage.getItem("dni");

//  DÍAS
const dias = ["Dia1", "Dia2", "Dia3", "Dia4", "Dia5"];

//  función grupos
function obtenerGruposDias(totalDias) {
    if (totalDias === 5) return ["Días 1, 3 y 5", "Días 2 y 4"];
    if (totalDias === 4) return ["Días 1 y 3", "Días 2 y 4"];
    if (totalDias === 3) return ["Días 1 y 3", "Día 2"];
    if (totalDias === 6) return ["Días 1, 3 y 5", "Días 2, 4 y 6"];
    return ["Días", ""];
}

async function cargarRutina() {

    const docRef = doc(db, "usuarios", dni);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        console.log("No se encontró usuario");
        return;
    }

    const data = docSnap.data();
    const rutina = data.rutina;

    // 👉 nombre
    const nombreSpan = document.getElementById("nombreUsuario");
    if (data.nombre) {
        nombreSpan.innerText = data.nombre;
    }

    // 👉 cantidad de días
    const cantidadDias = Object.keys(rutina)
        .filter(k => k.includes("dia")).length;

    const grupos = obtenerGruposDias(cantidadDias);

    // 🔥 ACTIVACIÓN
    const tablaActivacion = document.getElementById("tablaActivacion");

    if (rutina.activacion && tablaActivacion) {


        tablaActivacion.innerHTML = "";

        let contador = 1;

        // 🔥 GRUPO 1
        if (rutina.activacion.grupo1) {

            tablaActivacion.innerHTML += `
            <tr>
                <td colspan="3" class="tituloGrupo">${grupos[0]}</td>
            </tr>
        `;

            rutina.activacion.grupo1.forEach((ej) => {
                tablaActivacion.innerHTML += `
                <tr class="filaEj">
                    <td>${contador++}</td>
                    <td>${ej.ejercicio}</td>
                    <td>${ej.cantidad}</td>
                </tr>
            `;
            });
        }

        // 🔥 GRUPO 2
        if (rutina.activacion.grupo2) {

            tablaActivacion.innerHTML += `
            <tr>
                <td colspan="3" class="tituloGrupo">${grupos[1]}</td>
            </tr>
        `;

            rutina.activacion.grupo2.forEach((ej) => {
                tablaActivacion.innerHTML += `
                <tr class="filaEj">
                    <td>${contador++}</td>
                    <td>${ej.ejercicio}</td>
                    <td>${ej.cantidad}</td>
                </tr>
            `;
            });
        }


        dias.forEach(nombre => {
            const tabla = document.getElementById(`tabla${nombre}`);
            const bloque = document.getElementById(`bloque${nombre}`);
            const clave = nombre.toLowerCase();

            if (rutina[clave] && tabla) {

                tabla.innerHTML = "";

                rutina[clave].forEach((ej, index) => {
                    tabla.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${ej.ejercicio}</td>
                    <td>${ej.cantidad}</td>
                </tr>
            `;
                });

            } else {
                // oculta días que no existen
                if (bloque) bloque.style.display = "none";
            }
        });
    }
}

cargarRutina();