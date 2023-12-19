const dbConnect = require('../../database')
const express = require('express');
const response = require('../../lib/response');
const router = express.Router();

router.get('/', async(req, res) => {
    const pages = req.query.page || 1
    const items_per_page = 10
    const offset = (pages - 1) * items_per_page
    const totalPage = Math.ceil(((await dbConnect('SELECT COUNT(*) AS totalRow FROM purchases')).map(values=>values.totalRow)[0]) / 10)
    try {
        const data = await dbConnect(`
        SELECT purchases.purchase_id, items.name, purchase_details.quantity, purchase_details.price
        FROM purchases
        INNER JOIN purchase_details ON purchase_details.purchase_id = purchases.purchase_id 
        INNER JOIN items ON items.items_id = purchase_details.items_id
        LIMIT ? OFFSET ?`, [items_per_page, offset]);
        if (data.length > 0) {
            response(200, data, "Success ( GET ): Purchase", res, { pages, items_per_page, offset, totalPage });
        } else {
            response(404, null, "Not Found ( GET ): Purchase", res);
        };
    } catch (error) {
        console.log(error);
        response(500, null, "Failed Connect To DB ( GET ): Purchase", res);
    };
});

module.exports = router