# raccoon

Goal: Implement a typical social network on webrtc.
 - Maintain major goal of accessibility to anyone (not just techies)

 
Rough Implementation Decisions:
 - Underlying structure is [Chord](https://github.com/Schmavery/raccoon/issues/2) (a distributed hash table)
 - Use WebCrypto and IndexedDB tech to build a web client
 - Various encryptions schemes will replace passwords and permissions
 - Write it in [reasonml](reason.ml) compiled using [bucklescript](https://github.com/bloomberg/bucklescript).
