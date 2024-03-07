const express = require('express'),
    articlesRoutes = require('./articles');

var router = express.Router();

router.post('/articles', articlesRoutes.CreateArticle);
router.put('/articles/:id', articlesRoutes.updateArticle); // http://localhost:3001/articles/123
router.put('/articles/:id/images', articlesRoutes.AddImagesToArticle);
router.get('/articles/:id', articlesRoutes.getArticle);
router.get('/articles', articlesRoutes.getArticles);
router.delete('/articles/:id/images/:imageId', articlesRoutes.deleteImageFromArticle);
router.delete('/articles/:id', articlesRoutes.deleteArticle);

router.get('/add_photos', (req, res) => {
    const articleId = req.query.articleId;
    res.sendFile(path.join(__dirname, 'client/html/add_photos.html'));
});




module.exports = router;