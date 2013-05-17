Berserker
=========
**Web-based frontend for Aria2-JSONRPC.**

HTTP support complete. BitTorrent and Metalink support coming soon.

The underlying transport layer will eventually use websockets exclusively. Check [this list](https://github.com/Worlize/WebSocket-Node#browser-support) to see if your browser will be supported.

Install
-------
1. Install [Aria 2](http://aria2.sourceforge.net/) from the site or from your distribution's package repositories.
2. Install [Node.js](http://nodejs.org/) from the site or from your distribution's package repositories.
2. Run `$ npm install` from the project's root folder.
    
Run
---
1. Edit `node/config.js`.
1. `$ node node/Berserker.js`
1. Open <http://localhost:8000/> (Or whatever port you have set in `node/config.js`).

Notes
-----
1. Your Aria2 executable must have support compiled for the aria2.multicall function. 
1. If aria was not built with websocket support, use the restify or http connector instead (See config.js).
