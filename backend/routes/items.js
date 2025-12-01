const router = require('express').Router();
const pool = require('../db');
const { verifyToken, isAdminOrManager } = require('../middleware/auth');

router.post('/', async (req, res) => {
    try {
        const { name, weight, price, warehouse_id, supplier_id } = req.body;
        const newItem = await pool.query(
            'INSERT INTO item (name, weight, price, warehouse_id, supplier_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, weight, price, warehouse_id, supplier_id]
        );
        res.json(newItem.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/', async (req, res) => {
    try {
        const allItems = await pool.query('SELECT * FROM item ORDER BY id ASC');
        res.json(allItems.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, weight, price, warehouse_id, supplier_id } = req.body;
        const updateItem = await pool.query(
            'UPDATE item SET name = $1, weight = $2, price = $3, warehouse_id = $4, supplier_id = $5 WHERE id = $6 RETURNING *',
            [name, weight, price, warehouse_id, supplier_id, id]
        );
        res.json(updateItem.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/:id', verifyToken, isAdminOrManager, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM item WHERE id = $1', [id]);
        res.json('Item was deleted');
    } catch (err) {
        console.error(err.message);
        if (err.code === '23503') {
            res.status(400).send('Cannot delete: This item is referenced by other records (e.g., shipments).');
        } else {
            res.status(500).send('Server Error');
        }
    }
});

module.exports = router;
