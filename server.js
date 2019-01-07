const path = require('path')
const fs = require('fs')
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
// app.use(session({
//     secret: secretKey,
//     resave: false,
//     saveUninitialized: true
// }))

//token 校验
app.use(TokenUtil.verifyToken)


// router
fs.readdirSync(path.join(__dirname, 'routers')).reverse().forEach((file, index) => {
    try {
        if (!(/\.js$/i.test(file))) return;
        const route = file.replace(/\.js$/i, '').replace(/index/i, '')
        if (route !== '') {
            app.use(`/api/${route}`, router[route])
        }
    } catch (e) {
        console.log(e);
    }

})
// public
app.use(express.static(path.join(__dirname, 'public')))


const port = process.env.PORT || 3000

app.server = app.listen(port, () => {
    console.log(`server running @ http://localhost:${port}`)
})
module.exports = app