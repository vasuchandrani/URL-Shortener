const express = require('express');
const router = express.Router();

const {generateNewURL, getAnalytics} = require('../controller/url');


router.post('/',generateNewURL);

router.get('/analytics/:shortId',getAnalytics)

module.exports=router;