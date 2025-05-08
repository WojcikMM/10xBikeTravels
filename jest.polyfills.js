// Add Web API polyfills for Node.js environment
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Polyfill for Response and Request objects
const { Response, Request, Headers, fetch } = require('whatwg-fetch');
global.Response = Response;
global.Request = Request;
global.Headers = Headers;
global.fetch = fetch;

// Mock BroadcastChannel
global.BroadcastChannel = class BroadcastChannel {
  constructor(channel) {
    this.channel = channel;
    this.onmessage = null;
  }
  postMessage(message) {
    // No-op in tests
  }
  close() {
    // No-op in tests
  }
};

// Mock TransformStream which is not available in JSDOM
global.TransformStream = class TransformStream {
  constructor() {
    this.readable = {
      getReader: () => ({
        read: () => Promise.resolve({ done: true }),
        releaseLock: () => {},
      }),
      pipeThrough: () => this.readable,
    };
    this.writable = {
      getWriter: () => ({
        write: () => Promise.resolve(),
        close: () => Promise.resolve(),
        releaseLock: () => {},
      }),
    };
  }
};

// Mock ReadableStream if not available
if (!global.ReadableStream) {
  global.ReadableStream = class ReadableStream {
    constructor() {
      this.locked = false;
    }
    getReader() {
      this.locked = true;
      return {
        read: () => Promise.resolve({ done: true }),
        releaseLock: () => {
          this.locked = false;
        },
      };
    }
  };
}

// Mock Streams API
global.WritableStream = class WritableStream {
  constructor() {
    this.locked = false;
  }
  getWriter() {
    this.locked = true;
    return {
      write: () => Promise.resolve(),
      close: () => Promise.resolve(),
      releaseLock: () => {
        this.locked = false;
      },
      ready: Promise.resolve(),
    };
  }
};
