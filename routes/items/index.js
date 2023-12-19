const dbConnect = require('../../database')
const express = require('express');
const response = require('../../lib/response');
const router = express.Router();

router.get('/', async(req, res) => {
    const pages = req.query.page || 1
    const items_per_page = 10
    const offset = (pages - 1) * items_per_page
    const totalPage = Math.ceil(((await dbConnect('SELECT COUNT(*) AS totalRow FROM items')).map(values=>values.totalRow)[0]) / 10)
    try {
        const data = await dbConnect(`SELECT items.items_id, items.name, items.stock, items.purchase_price, items.selling_price, satuan.name AS satuan_name, categories.name AS category_name
        FROM items
        INNER JOIN satuan ON satuan.satuan_id = items.satuan_id 
        INNER JOIN categories ON categories.category_id = items.category_id
        LIMIT ? OFFSET ?`, [items_per_page, offset]);
        if (data.length > 0) {
            response(200, data, "Success ( GET ): Items", res, { pages, items_per_page, offset, totalPage });
        } else {
            response(404, null, "Not Found ( GET ): Items", res);
        };
    } catch (error) {
        console.log(error);
        response(500, null, "Failed Connect To DB ( GET ): Items", res);
    };
});

router.post('/', async(req, res) => {
    const { name, stock, purchase_price, selling_price, satuan_id, category_id } = req.body;
    const getItemByCategory = await dbConnect('SELECT items_id FROM items WHERE category_id = ?', [category_id]);
    let newItemsID;
    if (getItemByCategory.length < 1) {
        newItemsID = category_id.slice(4).padStart(3, 0) + '001'
    } else {
        tempId = Math.max(...(getItemByCategory.map(values=>Number(values.items_id.slice(3))))) + 1
        newItemsID = category_id.slice(4).padStart(3, 0) + tempId.toString().padStart(3, 0)
    }

    try {
        const insertItems = await dbConnect('INSERT INTO items (items_id, name, stock, purchase_price, selling_price, satuan_id, category_id) VALUES (?, ?, ?, ?, ?, ?, ?)', [newItemsID, name, stock, purchase_price, selling_price, satuan_id, category_id ]);
        if (!insertItems) {
            console.error('Bad Request ( POST ): Items');
            response(400, null, 'Bad Request ( POST ): Items', res);
            return
        }

        const returnData = await dbConnect(`SELECT items.items_id, items.name, items.stock, items.purchase_price, items.selling_price, satuan.name AS satuan_name, categories.name AS category_name
        FROM items
        INNER JOIN satuan ON satuan.satuan_id = items.satuan_id 
        INNER JOIN categories ON categories.category_id = items.category_id
        WHERE items_id = ?`, [newItemsID])
        response(200, returnData, "Success ( POST ): Items", res);

    } catch (error) {
        console.error(error);
        response(500, null, "Failed Connect To DB ( POST ): Items", res);
    };
});

router.delete('/', async(req, res) => {
    const {items_id} = req.body;
    try {
        const deleteConsumer = await dbConnect('DELETE FROM items WHERE items_id = ?', [items_id]);
        if (!deleteConsumer) {
            console.error('Bad Request ( DELETE ): Items');
            response(400, null, 'Bad Request ( DELETE ): Items', res);
            return
        }

        if (deleteConsumer.affectedRows < 1) {
            response(404, null, 'Not Found ( DELETE ): Items', res);
        }

        response(200, null, "Success ( DELETE ): Items", res);
    } catch (error) {
        console.error(error);
        response(500, null, "Failed Connect To DB ( DELETE ): Items")
    }
})

router.put('/', async(req, res) => {
    const {items_id, name, stock, purchase_price, selling_price} = req.body;
    try {
        const updateItems = await dbConnect('UPDATE items SET name = ?, stock = ?, purchase_price = ?, selling_price = ? WHERE items_id = ?', [name, stock, purchase_price, selling_price, items_id]);
        if (!updateItems) {
            console.error('Bad Request ( PUT ): Items');
            response(400, null, 'Bad Request ( PUT ): Items', res);
            return
        }
        const returnData = [{ items_id, name, stock, purchase_price, selling_price }]
        response(200, returnData, "Success ( PUT ): Items", res);
    } catch (error) {
        console.error(error);
        response(500, null, "Failed Connect To DB ( PUT ): Items")
    }
})
module.exports = router