const pool = require('../config/mysql')

const selectUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT user_id as userId,name,email,avatar,createTime,password ,identity FROM t_user where email='${email}'`
        pool.getConnection((err, connection) => {
            connection.query(sql, (err, result) => {
                if (err) reject(err)
                resolve(result)
                connection.release();
            })
        })
    })
}

const insertNewUser = (name, email, password, avatar, identity, createTime) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO t_user ( name,email,password,avatar,identity,createTime ) VALUES ( '${name}', '${email}','${password}','${avatar}','${identity}','${createTime}');`
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

const updateUserInfoByUserId = (userId, name, email, identity, avatar) => {
    return new Promise((resolve, reject) => {
        const sql = `update t_user set name ='${name}',email='${email}',identity='${identity}',avatar='${avatar}' WHERE user_id='${userId}' `
        pool.getConnection((err, connection) => {
            connection.query(sql, (err, result) => {
                if (err) reject(err)
                resolve(result)
                connection.release();
            })
        })
    })
}

const deleteUserById = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = `update t_user set is_delete ='1' WHERE user_id='${userId}' `
        pool.getConnection((err, connection) => {
            connection.query(sql, (err, result) => {
                if (err) reject(err)
                resolve(result)
                connection.release();
            })
        })
    })
}

const selectAllUserList = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT user_id as userId,name,email,avatar,createTime,identity  FROM t_user where is_delete=0`
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
    selectUserByEmail,
    insertNewUser,
    selectUserIsExit,
    updateUserInfoByUserId,
    deleteUserById,
    selectAllUserList
}