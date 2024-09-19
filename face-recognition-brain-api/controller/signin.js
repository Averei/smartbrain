const handleSignin = (db, bcrypt) => (req, res) => {
  console.log('Request body:', req.body);  // Log the request body for debugging
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'incorrect form submission' });
  }
  
  db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      if (data.length) {
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if (isValid) {
          return db.select('*').from('users')
            .where('email', '=', email)
            .then(user => {
              res.json(user[0]);
            })
            .catch(err => res.status(400).json({ message: 'unable to get user' }));
        } else {
          return res.status(400).json({ message: 'wrong credentials' });
        }
      } else {
        return res.status(400).json({ message: 'wrong credentials' });
      }
    })
    .catch(err => res.status(400).json({ message: 'wrong credentials' }));
}

  module.exports = {
    handleSignin : handleSignin
  }