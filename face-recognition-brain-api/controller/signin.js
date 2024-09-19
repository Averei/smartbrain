const handleSignin = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json('incorrect form submission');
  }
  
  db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      if (data.length) {
        console.log("Stored Hash: ", data[0].hash);
        console.log("Password Submitted: ", password);

        const isValid = bcrypt.compareSync(password, data[0].hash);
        console.log("Password Match: ", isValid);
        
        if (isValid) {
          return db.select('*').from('users')
            .where('email', '=', email)
            .then(user => {
              res.json(user[0]);
            })
            .catch(err => res.status(400).json('unable to get user'));
        } else {
          res.status(400).json('wrong password');  // Invalid password
        }
      } else {
        res.status(400).json('email not found');  // Email not found
      }
    })
    .catch(err => res.status(400).json('wrong db query'));  // DB query error
};


  module.exports = {
    handleSignin : handleSignin
  }