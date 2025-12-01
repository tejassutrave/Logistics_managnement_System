const pool = require('./db');

async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...\n');

        // Suppliers
        console.log('📦 Seeding Suppliers...');
        const suppliers = [
            ['Global Electronics Inc', '555-0101', 'contact@globalelectronics.com', '123 Tech Street, Silicon Valley, CA 94025'],
            ['Premium Foods Ltd', '555-0102', 'sales@premiumfoods.com', '456 Market Avenue, New York, NY 10001'],
            ['AutoParts Direct', '555-0103', 'info@autopartsdirect.com', '789 Industrial Blvd, Detroit, MI 48201'],
            ['Fashion Wholesale Co', '555-0104', 'orders@fashionwholesale.com', '321 Garment District, Los Angeles, CA 90014'],
            ['Tech Components Supply', '555-0105', 'support@techcomponents.com', '654 Innovation Drive, Austin, TX 78701'],
            ['Organic Produce Partners', '555-0106', 'contact@organicproduce.com', '987 Farm Road, Portland, OR 97201'],
            ['Building Materials Corp', '555-0107', 'sales@buildingmaterials.com', '147 Construction Way, Houston, TX 77001'],
            ['Medical Supplies Plus', '555-0108', 'info@medicalsupplies.com', '258 Healthcare Lane, Boston, MA 02101'],
            ['Sports Equipment Direct', '555-0109', 'orders@sportsequipment.com', '369 Athletic Avenue, Denver, CO 80201'],
            ['Office Essentials Inc', '555-0110', 'contact@officeessentials.com', '741 Business Park, Seattle, WA 98101']
        ];

        for (const [name, phone, email, address] of suppliers) {
            await pool.query(
                'INSERT INTO supplier (name, phone, email, address) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
                [name, phone, email, address]
            );
        }

        // Warehouses
        console.log('🏭 Seeding Warehouses...');
        const warehouses = [
            ['Central Distribution Hub', '1000 Logistics Parkway', 'Chicago'],
            ['West Coast Facility', '2500 Pacific Boulevard', 'Los Angeles'],
            ['East Coast Center', '3750 Atlantic Drive', 'New York'],
            ['Southern Regional Warehouse', '4200 Commerce Street', 'Atlanta'],
            ['Midwest Storage Complex', '5100 Industrial Avenue', 'Kansas City'],
            ['Northwest Distribution', '6300 Cargo Road', 'Seattle'],
            ['Southwest Hub', '7400 Desert Highway', 'Phoenix'],
            ['Northeast Facility', '8500 Harbor View', 'Boston'],
            ['Gulf Coast Center', '9600 Port Boulevard', 'Houston'],
            ['Mountain Region Warehouse', '10700 Summit Drive', 'Denver']
        ];

        for (const [name, address, city] of warehouses) {
            await pool.query(
                'INSERT INTO warehouse (name, address, city) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
                [name, address, city]
            );
        }

        // Customers
        console.log('👥 Seeding Customers...');
        const customers = [
            ['Acme Corporation', 'purchasing@acmecorp.com', '555-1001', '100 Corporate Plaza, Suite 500', 1],
            ['TechStart Solutions', 'orders@techstart.com', '555-1002', '200 Innovation Center, Building A', 2],
            ['Retail Giants Inc', 'procurement@retailgiants.com', '555-1003', '300 Shopping District, Floor 3', 3],
            ['Green Earth Markets', 'buying@greenearth.com', '555-1004', '400 Eco Avenue, Unit 12', 4],
            ['Metro Medical Group', 'supplies@metromedical.com', '555-1005', '500 Healthcare Complex', 5],
            ['Urban Fashion Boutique', 'orders@urbanfashion.com', '555-1006', '600 Style Street, Shop 25', 6],
            ['Construction Pro Supply', 'purchasing@constructionpro.com', '555-1007', '700 Builder Boulevard', 7],
            ['Fitness First Gyms', 'equipment@fitnessfirst.com', '555-1008', '800 Wellness Way', 8],
            ['Smart Home Solutions', 'orders@smarthome.com', '555-1009', '900 Technology Terrace', 9],
            ['Gourmet Food Services', 'procurement@gourmetfood.com', '555-1010', '1000 Culinary Court', 10]
        ];

        for (const [name, email, phone, address, warehouse_id] of customers) {
            await pool.query(
                'INSERT INTO customer (name, email, phone, address, warehouse_id) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
                [name, email, phone, address, warehouse_id]
            );
        }

        // Items
        console.log('📋 Seeding Items...');
        const items = [
            ['Laptop Computer - Model X1', 2.5, 899.99, 1, 1],
            ['Organic Coffee Beans - 5lb', 2.27, 45.99, 2, 2],
            ['Brake Pad Set - Universal', 3.5, 89.99, 3, 3],
            ['Designer Jeans - Premium Denim', 0.8, 129.99, 4, 4],
            ['Graphics Card - RTX 4000', 1.2, 599.99, 5, 5],
            ['Fresh Avocados - Box of 48', 15.0, 72.00, 6, 6],
            ['Cement Mix - 50lb Bag', 22.68, 12.99, 7, 7],
            ['Surgical Gloves - Box of 100', 1.5, 24.99, 8, 8],
            ['Professional Basketball', 0.62, 49.99, 9, 9],
            ['Ergonomic Office Chair', 18.0, 299.99, 10, 10],
            ['Wireless Mouse - Bluetooth', 0.15, 29.99, 1, 1],
            ['Artisan Cheese Selection', 2.0, 65.00, 2, 2],
            ['Engine Oil - 5 Quart', 4.73, 34.99, 3, 3],
            ['Leather Handbag - Designer', 1.2, 249.99, 4, 4],
            ['SSD Drive - 1TB', 0.08, 119.99, 5, 5],
            ['Organic Quinoa - 10lb', 4.54, 38.99, 6, 6],
            ['Power Drill - Cordless', 2.3, 149.99, 7, 7],
            ['Digital Thermometer', 0.2, 18.99, 8, 8],
            ['Yoga Mat - Premium', 1.5, 39.99, 9, 9],
            ['Desk Lamp - LED', 1.8, 45.99, 10, 10]
        ];

        for (const [name, weight, price, warehouse_id, supplier_id] of items) {
            await pool.query(
                'INSERT INTO item (name, weight, price, warehouse_id, supplier_id) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
                [name, weight, price, warehouse_id, supplier_id]
            );
        }

        // Vehicles
        console.log('🚚 Seeding Vehicles...');
        const vehicles = [
            ['TRK-1001', 'Ford F-150 Cargo', 1500.00],
            ['TRK-1002', 'Mercedes Sprinter Van', 2000.00],
            ['TRK-1003', 'Freightliner M2 Box Truck', 5000.00],
            ['TRK-1004', 'RAM ProMaster 3500', 2500.00],
            ['TRK-1005', 'Isuzu NPR Box Truck', 4000.00],
            ['TRK-1006', 'Chevrolet Express Cargo', 1800.00],
            ['TRK-1007', 'Ford Transit 350', 2200.00],
            ['TRK-1008', 'International DuraStar', 6000.00],
            ['TRK-1009', 'GMC Savana 3500', 2100.00],
            ['TRK-1010', 'Peterbilt 220 Box Truck', 7000.00]
        ];

        for (const [license_plate, model, capacity] of vehicles) {
            await pool.query(
                'INSERT INTO vehicle (license_plate, model, capacity) VALUES ($1, $2, $3) ON CONFLICT (license_plate) DO NOTHING',
                [license_plate, model, capacity]
            );
        }

        // Drivers
        console.log('👨‍✈️ Seeding Drivers...');
        const drivers = [
            ['James Wilson', 'CDL-A-123456', '555-2001', 1],
            ['Maria Garcia', 'CDL-B-234567', '555-2002', 2],
            ['Robert Chen', 'CDL-A-345678', '555-2003', 3],
            ['Jennifer Brown', 'CDL-B-456789', '555-2004', 4],
            ['Michael Davis', 'CDL-A-567890', '555-2005', 5],
            ['Linda Martinez', 'CDL-B-678901', '555-2006', 6],
            ['David Anderson', 'CDL-A-789012', '555-2007', 7],
            ['Patricia Taylor', 'CDL-A-890123', '555-2008', 8],
            ['Christopher Lee', 'CDL-B-901234', '555-2009', 9],
            ['Sarah Johnson', 'CDL-A-012345', '555-2010', 10]
        ];

        for (const [name, license, phone, vehicle_id] of drivers) {
            await pool.query(
                'INSERT INTO driver (name, license, phone, vehicle_id) VALUES ($1, $2, $3, $4) ON CONFLICT (license) DO NOTHING',
                [name, license, phone, vehicle_id]
            );
        }

        // Summary
        console.log('\n📊 Database Summary:');
        console.log('═'.repeat(50));

        const tables = ['users', 'supplier', 'warehouse', 'customer', 'item', 'vehicle', 'driver'];

        for (const table of tables) {
            const result = await pool.query(`SELECT COUNT(*) FROM ${table}`);
            console.log(`${table.padEnd(15)} : ${result.rows[0].count} records`);
        }

        console.log('═'.repeat(50));
        console.log('\n✨ Seeding completed successfully!\n');

        process.exit(0);
    } catch (error) {
        console.error('💥 Error:', error.message);
        process.exit(1);
    }
}

seedDatabase();
