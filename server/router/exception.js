/**
 * Created by Administrator on 2018/12/30.
 */
const express = require('express');
const router = express.Router();

// catch 404 error
router.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    res.send(err)
});

module.exports = router;