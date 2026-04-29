const http = require('http');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const port = 8123;

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  try {
    let reqPath = decodeURIComponent((req.url || '/').split('?')[0]);
    if (reqPath === '/') reqPath = '/index.html';
    const filePath = path.join(root, reqPath.replace(/^\//, ''));

    if (!filePath.startsWith(root)) {
      res.statusCode = 403;
      return res.end('Forbidden');
    }

    fs.stat(filePath, (err, stat) => {
      if (err || !stat.isFile()) {
        res.statusCode = 404;
        return res.end('Not Found');
      }
      const ext = path.extname(filePath).toLowerCase();
      res.setHeader('Content-Type', mime[ext] || 'application/octet-stream');
      const stream = fs.createReadStream(filePath);
      stream.on('error', () => {
        res.statusCode = 500;
        res.end('Server Error');
      });
      stream.pipe(res);
    });
  } catch {
    res.statusCode = 500;
    res.end('Server Error');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Serving ${root} at http://127.0.0.1:${port}/`);
});
