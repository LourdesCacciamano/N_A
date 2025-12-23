//DOMContentLoaded, se usa para que esto arranque cuando el html haya cargado totalmente.
const contenedor = document.querySelector('#accordionExample');
let productosArray = [];

document.addEventListener('DOMContentLoaded', function () {
    eventListeners();
});

function eventListeners() {
    // pag. suplementos
    if (contenedor) {
        contenedor.addEventListener('click', capturarProductos);
    };

    //pag. carrito
    const contenedorCarrito = document.querySelector('#contenedorCarrito')
    if (contenedorCarrito) {
        mostrarCarrito();
    };
};

function capturarProductos(e) {
    if (e.target.classList.contains('botonSupJs')) {
        const elementosHtml = e.target.parentElement.parentElement;
        seleccionarDatos(elementosHtml);
    };
};

function seleccionarDatos(productos) {
    const saborSeleccionado = productos.querySelector(
        'input[type="radio"]:checked'
    );

    const producto = {
        img: productos.querySelector('img').src,
        titulo: productos.querySelector('h4').textContent,
        precio: parseFloat(productos.querySelector('h3').textContent.replace('$', '').replace('.', '')),
        marca: productos.querySelector('h6').textContent,
        //condicion ? valorTrue : valorFalse (TERNARIO)
        sabor: saborSeleccionado ? saborSeleccionado.value : 'Sin seleccionar',
        id: parseInt(productos.querySelector('button[type="button"]').dataset.id, 10),
        cantidad: 1
    };
    guardarEnCarrito(producto);
};

// guardar en localstorage
function guardarEnCarrito(producto) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const existe = carrito.find(
        p => p.id === producto.id && p.sabor === producto.sabor
    );
    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push(producto);
        mostrarToast('Producto agregado al carrito 🛒');
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
};

function mostrarResumenCompra() {
    const listaResumen = document.querySelector('#listaResumen');
    const totalCompra = document.querySelector('#totalCompra');

    if (!listaResumen || !totalCompra) return;

    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    listaResumen.innerHTML = '';

    let total = 0;

    carrito.forEach(producto => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');

        const subtotal = producto.precio * producto.cantidad;
        total += subtotal;

        li.textContent = `- ${producto.titulo} | Sabor: ${producto.sabor} | Cantidad: ${producto.cantidad} | Subtotal: $${subtotal.toLocaleString('es-AR')}`;
        listaResumen.appendChild(li);
    });

    totalCompra.textContent = `$${total.toLocaleString('es-AR')}`;
};


//mostrar carrito
function mostrarCarrito() {
    const contenedorCarrito = document.querySelector('#contenedorCarrito');
    if (!contenedorCarrito) return;

    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    contenedorCarrito.innerHTML = '';

    carrito.forEach(producto => {
        const div = document.createElement('div');
        div.classList.add('col-md-4', 'mb-4', 'tamañoCard');

        div.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${producto.img}" class="card-img-top">
                <div class="card-body bodyCarrito">
                    <h5 class="card-title tituloCarrito">${producto.titulo}</h5>
                    <p class="card-text caracteProd">${producto.marca}</p>
                    <p class="card-tex caracteProd">- Sabor: ${producto.sabor}</p>
                    <p class="fw-bold caracteProd"> - Precio: $${producto.precio.toLocaleString('es-AR')}</p>
                    <div class="d-flex align-items-center gap-2 my-2">
                        <button class="btn btn-outline-secondary btn-sm btn-restar" type="button"
                            data-id="${producto.id}" data-sabor="${producto.sabor}">−</button>
                        <span class="fw-bold">${producto.cantidad}</span>
                        <button class="btn btn-outline-secondary btn-sm btn-sumar" type="button"
                            data-id="${producto.id}" data-sabor="${producto.sabor}">+</button>
                    </div>
                    <button class="btn btn-danger btn-sm btnEliminarProduc"  onclick="eliminarProducto(${producto.id}, '${producto.sabor}')">
                        Eliminar
                    </button>
                </div>
            </div>
            `;
        contenedorCarrito.appendChild(div);
    });
    mostrarResumenCompra();
};

function eliminarProducto(id, sabor) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito = carrito.filter(
        producto => !(producto.id === id && producto.sabor === sabor)
    );
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();

    mostrarCarrito();
    mostrarResumenCompra();
    mostrarToast('Producto eliminado ❌', 'danger');
};


//vaciar carrito
document.addEventListener('click', e => {
    if (e.target.id === 'vaciarCarrito') {
        localStorage.removeItem('carrito');
        mostrarCarrito();
        mostrarResumenCompra();
    };
});

//enviar todo por whatsapp
document.addEventListener('click', e => {
    if (e.target.id === 'enviarWhatsapp') {
        enviarProductoWhatsapp();
    };
});

function enviarProductoWhatsapp() {
    const numeroWhatsApp = '5493518104131';

    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito.length === 0) return;

    let mensaje = '* NA | NUEVA COMPRA*\n\n';
    let total = 0;

    carrito.forEach((p, i) => {
        const subtotal = p.precio * p.cantidad;
        total += subtotal;

        mensaje += `${i + 1} - ${p.titulo}
            ${p.marca}
            - Sabor: ${p.sabor}
            - Precio: $${p.precio}
            - Cantidad: ${p.cantidad}
            Subtotal: $${subtotal.toLocaleString('es-AR')}\n\n
        `;
    });

    mensaje += `*TOTAL: $${total.toLocaleString('es-AR')}*`;


    const mensajeCodificado = encodeURIComponent(mensaje);
    const urlWhatsapp = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensajeCodificado}`;
    window.open(urlWhatsapp, '_blank');
};

// sumar y restar la cantidad
document.addEventListener('click', e => {
    if (e.target.classList.contains('btn-sumar')) {
        modificarCantidad(e.target.dataset.id, e.target.dataset.sabor, 1);
    };

    if (e.target.classList.contains('btn-restar')) {
        modificarCantidad(e.target.dataset.id, e.target.dataset.sabor, -1);
    };
});

function modificarCantidad (id, sabor, cambio) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [] ;

    carrito = carrito.map(producto => {
        if(producto.id == id && producto.sabor === sabor) {
            producto.cantidad += cambio;
            if (producto.cantidad < 1) producto.cantidad = 1;
        };
        return producto;
    });

    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
    mostrarResumenCompra();
};

function mostrarToast(mensaje, tipo = 'success') {
    const toastEl = document.getElementById('toastCarrito');
    const toastMsg = document.getElementById('toastMensaje');

    if (!toastEl || !toastMsg) return;

    toastEl.className = `toast align-items-center diseñoToast ${tipo} border-0`;
    toastMsg.textContent = mensaje;

    const toast = new bootstrap.Toast(toastEl, { delay: 2000 });
    toast.show();
}

