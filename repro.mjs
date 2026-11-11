// Starts the dev server, then connects to Vite's HMR socket the way a freshly
// opened browser tab does, and prints what the server sends to it.
import { createServer } from 'vite';

const server = await createServer({ logLevel: 'warn', server: { port: 0 } });
await server.listen();
const { port } = server.httpServer.address();

const messages = [];
const socket = new WebSocket(`ws://localhost:${port}/`, 'vite-hmr');
socket.addEventListener('message', (event) => messages.push(JSON.parse(event.data).type));
await new Promise((resolve) => setTimeout(resolve, 1500));
socket.close();
await server.close();

console.log('HMR messages received by the first client:', messages);
console.log(messages.includes('full-reload')
  ? 'BUG: the first page opened after start would reload itself'
  : 'OK: no reload');
