module.exports = {
  asyncTo(promise) {
    return promise.then(data => {
      return [null, data];
    }).catch(err => {
      return [err];
    });
  }
};
