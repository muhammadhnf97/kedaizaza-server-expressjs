const dbConnect = require('../../database')
const express = require('express');
const response = require('../../lib/response');
const router = express.Router();

router.get('/', async(req, res) => {
    const pages = req.query.page || 1
    const items_per_page = 10
    const offset = (pages - 1) * items_per_page
    const totalPage = Math.ceil(((await dbConnect('SELECT COUNT(*) AS totalRow FROM suppliers')).map(values=>values.totalRow)[0]) / 10)
    try {
        const data = await dbConnect('SELECT * FROM suppliers LIMIT ? OFFSET ?', [items_per_page, offset]);
        if (data.length > 0) {
            response(200, data, "Success ( GET ): Supplier", res, { pages, items_per_page, offset, totalPage });
        } else {
            response(404, null, "Not Found ( GET ): Supplier", res);
        };
    } catch (error) {
        console.log(error);
        response(500, null, "Failed Connect To DB ( GET ): Supplier", res);
    };
});

router.post('/', async(req, res) => {
    const { name, address, agen,  no_telp } = req.body;
    try {
        const getSupplierId = await dbConnect('SELECT supplier_id FROM suppliers');
        const lastSupplierId = Math.max(getSupplierId.map(values=>Number(values.supplier_id.slice(4)))) + 1 || 1;
        const newSupplierId = 'SUP-' + lastSupplierId.toString().padStart(3, 0);
        
        const insertSupplier = await dbConnect('INSERT INTO suppliers (supplier_id, name, address, agen,  no_telp) VALUES (?, ?, ?, ?, ?)', [newSupplierId, name, address, agen, no_telp]);
        if (!insertSupplier) {
            console.error('Bad Request ( POST ): Supplier');
            response(400, null, 'Bad Request ( POST ): Supplier', res);
            return
        }

        const returnData = [{ supplier_id: newSupplierId, name, address, agen, no_telp }]
        response(200, returnData, "Success ( POST ): Supplier", res);

    } catch (error) {
        console.error(error);
        response(500, null, "Failed Connect To DB ( POST ): Supplier", res);
    };
});

router.delete('/', async(req, res) => {
    const {supplier_id} = req.body;
    try {
        const deleteSupplier = await dbConnect('DELETE FROM suppliers WHERE supplier_id = ?', [supplier_id]);
        if (!deleteSupplier) {
            console.error('Bad Request ( DELETE ): Supplier');
            response(400, null, 'Bad Request ( DELETE ): Supplier', res);
            return
        }

        if (deleteSupplier.affectedRows < 1) {
            response(404, null, 'Not Found ( DELETE ): Supplier', res);
        }

        response(200, null, "Success ( DELETE ): Supplier", res);
    } catch (error) {
        console.error(error);
        response(500, null, "Failed Connect To DB ( DELETE ): Supplier")
    }
})

router.put('/', async(req, res) => {
    const {supplier_id, name, address, agen, no_telp} = req.body;
    
    try {
        const updateSupplier = await dbConnect('UPDATE suppliers SET name = ?, address = ?, agen = ?, no_telp = ? WHERE supplier_id = ?',  [name, address, agen, no_telp, supplier_id]);
        if (!updateSupplier) {
            console.error('Bad Request ( PUT ): Supplier');
            response(400, null, 'Bad Request ( PUT ): Supplier', res);
            return
        }
        const returnData = [{ supplier_id, name, address, agen, no_telp }]
        response(200, returnData, "Success ( PUT ): Supplier", res);
    } catch (error) {
        console.error(error);
        response(500, null, "Failed Connect To DB ( PUT ): Supplier")
    }
})
module.exports = router