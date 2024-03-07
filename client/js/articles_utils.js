
var order = "descending"; // Default value
var category = "dateOfPublication"; // Default value
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

// name:  displayArticles
// description : display the articles, and their buttons, on the html 
// parameters: articleData - the list of articles from the json file of articles 
// return parameters: N/A  
function displayArticles(articlesData) {
  var articleList = $('#articleList');

  $.each(articlesData, function (articleId, article) {
    var articleHtml = `
      <div>
        <h3>Article ID: ${article.id}</h3>
        <p>Title: ${article.title}</p>
        <p>Writer's Name: ${article.writer.name}</p>
        <p>Publish Date: ${article.publish_date}</p>
        <button class="deleteBtn" data-article-id="${article.id}">Delete</button>
        <button class="editBtn" data-article-id="${article.id}">Edit</button>
        <button class="addPictureBtn" data-article-id="${article.id}">Add Picture</button>
        <button class="viewPicturesBtn" data-article-id="${article.id}">View Pictures</button>
        <div class="imageContainer" id="imageContainer-${article.id}"></div>
        <hr>
      </div>
      
    `;

    articleList.append(articleHtml);
  });

  // name:  onclick listener for deleteBtn button 
  // description : when the button is clicled the article is deleted from the json file and removed from the html display 
  // parameters: none sent to the function (receives the id and the div of te article from the html)
  // return parameters: N/A 
  // Add event listeners for the buttons
  articleList.on('click', '.deleteBtn', function () {
    var articleId = $(this).data('article-id');
    var articleDiv = $(this).closest('div'); // Find the parent div containing the article

    // Confirm with the user before deleting the article
    if (confirm("Are you sure you want to delete this article?")) {
      // Make AJAX request to delete the article
      $.ajax({
        url: '/articles/' + articleId,
        type: 'DELETE',
        success: function (response) {
          console.log(response); // Log the server response
          // Remove the deleted article from the UI
          articleDiv.remove();
        },
        error: function (xhr, status, error) {
          console.error(xhr.responseText); // Log any errors
          alert("An error occurred while deleting the article.");
        }
      });
    }
  });



  // name:  onclick listener for editBtn button  
  // description : when clicked a modal is opened so that you can edit specific details of an article. Once the save button is clicked the article is updated.  
  // parameters: recieves the article id from the html 
  // return parameters: N/A 
  articleList.on('click', '.editBtn', function () {
    var articleId = $(this).data('article-id');

    console.log("this is article id = ", articleId)

    // var articleId = $(this).data('article-id');
    openEditModal(articleId);
  });


  // name:  openEditModal
  // description : opens the edit modal
  // parameters: articleId 
  // return parameters: N/A 
  function openEditModal(articleId) {
    // Set the data-article-id attribute for later retrieval
    $('#saveChangesBtn').data('article-id', articleId);

    // Open the modal
    $('#modal').show();
  }

  // name:  closeModal
  // description : erases the input texts and closes the edit modal
  // parameters: N/A
  // return parameters: N/A 
  function closeModal() {
    $('#editTitle').val('');
    $('#editPublishDate').val('');
    $('#editSummary').val('');
    $('#modal').hide();
  }


  // name:  saveChanges
  // description : once the saved canges button is clicked then the appropriate parameters are validated ()
  // (the user will be alerted if incorrect) and then the article is updated, and the modal is closed 
  // parameters: articleId
  // return parameters: N/A 
  function saveChanges(articleId) {
    // Get values from the modal
    var updatedTitle = $('#editTitle').val();
    var updatedPublishDate = $('#editPublishDate').val();
    var updatedSummary = $('#editSummary').val();

    // Create an object to store the fields that are not empty
    var updatedData = {};

    if (updatedTitle) {
      updatedData.title = updatedTitle;
    }

    if (updatedPublishDate) {

      if (!isValidDateFormat(updatedPublishDate)) {
        alert("Invalid date format. Please use the format YYYY-MM-DD (in numbers), dont put future date or incorrect date!");
        $('#editPublishDate').val('');
        return;
      }
      updatedData.publish_date = updatedPublishDate;
    }

    if (updatedSummary) {
      updatedData.summary = updatedSummary;
    }

    $.ajax({
      url: '/articles/' + articleId,
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(updatedData),
      success: function (response) {
        console.log(response);

        var articleDiv = $('#articleList').find(`[data-article-id="${articleId}"]`);
        reloadArticles(order, category);
        closeModal();
      },
      error: function (xhr, status, error) {
        console.error(xhr.responseText);
        alert("An error occurred while updating the article.");
      }
    });
  }

  // name:  onclick listener for the saveChangesBtn  button 
  // description : when button is clicked the saveChanges function is called 
  // parameters: takes the article id from the html 
  // return parameters: N/A 
  // Event listener for the save button in the modal
  $('#saveChangesBtn').click(function () {
    var articleId = $(this).data('article-id');
    saveChanges(articleId);

  });

  // name:  onclick listener for the modalCloseBtn button 
  // description : when clicked, the modal is closed 
  // parameters: N/A 
  // return parameters:N/A
  // Event listener for closing the modal
  $('#modalCloseBtn').click(function () {
    closeModal();
  });


  // name:  on click listener for the addPictureBtn
  // description routes the user to the add_photos html  
  // parameters: N/A 
  // return parameters: N/A 
  articleList.on('click', '.addPictureBtn', function () {
    var articleId = $(this).data('article-id');
    window.location.href = '/add_photos?articleId=' + articleId;
  });


  // name:  onclick listener for the viewPicturesBtn button  
  // description : calls the viewPicturesOfArticle function 
  // parameters: N/A 
  // return parameters: N/A 
  articleList.on('click', '.viewPicturesBtn', function () {
    var articleId = $(this).data('article-id');
    // Call a function to handle viewing pictures associated with the article with ID 'articleId'
    viewPicturesOfArticle(articleId);
  });

  // name:  viewPicturesOfArticle
  // description: sends a ajax request to display the images of a certain article 
  // parameters: articleId
  // return parameters: N/A
  function viewPicturesOfArticle(articleId) {
    // Make an AJAX request to fetch article details
    $.ajax({
      url: '/articles/' + articleId,
      method: 'GET',
      success: function (articleData) {
        if (articleData.images && articleData.images.length > 0) {
          // If the article has pictures, display them
          displayImages(articleData.images, articleId);
        } else {
          // If the article has no pictures, display an alert
          alert('This article has no pictures.');
        }

      },
      error: function (error) {
        console.error('Error fetching article details:', error);
        alert('Error fetching article details. Please try again.');
      }
    });
  }


  // name:  displayImages
  // description: display the images of a recieved article id 
  // parameters: images (list of images for a certain article), articleId
  // return parameters: N/A 
  function displayImages(images, articleId) {
    // Assuming you have a container in your HTML to display images

    const imageContainer = $("#imageContainer-" + articleId);
    imageContainer.empty();

    images.forEach(function (image) {
      const imageDiv = $('<div class="image"></div>');
      const img = $('<img src="' + image.thumb_url + '">');

      const deleteButton = $('<button class="deleteImageButton">Delete</button>');
      imageDiv.append(img);
      imageDiv.append(deleteButton);
      imageContainer.append(imageDiv);

      deleteButton.on('click', function () {
        deleteImageFromArticle(articleId, image.id);
      });


    });

    imageContainer.show();


    const hideButton = $('<button class="hidePicturesButton">Hide Pictures</button>');

    // name:  onclick listener for hideButton
    // description: calls the hidePictures function 
    // parameters: N/A 
    // return parameters: N/A 
    hideButton.on('click', function () {
      hidePictures(articleId);
    });
    imageContainer.append(hideButton);
  }

  // name:  hidePictures
  // description: hides the images of a certain article 
  // parameters: articleId
  // return parameters: N/A 
  function hidePictures(articleId) {
    const imageContainer = $("#imageContainer-" + articleId);
    imageContainer.hide();
  }

  // name:  deleteImageFromArticle
  // description: deletes an image from a article 
  // parameters: articleId, imageId
  // return parameters: N/A 
  function deleteImageFromArticle(articleId, imageId) {
    $.ajax({
      url: '/articles/' + articleId + '/images/' + imageId,
      type: 'DELETE',
      success: function (response) {
        console.log(response); // Log the server response

        // Reload the images for the current article after deletion
        viewPicturesOfArticleAfterDelete(articleId);
      },
      error: function (xhr, status, error) {
        console.error(xhr.responseText); // Log any errors
        alert("An error occurred while deleting the image.");
      }
    });
  }


  // name:  viewPicturesOfArticleAfterDelete
  // description:  after images are deleted from an article this function is used to display the remaining images of the article 
  // parameters: articleId
  // return parameters: N/A 
  function viewPicturesOfArticleAfterDelete(articleId) {
    // Make an AJAX request to fetch article details
    $.ajax({
      url: '/articles/' + articleId,
      method: 'GET',
      success: function (articleData) {
        displayImages(articleData.images, articleId);
        if (articleData.images && articleData.images.length == 0) {
          hidePictures(articleId)
        }

      },
      error: function (error) {
        console.error('Error fetching article details:', error);
        alert('Error fetching article details. Please try again.');
      }
    });
  }

}

