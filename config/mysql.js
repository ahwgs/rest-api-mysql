const mysql = require('mysql');
const mysqlConf = require('./keys').mysqlConf;

const pool = mysql.createPool({
    host: mysqlConf.host,
    user: mysqlConf.user,
    password: mysqlConf.password,
    database: mysqlConf.database,
    port: mysqlConf.port
})

module.exports = pool