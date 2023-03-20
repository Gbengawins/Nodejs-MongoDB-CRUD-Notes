require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
connectDB = require("./server/config/db");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("mongodb");

const app = express();

app.use(session({
    secret: "Jesus_is_Lord",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create,
    mongoUrl: process.env.MONGODB_URI
}));
//cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
  // Date.now() - 30 * 24 * 60 * 60 * 1000
// }));

app.use(passport.initialize());
app.use(passport.session());


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(methodOverride("_method"));

// connectDB();


//Static files
app.use(express.static("public"));

//Template Engine
app.use(expressLayouts)
app.set("layout", "./Layouts/main");
app.set("view engine", "ejs");

//Route handlers
app.get("/", () => { require("./server/routes/auth")});
app.get("/", () => {require("./server/routes/index")});
app.get("/", () => {require("./server/routes/dashboard")});

app.get("*", () => {
    res.status(404).render(404);
});


const PORT = process.env.PORT || 6090;
app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));