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
    const { id } = req.body;
    db('users')
      .where('id', '=', id)
      .increment('entries', 1)
      .returning('entries')
      .then(entries => {
        console.log('Updated entries:', entries);  // Add a console log for debugging
        res.json(parseInt(entries[0], 10));        // Ensure entries is returned as a number
      })
      .catch(err => res.status(400).json('Unable to get entries'));
  };
  
  
  module.exports = {
    handleImage, 
    handleApiCall
  }