/**
 * Sistema de procesamiento de transacciones bancarias con Event Loop Mastery
 * - Concurrencia limitada (pool de 3 conexiones)
 * - Patrón Observer con EventEmitter
 * - Estrategia de reintentos con backoff exponencial
 * - Throttling de logs
 */

const EventEmitter = require('events');

/**
 * Clase EventEmitter personalizada para suscripciones a eventos de transacciones
 */
class TransactionEmitter extends EventEmitter {
  constructor() {
    super();
  }

  onSuccess(callback) {
    this.on('transaction:success', callback);
  }

  onFailure(callback) {
    this.on('transaction:failure', callback);
  }

  onRetry(callback) {
    this.on('transaction:retry', callback);
  }

  onProgress(callback) {
    this.on('transaction:progress', callback);
  }

  emitSuccess(transactionId, result) {
    this.emit('transaction:success', { transactionId, result, timestamp: Date.now() });
  }

  emitFailure(transactionId, error) {
    this.emit('transaction:failure', { transactionId, error, timestamp: Date.now() });
  }

  emitRetry(transactionId, attempt, delay) {
    this.emit('transaction:retry', { transactionId, attempt, delay, timestamp: Date.now() });
  }

  emitProgress(completed, total) {
    this.emit('transaction:progress', { completed, total, timestamp: Date.now() });
  }
}

/**
 * Función para implementar delay (usado en reintentos)
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Función que implementa la lógica de reintentos con backoff exponencial
 * @param {Function} fn - Función que retorna una promesa
 * @param {Object} options - Opciones de reintento
 * @returns {Promise} - El resultado de la función o un error después de todos los reintentos
 */
async function retryWithExponentialBackoff(fn, options = {}) {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    transactionId,
    emitter
  } = options;

  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await fn();
      return result;
    } catch (error) {
      lastError = error;

      if (attempt < maxRetries) {
        // Calcular delay exponencial: 1s, 2s, 4s
        const delay = initialDelay * Math.pow(2, attempt);
        
        // Emitir evento de reintento
        if (emitter) {
          emitter.emitRetry(transactionId, attempt + 1, delay);
        }

        // Esperar antes del siguiente reintento
        await sleep(delay);
      }
    }
  }

  // Si llegamos aquí, todos los reintentos fallaron
  throw lastError;
}

/**
 * Función throttle para limitar la frecuencia de ejecución
 */
function throttle(fn, delay) {
  let lastCall = 0;
  let timeoutId = null;
  let pendingArgs = null;

  return function throttled(...args) {
    const now = Date.now();
    
    // Guardar los argumentos más recientes
    pendingArgs = args;

    // Si ya pasó el tiempo mínimo, ejecutar inmediatamente
    if (now - lastCall >= delay) {
      lastCall = now;
      pendingArgs = null;
      return fn.apply(this, args);
    }

    // Si no, programar para ejecutar después
    if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        const argsToUse = pendingArgs;
        pendingArgs = null;
        timeoutId = null;
        if (argsToUse) {
          fn.apply(this, argsToUse);
        }
      }, delay - (now - lastCall));
    }
  };
}

/**
 * Pool de concurrencia limitada - Procesa promesas con un límite de ejecución simultánea
 */
class ConcurrencyPool {
  constructor(concurrencyLimit = 3, emitter = null) {
    this.concurrencyLimit = concurrencyLimit;
    this.running = 0;
    this.queue = [];
    this.emitter = emitter;
    this.completed = 0;
    this.total = 0;
  }

  /**
   * Agrega una tarea al pool
   */
  async add(taskFn, taskId) {
    return new Promise((resolve, reject) => {
      this.queue.push({ taskFn, taskId, resolve, reject });
      this._processNext();
    });
  }

  /**
   * Procesa la siguiente tarea en la cola
   */
  async _processNext() {
    // Si ya alcanzamos el límite o no hay tareas, salir
    if (this.running >= this.concurrencyLimit || this.queue.length === 0) {
      return;
    }

    // Tomar la siguiente tarea
    const { taskFn, taskId, resolve, reject } = this.queue.shift();
    this.running++;

    try {
      // Ejecutar la tarea
      const result = await taskFn();
      this.completed++;
      
      // Emitir eventos
      if (this.emitter) {
        this.emitter.emitSuccess(taskId, result);
        this.emitter.emitProgress(this.completed, this.total);
      }
      
      resolve(result);
    } catch (error) {
      this.completed++;
      
      // Emitir eventos de fallo
      if (this.emitter) {
        this.emitter.emitFailure(taskId, error);
        this.emitter.emitProgress(this.completed, this.total);
      }
      
      reject(error);
    } finally {
      this.running--;
      // Procesar la siguiente tarea
      this._processNext();
    }
  }

