$(document).ready(function() {
    'use strict';

    console.log('category');

    $(document).on("click", "#sports_card", function() {
        console.log('sports_card');
        if (store.get('actions') == 'play') {
            store.set('params', 'sports');
            $.mobile.changePage("#game");
        } else {
            $.mobile.changePage("#scoreboard");
        }
    });

    $(document).on("click", "#vocabulary_card", function() {
        console.log('vocabulary_card');
        if (store.get('actions') == 'play') {
            store.set('params', 'vocabulary');
            $.mobile.changePage("#game");
        } else {
            $.mobile.changePage("#scoreboard");
        }
    });

    $(document).on("click", "#countries_card", function() {
        console.log('countries_card');
        if (store.get('actions') == 'play') {
            store.set('params', 'country');
            $.mobile.changePage("#game");
        } else {
            $.mobile.changePage("#scoreboard");
        }
    });

    $(document).on("click", "#computer_card", function() {
        console.log('computer_card');
        if (store.get('actions') == 'play') {
            store.set('params', 'computer');
            $.mobile.changePage("#game");
        } else {
            $.mobile.changePage("#scoreboard");
        }
    });
});
