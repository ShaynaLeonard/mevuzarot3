// name: ready function  
// description: this function deals with all of the functonality in for the add photos button, as described in the following 
// parameters: N/A 
// return parameters: N/A 
$(document).ready(function () {
    const clientId = 'ToUIN5-e_9vpQjCge_eRLPinR-aM0LJ6SQsZdXTiM7Q';
    let currentPage = 1;

    // Keep track of whether the search button was clicked
    let searchButtonClicked = false;

    $('#searchInput').on('input', function () {
        // Reset the flag when the user is typing
        searchButtonClicked = false;
    });


    // name: onclick for the seearch button 
    // description: when clicked, then the input from the search bar is sent to the searchImages function 
    // parameters: N/A 
    // return parameters: N/A 
    $('#searchBtn').on('click', function () {
        searchButtonClicked = true;
        const query = $('#searchInput').val();
        if (query.length >= 2) {
            searchImages(query);
        }
        else {
            alert("You need to enter an input of at least 2 letters")
        }
    });

    // name: onclick function for the exit button  
    // description: when clicked, return back to the article list 
    // parameters:  N/A 
    // return parameters:N/A 
    $('#exit').on('click', function () {
        // Navigate back to the previous page in the browser's history
        window.history.back();
    });

    // name:  searchImages
    // description: the query is sent to the unsplash server to serach for the image 
    // parameters: query - a string with the type of picture to search for. 
    // return parameters:N/A 

    function searchImages(query) {
        // Only proceed if the search button was clicked
        if (searchButtonClicked) {
            const apiUrl = `https://api.unsplash.com/search/photos?query=${query}&client_id=${clientId}&per_page=20&page=${currentPage}`;

            $.ajax({
                url: apiUrl,
                method: 'GET',
                success: function (data) {
                    if (data.results.length === 0) {
                        alert("No results found.");
                    }
                    else {
                        displayImages(data.results);
                    }
                },
                error: function (error) {
                    console.error('Error fetching images:', error);
                }
            });
        }
    }

    // name:  displayImages
    // description: displays the images recieved from unsplash 
    // parameters: list of images (as recieved from the ajax ) 
    // return parameters: N/A 
    function displayImages(images) {
        const imageContainer = $('#imageContainer');
        imageContainer.empty();

        images.forEach(function (image) {
            const imageDiv = $('<div class="image"></div>');
            const img = $('<img src="' + image.urls.thumb + '">');
            const addButton = $('<button class="addButton">Add</button>');


            imageDiv.append(img);
            imageDiv.append(addButton);
            imageContainer.append(imageDiv);

            // name:  on clicke listener for addButton button 
            // description: when clicked, the addImagesToArticle function is called 
            // parameters: N/A 
            // return parameters: N/A 
            addButton.on('click', function () {
                // Call the function to add images to the article
                addImagesToArticle(image);
            });

        });
    }

    // name:  addImagesToArticle
    // description: adds the image recieved to the article id 
    // parameters: image
    // return parameters: N/A 
    function addImagesToArticle(image) {
        // Extract articleId from the current URL
        const urlParams = new URLSearchParams(window.location.search);
        const articleId = urlParams.get('articleId');

        // Ensure articleId is available
        if (!articleId) {
            console.error('ArticleId not found in the URL');
            return;
        }

        // Prepare the data to send in the POST request
        const imageDetails = {
            id: image.id,
            thumb_url: image.urls.thumb,
            description: image.alt_description,
        };

        // Make the AJAX request to add images to the article
        $.ajax({
            url: `/articles/${articleId}/images`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(imageDetails),
            success: function (response) {
                alert(response); // Show a success message
            },
            error: function (error) {
                console.error('Error adding images to article:', error);
                alert('Error adding images to article. Please try again.');
            }
        });
    }

});
