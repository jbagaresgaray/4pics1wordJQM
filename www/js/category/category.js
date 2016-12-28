$(document).ready(function() {
    'use strict';

    console.log('category');

    $(document).on("click", "#sports_card", function() {
        console.log('sports_card');
        store.set('params', 'sports');
        $.mobile.changePage("#game");
    });

    $(document).on("click", "#vocabulary_card", function() {
        console.log('vocabulary_card');
        store.set('params', 'vocabulary');
        $.mobile.changePage("#game");
    });

    $(document).on("click", "#countries_card", function() {
        console.log('countries_card');
        store.set('params', 'country');
        $.mobile.changePage("#game");
    });

    $(document).on("click", "#computer_card", function() {
        console.log('computer_card');
        store.set('params', 'computer');
        $.mobile.changePage("#game");
    });
});
