// Barra de scroll propia para la fila de planes (en vez de depender de la
// del navegador, que se ve distinto según sistema/navegador). El "thumb"
// mide proporcional a lo que se ve y se mueve con el scroll real de .planRow.

function iniciarPlanScroll() {
    const row = document.getElementById("planRow");
    const track = document.getElementById("planScrollTrack");
    const thumb = document.getElementById("planScrollThumb");
    if (!row || !track || !thumb) return;

    function actualizar() {
        const maxScroll = row.scrollWidth - row.clientWidth;

        if (maxScroll <= 1) {
            track.style.display = "none"; // todo entra sin scrollear, no hace falta barra
            return;
        }
        track.style.display = "block";

        const pctVisible = row.clientWidth / row.scrollWidth;
        const pctScrolleado = row.scrollLeft / maxScroll;
        const anchoTrack = track.clientWidth;
        const anchoThumb = Math.max(anchoTrack * pctVisible, 40);

        thumb.style.width = anchoThumb + "px";
        thumb.style.transform = `translateX(${pctScrolleado * (anchoTrack - anchoThumb)}px)`;
    }

    row.addEventListener("scroll", actualizar, { passive: true });
    window.addEventListener("resize", actualizar);
    actualizar();
}

document.addEventListener("DOMContentLoaded", iniciarPlanScroll);
