const UserModel = require('../models/userModel')
const MsgUtil = require('../utils/msgUtil');
const TokenUtil = require('../utils/tokenUtil');
const gravatar = require('gravatar');
const bcrypt = require('bcrypt');
const svgCaptcha = require('svg-captcha')
const Util = require('../utils/util');
const redisHelper = require('../config/redis')


const getUserInfo = (result, res) => {
    try {
        const tokenRule = {
            userId: result[0].userId,
            email: result[0].email,
            name: result[0].name,
            identity: result[0].identity
        }
        const token = TokenUtil.generateToken(tokenRule);
        return res.json({
            ...MsgUtil.createSuccessMsg(),
            data: {
                token,
                userId: result[0].userId,
                email: result[0].email,
                name: result[0].name,
                avatar: result[0].avatar,
                identity: result[0].identity
            }
        })
    } catch (e) {
        console.log(e);
        return res.json({...MsgUtil.createErrorMsg()})
    }
}

const UserController = {

    async test(req, res, next) {
        try {

            redisHelper.setString('name', 'ahwgs', 60, (err, result) => {
                if (err) throw err

                console.log(result);

            })

            redisHelper.getString('name', (err, result) => {
                if (err) throw err
                console.log(result);
                res.json(result)
            })

        } catch (e) {
            console.log(e);
        }

    },

    /**
     * verifyToken
     * @returns {Promise<void>}
     */
    async verifyToken(req, res, next) {
        res.json({
            ...MsgUtil.createSuccessMsg()
        })
    },

    /**
     * login
     * @param email
     * @param password
     * @returns {Promise<createServer.NextHandleFunction | Response | * | Promise<any>>}
     */
    async login(req, res, next) {
        const {email, password, code} = req.body;

        try {
            if (!email) {
                return res.json({
                    ...MsgUtil.createWarnMsg('请输入邮箱')
                })
            } else if (!password) {
                return res.json({
                    ...MsgUtil.createWarnMsg('请输入密码')
                })
            } else if (!code) {
                return res.json({
                    ...MsgUtil.createWarnMsg('请输入验证码')
                })
            }
            //从redis中查是否有这个人的验证码
            redisHelper.getString(email).then(result => {
                if (result === '' || !result || code !== result) {
                    return res.json({...MsgUtil.createWarnMsg('验证码错误')})
                }
                UserModel.selectUserByEmail(email)
                    .then((result) => {
                        //查到了
                        if (result && result.length > 0) {
                            bcrypt.compare(password, result[0].password)
                                .then(isMatch => {
                                    if (isMatch) {
                                        getUserInfo(result, res)
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
                    }).catch(err => {
                    console.log(err);
                    return res.json({...MsgUtil.createErrorMsg()})
                })
            }).catch(err => {
                console.log(err);
                return res.json({...MsgUtil.createErrorMsg()})
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
        const {name, email, password, identity} = req.body;
        try {

            if (!email) {
                return res.json({
                    ...MsgUtil.createWarnMsg('请输入邮箱')
                })
            } else if (!password) {
                return res.json({
                    ...MsgUtil.createWarnMsg('请输入密码')
                })
            } else if (!name) {
                return res.json({
                    ...MsgUtil.createWarnMsg('请输入昵称')
                })
            } else if (!identity) {
                return res.json({
                    ...MsgUtil.createWarnMsg('请选择身份')
                })
            }

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
                    const result = await UserModel.insertNewUser(name, email, hash, avatar, identity, createTime);
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
    },

    /**
     * captcha
     * @returns {Promise<void>}
     */
    async getCaptcha(req, res, next) {
        try {
            const {email} = req.body
            const effectTime = 60 * 3  //3分钟
            const captcha = svgCaptcha.create({
                // 翻转颜色
                inverse: false,
                // 字体大小
                fontSize: 36,
                // 噪声线条数
                noise: 2,
                // 宽度
                width: 80,
                // 高度
                height: 30,
            });
            // 保存到session,忽略大小写
            redisHelper.setString(email, captcha.text.toLowerCase(), effectTime).then(result => {
                if (result) {
                    res.setHeader('Content-Type', 'image/svg+xml');
                    res.write(String(captcha.data));
                    res.end();
                }
            }).catch(err => {
                console.log(err);
                return res.json({
                    ...MsgUtil.createWarnMsg('验证码获取失败')
                })
            })

        } catch (e) {
            console.log(e);
            return res.json({
                ...MsgUtil.createErrorMsg()
            })
        }

    },

    /**
     * editUserInfo
     * @returns {Promise<void>}
     */
    async editUserInfo(req, res, next) {
        const {token, name, email, identity, avatar} = req.query
        try {
            if (!email) {
                return res.json({
                    ...MsgUtil.createWarnMsg('请输入邮箱')
                })
            } else if (!name) {
                return res.json({
                    ...MsgUtil.createWarnMsg('请输入昵称')
                })
            } else if (!identity) {
                return res.json({
                    ...MsgUtil.createWarnMsg('请选择身份')
                })
            } else if (!avatar) {
                return res.json({
                    ...MsgUtil.createWarnMsg('请上传头像')
                })
            }
            const userId = TokenUtil.getUserIdByToken(token)
            if (Util.isNotBlack(userId)) {
                await UserModel.updateUserInfoByUserId(userId, name, email, identity, avatar)
                    .then(result => {
                        console.log(result);
                        if (result) {
                            UserModel.selectUserByEmail(email)
                                .then(result => {
                                    if (result)
                                        getUserInfo(result, res)
                                }).catch(err => {
                                console.log(err);
                                return res.json({
                                    ...MsgUtil.createErrorMsg()
                                })
                            })

                        }
                    })
                    .catch(err => {
                        console.log(err);
                        return res.json({
                            ...MsgUtil.createErrorMsg()
                        })
                    })
            }
        } catch (e) {
            console.log(e);
            return res.json({
                ...MsgUtil.createErrorMsg()
            })
        }

    },
    /**
     * deleteUser
     * @returns {Promise<void>}
     */
    async deleteUser(req, res, next) {
        try {
            const {token, id} = req.query
            const {userId, identity} = TokenUtil.getTokenAttribute(token);

            if (!id) {
                return res.json({
                    ...MsgUtil.createWarnMsg('请选择要删除的人!')
                })
            }

            //是否是删自己
            if (id === userId) {
                return res.json({
                    ...MsgUtil.createWarnMsg('不能删除自己!')
                })
            }
            //查看自己是否有权限删除 identity 1
            if (!identity || parseInt(identity) > 1) {
                return res.json({
                    ...MsgUtil.createWarnMsg('只有管理员可以删除!')
                })
            }
            if (Util.isNotBlack(userId)) {
                await UserModel.deleteUserById(id)
                    .then(result => {
                        if (result) {
                            return res.json({
                                ...MsgUtil.createSuccessMsg()
                            })
                        } else {
                            return res.json({
                                ...MsgUtil.createWarnMsg('删除失败')
                            })
                        }
                    })
            }
        } catch (e) {
            console.log(e);
            return res.json({
                ...MsgUtil.createErrorMsg()
            })
        }
    },

    /**
     * getAllUserList
     * @returns {createServer.NextHandleFunction | Response | * | Promise<any>}
     */
    async getAllUserList(req, res, next) {
        try {
            await UserModel.selectAllUserList().then(result => {
                if (result) {
                    console.log(result);
                    return res.json({
                        ...MsgUtil.createSuccessMsg(),
                        data: result
                    })
                }
                return res.json({
                    ...MsgUtil.createErrorMsg()
                })
            })
        } catch (e) {
            console.log(e);
            return res.json({
                ...MsgUtil.createErrorMsg()
            })
        }
    }

}


module.exports = UserController