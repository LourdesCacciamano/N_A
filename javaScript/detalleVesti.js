// ============================================================
// LÓGICA DE LA PÁGINA DE DETALLE - VESTIMENTA (detalleVestimenta.html)
// Depende de que ya estén cargados antes que este archivo:
//   - productosVestimentaData.js  (array PRODUCTOS_VESTI)
//   - carritoCompra.js            (funciones guardarEnCarrito y mostrarToast)
// ============================================================

function fmtPrecio(n) {
    return '$' + n.toLocaleString('es-AR');
}

function crearCarruselDetalleHTML(producto) {
    const slides = producto.imgs.map((img, i) => `
        <div class="carousel-item ${i === 0 ? 'active' : ''}">
            <a href="${img}">
                <img src="${img}" class="d-block w-100 imag carouselVestiImg" alt="${producto.titulo}">
            </a>
        </div>
    `).join('');

    const controles = producto.imgs.length > 1 ? `
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselDetalle" data-bs-slide="prev">
            <span class="carousel-control-prev-icon"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselDetalle" data-bs-slide="next">
            <span class="carousel-control-next-icon"></span>
        </button>
    ` : '';

    return `
        <div id="carouselDetalle" class="carousel slide">
            <div class="carousel-inner">${slides}</div>
            ${controles}
        </div>
    `;
}

function renderProducto() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'), 10);
    const producto = PRODUCTOS_VESTI.find(p => p.id === id);
    const contenedor = document.getElementById('fichaProducto');

    if (!producto) {
        contenedor.innerHTML = `
            <div class="fichaProducto" style="grid-template-columns:1fr; text-align:center; padding:60px 20px;">
                <p style="color:#fff; font-family:'Open Sans',sans-serif;">No encontramos ese producto.</p>
                <a href="./vestimentaNA.html" class="volverListado" style="justify-content:center;">Volver a productos</a>
            </div>`;
        return;
    }

    document.title = producto.titulo + ' | NA';

    contenedor.innerHTML = `
        <div class="mediaProducto">
            ${crearCarruselDetalleHTML(producto)}
        </div>
        <div class="infoProducto">
            <h1 class="tituloProducto">${producto.titulo}</h1>
            <p class="precioProducto">${fmtPrecio(producto.precio)}</p>
            <hr>
            ${producto.talles.length ? `
                <label class="labelSaborProducto">Talle</label>
                <div class="conteTalles" id="conteTallesProducto">
                    ${producto.talles.map(t => `
                        <label class="radioPersonalizadoVestiTalle">
                            <input type="radio" name="talleProducto" value="${t}">
                            <span>${t}</span>
                        </label>
                    `).join('')}
                </div>
            ` : ''}

            ${producto.colores.length ? `
                <label class="labelSaborProducto" style="margin-top:14px;">Color</label>
                <div class="labelColor" id="conteColoresProducto">
                    ${producto.colores.map(c => `
                        <label class="radioPersonalizadoVestiColor">
                            <input type="radio" name="colorProducto" value="${c.nombre}">
                            <span class="color ${c.clase}"></span>
                        </label>
                    `).join('')}
                </div>
                <hr>
            ` : ''}

            <div class="filaAccionProducto" style="margin-top:18px;">
                <div class="contadorProducto">
                    <button type="button" id="btnRestarProducto">−</button>
                    <span id="cantidadProducto">1</span>
                    <button type="button" id="btnSumarProducto">+</button>
                </div>
                <button type="button" class="btnAgregarProducto" id="btnAgregarProducto">
                    <i class="fa-solid fa-cart-plus"></i> Agregar al carrito
                </button>
            </div>
        </div>
    `;

    let cantidad = 1;
    document.getElementById('btnSumarProducto').addEventListener('click', () => {
        cantidad++;
        document.getElementById('cantidadProducto').textContent = cantidad;
    });
    document.getElementById('btnRestarProducto').addEventListener('click', () => {
        if (cantidad > 1) cantidad--;
        document.getElementById('cantidadProducto').textContent = cantidad;
    });

    document.getElementById('btnAgregarProducto').addEventListener('click', () => {
        const talleInput = document.querySelector('input[name="talleProducto"]:checked');
        const colorInput = document.querySelector('input[name="colorProducto"]:checked');

        if (producto.talles.length && !talleInput) {
            mostrarToast('¡Seleccioná un talle!', 'warning');
            return;
        }
        if (producto.colores.length && !colorInput) {
            mostrarToast('¡Seleccioná un color!', 'warning');
            return;
        }

        const detalles = [];
        if (talleInput) detalles.push(`Talle: ${talleInput.value}`);
        if (colorInput) detalles.push(`Color: ${colorInput.value}`);

        guardarEnCarrito({
            img: producto.imgs[0],
            titulo: producto.titulo,
            marca: '- Marca: NA',
            precio: producto.precio,
            detalles: detalles.join('\n'),
            id: producto.id,
            cantidad: cantidad
        });
    });
}

document.addEventListener('DOMContentLoaded', renderProducto);