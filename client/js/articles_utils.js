$(document).ready(function () {
  // Fetch articles data
  $.ajax({
    url: '/articles',
    dataType: 'json',
    success: function (articlesData) {
      order = "ascending"
      category = "dateOfPublication"
      displayArticles(articlesData);
    },
    error: function (err) {
      console.log('Error fetching articles data', err);
    }
  });
});


// Function to display articles
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
      </div>
      <hr>
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
      // You may want to validate the date format here before adding it to the payload
      updatedData.publish_date = updatedPublishDate;
    }

    

    if (updatedSummary) {
      updatedData.summary = updatedSummary;
    }

    // Make AJAX request to update the article
    $.ajax({
      url: '/articles/' + articleId,
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(updatedData),
      success: function (response) {
        console.log(response);
        
        var articleDiv = $('#articleList').find(`[data-article-id="${articleId}"]`);
      

      //   $('#editTitle').val() ='';
      // $('#editPublishDate').val('');
      // $('#editSummary').val('');


        reloadArticles();


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

  // ...


  // Event listener for closing the modal
  $('#modalCloseBtn').click(function () {
    closeModal();
  });


  // Function to fetch and display articles
function reloadArticles() {
  $.ajax({
    url: '/articles',
    dataType: 'json',
    success: function (articlesData) {
      // Clear the existing articles
      $('#articleList').empty();

      // Display the updated articles
      displayArticles(articlesData);

      // Close the modal after saving changes
      closeModal();
    },
    error: function (err) {
      console.log('Error fetching articles data', err);
    }
  });
}


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





