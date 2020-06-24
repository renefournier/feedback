"use strict";

module.exports = {
  base_url: process.env.FB_URL || "http://local.mcmxiv.com/feedback",
  port: process.env.FB_PORT || "5000",

  pg: {
    host: process.env.DB_HOST || "127.0.0.1",
    database: process.env.DB_NAME || "feedback_1",
    username: process.env.DB_USER || "rene",
    password: process.env.DB_PASSWORD || "",
    dialect: "postgres",
    timezone: "+07:00",
    time_zone: "America/Edmonton",
    logging: console.log,
  },

  debug: true,
};
