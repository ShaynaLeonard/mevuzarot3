const express = require('express'),
    articlesRoutes = require('./articles');

var router = express.Router();

//articles
router.post('/articles', articlesRoutes.CreateArticle);
// router.put('/articles/:id', articlesRoutes.updateArticle); // http://localhost:3001/articles/123
// router.post('/articles/:id/images', articlesRoutes.AddImagesToArticle);
router.get('/articles/:id', articlesRoutes.getArticle);
router.get('/articles', articlesRoutes.getArticles);
// router.delete('/articles/:id/images/:url', articlesRoutes.deleteImageFromArticle);
// router.delete('/articles/:id', articlesRoutes.deleteArticle);

//

module.exports = router;