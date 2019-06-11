// **** A Drink For Your Mood ****
var slider = "";

// *** Birthday Page Confirmation ***
$(document).ready(function() {

    // on click function for submit
    $('#submit-birthday').on('click', function() {
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

});

// *** Description of Service & Slider page ***

$(document).ready(function() {
    $('.form-control-range').on('input', function() {
        var output = parseInt($('.form-control-range').val());
        if (output <= 14) {
            $('.reader').text("Sad");
            slider = "sad";
        }
        if ((output > 14) && (output <= 28)) {
            $('.reader').text("Angry");
            slider = "angry";
        }
        if ((output > 28) && (output <= 42)) {
            $('.reader').text("Afraid");
            slider = "afraid";
        }
        if ((output > 42) && (output <= 56)) {
            $('.reader').text("Neutral");
            slider = "neutral";
        }
        if ((output > 56) && (output <= 70)) {
            $('.reader').text("Anxious");
            slider = "anxious";
        }
        if ((output > 70) && (output <= 84)) {
            $('.reader').text("Surprised");
            slider = "surprised";
        }
        if ((output > 84) && (output <= 100)) {
            $('.reader').text("Happy");
            slider = "happy";
        };

    })

    $('#submit-slider').on('click', function() {
        if ((slider === "sad") || (slider === "angry") || (slider === "afraid") || (slider === "neutral") || (slider === "anxious") || (slider === "surprised") || (slider === "happy")) {
            window.location = "wireframe3.html";
        } else {
            $('.reader').text("Please adjust slider ");
        }
    })

    // if accepted can proceed to evaluation & drink recommendation page after inputtnig slider info

    // else will proceed to drink recommendation page after slider page instead of face ++
})

// *** Evaluation & Drink Recommendation page ***

$(document).ready(function() {
    // object for 50 different drink options

    //Check if browser supports camera use
    // if statement for acceptance of camera use
    const supported = 'mediaDevices' in navigator;

    const constraints = { "video": { width: { exact: 320 } } };
    // var videoTag = $('#video-tag');
    // var imageTag = $('#image-tag');
    var zoomSlider = $("#zoom-slider");
    var zoomSliderValue = $("#zoom-slider-value");
    var imageCapturer;
    const videoTag = document.querySelector('#video-tag');
    const imageTag = document.querySelector('#image-tag');

    $('#start').on('click', function start() {
        navigator.mediaDevices.getUserMedia(constraints)
            .then(gotMedia)
            .catch(e => { console.error('getUserMedia() failed: ', e); });
    })

    function gotMedia(mediastream) {

        videoTag.srcObject = mediastream;

        $('#start').disabled = true;

        var videoTrack = mediastream.getVideoTracks()[0];
        imageCapturer = new ImageCapture(videoTrack);

        // Timeout needed in Chrome, see https://crbug.com/711524
        setTimeout(() => {
            const capabilities = videoTrack.getCapabilities()
                // Check whether zoom is supported or not.
            if (!capabilities.zoom) {
                return;
            }

            zoomSlider.min = capabilities.zoom.min;
            zoomSlider.max = capabilities.zoom.max;
            zoomSlider.step = capabilities.zoom.step;

            zoomSlider.value = zoomSliderValue.value = videoTrack.getSettings().zoom;
            zoomSliderValue.value = zoomSlider.value;

            zoomSlider.oninput = function() {
                zoomSliderValue.value = zoomSlider.value;
                videoTrack.applyConstraints({ advanced: [{ zoom: zoomSlider.value }] });
            }
        }, 500);

    }

    $('#takePhoto').on('click', function takePhoto() {
        // console.log("clicked");
        imageCapturer.takePhoto()
            .then((blob) => {
                console.log("Photo taken: " + blob.type + ", " + blob.size + "B")
                imageTag.src = URL.createObjectURL(blob);

                var reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = function() {
                    let base64data = reader.result;
                    console.log(base64data);


                    var queryURL = `https://api-us.faceplusplus.com/facepp/v3/detect?image_base64=${base64data}&api_key=XtvBZyeUXRy0uOEtl1mlG61af7JzBlIj&api_secret=tYNC1LAnUmHhUw_1IXhLLyKJXcZRHuvo`

                    $.ajax({
                            // passing object through ajax
                            url: 'https://api-us.faceplusplus.com/facepp/v3/detect',
                            method: "POST",
                            data: {
                                api_key: 'XtvBZyeUXRy0uOEtl1mlG61af7JzBlIj',
                                api_secret: 'tYNC1LAnUmHhUw_1IXhLLyKJXcZRHuvo',
                                image_base64: base64data,
                                return_attributes: 'gender,age,emotion'
                            }
                        })
                        .then(function(response) {
                            console.log(`FACE++:`, response);
                            // pulls emotion from the main face in the photo
                            let obj = response.faces[0].attributes.emotion.valueOf();

                            // console.log(obj);

                            let max = 0
                            let whichKey = false
                            for (let key in obj) {
                                // loops over the object
                                if (max < obj[key]) {
                                    // sets max to object's value of the key
                                    max = obj[key];
                                    whichKey = key;
                                }

                            }
                            let drinks = "";
                            // If first slider chosen and Face++ reads, then recommend:
                            // Slider: Sadness	Face++: Sadness	    Cocktail Reco: Whiskey Sour
                            if (slider === 'sad' && whichKey === 'sadness') {
                                drinks = "whisky_sour";
                                // Slider: Anger	Face++: Sadness	    Cocktail Reco: Mulled Wine
                            } else if (slider === 'angry' && whichKey === 'sadness') {
                                drinks = "mulled_wine";
                                // Slider: Angst	Face++: Sadness	    Cocktail Reco: Tequila Slammer
                            } else if (slider === 'anxious' && whichKey === 'sadness') {
                                drinks = "tequila_slammer";
                                // Slider: Fear	    Face++: Sadness	    Cocktail Reco: Grass Skirt
                            } else if (slider === 'afraid' && whichKey === 'sadness') {
                                drinks = "tequila_slammer";
                                // Slider: Neutral	Face++: Sadness	    Cocktail Reco: Mimosa
                            } else if (slider === 'neutral' && whichKey === 'sadness') {
                                drinks = "mimosa";
                                // Slider: Surprise	    Face++: Sadness	    Cocktail Reco: Mudslinger
                            } else if (slider === 'surprised' && whichKey === 'sadness') {
                                drinks = 'mudslinger';
                                // Slider: Happiness	Face++: Sadness	    Cocktail Reco: Cosmopolitan
                            } else if (slider === 'happy' && whichKey === 'sadness') {
                                drinks = 'cosmopolitan';
                                // Slider: Sad	    Face++: Anger	Cocktail Reco: Blue Lagoon
                            } else if (slider === 'sad' && whichKey === 'sadness') {
                                drinks = 'blue_lagoon';
                                // Slider: Anger	Face++: Anger	Cocktail Reco: Tequila Surprise
                            } else if (slider === 'angry' && whichKey === 'anger') {
                                drinks = 'tequila_surprise';
                                // Slider: Angst	Face++: Anger	Cocktail Reco: Creme de Menthe
                            } else if (slider === 'anxious' && whichKey === 'anger') {
                                drinks = 'creme_de_menthe';
                                // Slider: Fear	    Face++: Anger	Cocktail Reco: Big Red
                            } else if (slider === 'afraid' && whichKey === 'anger') {
                                drinks = 'big_red';
                                // Slider: Neutral	Face++: Anger	Cocktail Reco: The Jimmy Conway
                            } else if (slider === 'neutral' && whichKey === 'anger') {
                                drinks = 'the_jimmy_conway';
                                // Slider: Surprise	    Face++: Anger	Cocktail Reco: Mother's Milk
                            } else if (slider === 'surprised' && whichKey === 'anger') {
                                drinks = `mother's_milk`;
                                // Slider: Happiness	Face++: Anger	Cocktail Reco: Jackhammer
                            } else if (slider === 'happy' && whichKey === 'anger') {
                                drinks = 'jackhammer';
                                // Slider: Sad	    Face++: Disgust	    Cocktail Reco: B-52
                            } else if (slider === 'sad' && whichKey === 'disgust') {
                                drinks = 'b-52';
                                // Slider: Anger	Face++: Disgust	    Cocktail Reco: Thriller
                            } else if (slider === 'anger' && whichKey === 'disgust') {
                                drinks = 'thriller';
                                // Slider: Angst	Face++: Disgust	    Cocktail Reco: Mojito
                            } else if (slider === 'anxious' && whichKey === 'disgust') {
                                drinks = 'mojito';
                                // Slider: Fear	    Face++: Disgust	    Cocktail Reco: Bloody Mary
                            } else if (slider === 'afraid' && whichKey === 'disgust') {
                                drinks = 'bloody_mary';
                                // Slider: Neutral	Face++: Disgust	    Cocktail Reco: Penicillin
                            } else if (slider === 'neutral' && whichKey === 'disgust') {
                                drinks = 'penicillin';
                                // Slider: Surprise	    Face++: Disgust	    Cocktail Reco: Pink Lady
                            } else if (slider === 'surprised' && whichKey === 'disgust') {
                                drinks = 'pink_lady';
                                // Slider: Happiness	Face++: Disgust	    Cocktail Reco: Belgian Blue
                            } else if (slider === 'happy' && whichKey === 'disgust') {
                                drinks = 'belgian_blue';
                                // Slider: Sad	    Face++: Fear	Cocktail Reco: Coke and Drops
                            } else if (slider === 'sad' && whichKey === 'fear') {
                                drinks = 'coke_and_drops';
                                // Slider: Anger	Face++: Fear	Cocktail Reco: Dirty Martini
                            } else if (slider === 'angry' && whichKey === 'fear') {
                                drinks = 'dry_martini';
                                // Slider: Angst	Face++: Fear	Cocktail Reco: Berry Deadly
                            } else if (slider === 'anxious' && whichKey === 'fear') {
                                drinks = 'berry_deadly';
                                // Slider: Fear	    Face++: Fear	Cocktail Reco: Martini
                            } else if (slider === 'afraid' && whichKey === 'fear') {
                                drinks = 'martini';
                                // Slider: Neutral	Face++: Fear	Cocktail Reco: Gin And Tonic
                            } else if (slider === 'neutral' && whichKey === 'fear') {
                                drinks = 'gin_and_tonic';
                                // Slider: Surprise	    Face++: Fear	Cocktail Reco: Jello Shots
                            } else if (slider === 'surprised' && whichKey === 'fear') {
                                drinks = 'jello_shots';
                                // Slider: Happiness	Face++: Fear	Cocktail Reco: Paloma
                            } else if (slider === 'happy' && whichKey === 'fear') {
                                drinks = 'paloma';
                                // Slider: Sad	    Face++: Neutral	    Cocktail Reco: Vesuvio
                            } else if (slider === 'sad' && whichKey === 'neutral') {
                                drinks = 'vesuvio';
                                // Slider: Anger	Face++: Neutral	    Cocktail Reco: Zippy's Revenge
                            } else if (slider === 'angry' && whichKey === 'neutral') {
                                drinks = `zippy's_revenge`;
                                // Slider: Angst	Face++: Neutral	    Cocktail Reco: Pina Colada
                            } else if (slider === 'anxious' && whichKey === 'neutral') {
                                drinks = 'pina_colada';
                                // Slider: Fear	    Face++: Neutral	    Cocktail Reco: Zinger
                            } else if (slider === 'fear' && whichKey === 'neutral') {
                                drinks = `zinger`;
                                // Slider: Neutral	Face++: Neutral	    Cocktail Reco: Old Fashioned
                            } else if (slider === 'neutral' && whichKey === 'neutral') {
                                drinks = `old_fashioned`;
                                // Slider: Surprise	    Face++: Neutral	    Cocktail Reco: Bellini
                            } else if (slider === 'surprised' && whichKey === 'neutral') {
                                drinks = `bellini`;
                                // Slider: Happiness	Face++: Neutral	    Cocktail Reco: Strawberry Daiquiri
                            } else if (slider === 'happy' && whichKey === 'neutral') {
                                drinks = `strawberry_daiquiri`;
                                // Slider: Sad	    Face++: Surprise	Cocktail Reco: Brain Fart
                            } else if (slider === 'sad' && whichKey === 'surprise') {
                                drinks = `brain_fart`;
                                // Slider: Anger	Face++: Surprise	Cocktail Reco: Gimlet
                            } else if (slider === 'angry' && whichKey === 'surprise') {
                                drinks = `gimlet`;
                                // Slider: Angst	Face++: Surprise	Cocktail Reco: Paradise
                            } else if (slider === 'anxious' && whichKey === 'surprise') {
                                drinks = `paradise`;
                                // Slider: Fear	    Face++: Surprise	Cocktail Reco: Zenmeister
                            } else if (slider === 'afraid' && whichKey === 'surprise') {
                                drinks = `zenmeister`;
                                // Slider: Neutral	Face++: Surprise	Cocktail Reco: Boulevardier
                            } else if (slider === 'neutral' && whichKey === 'surprise') {
                                drinks = `boulevardier`;
                                // Slider: Surprise	Face++: Surprise	Cocktail Reco: Pisco Sour
                            } else if (slider === 'suprised' && whichKey === 'surprise') {
                                drinks = `pisco_sour`;
                                // Slider: Happiness	Face++: Surprise	Cocktail Reco: Ipamena
                            } else if (slider === 'happiness' && whichKey === 'surprise') {
                                drinks = `ipamena`;
                                // Slider: Sad	    Face++: Happiness	Cocktail Reco: Negroni
                            } else if (slider === 'sad' && whichKey === 'happiness') {
                                drinks = `negroni`;
                                // Slider: Anger	Face++: Happiness	Cocktail Reco: Manhattan
                            } else if (slider === 'angry' && whichKey === 'happiness') {
                                drinks = `manhattan`;
                                // Slider: Angst	Face++: Happiness	Cocktail Reco: Vesper 
                            } else if (slider === 'anxiou' && whichKey === 'happiness') {
                                drinks = `vesper`;
                                // Slider: Fear	    Face++: Happiness	Cocktail Reco: Flaming Lamborghini
                            } else if (slider === 'afraid' && whichKey === 'happiness') {
                                drinks = `flaming_lamborghini`;
                                // Slider: Neutral	Face++: Happiness	Cocktail Reco: Yellow Bird
                            } else if (slider === 'neutral' && whichKey === 'happiness') {
                                drinks = `yellow_bird`;
                                // Slider: Surprise	Face++: Happiness	Cocktail Reco: Moscow Mule
                            } else if (slider === 'suprised' && whichKey === 'happiness') {
                                drinks = `moscow_mule`;
                                // Slider: Happiness	Face++: Happiness	Cocktail Reco: Margarita
                            } else if (whichKey === 'happiness' && slider === 'happy') {
                                drinks = `margarita`;
                            }
                            console.log(max);
                            console.log(whichKey);

                            var queryURL = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drinks}`;

                            $.ajax({
                                url: queryURL,
                                method: "GET"
                            }).then(function(response) {
                                console.log(`Drinks Data: ${response.drinks[0]}`);
                            });

                            // link to picture of drink in the html
                            let imgLink = response.drinks[0].strDrinkThumb;
                            // console.log(response.drinks.strDrinkThumb.valueOf());

                            // ingredients
                            // ingredients array
                            // response.drinks.stringredient[i]

                            // instructions
                            // response.drinks.strInstructions

                        })
                        .catch(e => {
                            console.log(e);
                        })
                        // console.log(URL.createObjectURL(blob));

                }
            })
            .catch(e => {
                console.error("takePhoto() failed: ", e);
            });
    })
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

// // DISPLAY 



// *** About Us & Contact Page ***

// Contact us store the user inputs in a database?