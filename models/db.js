const settings = require("../settings");
const DB = require("mongodb").Db; 
const Conection = require("mongodb").Conection; 
const Server = require("mongodb").Server; 

module.exports = new Db(setting.db, new Server(setting.host, Conection.DEFAULT_PORT, {}));