// name:  reloadArticles
// description : displays the articles according to the order and category recieved 
// parameters: order and category 
// return parameters: N/A 

// Function to fetch and display articles with sorting parameters
function reloadArticles(order, category) {
  $.ajax({
    url: '/articles',
    dataType: 'json',
    data: {
      order: order,
      category: category
    },
    success: function (articlesData) {
      if (typeof articlesData !== 'object' || Array.isArray(articlesData)) {
        console.error('Error: articlesData is not an object');
        return;
      }

      // Convert the object into an array of objects
      var articlesArray = Object.values(articlesData);

      // Sort articles based on the selected category and order
      articlesArray.sort(function (a, b) {
        if (order === 'ascending') {
          if (category === 'title') {
            return a.title.localeCompare(b.title);
          } else if (category === 'dateOfPublication') {
            return new Date(a.publish_date) - new Date(b.publish_date);
          }
        } else if (order === 'descending') {
          if (category === 'title') {
            return b.title.localeCompare(a.title);
          } else if (category === 'dateOfPublication') {
            return new Date(b.publish_date) - new Date(a.publish_date);
          }
        }
      });

      // Clear the existing articles
      $('#articleList').empty();

      // Display the sorted articles
      displayArticles(articlesArray);
    },
    error: function (xhr, status, error) {
      console.log('Error fetching articles data', error);
    }
  });
}

