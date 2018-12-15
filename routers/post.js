const express = require('express')
const router = express.Router();
const PostController = require('../controller/postController')

router.get('/test', (req, res, next) => {
    return PostController.test(req, res, next)
})

module.exports = router