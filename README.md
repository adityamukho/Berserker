Berserker
=========
**Advanced web-based frontend for Aria2-JSONRPC.**

HTTP(s)/FTP/Magnet support complete. File upload (BitTorrent and Metalink) support coming soon.

Install
-------
1. Install [Aria 2](http://aria2.sourceforge.net/) from the site or from your distribution's package repositories.
2. Install [Node.js](http://nodejs.org/) (and NPM) from the site or from your distribution's package repositories.
2. Run `$ npm install` from the project's root folder.
    
Run
---
1. Edit `node/settings.json`.
    1. Keys in the *aria2c* property should be valid aria2c options (POSIX long version) without the '--'.
    1. Any value enclosed in curly braces (like {HOME}) will be replaced by the value of the corresponding environment variable.
1. `$ node node/Berserker.js`
1. Open <http://localhost:8000/> (Or whatever port you have set in `node/settings.json`).

Notes
-----
1. Your Aria2 executable must have support compiled for the *aria2.multicall* function. 
1. If aria was not built with websocket support, use the restify or http connector instead (See settings.json).
