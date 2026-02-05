// Arreglo de objetos agenda con contactos iniciales
let agenda = [
    {
        nombre: "Carlos Martínez",
        telefono: "2234-5678",
        email: "carlos@example.com"
    },
    {
        nombre: "Ana López",
        telefono: "2345-6789",
        email: "ana@example.com"
    },
    {
        nombre: "Roberto García",
        telefono: "2456-7890",
        email: "roberto@example.com"
    },
    {
        nombre: "María Fernández",
        telefono: "2567-8901",
        email: "maria@example.com"
    },
    {
        nombre: "Lucía Sánchez",
        telefono: "2678-9012",
        email: "lucia@example.com"
    },
    { 
        nombre: "Jorge Ramírez",
        telefono: "2789-0123",
        email: "jorge@example.com"
    },
    {
        nombre: "Sofía Torres",
        telefono: "2890-1234",
        email: "sofia@example.com"
    },
    {
        nombre: "Miguel Díaz",
        telefono: "2901-2345",
        email: "miguel@example.com"
    },
    {
        nombre: "Elena Ruiz",
        telefono: "3012-3456",
        email: "elena@example.com"
    },
    {
        nombre: "Andrés Gómez",
        telefono: "3123-4567",
        email: "andres@example.com"
    }
];

// Función para actualizar el contenido del div
function actualizarContenido(tipo) {
    const contenidoDiv = document.getElementById("contenido");
    
    switch(tipo) {
        case "lista":
            mostrarContactos();
            break;
        case "agregar":
            agregarContacto();
            break;
        case "analizar":
            analizarMensaje();
            break;
        case "eliminar":
            eliminarContacto();
            break;
        case "modificar":
            modificarContacto();
            break;
        default:
            contenidoDiv.innerHTML = "<p>Selecciona una opción</p>";
    }
}

// Función para mostrar la lista de contactos
function mostrarContactos() {
    const contenidoDiv = document.getElementById("contenido");
    
    // Ordenar agenda alfabéticamente por nombre
    const agendaOrdenada = [...agenda].sort((a, b) => 
        a.nombre.localeCompare(b.nombre)
    );
    
    // Mostrar en consola
    console.log("=== LISTA DE CONTACTOS ===");
    agendaOrdenada.forEach((contacto, index) => {
        console.log(`${index + 1}. ${contacto.nombre} - Tel: ${contacto.telefono} - Email: ${contacto.email}`);
    });
    
    // Crear HTML para mostrar en el div
    let html = "<h2> Lista de Contactos</h2>";
    html += "<ol>";
    
    agendaOrdenada.forEach(contacto => {
        html += `<li>
            <span class="nombre-contacto">${contacto.nombre}</span><br>
             Teléfono: ${contacto.telefono}<br>
             Email: ${contacto.email}
        </li>`;
    });
    
    html += "</ol>";
    contenidoDiv.innerHTML = html;
}

// Función para agregar un contacto
function agregarContacto() {
    const contenidoDiv = document.getElementById("contenido");
    
    // Pedir datos con prompt
    const nombre = prompt("Ingrese el nombre del contacto:");
    
    // Validar que se ingresó un nombre
    if (!nombre || nombre.trim() === "") {
        contenidoDiv.innerHTML = "<p class='contacto-agregado'> Operación cancelada: No se ingresó un nombre válido</p>";
        return;
    }
    
    const telefono = prompt("Ingrese el teléfono del contacto:");
    if (!telefono || telefono.trim() === "") {
        contenidoDiv.innerHTML = "<p class='contacto-agregado'> Operación cancelada: No se ingresó un teléfono válido</p>";
        return;
    }
    
    const email = prompt("Ingrese el email del contacto:");
    if (!email || email.trim() === "") {
        contenidoDiv.innerHTML = "<p class='contacto-agregado'> Operación cancelada: No se ingresó un email válido</p>";
        return;
    }
    
    // Crear nuevo contacto
    const nuevoContacto = {
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        email: email.trim()
    };
    
    // Agregar al arreglo
    agenda.push(nuevoContacto);
    
    // Mostrar en consola
    console.log("=== CONTACTO AGREGADO ===");
    console.log(nuevoContacto);
    console.log("=== AGENDA ACTUALIZADA ===");
    console.log(agenda);
    
    // Mostrar mensaje en el div
    contenidoDiv.innerHTML = `
        <div class="contacto-agregado">
            <h2> ¡Contacto Agregado Exitosamente!</h2>
            <p style="margin-top: 15px;">
                <strong>Nombre:</strong> ${nuevoContacto.nombre}<br>
                <strong>Teléfono:</strong> ${nuevoContacto.telefono}<br>
                <strong>Email:</strong> ${nuevoContacto.email}
            </p>
            <p style="margin-top: 15px; font-size: 14px;">
                Total de contactos en la agenda: <strong>${agenda.length}</strong>
            </p>
        </div>
    `;
}

// Función para analizar un mensaje
function analizarMensaje() {
    const contenidoDiv = document.getElementById("contenido");
    
    // Pedir frase con prompt
    const frase = prompt("Ingrese una frase para analizar:");
    
    // Validar que se ingresó una frase
    if (!frase || frase.trim() === "") {
        contenidoDiv.innerHTML = "<p class='mensaje-analizado'> No se ingresó ninguna frase para analizar</p>";
        return;
    }
    
    // Contar palabras (separadas por espacios)
    const palabras = frase.trim().split(/\s+/);
    const cantidadPalabras = palabras.length;
    
    // Contar letras (sin espacios)
    const cantidadLetras = frase.replace(/\s+/g, '').length;
    
    // Mostrar en consola
    console.log("=== ANÁLISIS DE MENSAJE ===");
    console.log("Mensaje:", frase);
    console.log("Cantidad de palabras:", cantidadPalabras);
    console.log("Cantidad de letras:", cantidadLetras);
    
    // Mostrar en el div
    contenidoDiv.innerHTML = `
        <div class="mensaje-analizado">
            <div class="titulo"> Mensaje Analizado</div>
            <div class="dato">
                <strong>Mensaje:</strong> "${frase}"
            </div>
            <div class="dato">
                <strong>Cantidad de palabras:</strong> ${cantidadPalabras}
            </div>
            <div class="dato">
                <strong>Cantidad de letras (sin espacios):</strong> ${cantidadLetras}
            </div>
        </div>
    `;

    


    }