  /**
   * Procesa un arreglo de transacciones con concurrencia limitada
   */
  async processAll(transactions) {
    this.total = transactions.length;
    this.completed = 0;

    const promises = transactions.map((transaction) =>
      this.add(async () => {
        // Envolver cada transacción con la lógica de reintentos
        return await retryWithExponentialBackoff(
          transaction.fn,
          {
            maxRetries: 3,
            initialDelay: 1000,
            transactionId: transaction.id,
            emitter: this.emitter
          }
        );
      }, transaction.id)
    );

    // Esperar a que todas las promesas se completen o fallen
    const results = await Promise.allSettled(promises);
    return results;
  }
}

/**
 * Clase principal del procesador de transacciones
 */
class TransactionProcessor {
  constructor(concurrencyLimit = 3) {
    this.emitter = new TransactionEmitter();
    this.pool = new ConcurrencyPool(concurrencyLimit, this.emitter);
    this.stats = {
      total: 0,
      successful: 0,
      failed: 0,
      retries: 0
    };

    // Configurar throttled logger (máximo uno cada 500ms)
    this.throttledLog = throttle(this._logProgress.bind(this), 500);

    // Suscribirse a eventos para estadísticas
    this._setupEventListeners();
  }

  /**
   * Configurar listeners internos para manejo de estadísticas
   */
  _setupEventListeners() {
    this.emitter.onSuccess((data) => {
      this.stats.successful++;
    });

    this.emitter.onFailure((data) => {
      this.stats.failed++;
    });

    this.emitter.onRetry((data) => {
      this.stats.retries++;
    });

    this.emitter.onProgress((data) => {
      // Usar el logger throttled
      this.throttledLog(data);
    });
  }

  /**
   * Función interna para loggear progreso (llamada por throttle)
   */
  _logProgress(data) {
    const percentage = ((data.completed / data.total) * 100).toFixed(1);
    console.log(`\n📊 PROGRESO: ${data.completed}/${data.total} (${percentage}%) | ✅ ${this.stats.successful} | ❌ ${this.stats.failed} | 🔄 ${this.stats.retries} reintentos`);
  }

  /**
   * Permite a otros módulos suscribirse a eventos
   */
  on(event, callback) {
    switch (event) {
      case 'success':
        this.emitter.onSuccess(callback);
        break;
      case 'failure':
        this.emitter.onFailure(callback);
        break;
      case 'retry':
        this.emitter.onRetry(callback);
        break;
      case 'progress':
        this.emitter.onProgress(callback);
        break;
      default:
        this.emitter.on(event, callback);
    }
  }

  /**
   * Procesa un arreglo de transacciones
   */
  async process(transactions) {
    this.stats.total = transactions.length;
    this.stats.successful = 0;
    this.stats.failed = 0;
    this.stats.retries = 0;

    console.log(`\n🚀 Iniciando procesamiento de ${transactions.length} transacciones (Concurrencia: ${this.pool.concurrencyLimit})\n`);

    const startTime = Date.now();
    const results = await this.pool.processAll(transactions);
    const endTime = Date.now();

    // Log final
    console.log('\n' + '='.repeat(70));
    console.log('📈 RESUMEN FINAL:');
    console.log('='.repeat(70));
    console.log(`⏱️  Tiempo total: ${((endTime - startTime) / 1000).toFixed(2)}s`);
    console.log(`✅ Exitosas: ${this.stats.successful}`);
    console.log(`❌ Fallidas: ${this.stats.failed}`);
    console.log(`🔄 Total de reintentos: ${this.stats.retries}`);
    console.log('='.repeat(70) + '\n');

    return results;
  }
}

module.exports = {
  TransactionProcessor,
  TransactionEmitter,
  ConcurrencyPool,
  retryWithExponentialBackoff,
  throttle
};
