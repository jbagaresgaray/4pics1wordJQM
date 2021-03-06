$(document).ready(function() {
    'use strict';

    $(document).on("pagehide", "#scoreboard", function(event, data) { // When entering pagetwo
        console.log('pagehide')
        $('#scoreboard .player-listview').empty();

    });

    $(document).on("pageshow", "#scoreboard", function(event, data) { // When entering pagetwo

        var scoreboards = [];
        var params = store.get('params')
        var game = new GameServices();
        var gamerecords = game.getScoreboard(params);
        console.log('gamerecords: ', gamerecords);

        $('#scoreboard .player-listview').empty();
        if (gamerecords && gamerecords.length > 0) {
            _.each(gamerecords, function(row) {
                scoreboards.push(row);
            })

            $('#scoreboard .player-listview').empty();
            if (scoreboards && scoreboards.length > 0) {
                _.each(scoreboards, function(row) {
                    var html = '<li><a href="#" class="appplayer" data-ajax="true"><img src="assets/photo.png" class="ui-thumbnail ui-thumbnail-circular" /><h2 class="playername" data-uuid="' + row.uuid + '">' + row.name + '(' + row.score + ') </h2></a></li>';
                    $('#scoreboard .player-listview').append(html);
                });
                $('#scoreboard .player-listview').listview('refresh');


                setTimeout(function() {
                    $(".player-listview li:nth-child(1) a").find('.playername').after('<img src="assets/app/trophy1.png" class="ui-thumbaward" />');
                    $(".player-listview li:nth-child(2) a").find('.playername').after('<img src="assets/app/star2.png" class="ui-thumbaward-small" />');
                    $(".player-listview li:nth-child(3) a").find('.playername').after('<img src="assets/app/star2.png" class="ui-thumbaward-small" />');

                    $('#scoreboard .player-listview').listview('refresh');
                }, 100);
            }
        }
    });



});
