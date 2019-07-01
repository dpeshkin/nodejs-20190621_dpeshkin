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

  switch (req.method) {
    case 'GET':
      fs.access(filepath, fs.constants.F_OK, err => {
        if (err) {
          res.statusCode = 404;
          res.end('Файл не найден', 'utf-8');
        } else {
          fs.createReadStream(filepath).pipe(res);
        }
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
