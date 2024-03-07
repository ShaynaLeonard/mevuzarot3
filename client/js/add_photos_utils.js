$(document).ready(function () {
    const clientId = 'ToUIN5-e_9vpQjCge_eRLPinR-aM0LJ6SQsZdXTiM7Q';
    let currentPage = 1;

    // Keep track of whether the search button was clicked
    let searchButtonClicked = false;

    $('#searchInput').on('input', function () {
        // Reset the flag when the user is typing
        searchButtonClicked = false;
    });

    // Handle the search button click
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

    $('#exit').on('click', function () {
        // Navigate back to the previous page in the browser's history
        window.history.back();
    });

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


            // Handle the add button click here
            // addButton.on('click', function () {
            //     alert("Add button clicked for image:\n" +
            //         "ID: " + image.id + "\n" +
            //         "URL: " + image.urls.thumb + "\n" +
            //         "Description: " + image.alt_description);
            // });

            addButton.on('click', function () {
                // Call the function to add images to the article
                addImagesToArticle(image);
            });

        });
    }

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
