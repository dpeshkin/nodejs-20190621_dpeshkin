function sum(a, b) {
  if (!isNumeric(a) || !isNumeric(b)) {
    throw new TypeError('Аргументы должны быть числами');
  }
  return a + b;
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

module.exports = sum;
