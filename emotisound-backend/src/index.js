require('dotenv').config();

const express           = require('express');
const cors              = require('cors');
const auth              = require('./src/middleware/auth');
const authRoutes        = require('./src/routes/auth');
const userRoutes        = require('./src/routes/user');
const analyticsRoutes   = require('./src/routes/analytics');

const app   = express();
const PORT  = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', auth, userRoutes);
app.use('/api/analytics', auth, analyticsRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
});
