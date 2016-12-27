$(document).ready(function() {
    'use strict';

    var word;
    var word_stack = [];

    function stringGen(len) {
        var text = "";
        var charset = "abcdefghijklmnopqrstuvwxyz";

        for (var i = 0; i < len; i++)
            text += charset.charAt(Math.floor(Math.random() * charset.length));

        return text;
    }

    function generateBlocks(len) {
        $('.word-gen').empty();

        for (var i = 0; i < len; i++) {
            var html = ' <div class="col-xs-2 col-sm-2 col-md-2" style="padding-left: 0px;">\
            <div class="box">\
                <button class="ui-btn ui-btn-inline clr-btn-blue-grey click_answer">\
                    <i id="word_gen_' + (i + 1) + '" data-index="' + (i + 1) + '" data-appindex="" class="zmd-lg"></i>\
                </button>\
            </div>\
        </div>';

            $('.word-gen').append(html);
        }
    }

    function addWorkValue(obj) {
        var click_answer = $('.click_answer');
        var click_letter = $('.click_letter');

        if (word_stack.length <= click_answer.length) {

            word_stack.push({
                text: obj.text,
                index: obj.index
            });

            $.each(click_answer, function(index, item) {
                var text = $(item).find('.zmd-lg').text();
                if (_.isEmpty(text) && (word_stack.length == (index + 1))) {
                    $(item).find('.zmd-lg').text(obj.text);
                    $(item).find('.zmd-lg').attr('data-appindex', obj.index);
                }
            });

            $.each(click_letter, function(index, item) {
                var newIndex = (parseInt(obj.index) - 1);
                if (newIndex == index) {
                    $(item).find('.zmd-lg').text('');
                    $(item).removeClass('clr-btn-teal');
                    $(item).addClass('clr-btn-grey');
                }
            });
        }
    }

    function removeWorkValue(obj) {
        var click_answer = $('.click_answer');
        var click_letter = $('.click_letter');

        if (word_stack.length > 0) {
            $.each(click_answer, function(index, item) {
            	var appindex = $(item).find('.zmd-lg').attr('data-appindex');
                if (obj.appindex == appindex) {
                    $(item).find('.zmd-lg').text('');
                }
            });

            $.each(click_letter, function(index, item) {
                var indexs = $(this).find('.zmd-lg').data('index');
                if (obj.appindex == indexs) {
                    $(item).find('.zmd-lg').text(obj.text);

                    $(item).addClass('clr-btn-teal');
                    $(item).removeClass('clr-btn-grey');
                }
            });

            word_stack = _.filter(word_stack, function(row) {
                return row.index !== obj.appindex;
            });
        }
    }



    $(document).on("pagebeforeshow", "#game", function() { // When entering pagetwo
        console.log("game is about to be shown");
    });

    $(document).on("pageshow", "#game", function() { // When entering pagetwo
        console.log("game is now shown");

        $('#zoom_thumbnail').hide();

        word = 'play';
        var len = 12 - parseInt(word.length);
        var stringgen = stringGen(len);
        var newword = word + stringgen;
        var shuffleword = _.shuffle(newword);

        generateBlocks(parseInt(word.length));

        var i = 0;
        _.each(shuffleword, function(row) {
            i++;
            var idname = '#letter_' + i;
            $(idname).text(row);
        });
    });

    $(document).on("click", ".click_letter", function() {
        var text = $(this).find('.zmd-lg').text();
        var index = $(this).find('.zmd-lg').data('index');

        if (!_.isEmpty(text)) {
            addWorkValue({
                text: text,
                index: index
            });
        }
    });

    $(document).on("click", ".click_answer", function() {
        console.log('click_answer');

        var text = $(this).find('.zmd-lg').text();
        var index = $(this).find('.zmd-lg').data('index');
        var appindex = $(this).find('.zmd-lg').data('appindex');

        if (!_.isEmpty(text)) {
            removeWorkValue({
                text: text,
                index: index,
                appindex: appindex
            });
        }
    });



    $(document).on("click", ".zoom_thumbnail", function() {
        console.log('hide zoom');
        $('#grid_thumbnail').show();
        $('#zoom_thumbnail').hide();
    });

    $(document).on("click", ".grid-media", function() {
        console.log('hide grid');
        $('#grid_thumbnail').hide();
        $('#zoom_thumbnail').show();
    });
});
