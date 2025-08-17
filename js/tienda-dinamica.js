// tienda-dinamica.js
// Filtros avanzados y modal de detalle para tienda profesional
// Variables globales (solo una vez)
if (typeof window.productos === 'undefined') window.productos = [];
if (typeof window.carrito === 'undefined') window.carrito = [];
if (typeof window.favoritos === 'undefined') window.favoritos = [];

// --- Estilos y animaciones modernas ---
const estiloMejoras = document.createElement('style');
estiloMejoras.innerHTML = `
.producto-card {
  transition: box-shadow 0.3s, transform 0.3s;
  animation: fadeInCard 0.7s cubic-bezier(.4,2,.3,1);
}
.producto-card:hover {
  box-shadow: 0 8px 32px #FFD70099, 0 2px 8px #18181822;
  transform: scale(1.04) translateY(-4px);
}
.agregar-carrito, .btn-favorito {
  transition: background 0.2s, color 0.2s, transform 0.2s;
}
.agregar-carrito:active, .btn-favorito:active {
  transform: scale(1.12);
  background: #FFD700;
  color: #181818;
}
.animar-accion {
  animation: iconoAccion 0.7s cubic-bezier(.4,2,.3,1);
  box-shadow: 0 8px 32px #FFD70099, 0 2px 8px #18181822;
}
@keyframes iconoAccion {
  0% { transform: scale(1) rotate(0deg); }
  20% { transform: scale(1.22) rotate(-8deg); }
  40% { transform: scale(0.92) rotate(8deg); }
  60% { transform: scale(1.12) rotate(-4deg); }
  80% { transform: scale(1.02) rotate(4deg); }
  100% { transform: scale(1) rotate(0deg); }
}
.autocompletar-item {
  animation: fadeInAuto 0.5s cubic-bezier(.4,2,.3,1);
  transition: background 0.2s, color 0.2s;
}
.autocompletar-item:hover, .autocompletar-item:focus {
  background: #FFD700;
  color: #181818;
}
.toast-msg {
  animation: fadeInToast 0.4s cubic-bezier(.4,2,.3,1);
  box-shadow: 0 8px 32px #FFD70099, 0 2px 8px #18181822;
  filter: drop-shadow(0 2px 8px #FFD70055);
}
@keyframes fadeInToast {
  from { opacity:0; transform:translateY(40px) scale(0.95); }
  to { opacity:1; transform:translateY(0) scale(1); }
}
.skeleton-card {
  position:relative; overflow:hidden;
  animation: fadeInCard 0.7s cubic-bezier(.4,2,.3,1);
}
@keyframes fadeInCard {
  from { opacity:0; transform:scale(0.95); }
  to { opacity:1; transform:scale(1); }
}
.skeleton-img, .skeleton-text {
  animation: skeletonAnim 1.2s infinite linear alternate;
  background: linear-gradient(90deg,#FFD70022 0%,#fffbe8 100%);
}
@keyframes skeletonAnim {
  from { opacity:0.5; }
  to { opacity:1; }
}
`;
document.head.appendChild(estiloMejoras);

function cargarProductos() {
    fetch('productos.json')
        .then(res => res.json())
        .then(data => {
            productos = data;
            mostrarProductos();
            prepararBuscador();
            prepararFiltros();
        });
}

