$(document).ready(function() {
    const clientId = 'ToUIN5-e_9vpQjCge_eRLPinR-aM0LJ6SQsZdXTiM7Q';
    let currentPage = 1;

    // Keep track of whether the search button was clicked
    let searchButtonClicked = false;

    $('#searchInput').on('input', function() {
        // Reset the flag when the user is typing
        console.log("in input")
        searchButtonClicked = false;
    });

    // Handle the search button click
    $('#searchBtn').on('click', function() {
        console.log("clicked the search button")
        alert("clicked the serach button")
        searchButtonClicked = true;
        const query = $('#searchInput').val();
        if (query.length >= 2) {
            searchImages(query);
        }
    });

    function searchImages(query) {
        // Only proceed if the search button was clicked
        if (searchButtonClicked) {
            const apiUrl = `https://api.unsplash.com/search/photos?query=${query}&client_id=${clientId}&per_page=20&page=${currentPage}`;

            $.ajax({
                url: apiUrl,
                method: 'GET',
                success: function(data) {
                    displayImages(data.results);
                    if (currentPage < data.total_pages) {
                        $('#loadMoreBtn').show();
                    } else {
                        $('#loadMoreBtn').hide();
                    }
                },
                error: function(error) {
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
            const detailsContainer = $('<div class="detailsContainer"></div>');
            const detailsBtn = $('<button>Details</button>');

            imageDiv.append(img);
            imageDiv.append(detailsContainer.append(detailsBtn));
            imageContainer.append(imageDiv);

            detailsBtn.on('click', function () {
                showDetails(detailsContainer, image.alt_description, image.urls.small, image.likes, image.description, image.urls.thumb);
            });
        });
    }

    $('#loadMoreBtn').on('click', function() {
        currentPage++;
        const query = $('#searchInput').val();
        searchImages(query);
    });
});

function showDetails(container, title, imageUrl, likes, description, thumbUrl) {
    // Check if title or description is null or undefined
    title = title || 'there is none';
    description = description || 'there is none';

    const detailsContent = '<div class="detailsContent"><img src="' + thumbUrl + '" width="10" height="10"><p>Title: ' + title + '</p><p>Description: ' + description + '</p><p>Likes: ' + likes + '</p></div>';
    // Remove any existing details content
    container.find('.detailsContent').remove();

    // Append the new details content
    container.append(detailsContent);
}
