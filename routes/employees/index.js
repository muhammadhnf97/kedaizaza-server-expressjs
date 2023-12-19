const dbConnect = require('../../database')
const express = require('express');
const response = require('../../lib/response');
const router = express.Router();

router.get('/', async(req, res) => {
    const pages = req.query.page || 1
    const items_per_page = 10
    const offset = (pages - 1) * items_per_page
    const totalPage = Math.ceil(((await dbConnect('SELECT COUNT(*) AS totalRow FROM employees')).map(values=>values.totalRow)[0]) / 10)
    try {
        const data = await dbConnect('SELECT * FROM employees LIMIT ? OFFSET ?', [items_per_page, offset]);
        if (data.length > 0) {
            response(200, data, "Success ( GET ): Employees", res, { pages, items_per_page, offset, totalPage });
        } else {
            response(404, null, "Not Found ( GET ): Employees", res);
        };
    } catch (error) {
        console.log(error);
        response(500, null, "Failed Connect To DB ( GET ): Employees", res);
    };
});

router.post('/', async(req, res) => {
    const { name, position, address, no_telp } = req.body;
    try {
        const getEmployeesId = await dbConnect('SELECT employee_id FROM employees');
        const lastEmployeeId = Math.max(getEmployeesId.map(values=>Number(values.employee_id.slice(4)))) + 1 || 1;
        const newEmployeeId = 'EMP-' + lastEmployeeId.toString().padStart(3, 0);
        
        const insertEmployee = await dbConnect('INSERT INTO employees (employee_id, name, position, address, no_telp) VALUES (?, ?, ?, ?, ?)', [newEmployeeId, name, position, address, no_telp ]);
        if (!insertEmployee) {
            console.error('Bad Request ( POST ): Employee');
            response(400, null, 'Bad Request ( POST ): Employees', res);
            return
        }

        const returnData = [{ employee_id: newEmployeeId, name, position, address, no_telp }]
        response(200, returnData, "Success ( POST ): Employees", res);

    } catch (error) {
        console.error(error);
        response(500, null, "Failed Connect To DB ( POST ): Employees", res);
    };
});

router.delete('/', async(req, res) => {
    const {employee_id} = req.body;
    try {
        const deleteEmployee = await dbConnect('DELETE FROM employees WHERE employee_id = ?', [employee_id]);
        if (!deleteEmployee) {
            console.error('Bad Request ( DELETE ): Employees');
            response(400, null, 'Bad Request ( DELETE ): Employees', res);
            return
        }

        if (deleteEmployee.affectedRows < 1) {
            response(404, null, 'Not Found ( DELETE ): Employees', res);
        }

        response(200, null, "Success ( DELETE ): Employees", res);
    } catch (error) {
        console.error(error);
        response(500, null, "Failed Connect To DB ( DELETE ): Employees")
    }
})

router.put('/', async(req, res) => {
    const {employee_id, name, position, address, no_telp} = req.body;
    try {
        const updateEmployee = await dbConnect('UPDATE employees SET name = ?, position = ?, address = ?, no_telp = ? WHERE employee_id = ?', [name, position, address, no_telp, employee_id]);
        if (!updateEmployee) {
            console.error('Bad Request ( PUT ): Employees');
            response(400, null, 'Bad Request ( PUT ): Employees', res);
            return
        }
        const returnData = [{ employee_id, name, position, address, no_telp }]
        response(200, returnData, "Success ( PUT ): Employee", res);
    } catch (error) {
        console.error(error);
        response(500, null, "Failed Connect To DB ( PUT ): Employees")
    }
})
module.exports = router