// name: a ready funtion for when the html is loaded 
// description : loads the articles according to default, and has event listeners fot the saveDisplayChanges
// parameters: N/A 
// return parameters: N/A 

$(document).ready(function () {
  // Trigger reloadArticles with default values only on page load
  reloadArticles(order, category);

  // Event listener for order change 
  $('input[name="catergory"]').change(function () {
    category = $(this).val();
  });

  $('input[name="order"]').change(function () {
    order = $(this).val();
  });

  // Event listener for Save Changes button click
  $('#saveDisplayChanges').click(function () {
    console.log("order:", order, "category", category)
    reloadArticles(order, category);
  });
});

// name:  openAddArticleForm
// description : Function to open the add article form (modal)
// parameters: N/A 
// return parameters: N/A 

function openAddArticleForm() {
  // Clear form inputs
  $('#addArticleForm input, #addArticleForm textarea').val('');

  //change 
  $('.error-message').remove();

  // Show the add article form
  $('#addArticleForm').show();
}

// name: onclick listener for the addArticleAbove and addArticleBelow buttons 
// description : when one of the buttons are clicked then the openAddArticleForm function is called 
// parameters: N/A 
// return parameters:N/A 

$('#addArticleAbove, #addArticleBelow').click(function () {
  openAddArticleForm();
});

// name: onclick listener for the formCloseBtn button
// description : Event listener for closing the add article form
// parameters: N/A 
// return parameters: N/A 

$('#formCloseBtn').click(function () {
  $('#addArticleForm').hide();
});

// name:  onclick listener for the saveArticleBtn button 
// description : when clicked then the fields that the user filled in are checked (if needed, an alert 
// is sent to the user) and then an ajax request is sent toadd a new article 
// parameters:  N/A 
// return parameters: N/A 

// Event listener for saving a new article
$('#saveArticleBtn').click(function () {
  console.log($('#' + 'title').val())


  //change 
  $('.error-message').remove();

  var requiredFields = ['title', 'publishDate', 'summary', 'writerName', 'writerEmail', 'mobilePhone', 'homePhone', 'articleId'];
  var isValid = true;

  requiredFields.forEach(function (fieldName) {
    var fieldValue = $('#' + fieldName).val();


    if (!fieldValue) {
      // Display error message above the input field
      console.log("field value", fieldValue)
      $('<div class="error-message">*required</div>').insertBefore('#' + fieldName);
      isValid = false;
    }
  });

  if (!isValid) {
    // If there are validation errors, stop processing the form
    return;
  }


  var newArticle = {
    title: $('#title').val(),
    publish_date: $('#publishDate').val(),
    summary: $('#summary').val(),
    writer: {
      name: $('#writerName').val(),
      email: $('#writerEmail').val(),
      mobile_phone: $('#mobilePhone').val(),
      home_phone: $('#homePhone').val(),
    },
    ID: $('#articleId').val(),

  };

  $.ajax({

    url: '/articles/' + newArticle.ID, // Use the endpoint for fetching a single article
    type: 'GET',
    success: function (response) {
      // If the article already exists, inform the user and return
      console.log("got the article");
      alert(`Article with ID ${newArticle.ID} already exists. You can only update existing articles.`);
    },
    error: function (xhr, status, error) {
      $.ajax({
        url: '/articles',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(newArticle),
        success: function (response) {
          console.log(response);
          // Reload articles to display the newly added article
          reloadArticles(order, category);
          // Close the add article form
          $('#addArticleForm').hide();
        },
        error: function (xhr, status, error) {
          if (xhr.responseJSON && xhr.responseJSON.errors) {
            // Display specific validation errors
            Object.entries(xhr.responseJSON.errors).forEach(([field, message]) => {
              alert(`${field}: ${message}`);
            });
          } else {
            // Display a generic error message
            console.error(xhr.responseText);
            alert("An error occurred while adding the article.");
          }
        }
      });
    }
  });
});








