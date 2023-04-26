const HttpError = require('../models/http-error');
const News = require('../models/news-model');
var path = require('path');

const getAllNews = async (req, res, next) => {
  let newsList;
  try {
    newsList = await News.find({});
  } catch (err) {
    console.log(err);
  }
  res.json({ news: newsList.map((news) => news) });
};
const getNewsId = async (req, res, next) => {
  const newsId = req.params.id;
  let news;
  try {
    news = await News.findById(newsId);
  } catch (err) {
    console.log(err);
  }
  if (!news) {
    const error = new HttpError('new is not find', 500);
    return next(error);
  }
  res.status(200);
  res.json({
    title: news.title,
    photo: news.photo,
    summary: news.summary,
    body: news.body,
  });
};

const creatPost = async (req, res, next) => {
  const { title, summary, body, category } = req.body;
  const uploadFile = req.files.photo;
  const newPost = new News({
    title,
    summary,
    body,
    category,
    photo: `/uploadedphotos/${uploadFile.name}`,
  });
  try {
    uploadFile.mv(
      `${path.resolve('../')}/frontend/public/uploadedphotos/${
        uploadFile.name
      }`,
      async function (err) {
        if (err) {
          console.log(err);
          return next(err);
        }
        await newPost.save();
      }
    );
  } catch (err) {
    const error = new HttpError('news is not created', 500);
    return next(error);
  }

  res.status(201);
  res.json({ message: 'The News is Saved' });
};
const getLatestNews = async (req, res, next) => {
  let latestNews;
  try {
    latestNews = await News.findOne().sort({ _id: -1 }).limit(1);
  } catch (err) {
    const error = new HttpError('news is not found', 500);
    return next(error);
  }
  //  if (latestNews) {
  //    const error = new HttpError('news is not found', 500);
  //    return next(error);
  //  }

  res.status(200).json({
    title: latestNews.title,
    summary: latestNews.summary,
    photo: latestNews.photo,
    id: latestNews._id,
  });
};

const getNewsByCategory = async (req, res, next) => {
  const category = req.params.cat;
  let news;
  try {
    news = await News.find({ category: category });
  } catch (err) {
    console.log(err);
  }
  res.status(200);
  res.json({ news: news });
};
const deleteNews = async (req, res, next) => {
  const newsId = req.params.id;
  let existNews;

  try {
    existNews = await News.findById(newsId);
  } catch (err) {
    console.log(err);
  }
  if (!existNews) {
    console.log('news not found');
  }

  try {
    await existNews.deleteOne();
  } catch (err) {
    console.log(err);
    return next(err);
  }

  res.status(200).json({ message: 'The News is Deleted Successfully' });
};

exports.getAllNews = getAllNews;
exports.getNewsId = getNewsId;
exports.creatPost = creatPost;
exports.getLatestNews = getLatestNews;
exports.getNewsByCategory = getNewsByCategory;
exports.deleteNews = deleteNews;
