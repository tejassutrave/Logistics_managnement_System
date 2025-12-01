# How to Use the Seed Data

## Method 1: Using psql Command Line

```bash
# Navigate to the backend directory
cd backend

# Run the seed file
psql -U postgres -d logistics_db -f seed.sql
```

## Method 2: Using pgAdmin

1. Open pgAdmin
2. Connect to your PostgreSQL server
3. Right-click on `logistics_db` database
4. Select **Query Tool**
5. Click **Open File** and select `seed.sql`
6. Click **Execute** (F5)

## Method 3: Using Node.js Script

```bash
# From the backend directory
node -e "const { exec } = require('child_process'); exec('psql -U postgres -d logistics_db -f seed.sql', (err, stdout) => console.log(stdout || err));"
```

## What Gets Inserted

- **10 Users** (including the original 3 + 7 more)
- **10 Suppliers** (various industries: electronics, food, auto parts, fashion, etc.)
- **10 Warehouses** (distributed across major US cities)
- **10 Customers** (businesses from different sectors)
- **20 Items** (2 items per warehouse, diverse product range)
- **10 Vehicles** (different truck models with varying capacities)
- **10 Drivers** (each assigned to one vehicle)

## Verification

After running the seed file, you should see a success message showing the count of records in each table.

You can also verify by:

```sql
-- Check all tables
SELECT 
    (SELECT COUNT(*) FROM users) as users,
    (SELECT COUNT(*) FROM supplier) as suppliers,
    (SELECT COUNT(*) FROM warehouse) as warehouses,
    (SELECT COUNT(*) FROM customer) as customers,
    (SELECT COUNT(*) FROM item) as items,
    (SELECT COUNT(*) FROM vehicle) as vehicles,
    (SELECT COUNT(*) FROM driver) as drivers;
```

## Starting Fresh

If you want to clear all data and start over, uncomment the TRUNCATE line at the top of `seed.sql`:

```sql
TRUNCATE TABLE driver, vehicle, item, customer, warehouse, supplier, users RESTART IDENTITY CASCADE;
```

This will delete all existing data before inserting the seed data.

## Sample Data Highlights

### Suppliers
- Global Electronics Inc (tech products)
- Premium Foods Ltd (food items)
- AutoParts Direct (vehicle parts)
- Fashion Wholesale Co (clothing)
- And 6 more diverse suppliers

### Warehouses
- Distributed across major cities: Chicago, LA, NYC, Atlanta, etc.
- Each with unique addresses

### Items
- Range from laptops ($899.99) to cement bags ($12.99)
- Weights from 0.08 kg (SSD) to 22.68 kg (cement)
- All properly linked to warehouses and suppliers

### Vehicles
- Capacity range: 1,500 kg to 7,000 kg
- Various models: Ford, Mercedes, Freightliner, etc.
- Realistic license plates (TRK-1001 through TRK-1010)

### Drivers
- All have CDL licenses (Class A or B)
- Each assigned to one vehicle
- Contact phone numbers provided
