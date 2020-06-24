const DB = require("../config/sequelize"); // Deutsche Bahn AG is a German

const log = require("./helpers").log;
const flog = require("./helpers").flog;

async function responder(msg) {
  const start = new Date();

  let TX = {
    // MORE HAPPINESS IN GIVING THAN RECEIVING
    action: null,
    data: {},
    meta: { error: [] }
  };

  flog(`→ (${this.meta.connectionNumber}) ${msg}`);

  try {
    RX = JSON.parse(msg);
  } catch (e) {
    // console.error('!!!', e);
    const error = `? Not JSON: "${msg}"`;
    log(error);
    TX.meta.error.push(error);
    TX.meta.ms = new Date() - start;
    return this.send(JSON.stringify(TX));
  }

  if (!RX.action) {
    const error = `! Malformed packet: "${msg}"`;
    log(error);
    TX.meta.error.push(error);
    TX.meta.ms = new Date() - start;
    return this.send(JSON.stringify(TX));
  }

  TX.action = RX.action;

  switch (RX.action) {
    default:
      TX.meta.ms = new Date() - start;
      const error = `? Unknown command: "${msg}"`;
      log(error);
      TX.meta.error.push(error);
      return this.send(JSON.stringify(TX));

      break;
    case "/id": // RETURNS SOCKET ID
      TX.meta.ms = new Date() - start;
      TX.meta.id = this.meta.clientID;
      return this.send(JSON.stringify(TX));
      break;

    case "/uptime": // HOW LONG HAS THE SOCKET BEEN OPEN?
      TX.meta.ms = new Date() - start;
      TX.meta.uptime = elasped_seconds = Math.round(
        (new Date() - this.meta.connected) / 1000
      );
      return this.send(JSON.stringify(TX));
      break;

    case "/new-event": // RETURNS EVENT
      this.isViewing = null;
      // flog(RX);
      var name = RX.name;
      var organizer_name = RX.organizer_name;
      var organizer_pin = RX.organizer_pin;
      var view_key = RX.view_key;
      var rating_key = RX.rating_key;
      var parts = RX.parts;
      // console.log(name, view_key, rating_key, parts);
      var res;
      try {
        res = await DB.events.create({
          name: name,
          organizer_name: organizer_name,
          organizer_pin: organizer_pin,
          view_key: view_key,
          rating_key: rating_key
        });
      } catch (error) {
        flog(error);
      }
      if (res) {
        var event = res.toJSON();
        event.parts = [];
        parts.forEach(async name => {
          var newPart = await DB.parts.create({
            event_id: event.id,
            name: name
          });
          event.parts.push(newPart);
        });
      }
      TX.data = event;
      TX.meta.elapsed = new Date() - start;
      // flog(TX);
      return this.send(JSON.stringify(TX));
      break;

    case "/get-events": // RETURNS EVENT
      // flog(RX);
      var organizer_name = RX.organizer_name;
      var organizer_pin = RX.organizer_pin;
      var events;
      try {
        events = await DB.events.findAll({
          where: {
            organizer_name: organizer_name,
            organizer_pin: organizer_pin
          },
          order: [["id", "DESC"]]
          // logging: console.log
        });
      } catch (error) {
        flog(error);
      }
      if (events) {
        TX.data = events;
      }
      TX.meta.elapsed = new Date() - start;
      // flog(TX);
      return this.send(JSON.stringify(TX));
      break;

    case "/rate-event": // RETURNS EVENT
      this.isViewing = null;
      var key = RX.key;
      var name = RX.user.name || "";
      var pin = RX.user.pin || "";
      var event = await DB.events.findOne({
        attributes: ["id", "created", "updated", "name"],
        where: {
          rating_key: key
        },
        include: [
          {
            model: DB.parts,
            include: {
              model: DB.ratings,
              where: {
                listener_name: name,
                listener_pin: pin
              },
              required: false
            }
          }
        ],
        order: [[{ model: DB.parts }, "id", "ASC"]],
        logging: false
      });
      // console.log(event);
      if (event) {
        TX.data = event.toJSON();
      }
      TX.meta.elapsed = new Date() - start;
      // flog(TX);
      return this.send(JSON.stringify(TX));
      break;

    case "/rate-part": // RETURNS RATING FOR PART
      this.isViewing = null;
      // flog("RX");
      // flog(RX);
      var key = RX.key;
      var part = RX.part;
      var name = RX.user.name;
      var pin = RX.user.pin;

      var point = RX.point; // OPTIONAL
      var opinion = RX.opinion; //
      const [rating, created] = await DB.ratings.findOrCreate({
        where: {
          event_id: part.event_id,
          part_id: part.id,
          listener_name: name,
          listener_pin: pin
        },
        logging: null
      });
      if (point && part) {
        // UPDATE ONE
        if (rating[point.study] === null) {
          rating[point.study] = opinion;
        } else if (rating[point.study] === opinion) {
          rating[point.study] = null;
        } else {
          rating[point.study] = opinion;
        }
      }
      rating.comments = part.ratings[0] ? part.ratings[0].comments : "";

      var res = await rating.save({
        // logging: console.log
      });
      TX.data = res.toJSON();
      const updated = await updateViewers(part.event_id);
      TX.meta.elapsed = new Date() - start;
      return this.send(JSON.stringify(TX));
      break;

    case "/view-event": // RETURNS EVENT
      TX.meta.elapsed = new Date() - start;
      var key = RX.key;
      var event = await DB.events.findOne({
        attributes: ["id", "created", "updated", "name"],
        where: {
          view_key: key
        },
        include: [
          {
            model: DB.parts,
            include: [
              {
                model: DB.ratings
              }
            ]
          }
        ],
        order: [[{ model: DB.parts }, "id", "ASC"]]
      });
      const json = event.toJSON();
      // flog(json);
      TX.data = event;
      this.isViewing = event.id;
      return this.send(JSON.stringify(TX));
      break;

    case "/remove-event": // RETURNS EVENT
      TX.meta.elapsed = new Date() - start;
      var id = RX.id;
      var organizer_name = RX.organizer_name;
      var organizer_pin = RX.organizer_pin;
      var res;
      try {
        res = await DB.events.destroy({
          where: {
            id: id,
            organizer_name: organizer_name,
            organizer_pin: organizer_pin
          },
          logging: console.log
        });
      } catch (error) {
        console.error(error);
        TX.meta.error.push(error);
      }

      flog(res);
      TX.data = res;
      return this.send(JSON.stringify(TX));
      break;

    case "/bye": // TELLS SERVER TO TERMINATE SOCKET
      return this.terminate();
      break;
  }
}

function makeid() {
  // JUST A RANDOM STRING GENERATOR, SO THE REDIS KEYS ARE UNIQUE
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 16; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

async function updateViewers(event_id) {
  console.log("... Updating Viewers ...");
  const start = new Date();

  let TX = {
    // MORE HAPPINESS IN GIVING THAN RECEIVING
    action: "/view-event",
    data: {},
    meta: { error: [] }
  };

  var event = await DB.events.findOne({
    attributes: ["id", "created", "updated", "name"],
    where: {
      id: event_id
    },
    include: [
      {
        model: DB.parts,
        order: ["id", "ASC"],
        include: [{ model: DB.ratings }]
      }
    ],
    order: [[{ model: DB.parts }, "id", "ASC"]]
  });
  const json = event.toJSON();
  // flog(json);
  TX.data = json;
  TX.meta.elapsed = new Date() - start;
  wss.clients.forEach(ws => {
    if (ws.isViewing === event_id && ws.readyState === ws.OPEN) {
      log("--> ClientID: ", ws.clientID);
      ws.send(JSON.stringify(TX));
    }
  });
  return;
}

module.exports = responder;
