// =============================================
// CARRITO DE COMPRAS
// =============================================
let carrito = [];

// =============================================
// AGREGAR SERVICIO AL CARRITO
// =============================================
function agregarAlCarrito(btn, categoria, servicio, precio) {
    // Verificar si ya está en el carrito
    const existe = carrito.find(item => item.servicio === servicio && item.categoria === categoria);
    if (existe) {
        alert(`⚠️ "${servicio}" ya está en tu carrito.`);
        return;
    }

    // Agregar al carrito
    carrito.push({ categoria, servicio, precio });
    actualizarCarrito();

    // Feedback visual en el botón
    btn.textContent = '✅ Agregado';
    btn.style.background = '#22c55e';

    setTimeout(() => {
        // Si el servicio sigue en el carrito, mantener el texto
        if (!carrito.find(item => item.servicio === servicio && item.categoria === categoria)) {
            btn.textContent = '➕ Agregar';
            btn.style.background = '';
        }
    }, 3000);

    // Mostrar el carrito flotante
    document.getElementById('cartFloat').classList.remove('hidden');
}

// =============================================
// ACTUALIZAR CARRITO
// =============================================
function actualizarCarrito() {
    const count = document.getElementById('cartCount');
    count.textContent = carrito.length;
    
    if (carrito.length > 0) {
        document.getElementById('cartFloat').classList.remove('hidden');
    } else {
        document.getElementById('cartFloat').classList.add('hidden');
    }
    
    renderizarCarrito();
}

// =============================================
// RENDERIZAR CARRITO EN EL MODAL
// =============================================
function renderizarCarrito() {
    const container = document.getElementById('cartItems');
    
    if (carrito.length === 0) {
        container.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <p>Tu carrito está vacío</p>
                <p style="font-size:0.85rem; color:#64748b;">Selecciona servicios para agregarlos</p>
            </div>
        `;
        document.getElementById('cartTotal').textContent = '$0';
        return;
    }

    let html = '';
    let total = 0;
    
    carrito.forEach((item, index) => {
        total += item.precio;
        html += `
            <div class="cart-item">
                <div class="item-info">
                    <span class="item-name">${item.servicio}</span>
                    <span class="item-category">${item.categoria}</span>
                </div>
                <div style="display:flex; align-items:center; gap:0.8rem;">
                    <span class="item-price">$${item.precio.toLocaleString()}</span>
                    <button class="remove-btn" onclick="eliminarDelCarrito(${index})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    document.getElementById('cartTotal').textContent = `$${total.toLocaleString()}`;
}

// =============================================
// ELIMINAR DEL CARRITO
// =============================================
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
    
    if (carrito.length === 0) {
        document.getElementById('cartFloat').classList.add('hidden');
    }
}

// =============================================
// ABRIR / CERRAR CARRITO
// =============================================
function abrirCarrito() {
    document.getElementById('modalCarrito').classList.add('active');
    document.body.style.overflow = 'hidden';
    renderizarCarrito();
}

function cerrarCarrito() {
    document.getElementById('modalCarrito').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Cerrar al hacer clic fuera
document.getElementById('modalCarrito').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) cerrarCarrito();
});

// =============================================
// DESPLEGAR MENÚ DE SERVICIOS
// =============================================
document.querySelectorAll('.service-card').forEach(card => {
    const dropdown = card.querySelector('.dropdown-menu');
    const arrow = card.querySelector('.arrow-indicator');
    
    card.addEventListener('click', (e) => {
        // Si el clic fue en el botón "Agregar", no desplegar
        if (e.target.classList.contains('select-btn')) return;
        
        dropdown.classList.toggle('open');
        arrow.classList.toggle('rotated');
    });
});

// =============================================
// ENVIAR COTIZACIÓN POR WHATSAPP
// =============================================
function enviarCotizacion() {
    // Verificar que haya servicios
    if (carrito.length === 0) {
        alert('⚠️ Agrega al menos un servicio a tu carrito.');
        return;
    }

    // Obtener datos del formulario
    const nombre = document.getElementById('cotizacionNombre').value.trim();
    const telefono = document.getElementById('cotizacionTelefono').value.trim();
    const email = document.getElementById('cotizacionEmail').value.trim() || 'No especificado';
    const detalles = document.getElementById('cotizacionDetalles').value.trim() || 'Sin detalles adicionales';

    // Validar campos obligatorios
    if (!nombre || !telefono) {
        alert('⚠️ Completa tu nombre y teléfono.');
        return;
    }

    // Construir lista de servicios
    let listaServicios = '';
    let total = 0;
    carrito.forEach((item, index) => {
        listaServicios += `${index + 1}. ${item.categoria} → ${item.servicio} - $${item.precio.toLocaleString()}\n`;
        total += item.precio;
    });

    // Construir mensaje para WhatsApp
    const mensaje = `📋 *NUEVA COTIZACIÓN* 📋

👤 *Cliente:* ${nombre}
📱 *Teléfono:* ${telefono}
✉️ *Email:* ${email}

🛒 *Servicios seleccionados:*
${listaServicios}

💰 *Total estimado:* $${total.toLocaleString()}

📝 *Detalles adicionales:*
${detalles}`;

    // Abrir WhatsApp con el mensaje
    const url = `https://wa.me/1659229363?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');

    // Cambiar el botón
    const btn = document.querySelector('#cotizacionForm .btn-submit');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Enviado ✅';
    btn.style.background = '#22c55e';
    btn.disabled = true;

    // Limpiar todo después de 3 segundos
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.disabled = false;
        cerrarCarrito();
        carrito = [];
        actualizarCarrito();
        document.getElementById('cartFloat').classList.add('hidden');
        document.getElementById('cotizacionForm').reset();
        alert('✅ ¡Cotización enviada!\n\nRevisa tu WhatsApp, el mensaje ya está listo para enviar.');
    }, 3000);
}

// =============================================
// FORMULARIO DE CONTACTO
// =============================================
function handleSubmit(event) {
    event.preventDefault();
    
    const btn = event.target.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    setTimeout(() => {
        alert('¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.');
        event.target.reset();
        btn.textContent = original;
        btn.disabled = false;
    }, 1500);
}

// =============================================
// MENÚ HAMBURGUESA (MÓVIL)
// =============================================
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// Cerrar menú al hacer clic fuera
document.addEventListener('click', (e) => {
    if (navMenu && navMenu.classList.contains('active')) {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    }
});

// =============================================
// INICIALIZAR CARRITO
// =============================================
actualizarCarrito();
