/**
 * Cat Room - Web Serial API Integration Manager
 */

export class WebSerialManager {
  constructor(eventDispatcher, statusCallback) {
    this.eventDispatcher = eventDispatcher;
    this.statusCallback = statusCallback;
    this.port = null;
    this.reader = null;
    this.isConnected = false;
  }

  isSupported() {
    return 'serial' in navigator;
  }

  async connect() {
    if (!this.isSupported()) {
      alert('현재 브라우저는 Web Serial API를 지원하지 않습니다. Chrome 또는 Edge 브라우저를 사용해 주세요.');
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
    this.isConnected = false;
    if (this.statusCallback) this.statusCallback(false, '연결 해제됨');
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
          buffer = lines.pop(); // Keep last incomplete chunk

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
              try {
                const event = JSON.parse(trimmed);
                this.eventDispatcher.dispatch(event);
              } catch (e) {
                console.warn('Serial JSON parse error:', trimmed, e);
              }
            }
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
}
