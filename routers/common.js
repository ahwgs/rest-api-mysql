const express = require('express')
const router = express.Router();
const CommonController = require('../controller/postController')

router.get('/test', (req, res, next) => {
    return CommonController.test(req, res, next)
})

module.exports = router