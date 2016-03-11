module.exports.uuid = (function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  return function() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
})();

module.exports.rand = (min, max) => (Math.random() * ((max || min) - (max?min:0)) ) << 0;

module.exports.randFrom = arr => arr[module.exports.rand(arr.length)];
