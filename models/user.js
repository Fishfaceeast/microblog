var mongodb = require('./db');
const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';
const dbName = "microblog";

function User(user) {
    this.name = user.name;
    this.password = user.password;
};

// User.prototype.save = function save(callback) {
//   var user = {
//     name: this.name,
//     password: this.password
//   }
//   mongodb.open((err, db) => {
//     if(err) {
//       mongodb.close();
//       return callback(err);
//     }
//     collection.ensureIndex('name', {unique: true});
//     collection.insert(user, {safe: true}, (err, user) => {
//       mongodb.close();
//       return callback(user);
//     })
//   })
// }

User.prototype.save = function save(callback) {
  var user = {
    name: this.name,
    password: this.password
  }
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

// User.get = function get(username, callback) {
//   mongodb.open((err, db) => {
//     if(err) {
//       return callback(err);
//     }
//     db.collection('user', (err, collection) => {
//       if(err) {
//         mongodb.close();
//         return callback(err);
//       }
//     })
//     collection.findOne({name: username}, (err, doc) => {
//       mongodb.close();
//       if(doc){
//         let user = new User(doc);
//         callback(err, user);
//       } else {
//         callback(err, null);
//       }
//     })
//   })
// }

User.get  = function get(username, callback) {
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

// class User {
//     constructor(user) {
//       this.name = user.name;
//       this.password = user.password;
//     }
//     save(callback) {
//       var user = {
//         name: this.name,
//         password: this.password
//       }
//       mongodb.open((err, db) => {
//         if(err) {
//           mongodb.close();
//           return callback(err);
//         }
//         collection.ensureIndex('name', {unique: true});
//         collection.insert(user, {safe: true}, (err, user) => {
//           mongodb.close();
//           return callback(user);
//         })
//       })
//     }

//     get(username, callback) {
//       console.log('xxxx')
//       mongodb.open((err, db) => {
//         if(err) {
//           return callback(err);
//         }
//         db.collection('user', (err, collection) => {
//           if(err) {
//             mongodb.close();
//             return callback(err);
//           }
//         })
//         collection.findOne({name: username}, (err, doc) => {
//           mongodb.close();
//           if(doc){
//             let user = new User(doc);
//             callback(err, user);
//           } else {
//             callback(err, null);
//           }
//         })
//       })
//     }
// }
module.exports = User;

 