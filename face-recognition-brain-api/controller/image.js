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
      .returning('entries')  // Make sure this returns the updated entries count
      .then(entries => {
        console.log('Updated entries:', entries); // Add log to debug
        res.json({ entries: entries[0] });        // Correctly return the updated entries
      })
      .catch(err => res.status(400).json('Unable to get entries'));
};

  
  module.exports = {
    handleImage, 
    handleApiCall
  }