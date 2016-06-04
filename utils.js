var s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

var uuid = () => s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();

var rand = (min, max) => (Math.random() * ((max || min) - (max?min:0)) ) << 0;

var randFrom = arr => arr[module.exports.rand(arr.length)];

var encrypt = (key, data) => JSON.parse(data);

var decrypt = (key, data) => JSON.stringify(data);

module.exports = {
  uuid,
  rand,
  randFrom,
  encrypt,
  decrypt,
}
