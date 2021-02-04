const express = require("express"),
      bodyParser = require("body-parser"),
      cors = require("cors"),
      path = require("path"),
      passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      session = require("express-session"),
      bcrypt = require("bcryptjs"),
      db = require("./db.js"),
      app = express(),
      http = require('http').Server(app),
      io = require('socket.io')(http);

let HTTP_PORT = process.env.PORT || 8080;
//deployed on https://radiant-woodland-06944.herokuapp.com/
app.use(bodyParser.urlencoded({parameterLimit: 100000,
                                limit: '50mb',
                                extended: true}));

//Enable cross origin
//app.use(cors());

//User authentication
app.use(session({secret: "weeb"}));
app.use(passport.initialize());
app.use(passport.session());

//Use custom strategy to authenticate user credentials
passport.use(new LocalStrategy( (username, password, done) => {
  const user = { username, password };
  db.login(user)
    .then( (foundUser) => {
      return done(null, foundUser);
    })
    .catch( (err) => {
      console.log(err);
      return done(null, false, { message: err});
    })
}));

//Serialize user data into session cookies
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

//GET ROUTES
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/index.html"));
});

app.get("/api/find/:username", (req, res) => {
  db.getUser(req.params.username)
  .then( (foundUser) => res.send(foundUser))
  .catch( () => res.send("none"))
})

app.get("/api/getAllUsers", (req, res) => {
  db.getAllUsers()
  .then( (users) => res.send(users))
  .catch( () => res.send(""))
})

app.post("/api/get-users-distance", (req, res) => {
  db.getUsersDist(req.body)
  .then( (users) => {
    console.log(users.length)
    res.send(users)
  })
  .catch( (err) => res.send(err))
})

//USER AUTH ROUTES
app.post("/register", (req, res) => {
  db.registerUser(req.body)
    .then( (newUser) => {
      res.send(newUser);
    })
    .catch ( (err) => {
      res.send(err);
    })
})

//Upload image
app.post("/images/:id", (req, res) => {
  let images = [];

  for (const key in req.body) {
    images.push(req.body[key]);
  }

  db.uploadImage(req.params.id, images)
  .then( (user) => {
    res.send(user);
  })
  .catch( () => {
    res.send("no");
  })
})

app.post("/login", passport.authenticate('local'), (req, res) => {
  if (req.user) {
    res.send(req.user);
  } else {
    res.send("fail");
  }
})

app.get('/logout', function(req, res){
  req.logout();
  res.send("logged out");
});

//UPDATE USER
app.put("/api/user", (req, res) => {
  db.updateUser(req.body)
    .then( (updatedUser) => {
      res.send(updatedUser);
    })
    .catch( (err) => {
      res.status(500).send(err);
    })
})

//DELETE USER
app.delete("/api/user/:id", (req, res) => {
  db.deleteUser(req.params.id)
  .then( () => {
    res.send("success");
  })
  .catch( (err) => {
    res.status(500).send(err);
  })
})

//ADD MATCH
app.post("/api/user/new-match", (req, res) => {
  //Update current user
  db.updateUser(req.body.curr)
  .then( () => {

    //Update matched user
    db.updateUser(req.body.match)
    .then( () => {
      res.send("success")
    })
    .catch((err) => {
      res.status(500).send(err);
    })

  })
  .catch( (err) => {
    res.status(500).send(err);
  })
})

app.post("/api/create-conversation", (req, res) => {
  db.createConversation(req.body)
  .then( (response) => {
    res.send(response);
  })
  .catch( err => res.send(err));
})

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("send message", (messageData) => {
    //socket.broadcast.emit("from server", messageData);
    console.log(messageData);
    db.saveMessage(messageData)
    .then( (newMessages) => {
      console.log(newMessages);
      socket.broadcast.emit("from server", newMessages);
    })
    .catch( (err) => console.log(err));
  })
})



db.initialize()
.then( () => {
  http.listen(HTTP_PORT, () => {
    console.log("app listening on: " + HTTP_PORT);
  });
})
