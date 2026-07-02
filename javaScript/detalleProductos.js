// ============================================================
// LÓGICA DE LA PÁGINA DE DETALLE DE PRODUCTO (detalleProducto.html)
// Depende de que ya estén cargados antes que este archivo:
//   - productos-data.js  (array PRODUCTOS_NA)
//   - carritoCompra.js   (funciones guardarEnCarrito y mostrarToast)
// ============================================================


function renderProducto() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'), 10);
    const producto = PRODUCTOS_NA.find(p => p.id === id);
    const contenedor = document.getElementById('fichaProducto');

    if (!producto) {
        contenedor.innerHTML = `
            <div class="fichaProducto" style="grid-template-columns:1fr; text-align:center; padding:60px 20px;">
                <p style="color:#fff; font-family:'Open Sans',sans-serif;">No encontramos ese producto.</p>
                <a href="./suplementos.html" class="volverListado" style="justify-content:center;">Volver a productos</a>
            </div>`;
        return;
    }

    document.title = producto.titulo + ' | NA';

    const tieneDescuento = producto.precioViejo && producto.precioViejo > producto.precio;
    const etiquetaSabor = producto.etiquetaSabor || 'Sabor';

    contenedor.innerHTML = `
        <div class="mediaProducto">
            <img src="${producto.img}" alt="${producto.titulo}">
        </div>
        <div class="infoProducto">
            <p class="categoriaProducto">${producto.categoria}</p>
            <h1 class="tituloProducto">${producto.titulo}</h1>
            <p class="precioProducto">
                ${tieneDescuento ? `<span class="precioViejoProducto">${fmtPrecio(producto.precioViejo)}</span>` : ''}
                ${fmtPrecio(producto.precio)}
            </p>
            <div class="metaProducto">
                <p>${producto.marca}</p>
                <p>${producto.contenido}</p>
            </div>
            ${producto.sabores.length ? `
                <label class="labelSaborProducto">${etiquetaSabor}</label>
                <select id="selectSaborProducto" class="selecProducto">
                    <option value="" disabled selected hidden>Seleccionar</option>
                    ${producto.sabores.map(s => `<option value="${s}">${s}</option>`).join('')}
                </select>
            ` : ''}
            <div class="filaAccionProducto">
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
        const select = document.getElementById('selectSaborProducto');
        if (select && !select.value) {
            mostrarToast('¡Seleccioná ' + (etiquetaSabor === 'Color' ? 'un color' : 'un sabor') + '!', 'warning');
            return;
        }
        guardarEnCarrito({
            img: producto.img,
            titulo: producto.titulo,
            precio: producto.precio,
            marca: producto.marca,
            sabor: select ? select.value : 'Sin seleccionar',
            id: producto.id,
            cantidad: cantidad
        });
    });
}

document.addEventListener('DOMContentLoaded', renderProducto);