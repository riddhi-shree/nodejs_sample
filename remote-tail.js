(function() {
    var childProcess = require("child_process");
    var oldSpawn = childProcess.spawn;
    function mySpawn() {
        console.log('spawn called');
        console.log(arguments);
        var result = oldSpawn.apply(this, arguments);
        return result;
    }
    childProcess.spawn = mySpawn;
})();

var sys = require('sys'),
    spawn = require('child_process').spawn,

    // args from command line
    filename, servers;


if (process.argv.length < 4) {
  return sys.puts("Usage: node remote-tail.js filename server1 [serverN]");
}

filename = process.argv[2];
servers  = process.argv.slice(3);

function writeData(host, data) {
  console.log(host + ": " + data);
}

function readData(host, data) {
  var lines = data.toString().split("\n")
  for (var i = 0, len = lines.length; i < len; i++) {
    if (lines[i].length > 0) {
      writeData(host, lines[i])
    }
  }
}

for (var x = 0, len = servers.length; x < len; x++) {
  var server = servers[x];

  // Look at http://nodejs.org/api.html#_child_processes for detail.
  var tail = spawn("ssh", [server, "tail", "-f", filename]);

  tail.stdout.on("data", function(data) {
    readData(server, data);
  });
}

//IP:- 10.8.60.155
//Credentials:- ciqt01/ciqt01
//Log location:- /opt/ciqt01/APPServer/profiles/KWS/logs/server1
//Unix command to see the log :- tail –f SystemOut.log
