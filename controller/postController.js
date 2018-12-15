const PostController = {
    async test(req, res, next) {
        return res.json('我是posts')
    }
}

module.exports = PostController