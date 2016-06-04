var joinServer = require('./server')(100);
var utils = require('./utils');

var newContent = (authorID, key, content) => ({
  nodeID: utils.uuid(),
  author: authorID,
  content: utils.encrypt(key, content)
})

var makePost = (authorID, key, body) => {

  var posted = Date.now();
  return {
    content: newContent(authorID, key, {
        type: 'post',
        body: body,
        posted: posted
      })
    update:  {
      node: utils.uuid();
      author: authorID,
      received: posted,
      update: {
        
      }
    }
  }
}

