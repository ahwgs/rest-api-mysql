const CommonController = {
    async test(req, res, next) {
        return res.json('common')
    }
}

module.exports = CommonController