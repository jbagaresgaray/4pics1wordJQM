$(document).ready(function() {
    'use strict';

    var game = new GameServices();

    function getActivePlayer() {
        return game.getActivePlayer();
    }

    $(document).on("pageshow", "#welcome", function(event, data) { // When entering pagetwo
        console.log("welcome is now shown: ", getActivePlayer());
        $('#welcome .appuser').text(getActivePlayer().name);
        $('#welcome .appuser_uuid').text(getActivePlayer().uuid);
    });

    $(document).on("pagehide", "#welcome", function(event, data) { // When entering pagetwo
        console.log("welcome is now hide");
        // game.logoutActivePlayer();
    });


    document.addEventListener('backbutton', function(evt) {
        if (window.location.hash == '#name') {
            window.history.back();
        } else {
            throw new Error('Exit'); // This will suspend the app
        }
    }, false);

    $(document).on("click", "#welcome .ui-btn-play", function() {
        console.log('ui-btn-play');
        store.set('actions', 'play');
        $.mobile.changePage("#category");
    });

    $(document).on("click", "#welcome .ui-btn-scoreboard", function() {
        console.log('ui-btn-scoreboard');
        store.set('actions', 'scoreboard');
        $.mobile.changePage("#category");
    });

    function exitFromApp() {
        if (navigator.app) {
            loopMediaflag = false;
            if (app.my_media) {
                app.my_media.stop()
            }
            navigator.app.exitApp();
        } else if (navigator.device) {
            loopMediaflag = false;
            if (app.my_media) {
                app.my_media.stop()
            }
            navigator.device.exitApp();
        } else {
            console.log('window.close();');
        }
    }

    $(document).on("click", "#welcome #quitpopupDialog .ui-btn-quit", function() {
        console.log('quit app');
        exitFromApp();
    });

});
