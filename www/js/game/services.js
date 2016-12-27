function GameServices() {
    var self = this;
    return {
        getSportsData() {
            return $.getJSON("data/sports.json", function(data) {
                return data;
            });
        }
    };
}
