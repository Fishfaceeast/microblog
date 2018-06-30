var mongodb = require('./db');
const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';
const dbName = "microblog";

class Post {
    constructor({name, post, time}) {
      this.user = name;
      this.post = post;
      if(time) {
        this.time = time;
      } else {
        this.time = new Date();
      }
    }
    save(callback) {
      var post = {
        user: this.user,
        post: [
          { content:this.post, time: this.time}
        ],
      };
      MongoClient.connect(url,(err, client) => {
        const db = client.db(dbName);
        const col = db.collection('posts');
        Post.get(this.user, (err, user) => {
          if(user) {
            col.update({user: this.user}, {$push: {post: {content:this.post, time: this.time}} }, (err, post) => {
              client.close();
              return callback(err);
            });
          } else {
            col.update({user: this.user}, post, { upsert: true }, (err, post) => {
              client.close();
              return callback(err);
            });
          }
        });
        
        
      })
    }

    static get(username, callback) {
      MongoClient.connect(url,(err, client) => {
        const db = client.db(dbName);
        const col = db.collection('posts');
        let query = {};
        if(username) {
          query.user = username;
        }
        col.find(query).toArray((err, docs) => {
          if(docs && docs.length > 0){
            let rt = [];
            docs.forEach((doc, index) => {
              let posts = doc.post;
              const user = doc.user;
              posts = posts.map(item => {
                return {
                  ...item,
                  user
                }
              })
              rt = rt.concat(posts);
            });
            rt.sort((a, b) => b.time - a.time);
            callback(null, rt);
          } else {
            callback(err, null);
          }
          client.close();
        });
      })
    }
}
module.exports = Post;

 