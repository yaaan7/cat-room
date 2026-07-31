/**
 * Cat Room - Web Serial API Integration Manager
 *
 * Parses text-based Arduino serial output:
 *   Events:   "[FEED] Button pressed"
 *             "[PET] Hand detected"
 *             "[PET] Hand removed"
 *   Sensors:  "Light=XXX | Distance=XXcm | Pet=DETECTED/NONE | Feed=PRESSED/RELEASED"
 */

export class WebSerialManager {
  constructor(eventDispatcher, statusCallback) {
    this.eventDispatcher = eventDispatcher;
    this.statusCallback = statusCallback;
    this.port = null;
    this.reader = null;
    this.isConnected = false;

    // Track light state to detect transitions
    this.lastLightDark = null;
    // Track distance for approach detection
    this.lastDistance = -1;
  }

  isSupported() {
    return 'serial' in navigator;
  }

  async connect() {
    if (!this.isSupported()) {
      alert('현재 브라우저는 Web Serial API를 지원하지 않습니다.\nChrome 또는 Edge 브라우저를 사용해 주세요.');
      return false;
    }

    try {
      this.port = await navigator.serial.requestPort();
      await this.port.open({ baudRate: 9600 });
      this.isConnected = true;

      if (this.statusCallback) this.statusCallback(true, 'Arduino 연결됨');
      this.startReading();
      return true;
    } catch (err) {
      console.error('Serial Connection Error:', err);
      this.isConnected = false;
      if (this.statusCallback) this.statusCallback(false, '연결 실패 또는 취소됨');
      return false;
    }
  }

  async disconnect() {
    if (this.reader) {
      try { await this.reader.cancel(); }
      catch (e) { console.warn('Reader cancel:', e); }
    }
    if (this.port) {
      try { await this.port.close(); }
      catch (e) { console.warn('Port close:', e); }
    }
    this.isConnected = false;
    if (this.statusCallback) this.statusCallback(false, '연결 해제됨');
  }

  /**
   * Send a command string to Arduino (e.g. for NeoPixel color control)
   */
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
    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = this.port.readable.pipeTo(textDecoder.writable);
    this.reader = textDecoder.readable.getReader();

    let buffer = '';

    try {
      while (true) {
        const { value, done } = await this.reader.read();
        if (done) {
          this.reader.releaseLock();
          break;
        }
        if (value) {
          buffer += value;
          const lines = buffer.split('\n');
          buffer = lines.pop(); // keep incomplete chunk

          for (const line of lines) {
            this.parseLine(line.trim());
          }
        }
      }
    } catch (error) {
      console.error('Serial Read Error:', error);
    } finally {
      this.isConnected = false;
      if (this.statusCallback) this.statusCallback(false, '연결 이탈됨');
    }
  }

  /**
   * Parse a single line from Arduino serial output
   */
  parseLine(line) {
    if (!line) return;

    // ── Event lines ──────────────────────────────────────────
    if (line === '[FEED] Button pressed') {
      this.eventDispatcher.dispatch({ type: 'FEED', source: 'ARDUINO' });
      return;
    }

    if (line === '[PET] Hand detected') {
      this.eventDispatcher.dispatch({ type: 'PET_SHORT', source: 'ARDUINO' });
      return;
    }

    if (line === '[PET] Hand removed') {
      // Hand removed → no special event, already dispatched PET on detect
      return;
    }

    // ── Periodic sensor line ─────────────────────────────────
    // Format: "Light=XXX | Distance=XXcm | Pet=DETECTED | Feed=RELEASED"
    if (line.startsWith('Light=')) {
      this.parseSensorLine(line);
      return;
    }

    // Skip startup messages (=== Cat Room Hardware Test === etc.)
  }

  /**
   * Parse periodic sensor data and dispatch derived events
   */
  parseSensorLine(line) {
    const parts = {};
    line.split('|').forEach(segment => {
      const [key, val] = segment.trim().split('=');
      if (key && val) parts[key.trim()] = val.trim();
    });

    // ── Light sensor → Day/Night ────────────────────────────
    const lightVal = parseInt(parts['Light'], 10);
    if (!isNaN(lightVal)) {
      const isDark = lightVal < 300; // LDR threshold
      if (this.lastLightDark !== isDark) {
        this.lastLightDark = isDark;
        this.eventDispatcher.dispatch({
          type: isDark ? 'LIGHT_DARK' : 'LIGHT_BRIGHT',
          source: 'ARDUINO',
          value: lightVal
        });
      }
    }

    // ── Distance sensor → Approach detection ────────────────
    const distStr = parts['Distance'];
    if (distStr && distStr !== 'NO_ECHO') {
      const dist = parseInt(distStr, 10);
      if (!isNaN(dist)) {
        // Dispatch approach if someone is close
        if (dist < 15 && this.lastDistance >= 15) {
          this.eventDispatcher.dispatch({
            type: 'APPROACH_FAST',
            source: 'ARDUINO',
            value: dist
          });
        } else if (dist < 30 && dist >= 15 && this.lastDistance >= 30) {
          this.eventDispatcher.dispatch({
            type: 'APPROACH_SLOW',
            source: 'ARDUINO',
            value: dist
          });
        } else if (dist >= 50 && this.lastDistance < 50 && this.lastDistance > 0) {
          this.eventDispatcher.dispatch({
            type: 'PERSON_LEFT',
            source: 'ARDUINO',
            value: dist
          });
        }
        this.lastDistance = dist;
      }
    }
  }
}
