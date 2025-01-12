const express = require('express');
const router = express.Router();
const pool = require('../database/connection'); // Database bağlantısı
const jwt = require('jsonwebtoken'); // JSON Web Token kullanımı için

const SECRET_KEY = 'your_secret_key'; // JWT için gizli anahtar

// Kullanıcı kaydı endpoint
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Lütfen tüm alanları doldurun' });
    }

    try {
        // E-posta kontrolü
        const emailCheckQuery = `SELECT * FROM Users WHERE Email = ?`;
        const [existingUser] = await pool.query(emailCheckQuery, [email]);

        if (existingUser.length > 0) {
            return res.status(409).json({ error: 'Bu e-posta zaten kayıtlı.' }); // 409 Conflict
        }

        // Kullanıcıyı veritabanına ekle
        const query = `INSERT INTO Users (Name, Email, Password) VALUES (?, ?, ?)`;

        await pool.query(query, [name, email, password]);

        res.status(201).json({ message: 'Kayıt başarılı' });
    } catch (err) {
        console.error('Kayıt sırasında hata oluştu:', err);
        res.status(500).json({ error: 'Kayıt sırasında hata oluştu' });
    }
});

// Kullanıcı giriş endpoint
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Lütfen tüm alanları doldurun' });
    }

    try {
        // Kullanıcıyı veritabanından al
        const query = `SELECT * FROM Users WHERE Email = ?`;
        const [results] = await pool.query(query, [email]);

        if (results.length === 0) {
            return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
        }

        const user = results[0];

        // Şifreyi doğrula
        if (password !== user.Password) {
            return res.status(401).json({ error: 'Geçersiz şifre' });
        }
        // JWT oluştur
        const token = jwt.sign({ email: user.Email }, SECRET_KEY, { expiresIn: '1h' });


        res.status(200).json({ message: 'Giriş başarılı', token });
    } catch (err) {
        console.error('Giriş sırasında hata oluştu:', err);
        res.status(500).json({ error: 'Giriş sırasında hata oluştu' });
    }
});
router.get('/MyAccount', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: 'Authorization token is required' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const userEmail = decoded.email;

        const query = `
          SELECT 
            Name, 
            Email, 
            Gender, 
            Country, 
            DATE_FORMAT(DateOfBirth, '%Y-%m-%d') AS DateOfBirth, 
            TimeZone 
          FROM Users 
          WHERE Email = ?;
        `;
        const [results] = await pool.query(query, [userEmail]);

        if (results.length === 0) {
            return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
        }

        res.status(200).json(results[0]);
    } catch (err) {
        console.error('Kullanıcı bilgileri alınırken hata oluştu:', err);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Kullanıcı bilgilerini güncelleme endpoint
router.put('/MyAccount', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: 'Authorization token is required' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const userEmail = decoded.email;

        const { Name, Gender, Country, DateOfBirth, TimeZone } = req.body;

        if (!Name || !Gender || !Country || !DateOfBirth || !TimeZone) {
            return res.status(400).json({ error: 'Tüm alanları doldurun.' });
        }

        const query = `
            UPDATE Users
            SET 
                Name = ?, 
                Gender = ?, 
                Country = ?, 
                DateOfBirth = ?, 
                TimeZone = ?
            WHERE Email = ?;
        `;

        const [result] = await pool.query(query, [
            Name, Gender, Country, DateOfBirth, TimeZone, userEmail
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
        }

        res.status(200).json({ message: 'Bilgiler başarıyla güncellendi.' });
    } catch (err) {
        console.error('Güncelleme sırasında hata:', err);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});


module.exports = router;
