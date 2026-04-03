const { spawn } = require('child_process');
const path = require('path');

const cwd = __dirname;
const port = 5611;
const server = spawn(process.execPath, ['server.js'], {
  cwd,
  env: { ...process.env, PORT: String(port), ADMIN_TOKEN: 'test-token' },
  stdio: ['ignore', 'pipe', 'pipe']
});

function cleanup(code = 0) {
  server.kill('SIGTERM');
  process.exit(code);
}

server.stderr.on('data', (buf) => process.stderr.write(buf));
server.stdout.on('data', async (buf) => {
  const text = String(buf);
  if (!/http:\/\/localhost:/i.test(text)) return;
  try {
    const paths = ['/', '/world', '/tanaman', '/binatang', '/teknologi', '/portfolio', '/game', '/manager', '/posts', '/api/health'];
    for (const pathname of paths) {
      const res = await fetch(`http://127.0.0.1:${port}${pathname}`);
      if (!res.ok) throw new Error(`${pathname} -> ${res.status}`);
    }
    console.log('smoke ok');
    cleanup(0);
  } catch (error) {
    console.error(error.message);
    cleanup(1);
  }
});

setTimeout(() => {
  console.error('smoke test timeout');
  cleanup(1);
}, 12000);
