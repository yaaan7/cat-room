/**
 * Cat Room - Web Serial API Integration Manager
 *
 * Responsibilities:
 * - Handle Serial Port connection lifecycle and status callbacks
 * - Read incoming raw serial text line-by-line using standard TextDecoder
 * - Output debug log `console.log('[Serial Raw]', trimmed)`
 * - Parse JSON events (or fallback text format) and log `console.log('[Arduino Event]', event)`
 * - Forward events directly to GameEventDispatcher without modifying game state directly.
 */

export class WebSerialManager {
  constructor(eventDispatcher, statusCallback) {
    this.eventDispatcher = eventDispatcher;
    this.statusCallback = statusCallback;
    this.port = null;
    this.reader = null;
    this.isConnected = false;
    this.isConnecting = false;
    this.textDecoder = new TextDecoder();
  }

  isSupported() {
    return 'serial' in navigator;
  }

  async connect() {
    if (!this.isSupported()) {
      alert('현재 브라우저는 Web Serial API를 지원하지 않습니다.\nChrome 또는 Edge 브라우저를 사용해 주세요.');
      return false;
    }

    if (this.isConnecting || this.isConnected) {
      return false;
    }

    this.isConnecting = true;
    if (this.statusCallback) this.statusCallback('CONNECTING', '연결 중...');

    try {
      this.port = await navigator.serial.requestPort();
      await this.port.open({ baudRate: 9600 });
      this.isConnected = true;
      this.isConnecting = false;

      if (this.statusCallback) this.statusCallback('CONNECTED', '페어링됨');

      // Mark arduino connected flag in storage
      if (this.eventDispatcher && this.eventDispatcher.storageManager) {
        const data = this.eventDispatcher.storageManager.loadData();
        if (!data.flags) data.flags = {};
        data.flags.hasConnectedArduino = true;
        this.eventDispatcher.storageManager.saveData(data);
        if (this.eventDispatcher.checkUnlockableItems) {
          this.eventDispatcher.checkUnlockableItems();
        }
      }

      this.startReading();
      return true;
    } catch (err) {
      console.error('Serial Connection Error:', err);
      this.isConnected = false;
      this.isConnecting = false;
      if (this.statusCallback) this.statusCallback('DISCONNECTED', '연결 실패 또는 취소됨');
      return false;
    }
  }

  async disconnect() {
    this.isConnected = false;
    this.isConnecting = false;

    if (this.reader) {
      try {
        await this.reader.cancel();
      } catch (e) {
        console.warn('Reader cancel warning:', e);
      }
    }
    if (this.port) {
      try {
        await this.port.close();
      } catch (e) {
        console.warn('Port close warning:', e);
      }
    }
    this.port = null;

    if (this.statusCallback) this.statusCallback('DISCONNECTED', '연결 해제됨');
  }

  async sendCommand(cmd) {
    if (!this.port || !this.port.writable) return;
    const encoder = new TextEncoder();
    const writer = this.port.writable.getWriter();
    try {
      await writer.write(encoder.encode(cmd + '\n'));
    } finally {
      writer.releaseLock();
    }
  }

  async startReading() {
    this.reader = this.port.readable.getReader();
    let buffer = '';

    try {
      while (this.isConnected) {
        const { value, done } = await this.reader.read();
        if (done) break;
        if (value) {
          buffer += this.textDecoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop(); // keep trailing incomplete line

          for (const line of lines) {
            this.processRawLine(line.trim());
          }
        }
      }
    } catch (error) {
      if (this.isConnected) {
        console.error('Serial Read Error:', error);
      }
    } finally {
      if (this.reader) {
        try { this.reader.releaseLock(); } catch (e) {}
        this.reader = null;
      }
      const wasConnected = this.isConnected;
      this.isConnected = false;
      this.isConnecting = false;
      if (wasConnected && this.statusCallback) {
        this.statusCallback('DISCONNECTED', '연결 끊김');
      }
    }
  }

  /**
   * Process each line received over Web Serial
   */
  processRawLine(trimmed) {
    if (!trimmed) return;

    // Debug Log 1: Raw Serial Line
    console.log('[Serial Raw]', trimmed);

    let event = null;

    // 1. Try parsing JSON format
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        event = JSON.parse(trimmed);
      } catch (e) {
        console.warn('Failed to parse Serial JSON:', trimmed, e);
      }
    }

    // 2. Fallback to Legacy Text Parsing if not JSON
    if (!event) {
      event = this.parseLegacyTextLine(trimmed);
    }

    // 3. If valid event parsed, log and dispatch
    if (event && event.type) {
      if (!event.source) event.source = 'ARDUINO';

      // Debug Log 2: Parsed Arduino Event
      console.log('[Arduino Event]', event);

      // Dispatch to unified game dispatcher
      if (this.eventDispatcher) {
        this.eventDispatcher.dispatch(event);
      }
    }
  }

  /**
   * Legacy text format parser for backward compatibility
   */
  parseLegacyTextLine(line) {
    if (line === '[FEED] Button pressed') return { type: 'FEED' };
    if (line === '[PET] Hand detected') return { type: 'PET_SHORT', duration: 500 };
    if (line.startsWith('Light=')) {
      const parts = {};
      line.split('|').forEach(seg => {
        const [k, v] = seg.trim().split('=');
        if (k && v) parts[k.trim()] = v.trim();
      });
      const lightVal = parseInt(parts['Light'], 10);
      if (!isNaN(lightVal)) {
        return {
          type: lightVal < 300 ? 'LIGHT_DARK' : 'LIGHT_BRIGHT',
          value: lightVal
        };
      }
    }
    return null;
  }
}
