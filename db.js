const mongoose = require("mongoose"),
      bcrypt = require("bcryptjs");

function checkDistance(d1, d2) {
  var R = 6371.0710; // Radius of the Earth in km
  var rlat1 = d1.latitude * (Math.PI/180); // Convert degrees to radians
  var rlat2 = d2.latitude * (Math.PI/180); // Convert degrees to radians
  var difflat = rlat2-rlat1; // Radian difference (latitudes)
  var difflon = (d1.longitude-d2.longitude) * (Math.PI/180); // Radian difference (longitudes)

  var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
  return d;
}

let Schema = mongoose.Schema;
mongoose.set('useFindAndModify', false);

const userSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  firstName: String,
  lastName: String,
  password: String,
  age: String,
  email: {
    type: String,
    unique: true
  },
  bio: String,
  images: [String],
  favs: [{id: String, title: String}],
  favObj: Schema.Types.Mixed,
  location: {
    latitude: Number,
    longitude: Number
  },
  matches: [{id: String, didMatch: Boolean}],
  matchDistance: {type: Number, default: 0},
  dislikes: [],
  conversations: [{type: Schema.Types.ObjectId, ref: "conversations"}]
})

const conversationSchema = new Schema({
  users: {
    "0": {type: Schema.Types.ObjectId, ref: "users"},
    "1": {type: Schema.Types.ObjectId, ref: "users"}
  },
  messages: [Schema.Types.Mixed]
})

let User;
let Conversations;

module.exports.initialize = () => {
  return new Promise( (resolve, reject) => {
    const prodDb = "mongodb+srv://mtweb:passpass123@senecaweb-plw76.mongodb.net/weeaboo?retryWrites=true&w=majority";
    let db = mongoose.createConnection(prodDb);

    db.on("error", (err) => {
      reject(err);
    })

    db.once("open", () => {
      User = db.model("users", userSchema);
      Conversations = db.model("conversations", conversationSchema);
      console.log("Db running")
      //User.updateMany({ username: "/test/i"}, {matchDistance: 0});
      resolve();
    })
  })
}

module.exports.registerUser = (userData) => {
  return new Promise( (resolve, reject) => {

    //Hash the password so we do not store it in plain text
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(userData.password, salt, (err, hash) => {
        if (err) {
          reject("There was an error encrypting the password");
        } else {
          userData.password = hash;

          let newUser = new User(userData);
          newUser.save( (err) => {
            if (err) {

              if (err.code === 11000) {
                //Check if error is due to already registered email or username
                if (err.keyValue.email) {
                  reject("Email is already registered");
                } else {
                  reject("User name already taken");
                }

              } else {
                reject(`There was an error creating the user: ${err}`)
              }

            } else {
              resolve(newUser);
            }
          })

        }
      })
    })
  })
}

module.exports.login = (user) => {
  return new Promise( (resolve, reject) => {

      //Find user if they exist
      User.findOne({ username: user.username }).populate("conversations").exec()
          .then( (foundUser) => {

            //Compare the hashed password with the password supplied
            bcrypt.compare(user.password, foundUser.password)
              .then( (response) => {
                if (response) {
                  resolve(foundUser);
                } else {
                  reject();
                }
              })

          })
          .catch( (err) => {
            reject("No user found");
          })

  })

}

module.exports.getUser = (username) => {
  return new Promise( (resolve, reject) => {
    User.findOne({username}).exec()
    .then( (foundUser) => {
      resolve(foundUser);
    })
    .catch( (err) => {
      reject("No user found");
    })
  })
}

module.exports.getAllUsers = () => {
  return new Promise( (resolve, reject) => {
    User.find().exec()
    .then( (users) => {
      if (users.length > 0) {
        resolve(users);
      } else {
        reject("no users")
      }
    })
    .catch( () => reject("server error"))
  })
}

module.exports.getUsersDist = (query) => {
  return new Promise( (resolve, reject) => {
    User.find().exec()
    .then( (users) => {
      if (users.length > 0) {

        query.currLoc.latitude = parseFloat(query.currLoc.latitude);
        query.currLoc.longitude = parseFloat(query.currLoc.longitude);



        const goodUsers = users.filter((user) => {
          // console.log("user")
          // console.log(typeof user._id.toString());
          // console.log("query")
          // console.log(typeof query.curr)
          console.log("string check")
          console.log(user._id.toString().localeCompare(query.curr.toString()) !== 0);
          console.log("distance check")
          console.log(checkDistance(user.location, query.currLoc) <= parseFloat(query.dist));
          return (user._id.toString().localeCompare(query.curr.toString()) !== 0  && checkDistance(user.location, query.currLoc) <= parseFloat(query.dist));
        })

        console.log(goodUsers.length)

        resolve(goodUsers);

      } else {
        console.log("no users")
        reject();
      }
    })
    .catch( () => reject("failed fetch"))
  })
}

module.exports.updateUser = (update) => {
  return new Promise( (resolve, reject) => {

    //Find user to update
    if (!update.username) {
      reject("Empty object");
    } else {
      User.findOneAndUpdate({ _id: update._id }, update, { new: true }, (err, updated) => {
        if (err) {
          reject(err);
        } else {
          resolve(updated);
        }
      })
    }
  })
}

module.exports.deleteUser = (_id) => {
  return new Promise( (resolve, reject) => {
    User.deleteOne({ _id }, (err) => {
        if (!err) {
          resolve();
        } else {
          reject("fail");
        }
      })

  })
}

module.exports.uploadImage = (_id, images) => {
  return new Promise( (resolve, reject) => {
    User.findOneAndUpdate({_id}, {images}, {new : true}, (err, updated) => {
      if (err) {
        reject(err);
      } else {
        resolve(updated);
      }
    })
  })
}

module.exports.createConversation = (users) => {
  return new Promise( (resolve, reject) => {
    let convData = {
      users,
      messages: []
    }
    
    let newConv = new Conversations(convData)
    newConv.save( (err) => {
      if (err) {
        reject(err);
      } else {

        console.log(mongoose.Types.ObjectId(users["0"]));
        User.findById(mongoose.Types.ObjectId(users["0"]), (err, user1) => {
          if (!err) {
            console.log(newConv)
            
            user1.conversations.push(newConv._id);
            console.log(user1.conversations);
            
            user1.save( (err) => {
              if (!err) {
                User.findById(mongoose.Types.ObjectId(users["1"]), (err, user2) => {
                  if (!err) {
                    user2.conversations.push(newConv._id);
                    user2.save( (err) => {
                      if (!err) {
                        resolve(newConv);
                      } else {
                        console.log(err)
                        reject("could not save array");
                      }
                    })
                  } else {
                    console.log(err)
                    reject("could not save array");
                  }
                })
              } else {
                console.log(err);
                reject("could not save array");
              }
            })
          }
        })
      }
    })
  })
}

module.exports.saveMessage = (messageData) => {
  return new Promise( (resolve, reject) => {
    Conversations.findById(mongoose.Types.ObjectId(messageData.conversationID), (err, conversation) => {
      if (!err) {
        conversation.messages = messageData.msgs;
        conversation.save( (err) => {
          if (!err) {
            resolve(conversation.messages);
          } else {
            reject(err);
          }
        })
      } else {
        reject(err);
      }
    })
  })
  
}
