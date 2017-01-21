$(document).ready(function() {
    'use strict';

    console.log('scoreboard');

    var scoreboards = [];



    $(document).on("pageshow", "#scoreboard", function(event, data) { // When entering pagetwo
        var params = store.get('params')
        var game = new GameServices();
        var gamerecords = game.getScoreboard(params);
        console.log('gamerecords: ', gamerecords);

        $('#scoreboard .player-listview').empty();

        if (gamerecords && gamerecords.length > 0) {
            _.each(gamerecords, function(row) {
                if (row.score > 300) {
                    scoreboards.push(row);
                }
            })

            if (scoreboards && scoreboards.length > 0) {
                _.each(players, function(row) {
                    var html = '<li><a href="#" class="appplayer" data-ajax="true">\
                <img src="assets/photo.png" class="ui-thumbnail ui-thumbnail-circular" />\
                <h2 class="playername" data-uuid="' + row.uuid + '">' + row.name + '</h2></a></li>';

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
