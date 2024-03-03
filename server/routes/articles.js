const fs = require('fs');
const yup = require("yup");
const express = require('express');
const app = express();
app.use(express.json());

// variables
const dataPath = './server/data/articles.json';

// helper methods
const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
    fs.readFile(filePath, encoding, (err, data) => {
        if (err) {
            console.log(err);
        }
        if (!data) data = "{}";
        callback(returnJson ? JSON.parse(data) : data);
    });
};

const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {

    fs.writeFile(filePath, fileData, encoding, (err) => {
        if (err) {
            console.log(err);
        }

        callback();
    });
};
//CREATE
const articleSchema = yup.object({
    title: yup.string().required(),
    publish_date: yup.date().required(),
    summary: yup.string().required(),
    writer: yup.object({
        name: yup.string().required(),
        email: yup.string().email().required(),
        mobile_phone: yup.string().required(),
        home_phone: yup.number().required(),
    }),
    ID: yup.string().required(),
});

const CreateArticle = async (req, res) => {
    const ArticleDetails = req.body; // Extract payload from request body

    try {
        // Validate ArticleDetails against schema
        await articleSchema.validate(ArticleDetails);

        // Read data from file
        readFile(data => {
            // Add the new article
            data[ArticleDetails.ID] = {
                title: ArticleDetails.title,
                publish_date: ArticleDetails.publish_date,
                writer: ArticleDetails.writer,
                images: [], // Empty array for images
                id: ArticleDetails.ID,
            };

            // Write updated data to file
            writeFile(JSON.stringify(data, null, 2), () => {
                console.log('New article added successfully');
                // Call the callback function with a success status
                res.status(200).send(`article id:${ArticleDetails.ID} created`);
            });
        }, true);
    } catch (error) {
        console.error(error);

        res.sendStatus(400);
    }
};

//UPDATE 
const articleUpdateSchema = yup.object({
    title: yup.string(),
    publish_date: yup.date(),
    summary: yup.string(),
});

const updateArticle = async (req,res) =>{
    const articleId = req.params["id"];
    const detailToUpdate = req.body; 
    await articleUpdateSchema.validate(detailToUpdate);

    try{
        readFile(data => {
            if (data[articleId]){
                if(detailToUpdate.title){
                    data[articleId].title = detailToUpdate.title; 
                }
                if(detailToUpdate.dateOfPublished){
                    data[articleId].dateOfPublished = detailToUpdate.dateOfPublished; 
                }
                if(detailToUpdate.summary){
                    data[articleId].summary = detailToUpdate.summary; 
                }
            }
            writeFile(JSON.stringify(data, null, 2), () => {
                console.log('Updated article successfully');
                // Call the callback function with a success status
                res.status(200).send(`article id:${articleId} updated`);
            });

        }, true); 
    } catch (error) {
        console.error(error);
        res.sendStatus(400);
    }
}; 

const AddImagesToArticle = async (req, res) => {
    const articleId = req.params["id"];

    const thumb_url = req.body["thumb_url"]; 
    const id = req.body["id"]; 
    const description = req.body["description"]; 


    try {
        // Read data from file
        readFile(data => {
            // Check if the article exists
            if (data[articleId]) {
                const article = data[articleId];

                // Check if the image with the specified ID already exists in the article
                const imageExists = article.images.some(image => image.id === id);

                if (!imageExists) {
                    // Add the new image details to the article's images array
                    article.images.push({
                        thumb_url: thumb_url,
                        id: id, 
                        description: description,
                    });

                    // Write updated data to file
                    writeFile(JSON.stringify(data, null, 2), () => {
                        console.log(`Image ${id} added to article ${articleId}`);
                        res.status(200).send(`Image ${id} added to article ${articleId}`);
                    });
                } else {
                    // Image with the same ID already exists in the article
                    res.status(400).send(`Image ${id} already exists in article ${articleId}`);
                }
            } else {
                // Article not found
                res.status(404).send(`Article ${articleId} not found`);
            }
        }, true);
    } catch (error) {
        console.error(error);
        res.sendStatus(400);
    }
};


//READ
const getArticles = async (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        }
        else
            res.send(!data ? JSON.parse("{}") : JSON.parse(data));
    });
}; 

const getArticle = (req, res) => {
    const articleId = req.params.id;

    readFile(data => {
        const article = data[articleId];
        if (article) {
            res.status(200).send(article);
        } else {
            res.status(404).send(`Article with ID ${articleId} not found`);
        }
    }, true);
};

//DELETE
const deleteArticle = (req, res) => {
    const articleId = req.params.id;

    readFile(data => {
        if (data[articleId]) {
            delete data[articleId];
            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`Article with ID ${articleId} deleted`);
            });
        } else {
            res.status(404).send(`Article with ID ${articleId} not found`);
        }
    }, true);
};

const deleteImageFromArticle = async (req, res) => {
    const articleId = req.params["id"];
    const imageId = req.params["imageId"]; 
    try {
        // Read data from file
        readFile(data => {
            // Check if the article exists
            if (data[articleId]) {
                const article = data[articleId];

                // Find the index of the image with the specified thumb_url
                const imageIndex = article.images.findIndex(image => image.id === imageId);

                if (imageIndex !== -1) {
                    // Remove the image from the images array
                    article.images.splice(imageIndex, 1);

                    // Write updated data to file
                    writeFile(JSON.stringify(data, null, 2), () => {
                        console.log(`Image ${imageId} deleted from article ${articleId}`);
                        res.status(200).send(`Image ${imageId} deleted from article ${articleId}`);
                    });
                } else {
                    // Image not found in the article
                    res.status(404).send(`Image ${imageId} not found in article ${articleId}`);
                }
            } else {
                // Article not found
                res.status(404).send(`Article ${articleId} not found`);
            }
        }, true);
    } catch (error) {
        console.error(error);
        res.sendStatus(400);
    }
};


module.exports = {
    CreateArticle,
    articleSchema,
    articleUpdateSchema, 
    updateArticle, 
    getArticles, 
    getArticle, 
    deleteArticle, 
    deleteImageFromArticle, 
    AddImagesToArticle

};