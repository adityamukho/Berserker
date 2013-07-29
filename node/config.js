var util = require('./util'),
        settings = require('./settings.json'),
        mkdirp = require('mkdirp'),
        fs = require('fs');

//Init config file in user's home folder.
var path = process.env.HOME + '/.berserker';
try {
    mkdirp.sync(path, 0700);
    var settingsFile = path + '/settings.json';
    if (fs.existsSync(settingsFile)) {
        settings = require(settingsFile);
    }
    else {
        saveSettings();
    }
}
catch (err) {
    console.warn('WARNING: Cannot create folder "%s". Settings changes will not persist across runs.', path);
}

//Replace {ENV} placeholders with their actual values.
util.traverse(settings, function(obj, key, value) {
    if (typeof value === 'string') {
        obj[key] = value.replace(/\{[^\{\}]+\}/g, function(v) {
            return process.env[v.replace(/[\{\}]/g, '')];
        });
    }
});

//Check if config values are kosher.
var dirs = [settings.aria2c['save-session'], settings.aria2c['input-file'], settings.aria2c.log];
for (var i = 0; i < dirs.length; ++i) {
    if (typeof dirs[i] === 'string') {
        dirs[i] = dirs[i].substring(0, dirs[i].lastIndexOf('/'));
    }
}
dirs.push(settings.aria2c.dir);
for (var i = 0; i < dirs.length; ++i) {
    try {
        mkdirp.sync(dirs[i], 0700);
    }
    catch (err) {
        console.error('ERROR: Cannot create folder "%s".', dirs[i]);
        process.exit(1);
    }
}

var files = [settings.aria2c['save-session'], settings.aria2c['input-file'], settings.aria2c.log];
for (var i = 0; i < files.length; ++i) {
    try {
        var fd = fs.openSync(files[i], 'a');
        fs.close(fd);
    }
    catch (err) {
        console.error('ERROR: The file "%s" cannot be opened for writing.', files[i]);
        process.exit(1);
    }
}

//Register listener for config save.
util.eventEmitter.on('aria2.changeGlobalOption', function(options) {
    if (options) {
        for (var key in options[0]) {
            settings.aria2c[key] = options[0][key];
        }
        saveSettings();
    }
});

function saveSettings(path) {
    path = path || process.env.HOME + '/.berserker/settings.json';
    fs.writeFile(path, JSON.stringify(settings, null, 4),
            function(err) {
                if (err) {
                    console.error('ERROR: Cannot write to settings file "%s"',
                            err.path);
                }
                else {
                    console.log("INFO: Settings saved.");
                }
            });
}

module.exports = settings;