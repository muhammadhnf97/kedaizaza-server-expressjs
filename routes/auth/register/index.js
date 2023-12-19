const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const response = require('../../../lib/response');
const dbConnect = require('../../../database');

router.post('/', async(req, res) => {
    const { employee_id, username, password, confirmPassword } = req.body
    try {
        if (password !== confirmPassword) {
            response(400, null, "Bad Request POST: Register", res)
            return
        }
        const saltRounds = 11;
        const newPassword = await bcrypt.hash(password, saltRounds);
        console.log(newPassword)

        const allUserID = await dbConnect('SELECT uid FROM users');
        const maxUID = Math.max(allUserID.map(values=>Number(values.uid))) + 1 || 1;
        const newUID = maxUID.toString().padStart(7, 0);

        const insertRegister = await dbConnect('INSERT INTO users (uid, username, employee_id, password ) VALUES (?, ?, ?, ?)', [newUID, username, employee_id, newPassword]);

        if (!insertRegister) {
            console.error('Bad Request ( POST ): Register');
            response(400, null, 'Bad Request ( POST ): Register', res);
            return
        }

        response(200, null, 'Success ( POST ): Register', res);

    } catch (error) {
        console.error(error)
        response(500, null, "Failed Connect To DB ( POST ): Register")
    }
})

module.exports = router;