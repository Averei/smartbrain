const Clarifai =  require ('clarifai');

//You must add your own API key here from Clarifai.
const app = new Clarifai.App({
    apiKey: process.env.API_CLARIFAI
  });

  const handleApiCall = (req, res) => {
    app.models
    .predict("face-detection", req.body.input)
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json('unable to work with API'))
  }

  const handleImage = (req, res, db) => {
    console.log('Request body:', req.body); // Log the request body for debugging
    const { id } = req.body; // Ensure id is coming from the request body
    if (!id) {
      return res.status(400).json('User ID is required');
    }
    db('users')
      .where('id', '=', id)
      .increment('entries', 1) // Increment the entries count by 1
      .returning('entries')
      .then(entries => {
        console.log("Entries count:", entries),
        res.json({ entries: parseInt(entries[0], 10) });  // Ensure entries is returned as a number
      })
      .catch(err => {
        console.error('Error updating user entries:', err);
        res.status(400).json('Unable to get entries');
      });
  };
  
  module.exports = {
    handleImage, 
    handleApiCall
  }