# raccoon

## Passwords

## Update Feed
When creating a new piece of content (new post, like, comment etc), they publish this `content` along with an `update` node.  For example:

```js
var content = {
  nodeGuid: 111111,
  author: authorGuid, // Not sure whether this should be outside the content.
  content: { // encrypted
      type: 'post',
      body: 'Hi, my name is Bob and I feel happy today.',
      posted: timeWhenPosted,
  }
}

var update = {
  nodeGuid: 222222,
  author: authorGuid,
  received: timeWhenReceived,
  update: { // encrypted
    nodeGuid: 111111,
    posted: timeWhenPosted,
  }
}
```

###Creation:
When you make a post, you fire the `content` and `update` nodes to all your peers. The peers keep both but only pass the `update` along further.  The `update`.  Whenever you receive a node, you stamp it with your own `received` timestamp (unencrypted).

###Use:
When the client is populating the newsfeed, it makes a short-term `updateRequest` to the network, asking updates that anyone has about specific users.

###Maintenance:
Periodically, clients should go through their stored updates and clean them up by removing any that were received before a certain point in time.  This ensures that the network doesn't spend too many resources storing updates.  After this point, users will have to get information by directly requesting all content nodes created by the user...

Note: A short-term request has a randomized expiry time in the near future.

###Optimizations:
Likes could be stored inside the actual `update`.  In this case, the internal nodeGuid would point to the liked content.
```js
var update = {
  nodeGuid: 222222,
  author: authorGuid,
  received: timeWhenReceived,
  update: { // encrypted
    nodeGuid: 111111,
    posted: timeWhenPosted,
    like: true,
  }
}
```

## Requests
Frequently the client will want access to data it doesn't have.  In this case, the client can publish a `request` for content.  This is heavily propagated like `update`s.  When a user receives a request for data it has access to, it first attempts to directly send that data to the user. If that isn't possible, it sends the content to its peers hopefully in an attempt to ensure that the data is more replicated in the network.  If the user doesn't have the data, it simply passes on the `request`.

Users will have to store a short-term cache of received `requests` so that they don't spam the network by passing them twice.  A user could potentially have the ability to promote a request to a long-running request if it receives it too much... we need a good heuristic because this promotion seems a little expensive.

One solution to the above problem is timing requests.  Instead of doing a stupidly expensive full traversal of the network to determine whether an online user has the content, a `request` is sent out with a randomized expiry timestamp in the near future.  If a peer receives the `request` after the expiry time, the request is promoted to a long-running request and after this point, is propagated through the network as such.

### Long-running Requests
There needs to be a way for requests to be persisted in the network if the user who has the requested data is offline.  Peers without the data would have to hold onto the `request` and treat it like an `update` node.  Then users searching for updates would check if there were any `requests` aimed at them.  Since requests time out, this could be a reasonable way of getting this information without spamming the network too much.


## Content Storage
It may be simplest to store data in a diff format.  There would be some base `post` content node, which would be modified by diffs that either edit the body of the post or add likes/comments.  If each diff was marked with a timestamp, merging states would simply be a matter of applying the diffs in order.  The problem with this is that these diffs might become expensive to store...  You're also never sure if you might have missed a diff.  

Another diff-based scheme would be to have the diffs refer to their parent.  Then, if you receive an unbroken sequence of diffs, you can collapse them.  The only problem with this is that then you end up with multiple different nodes floating around with the same parent.  In order to fix this, the merged diff could contain a list of all diffs included in the merge...
