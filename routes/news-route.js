const express = require('express');
const NewsController = require('../controllers/news-controller');
const route = express.Router();

route.get('/', NewsController.getAllNews);
route.get('/latest-news', NewsController.getLatestNews);
route.get('/:cat', NewsController.getNewsByCategory);
route.get('/newsdetail/:id', NewsController.getNewsId);
route.post('/add-news', NewsController.creatPost);
route.delete('/delete-news/:id', NewsController.deleteNews);

module.exports = route;
