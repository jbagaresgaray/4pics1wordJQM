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
            navigator.app.exitApp();
        } else if (navigator.device) {
            navigator.device.exitApp();
        } else {
            console.log('window.close();');
        }
    }


    function getCordovaPath() {
        var path = window.location.pathname;
        if (device.platform == "Android") {
            path = "/android_asset/www/";
        }
        // path = cordova.file.applicationDirectory + 'www/'
        // path = path.substr( path, path.length - 23 );

        //path = path + 'audio/'+audiofile+'.mp3';
        return 'file://' + path;
    }

    $(document).on("click", ".ui-btn", function() {
        new Media(getCordovaPath() + 'assets/1.mp3', function() {
            console.log("playAudio():Audio Success");
        }, function(err) {
            console.log("playAudio():Audio Error: " + err);
        }).play();
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
