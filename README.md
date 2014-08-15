Berserker
=========
**Advanced web-based frontend for Aria2-JSONRPC.**

![Main interface](https://raw.github.com/adityamukho/Berserker/master/screenshot.png)

Features
--------
1. *Node.js* backend to manage the aria process, create destination and config directories, etc.
1. You can shut down the Node.js backend as well as the web-frontend and aria will keep downloading in the backround. Fire up the server and web ui anytime later to get a status update.
1. JSON-based transport to ensure lightweight and fast data transfers with minimal markup overhead.
1. Uses websockets to communicate with aria process. Will have support for websockets in the browser side soon.

Install
-------
1. Install [Aria 2](http://aria2.sourceforge.net/) from the site or from your distribution's package repositories.
2. Install [Node.js](http://nodejs.org/) (and NPM) from the site or from your distribution's package repositories.
2. `$ sudo npm install -g berserker`
    
Run
---
1. (First Run) `$ berserker`
1. This will create file `settings.json` under the `$HOME/.berserker` folder.
1. Edit `settings.json`.
    1. Keys in the *aria2c* property should be valid aria2c options (POSIX long version) without the '--'.
    1. Any value enclosed in curly braces (like {HOME}) will be replaced by the value of the corresponding environment variable.
1. `$ berserker`
1. Open <http://localhost:8000/> (Or whatever port you have set in `$HOME/.berserker/settings.json`).

Notes
-----
1. Your Aria2 executable must have support compiled for the *aria2.multicall* function. 
1. If aria was not built with websocket support, use the restify or http connector instead (See settings.json).
