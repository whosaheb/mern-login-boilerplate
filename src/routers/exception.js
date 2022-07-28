const express = require("express");
const router = express.Router();
const { resolve } = require('path');

//serve the react bundle
router.use('/', express.static('../../client/build/'));
router.get('/', (req, res) => {
    res.sendFile(resolve(__dirname, '../..', 'client', 'build', 'index.html')); // index is in /client/build
});

router.use((req, res, next) => {  // Handling non matching request from the client
    res.status(404).json({
        error: `The requested URL ${req.url} was not found on this.`
    })
})

module.exports = router;