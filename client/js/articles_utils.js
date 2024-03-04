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


    // Save display changes button click event
//   $("#saveDisplayChanges").click(function () {

//     // Get selected order and category values
//     var order = $('input[name="order"]:checked').val();
//     var category = $('input[name="catergory"]:checked').val();
//     console.log("order=", order)
//     console.log("catergory=", category)

    
//     // displayArticles(order, category);


//   });
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
articleList.on('click', '.deleteBtn', function() {
  var articleId = $(this).data('article-id');
  var articleDiv = $(this).closest('div'); // Find the parent div containing the article

  // Confirm with the user before deleting the article
  if (confirm("Are you sure you want to delete this article?")) {
    // Make AJAX request to delete the article
    $.ajax({
      url: '/articles/' + articleId,
      type: 'DELETE',
      success: function(response) {
        console.log(response); // Log the server response
        // Remove the deleted article from the UI
        articleDiv.remove();
      },
      error: function(xhr, status, error) {
        console.error(xhr.responseText); // Log any errors
        alert("An error occurred while deleting the article.");
      }
    });
  }
});

  // Add event listeners for the buttons
articleList.on('click', '.editBtn', function() {
  var articleId = $(this).data('article-id');
  
  // Open a modal window for editing
  openEditModal(articleId);
});

function openEditModal(articleId) {
  // Example: Open a Bootstrap modal window for editing
  // You can customize this modal according to your UI framework or design
  
  // Fetch article data to populate the form fields
  $.ajax({
    url: '/articles/' + articleId,
    type: 'PUT',
    success: function(articleData) {
      // Populate form fields with article data
      $('#editTitle').val(articleData.title);
      $('#editPublishDate').val(articleData.publish_date);
      $('#editSummary').val(articleData.summary);
      
      // Open the modal window
      $('#editModal').modal('show');
    },
    error: function(xhr, status, error) {
      console.error(xhr.responseText); // Log any errors
      alert("An error occurred while fetching article data for editing.");
    }
  });
}


  articleList.on('click', '.addPictureBtn', function() {
    var articleId = $(this).data('article-id');
    // Call a function to handle adding a picture to the article with ID 'articleId'
    // Example: addPictureToArticle(articleId);
  });

  articleList.on('click', '.viewPicturesBtn', function() {
    var articleId = $(this).data('article-id');
    // Call a function to handle viewing pictures associated with the article with ID 'articleId'
    // Example: viewPicturesOfArticle(articleId);
  });
}

  
  
  // Function to display articles
  // function displayArticles(articlesData) {
  //   var articleList = $('#articleList');
  
  //   $.each(articlesData, function (articleId, article) {
  //     var articleHtml = `
  //       <div>
  //         <h3>Article ID: ${article.id}</h3>
  //         <p>Title: ${article.title}</p>
  //         <p>Writer's Name: ${article.writer.name}</p>
  //         <p>Publish Date: ${article.publish_date}</p>
  //       </div>
  //       <hr>
  //     `;
  
  //     articleList.append(articleHtml);
  //   });
  // }

  // function displayArticles(articlesData, order, category) {
  //   var articleList = $('#articleList');
  
  //   // Convert articlesData to an array for sorting
  //   var articlesArray = Object.values(articlesData);
  
  //   // Sort articles based on category and order
  //   articlesArray.sort(function (a, b) {
  //     if (category === 'title') {
  //       // Sort by title
  //       return order === 'ascending' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
  //     } else if (category === 'dateOfPublication') {
  //       // Sort by date of publication
  //       return order === 'ascending' ? new Date(a.publish_date) - new Date(b.publish_date) : new Date(b.publish_date) - new Date(a.publish_date);
  //     }
  //     // Default to no sorting
  //     return 0;
  //   });
  
  //   // Clear existing content in the articleList
  //   articleList.empty();
  
  //   // Display sorted articles
  //   $.each(articlesArray, function (index, article) {
  //     var articleHtml = `
  //       <div>
  //         <h3>Article ID: ${article.id}</h3>
  //         <p>Title: ${article.title}</p>
  //         <p>Writer's Name: ${article.writer.name}</p>
  //         <p>Publish Date: ${article.publish_date}</p>
  //       </div>
  //       <hr>
  //     `;
  
  //     articleList.append(articleHtml);
  //   });
  // }
  
  
