/**
 * Logger - Sistema de logging amb nivells
 * Debug, info, warn, error
 */
export class Logger {
  static LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    NONE: 4
  };

  constructor(name = 'App', level = Logger.LEVELS.INFO) {
    this.name = name;
    this.level = level;
    this.history = [];
    this.maxHistorySize = 1000;
  }

  /**
   * Estableix el nivell de logging
   */
  setLevel(level) {
    this.level = level;
  }

  /**
   * Log debug
   */
  debug(...args) {
    if (this.level <= Logger.LEVELS.DEBUG) {
      const message = this.formatMessage('DEBUG', ...args);
      console.log(`%c${message}`, 'color: #888');
      this.addToHistory('DEBUG', args);
    }
  }

  /**
   * Log info
   */
  info(...args) {
    if (this.level <= Logger.LEVELS.INFO) {
      const message = this.formatMessage('INFO', ...args);
      console.log(`%c${message}`, 'color: #0066cc');
      this.addToHistory('INFO', args);
    }
  }

  /**
   * Log warning
   */
  warn(...args) {
    if (this.level <= Logger.LEVELS.WARN) {
      const message = this.formatMessage('WARN', ...args);
      console.warn(message);
      this.addToHistory('WARN', args);
    }
  }

  /**
   * Log error
   */
  error(...args) {
    if (this.level <= Logger.LEVELS.ERROR) {
      const message = this.formatMessage('ERROR', ...args);
      console.error(message);
      this.addToHistory('ERROR', args);
    }
  }

  /**
   * Formata el missatge
   */
  formatMessage(level, ...args) {
    const timestamp = new Date().toISOString();
    const argsStr = args.map(arg => {
      if (typeof arg === 'object') {
        return JSON.stringify(arg);
      }
      return String(arg);
    }).join(' ');
    
    return `[${timestamp}] [${this.name}] [${level}] ${argsStr}`;
  }

  /**
   * Afegeix a l'historial
   */
  addToHistory(level, args) {
    this.history.push({
      timestamp: Date.now(),
      level,
      name: this.name,
      args: args
    });

    // Limita la mida de l'historial
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }
  }

  /**
   * Obté l'historial
   */
  getHistory(filter = null) {
    if (filter && filter.level) {
      return this.history.filter(entry => entry.level === filter.level);
    }
    return this.history;
  }

  /**
   * Neteja l'historial
   */
  clearHistory() {
    this.history = [];
  }

  /**
   * Exporta l'historial com JSON
   */
  exportHistory() {
    return JSON.stringify(this.history, null, 2);
  }

  /**
   * Crea un timer
   */
  time(label) {
    console.time(`[${this.name}] ${label}`);
  }

  /**
   * Finalitza un timer
   */
  timeEnd(label) {
    console.timeEnd(`[${this.name}] ${label}`);
  }

  /**
   * Crea un grup de logs
   */
  group(label) {
    console.group(`[${this.name}] ${label}`);
  }

  /**
   * Finalitza un grup
   */
  groupEnd() {
    console.groupEnd();
  }

  /**
   * Mostra una taula
   */
  table(data) {
    console.table(data);
  }
}

// Logger global per defecte
export const logger = new Logger('NUBULUS', Logger.LEVELS.INFO);
