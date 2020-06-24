"use strict";

const config = require("config");
const Sequelize = require("sequelize");

const EventsModel = require("../Models/events");
const PartsModel = require("../Models/parts");
const RatingsModel = require("../Models/ratings");

// INIT DB

var sequelize = new Sequelize(
  config.pg.database,
  config.pg.username,
  config.pg.password,
  {
    dialect: config.pg.dialect,
    // dialectOptions: {
    // 	socketPath: config.pg.dialectOptions.socketPath
    // },
    host: config.pg.host,
    logging: config.pg.logging,
    pool: config.pg.pool || {
      max: 5,
      min: 0,
      idle: 10000
    },
    define: {
      timestamps: false
    }
  }
);

// TEST DB

sequelize
  .query("SELECT name FROM events ORDER BY id")
  .then(function(res) {
    console.log(JSON.stringify(res));
  })
  .catch(function(err) {
    console.error(err);
    process.exit(0);
  })
  .finally(() => {
    console.log("---DB seems OK---");
  });

// INIT MODELS

const Events = EventsModel(sequelize, Sequelize);
const Parts = PartsModel(sequelize, Sequelize);
const Ratings = RatingsModel(sequelize, Sequelize);

// ACCOUNTS

Events.hasMany(Parts, {
  foreignKey: "event_id"
});

Events.hasMany(Ratings, {
  foreignKey: "event_id"
});

// PARTS

Parts.belongsTo(Events, {
  foreignKey: "event_id"
});

Parts.hasMany(Ratings, {
  foreignKey: "part_id"
});

// RATINGS

Ratings.belongsTo(Events, {
  foreignKey: "event_id"
});

Ratings.belongsTo(Parts, {
  foreignKey: "part_id"
});

const DB = {
  sequelize: sequelize,
  Op: Sequelize.Op,
  events: Events,
  parts: Parts,
  ratings: Ratings
};

module.exports = DB;
