const MsgUtil = {
    //创建操作正确的消息方法
    createSuccessMsg(msg = 'success') {
        return {
            msg,
            status: 0
        }
    },
    //创建操作失败的消息方法
    createWarnMsg(msg) {
        return {
            msg,
            status: 1
        }
    },

    //创建操作异常的消息方法
    createErrorMsg() {
        return {
            msg: '系统异常，请联系管理员',
            status: 1
        }
    },

    //创建操作错误的消息方法
    createTokenFailureMsg() {
        return {
            msg: 'token失效，请重新登录',
            status: 2
        }
    },

}

module.exports = MsgUtil