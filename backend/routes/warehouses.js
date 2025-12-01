const router = require('express').Router();
const pool = require('../db');
const { verifyToken, isAdminOrManager } = require('../middleware/auth');

router.post('/', async (req, res) => {
    try {
        const { name, address, city } = req.body;
        const newWarehouse = await pool.query(
            'INSERT INTO warehouse (name, address, city) VALUES ($1, $2, $3) RETURNING *',
            [name, address, city]
        );
        res.json(newWarehouse.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/', async (req, res) => {
    try {
        const allWarehouses = await pool.query('SELECT * FROM warehouse ORDER BY id ASC');
        res.json(allWarehouses.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, address, city } = req.body;
        const updateWarehouse = await pool.query(
            'UPDATE warehouse SET name = $1, address = $2, city = $3 WHERE id = $4 RETURNING *',
            [name, address, city, id]
        );
        res.json(updateWarehouse.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/:id', verifyToken, isAdminOrManager, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM warehouse WHERE id = $1', [id]);
        res.json('Warehouse was deleted');
    } catch (err) {
        console.error(err.message);
        if (err.code === '23503') {
            res.status(400).send('Cannot delete: This warehouse is referenced by other records (e.g., items or customers).');
        } else {
            res.status(500).send('Server Error');
        }
    }
});

module.exports = router;
