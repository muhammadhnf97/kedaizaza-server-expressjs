const mysql = require('mysql2/promise')
require('dotenv').config()

const dbConnect = async(query, values=[]) => {
    try {
        const connect = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            database: process.env.MYSQL_DATABASE
        })

        const [results] = await connect.execute(query, values);
        connect.end()
        return results
    } catch (error) {
        console.error('Gagal menghubungkan ke database :', error)
    }
}

module.exports = dbConnect