$(document).ready(function() {
    'use strict';
    console.log('welcome');

    var game = new GameServices();

    function getActivePlayer(){    	
    	return game.getActivePlayer();
    }

    $(document).on("pageshow", "#welcome", function(event, data) { // When entering pagetwo
        console.log("welcome is now shown: ",getActivePlayer());
        $('#welcome .appuser').text(getActivePlayer().name);
        $('#welcome .appuser_uuid').text(getActivePlayer().uuid);
    });

    $(document).on("pagehide", "#welcome", function(event, data) { // When entering pagetwo
        console.log("welcome is now hide");
        // game.logoutActivePlayer();
    });

});
