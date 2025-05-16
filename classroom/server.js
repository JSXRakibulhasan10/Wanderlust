const express = require("express");
const app = express();
// const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash")

const sessionOptions = {
    secret: "mySuperSecretString",
    resave: false,
    saveUninitialized: true,
}
app.use(session(sessionOptions));
app.use(flash())

app.get("/register", (req, res) => {
  let {name} = req.query;
  res.send = name;
});

// app.get("/reqcount", (req, res) => {
//   if(req.session.count){
//     req.session.count++
//   } else {
    
//     req.session.count = 1;
//   }
//   res.send(`You sent a request ${req.session.count} times`);
// });

app.listen(5050, () => {
  console.log("Server listening to port 5050");
});   

