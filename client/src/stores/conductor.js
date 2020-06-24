// WEB SOCKET STUFF

let host;
if (window.location.hostname === "localhost") {
  host = "ws://localhost:4545";
} else {
  host = "wss://www.mcmxiv.com/feedback/ws";
}

const url = `${host}`;
console.log(url);
let now;

console.log(". Opening...");
const connection = new WebSocket(url);

connection.onopen = () => {
  console.log("+ Connection open");
};

connection.fetch = msg => {
  // console.log(msg);
  connection.send(JSON.stringify(msg));
};

connection.onclose = e => {
  let elapsed = (new Date() - now) / 1000;
  console.log(
    `x WebSocket closed: ${JSON.stringify(e)} after ${elapsed} seconds`
  );
  setTimeout(function() {
    location.reload();
  }, 5000);
};

connection.onerror = error => {
  console.log(`! WebSocket error: ${JSON.stringify(error)}`);
};

connection.onmessage = e => {
  try {
    const data = JSON.parse(e.data);
    console.log("-->", data);
    // SEND EVENT AS OBJECT
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
};

module.exports = connection;
