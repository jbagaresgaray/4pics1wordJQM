/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var my_media = null;

var app = {
    my_media:null,
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        console.log('Media: ', Media);
        console.log('Storage: ', store);
        console.log('Device: ', device);


        app.initializeSounds()
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    },

    getCordovaPath() {
        var path = window.location.pathname;
        if (!!window.cordova) {
            if (device.platform == "Android") {
                path = "/android_asset/www/";
            }
            // path = cordova.file.applicationDirectory + 'www/'
            // path = path.substr( path, path.length - 23 );

            //path = path + 'audio/'+audiofile+'.mp3';
            return 'file://' + path;
        }
    },


    initializeSounds() {
        console.log('initializeSounds')
        if (!!window.cordova) {
            console.log('pumasok: ', this.getCordovaPath());

            this.my_media = new Media(this.getCordovaPath() + 'assets/bgmusic2.mp3', function() {
                console.log("playAudio():Audio Success");
            }, function(err) {
                console.log("playAudio():Audio Error: " + err);
            }, function(status) {
                console.log('Media status: ',status);
                if (status === Media.MEDIA_STOPPED) {
                    this.my_media.play();
                }
            });
            this.my_media.play();
        }
    }
};

if (!store.get('isSounds')) {
    store.set('isSounds', true);
}

app.initialize();
