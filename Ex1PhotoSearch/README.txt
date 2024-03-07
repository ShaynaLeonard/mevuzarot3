Name: Shayna Leonard 
Id: 332509959
http://shaynabe.mysoft.jce.ac.il/Ex1%20Photo%20Search/

-------------------------Client- Server Communication------------------------
1. Page Load:
Client (Browser): When a user opens the web page, the browser sends a request to the server to retrieve the HTML, CSS, and JavaScript files.
Server: The server responds with the requested HTML, CSS, and JavaScript files. The browser renders the page and executes the JavaScript.

2. User Types in Search Input:
Client (Browser): As the user types in the search input, the JavaScript code attached to the input event on the search input field triggers.
Client (JavaScript): The JavaScript code checks if the length of the input is greater than or equal to 2 characters.
Client (JavaScript): If the condition is met, it triggers the searchImages function.

3. Search Images Function:
Client (JavaScript): The searchImages function constructs a URL for the Unsplash API with the user's search query.
Client (JavaScript): It then sends an AJAX request to the Unsplash API using the constructed URL.
Server: The Unsplash server processes the API request, performs a search based on the query, and responds with image data.
Client (JavaScript): The success callback function (displayImages) is executed.

4. Display Images Function:
Client (JavaScript): The displayImages function receives the image data from the server.
Client (JavaScript): It dynamically creates HTML elements (image containers, images, details containers, and buttons) for each image.
Client (JavaScript): Event listeners are attached to the "Details" buttons.

5. User Clicks "Details" Button:
Client (Browser): When a user clicks the "Details" button for a specific image, the associated event listener triggers.
Client (JavaScript): The showDetails function is executed with information about the selected image.
Client (JavaScript): The showDetails function dynamically creates HTML for displaying detailed information about the image.

6. Load More Button Clicked:
Client (Browser): If there are more pages of images to load, the user can click the "Load More" button.
Client (JavaScript): The event listener for the "Load More" button triggers the execution of the searchImages function with an incremented page number.
Steps 3 to 5 are repeated: The searchImages function sends a new request to the Unsplash API, receives the response, and displays additional images.

------------------Methods--------------
$(document).ready(function() - this function runs a bunch of functions: 

    1. $('#searchInput').on('input', function() - when a user starts typing more than 1 letter than a url than a GET request is made using AJAX  to search for the given string. 
        If there are more than 20 images then a Load More button will appear 
    
    2. function displayImages(images) - display the images received from unsplash and an detail button for each image  

    3. $('#loadMoreBtn').on('click', function() - when clicked, loads the next 20 pictures (and replaces the previous ones) 
    
function showDetails(container, title, imageUrl, likes, description, thumbUrl) - when clicked displayed the photo thumbnail, title, description and number of likes 








    



