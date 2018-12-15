const UserModel = require('../models/userModel')
const MsgUtil = require('../utils/msgUtil');
const TokenUtil = require('../utils/tokenUtil');
const gravatar = require('gravatar');
const bcrypt = require('bcrypt');


const UserController = {

    /**
     * login
     * @param email
     * @param password
     * @returns {Promise<createServer.NextHandleFunction | Response | * | Promise<any>>}
     */
    async login(req, res, next) {
        const {email, password} = req.body;

        try {
            await UserModel.selectUserByEmail(email)
                .then((result) => {
                    //查到了
                    if (result && result.length > 0) {
                        bcrypt.compare(password, result[0].password)
                            .then(isMatch => {
                                if (isMatch) {
                                    const tokenRule = {
                                        userId: result[0].userId,
                                        email: result[0].email,
                                        name: result[0].name
                                    }
                                    const token = TokenUtil.generateToken(tokenRule);
                                    return res.json({
                                        ...MsgUtil.createSuccessMsg(),
                                        data: {
                                            token,
                                            userId: result[0].userId,
                                            email: result[0].email,
                                            name: result[0].name,
                                            avatar: result[0].avatar
                                        }
                                    })
                                } else {
                                    return res.json({
                                        ...MsgUtil.createWarnMsg('密码错误')
                                    })
                                }
                            })
                    } else {
                        return res.json({
                            ...MsgUtil.createWarnMsg('该用户不存在')
                        })
                    }
                })
            //登录成功
        } catch (e) {
            console.log(e);
            return res.json({...MsgUtil.createErrorMsg()})
        }


    },
    /**
     * register
     * @param name
     * @param email
     * @param password
     * @returns {Promise<void>}
     */
    async register(req, res, next) {
        const {name, email, password} = req.body;
        try {

            //查询这个人是否存在
            const isExit = await UserModel.selectUserIsExit(email)
            //存在
            if (isExit[0].result > 0) {
                return res.json({
                    ...MsgUtil.createWarnMsg('该用户已存在')
                })
            }

            //不存在
            const createTime = new Date().getTime();
            const avatar = gravatar.url(email, {s: '200', r: 'pg', d: 'mm'});
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, async (err, hash) => {
                    if (err) throw err
                    const result = await UserModel.insertNewUser(name, email, hash, avatar, createTime);
                    if (result) {
                        return res.json({
                            ...MsgUtil.createSuccessMsg()
                        })
                    }
                    return res.json({
                        ...MsgUtil.createWarnMsg('注册失败')
                    })
                });
            });

        } catch (e) {
            console.log(e);
            return res.json({...MsgUtil.createErrorMsg()})
        }
    }
}


module.exports = UserController