import express from 'express';
const router = express.Router();

router.get('/about', (req, res) => {
    res.json({
        name: 'Mediator App',
        version: '1.0.0',
        description: 'A platform for connecting mediators and users'
    });
});

export default router;