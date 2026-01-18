const { initSchema } = require("./db/database");
const userRoutes = require("./routes/user");
const sessionRoutes = require("./routes/session");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
// const auth              = require('./src/middleware/auth');
// const authRoutes        = require('./src/routes/auth');
// const userRoutes        = require('./src/routes/user');
// const analyticsRoutes   = require('./src/routes/analytics');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use(userRoutes);
app.use(sessionRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Manual DB initialization endpoint (idempotent)
app.post("/admin/init-db", async (_req, res) => {
  try {
    await initSchema();
    res.status(200).json({ status: "initialized" });
  } catch (err) {
    console.error("init-db error", err);
    res.status(500).json({ error: "Failed to initialize DB" });
  }
});

// // 404 handler
// app.use((req, res) => {
//     res.status(404).json({ error: 'Not found' });
// });

// // Error handler
// app.use((err, req, res, next) => {
//     console.error('Server error:', err);
//     res.status(500).json({ error: 'Internal server error' });
// });

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
