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
      .then(() => {
        return db('users')
          .select('entries')
          .where('id', '=', id);
      })
      .then(entries => {
        console.log('Updated entries:', entries); // Log the returned entries
        if (entries && entries.length > 0 && !isNaN(entries[0].entries)) {
          res.json({ entries: parseInt(entries[0].entries, 10) });  // Return valid entries
        } else {
          console.error('Invalid entries value:', entries);
          res.status(400).json('Unable to get valid entries');
        }
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