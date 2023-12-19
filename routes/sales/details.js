const dbConnect = require('../../database')
const express = require('express');
const response = require('../../lib/response');
const router = express.Router();

router.get('/', async(req, res) => {
    const pages = req.query.page || 1
    const items_per_page = 10
    const offset = (pages - 1) * items_per_page
    const totalPage = Math.ceil(((await dbConnect('SELECT COUNT(*) AS totalRow FROM sales')).map(values=>values.totalRow)[0]) / 10)
    
    try {
        const data = await dbConnect(`
        SELECT sales.sale_id, items.name, sale_details.quantity, sale_details.price
        FROM sales
        INNER JOIN sale_details ON sale_details.sale_id = sales.sale_id 
        INNER JOIN items ON items.items_id = sale_details.items_id
        LIMIT ? OFFSET ?`, [items_per_page, offset]);

        if (data.length > 0) {
            response(200, data, "Success ( GET ): Sales Details", res, { pages, items_per_page, offset, totalPage });
        } else {
            response(404, null, "Not Found ( GET ): Sales Details", res);
        };
    } catch (error) {
        console.log(error);
        response(500, null, "Failed Connect To DB ( GET ): Sales Details", res);
    };
});

module.exports = router