function mostrarProductos(filtrados = null) {
    const panel = document.getElementById('panel-productos');
    let lista = filtrados || productos;
    panel.innerHTML = '';
    if (lista.length === 0) {
        panel.innerHTML = `<div class='col-12 text-center'><p style='color:#888;font-size:1.15rem;'>No hay productos disponibles.</p></div>`;
        return;
    }
    lista.forEach(prod => {
        // Simulación de campos adicionales si no existen en productos.json
        let precio = prod.precio && prod.precio.trim() !== '' ? prod.precio : '<span style="color:#888">Precio pendiente</span>';
        let precioOferta = prod.precio_oferta ? `<span style='text-decoration:line-through;color:#888;font-size:1rem;margin-right:8px;'>${prod.precio_oferta}</span>` : '';
        let descripcion = prod.descripcion && prod.descripcion.trim() !== '' ? prod.descripcion : 'Sin descripción.';
        let categoria = prod.categoria ? prod.categoria.charAt(0).toUpperCase() + prod.categoria.slice(1) : 'Sin categoría';
        let valoracion = prod.valoracion ? prod.valoracion : '4.8';
        let reseñas = prod.reseñas ? prod.reseñas : '120';
        let stock = prod.stock ? prod.stock : 'En stock';
        let promo = prod.promo ? `<span class='badge badge-warning' style='margin-bottom:6px;'>${prod.promo}</span>` : '';
        let peso = prod.peso ? prod.peso : '';
        let talla = prod.talla ? prod.talla : '';
        let sabor = prod.sabor ? prod.sabor : '';
        let marca = prod.marca ? prod.marca : '';
        let envio = prod.envio ? prod.envio : 'Entrega gratis en 24h';

        panel.innerHTML += `
        <div class="col-md-4 mb-4 d-flex justify-content-center">
            <div class="card shadow-sm producto-card" style="max-width:340px; border-radius:18px;">
                <img src="${prod.img}" alt="${prod.nombre}" class="card-img-top" style="height:220px; object-fit:contain; border-radius:18px 18px 0 0; background:#f8f8f8; display:block; margin:auto; box-shadow:0 2px 12px #FFD70033;" onerror="this.onerror=null;this.src='img/blackgym-logo.jpg';">
                <div class="card-body text-center">
                    ${promo}
                    <h5 class="card-title font-weight-bold product-title" style="color:#FFD700;">${prod.nombre}</h5>
                    <div class="mb-2" style="font-size:1.1rem;color:#181818;">${categoria}</div>
                    <div class="mb-2" style="color:#FFD700;font-size:1.2rem;">
                        <span style="font-size:1.3rem;">${'⭐'.repeat(Math.round(valoracion))}</span>
                        <span style="color:#888;font-size:1rem;">${valoracion}/5 (${reseñas} reseñas)</span>
                    </div>
                    <div class="card-text" style="color:#181818;white-space:normal;word-break:break-word;max-height:110px;overflow:auto;text-align:left;font-size:1.09rem;padding:0.5rem 0.2rem 0.7rem 0.2rem;background:#fffbe8;border-radius:8px;margin-bottom:0.7rem;">${descripcion}</div>
                    <div class="mb-2" style="font-size:1.15rem;color:#27ae60;font-weight:bold;">
                        ${precioOferta}<span class="badge badge-success product-price" style="font-size:1.1rem;">${precio}</span>
                    </div>
                    <div class="mb-2" style="font-size:1.05rem;color:#181818;">
                        ${peso ? `<span>Peso: ${peso}</span>` : ''}
                        ${talla ? `<span>Talla: ${talla}</span>` : ''}
                        ${sabor ? `<span>Sabor: ${sabor}</span>` : ''}
                        ${marca ? `<span>Marca: ${marca}</span>` : ''}
                    </div>
                    <div class="mb-2" style="font-size:1.05rem;color:#181818;">
                        <span>${envio}</span>
                    </div>
                    <div class="mb-2" style="font-size:1.05rem;color:#181818;">
                        <span>${stock}</span>
                    </div>
                    <button class="btn btn-dark mt-3 agregar-carrito" style="color:#FFD700; border-radius:8px;">Agregar al carrito 🛒</button>
                    <button class="btn btn-favorito" style="background:#FFD700;color:#181818;border-radius:8px;margin-left:8px;"><i class="fa fa-heart"></i></button>
                </div>
            </div>
        </div>
        `;
    });
    activarBotonesCarrito();
    activarBotonesFavorito();
}

// Buscador con autocompletar
function prepararBuscador() {
    const buscador = document.getElementById('buscador-tienda');
    const autocompletar = document.getElementById('autocompletar-tienda');
    buscador.oninput = function() {
        let val = buscador.value.trim().toLowerCase();
        if (!val) {
            autocompletar.innerHTML = '';
            mostrarProductos();
            return;
        }
        let sugerencias = productos.filter(p =>
            p.nombre.toLowerCase().includes(val) ||
            (p.sku && p.sku.toLowerCase().includes(val)) ||
            (p.categoria && p.categoria.toLowerCase().includes(val))
        );
        autocompletar.innerHTML = sugerencias.slice(0,6).map(p => `<div class='autocompletar-item' style='background:#fffbe8;border-bottom:1px solid #FFD700;padding:0.6rem 1rem;cursor:pointer;'>${p.nombre}</div>`).join('');
        autocompletar.querySelectorAll('.autocompletar-item').forEach((item, idx) => {
            item.onclick = function() {
                buscador.value = sugerencias[idx].nombre;
                autocompletar.innerHTML = '';
                mostrarProductos([sugerencias[idx]]);
            }
        });
        mostrarProductos(sugerencias);
    };
}

