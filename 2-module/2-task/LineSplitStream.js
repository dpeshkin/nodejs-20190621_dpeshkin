const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.encoding = options.encoding || 'utf-8';
  }

  _transform(chunk, encoding, callback) {
    let dataString = chunk.toString(this.encoding);
    if (this.lastLine) {
      dataString = this.lastLine + dataString;
    }
    const tokens = dataString.split(os.EOL);
    this.lastLine = tokens.pop();
    tokens.forEach(token => this.push(token));
    callback();
  }

  _flush(callback) {
    if (this.lastLine) {
      this.push(this.lastLine);
    }
    callback();
  }
}

module.exports = LineSplitStream;