// Función para eliminar un contacto
function eliminarContacto() {
    const contenidoDiv = document.getElementById("contenido");
    
    // Pedir el nombre del contacto a eliminar
    const nombreEliminar = prompt("Ingrese el nombre del contacto que desea eliminar:");
    
    // Validar que se ingresó un nombre
    if (!nombreEliminar || nombreEliminar.trim() === "") {
        contenidoDiv.innerHTML = "<p class='contacto-eliminado'> Operación cancelada: No se ingresó un nombre válido</p>";
        return;
    }
    
    // Buscar el contacto en la agenda
    const index = agenda.findIndex(contacto => 
        contacto.nombre.toLowerCase() === nombreEliminar.trim().toLowerCase()
    );
    
    if (index !== -1) {
        // Eliminar el contacto
        const contactoEliminado = agenda.splice(index, 1)[0];
        
        // Mostrar en consola
        console.log("=== CONTACTO ELIMINADO ===");
        console.log(contactoEliminado);
        console.log("=== AGENDA ACTUALIZADA ===");
        console.log(agenda);
        
        // Mostrar mensaje de éxito
        contenidoDiv.innerHTML = `
            <div class="contacto-eliminado">
                <h2> ¡Contacto Eliminado Exitosamente!</h2>
                <p style="margin-top: 15px;">
                    <strong>Nombre:</strong> ${contactoEliminado.nombre}<br>
                    <strong>Teléfono:</strong> ${contactoEliminado.telefono}<br>
                    <strong>Email:</strong> ${contactoEliminado.email}
                </p>
                <p style="margin-top: 15px; font-size: 14px;">
                    Total de contactos en la agenda: <strong>${agenda.length}</strong>
                </p>
            </div>
        `;
    } else {
        // Mostrar mensaje de error
        contenidoDiv.innerHTML = `
            <p class='contacto-eliminado'>
                 Error: No se encontró ningún contacto con el nombre "${nombreEliminar}"
            </p>
        `;
    }
}

// Funcion para modificar contacto 
function modificarContacto() {
    const contenidoDiv = document.getElementById("contenido");

    // Pedir el nombre del contacto a modificar
    const nombreModificar = prompt("Ingrese el nombre del contacto que desea modificar:");
    
    // Validar que se ingresó un nombre
    if (!nombreModificar || nombreModificar.trim() === "") {
        contenidoDiv.innerHTML = "<p class='contacto-modificado'> Operación cancelada: No se ingresó un nombre válido</p>";
        return;
    }
    // Buscar el contacto en la agenda
    const index = agenda.findIndex(contacto => 
        contacto.nombre.toLowerCase() === nombreModificar.trim().toLowerCase()
    );
    
    if (index !== -1) {
        // Pedir nuevos datos (mostrando los valores actuales)
        const nuevoNombre = prompt("Ingrese el nuevo nombre del contacto:", agenda[index].nombre);
        const nuevoTelefono = prompt("Ingrese el nuevo teléfono del contacto:", agenda[index].telefono);
        const nuevoEmail = prompt("Ingrese el nuevo email del contacto:", agenda[index].email);
        // Actualizar el contacto (mantener valor anterior si se cancela o se deja vacío)
        agenda[index].nombre = (nuevoNombre && nuevoNombre.trim()) || agenda[index].nombre;
        agenda[index].telefono = (nuevoTelefono && nuevoTelefono.trim()) || agenda[index].telefono;
        agenda[index].email = (nuevoEmail && nuevoEmail.trim()) || agenda[index].email;
        
        // Mostrar en consola
        console.log("=== CONTACTO MODIFICADO ===");
        console.log(agenda[index]);
        console.log("=== AGENDA ACTUALIZADA ===");
        console.log(agenda);
        // Mostrar mensaje de éxito
        contenidoDiv.innerHTML = `
            <div class="contacto-modificado">
                <h2> ¡Contacto Modificado Exitosamente!</h2>
                <p style="margin-top: 15px;">
                    <strong>Nombre:</strong> ${agenda[index].nombre}<br>
                    <strong>Teléfono:</strong> ${agenda[index].telefono}<br>
                    <strong>Email:</strong> ${agenda[index].email}
                </p>
                <p style="margin-top: 15px; font-size: 14px;">
                    Total de contactos en la agenda: <strong>${agenda.length}</strong>
                </p>
            </div>
        `;
    } else {
        // Mostrar mensaje de error
        contenidoDiv.innerHTML = `
            <p class='contacto-modificado'>
                 Error: No se encontró ningún contacto con el nombre "${nombreModificar}"
            </p>
        `;
    }
}




// Event Listeners para los botones
document.getElementById("btn-lista").addEventListener("click", function() {
    actualizarContenido("lista");
});

document.getElementById("btn-agregar").addEventListener("click", function() {
    actualizarContenido("agregar");
});

document.getElementById("btn-analizar").addEventListener("click", function() {
    actualizarContenido("analizar");
});

document.getElementById("btn-eliminar").addEventListener("click", function() {
    actualizarContenido("eliminar");
});

document.getElementById("btn-modificar").addEventListener("click", function() {
    actualizarContenido("modificar");
});