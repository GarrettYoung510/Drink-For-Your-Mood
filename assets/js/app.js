// **** A Drink For Your Mood ****


// *** Birthday Page Confirmation ***

// on click function for submit
$('#submit').on('click', function() {
    // variable for user inputted date
    var date = $('#picker').val();
    console.log("date.valueOF(): " + date.valueOf());
    console.log("moment of: " + moment(date).valueOf())

    // chosen date to unix
    var chosenDate = moment(date).valueOf()

    // variable for todays date
    var today = parseInt(moment().valueOf());
    console.log("today: " + today);

    // Getting age by subracting today from chosen date
    console.log("Age: " + parseInt(today - chosenDate));

    var ofAge = parseInt(today - chosenDate)
        // if statement for date entered
    if (ofAge >= 662256000000) {
        // if 21+ proceed to next page
        console.log("Let's Drink!")
    } else {
        // else denied!
        console.log("NOPE! Rejected");
    }
})



// *** Description of Service & Slider page ***

// if statement for acceptance of camera use

// if accepted can proceed to evaluation & drink recommendation page after inputtnig slider info

// else will proceed to drink recommendation page after slider page instead of face ++


// *** Evaluation & Drink Recommendation page ***

// object for 50 different drink options

// take photo and store in variable


const player = $('#player');
const canvas = $('#canvas');
const context = canvas.getContext('2d');
const captureButton = $('#capture');

const constraints = {
    video: true,
};

captureButton.on('click', () => {
    // Draw the video frame to the canvas.
    context.drawImage(player, 0, 0, canvas.width, canvas.height);
    // Stop all video streams.
    player.srcObject.getVideoTracks().forEach(track => track.stop());
});

// Attach the video stream to the video element and autoplay.
navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
        player.srcObject = stream;
    });


// run through face ++ api

// variable for query URL

// AJAX call using query url and photo
var queryURL = `https://api-us.faceplusplus.com/facepp/v3/face/analyze&api_key=XtvBZyeUXRy0uOEtl1mlG61af7JzBlIj&api_secret=tYNC1LAnUmHhUw_1IXhLLyKJXcZRHuvo`

// then response function

// pull user slider input from previous page

// pull face ++ results

// compare face ++ results & slider results

// SECONDARY - pull weather from weather api for the decision

// if statement with accepted camera permissions

// if accepted, use face ++ & weather to come up with drink recommendation


// else give drink recommendation based on slider

// DISPLAY 

var queryURL = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drinks}`;

$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response) {
    console.log(`Drinks Data: ${response}`);
});

// picture of drink in the html
// ingredients
// instructions


// *** About Us & Contact Page ***

// Contact us store the user inputs in a database?