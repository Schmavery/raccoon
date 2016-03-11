var joinServer = require('./server')(100);
var utils = require('./utils');

var numUsers = 10;

for (var i = 0; i < numUsers; i++){
  joinServer(connection => {
    function prnt(txt){
      console.log("User "+connection.id+":", txt)
    }
    connection.on('msg', (id, msg) => {
      if (msg.type === 'msg'){
        prnt("Received "+msg.txt+" from "+id+".");
        connection.send(id, {type:'ack'})
      } else if (msg.type === 'ack'){
        prnt("Received ACK from "+id+".");
      }
    });

    {peer: peer => prnt("Made peer with "+peer)}

    connection.on('disconnect', peer => {
      prnt(peer+" disconnected.");
      if (connection.getPeers().length < 2){
        prnt("Looking for more peers");
        prnt("Made "+connection.searchForPeers()+" new peers.");
      }
    });

    prnt("Connected with ID "+connection.id);
    prnt(connection.getPeers());

    var randMsg = () => setTimeout(() => {
      var peerID = utils.randFrom(connection.getPeers());

      if (peerID === undefined || utils.rand(10) === 1){
        if (peerID === undefined) prnt("No more peers are connected.");
        prnt("Disconnecting...")
        return connection.disconnect();
      }

      prnt("Sending message to peer "+peerID);
      connection.send(peerID, {type:'msg', txt:'HI!!'});
      randMsg();
    }, utils.rand(100,10000));
    randMsg()
  });
}
