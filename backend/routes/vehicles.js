const router = require('express').Router();
const pool = require('../db');
const { verifyToken, isAdminOrManager } = require('../middleware/auth');

router.post('/', async (req, res) => {
    try {
        const { license_plate, model, capacity } = req.body;
        const newVehicle = await pool.query(
            'INSERT INTO vehicle (license_plate, model, capacity) VALUES ($1, $2, $3) RETURNING *',
            [license_plate, model, capacity]
        );
        res.json(newVehicle.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/', async (req, res) => {
    try {
        const allVehicles = await pool.query('SELECT * FROM vehicle ORDER BY id ASC');
        res.json(allVehicles.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { license_plate, model, capacity } = req.body;
        const updateVehicle = await pool.query(
            'UPDATE vehicle SET license_plate = $1, model = $2, capacity = $3 WHERE id = $4 RETURNING *',
            [license_plate, model, capacity, id]
        );
        res.json(updateVehicle.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/:id', verifyToken, isAdminOrManager, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM vehicle WHERE id = $1', [id]);
        res.json('Vehicle was deleted');
    } catch (err) {
        console.error(err.message);
        if (err.code === '23503') {
            res.status(400).send('Cannot delete: This vehicle is referenced by other records (e.g., drivers or shipments).');
        } else {
            res.status(500).send('Server Error');
        }
    }
});

module.exports = router;
