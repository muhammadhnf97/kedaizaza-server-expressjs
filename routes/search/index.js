const express = require('express');
const dbConnect = require('../../database');
const response = require('../../lib/response');
const router = express.Router();

const getDataFromTable = async(table, firstField, secondField, req, res) => {
    const query = req.query.search
    const pages = req.query.page || 1
    const items_per_page = 10
    const offset = (pages - 1) * items_per_page
    const totalPage = Math.ceil(((await dbConnect(`SELECT COUNT(*) AS totalRow FROM ${table}`)).map(values=>values.totalRow)[0]) / 10)

    try {
        const data = await dbConnect(`SELECT * FROM ${table} WHERE ${firstField} LIKE ? OR ${secondField} LIKE ? LIMIT ? OFFSET ?`, [`%${query}%`, `%${query}%`, items_per_page, offset])
        if (data.length > 0) {
            response(200, data, `Success ( GET ): Search ${table}`, res, { query, pages, items_per_page, offset, totalPage });
        } else {
            response(404, null, `Not Found ( GET ): Search ${table}`, res);
        };
    } catch (error) {
        response(500, null, "Failed Connect To DB ( GET ): Satuan", res);
    }
}

router.get('/items', async(req, res) => {
    await getDataFromTable('items', 'items_id', 'name', req, res)
})
router.get('/customers', async(req, res) => {
    await getDataFromTable('customers', 'customer_id', 'name', req, res)
})
router.get('/employees', async(req, res) => {
    await getDataFromTable('employees', 'employee_id', 'name', req, res)
})
router.get('/satuan', async(req, res) => {
    await getDataFromTable('satuan', 'satuan_id', 'name', req, res)
})
router.get('/suppliers', async(req, res) => {
    await getDataFromTable('suppliers', 'supplier_id', 'name', req, res)
})


module.exports = router