// Filtros profesionales (categoría, precio, etc.)
function prepararFiltros() {
    const filtros = document.getElementById('filtros-tienda');
    filtros.innerHTML = `
        <button class="btn btn-filtro-categoria" data-cat="todos" style="background:#FFD700;color:#181818;font-weight:bold;border-radius:14px;padding:0.7rem 1.3rem;margin:0 6px;">Todos</button>
        <button class="btn btn-filtro-categoria" data-cat="proteina" style="background:#fffbe8;color:#FFD700;font-weight:bold;border-radius:14px;padding:0.7rem 1.3rem;margin:0 6px;">Proteínas</button>
        <button class="btn btn-filtro-categoria" data-cat="ropa" style="background:#e8f7ff;color:#0070ba;font-weight:bold;border-radius:14px;padding:0.7rem 1.3rem;margin:0 6px;">Ropa</button>
        <button class="btn btn-filtro-categoria" data-cat="vitamina" style="background:#f8e8ff;color:#a700ba;font-weight:bold;border-radius:14px;padding:0.7rem 1.3rem;margin:0 6px;">Vitaminas</button>
        <button class="btn btn-filtro-categoria" data-cat="accesorio" style="background:#fffbe8;color:#181818;font-weight:bold;border-radius:14px;padding:0.7rem 1.3rem;margin:0 6px;">Accesorios</button>
    `;
    filtros.querySelectorAll('.btn-filtro-categoria').forEach(btn => {
        btn.onclick = function() {
            filtros.querySelectorAll('.btn-filtro-categoria').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            let cat = btn.getAttribute('data-cat');
            let filtrados = productos.filter(p => {
                if (cat === 'todos') return true;
                if (cat === 'proteina') return p.categoria && p.categoria.toLowerCase().includes('proteina');
                if (cat === 'ropa') return p.categoria && p.categoria.toLowerCase().includes('ropa');
                if (cat === 'vitamina') return p.categoria && p.categoria.toLowerCase().includes('vitamina');
                if (cat === 'accesorio') return p.categoria && p.categoria.toLowerCase().includes('accesorio');
                return true;
            });
            mostrarProductos(filtrados);
        };
    });
    // Activar por defecto
    filtros.querySelector('.btn-filtro-categoria').classList.add('active');
}

// Botones de carrito
function activarBotonesCarrito() {
    document.querySelectorAll('.producto-card .agregar-carrito').forEach(btn => {
        btn.onclick = function() {
            const card = btn.closest('.producto-card');
            const nombre = card.querySelector('.card-title').textContent.trim();
            const precio = card.querySelector('.badge-success').textContent.trim();
            const img = card.querySelector('img').getAttribute('src');
            const descripcion = card.querySelector('.card-text').textContent.trim();
            agregarAlCarrito(nombre, precio, img, descripcion);
            btn.textContent = '¡Agregado!';
            btn.style.background = '#FFD700';
            btn.style.color = '#181818';
            btn.style.transform = 'scale(1.08)';
            setTimeout(() => {
                btn.textContent = 'Agregar al carrito';
                btn.style.background = '';
                btn.style.color = '#FFD700';
                btn.style.transform = '';
            }, 1200);
        }
    });
    actualizarContadorCarrito();
}

function agregarAlCarrito(nombre, precio, img, descripcion) {
    // Si el producto ya está en el carrito, aumenta la cantidad
    let existente = carrito.find(p => p.nombre === nombre);
    if (existente) {
        existente.cantidad = (existente.cantidad || 1) + 1;
    } else {
        carrito.push({nombre, precio, img, descripcion, cantidad: 1});
    }
    actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
    document.getElementById('contador-carrito').textContent = carrito.length;
}

