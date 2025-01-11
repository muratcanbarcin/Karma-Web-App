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
        const query = `
            INSERT INTO Users (Name, Email, Password)
            VALUES (?, ?, ?)
        `;
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
        if (user.Password !== password) {
            return res.status(401).json({ error: 'Geçersiz şifre' });
        }

        // JWT oluştur
        const token = jwt.sign({ id: user.Id, email: user.Email }, SECRET_KEY, {
            expiresIn: '1h',
        });

        res.status(200).json({ message: 'Giriş başarılı', token });
    } catch (err) {
        console.error('Giriş sırasında hata oluştu:', err);
        res.status(500).json({ error: 'Giriş sırasında hata oluştu' });
    }
});

module.exports = router;
