const express = require('express')
const router = express.Router();
const UserController = require('../controller/userController')  //用户模块

//测试
router.get('/user/test',(req,res,next)=>{
    return UserController.test(req,res,next)
})

//登录
router.post('/user/login',(req,res,next)=>{
    return UserController.login(req,res,next)
})
//注册
router.post('/user/register',(req,res,next)=>{
    return UserController.register(req,res,next)
})



module.exports = router