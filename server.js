const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3001;
const rootDir = __dirname;

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

const server = http.createServer((req, res) => {
  const safePath = decodeURI(req.url.split('?')[0]).replace(/\/+$/, '') || '/';

  if (safePath === '/favicon.ico') {
    res.writeHead(204, { 'Content-Type': 'image/x-icon' });
    return res.end();
  }

  let requestedPath = safePath === '/' ? '/2.html' : safePath;
  const filePath = path.join(rootDir, requestedPath);

  if (!filePath.startsWith(rootDir)) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    return res.end('Bad request');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('404 - Datoteka nije pronađena');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
    stream.on('error', () => {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 - Greška pri čitanju datoteke');
    });
  });
});

server.listen(port, () => {
  console.log(`Server pokrenut: http://localhost:${port}`);
  console.log('Glavni dokument: 2.html');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} je već u upotrebi. Pokreni server na drugom portu ili postavi PORT promenljivu, npr. PORT=3001 npm start`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});
