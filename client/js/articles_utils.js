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
  $("#saveDisplayChanges").click(function () {

    // Get selected order and category values
    var order = $('input[name="order"]:checked').val();
    var category = $('input[name="catergory"]:checked').val();
    console.log("order=", order)
    console.log("catergory=", category)

    
    // displayArticles(order, category);


  });
});

  
  
  // // Function to display articles
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

  function displayArticles(articlesData, order, category) {
    var articleList = $('#articleList');
  
    // Convert articlesData to an array for sorting
    var articlesArray = Object.values(articlesData);
  
    // Sort articles based on category and order
    articlesArray.sort(function (a, b) {
      if (category === 'title') {
        // Sort by title
        return order === 'ascending' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
      } else if (category === 'dateOfPublication') {
        // Sort by date of publication
        return order === 'ascending' ? new Date(a.publish_date) - new Date(b.publish_date) : new Date(b.publish_date) - new Date(a.publish_date);
      }
      // Default to no sorting
      return 0;
    });
  
    // Clear existing content in the articleList
    articleList.empty();
  
    // Display sorted articles
    $.each(articlesArray, function (index, article) {
      var articleHtml = `
        <div>
          <h3>Article ID: ${article.id}</h3>
          <p>Title: ${article.title}</p>
          <p>Writer's Name: ${article.writer.name}</p>
          <p>Publish Date: ${article.publish_date}</p>
        </div>
        <hr>
      `;
  
      articleList.append(articleHtml);
    });
  }
  
  
