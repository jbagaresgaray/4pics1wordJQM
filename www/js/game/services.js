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
        getSportsData() {
            return $.getJSON("data/sports.json", function(data) {
                return data;
            });
        },
        getCountriesData() {
            return $.getJSON("data/countries.json", function(data) {
                return data;
            });
        },
        getComputerData() {
            return $.getJSON("data/computer.json", function(data) {
                return data;
            });
        },
        getVocabularyData() {
            return $.getJSON("data/vocabulary.json", function(data) {
                return data;
            });
        },
        saveNewPlayer(playername) {
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
        getActivePlayer() {
            var player = {};
            player = store.get('active_player');

            if (!_.isEmpty(store.get('players'))) {
                var players = JSON.parse(store.get('players')) || [];
                var result = _.find(players, { 'uuid': player.uuid });
                if (result) {
                    player.sports = result.sports;
                    player.vocabulary = result.vocabulary;
                    player.country = result.country;
                    player.computer = result.computer;
                    player.sports_level = result.sports_level;
                    player.vocabulary_level = result.vocabulary_level;
                    player.computer_level = result.computer_level;
                    player.country_level = result.country_level;
                }
            }
            return player;
        },
        getAllPlayers() {
            if (!_.isEmpty(store.get('players'))) {
                return JSON.parse(store.get('players')) || [];
            } else {
                return [];
            }
        },
        loginActivePlayer(player) {
            store.set('active_player', {
                name: player.name,
                uuid: player.uuid
            });
        },
        logoutActivePlayer() {
            return store.set('active_player', null);
        },
        saveScore(category, action, player) {
            if (!_.isEmpty(store.get('players'))) {
                var players = JSON.parse(store.get('players')) || [];

                _.each(players, function(row) {
                    if (row.uuid == player.uuid) {
                        if (action == 'hint') {
                            if (parseInt(row[category]) > 50) {
                                row[category] = parseInt(row[category]) - 50;
                            } else {
                                row[category] = 0;
                            }
                        } else if (action == 'quiz') {
                            row[category] = parseInt(row[category]) + 5;
                        }
                    }
                });

                store.set('players', JSON.stringify(players));
            }
        },
        saveLevel(category,player) {
            if (!_.isEmpty(store.get('players'))) {
                var players = JSON.parse(store.get('players')) || [];
                _.each(players, function(row) {
                    if (row.uuid == player.uuid) {
                        if (category == 'sports') {
                            row.sports_level = parseInt(row.sports_level) + 1;
                        }else if(category == 'vocabulary'){
                            row.vocabulary_level = parseInt(row.vocabulary_level) + 1;
                        }else if(category == 'computer'){
                            row.computer_level = parseInt(row.computer_level) + 1;
                        }else if(category == 'country'){
                            row.country_level = parseInt(row.country_level) + 1;
                        }
                    }
                });
                store.set('players', JSON.stringify(players));
            }
        }
    };
}
