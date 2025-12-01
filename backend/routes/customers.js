const router = require('express').Router();
const pool = require('../db');
const { verifyToken, isAdminOrManager } = require('../middleware/auth');

router.post('/', async (req, res) => {
    try {
        const { name, email, phone, address, warehouse_id } = req.body;
        const newCustomer = await pool.query(
            'INSERT INTO customer (name, email, phone, address, warehouse_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, email, phone, address, warehouse_id]
        );
        res.json(newCustomer.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/', async (req, res) => {
    try {
        const allCustomers = await pool.query('SELECT * FROM customer ORDER BY id ASC');
        res.json(allCustomers.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, address, warehouse_id } = req.body;
        const updateCustomer = await pool.query(
            'UPDATE customer SET name = $1, email = $2, phone = $3, address = $4, warehouse_id = $5 WHERE id = $6 RETURNING *',
            [name, email, phone, address, warehouse_id, id]
        );
        res.json(updateCustomer.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/:id', verifyToken, isAdminOrManager, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM customer WHERE id = $1', [id]);
        res.json('Customer was deleted');
    } catch (err) {
        console.error(err.message);
        if (err.code === '23503') {
            res.status(400).send('Cannot delete: This customer is referenced by other records (e.g., shipments).');
        } else {
            res.status(500).send('Server Error');
        }
    }
});

module.exports = router;
