var joinServer = require('./server')();
var utils = require('./utils');

var users = [];
var numUsers = 10;

[...new Array(numUsers)].map((_,i)=>{
  function prnt(txt){
    console.log("User "+i+":", txt)
  }

  prnt("Connecting...");
  var connection = joinServer({
    peer: peer => prnt("Made peer with "+peer),
    disconnect: peer => prnt(peer+" disconnected."),
  });

  connection.on('msg', (id, msg) => {
    if (msg.type === 'msg'){
      prnt("Received "+msg.txt+" from "+id+".");
      connection.send(id, {type:'ack'})
    } else if (msg.type === 'ack'){
      prnt("Received ACK from "+id+".");
    }
  });

  users.push(connection);
  prnt("Connected with ID "+connection.id);
  prnt(connection.getPeers());

  var randMsg = () => setTimeout(() => {
    var peerID = utils.randFrom(connection.getPeers());
    prnt("Sending message to peer "+peerID);
    connection.send(peerID, {type:'msg', txt:'HI!!'});
    randMsg();
  }, utils.rand(100,10000));
  randMsg()

});
