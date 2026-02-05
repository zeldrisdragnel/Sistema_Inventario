/**
 * Demo del sistema de procesamiento de transacciones bancarias
 * Simula 20 transacciones con diferentes comportamientos
 */

const { TransactionProcessor } = require('./transaction-processor');

/**
 * Simula una transacción bancaria con posibles fallos aleatorios
 */
function createTransaction(id, amount, shouldFail = false, failAttempts = 0) {
  let attempts = 0;

  return {
    id: `TXN-${String(id).padStart(3, '0')}`,
    fn: async () => {
      // Simular tiempo de procesamiento (entre 100ms y 1000ms)
      const processingTime = Math.random() * 900 + 100;
      await new Promise(resolve => setTimeout(resolve, processingTime));

      // Simular fallos si es necesario
      if (shouldFail && attempts < failAttempts) {
        attempts++;
        throw new Error(`Error temporal en transacción ${id} (intento ${attempts})`);
      }

      // Transacción exitosa
      return {
        transactionId: `TXN-${String(id).padStart(3, '0')}`,
        amount: amount,
        status: 'COMPLETED',
        timestamp: new Date().toISOString(),
        processingTime: Math.round(processingTime)
      };
    }
  };
}

/**
 * Genera un arreglo de 20 transacciones bancarias simuladas
 */
function generateTransactions() {
  const transactions = [];

  // Transacciones 1-10: Exitosas sin problemas
  for (let i = 1; i <= 10; i++) {
    transactions.push(createTransaction(i, Math.random() * 10000 + 100));
  }

  // Transacciones 11-15: Fallan 1 vez y luego tienen éxito (se recuperan en el primer reintento)
  for (let i = 11; i <= 15; i++) {
    transactions.push(createTransaction(i, Math.random() * 10000 + 100, true, 1));
  }

  // Transacciones 16-18: Fallan 2 veces y luego tienen éxito (se recuperan en el segundo reintento)
  for (let i = 16; i <= 18; i++) {
    transactions.push(createTransaction(i, Math.random() * 10000 + 100, true, 2));
  }

  // Transacciones 19-20: Fallan todas las veces (fallan definitivamente después de 3 reintentos)
  for (let i = 19; i <= 20; i++) {
    transactions.push(createTransaction(i, Math.random() * 10000 + 100, true, 10)); // 10 > 3 reintentos
  }

  return transactions;
}

/**
 * Función principal de demostración
 */
async function main() {
  console.log('\n' + '='.repeat(70));
  console.log('🏦 SISTEMA DE PROCESAMIENTO DE TRANSACCIONES BANCARIAS');
  console.log('='.repeat(70));

  // Crear el procesador con concurrencia limitada a 3
  const processor = new TransactionProcessor(3);

  // Suscribirse a eventos individuales (patrón observer)
  processor.on('success', (data) => {
    console.log(`✅ Transacción exitosa: ${data.transactionId} - Monto: $${data.result.amount.toFixed(2)}`);
  });

  processor.on('failure', (data) => {
    console.log(`❌ Transacción fallida: ${data.transactionId} - Error: ${data.error.message}`);
  });

  processor.on('retry', (data) => {
    console.log(`🔄 Reintentando ${data.transactionId} - Intento ${data.attempt}/3 - Esperando ${data.delay}ms`);
  });

  // Generar 20 transacciones
  const transactions = generateTransactions();

  console.log(`\n📝 Generadas ${transactions.length} transacciones para procesar\n`);
  console.log('Configuración:');
  console.log('  - Concurrencia máxima: 3 transacciones simultáneas');
  console.log('  - Reintentos máximos: 3 por transacción');
  console.log('  - Backoff exponencial: 1s, 2s, 4s');
  console.log('  - Throttling de logs: 500ms\n');

  // Procesar todas las transacciones
  const results = await processor.process(transactions);

  // Análisis detallado de resultados
  console.log('\n📋 ANÁLISIS DETALLADO DE RESULTADOS:\n');

  const fulfilled = results.filter(r => r.status === 'fulfilled');
  const rejected = results.filter(r => r.status === 'rejected');

  console.log(`Total procesadas: ${results.length}`);
  console.log(`Exitosas: ${fulfilled.length}`);
  console.log(`Fallidas definitivamente: ${rejected.length}\n`);

  if (rejected.length > 0) {
    console.log('❌ Transacciones que fallaron después de todos los reintentos:');
    rejected.forEach((result, index) => {
      console.log(`   ${index + 1}. Error: ${result.reason.message}`);
    });
  }

  console.log('\n✨ Demostración completada con éxito!');
  console.log('\nCaracterísticas implementadas:');
  console.log('  ✓ Pool de concurrencia limitada (3 conexiones)');
  console.log('  ✓ Patrón Observer con EventEmitter');
  console.log('  ✓ Reintentos automáticos con backoff exponencial');
  console.log('  ✓ Throttling de logs (500ms)');
  console.log('  ✓ Manejo robusto de errores\n');
}

// Ejecutar la demostración
main().catch(console.error);
