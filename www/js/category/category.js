$(document).ready(function() {
    'use strict';

    console.log('category');

    $(document).on("click", "#sports_card", function() {
        console.log('sports_card');
        store.set('params', 'sports');
        if (store.get('actions') == 'play') {
            $.mobile.changePage("#game");
        } else {
            $.mobile.changePage("#scoreboard");
        }
    });

    $(document).on("click", "#vocabulary_card", function() {
        console.log('vocabulary_card');
        store.set('params', 'vocabulary');
        if (store.get('actions') == 'play') {
            $.mobile.changePage("#game");
        } else {
            $.mobile.changePage("#scoreboard");
        }
    });

    $(document).on("click", "#countries_card", function() {
        console.log('countries_card');
        store.set('params', 'country');
        if (store.get('actions') == 'play') {
            $.mobile.changePage("#game");
        } else {
            $.mobile.changePage("#scoreboard");
        }
    });

    $(document).on("click", "#computer_card", function() {
        console.log('computer_card');
        store.set('params', 'computer');
        if (store.get('actions') == 'play') {
            $.mobile.changePage("#game");
        } else {
            $.mobile.changePage("#scoreboard");
        }
    });
});
