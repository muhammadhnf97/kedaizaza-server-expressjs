const dbConnect = require('../../database')
const express = require('express');
const response = require('../../lib/response');
const router = express.Router();

router.get('/', async(req, res) => {
    const pages = req.query.page || 1
    const items_per_page = 10
    const offset = (pages - 1) * items_per_page
    const totalPage = Math.ceil(((await dbConnect('SELECT COUNT(*) AS totalRow FROM satuan')).map(values=>values.totalRow)[0]) / 10)
    try {
        const data = await dbConnect('SELECT * FROM satuan LIMIT ? OFFSET ?', [items_per_page, offset]);
        if (data.length > 0) {
            response(200, data, "Success ( GET ): Satuan", res, { pages, items_per_page, offset, totalPage });
        } else {
            response(404, null, "Not Found ( GET ): Satuan", res);
        };
    } catch (error) {
        console.log(error);
        response(500, null, "Failed Connect To DB ( GET ): Satuan", res);
    };
});

router.post('/', async(req, res) => {
    const { name, turunan } = req.body;
    const latestSatuanId = Math.max(...(await dbConnect('SELECT satuan_id FROM satuan')).map(values => values.satuan_id));
    try {
        if (name === turunan) {
            const insertSatuan = await dbConnect('INSERT INTO satuan (name, turunan) VALUES (?, ?)', [name, turunan]);
            if (!insertSatuan) {
                console.error('Bad Request ( POST ): Satuan');
                response(400, null, 'Bad Request ( POST ): Satuan', res);
                return
            }
            const returnData = [{ satuan_id: latestSatuanId + 1, name, turunan }]
            response(200, returnData, "Success ( POST ): Satuan", res);
        } else {
            const filterTurunan = await dbConnect('SELECT * FROM satuan WHERE name = ?', [turunan]);
            if (filterTurunan.length > 0){
                const insertSatuan = await dbConnect('INSERT INTO satuan (name, turunan) values (?, ?)', [name, turunan]);
                    if (!insertSatuan) {
                        console.error('Bad Request ( POST ): Satuan');
                        response(400, null, 'Bad Request ( POST ): Satuan', res);
                        return;
                    }
                    const returnData = [{ satuan_id: latestSatuanId + 1, name, turunan }]
                    response(200, returnData, "Success ( POST ): Satuan", res);
            } else {
                const insertSatuan = await dbConnect('INSERT INTO satuan (name, turunan) VALUES (?, ?)', [name, turunan]);
                const insertTurunan = await dbConnect('INSERT INTO satuan (name, turunan) VALUES (?, ?)', [turunan, turunan])
                if (!insertSatuan || !insertTurunan) {
                    console.error('Bad Request ( POST ): Satuan');
                    response(400, null, 'Bad Request ( POST ): Satuan', res);
                    return
                }
                const returnData = [{
                    satuan_id: latestSatuanId + 1,
                    name: name,
                    turunan: turunan
                    },
                    {
                    satuan_id: latestSatuanId + 2,
                    name: turunan,
                    turunan: turunan
                    }]
                response(200, returnData, "Success ( POST ): Satuan", res)
            }
        }
    } catch (error) {
        console.error(error);
        response(500, null, "Failed Connect To DB ( POST ): Satuan", res);
    };
});

router.delete('/', async(req, res) => {
    const {satuan_id} = req.body;
    try {
        const deteleSatuan = await dbConnect('DELETE FROM satuan WHERE satuan_id = ?', [satuan_id]);
        if (!deteleSatuan) {
            console.error('Bad Request ( DELETE ): Satuan');
            response(400, null, 'Bad Request ( DELETE ): Satuan', res);
            return
        }

        if (deteleSatuan.affectedRows < 1) {
            response(404, null, 'Not Found ( DELETE ): Satuan', res);
        }

        response(200, null, "Success ( DELETE ): Satuan", res);
    } catch (error) {
        console.error(error);
        response(500, null, "Failed Connect To DB ( DELETE ): Satuan")
    }
})

router.put('/', async(req, res) => {
    const {satuan_id, name, turunan} = req.body;
    
    try {
        const updateSupplier = await dbConnect('UPDATE satuan SET name = ?, turunan = ? WHERE satuan_id = ?',  [name, turunan, satuan_id]);
        if (!updateSupplier) {
            console.error('Bad Request ( PUT ): Satuan');
            response(400, null, 'Bad Request ( PUT ): Satuan', res);
            return
        }
        response(200, null, "Success ( PUT ): Satuan", res);
    } catch (error) {
        console.error(error);
        response(500, null, "Failed Connect To DB ( PUT ): Satuan")
    }
})
module.exports = router