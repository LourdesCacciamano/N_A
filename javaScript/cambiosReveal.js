// Sección "Cambios Físicos" del inicio: cada tile muestra la misma foto en
// dos capas (apagada/blanco y negro vs. color real) y el usuario arrastra
// para revelar el resultado. Solo la primera foto oscila sola como invitación
// a interactuar; el resto arranca quieta a la mitad (pero se puede arrastrar
// igual, a mano, en todas).

function iniciarCambiosReveal() {
    const tiles = document.querySelectorAll(".cambioTile");

    tiles.forEach((tile, indice) => {
        let dragging = false;
        let tocado = false;

        function setSplit(clientX) {
            const rect = tile.getBoundingClientRect();
            let pct = ((clientX - rect.left) / rect.width) * 100;
            pct = Math.max(4, Math.min(96, pct));
            tile.style.setProperty("--split", pct + "%");
        }

        tile.addEventListener("pointerdown", (e) => {
            dragging = true;
            tocado = true;
            setSplit(e.clientX);
            tile.setPointerCapture(e.pointerId);
        });
        tile.addEventListener("pointermove", (e) => {
            if (dragging) setSplit(e.clientX);
        });
        tile.addEventListener("pointerup", () => (dragging = false));
        tile.addEventListener("pointercancel", () => (dragging = false));

        if (indice !== 0) return; // el resto se queda quieta a la mitad (50% por default en el CSS)

        let auto = 42 + Math.random() * 16;
        let dir = 1;
        (function loop() {
            if (!tocado && !dragging) {
                auto += dir * 0.15;
                if (auto > 62 || auto < 38) dir *= -1;
                tile.style.setProperty("--split", auto + "%");
            }
            requestAnimationFrame(loop);
        })();
    });
}

document.addEventListener("DOMContentLoaded", iniciarCambiosReveal);
