const path = require('path')
const express = require('express');
const app = express();
const bodyParser = require('body-parser');  //获取post body中的数据
const router = require('./routers')
const TokenUtil = require('./utils/tokenUtil')


//使用body-parser中间件
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())


//token 校验
app.use((req, rsp, next) => TokenUtil.verifyToken(req, rsp, next))



// router
app.use('/api', router)

// public
app.use(express.static(path.join(__dirname, 'public')))



const port = process.env.PORT || 3000

app.server = app.listen(port, () => {
    console.log(`server running @ http://localhost:${port}`)
})
module.exports = app