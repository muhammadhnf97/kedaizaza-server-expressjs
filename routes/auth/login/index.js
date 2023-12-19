const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dbConnect = require('../../../database');
const response = require('../../../lib/response');

router.post('/', async(req, res) => {
    const { username, password } = req.body;
    const secretKey = process.env.JWT_SECRET_KEY;
    try {
        const checkingUser = await dbConnect('SELECT username, password FROM users WHERE username = ?', [username]);
        if (checkingUser.length < 1) {
            response(200, null, "Username Not Found", res);
            return;
        };
        const comparePassword = await bcrypt.compare(password, checkingUser[0].password);
        if (!comparePassword) {
            response(400, null, "Password is missmatch", res);
            return;
        };
        
        const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
        const userData = await dbConnect(`SELECT employees.employee_id, employees.name, employees.position FROM users INNER JOIN employees ON users.employee_id = employees.employee_id WHERE users.username = ?`, [username]);

        req.session.employee_id = userData[0].employee_id
        req.session.name = userData[0].name
        req.session.position = userData[0].position
        req.session.token = token

        req.session.save((err) => {
        if (err) {
            console.error(err);
            response(500, null, "Internal Server Error", res);
            return;
        }
        response(200, null, "Login success", res);
        });
    } catch (error) {
        console.error(error)
        response(500, null, "Failed Connect To DB ( POST ): Login", res);
    }
});

module.exports = router;