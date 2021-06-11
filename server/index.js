const express = require("express")
const app=express()
const http = require('http')
const server = http.createServer(app)
const bodyParser = require("body-parser")
const io = require("socket.io")(server, {cors: { origin: "*" }})
const mongoose = require("mongoose")
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require("passport-facebook").Strategy
const session = require("express-session")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const findOrCreate = require("mongoose-findorcreate")
const passportLocalMongoose = require("passport-local-mongoose")
const cors = require ("cors")
const multer = require ("multer")
const fs = require('fs')
const path = require ("path")
require("dotenv").config()


// App config **
app.use(cors({ origin: "http://localhost:3000", credentials: true})) // Enable getting requests from client
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"));
app.use(bodyParser.json());


// Reformating **
const { MONGO_URL, GOOGLE_CLIENT_SECRET, GOOGLE_CLIENT_ID, FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET, SERVER_URL, FRONT_URL } = process.env 

// Multer storage config **
const storage = multer.diskStorage({
  destination: function(request, file, callback){ // Define file destenation 
    callback(null, "./public/uploads")
  },
  filename: function(request, file, callback){ // Define file name
    callback(null, Date.now() + file.originalname)
  }
})

// Upload config **
const upload = multer({
  storage: storage,
  limit:{
    fieldSize: 1024*1024*3
  }
})

// Save session **
app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: true,
}))

app.use(passport.initialize())
app.use(passport.session())

// Mongoose config **
mongoose.connect( MONGO_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true
})

mongoose.set("useCreateIndex", true)


userSchema = new mongoose.Schema ({
  email: String,
  password: String,
  googleId: String,
  facebookId: String,
  profilePic: String,
  picPath: String
})
userSchema.plugin(passportLocalMongoose)
userSchema.plugin(findOrCreate)

messageSchema = {
  name: String,
  message: String,
  time: String,
}

const User = new mongoose.model("User", userSchema)
const Message = new mongoose.model("Message", messageSchema)

// Passport strategies **
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// Google auth config **
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: SERVER_URL + "/auth/google/sapochat",
  userProfileUrl: "https://www.googleapis.com/oauth2/v3/userinfo"
},
function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ googleId: profile.id }, function (err, user) {
    if (!user.username){
      User.findOneAndUpdate({googleId: profile.id}, {username: profile.name.givenName, profilePic: "https://www.biiainsurance.com/wp-content/uploads/2015/05/no-image.jpg"}, err => console.log(err))
    }
    return cb(err, user);
  });
}
));

// Facebook auth config **
passport.use(new FacebookStrategy({
  clientID: FACEBOOK_CLIENT_ID,
  clientSecret: FACEBOOK_CLIENT_SECRET,
  callbackURL: SERVER_URL + "/auth/facebook/sapochat"
},
function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ facebookId: profile.id }, function (err, user) {
    if (!user.username){
      //console.log(profile.id)
      User.findOneAndUpdate({facebookId: profile.id}, {username: profile.displayName, profilePic: "https://www.biiainsurance.com/wp-content/uploads/2015/05/no-image.jpg"}, err => console.log(err))
    }
    return cb(err, user);
  });
}
));

// --------------------------------------------SOCKET.IO HANDLE-----------------------------------------
let loggedUsers = [] // Logged users list

// Adds welcome message if DB is empty **
Message.find((err, messagesDB) =>{
  if (messagesDB.length==0){
    welcome = new Message({
      name:"Alert",
      message:"Hi welcome to sapochat v1.0 By Dekel & Nadav"
    })
    welcome.save()
  }
})

// Creates connection between back and front **
io.on('connection', (socket) => {

  // Runs when someone connect to chat **
  socket.on("details", async (name) => {

    // Finds user profile pic and name and send it to front **
    User.find({username: name}, (err, foundUser) => {
      if (foundUser[0]){ 
        const profilePic = foundUser[0].profilePic 

        loggedUsers.push({name: name, id: socket.id, profilePic: profilePic})
        newUser = new Message ({
          name: "Alert",
          message: name + " connected to chat!"
        })
        saveNewMess()
      } else {
        loggedUsers.push({name: name, id: socket.id})
        newUser = new Message ({
          name: "Alert",
          message: name + " connected to chat!"
        })
        saveNewMess()
      }
    }) 

    async function saveNewMess(){
      await newUser.save()

      // Returns somthing to client when enters chat **
      Message.find((err, messagesDB) => {
       if (!err){

          io.emit("details", messagesDB, loggedUsers)
        }
      })
    }
  })
  
  // Runs when recieves message from client **
  socket.on("message", ({name, message, time}) => {
    saveMess()

    async function saveMess(){

      // Saves new message in DB **
      message = new Message({
        name: name, 
        message: message,
        time: time
      })
      await message.save()

      Message.find((err, messagesDB)=>{
        if (!err){

          //Sends messages to client **
          io.emit("message", messagesDB )
        }
      })
    }       
  })

  //When user disconnect **
  socket.on("disconnect", () => {
    let leftUsername = loggedUsers.filter(user => user.id == socket.id)
    const newLoggedUsers = loggedUsers.filter(user => user.id != socket.id)
    loggedUsers = newLoggedUsers
    io.emit("userLeft", loggedUsers)

    if (leftUsername.length!=0){ 
      quitMessage = new Message ({
        name: "Alert",
        message: leftUsername[0].name + " left the chat!" 
      })
      saveLeftMess()
    }

    async function saveLeftMess(){
      await quitMessage.save()

      //Send user left message to users **
      Message.find((err, messagesDB) => {
       if (!err){
          io.emit("details", messagesDB, loggedUsers)
        }
      })
    } 
  })
})

