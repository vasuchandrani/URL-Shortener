const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');

const URL = require('./models/url');
const { checkAuth, restrictToLoggedinUserOnly } = require('./middlewares/auth');

const app = express();

// connect to MongoDB
mongoose.connect("mongodb://localhost:27017/shorturl1")
.then(() => {
    console.log("Connected to database!");
    app.listen(8002, () => {
        console.log('Server is running on 8002 port');
    });
})
.catch(() => {
    console.log("Connection failed!");
});

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(checkAuth);

// view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// routes
const staticRoute = require('./routes/staticRouter');
const urlRoute = require('./routes/url');
const userRoute = require('./routes/user');

app.use('/', staticRoute);
app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);


app.get("/url/:shortId", async (req, res) => {
    const shortId = req.params.shortId;

    try {
        const entry = await URL.findOneAndUpdate(
            { shortId },
            {
                $push: {
                    visitHistory: { timestamp: Date.now() }
                }
            },
            { new: true }
        );

        if (!entry) {
            return res.status(404).send("Short URL not found");
        }

        return res.redirect(entry.redirectURL);
    } catch (error) {

        return res.status(500).send("An error occurred");
    }
});