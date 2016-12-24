/**
 * Number.prototype.format(n, x)
 *
 * @param integer n: length of decimal
 * @param integer x: length of sections
 */
Number.prototype.format = function(n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};

// Starting App
jQuery(document).ready(function($){
    var lastElement = 100000;
    var foodWasting = "";
    var selectedState = "";
    // var perHour = "";
    // var lastItem = ""; 
    var myApp = {};
    // Get state info
    function stateInfo(selectedState) {
        $.getJSON( "assets/js/json/state-info.json", function( json ) {
            var items = [];
            for (var i = 0; i < json.length; i++) {
                if (json[i].State === selectedState) {
                    items.push(json[i])
                }
            }
            mainItems = items;

            // Getting random number
            var randomElement = Math.floor((Math.random() * items.length));
            if (randomElement == lastElement) {
                if (randomElement < items.length) {
                    randomElement =+ 1;
                }
                else {
                    randomElement =- 1;
                }
            }
            lastElement = randomElement;

            // Getting random item
            myApp.perHour = items[randomElement][ "# of items per hour powered"];
            myApp.perHour = Number(myApp.perHour.replace(/\,/g,""));
            if (myApp.perHour > 999999999) {
                myApp.perHour = (myApp.perHour/1000000000).toFixed(1) + " billion";
            }
            else if (myApp.perHour > 999999) {
                myApp.perHour = (myApp.perHour/1000000).toFixed(1) + " million";
            }
            else if (myApp.perHour > 999) {
                myApp.perHour = (myApp.perHour/1000).toFixed(1) + " thousand";
            }

            // Getting item name
            myApp.lastItem = items[randomElement].Item;
        }).success(function() {
             // Animating text and showing results
            $( ".hourPowerP" ).animate ({
                    opacity: 0,
                }, 300, function() {
                    $('.hourPowerP').html("When converted into <span>energy</span>, that’s enough to power <span>" + myApp.perHour + "</span> <span>" + myApp.lastItem + "</span> for one hour.");
                }
            );
            $( ".hourPowerP" ).animate ({
                    opacity: 1,
                }, 300, function() {
                    // Animation complete.
                }
            );
        });
    };
    // Get food waste
    function foodWaste() {
        $.getJSON( "assets/js/json/foodWaste.json", function( json2 ) {
            for (var i = 0; i < json2.length; i++) {
                if (json2[i].State === selectedState) {
                    foodWasting = json2[i].foodWaste.format();  
                }
            }
        }).success(function() {
             // Animating text and showing results
            $( ".foodWasteP, .line" ).animate ({
                    opacity: 0,
                }, 300, function() {
                    $('.foodWasteP').html("<span>" + selectedState + "</span> produces around <span>" + foodWasting + "</span> pounds o​f food waste every year.");
                }
            );
            $( ".foodWasteP, .line" ).animate ({
                    opacity: 1,
                }, 300, function() {
                    // Animation complete.
                }
            );
        });
    };
    $('.state').click(function() {
        // Changing colors of countries
        $('.state').css({"fill": "#fff"});
        $(this).css({"fill": "#8dd124"});
        
        // Selecting state and calling functions
        selectedState = $('#tooltip h4').text();

        stateInfo(selectedState);
        foodWaste();
    });

    // See more options
    $('.changeOptions').click(function() {
        var getState = $('.foodWasteP span').first().text();
        if (getState == "") {
            $('.hourPowerP').html("No state selected.");
        }
        else {
            stateInfo(getState);
        }
    });

    // Responsive
    if ($(window).width() < 530) {
        // code for small viewports
        $('#statesvg').attr("viewBox", "120 0 600 750");
        $('#statesvg').attr("width", "320");
        $('#statesvg').attr("height", "250");
    }


});
