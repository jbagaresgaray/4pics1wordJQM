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

        store.set('isSounds',value);

        if(value){
            app.my_media.play();
        }else{
            app.my_media.pause();
        }
    });
});
