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
        SELECT purchases.purchase_id, purchases.date, purchases.no_nota, suppliers.name as supplier_name, employees.name as employee_name, purchases.date, purchases.payment, purchases.status
        FROM purchases
        INNER JOIN suppliers ON suppliers.supplier_id = purchases.supplier_id 
        INNER JOIN employees ON employees.employee_id = purchases.employee_id
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
    const { no_nota, supplier_id, employee_id, payment, status, details } = req.body
    const arrayPurchasesId = await dbConnect("SELECT purchase_id FROM purchases")
    const newQueue = arrayPurchasesId.length > 0 ? Math.max(...(arrayPurchasesId.map(values=>Number(values.purchase_id.slice(4))))) + 1 : 1
    const newPurchaseId = 'PRC-'+newQueue.toString().padStart(7,0)

    try {
        const insertPurchases = await dbConnect('INSERT INTO purchases (purchase_id, no_nota, supplier_id, employee_id, payment, status) VALUES (?, ?, ?, ?, ?, ?)', 
        [newPurchaseId, no_nota, supplier_id, employee_id, payment, status ]);

        details.forEach(async(element) => {
            const {items_id, quantity, price} = element
            const currentItems = (await dbConnect('SELECT stock, purchase_price FROM items WHERE items_id = ?', [items_id]))
            const newStock = quantity + currentItems[0].stock
            const newPurchasePrice = ((quantity * price) + (currentItems[0].stock * currentItems[0].purchase_price)) / newStock

            await dbConnect('INSERT INTO purchase_details (purchase_id, items_id, quantity, price) VALUES (?, ?, ?, ?)', [newPurchaseId, items_id, quantity, price])
            await dbConnect('UPDATE items SET stock = ?, purchase_price = ? WHERE items_id = ?', [newStock, newPurchasePrice, items_id])

        });
        
        if (!insertPurchases) {
            console.error('Bad Request ( POST ): Purchases & Purchase Details');
            response(400, null, 'Bad Request ( POST ): Purchases & Purchase Details', res);
            return
        }
        
        response(200, null, "Success ( POST ): Purchases & Purchase Details", res);

    } catch (error) {
        console.error(error);
        response(500, null, "Failed Connect To DB ( POST ): Purchases & Purchase Details", res);
    };
})

module.exports = router