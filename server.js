const path = require('path')
const express = require('express');
const app = express();
const bodyParser = require('body-parser');  //获取post body中的数据
const router = require('./routers')
const TokenUtil = require('./utils/tokenUtil')
const session = require('express-session');
const cookieParser = require('cookie-parser');
const secretKey = require('./config/keys').secretKey

//使用body-parser中间件
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

//使用express-session中间件
app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true
}))

//token 校验
app.use(TokenUtil.verifyToken)


// router
app.use('/api', router)

// public
app.use(express.static(path.join(__dirname, 'public')))


const port = process.env.PORT || 3000

app.server = app.listen(port, () => {
    console.log(`server running @ http://localhost:${port}`)
})
module.exports = app