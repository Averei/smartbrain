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
              console.log('User found:', user); // Log the user object to debug
              res.json(user[0]);
            })
            .catch(err => {
              console.error('Error getting user:', err); // Log the error for debugging
              res.status(400).json({ message: 'unable to get user' });
            });
        } else {
          console.log('Wrong credentials'); // Log the failed attempt
          return res.status(400).json({ message: 'wrong credentials' });
        }
      } else {
        console.log('No matching email found'); // Log when no matching email is found
        return res.status(400).json({ message: 'wrong credentials' });
      }
    })
    .catch(err => {
      console.error('Error querying the database:', err); // Log the query error
      res.status(400).json({ message: 'wrong credentials' });
    });
}

module.exports = {
  handleSignin
}
