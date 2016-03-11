// Events:
// --------
// msg(senderID, msg)  : Receiving a message
// peer(peerID) : Connect with new peer
// disconnect(peerID): Lost connection with peer

var utils = require('./utils');

function makeServer(){
  var users = {};

  function join(hooks) {
    var id = utils.uuid();
    var user = {
      id: id,
      hooks: hooks,
      peers: [],
    };
    users[id] = user;

    searchForPeers(id);

    return id;
  }

  // Returns true if users were not already peers and are now peers
  function makePeer(id1, id2){
    if (id1 === id2) return false;

    var u1 = users[id1];
    var u2 = users[id2];
    if (u1.peers.indexOf(id2) < 0
        && u2.peers.indexOf(id1) < 0){

      u1.peers.push(id2);
      u2.peers.push(id1);

      sendEvent('peer', id1, id2);
      sendEvent('peer', id2, id1);
      return true;
    }
    return false;
  }

  function randPeer(){
    var keys = Object.keys(users);
    return users[keys[utils.rand(keys.length)]];
  }

  function searchForPeers(id){
    // Make a few peers
    return [...new Array(5)].reduce((acc,v)=>acc+makePeer(id, randPeer().id),0);
  }

  function sendEvent(event, id){
    if (!users[id]){
      throw new Error("Couldn't find user with id `"+id+"`");
    }

    if (users[id].hooks[event]){
      users[id].hooks[event].apply(null, Array.prototype.slice.call(arguments, 2));
    }
  }

  function disconnect(id){
    var peers = users[id].peers;
    peers.forEach(p => {
      users[p].peers.splice(users[p].peers.indexOf(id), 1);
      sendEvent('disconnect', p, id)
    });
    delete users[id];
  }

  return function joinServer(hooks){
    var clientID = join(hooks || {});

    return {
      id: clientID,
      getPeers: () => users[clientID].peers,
      on: (event, cb) => users[clientID].hooks[event] = cb,
      send: (targetID, msg) => sendEvent('msg', targetID, clientID, msg),
      searchForPeers: () => searchForPeers(clientID),
      disconnect: () => disconnect(clientID),
    };
  };
}


module.exports = makeServer;
