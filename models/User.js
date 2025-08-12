const db = require('../db/db');
const bcrypt = require('bcrypt');

function createUser(username, password, callback) {
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return callback(err);
    const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    stmt.run(username, hash, callback);
    stmt.finalize();
  });
}

function findUserByUsername(username, callback) {
  db.get('SELECT * FROM users WHERE username = ?', [username], callback);
}

module.exports = {
  createUser,
  findUserByUsername
};
