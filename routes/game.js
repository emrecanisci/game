const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const db = require('../db/db');

router.get('/roulette', auth, (req, res) => {
  res.render('roulette', { title: 'Roulette' });
});

router.post('/roulette', auth, (req, res) => {
  const { bet_amount, bet_color } = req.body;
  const colors = ['red', 'black', 'green'];
  const result = colors[Math.floor(Math.random() * colors.length)];
  let payout = 0;
  if (result === bet_color) {
    payout = bet_color === 'green' ? bet_amount * 14 : bet_amount * 2;
  }

  db.run(
    `INSERT INTO bets (user_id, bet_amount, bet_color, result_color) VALUES (?, ?, ?, ?)`,
    [req.session.user.id, bet_amount, bet_color, result],
    (err) => {
      if (err) {
        req.flash('error', 'Bet could not be saved.');
        return res.redirect('/game/roulette');
      }
      req.flash('success', `Result: ${result}. Payout: ${payout}`);
      res.redirect('/game/roulette');
    }
  );
});

module.exports = router;
