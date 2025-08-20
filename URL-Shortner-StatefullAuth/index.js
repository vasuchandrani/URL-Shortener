const express = require('express');

const mongoose=require('mongoose');
const URL= require('./models/url')
const app= express();

mongoose.connect("mongodb://localhost:27017/shorturl") 
.then(() => {
    console.log("Connected to database!")
    app.listen(8001, () => {
        console.log('Server is running on 8001 port')
    });
}).catch(() => {
    console.log("Connection failed!")
})

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser());

const cookieParser = require('cookie-parser')
const { checkAuth, restrictToLoggedinUserOnly } = require('./middlewares/auth')

// routes
const staticRoute = require('./routes/staticRouter')
const urlRoute = require('./routes/url');
const userRoute = require('./routes/user')
app.use('/', staticRoute);
app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/user", checkAuth, userRoute);

// view engine
const path = require('path')
app.set("view engine", "ejs");
app.set("views", path.resolve("./views") )

app.get("/url/:shortId", async (req, res) => {
    
    const shortId = req.params.shortId;
    
    try {
        const entry = await URL.findOneAndUpdate(
            { 
                shortId
            },
            { 
                $push: { 
                    visitHistory: { 
                        timestamp: Date.now() 
                    } 
                } 
            }
        );

        if (!entry) {
            return res.status(404).send("Short URL not found");
        }

        console.log("Updated entry:", entry); 
        res.redirect(entry.redirectURL); 
    } 
    catch (error) {
        console.error("Error updating visitHistory:", error);
        res.status(500).send("An error occurred");
    }
});


