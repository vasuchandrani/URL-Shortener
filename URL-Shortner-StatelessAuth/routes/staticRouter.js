const express = require('express');
const { create } = require('../models/url');

const router = express.Router();

router.get('/', async (req, res) =>{
    
    if (!req.user) return res.render('login');

    const allurls = await URL.find({ createdBy: req.user._id });

    return res.render("home", {
        urls: allurls
    });
})

router.get('/signup', (req,res)=>{
    return res.render('signup');
})

router.get('/login', (req,res)=>{
    return res.render('login');
})

module.exports = router;
