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
        SELECT sales.sale_id, sales.date, customers.name as customer_name, employees.name as employee_name
        FROM sales
        INNER JOIN customers ON customers.customer_id = sales.customer_id 
        INNER JOIN employees ON employees.employee_id = sales.employee_id
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

router.post('/', async(req, res) => {
    const { customer_id, employee_id, details } = req.body
    const currentDate = new Date;
    const stringDate = currentDate.getDate().toString().padStart(2, 0) + (currentDate.getMonth()+1).toString().padStart(2, 0) + currentDate.getFullYear().toString()
    const arraySalesId = await dbConnect("SELECT sale_id FROM sales WHERE DATE_FORMAT(date, '%d%m%Y') = ?", [stringDate])
    const newQueue = arraySalesId.length > 0 ? Math.max(...(arraySalesId).map(values=>Number(values.sale_id.slice(8)))) + 1 : 1
    const newSaleId = stringDate+newQueue.toString().padStart(3,0)

    try {
        const insertsales = await dbConnect('INSERT INTO sales (sale_id, customer_id, employee_id) VALUES (?, ?, ?)', 
        [newSaleId, customer_id, employee_id ]);

        details.forEach(async(element) => {
            const {items_id, quantity, price, status} = element
            const currentItems = (await dbConnect('SELECT stock FROM items WHERE items_id = ?', [items_id]))
            const newStock = currentItems[0].stock - quantity

            await dbConnect('INSERT INTO sale_details (sale_id, items_id, quantity, price, status) VALUES (?, ?, ?, ?, ?)', [newSaleId, items_id, quantity, price, status])
            await dbConnect('UPDATE items SET stock = ? WHERE items_id = ?', [newStock, items_id])

        });
        
        if (!insertsales) {
            console.error('Bad Request ( POST ): sales & Purchase Details');
            response(400, null, 'Bad Request ( POST ): sales & Purchase Details', res);
            return
        }
        
        response(200, null, "Success ( POST ): sales & Purchase Details", res);

    } catch (error) {
        console.error(error);
        response(500, null, "Failed Connect To DB ( POST ): sales & Purchase Details", res);
    };
})

module.exports = router