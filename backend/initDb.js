const pool = require('./db');

const createTables = async () => {
  try {
    // Users Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(50) NOT NULL,
        role VARCHAR(20) NOT NULL
      );
    `);

    // Seed Users if empty
    const usersCheck = await pool.query('SELECT * FROM users');
    if (usersCheck.rows.length === 0) {
      await pool.query(`
        INSERT INTO users (username, password, role) VALUES
        ('admin', 'admin123', 'admin'),
        ('manager', 'manager123', 'manager'),
        ('driver', 'driver123', 'driver');
      `);
      console.log('Seeded users');
    }

    // Supplier Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS supplier (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        email VARCHAR(100),
        address TEXT
      );
    `);

    // Warehouse Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS warehouse (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        address TEXT,
        city VARCHAR(50)
      );
    `);

    // Customer Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS customer (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100),
        phone VARCHAR(20),
        address TEXT,
        warehouse_id INTEGER REFERENCES warehouse(id)
      );
    `);

    // Item Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS item (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        weight DECIMAL(10, 2),
        price DECIMAL(10, 2),
        warehouse_id INTEGER REFERENCES warehouse(id),
        supplier_id INTEGER REFERENCES supplier(id)
      );
    `);

    // Vehicle Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicle (
        id SERIAL PRIMARY KEY,
        license_plate VARCHAR(20) UNIQUE NOT NULL,
        model VARCHAR(50),
        capacity DECIMAL(10, 2)
      );
    `);

    // Driver Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS driver (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        license VARCHAR(50) UNIQUE,
        phone VARCHAR(20),
        vehicle_id INTEGER REFERENCES vehicle(id)
      );
    `);

    // Shipment Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS shipment (
        id SERIAL PRIMARY KEY,
        item_id INTEGER REFERENCES item(id),
        quantity INTEGER NOT NULL,
        vehicle_id INTEGER REFERENCES vehicle(id),
        driver_id INTEGER REFERENCES driver(id),
        customer_id INTEGER REFERENCES customer(id),
        shipment_date DATE NOT NULL,
        status VARCHAR(20) DEFAULT 'pending'
      );
    `);

    console.log('Tables created/verified successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error creating tables', err);
    process.exit(1);
  }
};

createTables();
