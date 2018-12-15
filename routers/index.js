const express = require('express')
const router = express.Router();
const UserController = require('../controller/userController')  //用户模块

//测试
router.get('/test', (req, res, next) => {
    return UserController.test(req, res, next)
})

//登录
router.post('/user/login', (req, res, next) => {
    return UserController.login(req, res, next)
})
//注册
router.post('/user/register', (req, res, next) => {
    return UserController.register(req, res, next)
})

//验证token
router.get('/user/verifyToken', (req, res, next) => {
    return UserController.verifyToken(req, res, next)
})

//图形验证码
router.get('/user/getCaptcha', (req, res, next) => {
    return UserController.getCaptcha(req, res, next)
})

//修改个人资料
router.get('/user/editUserInfo', (req, res, next) => {
    return UserController.editUserInfo(req, res, next)
})

//删除用户
router.get('/user/deleteUser',(req, res, next)=>{
    return UserController.deleteUser(req, res, next)
})

//拉取所有用户
router.get('/user/getAllUserList',(req, res, next)=>{
    return UserController.getAllUserList(req, res, next)
})


module.exports = router