const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const NewsRoutes = require('./routes/news-route');
const UserRouter = require('./routes/user-router');
const app = express();

app.use(express.json());
app.use(express.static('../frontend/public/uploadedphotos'));
app.use(cors());
app.use(fileUpload());
app.use('/api/news', NewsRoutes);
app.use('/api/user', UserRouter);
app.use((req, res, next) => {
  res.json({ message: 'Route is not Found' });
});
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'Unknown Error Occured' });
});
mongoose
  .connect('mongodb://127.0.0.1:27017/ethionews')
  .then(() => {
    app.listen(5000, () => {
      console.log('The server is running on port 5000');
    });
  })
  .catch((error) => {
    console.log(error);
  });
