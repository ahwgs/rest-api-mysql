const MsgUtil = require('../utils/msgUtil');
const Util = require('../utils/util');
const PostModel = require('../models/postModel')


const PostController = {


    async test(req, res, next) {
        return res.json('我是posts')
    },

    async getCategoryList(id) {
        try {
            await PostModel.selectCategoryListById(id)
                .then(list => {
                    console.log('listL',list);
                    return list
                })
        } catch (e) {

        }
    },

    async getPostList(req, res, next) {
        try {
            //状态 -1 全部 0我的 1发布 2删除3草稿
            //categoryId 分类ida
            await PostModel.selectPost(req.query)
                .then(result => {
                    if (result && result.length > 0) {
                        let dataList = Util.deepClone(result)
                        let tempList  = []
                        result.map((item) => {
                            PostModel.selectCategoryListById(item.categoryId)
                                .then(list=>{
                                    tempList.push(list)
                                })
                        })

                        console.log('temo',tempList);

                        return res.json({
                            ...MsgUtil.createSuccessMsg(),
                            data: dataList
                        })
                    }
                })


            // dataList.length>0 && dataList.map((item,index)=>{
            //
            // })
            // .then(result => {
            //     console.log(result);
            //     if (result) {
            //         let dataList = []
            //         //拿查到的categoryId 查所有的
            //         result.length > 0 && result.map((item, index) => {
            //             PostModel.selectCategoryListById(item.categoryId).then(categoryList => {
            //                 console.log('123123123123', item);
            //                 dataList.push({
            //                     ...item,
            //                     categoryList
            //                 })
            //                 console.log('123', dataList);
            //                 return res.json({
            //                     ...MsgUtil.createSuccessMsg(),
            //                     data: dataList
            //                 })
            //             })
            //         })
            //
            //     }
            // })
            // .catch(err => {
            //     console.log(err);
            //     return res.json({...MsgUtil.createErrorMsg()})
            // })


        } catch (e) {
            console.log(e);
            return res.json({...MsgUtil.createErrorMsg()})
        }
    }


}

module.exports = PostController