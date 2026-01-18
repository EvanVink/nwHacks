const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const crypto = require("crypto");

const dbPath = path.join(__dirname, "./emotisound.db");
const db = new sqlite3.Database(dbPath);

function runQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
}

function initSchema() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        `CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            passwordHash TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        (err) => {
          if (err) return reject(err);

          // Backfill columns if the table pre-exists without them
          db.all("PRAGMA table_info(users)", (pragmaErr, rows) => {
            if (pragmaErr) return reject(pragmaErr);

            const hasPasswordHash = rows.some(
              (col) => col.name === "passwordHash",
            );
            const hasName = rows.some((col) => col.name === "name");

            // add name column if missing (legacy tables)
            if (!hasName) {
              db.run(
                "ALTER TABLE users ADD COLUMN name TEXT DEFAULT ''",
                (alterErr) => {
                  if (alterErr) return reject(alterErr);
                  db.run(
                    "UPDATE users SET name = email WHERE name = '' OR name IS NULL",
                    (updateErr) => {
                      if (updateErr) return reject(updateErr);
                    },
                  );
                },
              );
            }

            if (!hasPasswordHash) {
              db.run(
                "ALTER TABLE users ADD COLUMN passwordHash TEXT",
                (alterErr) => {
                  if (alterErr) return reject(alterErr);
                },
              );
            }
          });

          db.run(
            `CREATE TABLE IF NOT EXISTS sessions (
                id TEXT PRIMARY KEY,
                userId TEXT NOT NULL,
                startedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                endedAt DATETIME,
                FOREIGN KEY (userId) REFERENCES users(id)
            )`,
            (err2) => {
              if (err2) return reject(err2);
              resolve();
            },
          );
        },
      );
    });
  });
}

// Initialize on startup so the tables exist by default.
initSchema().catch((err) => console.error("DB init error", err));

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
};

const verifyPassword = (password, storedHash) => {
  if (!storedHash) return false;
  const [salt, key] = storedHash.split(":");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(
    Buffer.from(key, "hex"),
    Buffer.from(derived, "hex"),
  );
};

async function addUser(name, email, password) {
  const id = crypto.randomUUID();
  const passwordHash = password ? hashPassword(password) : null;
  const query =
    "INSERT INTO users (id, name, email, passwordHash) VALUES (?, ?, ?, ?)";
  return runQuery(query, [id, name, email, passwordHash]);
}

async function getUser(id) {
  const query = "SELECT * FROM users WHERE id = ?";
  return new Promise((resolve, reject) => {
    db.get(query, [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

async function getUserByEmail(email) {
  const query = "SELECT * FROM users WHERE email = ?";
  return new Promise((resolve, reject) => {
    db.get(query, [email], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

async function updateUser(id, name, email) {
  const query = "UPDATE users SET name = ?, email = ? WHERE id = ?";
  return runQuery(query, [name, email, id]);
}

async function deleteUser(id) {
  const query = "DELETE FROM users WHERE id = ?";
  return runQuery(query, [id]);
}

async function createSession(userId) {
  const id = crypto.randomUUID();
  const query =
    "INSERT INTO sessions (id, userId, endedAt) VALUES (?, ?, NULL)";
  await runQuery(query, [id, userId]);
  return { id };
}

async function endSession(sessionId) {
  const query = "UPDATE sessions SET endedAt = CURRENT_TIMESTAMP WHERE id = ?";
  return runQuery(query, [sessionId]);
}

async function deleteOpenSessions() {
  const query = "DELETE FROM sessions WHERE endedAt IS NULL";
  return runQuery(query);
}

module.exports = {
  db,
  initSchema,
  addUser,
  getUser,
  getUserByEmail,
  updateUser,
  deleteUser,
  createSession,
  endSession,
  deleteOpenSessions,
  hashPassword,
  verifyPassword,
};
