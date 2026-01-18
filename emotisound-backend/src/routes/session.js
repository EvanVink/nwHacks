const express = require("express");
const {
  getUser,
  createSession,
  endSession,
  deleteOpenSessions,
} = require("../db/database");

const router = express.Router();

// Start session
router.post("/sessions/start", async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "userId is required" });

  try {
    const user = await getUser(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const { id } = await createSession(userId);
    res
      .status(201)
      .json({ sessionId: id, startedAt: new Date().toISOString() });
  } catch (error) {
    console.error("start session error", error);
    res.status(500).json({ error: "Failed to start session" });
  }
});

// End session
router.post("/sessions/:id/end", async (req, res) => {
  const sessionId = req.params.id;
  try {
    await endSession(sessionId);
    res.status(200).json({ sessionId, endedAt: new Date().toISOString() });
  } catch (error) {
    console.error("end session error", error);
    res.status(500).json({ error: "Failed to end session" });
  }
});

// One-time admin cleanup: delete sessions without an endedAt
router.post("/admin/cleanup-sessions", async (_req, res) => {
  try {
    await deleteOpenSessions();
    res.status(200).json({ status: "deleted open sessions" });
  } catch (error) {
    console.error("cleanup sessions error", error);
    res.status(500).json({ error: "Failed to delete open sessions" });
  }
});

module.exports = router;
