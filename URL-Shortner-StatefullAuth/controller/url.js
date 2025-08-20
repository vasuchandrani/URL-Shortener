const URL = require('../models/url');
const shortid = require("shortid");


async function generateNewURL(req,res) {
    
    const body = req.body;
    
    if (!body.url) {
        return res.status(400).json({error: 'url is required'})
    }
    
    const shortID = shortid(8);
    await URL.create({
        shortId: shortID,
        redirectURL: body.url,
        visitHistory:[],
        createdBy: req.user._id
    })

    return res.render('home', {
        id: shortID
    })
    // return res.json({id : shortID}); 
}

async function getAnalytics(req, res) {
    
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });

    if (!result) {
        return res.status(404).send("Short URL not found");
    }

    return res.json({
        id: shortId,
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    });
}


module.exports={
    generateNewURL,
    getAnalytics
}