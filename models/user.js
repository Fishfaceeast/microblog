var mongodb = require('./db');
const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';
const dbName = "microblog";

class User {
    constructor(user) {
      this.name = user.name;
      this.password = user.password;
    }
    save(callback) {
      var user = {
        name: this.name,
        password: this.password
      };
      MongoClient.connect(url,(err, client) => {
        const db = client.db(dbName);
        const col = db.collection('inserts');
    
        col.ensureIndex('name', {unique: true});
        col.insertOne(user, (err, user) => {
          client.close();
          return callback(err);
        });
      })
    }

    static get(username, callback) {
      MongoClient.connect(url,(err, client) => {
        const db = client.db(dbName);
        const col = db.collection('inserts');
    
        col.find({name: username}).toArray((err, docs) => {
          if(docs && docs.length > 0){
            let user = new User(docs[0]);
            callback(err, user);
          } else {
            callback(err, null);
          }
          client.close();
        });
      })
    }
}
module.exports = User;

 