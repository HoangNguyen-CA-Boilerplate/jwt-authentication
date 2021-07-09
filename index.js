const express = require('express');
const path = require('path');
const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');

require('dotenv').config();

const port = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/test';

app.use(express.json());

app.use(morgan('tiny'));

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((err) => {
    console.log(err);
  });

app.use('/api/users', require('./routes/api/users'));

if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

//custom error handler
app.use((err, req, res, next) => {
  console.log(err.message);
  const { status = 500, message = 'Something Went Wrong!' } = err;
  res.status(status).json({ status, error: message });
});

app.listen(port, (req, res) => {
  console.log(`listening on port ${port}`);
});
