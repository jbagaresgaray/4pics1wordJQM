$(document).ready(function() {
    'use strict';

    var word;
    var word_stack = [];
    var hint_stack = [];
    var word_answer = [];
    var numbers = [];
    var params;
    var questions = [];
    var usedQuestions = [];
    var question = {};
    var activePlayer = {};
    var num;

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
            // if ((i + 1) > 6) {
            //     html = ' <div style="padding-top: 10px;"><div class="box"><button class="ui-btn ui-btn-inline clr-btn-blue-grey click_answer"><i id="word_gen_' + (i + 1) + '" data-index="' + (i + 1) + '" data-appindex="" class="zmd-lg"></i></button></div></div>';
            // } else {
            //     html = ' <div><div class="box"><button class="ui-btn ui-btn-inline clr-btn-blue-grey click_answer"><i id="word_gen_' + (i + 1) + '" data-index="' + (i + 1) + '" data-appindex="" class="zmd-lg"></i></button></div></div>';
            // }
            html = ' <div><div class="box"><button class="ui-btn ui-btn-inline clr-btn-blue-grey click_answer"><i id="word_gen_' + (i + 1) + '" data-index="' + (i + 1) + '" data-appindex="" class="zmd-lg"></i></button></div></div>';
            $('.word-gen').append(html);
        }
    }

    function generateGridThumbnails(array) {
        $('#grid_thumbnail').empty();
        for (var i = 0; i < array.length; i++) {
            if (i % 2 === 0) {
                var html = '<div class="col-xs-6 col-sm-6 col-md-6"><div class="grid-media text-right"><img src="' + array[i] + '" height="100%" class="img-thumbnail"></div></div>';
            } else {
                var html = '<div class="col-xs-6 col-sm-6 col-md-6"><div class="grid-media text-left"><img src="' + array[i] + '" height="100%" class="img-thumbnail"></div></div>';
            }
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

            word_answer = [];

            $.each($('.click_answer'), function(index, item) {
                var text = $(item).find('.zmd-lg').text();
                if (_.isEmpty(text) && (word_stack.length == (index + 1))) {
                    $(item).find('.zmd-lg').text(obj.text);
                    $(item).find('.zmd-lg').attr('data-appindex', obj.index);

                    numbers = _.filter(numbers, function(row) {
                        return row != index
                    });
                    console.log('new numbers: ', numbers);
                    return false;
                } else if (_.isEmpty(text)) {
                    $(item).find('.zmd-lg').text(obj.text);
                    $(item).find('.zmd-lg').attr('data-appindex', obj.index);

                    numbers = _.filter(numbers, function(row) {
                        return row != index
                    });
                    console.log('new numbers: ', numbers);
                    return false;
                }
            });

            $.each($('.click_letter'), function(index, item) {
                var newIndex = (parseInt(obj.index) - 1);
                if (newIndex == index) {
                    $(item).find('.zmd-lg').text('');
                    $(item).removeClass('clr-btn-indigo');
                    $(item).addClass('clr-btn-grey');
                }
            });

            $.each($('.click_answer'), function(index, item) {
                var text = $(item).find('.zmd-lg').text();
                if (text) {
                    word_answer.push(text);
                }
            });

            var answord = _.map(word_answer, function(row) {
                return row
            }).join().replace(/,/g, "");

            if (word_answer.length == word.length) {
                if (answord == word) {
                    var game = new GameServices();
                    game.saveScore(params, 'quiz', num, null, activePlayer);
                    game.saveLevel(params, activePlayer);
                    store.set(params, -1);
                    setTimeout(function() {
                        $('#showCorrect').trigger('click');
                    }, 600);
                } else {
                    animateWrongAnswer();
                }
            }

        }
    }

    function removeWorkValue(obj) {
        if (word_stack.length > 0) {
            var isHint = false;
            $.each($('.click_answer'), function(index, item) {
                var appindex = $(item).find('.zmd-lg').attr('data-appindex');
                var hasClass = $(item).hasClass('clr-btn-grey');
                isHint = hasClass;

                if (obj.appindex == appindex) {
                    if (!hasClass) {
                        $(item).find('.zmd-lg').text('');
                        $(item).find('.zmd-lg').attr('data-appindex', '');
                        numbers.splice(index, 0, index);
                        console.log('new numbers: ', numbers);
                    }
                    return false;
                }
            });

            if (!isHint) {
                console.log('isHint: ', isHint)
                $.each($('.click_letter'), function(index, item) {
                    var indexs = $(this).find('.zmd-lg').data('index');
                    if (obj.appindex == indexs) {
                        $(item).find('.zmd-lg').text(obj.text);
                        $(item).addClass('clr-btn-indigo');
                        $(item).removeClass('clr-btn-grey');
                        return false;
                    }
                });

                word_stack = _.filter(word_stack, function(row) {
                    return (parseInt(row.index) !== parseInt(obj.appindex));
                });
            } else {
                console.log('isHint2 : ', isHint)
            }
        }
    }

    function generateHint() {
        var rand = Math.floor(Math.random() * numbers.length);
        var randomNum = numbers[rand];
        numbers = _.filter(numbers, function(row) {
            return row != randomNum
        });
        // var boxindex = getRandomInt((word.length - 1));
        var boxindex = randomNum;
        var letter = _.toArray(word);
        var appindex;

        $.each($('.click_letter'), function(index, item) {
            var text = $(item).find('.zmd-lg').text();
            if (letter[boxindex] == text) {
                $(item).find('.zmd-lg').text('');
                appindex = $(this).find('.zmd-lg').data('index');
                $(item).removeClass('clr-btn-indigo');
                $(item).addClass('clr-btn-grey');
                return false;
            }
        });

        word_answer = [];
        $.each($('.click_answer'), function(index, item) {
            var text = $(item).find('.zmd-lg').text();
            if (boxindex == index) {
                if (_.isEmpty(text)) {
                    $(item).find('.zmd-lg').text(letter[boxindex]);
                    $(item).find('.zmd-lg').attr('data-appindex', appindex);
                    $(item).removeClass('clr-btn-blue-grey');
                    $(item).addClass('clr-btn-grey');

                    hint_stack.push(letter[boxindex]);
                    word_stack.push({
                        text: letter[boxindex],
                        index: appindex
                    });
                    // Deduct points on every hint
                    var game = new GameServices();
                    game.saveScore(params, 'hint', null, {
                        text: letter[boxindex],
                        appindex: appindex,
                        index: index
                    }, activePlayer);
                    game.saveLevel(params, activePlayer);


                    // Refresh Scoring
                    activePlayer = game.getActivePlayer();
                    $('#game .game-score').text(activePlayer[params]);

                }
            } else {
                if (_.isEmpty(text)) {
                    $(item).find('.zmd-lg').text('');
                }
            }
        });

        $.each($('.click_answer'), function(index, item) {
            var text = $(item).find('.zmd-lg').text();
            if (text) {
                word_answer.push(text);
            }
        });

        var answord = _.map(word_answer, function(row) {
            return row
        }).join().replace(/,/g, "");

        if (word_answer.length == word.length) {
            if (answord == word) {
                var game = new GameServices();
                game.saveScore(params, 'quiz', num, null, activePlayer);
                game.saveLevel(params, activePlayer);
                store.set(params, -1);

                setTimeout(function() {
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

        $('.contentinfo').hide();
        $('#grid_thumbnail').empty();
        $('.word-gen').empty();

        var game = new GameServices();
        params = store.get('params');
        activePlayer = game.getActivePlayer();
        $('#game .game-score').text(activePlayer[params]);
        console.log('activePlayer: ', activePlayer);

        function formatN(n) {
            return n > 9 ? "" + n : "0" + n;
        }

        if (params == 'sports') {
            $('#game .leveling').text(formatN(activePlayer.sports_level));

            game.getSportsData().then(function(data) {
                questions = data;
                // questions = _.shuffle(questions);

                if (usedQuestions && usedQuestions.length < 1) {
                    for (var i = 0; i < questions.length; i++) {
                        usedQuestions.push(i);
                    }
                }

                if (activePlayer.sports_ques && activePlayer.sports_ques.length > 0) {
                    for (var i = 0; i < activePlayer.sports_ques.length; i++) {
                        var index = activePlayer.sports_ques[i];
                        usedQuestions = _.filter(usedQuestions, function(row) {
                            return row !== index;
                        });
                    }
                }

                var rand = Math.floor(Math.random() * usedQuestions.length);
                var randomNum = usedQuestions[rand];

                if (store.get(params) > -1) {
                    num = store.get(params);
                } else {
                    num = randomNum;
                    store.set(params, num);
                }
                question = questions[num];
                console.log('question: ', question);
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

                    $('.contentinfo').show();

                    if (numbers && numbers.length < 1) {
                        for (var i = 0; i < word.length; i++) {
                            numbers.push(i);
                        }
                    }
                }

                if (activePlayer.sports_hints && activePlayer.sports_hints.length > 0) {
                    _.each(activePlayer.sports_hints, function(row) {
                        hint_stack.push(row.text);
                        word_stack.push({
                            text: row.text,
                            index: row.appindex
                        });

                        $.each($('.click_answer'), function(index, item) {
                            var text = $(item).find('.zmd-lg').text();
                            if (row.index == index) {
                                if (_.isEmpty(text)) {
                                    $(item).find('.zmd-lg').text(row.text);
                                    $(item).find('.zmd-lg').attr('data-appindex', row.appindex);
                                    $(item).removeClass('clr-btn-blue-grey');
                                    $(item).addClass('clr-btn-grey');
                                }
                            }
                        });

                        $.each($('.click_letter'), function(index, item) {
                            var text = $(item).find('.zmd-lg').text();
                            if (row.text == text) {
                                $(item).find('.zmd-lg').text('');
                                $(item).removeClass('clr-btn-indigo');
                                $(item).addClass('clr-btn-grey');
                                return false;
                            }
                        });
                    });
                }
            });
        } else if (params == 'country') {
            $('#game .leveling').text(formatN(activePlayer.country_level));

            game.getCountriesData().then(function(data) {
                questions = data;
                // questions = _.shuffle(questions);

                if (usedQuestions && usedQuestions.length < 1) {
                    for (var i = 0; i < questions.length; i++) {
                        usedQuestions.push(i);
                    }
                }

                if (activePlayer.country_ques && activePlayer.country_ques.length > 0) {
                    for (var i = 0; i < activePlayer.country_ques.length; i++) {
                        var index = activePlayer.country_ques[i];
                        usedQuestions = _.filter(usedQuestions, function(row) {
                            return row !== index;
                        });
                    }
                }

                var rand = Math.floor(Math.random() * usedQuestions.length);
                var randomNum = usedQuestions[rand];

                if (store.get(params) > -1) {
                    num = store.get(params);
                } else {
                    num = Math.floor(Math.random() * questions.length);
                    store.set(params, num);
                }

                question = questions[num];
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
                    $('.contentinfo').show();

                    if (numbers && numbers.length < 1) {
                        for (var i = 0; i < word.length; i++) {
                            numbers.push(i);
                        }
                    }
                }

                if (activePlayer.country_hints && activePlayer.country_hints.length > 0) {
                    _.each(activePlayer.country_hints, function(row) {
                        hint_stack.push(row.text);
                        word_stack.push({
                            text: row.text,
                            index: row.appindex
                        });

                        $.each($('.click_answer'), function(index, item) {
                            var text = $(item).find('.zmd-lg').text();
                            if (row.index == index) {
                                if (_.isEmpty(text)) {
                                    $(item).find('.zmd-lg').text(row.text);
                                    $(item).find('.zmd-lg').attr('data-appindex', row.appindex);
                                    $(item).removeClass('clr-btn-blue-grey');
                                    $(item).addClass('clr-btn-grey');
                                }
                            }
                        });
                    });
                }
            });
        } else if (params == 'vocabulary') {
            $('#game .leveling').text(formatN(activePlayer.vocabulary_level));

            game.getVocabularyData().then(function(data) {
                questions = data;
                // questions = _.shuffle(questions);

                if (usedQuestions && usedQuestions.length < 1) {
                    for (var i = 0; i < questions.length; i++) {
                        usedQuestions.push(i);
                    }
                }

                if (activePlayer.vocabulary_ques && activePlayer.vocabulary_ques.length > 0) {
                    for (var i = 0; i < activePlayer.vocabulary_ques.length; i++) {
                        var index = activePlayer.vocabulary_ques[i];
                        usedQuestions = _.filter(usedQuestions, function(row) {
                            return row !== index;
                        });
                    }
                }

                var rand = Math.floor(Math.random() * usedQuestions.length);
                var randomNum = usedQuestions[rand];

                if (store.get(params) > -1) {
                    num = store.get(params);
                } else {
                    num = Math.floor(Math.random() * questions.length);
                    store.set(params, num);
                }

                question = questions[num];
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
                    $('.contentinfo').show();

                    if (numbers && numbers.length < 1) {
                        for (var i = 0; i < word.length; i++) {
                            numbers.push(i);
                        }
                    }
                }

                if (activePlayer.vocabulary_hints && activePlayer.vocabulary_hints.length > 0) {
                    _.each(activePlayer.vocabulary_hints, function(row) {
                        hint_stack.push(row.text);
                        word_stack.push({
                            text: row.text,
                            index: row.appindex
                        });

                        $.each($('.click_answer'), function(index, item) {
                            var text = $(item).find('.zmd-lg').text();
                            if (row.index == index) {
                                if (_.isEmpty(text)) {
                                    $(item).find('.zmd-lg').text(row.text);
                                    $(item).find('.zmd-lg').attr('data-appindex', row.appindex);
                                    $(item).removeClass('clr-btn-blue-grey');
                                    $(item).addClass('clr-btn-grey');
                                }
                            }
                        });
                    });
                }
            });
        } else if (params == 'computer') {
            $('#game .leveling').text(formatN(activePlayer.computer_level));

            game.getComputerData().then(function(data) {
                questions = data;
                // questions = _.shuffle(questions);

                if (usedQuestions && usedQuestions.length < 1) {
                    for (var i = 0; i < questions.length; i++) {
                        usedQuestions.push(i);
                    }
                }

                if (activePlayer.computer_ques && activePlayer.computer_ques.length > 0) {
                    for (var i = 0; i < activePlayer.computer_ques.length; i++) {
                        var index = activePlayer.computer_ques[i];
                        usedQuestions = _.filter(usedQuestions, function(row) {
                            return row !== index;
                        });
                    }
                }

                var rand = Math.floor(Math.random() * usedQuestions.length);
                var randomNum = usedQuestions[rand];

                if (store.get(params) > -1) {
                    num = store.get(params);
                } else {
                    num = Math.floor(Math.random() * questions.length);
                    store.set(params, num);
                }

                question = questions[num];
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
                    $('.contentinfo').show();

                    if (numbers && numbers.length < 1) {
                        for (var i = 0; i < word.length; i++) {
                            numbers.push(i);
                        }
                    }
                }

                if (activePlayer.computer_hints && activePlayer.computer_hints.length > 0) {
                    _.each(activePlayer.computer_hints, function(row) {
                        hint_stack.push(row.text);
                        word_stack.push({
                            text: row.text,
                            index: row.appindex
                        });

                        $.each($('.click_answer'), function(index, item) {
                            var text = $(item).find('.zmd-lg').text();
                            if (row.index == index) {
                                if (_.isEmpty(text)) {
                                    $(item).find('.zmd-lg').text(row.text);
                                    $(item).find('.zmd-lg').attr('data-appindex', row.appindex);
                                    $(item).removeClass('clr-btn-blue-grey');
                                    $(item).addClass('clr-btn-grey');
                                }
                            }
                        });
                    });
                }
            });
        }



        $.each($('.click_letter'), function(index, item) {
            $(item).addClass('clr-btn-indigo');
            $(item).removeClass('clr-btn-grey');
        });
    }

    $(document).on("pageshow", "#game", function(event, data) { // When entering pagetwo
        $('#zoom_thumbnail').hide();

        $(this).on('touchmove', function(e) {
            //prevent native touch activity like scrolling
            console.log('asdasd')
            e.preventDefault();
        });

        generateGame();
    });

    $(document).on("click", ".generate-hint", function(event, data) {
        if (activePlayer[params] < 50) {
            $('#showNotDialog').trigger('click');
            return;
        } else {
            $('#showJokerDialog').trigger('click');
        }
    });

    $("#correctDialog").on("popupafteropen", function(event, ui) {
        console.log('#correctDialog popupafteropen: ')
        $('#correctDialog').find('.answer').empty();
        if (!_.isEmpty(question)) {
            $('#correctDialog').find('.answer').text(question.answer.toUpperCase());
        }
    });

    $("#correctDialog").on("popupafterclose", function(event, ui) {
        $('#correctDialog').find('.answer').empty();
        if (question) {
            if (question.hastip) {
                setTimeout(function() {
                    $('#showTipDialog').trigger('click');
                }, 100);
            } else {
                var game = new GameServices();
                game.clearHintCache(params, activePlayer);

                generateGame();
            }
        }
    });

    $("#tipDialog").on("popupcreate", function(event, ui) {
        $('#tipDialog').find('.tipimage').empty()
    });

    $("#tipDialog").on("popupafteropen", function(event, ui) {
        $('#tipDialog').find('.tipimage').empty()
        if (question) {
            if (question.hastip) {
                if (!_.isEmpty(question.tipimage)) {
                    $('#tipDialog').find('.tipimage').append('<img src="' + question.tipimage + '" border="0" style="height: 160px" />')
                }
                $('#tipDialog').find('.tip').html(question.tip)
                $('#tipDialog').find('.nd2-title').html(question.answer.toUpperCase())
            }
        }
    });

    $("#tipDialog").on("popupafterclose", function(event, ui) {
        $('#tipDialog').find('.tipimage').empty()
        $('#tipDialog').find('.tip').empty()
        $('#tipDialog').find('.nd2-title').empty()

        var game = new GameServices();
        game.clearHintCache(params, activePlayer);

        generateGame();
    });

    $(document).on("click", "#game .hint-confirm", function() {
        console.log('generate Hint');
        generateHint();
    });


    $(document).on("click", ".click_letter", function() {
        var text = $(this).find('.zmd-lg').text();
        var index = $(this).find('.zmd-lg').data('index');

        if (!_.isEmpty(text)) {
            addWorkValue({ text: text, index: index });
        }
    });

    $(document).on("click", ".click_answer", function() {
        console.log('click_answer');

        var text = $(this).find('.zmd-lg').text();
        var index = $(this).find('.zmd-lg').data('index');
        // var app_index = $(this).find('.zmd-lg').data('appindex');
        var app_index = $(this).find('.zmd-lg').attr('data-appindex');

        if (!_.isEmpty(text)) {
            removeWorkValue({ text: text, index: index, appindex: app_index });
        }
    });

    $(document).on("click", ".zoom_thumbnail", function() {
        $('#grid_thumbnail').show();
        $('#zoom_thumbnail').hide();

        $(this).find('.card-media img').attr('src', '');
    });

    $(document).on("click", ".grid-media", function() {
        $('#grid_thumbnail').hide();
        $('#zoom_thumbnail').show();

        var img = $(this).find('img').attr('src');
        $('.zoom_thumbnail').find('img').attr('src', img);
    });
});
