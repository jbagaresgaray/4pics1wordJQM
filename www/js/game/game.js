$(document).ready(function() {
    'use strict';

    var word;
    var word_stack = [];
    var hint_stack = [];
    var numbers = [];
    var params;
    var questions = [];
    var usedQuestions = [];
    var question = {};

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
            var html;
            if((i + 1) > 6){
                html = ' <div class="col-xs-2 col-sm-2 col-md-2" style="padding-left: 0px;padding-top: 10px;"><div class="box"><button class="ui-btn ui-btn-inline clr-btn-blue-grey click_answer"><i id="word_gen_' + (i + 1) + '" data-index="' + (i + 1) + '" data-appindex="" class="zmd-lg"></i></button></div></div>';
            }else{
                html = ' <div class="col-xs-2 col-sm-2 col-md-2" style="padding-left: 0px;"><div class="box"><button class="ui-btn ui-btn-inline clr-btn-blue-grey click_answer"><i id="word_gen_' + (i + 1) + '" data-index="' + (i + 1) + '" data-appindex="" class="zmd-lg"></i></button></div></div>';
            }
            $('.word-gen').append(html);
        }
    }

    function generateGridThumbnails(array) {
        $('#grid_thumbnail').empty();
        for (var i = 0; i < array.length; i++) {
            var html = '<div class="col-xs-6 col-sm-6 col-md-6"><div class="nd2-card grid-media"><div class="card-media"><img src="' + array[i] + '" height="100%"></div></div></div>';
            $('#grid_thumbnail').append(html);
        }
    }

    function animateWrongAnswer() {
        var blinker = function() {
            $('.word-gen').fadeOut(500);
            $('.word-gen').fadeIn(500);
        }

        $.each($('.click_answer'), function(index, item) {
            var text = $(item).find('.zmd-lg').text();
            $(item).find('.zmd-lg').addClass('clr-red');
        });

        var refreshIntervalId = setInterval(blinker, 400);

        setTimeout(function() {
            clearInterval(refreshIntervalId);

            setTimeout(function() {
                $.each($('.click_answer'), function(index, item) {
                    var text = $(item).find('.zmd-lg').text();
                    $(item).find('.zmd-lg').addClass('clr-white');
                });
            }, 400);
        }, 1000)
    }

    function addWorkValue(obj) {
        if (word_stack.length < $('.click_answer').length) {

            word_stack.push({ text: obj.text, index: obj.index });

            $.each($('.click_answer'), function(index, item) {
                var text = $(item).find('.zmd-lg').text();
                if (_.isEmpty(text) && (word_stack.length == (index + 1))) {
                    $(item).find('.zmd-lg').text(obj.text);
                    $(item).find('.zmd-lg').attr('data-appindex', obj.index);
                }
            });

            $.each($('.click_letter'), function(index, item) {
                var newIndex = (parseInt(obj.index) - 1);
                if (newIndex == index) {
                    $(item).find('.zmd-lg').text('');
                    $(item).removeClass('clr-btn-teal');
                    $(item).addClass('clr-btn-grey');
                }

            });

            var answord = _.map(word_stack, function(row) {
                return row.text
            }).join().replace(/,/g, "");

            if (word_stack.length == word.length) {
                if (answord == word)
                    setTimeout(function() {
                        console.log('show modal');
                        $('#showCorrect').trigger('click');
                        // $.mobile.changePage("#correctDialog", { role: "dialog", transition: "pop" });
                    }, 600);
                else
                    animateWrongAnswer();

            }
        }
    }

    function removeWorkValue(obj) {
        if (word_stack.length > 0) {
            $.each($('.click_answer'), function(index, item) {
                var appindex = $(item).find('.zmd-lg').attr('data-appindex');
                if (obj.appindex == appindex)
                    $(item).find('.zmd-lg').text('');
            });

            $.each($('.click_letter'), function(index, item) {
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

    function generateHint() {
        var getRandomInt = function(max) {
            var num = Math.floor(Math.random() * (max - 0 + 1)) + 0;
            var result = _.indexOf(numbers, num);
            if (result > -1) {
                return getRandomInt(max);
            } else {
                numbers.push(num);
                return num;
            }
        }


        var boxindex = getRandomInt((word.length - 1));
        var letter = _.toArray(word);
        var appindex;

        $.each($('.click_letter'), function(index, item) {
            var text = $(item).find('.zmd-lg').text();
            if (letter[boxindex] == text) {
                $(item).find('.zmd-lg').text('');

                appindex = $(this).find('.zmd-lg').data('index');
                console.log('appindex: ', appindex);

                $(item).removeClass('clr-btn-teal');
                $(item).addClass('clr-btn-grey');
                return false;
            }
        });

        $.each($('.click_answer'), function(index, item) {
            var text = $(item).find('.zmd-lg').text();
            if (boxindex == index) {
                if (_.isEmpty(text)) {
                    $(item).find('.zmd-lg').text(letter[boxindex]);
                    $(item).find('.zmd-lg').attr('data-appindex', appindex);

                    hint_stack.push(letter[boxindex]);

                    word_stack.push({
                        text: letter[boxindex],
                        index: appindex
                    });
                }
            } else {
                if (_.isEmpty(text)) {
                    $(item).find('.zmd-lg').text('');
                }
            }
        });



        if (hint_stack.length == word.length) {
            var hintvalue = [];
            $.each($('.click_answer'), function(index, item) {
                var text = $(item).find('.zmd-lg').text();
                hintvalue.push(text);
            });

            var answord = _.map(hintvalue, function(row) {
                return row
            }).join().replace(/,/g, "");

            if (answord == word) {
                setTimeout(function() {
                    console.log('show modal');
                    $('#showCorrect').trigger('click');
                }, 600);
            } else {
                animateWrongAnswer();
            }
        }
    }

    function generateGame() {
        word_stack = [];
        numbers = [];
        hint_stack = [];
        questions = [];
        usedQuestions = [];
        question = {};


        var game = new GameServices();
        params = store.get('params');
        if (params == 'sports') {
            game.getSportsData().then(function(data) {
                console.log('sports: ', data);
                questions = data;
                questions = _.shuffle(questions);

                question = questions[Math.floor(Math.random() * questions.length)];
                if (!_.isEmpty(question)) {

                    generateGridThumbnails(question.images);

                    word = question.answer;
                    var len = 12 - parseInt(word.length);
                    var stringgen = stringGen(len);
                    var newword = word + stringgen;
                    var shuffleword = _.shuffle(newword);

                    generateBlocks(parseInt(word.length));

                    var i = 0;
                    _.each(shuffleword, function(row) {
                        i++;
                        $('#letter_' + i).text(row);
                    });
                }



                /*usedQuestions.push(rand);
                store.set('usedquestions',JSON.stringify(usedQuestions));*/
            });
        } else if (params == 'countries') {
            game.getCountriesData().then(function(data) {
                console.log('countries: ', data);
                questions = data;
                questions = _.shuffle(questions);

                question = questions[Math.floor(Math.random() * questions.length)];
                if (!_.isEmpty(question)) {

                    generateGridThumbnails(question.images);

                    word = question.answer;
                    var len = 12 - parseInt(word.length);
                    var stringgen = stringGen(len);
                    var newword = word + stringgen;
                    var shuffleword = _.shuffle(newword);

                    generateBlocks(parseInt(word.length));

                    var i = 0;
                    _.each(shuffleword, function(row) {
                        i++;
                        $('#letter_' + i).text(row);
                    });
                }
            });
        } else if (params == 'vocabulary') {
            game.getVocabularyData().then(function(data) {
                console.log('vocabulary: ', data);
                questions = data;
                questions = _.shuffle(questions);

                question = questions[Math.floor(Math.random() * questions.length)];
                if (!_.isEmpty(question)) {

                    generateGridThumbnails(question.images);

                    word = question.answer;
                    var len = 12 - parseInt(word.length);
                    var stringgen = stringGen(len);
                    var newword = word + stringgen;
                    var shuffleword = _.shuffle(newword);

                    generateBlocks(parseInt(word.length));

                    var i = 0;
                    _.each(shuffleword, function(row) {
                        i++;
                        $('#letter_' + i).text(row);
                    });
                }
            });
        } else if (params == 'computer') {
            game.getComputerData().then(function(data) {
                console.log('computer: ', data);
                questions = data;
                questions = _.shuffle(questions);

                question = questions[Math.floor(Math.random() * questions.length)];
                if (!_.isEmpty(question)) {

                    generateGridThumbnails(question.images);

                    word = question.answer;
                    var len = 12 - parseInt(word.length);
                    var stringgen = stringGen(len);
                    var newword = word + stringgen;
                    var shuffleword = _.shuffle(newword);

                    generateBlocks(parseInt(word.length));

                    var i = 0;
                    _.each(shuffleword, function(row) {
                        i++;
                        $('#letter_' + i).text(row);
                    });
                }
            });
        }




        $.each($('.click_letter'), function(index, item) {
            $(item).addClass('clr-btn-teal');
            $(item).removeClass('clr-btn-grey');
        });

    }



    $(document).on("pagebeforeshow", "#game", function(event, data) { // When entering pagetwo
        console.log("game is about to be shown");
    });

    $(document).on("pageshow", "#game", function(event, data) { // When entering pagetwo
        console.log("game is now shown");

        $('#zoom_thumbnail').hide();

        generateGame();
    });

    $("#correctDialog").on("popupafterclose", function(event, ui) {
        console.log('correctDialog has closed.');
        generateGame();
    });

    $(document).on("click", "#game .hint-confirm", function() {
        console.log('generate Hint');
        generateHint();
    });


    $(document).on("click", ".click_letter", function() {
        var text = $(this).find('.zmd-lg').text();
        var index = $(this).find('.zmd-lg').data('index');

        if (!_.isEmpty(text))
            addWorkValue({ text: text, index: index });
    });

    $(document).on("click", ".click_answer", function() {
        console.log('click_answer');

        var text = $(this).find('.zmd-lg').text();
        var index = $(this).find('.zmd-lg').data('index');
        var appindex = $(this).find('.zmd-lg').data('appindex');

        if (!_.isEmpty(text))
            removeWorkValue({ text: text, index: index, appindex: appindex });
    });

    $(document).on("click", ".zoom_thumbnail", function() {
        $('#grid_thumbnail').show();
        $('#zoom_thumbnail').hide();
    });

    $(document).on("click", ".grid-media", function() {
        $('#grid_thumbnail').hide();
        $('#zoom_thumbnail').show();

        var img = $(this).find('.card-media img').attr('src');
        $('.zoom_thumbnail').find('.card-media img').attr('src',img);
    });
});