// Botones de favorito
function activarBotonesFavorito() {
    document.querySelectorAll('.producto-card .btn-favorito').forEach(btn => {
        btn.onclick = function() {
            const card = btn.closest('.producto-card');
            const nombre = card.querySelector('.card-title').textContent.trim();
            if (!favoritos.includes(nombre)) favoritos.push(nombre);
            btn.style.background = '#181818';
            btn.style.color = '#FFD700';
            setTimeout(() => {
                btn.style.background = '#FFD700';
                btn.style.color = '#181818';
            }, 900);
        }
    });
}

// Inicializar tienda
window.addEventListener('DOMContentLoaded', function() {
    cargarProductos();
    // Abrir modal de carrito al hacer clic en el ícono
    document.getElementById('icono-carrito').onclick = function() {
        mostrarCarritoModal();
        $('#modal-carrito').modal('show');
    };

    // Mostrar productos en el modal del carrito
    function mostrarCarritoModal() {
        const lista = document.getElementById('carrito-lista-productos');
        const resumen = document.getElementById('carrito-resumen');
        if (carrito.length === 0) {
            lista.innerHTML = '<p class="text-center" style="color:#888;font-size:1.15rem;">Tu carrito está vacío.</p>';
            if (resumen) resumen.textContent = '';
            return;
        }
        let total = 0;
        lista.innerHTML = '<h5 class="mb-3 font-weight-bold">Productos en tu carrito:</h5>';
        lista.innerHTML += '<div class="row">' + carrito.map((prod, i) => {
            let precioNum = parseFloat(prod.precio.replace(/[^\d\.]/g, '')) || 0;
            total += precioNum * (prod.cantidad || 1);
            return `<div class="col-md-6 mb-3">
                <div class="card shadow-sm" style="border-radius:12px;">
                    <div class="card-body d-flex align-items-center" style="gap:14px;">
                        <img src="${prod.img}" alt="${prod.nombre}" style="width:64px;height:64px;object-fit:cover;border-radius:8px;border:1px solid #FFD700;background:#fffbe8;box-shadow:0 2px 8px #FFD70022;">
                        <div style="flex:1;">
                            <div class="font-weight-bold" style="color:#181818;font-size:1.08rem;">${prod.nombre}</div>
                            <div style="color:#27ae60;font-size:1.05rem;">${prod.precio}</div>
                            <div style="color:#181818;font-size:0.98rem;">Cantidad: 
                                <button class="btn btn-sm btn-outline-secondary" onclick="window.cambiarCantidadCarrito(${i},-1)">-</button>
                                <b style="margin:0 8px;">${prod.cantidad || 1}</b>
                                <button class="btn btn-sm btn-outline-secondary" onclick="window.cambiarCantidadCarrito(${i},1)">+</button>
                            </div>
                        </div>
                        <button class="btn btn-danger btn-sm" onclick="window.eliminarDelCarrito(${i})"><i class="fa fa-trash"></i> Eliminar</button>
                    </div>
                </div>
            </div>`;
        }).join('') + '</div>';
    // Cambiar cantidad de producto en el carrito
    window.cambiarCantidadCarrito = function(idx, delta) {
        if (!carrito[idx]) return;
        carrito[idx].cantidad = Math.max(1, (carrito[idx].cantidad || 1) + delta);
        mostrarCarritoModal();
    };
        if (resumen) resumen.innerHTML = `<span>Total a pagar: <span style='color:#FFD700'>RD$ ${total.toFixed(2)}</span></span>`;
    }

    // Eliminar producto del carrito
    window.eliminarDelCarrito = function(idx) {
        carrito.splice(idx, 1);
        mostrarCarritoModal();
        actualizarContadorCarrito();
    };

    // Finalizar pedido por WhatsApp
    document.getElementById('btn-finalizar-pedido').onclick = function() {
        if (carrito.length === 0) {
            alert('El carrito está vacío. Agrega productos antes de hacer el pedido.');
            return;
        }
        const nombre = document.getElementById('nombre-cliente').value.trim();
        const telefono = document.getElementById('telefono-cliente').value.trim();
        const direccion = document.getElementById('direccion-cliente').value.trim();
        const nota = document.getElementById('nota-cliente').value.trim();
        if (!nombre || !telefono || !direccion) {
            alert('Por favor, completa todos los datos para hacer el pedido.');
            return;
        }
        let total = 0;
        let mensaje = `*¡Hola! Quiero hacer un pedido desde la tienda web.*%0A%0A*Datos del cliente:*%0A`;
        mensaje += `Nombre: ${nombre}%0A`;
        mensaje += `Teléfono: ${telefono}%0A`;
        mensaje += `Dirección: ${direccion}%0A`;
        if (nota) mensaje += `Nota: ${nota}%0A`;
        mensaje += `%0A*Productos:*%0A`;
        carrito.forEach((prod, i) => {
            let precioNum = parseFloat(prod.precio.replace(/[^\d\.]/g, '')) || 0;
            mensaje += `${i+1}. ${prod.nombre} | Precio: ${prod.precio} | Cantidad: ${prod.cantidad || 1} | Imagen: ${window.location.origin}/${prod.img}%0A`;
            total += precioNum * (prod.cantidad || 1);
        });
        mensaje += `%0A*Total de la compra: RD$ ${total.toFixed(2)}*`;
        let url = `https://wa.me/18293779331?text=${mensaje}`;
        window.open(url, '_blank');
        $('#modal-carrito').modal('hide');
    };
});

