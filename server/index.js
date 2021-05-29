const express = require("express")
const app=express()
const http = require('http')
const server = http.createServer(app)
const bodyParser = require("body-parser")
const io = require("socket.io")(server, {cors: { origin: "*" }})
const mongoose = require("mongoose")
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require("express-session")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const findOrCreate = require("mongoose-findorcreate")
const passportLocalMongoose = require("passport-local-mongoose")
const cors = require ("cors")
const multer = require ("multer")
const path = require("path")
require("dotenv").config()


// App config **
app.use(cors({ origin: "http://localhost:3000", credentials: true})) // Enable getting requests from client
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"));
var nameInStorage = ""

// Reformating **
const { MONGO_URL, GOOGLE_CLIENT_SECRET, GOOGLE_CLIENT_ID } = process.env 

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
mongoose.connect(MONGO_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true
})

userSchema = new mongoose.Schema ({
  email: String,
  password: String,
  profilePic: String
})
userSchema.plugin(passportLocalMongoose)
userSchema.plugin(findOrCreate)

messageSchema = {
  name: String,
  message: String,
  time: String
}

const User = new mongoose.model("User", userSchema)
const Message = new mongoose.model("Message", messageSchema)

//Passport strategies **
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

//google auth config **
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000"
},
function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ googleId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
));

// --------------------------------------------SOCKET.IO HANDLE-----------------------------------------
let loggedUsers = [] // Logged users list

//Adds welcome message if DB is empty **
Message.find((err, messagesDB) =>{
  if (messagesDB.length==0){
    welcome = new Message({
      name:"Developer",
      message:"Hi welcome to sapochat v1.0 By Dekel & Nadav"
    })
    welcome.save()
  }
})

// Creates connection between back and front **
io.on('connection', (socket) => {

  // Runs when someone connect to chat **
  socket.on("details", (name) => { 
    // User.find({username: name}, (err, foundUser) => {
    //   if (foundUser[0]){ 
    //    const profilePic = foundUser[0].profilePic 

    //    loggedUsers.push({name: name, id: socket.id, profilePic: profilePic})
    //    newUser = new Message ({
    //      name: "Alert",
    //      message: name + " connected to chat!"
    //    })
    //   } else {
    //     loggedUsers.push({name: name, id: socket.id})
    //     return newUser = new Message ({
    //       name: "Alert",
    //       message: name + " connected to chat!"
    //     })
    //   }
    // }) 
    
    loggedUsers.push({name: name, id: socket.id})
    newUser = new Message ({
      name: "Alert",
      message: name + " connected to chat!"
    })

    saveNewMess()
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
app.post('/register', function (req, res) {
  const { username, password, confirmPassword } = req.body
  if (password === confirmPassword) {
    User.register({username: username}, password, function(err, user){
      if (err){
        res.redirect("http://localhost:3000/register")
        console.log(err)
      } 
      else {
        passport.authenticate("local")(req, res, function() {
          User.findOneAndUpdate({username: username}, {profilePic: "https://www.biiainsurance.com/wp-content/uploads/2015/05/no-image.jpg"}, err => { // Insert default pic to database on every new user
            if (err){
              console.log(err)
            } 
          })
          res.redirect("http://localhost:3000/")
        })
      }
    })
  } else {
    console.log("password does not match")
  }
})

// Authenticate user with entered details from login form **
app.post("/login", function(req, res){
  const { username , password } = req.body

  const user = new User({
    username: username,
    password: password
  })

  req.login(user,function(err){
    if(err){
      console.log(err)
      res.redirect("http://localhost:3000/login")
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("http://localhost:3000/")
      })
    }
  })
})

// Change username in database **
app.post("/change-name", function(req, res){
  const userName = req.user.username
  const newUserName = req.body.changeName

  if (req.isAuthenticated()){
    User.findOneAndUpdate({username: userName}, {username: newUserName}, err => {
      if (!err){
        res.redirect("http://localhost:3000/profile")
      }
    })
  } else {
    res.redirect("http://localhost:3000/")
  }
})

// Upload img **
app.post("/upload", upload.single("file"), async(req, res) => {

  if (req.isAuthenticated()){
    const {username} = req.user
    await User.findOneAndUpdate({username: username}, {profilePic: "http://localhost:4000/public/uploads/" + req.file.filename}, err => { // Insert new img to database
      if (!err){
        //res.redirect("http://localhost:3000/profile")
        res.send(req.file.filename)
      } else {
          console.log(err)
      }
    })
  }
})
// --------------------------------------------GET ROUTES-----------------------------------------

// Checks if user is auth and sends username to client and redirect **
app.get("/profile", function(req, res){
  
  if (req.isAuthenticated()){   
    const {username} = req.user

    User.find({username: username}, (err, userProfile) => {
      if (!err){
        res.send(userProfile)
      }
    })
  } else {
    res.redirect("http://localhost:3000/login")
  } 
})

// If user is auth and sends true if he is **
app.get("/auth", function(req, res){
  if (req.isAuthenticated()){    
    res.send(true)
  } else {
    res.redirect("http://localhost:3000/")
  } 
})

// Logout user **
app.get("/logout", function(req, res){
  req.logout()
  res.redirect("http://localhost:3000/login")
})

// Google auth **
app.get("/auth/google", passport.authenticate("google", {
  scope: ['profile']
}));

app.get("/auth/google/sapochat",
passport.authenticate("google", { failureRedirect: "/login" }),
function(req, res) {
  res.redirect('http://localhost:3000/'); // Successful authentication, redirect home
});

app.get("/public/uploads/:picId", function(req, res){
  const picId = req.params.picId
  res.sendFile(__dirname + "/public/uploads/" + picId)
})

// --------------------------------------------END ROUTES-----------------------------------------

// Port Config **
let port = process.env.PORT;
if (port == null || port == "") {
  port = 4000;
}

server.listen(port, function() {
  console.log(`server started running on port: ${port}`);
});

