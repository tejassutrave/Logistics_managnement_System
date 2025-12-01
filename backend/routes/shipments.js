const router = require('express').Router();
const pool = require('../db');
const { verifyToken, isAdminOrManager } = require('../middleware/auth');

router.post('/', async (req, res) => {
    try {
        const { item_id, quantity, vehicle_id, driver_id, customer_id, shipment_date, status } = req.body;
        const newShipment = await pool.query(
            'INSERT INTO shipment (item_id, quantity, vehicle_id, driver_id, customer_id, shipment_date, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [item_id, quantity, vehicle_id, driver_id, customer_id, shipment_date, status || 'pending']
        );
        res.json(newShipment.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/', async (req, res) => {
    try {
        const allShipments = await pool.query('SELECT * FROM shipment ORDER BY id ASC');
        res.json(allShipments.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { item_id, quantity, vehicle_id, driver_id, customer_id, shipment_date, status } = req.body;
        const updateShipment = await pool.query(
            'UPDATE shipment SET item_id = $1, quantity = $2, vehicle_id = $3, driver_id = $4, customer_id = $5, shipment_date = $6, status = $7 WHERE id = $8 RETURNING *',
            [item_id, quantity, vehicle_id, driver_id, customer_id, shipment_date, status, id]
        );
        res.json(updateShipment.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/:id', verifyToken, isAdminOrManager, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM shipment WHERE id = $1', [id]);
        res.json('Shipment was deleted');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
