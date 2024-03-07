const fs = require('fs');
const yup = require("yup");
const express = require('express');
const moment = require('moment');
const app = express();
app.use(express.json());


// variables
const dataPath = './server/data/articles.json';

// name:  isValidDateFormat
// description : checks that the string received for a date is correct and not in the future 
// parameters: dateString 
// return parameters: true - if date passed the validation and false other 

function isValidDateFormat(dateString) {
    var dateFormat = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateFormat.test(dateString)) {
        return false; // Date format is incorrect
    }

    // Extract year, month, and day from the date string
    var parts = dateString.split('-');
    var year = parseInt(parts[0]);
    var month = parseInt(parts[1]);
    var day = parseInt(parts[2]);

    // Get the current date
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    var currentMonth = currentDate.getMonth() + 1; // January is 0, so add 1
    var currentDay = currentDate.getDate();

    // Check if the year is within the valid range (0 to current year)
    if (year < 0 || year > currentYear) {
        return false;
    }

    // Check if the month is within the valid range (1 to 12)
    if (month < 1 || month > 12) {
        return false;
    }

    // Check if the day is within the valid range for the given month and year
    var daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) {
        return false;
    }

    // Check if the date is before the current date
    if (year == currentYear && month >= currentMonth && day >= currentDay) {
        return false;
    }

    // Date format and all tests passed, return true
    return true;
}

// name:  readFile
// description : reads the json file 
// parameters: callback, returnJson, filePath, encoding
// return parameters:e  N/A 

const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
    fs.readFile(filePath, encoding, (err, data) => {
        if (err) {
            console.log(err);
        }
        if (!data) data = "{}";
        callback(returnJson ? JSON.parse(data) : data);
    });
};

// name:  writeFile
// description : writes in the json file 
// parameters: fileData, callback, filePath, encoding
// return parameters: N/A 
const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {

    fs.writeFile(filePath, fileData, encoding, (err) => {
        if (err) {
            console.log(err);
        }

        callback();
    });
};

const articleSchema = yup.object({
    title: yup.string().required(),
    publish_date: yup.string().test('is-valid-date', 'Invalid date format', function (value) {
        // Check if the value is a valid date
        return moment(value, moment.ISO_8601, true).isValid();
    })
        .test('is-past-date', 'Publish date must not be in the future', function (value) {
            // Check if the value is not in the future
            return moment(value).isSameOrBefore(moment(), 'day');
        }).test('is-valid-format', 'Date must be in YYYY-MM-DD format', function (value) {
            // Check if the value is in the correct format (YYYY-MM-DD)
            return /^\d{4}-\d{2}-\d{2}$/.test(value);
        }).required(),
    summary: yup.string().required(),
    writer: yup.object({
        name: yup.string().required(),
        email: yup.string().email().required(),
        mobile_phone: yup.string().required(),
        home_phone: yup.number().required(),
    }),
    ID: yup.string().matches(/^[a-zA-Z0-9_]+$/, 'ID must contain only letters and numbers').required(),

});


// name:  CreateArticle
// description : receives the AricleDetails in the request, validates them with the yup schema, sends alerts to the 
// user if needed and create the article 
// parameters: recieved req containing the ArticleDetails 
// return parameters: 200 if success and 400 if there were validation errors 
const CreateArticle = async (req, res) => {
    const ArticleDetails = req.body; // Extract payload from request body
    console.log("ArticleDetails", ArticleDetails.title)
    try {
        // Validate ArticleDetails against schema
        await articleSchema.validate(ArticleDetails, { abortEarly: false }); // Add abortEarly option to collect all validation errors

        // Read data from file
        readFile(data => {
            if (data[ArticleDetails.ID]){
                console.log(`Article with ID ${ArticleDetails.ID} already exists. You can only update existing articles.`);
            }
            else{
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
                res.status(200).send(`article id:${ArticleDetails.ID} created`);
            });
     } }, true);
    } catch (error) {
        // If validation fails, send detailed error messages
        const validationErrors = {};
        if (error.inner) {
            error.inner.forEach(err => {
                validationErrors[err.path] = err.message;
            });
        }

        res.status(400).json({ errors: validationErrors });
    }
};

//UPDATE 
const articleUpdateSchema = yup.object({
    title: yup.string(),
    publish_date: yup.string(), 
    summary: yup.string(),
});

// name:  updateArticle
// description :receives the article id from the parameters sent and detailToUpdate in the request,
// validates the articledetails with the yup schema, sends alerts to the user if needed and updates the article 
// parameters: receives the article id from the parameters sent and detailToUpdate in the request
// return parameters: 200 if success and 400 if there were validation errors 

const updateArticle = async (req, res) => {
    const articleId = req.params["id"];
    const detailToUpdate = req.body;

    await articleUpdateSchema.validate(detailToUpdate, { abortEarly: false });

    try {
        readFile(data => {
            if (data[articleId]) {
                if (detailToUpdate.title) {
                    data[articleId].title = detailToUpdate.title;
                }

                if (detailToUpdate.publish_date) {
                    if (!isValidDateFormat(detailToUpdate.publish_date)) {
                        console.error("Invalid date!");
                        res.sendStatus(400);
                        return;
                    }
                    data[articleId].publish_date = detailToUpdate.publish_date;
                }

                if (detailToUpdate.summary) {
                    data[articleId].summary = detailToUpdate.summary;
                }

                writeFile(JSON.stringify(data, null, 2), () => {
                    console.log('Updated article successfully');
                    res.status(200).send(`Article id:${articleId} updated`);
                });
            } else {
                console.error(`Article with id:${articleId} not found`);
                res.status(400).send(`Article with id:${articleId} not found`);
            }
        }, true);
    } catch (error) {
        console.error(error);
        res.sendStatus(400);
    }
};

const addImagesToArticleSchema = yup.object({
    id: yup.string().required(),
    thumb_url: yup.string().required(), 
    description: yup.string().required(),
});

// name:  AddImagesToArticle
// description :receives the article id from the parameters sent and imageDetails for the req 
// validates the imageDetails with the yup schema, sends alerts to the user if needed and adds the images  
// parameters: receives the article id from the parameters sent and imageDetails for the req 
// return parameters: 200 if success and 400 if there were validation errors 
const AddImagesToArticle = async (req, res) => {
    const articleId = req.params["id"];

    console.log("article id", articleId)
    const imageDetails = req.body;

    try {
        // Validate the request body
        await addImagesToArticleSchema.validate(imageDetails, { abortEarly: false });

        // If validation passes, proceed with the rest of the logic
        const thumb_url = imageDetails["thumb_url"];
        const id = imageDetails["id"];
        const description = imageDetails["description"];

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
    } catch (validationError) {
        // Handle validation error
        const missingFields = validationError.errors.join(', ');
        res.status(400).send(`Missing required fields: ${missingFields}`);
    }
};

// name:  getArticles
// description : 
// parameters: 
// return parameters: status 500 if there is an error 
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
    AddImagesToArticle, 
    addImagesToArticleSchema

};