const dbConnect = require('../../database')
const express = require('express');
const response = require('../../lib/response');
const router = express.Router();

router.get('/', async(req, res) => {
    const pages = req.query.page || 1
    const items_per_page = 10
    const offset = (pages - 1) * items_per_page
    const totalPage = Math.ceil(((await dbConnect('SELECT COUNT(*) AS totalRow FROM sales LIMIT ? OFFSET ?', [items_per_page, offset])).map(values=>values.totalRow)[0]) / 10)
    try {
        const data = await dbConnect('SELECT * FROM customers');
        if (data.length > 0) {
            response(200, data, "Success ( GET ): Customer", res, { pages, items_per_page, offset, totalPage });
        } else {
            response(404, null, "Not Found ( GET ): Customer", res);
        };
    } catch (error) {
        console.log(error);
        response(500, null, "Failed Connect To DB ( GET ): Customer", res);
    };
});

router.post('/', async(req, res) => {
    const { name, address, no_telp } = req.body;
    try {
        const getConsumerId = await dbConnect('SELECT customer_id FROM customers');
        const lastConsumerId = Math.max(getConsumerId.map(values=>Number(values.customer_id.slice(4)))) + 1 || 1;
        const newCustomerId = 'CUS-' + lastConsumerId.toString().padStart(3, 0);
        
        const insertConsumer = await dbConnect('INSERT INTO customers (customer_id, name, address, no_telp) VALUES (?, ?, ?, ?)', [newCustomerId, name, address, no_telp ]);
        if (!insertConsumer) {
            console.error('Bad Request ( POST ): Customer');
            response(400, null, 'Bad Request ( POST ): Customer', res);
            return
        }
        const returnData = [{ customer_id: newCustomerId, name, address, no_telp }]
        response(200, returnData, "Success ( POST ): Customer", res);

    } catch (error) {
        console.error(error);
        response(500, null, "Failed Connect To DB ( POST ): Customer", res);
    };
});

router.delete('/', async(req, res) => {
    const {customer_id} = req.body;
    try {
        const deleteConsumer = await dbConnect('DELETE FROM customers WHERE customer_id = ?', [customer_id]);
        if (!deleteConsumer) {
            console.error('Bad Request ( DELETE ): Customer');
            response(400, null, 'Bad Request ( DELETE ): Customer', res);
            return
        }

        if (deleteConsumer.affectedRows < 1) {
            response(404, null, 'Not Found ( DELETE ): Customer', res);
        }

        response(200, null, "Success ( DELETE ): Customer", res);
    } catch (error) {
        console.error(error);
        response(500, null, "Failed Connect To DB ( DELETE ): Customer")
    }
})

router.put('/', async(req, res) => {
    const {customer_id, name, address, no_telp} = req.body;
    try {
        const updateConsumer = await dbConnect('UPDATE customers SET name = ?, address = ?, no_telp = ? WHERE customer_id = ?', [name, address, no_telp, customer_id]);
        if (!updateConsumer) {
            console.error('Bad Request ( PUT ): Customer');
            response(400, null, 'Bad Request ( PUT ): Customer', res);
            return
        }
        const returnData = [{ customer_id, name, address, no_telp }]
        response(200, returnData, "Success ( PUT ): Customer", res);
    } catch (error) {
        console.error(error);
        response(500, null, "Failed Connect To DB ( PUT ): Customer")
    }
})
module.exports = router