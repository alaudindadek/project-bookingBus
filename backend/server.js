const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'booktics'
});

app.get('/api/routes', async (req, res) => {
    try {
        const [rows] = await db.query(` SELECT 
                id, code, origin, destination,
                DATE_FORMAT(route_date, '%Y-%m-%d') AS route_date,
                TIME_FORMAT(departure_time, '%H:%i') AS departure_time,
                TIME_FORMAT(arrival_time, '%H:%i') AS arrival_time,
                price, total_seats, available_seats, status
            FROM routes
            ORDER BY route_date ASC, departure_time ASC`);
        res.status(200).json(rows);
    }catch (error){
        res.status(500).json({ error: error.message });
    }
})

app.post('/api/routes', async (req, res) => {
    try {
        const { code, origin, destination, route_date , departure_time, arrival_time, price, total_seats, available_seats, status} = req.body;
        const [resultAddRoute] = await db.query(
            'INSERT INTO routes (code, origin, destination, route_date, departure_time, arrival_time, price, total_seats, available_seats, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [code, origin, destination, route_date, departure_time, arrival_time, price, total_seats, available_seats, status]
        );
        const [rows] = await db.query(`
            SELECT 
                id, code, origin, destination,
                DATE_FORMAT(route_date, '%Y-%m-%d') AS route_date,
                TIME_FORMAT(departure_time, '%H:%i') AS departure_time,
                TIME_FORMAT(arrival_time, '%H:%i') AS arrival_time,
                price, total_seats, available_seats, status
            FROM routes
            WHERE id = ?`, [resultAddRoute.insertId]);
        res.status(201).json(rows[0]);
    }catch (error){
        res.status(500).json({ error: error.message });
    }
})

app.delete('/api/routes/:id', async (req, res) => {
    try {
        // object store paremeter value in a URL such as { id: "123" }
        const { id } = req.params;
        const [resultDelete] = await db.query('DELETE FROM routes WHERE id = ?', [id]);
        res.status(200).json({ message: 'User deleted', route: resultDelete });
    }catch (error){
        res.status(500).json({ error: error.message });
    }
})

app.put('/api/routes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { code, origin, destination, route_date, departure_time, arrival_time, price, total_seats, available_seats, status} = req.body;
        const [resultUpdate] = await db.query(
            'UPDATE routes SET code = ?, origin = ?, destination = ?,route_date = ?, departure_time = ?, arrival_time = ?, price = ?, total_seats = ?, available_seats = ?, status = ? WHERE id = ?',
            [code, origin, destination, route_date, departure_time, arrival_time, price, total_seats, available_seats, status, id]
        );
        const [rows] = await db.query(`
            SELECT 
                id, code, origin, destination,
                DATE_FORMAT(route_date, '%Y-%m-%d') AS route_date,
                TIME_FORMAT(departure_time, '%H:%i') AS departure_time,
                TIME_FORMAT(arrival_time, '%H:%i') AS arrival_time,
                price, total_seats, available_seats, status
            FROM routes
            WHERE id = ?`, [id]);
        res.status(200).json(rows[0]);
    }catch (error){
        res.status(500).json({ error: error.message });
    }
})

app.get('/api/bookings', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT b.*, r.code, r.origin, r.destination
            FROM bookings b
            JOIN routes r ON b.route_id = r.id
            ORDER BY b.created_at DESC
        `);
        res.json(rows);
    }catch (error) {
        res.status(500).json({ error: error.message});
    }
})

// เพิ่ม booking ใหม่
app.post('/api/bookings', async (req, res) => {
    try {
        const { routeId, customerName, seatCount } = req.body;

        // ตรวจสอบว่า route มีจริงไหม
        const [routes] = await db.query('SELECT * FROM routes WHERE id = ?', [routeId]);
        if (routes.length === 0) {
            return res.status(404).json({ message: 'ไม่พบเที่ยวรถ' });
        }

        const route = routes[0];
        if (route.available_seats < seatCount) {
            return res.status(400).json({ message: 'ที่นั่งไม่เพียงพอ' });
        }

        const totalPrice = route.price * seatCount;

        // Insert booking
        const [result] = await db.query(
            'INSERT INTO bookings (route_id, customer_name, seat_count, total_price, booking_date) VALUES (?, ?, ?, ?, CURDATE())',
            [routeId, customerName, seatCount, totalPrice]
        );

        // อัพเดตจำนวนที่นั่งคงเหลือ
        await db.query(
            'UPDATE routes SET available_seats = available_seats - ? WHERE id = ?',
            [seatCount, routeId]
        );

        // ส่ง booking ที่เพิ่งสร้าง
        const [newBooking] = await db.query('SELECT * FROM bookings WHERE id = ?', [result.insertId]);
        res.status(201).json(newBooking[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})

