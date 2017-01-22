$(document).ready(function() {
    'use strict';

    console.log('settings');

    $(document).on("pageshow", "#settings", function(event, data) {
        if (!!store.get('isSounds')) {
            $("#settings #flip-checkbox").val(store.get('isSounds').toString()).flipswitch("refresh");
        }
    });


    $(document).on("change", "#settings #flip-checkbox", function(e) {
        var id = this.id,
            value = this.value;
        console.log(id + " has been changed! " + value);
        store.set('isSounds', value);

        if (value == "true") {
            console.log('true')
            if (!!window.cordova) {
                console.log('cordova')
                app.my_media.setVolume('1.0');
            }
        } else {
            console.log('false')
            if (!!window.cordova) {
                console.log('cordova')
                if (app.my_media != null) {
                    app.my_media.setVolume('0.0');
                }
            }
        }
    });
});
