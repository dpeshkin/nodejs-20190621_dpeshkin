const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  if (pathname.includes('/')) {
    res.statusCode = 400;
    res.end('Вложенные папки не поддерживаются', 'utf-8');
  }

  if (fs.existsSync(filepath)) {
    res.statusCode = 409;
    res.end('Файл уже есть на диске', 'utf-8');
  }

  switch (req.method) {
    case 'POST':
      fs.mkdir('files', {recursive: true}, (err) => {
        if (err) {
          console.log(err);
        }

        const writeStream = fs.createWriteStream(filepath);
        const limiter = new LimitSizeStream({limit: 1048576});

        req.pipe(limiter).pipe(writeStream);

        req.on('aborted', () => {
          unlink(filepath, [limiter, writeStream]);
          res.end();
        });

        writeStream
            .on('error', () => {
              unlink(filepath, [limiter, writeStream]);
              res.statusCode = 500;
              res.end('Возникла критическая ошибка', 'utf-8');
            })
            .on('finish', () => {
              res.statusCode = 201;
              res.end('Файл успешно сохранен', 'utf-8');
            });

        limiter.on('error', () => {
          unlink(filepath, [writeStream, limiter]);
          res.statusCode = 413;
          res.end('Максимальный размер загружаемого файла не должен превышать 1МБ', 'utf-8');
        });
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

function unlink(filepath, streams) {
  fs.unlink(filepath, (err) => {
    if (err) {
      console.log(err);
    }
  });
  streams.forEach((stream) => {
    stream.destroy();
  });
}

module.exports = server;
