const express = require('express');
const router = express.Router();
const response = require('../../../lib/response');

router.post('/', (req, res) => {
    req.session.destroy((err)=>{
        console.log(err)
        if (err) {
            console.error(err);
            response(500, null, "Failed to logout ( DELETE ): Logout", res);
            return;
        }
        response(200, null, "Success ( DELETE ): Logout", res);
        res.redirect('/')
    });
});

module.exports = router;