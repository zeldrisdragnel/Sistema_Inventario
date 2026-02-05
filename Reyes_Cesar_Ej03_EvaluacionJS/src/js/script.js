
// 1. ESTRUCTURA DE ÁRBOL - Categorías jerárquicas con descuentos

let categoriasArbol = {
    nombre: 'Tienda',
    descuento: 0.03, // 3% descuento base general
    subcategorias: [
        {
            nombre: 'Muebles',
            descuento: 0.07, // 7% descuento adicional
            subcategorias: [
                {
                    nombre: 'Sillas',
                    descuento: 0.10, // 10% descuento adicional
                    subcategorias: [
                        {
                            nombre: 'Oficina',
                            descuento: 0.05, // 5% descuento adicional
                            subcategorias: []
                        },
                        {
                            nombre: 'Comedor',
                            descuento: 0.15, // 15% descuento adicional
                            subcategorias: []
                        }
                    ]
                },
                {
                    nombre: 'Mesas',
                    descuento: 0.08, // 8% descuento adicional
                    subcategorias: []
                },
                {
                    nombre: 'Escritorios',
                    descuento: 0.12, // 12% descuento adicional
                    subcategorias: []
                }
            ]
        },
        {
            nombre: 'Electrónica',
            descuento: 0.05, // 5% descuento adicional
            subcategorias: [
                {
                    nombre: 'Laptops',
                    descuento: 0.10, // 10% descuento adicional
                    subcategorias: [
                        {
                            nombre: 'Gaming',
                            descuento: 0.08, // 8% descuento adicional
                            subcategorias: []
                        },
                        {
                            nombre: 'Oficina',
                            descuento: 0.12, // 12% descuento adicional
                            subcategorias: []
                        }
                    ]
                },
                {
                    nombre: 'Smartphones',
                    descuento: 0.07, // 7% descuento adicional
                    subcategorias: [
                        {
                            nombre: 'Alta Gama',
                            descuento: 0.05, // 5% descuento adicional
                            subcategorias: []
                        },
                        {
                            nombre: 'Gama Media',
                            descuento: 0.15, // 15% descuento adicional
                            subcategorias: []
                        }
                    ]
                },
                {
                    nombre: 'Accesorios',
                    descuento: 0.20, // 20% descuento adicional
                    subcategorias: []
                }
            ]
        }
    ]
};

// 3. DEEP FREEZE - Función para congelar objetos de manera profunda
function deepFreeze(objeto) {
    // Obtener los nombres de las propiedades del objeto
    const propiedades = Object.getOwnPropertyNames(objeto);
    
    // Congelar las propiedades antes de congelar el objeto principal
    for (const prop of propiedades) {
        const valor = objeto[prop];
        
        // Si el valor es un objeto o función, aplicar recursividad
        if (valor && typeof valor === 'object') {
            deepFreeze(valor);
        }
    }
    
    // Congelar el objeto principal
    return Object.freeze(objeto);
}

// 2. RECURSIÓN - Función para buscar categoría y calcular descuentos acumulados
function buscarCategoriaRecursiva(arbol, nombreCategoria, descuentosAcumulados = []) {
    // Agregar el descuento de la categoría actual
    descuentosAcumulados.push(arbol.descuento);
    
    // Si encontramos la categoría buscada, retornar los descuentos
    if (arbol.nombre === nombreCategoria) {
        return descuentosAcumulados;
    }
    
    // Buscar recursivamente en las subcategorías
    for (const subcategoria of arbol.subcategorias) {
        const resultado = buscarCategoriaRecursiva(subcategoria, nombreCategoria, [...descuentosAcumulados]);
        if (resultado !== null) {
            return resultado;
        }
    }
    
    // Si no se encuentra en este camino, retornar null
    return null;
}

// Función para calcular el precio final con descuentos acumulativos
function calcularPrecioConDescuentos(precioBase, descuentos) {
    let precioFinal = precioBase;
    
    // Aplicar cada descuento de forma acumulativa
    for (const descuento of descuentos) {
        precioFinal = precioFinal * (1 - descuento);
    }
    
    return precioFinal;
}

