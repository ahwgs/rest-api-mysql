const express = require('express')
const router = express.Router();
const PostController = require('../controller/postController')

//文章模块的测试
router.get('/test', (req, res, next) => {
    return PostController.test(req, res, next)
})

router.get('/getPostList',(req, res, next)=>{
    return PostController.getPostList(req, res, next)
})

module.exports = router