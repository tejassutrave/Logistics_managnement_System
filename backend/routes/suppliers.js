const router = require('express').Router();
const pool = require('../db');
const { verifyToken, isAdminOrManager } = require('../middleware/auth');

// Create Supplier
router.post('/', async (req, res) => {
    try {
        const { name, phone, email, address } = req.body;
        const newSupplier = await pool.query(
            'INSERT INTO supplier (name, phone, email, address) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, phone, email, address]
        );
        res.json(newSupplier.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get All Suppliers
router.get('/', async (req, res) => {
    try {
        const allSuppliers = await pool.query('SELECT * FROM supplier ORDER BY id ASC');
        res.json(allSuppliers.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get Supplier by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const supplier = await pool.query('SELECT * FROM supplier WHERE id = $1', [id]);
        res.json(supplier.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update Supplier
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone, email, address } = req.body;
        const updateSupplier = await pool.query(
            'UPDATE supplier SET name = $1, phone = $2, email = $3, address = $4 WHERE id = $5 RETURNING *',
            [name, phone, email, address, id]
        );
        res.json(updateSupplier.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete Supplier
router.delete('/:id', verifyToken, isAdminOrManager, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM supplier WHERE id = $1', [id]);
        res.json('Supplier was deleted');
    } catch (err) {
        console.error(err.message);
        if (err.code === '23503') {
            res.status(400).send('Cannot delete: This supplier is referenced by other records (e.g., items).');
        } else {
            res.status(500).send('Server Error');
        }
    }
});

module.exports = router;