// 4. CLASE PRODUCT con propiedad privada y getter
class Product {
    #costoBase; // Propiedad privada
    
    constructor(nombre, costoBase, categoria) {
        this.nombre = nombre;
        this.#costoBase = costoBase;
        this.categoria = categoria;
        this.descuentos = [];
        
        // Buscar descuentos de la categoría
        const descuentosEncontrados = buscarCategoriaRecursiva(categoriasArbol, categoria);
        if (descuentosEncontrados) {
            this.descuentos = descuentosEncontrados;
        }
    }
    
    // Getter para obtener el precio de venta (con descuentos aplicados)
    get precioVenta() {
        return calcularPrecioConDescuentos(this.#costoBase, this.descuentos);
    }
    
    // Getter para obtener el costo base (solo lectura)
    get costoBase() {
        return this.#costoBase;
    }
    
    // Método para obtener información completa del producto
    obtenerInfo() {
        const descuentoTotal = (1 - this.descuentos.reduce((acc, desc) => acc * (1 - desc), 1)) * 100;
        return {
            nombre: this.nombre,
            categoria: this.categoria,
            costoBase: this.costoBase,
            precioVenta: this.precioVenta,
            ahorro: this.costoBase - this.precioVenta,
            descuentoTotal: descuentoTotal.toFixed(2) + '%',
            descuentosAplicados: this.descuentos.length
        };
    }
}

// CATÁLOGO DE PRODUCTOS (se congelará profundamente)
let catalogoProductos = [
    // Productos de Electrónica
    new Product('Laptop ASUS ROG Strix', 1500, 'Gaming'),
    new Product('Laptop Dell XPS 13', 1200, 'Oficina'),
    new Product('iPhone 15 Pro', 1100, 'Alta Gama'),
    new Product('Samsung Galaxy A54', 450, 'Gama Media'),
    new Product('Mouse Logitech G502', 80, 'Accesorios'),
    new Product('Teclado Mecánico Corsair', 150, 'Accesorios'),
    new Product('Laptop HP Pavilion Gaming', 950, 'Gaming'),
    new Product('Google Pixel 8', 700, 'Alta Gama'),
    // Productos de Muebles
    new Product('Silla Ergonómica Secretlab', 450, 'Oficina'),
    new Product('Silla Gaming DXRacer', 380, 'Oficina'),
    new Product('Silla Comedor Moderna', 120, 'Comedor'),
    new Product('Set 6 Sillas Comedor Madera', 600, 'Comedor'),
    new Product('Mesa de Centro Glass', 250, 'Mesas'),
    new Product('Escritorio L-Shape Premium', 550, 'Escritorios'),
    new Product('Escritorio Standing Desk', 720, 'Escritorios')
];

// Función para buscar y modificar descuento de una categoría
function buscarYModificarCategoria(arbol, nombreCategoria, nuevoDescuento) {
    if (arbol.nombre === nombreCategoria) {
        arbol.descuento = nuevoDescuento;
        return true;
    }
    
    for (const subcategoria of arbol.subcategorias) {
        if (buscarYModificarCategoria(subcategoria, nombreCategoria, nuevoDescuento)) {
            return true;
        }
    }
    
    return false;
}

// Función para recalcular descuentos de todos los productos
function recalcularDescuentosProductos() {
    catalogoProductos = catalogoProductos.map(producto => {
        return new Product(producto.nombre, producto.costoBase, producto.categoria);
    });
}

// Función para obtener todas las categorías en una lista plana
function obtenerTodasCategorias(arbol, lista = []) {
    lista.push({
        nombre: arbol.nombre,
        descuento: arbol.descuento,
        nivel: 0
    });
    
    function recorrer(nodo, nivel = 0) {
        for (const subcategoria of nodo.subcategorias) {
            lista.push({
                nombre: subcategoria.nombre,
                descuento: subcategoria.descuento,
                nivel: nivel + 1
            });
            recorrer(subcategoria, nivel + 1);
        }
    }
    
    recorrer(arbol);
    return lista;
}

// Función para gestionar descuentos
function gestionarDescuentos() {
    const contenedor = document.getElementById('contenido');
    const categorias = obtenerTodasCategorias(categoriasArbol);
    
    let html = '<div class="gestion-descuentos">';
    html += '<h2>🏷️ Gestión de Descuentos por Categoría</h2>';
    html += '<p class="info-text">Modifica los porcentajes de descuento para cada categoría. Los cambios se aplicarán automáticamente a todos los productos.</p>';
    html += '<div class="descuentos-grid">';
    
    categorias.forEach((cat, index) => {
        const indent = cat.nivel * 30;
        const nivel = cat.nivel === 0 ? '🏪' : cat.nivel === 1 ? '📁' : '📂';
        html += `
            <div class="descuento-item" style="margin-left: ${indent}px;">
                <div class="categoria-info">
                    <span class="categoria-icono">${nivel}</span>
                    <span class="categoria-nombre">${cat.nombre}</span>
                </div>
                <div class="descuento-control">
                    <input type="number" 
                           id="descuento-${index}" 
                           class="descuento-input"
                           data-categoria="${cat.nombre}"
                           value="${(cat.descuento * 100).toFixed(0)}" 
                           min="0" 
                           max="100" 
                           step="1">
                    <span class="porcentaje">%</span>
                    <button onclick="aplicarDescuento('${cat.nombre}', ${index})" class="btn-small btn-apply">Aplicar</button>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    html += '<div class="acciones-descuentos">';
    html += '<button onclick="aplicarTodosDescuentos()" class="btn btn-success">💾 Guardar Todos los Cambios</button>';
    html += '<button onclick="mostrarInventario()" class="btn btn-info">← Volver al Inventario</button>';
    html += '</div>';
    html += '</div>';
    
    contenedor.innerHTML = html;
}

// Función para aplicar un descuento individual
function aplicarDescuento(nombreCategoria, index) {
    const input = document.getElementById(`descuento-${index}`);
    const nuevoDescuentoPorcentaje = parseFloat(input.value);
    
    if (isNaN(nuevoDescuentoPorcentaje) || nuevoDescuentoPorcentaje < 0 || nuevoDescuentoPorcentaje > 100) {
        alert(' Porcentaje inválido. Debe estar entre 0 y 100.');
        return;
    }
    
    const nuevoDescuento = nuevoDescuentoPorcentaje / 100;
    
    if (buscarYModificarCategoria(categoriasArbol, nombreCategoria, nuevoDescuento)) {
        recalcularDescuentosProductos();
        alert(` Descuento de "${nombreCategoria}" actualizado a ${nuevoDescuentoPorcentaje}%`);
        // Refrescar la vista
        gestionarDescuentos();
    } else {
        alert(' No se pudo encontrar la categoría');
    }
}

// Función para aplicar todos los descuentos a la vez
function aplicarTodosDescuentos() {
    const inputs = document.querySelectorAll('.descuento-input');
    let cambios = 0;
    
    inputs.forEach((input, index) => {
        const nombreCategoria = input.getAttribute('data-categoria');
        const nuevoDescuentoPorcentaje = parseFloat(input.value);
        
        if (!isNaN(nuevoDescuentoPorcentaje) && nuevoDescuentoPorcentaje >= 0 && nuevoDescuentoPorcentaje <= 100) {
            const nuevoDescuento = nuevoDescuentoPorcentaje / 100;
            if (buscarYModificarCategoria(categoriasArbol, nombreCategoria, nuevoDescuento)) {
                cambios++;
            }
        }
    });
    
    if (cambios > 0) {
        recalcularDescuentosProductos();
        alert(` ${cambios} descuentos actualizados correctamente`);
        gestionarDescuentos();
    } else {
        alert(' No se realizaron cambios');
    }
}

// Congelar el árbol de categorías para asegurar inmutabilidad (COMENTADO para permitir modificaciones)
// const categoriasCongeladas = deepFreeze(categoriasArbol);

// Función para mostrar el inventario
function mostrarInventario() {
    const contenedor = document.getElementById('contenido');
    let html = '<div class="inventario">';
    html += '<h2> Inventario de Productos</h2>';
    html += '<div class="productos-grid">';
    
    catalogoProductos.forEach((producto, index) => {
        const info = producto.obtenerInfo();
        html += `
            <div class="producto-card">
                <h3>${info.nombre}</h3>
                <p><strong>Categoría:</strong> ${info.categoria}</p>
                <p><strong>Costo Base:</strong> $${info.costoBase.toFixed(2)}</p>
                <p><strong>Precio de Venta:</strong> <span class="precio-venta">$${info.precioVenta.toFixed(2)}</span></p>
                <p><strong>Ahorro:</strong> <span class="ahorro">$${info.ahorro.toFixed(2)}</span></p>
                <p><strong>Descuento Total:</strong> ${info.descuentoTotal}</p>
                <p class="descuentos-aplicados">✓ ${info.descuentosAplicados} descuentos acumulados</p>
            </div>
        `;
    });
    
    html += '</div></div>';
    contenedor.innerHTML = html;
}

// Función para agregar un producto
function agregarProducto() {
    const nombre = prompt('Nombre del producto:');
    if (!nombre) return;
    
    const costo = parseFloat(prompt('Costo base del producto:'));
    if (isNaN(costo) || costo <= 0) {
        alert('❌ Costo inválido');
        return;
    }
    
    const categoriaMsg = 'Categoría disponibles:\n\n' +
                        'Muebles:\n' +
                        '  - Oficina (Sillas)\n' +
                        '  - Comedor (Sillas)\n' +
                        '  - Mesas\n' +
                        '  - Escritorios\n\n' +
                        'Electrónica:\n' +
                        '  - Gaming (Laptops)\n' +
                        '  - Oficina (Laptops)\n' +
                        '  - Alta Gama (Smartphones)\n' +
                        '  - Gama Media (Smartphones)\n' +
                        '  - Accesorios\n\n' +
                        'Ingrese la categoría exacta:';
    
    const categoria = prompt(categoriaMsg);
    
    try {
        const nuevoProducto = new Product(nombre, costo, categoria);
        catalogoProductos.push(nuevoProducto);
        alert('✅ Producto agregado exitosamente');
        mostrarInventario();
    } catch (error) {
        alert('❌ Error al agregar producto: ' + error.message);
    }
}

// Función para actualizar un producto
function actualizarProducto() {
    const nombre = prompt('Nombre del producto a actualizar:');
    const index = catalogoProductos.findIndex(p => p.nombre === nombre);
    
    if (index === -1) {
        alert(' Producto no encontrado');
        return;
    }
    
    const nuevoCosto = parseFloat(prompt('Nuevo costo base:'));
    if (isNaN(nuevoCosto) || nuevoCosto <= 0) {
        alert('Costo inválido');
        return;
    }
    
    const nuevaCategoria = prompt('Nueva categoría:');
    
    // Crear nuevo producto (no podemos modificar el costo privado directamente)
    catalogoProductos[index] = new Product(nombre, nuevoCosto, nuevaCategoria);
    alert('Producto actualizado exitosamente');
    mostrarInventario();
}

// Función para eliminar un producto
function eliminarProducto() {
    const nombre = prompt('Nombre del producto a eliminar:');
    const index = catalogoProductos.findIndex(p => p.nombre === nombre);
    
    if (index === -1) {
        alert(' Producto no encontrado');
        return;
    }
    
    catalogoProductos.splice(index, 1);
    alert(' Producto eliminado exitosamente');
    mostrarInventario();
}

// Función para analizar el inventario
function analizarStock() {
    const contenedor = document.getElementById('contenido');
    
    // Calcular estadísticas
    const totalProductos = catalogoProductos.length;
    const valorTotalBase = catalogoProductos.reduce((sum, p) => sum + p.costoBase, 0);
    const valorTotalVenta = catalogoProductos.reduce((sum, p) => sum + p.precioVenta, 0);
    const ahorroTotal = valorTotalBase - valorTotalVenta;
    const promedioDescuento = (ahorroTotal / valorTotalBase * 100);
    
    // Agrupar por categoría
    const porCategoria = {};
    catalogoProductos.forEach(p => {
        if (!porCategoria[p.categoria]) {
            porCategoria[p.categoria] = {
                cantidad: 0,
                valorBase: 0,
                valorVenta: 0
            };
        }
        porCategoria[p.categoria].cantidad++;
        porCategoria[p.categoria].valorBase += p.costoBase;
        porCategoria[p.categoria].valorVenta += p.precioVenta;
    });
    
    let html = '<div class="analisis">';
    html += '<h2> Análisis de Stock</h2>';
    html += '<div class="estadisticas">';
    html += `<div class="stat-card">
                <h3>Total Productos</h3>
                <p class="stat-value">${totalProductos}</p>
             </div>`;
    html += `<div class="stat-card">
                <h3>Valor Total Base</h3>
                <p class="stat-value">$${valorTotalBase.toFixed(2)}</p>
             </div>`;
    html += `<div class="stat-card">
                <h3>Valor Total Venta</h3>
                <p class="stat-value">$${valorTotalVenta.toFixed(2)}</p>
             </div>`;
    html += `<div class="stat-card">
                <h3>Ahorro Total</h3>
                <p class="stat-value ahorro">$${ahorroTotal.toFixed(2)}</p>
             </div>`;
    html += `<div class="stat-card">
                <h3>Descuento Promedio</h3>
                <p class="stat-value">${promedioDescuento.toFixed(2)}%</p>
             </div>`;
    html += '</div>';
    
    html += '<h3>Por Categoría</h3>';
    html += '<div class="categorias-grid">';
    for (const [categoria, datos] of Object.entries(porCategoria)) {
        const ahorro = datos.valorBase - datos.valorVenta;
        html += `
            <div class="categoria-card">
                <h4>${categoria}</h4>
                <p>Productos: ${datos.cantidad}</p>
                <p>Valor Base: $${datos.valorBase.toFixed(2)}</p>
                <p>Valor Venta: $${datos.valorVenta.toFixed(2)}</p>
                <p>Ahorro: <span class="ahorro">$${ahorro.toFixed(2)}</span></p>
            </div>
        `;
    }
    html += '</div>';
    html += '</div>';
    
    contenedor.innerHTML = html;
}

// Función para mostrar la estructura de categorías
function mostrarEstructuraCategorias(nodo, nivel = 0) {
    let html = '';
    const indent = '&nbsp;&nbsp;&nbsp;&nbsp;'.repeat(nivel);
    const emoji = nivel === 0 ? '' : nivel === 1 ? '' : '';
    
    html += `<div class="categoria-item" style="margin-left: ${nivel * 20}px;">
                ${emoji} <strong>${nodo.nombre}</strong> - Descuento: ${(nodo.descuento * 100).toFixed(0)}%
             </div>`;
    
    for (const subcategoria of nodo.subcategorias) {
        html += mostrarEstructuraCategorias(subcategoria, nivel + 1);
    }
    
    return html;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar inventario inicial
    mostrarInventario();
    
    // Botones
    document.getElementById('btn-view-inventory').addEventListener('click', mostrarInventario);
    document.getElementById('btn-add-item').addEventListener('click', agregarProducto);
    document.getElementById('btn-update-item').addEventListener('click', actualizarProducto);
    document.getElementById('btn-delete-item').addEventListener('click', eliminarProducto);
    document.getElementById('btn-analyze-stock').addEventListener('click', analizarStock);
    document.getElementById('btn-manage-discounts').addEventListener('click', gestionarDescuentos);
    
    // Información del sistema
    console.log('Sistema de Gestión de Inventario Dinámico');
    console.log('Catálogo de productos cargado:', catalogoProductos.length, 'productos');
    console.log('Descuentos modificables desde la interfaz');
});