// --------------------------------------------POST ROUTES-----------------------------------------

// Saves new user in database and authenticate him **
app.post('/server/register', function (req, res) {
  const { username, password } = req.body
  User.register({username: username}, password, function(err, user){
    if (err){
      res.send(err)
    } 
    else {
      passport.authenticate("local")(req, res, function() {
        User.findOneAndUpdate({username: username}, {profilePic: "https://www.biiainsurance.com/wp-content/uploads/2015/05/no-image.jpg"}, err => { // Insert default pic to database on every new user
          if (err){
            console.log(err)
          } else {
            res.send(true)
          }
        })
      })
    }
  })
})

// Authenticate user with entered details from login form **
app.post("/server/login", function(req, res){
  const { username , password } = req.body

  const user = new User({
    username: username,
    password: password
  })

  req.login(user,function(err){
    if(err){
      console.log(err)
    } else {
      passport.authenticate("local")(req, res, function() {
        res.send(true)
      })
    }
  })
})

// Change username in database **
app.post("/server/change-name", function(req, res){
  const userName = req.user.username
  const newUserName = req.body.changeName

  if (req.isAuthenticated()){
    User.findOneAndUpdate({username: userName}, {username: newUserName}, err => {
      if (err){
        res.send(err)
      } else {
        res.send(newUserName)
      }
    })
  } else {
    res.redirect(FRONT_URL)
  }
})

// Upload img **
app.post("/server/upload", upload.single("file"), async(req, res) => {

  if (req.isAuthenticated()){
    const {username} = req.user

    // Delete old img on reaplace **
    await User.find({username: username}, (err, foundUser) => {
      try{
        fs.unlinkSync(foundUser[0].picPath)
      } catch(err){
        console.log(err + "dellete error")
      }
    })

    await User.findOneAndUpdate({username: username}, {profilePic: SERVER_URL + "/public/uploads/" + req.file.filename, picPath: "./public/uploads/" + req.file.filename}, err => { // Insert new img to database
      if (!err){

        res.send(req.file.filename)
      } else {
        console.log(err)
      }
    })
  }
})
// --------------------------------------------GET ROUTES-----------------------------------------

// Checks if user is auth and sends username to client and redirect **
app.get("/server/profile", function(req, res){
  
  if (req.isAuthenticated()){   
    const {username} = req.user

    User.find({username: username}, (err, userProfile) => {
      if (!err){
        res.send(userProfile)
      }
    })
  } else {
    res.redirect( FRONT_URL + "/login")
  } 
})

// If user is auth and sends true if he is **
app.get("/server/auth", function(req, res){
  if (req.isAuthenticated()){    
    res.send(true)
  } else {
    res.redirect(FRONT_URL)
  } 
})

// Logout user **
app.get("/server/logout", function(req, res){
  req.logout()
  res.redirect( FRONT_URL + "/login")
})

// Google auth **
app.get("/server/auth/google", passport.authenticate("google", {
  scope: ['profile']
}));

app.get("/server/auth/google/sapochat",
passport.authenticate("google", { failureRedirect: FRONT_URL + "/login" }),
function(req, res) {
  res.redirect(FRONT_URL); // Successful authentication, redirect home
});

// Facebook auth **
app.get("/server/auth/facebook",
passport.authenticate("facebook", {scope: ['email']}));

app.get("/server/auth/facebook/sapochat",
passport.authenticate("facebook", { failureRedirect: FRONT_URL + "/login" }),
function(req, res) {
  // Successful authentication, redirect home.
  res.redirect(FRONT_URL);
});

app.get("/server/public/uploads/:picId", function(req, res){
  const picId = req.params.picId
  res.sendFile(__dirname + "/public/uploads/" + picId)
})

app.get("/server/check-user-exist/:username", function(req, res){
  const enteredName = req.params.username
  let userLogged = false

  User.find({username: enteredName}, (err, foundUser) => {

    for (i=0; i< loggedUsers.length; i++){
      if(loggedUsers[i].name===enteredName){
        userLogged = true
        break
      } else {
        userLogged = false
      }
    }

    if (foundUser[0] || userLogged){
      res.send(true)
    } else {
      res.send(false)
    }
  })
})


// --------------------------------------------END ROUTES-----------------------------------------

// If URL is not for API serves the React files staticly **
app.use(express.static(path.join("./client/build")))
app.use((req, res, next) => {
  res.sendFile(path.resolve(__dirname, "client/build", "index.html"))
})

// Port Config **
let port = process.env.PORT;
if (port == null || port == "") {
  port = 4000;
}

server.listen(port, function() {
  console.log(`server started running on port: ${port}`);
});
