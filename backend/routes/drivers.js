const router = require('express').Router();
const pool = require('../db');
const { verifyToken, isAdminOrManager } = require('../middleware/auth');

router.post('/', async (req, res) => {
    try {
        const { name, license, phone, vehicle_id } = req.body;
        const newDriver = await pool.query(
            'INSERT INTO driver (name, license, phone, vehicle_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, license, phone, vehicle_id]
        );
        res.json(newDriver.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/', async (req, res) => {
    try {
        const allDrivers = await pool.query('SELECT * FROM driver ORDER BY id ASC');
        res.json(allDrivers.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, license, phone, vehicle_id } = req.body;
        const updateDriver = await pool.query(
            'UPDATE driver SET name = $1, license = $2, phone = $3, vehicle_id = $4 WHERE id = $5 RETURNING *',
            [name, license, phone, vehicle_id, id]
        );
        res.json(updateDriver.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/:id', verifyToken, isAdminOrManager, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM driver WHERE id = $1', [id]);
        res.json('Driver was deleted');
    } catch (err) {
        console.error(err.message);
        if (err.code === '23503') {
            res.status(400).send('Cannot delete: This driver is referenced by other records (e.g., shipments).');
        } else {
            res.status(500).send('Server Error');
        }
    }
});

module.exports = router;
