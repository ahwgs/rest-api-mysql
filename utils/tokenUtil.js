const jwt = require('jsonwebtoken');
const secretKey = require('../config/keys').secretKey;
const MsgUtil = require('./msgUtil')

const TokenUtil = {
    //生成token
    generateToken(rule) {
        try {
            return jwt.sign(rule, secretKey, {expiresIn: 60 * 1000});  //一小时
        } catch (e) {
            console.log('generateToken error', e);
        }

    },
    //校验token
    verifyToken(req, res, next) {

        const allow = [
            '/',
            '/api/user/test',
            '/api/user/login',
            '/api/user/register',
            '/api/user/getCaptcha'
        ]

        try {
            if (allow.indexOf(req.url) < 0) {
                //token可能存在post请求和get请求
                let token = req.body.token || req.query.token || req.headers.token;
                jwt.verify(token, secretKey, (err, decode) => {
                    if (err) {
                        return res.status(403).json({...MsgUtil.createTokenFailureMsg()})
                    } else {
                        next();
                    }
                })
            } else {
                next();
            }
        } catch (e) {
            console.log(e);
            return res.json({
                ...MsgUtil.createErrorMsg()
            })
        }


    },
    //取token中的属性
    getTokenAttribute(token) {
        try {
            return jwt.verify(token, secretKey)
        } catch (e) {
            console.log(e);
        }
    },
    //通过token 找到用户id
    getUserIdByToken(token) {
        try {
            const user = jwt.verify(token, secretKey)
            if (!user) return ''
            return user.userId
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = TokenUtil