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
        const data = await dbConnect('SELECT * FROM categories');
        if (data.length > 0) {
            response(200, data, "Success ( GET ): Categories", res, { pages, items_per_page, offset, totalPage });
        } else {
            response(404, null, "Not Found ( GET ): Categories", res);
        };
    } catch (error) {
        console.log(error);
        response(500, null, "Failed Connect To DB ( GET ): Categories", res);
    };
});

router.post('/', async(req, res) => {
    const { name } = req.body;
    const getCategoriesId = (await dbConnect('SELECT category_id FROM categories')).map(values=>Number(values.category_id.slice(4)));
    const lastCategoriesId = getCategoriesId.length > 0 ? Math.max(...getCategoriesId) + 1 : 1
    const newCategoryId = 'CTG-' + lastCategoriesId.toString().padStart(3, 0);

    try {
        
        const insertCategories = await dbConnect('INSERT INTO categories (category_id, name) VALUES (?, ?)', [newCategoryId, name]);
        if (!insertCategories) {
            console.error('Bad Request ( POST ): Categories');
            response(400, null, 'Bad Request ( POST ): Categories', res);
            return
        }
        const returnData = [{ category_id: newCategoryId, name }]
        response(200, returnData, "Success ( POST ): Categories", res);

    } catch (error) {
        console.error(error);
        response(500, null, "Failed Connect To DB ( POST ): Categories", res);
    };
});

router.delete('/', async(req, res) => {
    const {category_id} = req.body;
    try {
        const deleteCategory = await dbConnect('DELETE FROM categories WHERE category_id = ?', [category_id]);
        if (!deleteCategory) {
            console.error('Bad Request ( DELETE ): Categories');
            response(400, null, 'Bad Request ( DELETE ): Categories', res);
            return
        }

        if (deleteCategory.affectedRows < 1) {
            response(404, null, 'Not Found ( DELETE ): Categories', res);
        }

        response(200, null, "Success ( DELETE ): Categories", res);
    } catch (error) {
        console.error(error);
        response(500, null, "Failed Connect To DB ( DELETE ): Categories")
    }
})

router.put('/', async(req, res) => {
    const {category_id, name} = req.body;
    try {
        const updateCategory = await dbConnect('UPDATE categories SET name = ? WHERE category_id = ?', [name, category_id]);
        if (!updateCategory) {
            console.error('Bad Request ( PUT ): Categories');
            response(400, null, 'Bad Request ( PUT ): Categories', res);
            return
        }
        const returnData = [{ category_id, name }]
        response(200, returnData, "Success ( PUT ): Categories", res);
    } catch (error) {
        console.error(error);
        response(500, null, "Failed Connect To DB ( PUT ): Categories")
    }
})
module.exports = router