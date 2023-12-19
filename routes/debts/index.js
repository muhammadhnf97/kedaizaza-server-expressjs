const dbConnect = require('../../database')
const express = require('express')
const response = require('../../lib/response')
const router = express.Router()

router.get('/', async(req, res) => {
    const pages = req.query.page || 1
    const items_per_page = 10
    const offset = (pages - 1) * items_per_page
    const totalPage = Math.ceil(((await dbConnect('SELECT COUNT(*) AS totalRow FROM sales')).map(values=>values.totalRow)[0]) / 10)
    try {
        const data = await dbConnect(`
            SELECT sales.sale_id, customers.name as customer_name, sales.date as sales_date, sales.status 
            FROM sales
            INNER JOIN customers ON customers.customer_id = sales.customer_id
            WHERE sales.status = 'BELUM LUNAS' LIMIT ? OFFSET ?`, [items_per_page, offset]);
            if (data.length > 0) {
                response(200, data, "Success ( GET ): Debts", res, { pages, items_per_page, offset, totalPage });
            } else {
                response(404, null, "Not Found ( GET ): Debts", res);
            };
    } catch (error) {
        console.log(error);
        response(500, null, "Failed Connect To DB ( GET ): Employees", res);
    };
})


router.get('/details/:customer_id', async(req, res) => {
    const customer_id = req.params.customer_id
    const pages = req.query.page || 1
    const items_per_page = 10
    const offset = (pages - 1) * items_per_page
    const totalPage = Math.ceil(((await dbConnect('SELECT COUNT(*) AS totalRow FROM sales')).map(values=>values.totalRow)[0]) / 10)
    try {
        const data = await dbConnect(`
            SELECT sales.sale_id, customers.name as customer_name, sales.date as sales_date, sales.status 
            FROM sales
            INNER JOIN customers ON customers.customer_id = sales.customer_id
            WHERE sales.status = 'BELUM LUNAS' AND sales.customer_id = ? `, [customer_id]);
            if (data.length > 0) {
                response(200, data, "Success ( GET ): Customers Debts", res, { pages, items_per_page, offset, totalPage });
            } else {
                response(404, null, "Not Found ( GET ): Customers Debts", res);
            };
    } catch (error) {
        console.log(error);
        response(500, null, "Failed Connect To DB ( GET ): Customers Debts", res);
    };
})

router.get('/details/:customer_id/:sale_id', async(req, res) => {
    const sale_id = req.params.sale_id
    const pages = req.query.page || 1
    const items_per_page = 10
    const offset = (pages - 1) * items_per_page
    const totalPage = Math.ceil(((await dbConnect('SELECT COUNT(*) AS totalRow FROM sales')).map(values=>values.totalRow)[0]) / 10)
    try {
        const data = await dbConnect(`
            SELECT sales.sale_id, items.name as items_name, sale_details.quantity, sale_details.price, sale_details.status 
            FROM sales
            INNER JOIN sale_details ON sale_details.sale_id = sales.sale_id
            INNER JOIN items ON items.items_id = sale_details.items_id
            WHERE sales.status = 'BELUM LUNAS' AND sales.sale_id = ? `, [sale_id]);
            if (data.length > 0) {
                response(200, data, "Success ( GET ): Customers Debts", res, { pages, items_per_page, offset, totalPage });
            } else {
                response(404, null, "Not Found ( GET ): Customers Debts", res);
            };
    } catch (error) {
        console.log(error);
        response(500, null, "Failed Connect To DB ( GET ): Customers Debts", res);
    };
})

router.put('/lunas/:customer_id/:sale_id/:items_id', async(req, res) => {
    const sale_id = req.params.sale_id
    const items_id = req.params.items_id
    try {
        await dbConnect(`UPDATE sale_details SET status = 'LUNAS' WHERE sale_id = ? AND items_id = ?`, [sale_id, items_id])

        const dataItems = await dbConnect('SELECT * FROM items WHERE items_id = ?', [items_id])
        const dataSaleDetails = await dbConnect('SELECT * FROM sale_details WHERE sale_id = ? AND items_id = ?', [sale_id, items_id])
        response(200, {
            sale_id: sale_id,
            items_name: dataItems[0].name,
            quantity: dataSaleDetails[0].quantity,
            price: dataSaleDetails[0].price,
            status: dataSaleDetails[0].status           
        }, "Success ( PUT ): Employee", res);
    } catch (error) {
        console.log(error);
        response(500, null, "Failed Connect To DB ( GET ): Customers Debts", res);
    };
})

router.put('/lunas/:customer_id/:sale_id/', async(req, res) => {
    const sale_id = req.params.sale_id
    try {
        await dbConnect(`UPDATE sales SET status = 'LUNAS' WHERE sale_id = ?`, [sale_id])
        await dbConnect(`UPDATE sale_details SET status = 'LUNAS' WHERE sale_id = ? AND status = 'BELUM LUNAS'`, [sale_id])
        
        const dataSaleDetails = await dbConnect(`
        SELECT sales.sale_id, customers .name as customer_name, employees.name as employee_name, sales.date, sales.status 
        FROM sales 
        INNER JOIN customers ON customers.customer_id = sales.customer_id
        INNER JOIN employees ON employees.employee_id = sales.employee_id 
        WHERE sale_id = ?`, [sale_id])
        response(200, dataSaleDetails, "Success ( PUT ): Employee", res);
    } catch (error) {
        console.log(error);
        response(500, null, "Failed Connect To DB ( GET ): Customers Debts", res);
    };
})

module.exports = router;