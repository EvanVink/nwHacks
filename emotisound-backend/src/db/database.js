const sqlite3 = require("sqlite3").verbose();
const path = require("path");

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

async function addUser(name, email) {
  const query = "INSERT INTO users (name, email) VALUES (?, ?)";
  return runQuery(query, [name, email]);
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

async function updateUser(id, name, email) {
  const query = "UPDATE users SET name = ?, email = ? WHERE id = ?";
  return runQuery(query, [name, email, id]);
}

async function deleteUser(id) {
  const query = "DELETE FROM users WHERE id = ?";
  return runQuery(query, [id]);
}

// Exporting the new methods
module.exports = {
  db,
  addUser,
  getUser,
  updateUser,
  deleteUser,
};
