const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json('incorrect form submission');
  }
  const hash = bcrypt.hashSync(password);
  db.transaction(trx => {
    trx.insert({
      hash: hash,
      email: email
    })
    .into('login')
    .returning('email')
    .then(loginEmail => {
      return trx('users').returning('*').insert({
        email: loginEmail[0], // This returns the email from the login table
        name: name,
        joined: new Date()
      }).then(user => {
        res.json(user[0]);
      })
      .catch(err => {
        console.error('Error inserting into users:', err);
        res.status(400).json('unable to register user');
      });
    })
    .then(trx.commit)
    .catch(trx.rollback);
  })
  .catch(err => {
    console.error('Transaction error:', err);
    res.status(400).json('unable to register');
  });
};

// Make sure to export the function here
module.exports = {
  handleRegister
};
