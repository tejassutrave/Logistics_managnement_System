const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Logistics Management System API is running');
});

// Import Routes (will create these next)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/suppliers', require('./routes/suppliers'));
app.use('/api/warehouses', require('./routes/warehouses'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/items', require('./routes/items'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/drivers', require('./routes/drivers'));
app.use('/api/shipments', require('./routes/shipments'));


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
