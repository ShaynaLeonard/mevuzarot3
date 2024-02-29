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
    ID: yup.string().required(),
    title: yup.string().required(),
    dateOfPublished: yup.date().required(),
    summary: yup.string().required(),
    Author: yup.object({
        nameAuthor: yup.string().required(),
        authorEmail: yup.string().email().required(),
        authorPhone: yup.string().required(),
        authorHouseNum: yup.number().required(),
    }),
});

// CreateArticle function
const CreateArticle = async (req, res) => {
    const ArticleDetails = req.body; // Extract payload from request body

    try {
        // Validate ArticleDetails against schema
        await articleSchema.validate(ArticleDetails);

        // Read data from file
        readFile(data => {
            // Add the new article
            data[ArticleDetails.ID] = ArticleDetails;

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
    dateOfPublished: yup.date(),
    summary: yup.string(),
});

const updateArticle = async (req,res) =>{
    const articleId = req.params.id;
    const detailToUpdate = req.body; 
    await articleUpdateSchema.validate(detailToUpdate);

    try{
        readFile(data => {
            if (data[articleId]){
                console.log("found the article")
                if(detailToUpdate.title){
                    data[articleId].title = detailToUpdate.title; 
                    console.log("has title")
                }
                if(detailToUpdate.dateOfPublished){
                    data[articleId].dateOfPublished = detailToUpdate.dateOfPublished; 
                    console.log("has date published")
                }
                if(detailToUpdate.summary){
                    data[articleId].summary = detailToUpdate.summary; 
                    console.log("has summary")
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

module.exports = {
    CreateArticle,
    articleSchema,
    articleUpdateSchema, 
    updateArticle, 
    getArticles, 
    getArticle, 


    // UPDATE
    update_user: function (req, res) {

        readFile(data => {

            // add the new user
            const userId = req.params["id"];
            if (data[userId])
                data[userId] = req.body;
            else res.sendStatus(400);

            console.log("after if")

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`users id:${userId} updated`);
            });
        },
            true);
    },
    // DELETE
    delete_user: function (req, res) {

        readFile(data => {

            // add the new user
            const userId = req.params["id"];
            delete data[userId];

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`users id:${userId} removed`);
            });
        },
            true);
    }
};