
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
        <hr>
      </div>
      
    `;

    articleList.append(articleHtml);
  });

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

  articleList.on('click', '.editBtn', function () {
    var articleId = $(this).data('article-id');

    console.log("this is article id = ", articleId)

    // var articleId = $(this).data('article-id');
    openEditModal(articleId);
  });


  // Open edit modal function
  function openEditModal(articleId) {
    // Set the data-article-id attribute for later retrieval
    $('#saveChangesBtn').data('article-id', articleId);

    // Open the modal
    $('#modal').show();
  }


  // Close modal function
  function closeModal() {
    $('#editTitle').val('');
    $('#editPublishDate').val('');
    $('#editSummary').val('');
    $('#modal').hide();
  }

  // Save changes function
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

  // Event listener for the save button in the modal
  $('#saveChangesBtn').click(function () {
    var articleId = $(this).data('article-id');
    saveChanges(articleId);

  });

  // Event listener for closing the modal
  $('#modalCloseBtn').click(function () {
    closeModal();
  });


  articleList.on('click', '.addPictureBtn', function () {
    var articleId = $(this).data('article-id');
    // Call a function to handle adding a picture to the article with ID 'articleId'
    // Example: addPictureToArticle(articleId);
  });

  articleList.on('click', '.viewPicturesBtn', function () {
    var articleId = $(this).data('article-id');
    // Call a function to handle viewing pictures associated with the article with ID 'articleId'
    // Example: viewPicturesOfArticle(articleId);
  });
}

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

// Function to open the add article form
function openAddArticleForm() {
  // Clear form inputs
  $('#addArticleForm input, #addArticleForm textarea').val('');

  //change 
  $('.error-message').remove();

  // Show the add article form
  $('#addArticleForm').show();
}

// Event listener for "Add Article" buttons
$('#addArticleAbove, #addArticleBelow').click(function () {
  openAddArticleForm();
});

// Event listener for closing the add article form
$('#formCloseBtn').click(function () {
  $('#addArticleForm').hide();
});

// Event listener for saving a new article
$('#saveArticleBtn').click(function () {

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


  // Get values from the form
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

  console.log("title", title)

  // // Make an AJAX request to create a new article
  // $.ajax({
  //   url: '/articles',
  //   type: 'POST',
  //   contentType: 'application/json',
  //   data: JSON.stringify(newArticle),
  //   success: function (response) {
  //     console.log(response);
  //     // Reload articles to display the newly added article
  //     reloadArticles(order, category);
  //     // Close the add article form
  //     $('#addArticleForm').hide();
  //   },
  //   error: function (xhr, status, error) {
  //     console.error(xhr.responseText);
  //     alert("An error occurred while adding the article.");
  //   }
  // });

  // Make an AJAX request to create a new article
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

});








