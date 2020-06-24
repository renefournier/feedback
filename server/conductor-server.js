const Server = require("ws").Server;
const Geoip = require("geoip-lite");
const port = process.env.PORT || 4545;
const log = require("./lib/helpers").log;

const responder = require("./lib/responder");
global.wss = new Server({ port });

global.ViewEventClients = {}; // hi

let connectionCounter = 0;
wss.on(
  "connection",
  (connection = (ws, req) => {
    connectionCounter++;
    ws.upgradeReq = req;
    const clientID = req.headers["sec-websocket-key"];
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const geo = Geoip.lookup(ip);
    const connectionNumber = connectionCounter;
    ws.meta = {
      connected: new Date(),
      connectionNumber: connectionNumber,
      clientID: clientID,
      ip: ip,
      geo: geo,
      isAlive: true,
      isViewing: null
    };
    console.log(
      `+ New connection: ${connectionNumber} ${clientID} (${ws.meta.geo} (${ws.meta.ip})). ${wss.clients.size} clients.`
    );

    ws.heartbeat = setInterval(function ping() {
      if (ws.meta.isAlive === false) {
        return ws.terminate();
      } else {
        ws.meta.isAlive = false;
        ws.ping(noop);
        // ws.send(JSON.stringify({ msg: "hi" }));
      }
    }, 12000); // 12 seconds, just to be safe

    ws.on("pong", heartbeat);
    ws.on("message", responder);
    ws.on("message", () => {
      log(`  ${wss.clients.size} clients.`);
    });
    ws.on("undefined", msg => log(`? ${msg}`));
    ws.on(
      "close",
      (close = () => {
        const elasped_seconds = Math.round(
          (new Date() - ws.meta.connected) / 1000
        );
        const closingMessage = `x Closing: ${ws.meta.clientID} (${ws.meta.geo} (${ws.meta.ip})) after ${elasped_seconds} seconds.`;
        log(closingMessage);
      })
    );
  })
);

const numClients = setInterval(function numClients() {
  // console.log(wss.clients);

  let connectionNumbers = [];
  for (const ws of wss.clients) {
    // console.log(ws.meta);
    connectionNumbers.push(`${ws.meta.connectionNumber}`);
  }

  log(`  ${wss.clients.size} clients: ${connectionNumbers.join(" ")}`);
}, 30000); // 12 seconds, just to be safe

function heartbeat() {
  // log(`❤️ ${new Date()}: ${this.meta.clientID}`);
  this.meta.isAlive = true;
}

function noop() {}

function announce(channel, data) {
  log("* announcing *");
  wss.clients.forEach(client => {
    if (client.channel === channel && client.readyState === WebSocket.OPEN) {
      log("--> ClientID: ", client.channel);
      client.send(JSON.stringify({}));
    }
  });
}
