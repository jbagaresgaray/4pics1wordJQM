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
        }
    };
}
