const pool = require('../config/mysql')


const selectPost = (params) => {
    return new Promise((resolve, reject) => {

        const {status, pageNumber, pageSize, content, categoryId} = params;

        let sql = `SELECT id,u.name,post_date AS time,post_title AS title,post_excerpt AS excerpt,post_category as categoryId,post_status as status,post_tag as tagId FROM t_posts p LEFT JOIN t_user u ON (p.post_author = u.user_id)`

        if (status !== undefined && status && status !== '-1') {
            sql += ` where post_status=${status}`
        }

        if (content !== undefined && content && content !== '') {
            sql += ` and post_title like '%${content}%'`
        }
        if (categoryId !== undefined && categoryId && categoryId !== -1) {
            sql += ` and post_category = ${categoryId}`
        }
        if (pageNumber !== undefined && pageNumber && pageNumber !== 0 && pageSize !== undefined && pageSize && pageSize !== 0) {
            const page = (pageNumber - 1) * pageSize
            sql += ` limit ${page}, ${pageSize}`
        }


        pool.getConnection((err, connection) => {
            connection.query(sql, (err, result) => {
                if (err) reject(err)
                resolve(result)
                connection.release();
            })
        })
    })
}

const selectCategoryListById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT
	                    category_id AS id,
                        create_time AS time,
                        categorys_id AS categorysId,
                        category_name AS NAME
                    FROM
                        t_categorys cats
                    LEFT JOIN t_category cat ON (
                        cats.categorys_id = cat.category_parent
                    )
                    WHERE cats.categorys_id = ${id}`
        pool.getConnection((err, connection) => {
            connection.query(sql, (err, result) => {
                if (err) reject(err)
                resolve(result)
                connection.release();
            })
        })
    })
}

module.exports = {
    selectPost,
    selectCategoryListById,
}