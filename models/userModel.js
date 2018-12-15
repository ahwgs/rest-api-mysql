const pool = require('../config/mysql')

const selectUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT user_id as userId,name,email,avatar,createTime,password FROM t_user where email='${email}'`
        pool.getConnection((err, connection) => {
            connection.query(sql, (err, result) => {
                if (err) reject(err)
                resolve(result)
                connection.release();
            })
        })
    })
}

const insertNewUser = (name, email, password, avatar, createTime) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO t_user ( name,email,password,avatar,createTime ) VALUES ( '${name}', '${email}','${password}','${avatar}','${createTime}');`
        pool.getConnection((err, connection) => {
            connection.query(sql, (err, result) => {
                if (err) reject(err)
                resolve(result)
                connection.release();
            })
        })
    })
}

const selectUserIsExit = (email) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT COUNT(1) as result FROM t_user where email = '${email}'`
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
    selectUserByEmail, insertNewUser, selectUserIsExit
}