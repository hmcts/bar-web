module.exports = {
  asyncTo(promise) {
    return promise.then(data => [null, data]).catch(err => [err]);
  }
};
