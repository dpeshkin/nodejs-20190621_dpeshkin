const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  if (pathname.includes('/')) {
    res.statusCode = 400;
    res.end('Вложенные папки не поддерживаются', 'utf-8');
  }

  if (!fs.existsSync(filepath)) {
    res.statusCode = 404;
    res.end('Файла нет на диске', 'utf-8');
  }

  switch (req.method) {
    case 'DELETE':
      fs.unlink(filepath, (err) => {
        if (!err) {
          res.statusCode = 200;
          res.end();
        }
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
