const { addUser, getUser } = require("./db/database");

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
// app.use('/api/auth', authRoutes);
// app.use('/api/user', auth, userRoutes);
// app.use('/api/analytics', auth, analyticsRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
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

app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  try {
    const result = await addUser(name, email);
    res.status(201).json({ id: result.lastID, name, email });
  } catch (error) {
    res.status(500).json({ error: "Failed to add user" });
  }
});

app.get("/users/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await getUser(userId);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve user" });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
