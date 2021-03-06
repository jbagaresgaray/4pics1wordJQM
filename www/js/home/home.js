$(document).ready(function() {
    'use strict';

    function getAllPlayers() {
        var game = new GameServices();
        var players = game.getAllPlayers();

        $('#name .player-listview').empty();
        _.each(players, function(row) {
            var html = '<li><a href="#" class="appplayer" data-ajax="true">\
                <img src="assets/photo.png" class="ui-thumbnail ui-thumbnail-circular" />\
                <h2 class="playername" data-uuid="' + row.uuid + '">' + row.name + '</h2></a></li>';

            $('#name .player-listview').append(html);
        });
        $('#name .player-listview').listview('refresh');
    }

    function exitFromApp() {
        if (navigator.app) {
            loopMediaflag = false;
            if(app.my_media){
                app.my_media.stop()
            }
            navigator.app.exitApp();
        } else if (navigator.device) {
            loopMediaflag = false;
            if(app.my_media){
                app.my_media.stop()
            }
            navigator.device.exitApp();
        } else {
            console.log('window.close();');
        }
    }


    $(document).on("click", ".ui-btn", function() {
        if (!!window.cordova) {
            new Media(app.getCordovaPath() + 'assets/1.mp3', function() {
                console.log("playAudio():Audio Success");
                this.release();
            }, function(err) {
                console.log("playAudio():Audio Error: " + err);
                this.release();
            }).play();
        }
    });

    $(document).on("pageshow", "#home", function(event, data) { // When entering pagetwo
        if (!!window.cordova) {
            if (!!store.get('isSounds')) {
                //play and stop the sounds
                !store.get('isSounds') ? app.my_media.stop() : app.my_media.play()
            }
        }
    });


    $(document).on("pageshow", "#name", function(event, data) { // When entering pagetwo
        $('#name input[name="playername"]').empty();

        getAllPlayers();
    });


    $(document).on("click", "#name .player-save", function() {
        var playername = $('#name input[name="playername"]').val();
        var game = new GameServices();
        if (!_.isEmpty(playername)) {
            if (game.saveNewPlayer(playername)) {
                console.log('player successfully save');
                getAllPlayers();

                setTimeout(function() {
                    $.mobile.changePage("#welcome");
                }, 600);
            }
        }
    });

    $(document).on("click", "#name .appplayer", function() {
        var name = $(this).find('.playername').text();
        var uuid = $(this).find('.playername').attr('data-uuid');

        var game = new GameServices();
        game.loginActivePlayer({
            name: name,
            uuid: uuid
        });

        setTimeout(function() {
            $.mobile.changePage("#welcome");
        }, 600);
    });



    $(document).on("click", "#popupDialog .ui-btn-quit", function() {
        console.log('quit app');
        exitFromApp();
    });
});