let productos = [];
let carrito = [];
let favoritos = [];

// Cargar productos desde el backend
function cargarProductos() {
    fetch('productos.json')
        .then(res => res.json())
        .then(data => {
            productos = data;
            mostrarProductos();
            prepararBuscador();
            prepararFiltros();
        });
}

// Mostrar productos en el grid
function mostrarProductos(filtrados = null) {
    const panel = document.getElementById('panel-productos');
    let lista = filtrados || productos;
    panel.innerHTML = '';
    if (lista.length === 0) {
        panel.innerHTML = `<div class='col-12 text-center'><p style='color:#888;font-size:1.15rem;'>No hay productos disponibles.</p></div>`;
        return;
    }
    lista.forEach(prod => {
        panel.innerHTML += `
        <div class="col-md-4 mb-4 d-flex justify-content-center">
            <div class="card shadow-sm producto-card" style="max-width:340px; border-radius:18px;">
                <img src="${prod.img}" alt="${prod.nombre}" class="card-img-top" style="height:220px; object-fit:contain; border-radius:18px 18px 0 0; background:#f8f8f8; display:block; margin:auto; box-shadow:0 2px 12px #FFD70033;">
                <div class="card-body text-center">
                    <h5 class="card-title font-weight-bold" style="color:#FFD700;">${prod.nombre}</h5>
                    <div class="card-text" style="color:#181818;white-space:normal;word-break:break-word;max-height:110px;overflow:auto;text-align:left;font-size:1.09rem;padding:0.5rem 0.2rem 0.7rem 0.2rem;background:#fffbe8;border-radius:8px;margin-bottom:0.7rem;">${prod.descripcion}</div>
                    <span class="badge badge-success" style="font-size:1.1rem;">${prod.precio}</span>
                    <button class="btn btn-dark mt-3 agregar-carrito" style="color:#FFD700; border-radius:8px;">Agregar al carrito</button>
                    <button class="btn btn-favorito" style="background:#FFD700;color:#181818;border-radius:8px;margin-left:8px;"><i class="fa fa-heart"></i></button>
                </div>
            </div>
        </div>
        `;
    });
    activarBotonesCarrito();
    activarBotonesFavorito();
}

// Buscador con autocompletar
function prepararBuscador() {
    const buscador = document.getElementById('buscador-tienda');
    const autocompletar = document.getElementById('autocompletar-tienda');
    buscador.oninput = function() {
        let val = buscador.value.trim().toLowerCase();
        if (!val) {
            autocompletar.innerHTML = '';
            mostrarProductos();
            return;
        }
        let sugerencias = productos.filter(p =>
            p.nombre.toLowerCase().includes(val) ||
            (p.sku && p.sku.toLowerCase().includes(val)) ||
            (p.categoria && p.categoria.toLowerCase().includes(val))
        );
        autocompletar.innerHTML = sugerencias.slice(0,6).map(p => `<div class='autocompletar-item' style='background:#fffbe8;border-bottom:1px solid #FFD700;padding:0.6rem 1rem;cursor:pointer;'>${p.nombre}</div>`).join('');
        autocompletar.querySelectorAll('.autocompletar-item').forEach((item, idx) => {
            item.onclick = function() {
                buscador.value = sugerencias[idx].nombre;
                autocompletar.innerHTML = '';
                mostrarProductos([sugerencias[idx]]);
            }
        });
        mostrarProductos(sugerencias);
    };
}

