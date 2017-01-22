function playerIDGenerator() {
    var text = "";
    var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 6; i++)
        text += charset.charAt(Math.floor(Math.random() * charset.length));

    return text;
}

function GameServices() {
    var self = this;
    return {
        getSportsData: function() {
            return $.getJSON("data/sports.json", function(data) {
                return data;
            });
        },
        getCountriesData: function() {
            return $.getJSON("data/countries.json", function(data) {
                return data;
            });
        },
        getComputerData: function() {
            return $.getJSON("data/computer.json", function(data) {
                return data;
            });
        },
        getVocabularyData: function() {
            return $.getJSON("data/vocabulary.json", function(data) {
                return data;
            });
        },
        saveNewPlayer: function(playername) {
            var players = [];
            var uuid = playerIDGenerator();

            store.set('active_player', {
                name: playername,
                uuid: uuid
            });

            if (!_.isEmpty(store.get('players'))) {
                players = JSON.parse(store.get('players'));
            }

            players.push({
                name: playername,
                uuid: uuid,
                sports: 300,
                vocabulary: 300,
                country: 300,
                computer: 300,
                sports_level: 1,
                vocabulary_level: 1,
                computer_level: 1,
                country_level: 1
            });

            store.set('players', JSON.stringify(players));
            return true;
        },
        getActivePlayer: function() {
            var player = {};
            player = store.get('active_player');

            if (!_.isEmpty(store.get('players'))) {
                var players = JSON.parse(store.get('players')) || [];
                var result = _.find(players, { 'uuid': player.uuid });
                player = result;
                // if (result) {
                //     player.sports = result.sports;
                //     player.vocabulary = result.vocabulary;
                //     player.country = result.country;
                //     player.computer = result.computer;
                //     player.sports_level = result.sports_level;
                //     player.vocabulary_level = result.vocabulary_level;
                //     player.computer_level = result.computer_level;
                //     player.country_level = result.country_level;
                // }
            }
            return player;
        },
        getAllPlayers: function() {
            if (!_.isEmpty(store.get('players'))) {
                return JSON.parse(store.get('players')) || [];
            } else {
                return [];
            }
        },
        loginActivePlayer: function(player) {
            store.set('active_player', {
                name: player.name,
                uuid: player.uuid
            });
        },
        logoutActivePlayer: function() {
            store.set('active_player', null);
            store.set('sports', null);
            store.set('sports_hints', null);
            store.set('vocabulary', null);
            store.set('vocabulary_hints', null);
            store.set('country', null);
            store.set('country_hints', null);
            store.set('computer', null);
            store.set('computer_hints', null);
        },
        clearHintCache: function(category, player) {
            if (!_.isEmpty(store.get('players'))) {
                var players = JSON.parse(store.get('players')) || [];
                _.each(players, function(row) {
                     if (row.uuid == player.uuid) {
                        row[category + '_hints'] = {}
                     }
                });
                store.set('players', JSON.stringify(players));
            }
        },
        saveScore: function(category, action, question_num, hintObj, player) {
            if (!_.isEmpty(store.get('players'))) {
                var players = JSON.parse(store.get('players')) || [];

                var question = [];
                var hints = [];
                _.each(players, function(row) {
                    if (row.uuid == player.uuid) {
                        if (action == 'hint') {
                            if (hintObj !== null) {
                                hints = row[category + '_hints'];
                                console.log('hints: ', hints);
                                if (hints && hints.length > 0) {
                                    hints.push(hintObj);
                                    row[category + '_hints'] = hints
                                } else {
                                    hints = [];
                                    hints.push(hintObj);
                                    row[category + '_hints'] = hints
                                }

                                if (parseInt(row[category]) > 50) {
                                    row[category] = parseInt(row[category]) - 50;
                                } else {
                                    row[category] = 0;
                                }
                            }
                        } else if (action == 'quiz') {
                            row[category] = parseInt(row[category]) + 5;
                        }

                        if (question_num !== null) {
                            question = row[category + '_ques'];
                            if (question && question.length > 0) {
                                question.push(question_num);
                                row[category + '_ques'] = question
                            } else {
                                question = [];
                                question.push(question_num);
                                row[category + '_ques'] = question
                            }
                        }
                    }
                });
                console.log('players: ', players);
                store.set('players', JSON.stringify(players));
            }
        },
        saveLevel: function(category, player) {
            if (!_.isEmpty(store.get('players'))) {
                var players = JSON.parse(store.get('players')) || [];
                _.each(players, function(row) {
                    if (row.uuid == player.uuid) {
                        if (category == 'sports') {
                            row.sports_level = parseInt(row.sports_level) + 1;
                        } else if (category == 'vocabulary') {
                            row.vocabulary_level = parseInt(row.vocabulary_level) + 1;
                        } else if (category == 'computer') {
                            row.computer_level = parseInt(row.computer_level) + 1;
                        } else if (category == 'country') {
                            row.country_level = parseInt(row.country_level) + 1;
                        }
                    }
                });
                store.set('players', JSON.stringify(players));
            }
        },
        getScoreboard: function(category) {
            if (!!category) {
                if (!_.isEmpty(store.get('players'))) {
                    var players = JSON.parse(store.get('players')) || [];
                    if (players && players.length > 0) {
                        var mapp = _.map(players, function(row) {
                            var categ = row[category];
                            var level = 0;

                            if (category == 'sports') {
                                level = row.sports_level;
                            } else if (category == 'country') {
                                level = row.country_level;
                            } else if (category == 'computer') {
                                level = row.computer_level;
                            } else if (category == 'vocabulary') {
                                level = row.vocabulary_level;
                            }

                            return {
                                name: row.name,
                                uuid: row.uuid,
                                score: categ,
                                level: level
                            }
                        });
                        return mapp;
                    } else {
                        return [];
                    }
                } else {
                    return [];
                }
            } else {
                console.log('no category input');
            }
        }
    };
}
