// Módulo readline para interactuar con el usuario en consola
const readline = require('readline');

// Crear interfaz para leer entrada del usuario
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * Función que invierte una palabra y la convierte a mayúsculas
 * @param {string} palabra - La palabra a invertir
 * @returns {string} - La palabra invertida en mayúsculas
 */
function invertirPalabra(palabra) {
    // Convertir la palabra en un array, invertir el orden y unir de nuevo
    const palabraInvertida = palabra.split('').reverse().join('');
    // Convertir a mayúsculas y retornar
    return palabraInvertida.toUpperCase();
}

/**
 * Función que cuenta las consonantes en una palabra
 * @param {string} palabra - La palabra a analizar
 * @returns {number} - Cantidad de consonantes
 */
function contarConsonantes(palabra) {
    // Definir las vocales (mayúsculas y minúsculas)
    const vocales = 'aeiouAEIOUáéíóúÁÉÍÓÚ';
    let contador = 0;
    
    // Recorrer cada letra de la palabra
    for (let i = 0; i < palabra.length; i++) {
        const letra = palabra[i];
        // Si es una letra del alfabeto y NO es una vocal, es una consonante
        if (/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(letra) && !vocales.includes(letra)) {
            contador++;
        }
    }
    
    return contador;
}

/**
 * Función que imprime los números pares desde 1 hasta el número dado
 * @param {number} numero - El número límite
 */
function numerosPares(numero) {
    console.log(`\nNúmeros pares desde 1 hasta ${numero}:`);
    
    // Recorrer desde 1 hasta el número ingresado
    for (let i = 1; i <= numero; i++) {
        // Si el número es divisible entre 2, es par
        if (i % 2 === 0) {
            console.log(i);
        }
    }
}

/**
 * Función que evalúa si un número es divisible entre 3
 * @param {numero} numero - El número a evaluar
 */
function evaluarDivisible(numero) {
    console.log('\nEvaluación de divisibilidad por 3:');
    
    // Si el residuo de dividir entre 3 es 0, es divisible
    if (numero % 3 === 0) {
        const resultado = numero / 3;
        console.log(`Divisible entre 3. Resultado: ${numero} / 3 = ${resultado}`);
    } else {
        console.log('No divisible entre 3');
    }
}

/**
 * Función auxiliar que envuelve rl.question en una Promesa
 * @param {string} texto - El texto a mostrar al usuario
 * @returns {Promise<string>} - La respuesta ingresada por el usuario
 */
function preguntar(texto) {
    return new Promise((resolve) => {
        rl.question(texto, (respuesta) => {
            resolve(respuesta);
        });
    });
}

/**
 * Función principal que orquesta todo el flujo del programa
 */
async function main() {
    console.log('=== EJERCICIO DE ANÁLISIS DE TEXTO Y NÚMEROS ===\n');

    // Pedir la palabra al usuario
    const palabra = await preguntar('Ingrese una palabra: ');

    // Pedir el número al usuario
    const numeroStr = await preguntar('Ingrese un número entero: ');

    // Convertir el número de string a entero
    const numero = parseInt(numeroStr);

    // Validar que sea un número válido
    if (isNaN(numero)) {
        console.log('Error: Debe ingresar un número válido');
        rl.close();
        return;
    }

    console.log('\n--- RESULTADOS ---');

    // 1. Mostrar la palabra invertida en mayúsculas
    const palabraInvertida = invertirPalabra(palabra);
    console.log(`\nPalabra invertida en mayúsculas: ${palabraInvertida}`);

    // 2. Contar y mostrar las consonantes
    const cantidadConsonantes = contarConsonantes(palabra);
    console.log(`Cantidad de consonantes en "${palabra}": ${cantidadConsonantes}`);

    // 3. Mostrar números pares hasta el número ingresado
    numerosPares(numero);

    // 4. Evaluar si el número es divisible entre 3
    evaluarDivisible(numero);

    console.log('\n=== FIN DEL PROGRAMA ===');

    // Cerrar la interfaz de readline
    rl.close();

  
}

// Llamar a la función principal para iniciar el programa
main().catch((error) => {
    console.error('Se produjo un error inesperado:', error);
    rl.close();
});
    


// Llamar a la función principal para iniciar el programa
main();

// ejecutar en consola:  node Ejercicio1.js