// Filtros profesionales (categoría, precio, etc.)
function prepararFiltros() {
    const filtros = document.getElementById('filtros-tienda');
    filtros.innerHTML = `
        <button class="btn btn-filtro-categoria" data-cat="todos" style="background:#FFD700;color:#181818;font-weight:bold;border-radius:14px;padding:0.7rem 1.3rem;margin:0 6px;">Todos</button>
        <button class="btn btn-filtro-categoria" data-cat="proteina" style="background:#fffbe8;color:#FFD700;font-weight:bold;border-radius:14px;padding:0.7rem 1.3rem;margin:0 6px;">Proteínas</button>
        <button class="btn btn-filtro-categoria" data-cat="ropa" style="background:#e8f7ff;color:#0070ba;font-weight:bold;border-radius:14px;padding:0.7rem 1.3rem;margin:0 6px;">Ropa</button>
        <button class="btn btn-filtro-categoria" data-cat="vitamina" style="background:#f8e8ff;color:#a700ba;font-weight:bold;border-radius:14px;padding:0.7rem 1.3rem;margin:0 6px;">Vitaminas</button>
        <button class="btn btn-filtro-categoria" data-cat="accesorio" style="background:#fffbe8;color:#181818;font-weight:bold;border-radius:14px;padding:0.7rem 1.3rem;margin:0 6px;">Accesorios</button>
    `;
    filtros.querySelectorAll('.btn-filtro-categoria').forEach(btn => {
        btn.onclick = function() {
            filtros.querySelectorAll('.btn-filtro-categoria').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            let cat = btn.getAttribute('data-cat');
            let filtrados = productos.filter(p => {
                if (cat === 'todos') return true;
                if (cat === 'proteina') return p.categoria && p.categoria.toLowerCase().includes('proteina');
                if (cat === 'ropa') return p.categoria && p.categoria.toLowerCase().includes('ropa');
                if (cat === 'vitamina') return p.categoria && p.categoria.toLowerCase().includes('vitamina');
                if (cat === 'accesorio') return p.categoria && p.categoria.toLowerCase().includes('accesorio');
                return true;
            });
            mostrarProductos(filtrados);
        };
    });
    // Activar por defecto
    filtros.querySelector('.btn-filtro-categoria').classList.add('active');
}

// Botones de carrito
function activarBotonesCarrito() {
    document.querySelectorAll('.producto-card .agregar-carrito').forEach(btn => {
        btn.onclick = function() {
            const card = btn.closest('.producto-card');
            const nombre = card.querySelector('.card-title').textContent.trim();
            const precio = card.querySelector('.badge-success').textContent.trim();
            const img = card.querySelector('img').getAttribute('src');
            const descripcion = card.querySelector('.card-text').textContent.trim();
            agregarAlCarrito(nombre, precio, img, descripcion);
            btn.textContent = '¡Agregado!';
            btn.style.background = '#FFD700';
            btn.style.color = '#181818';
            btn.style.transform = 'scale(1.08)';
            setTimeout(() => {
                btn.textContent = 'Agregar al carrito';
                btn.style.background = '';
                btn.style.color = '#FFD700';
                btn.style.transform = '';
            }, 1200);
        }
    });
    actualizarContadorCarrito();
}
function agregarAlCarrito(nombre, precio, img, descripcion) {
    carrito.push({nombre, precio, img, descripcion});
    actualizarContadorCarrito();
}
function actualizarContadorCarrito() {
    document.getElementById('contador-carrito').textContent = carrito.length;
}

// Botones de favorito
function activarBotonesFavorito() {
    document.querySelectorAll('.producto-card .btn-favorito').forEach(btn => {
        btn.onclick = function() {
            const card = btn.closest('.producto-card');
            const nombre = card.querySelector('.card-title').textContent.trim();
            if (!favoritos.includes(nombre)) favoritos.push(nombre);
            btn.style.background = '#181818';
            btn.style.color = '#FFD700';
            setTimeout(() => {
                btn.style.background = '#FFD700';
                btn.style.color = '#181818';
            }, 900);
        }
    });
}

// Inicializar tienda
window.addEventListener('DOMContentLoaded', function() {
    cargarProductos();
});
