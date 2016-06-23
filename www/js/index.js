var app = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
        var parentElement = document.getElementById('deviceready');
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        document.getElementById('loadpdf').addEventListener(
            'click',
            function(e) {
                RadaeePDFPlugin.openFromAssets({
                    url: 'www/kickstart.pdf',
                    password: ''
                }, function(message) {
                    console.log('Success: ' + message);
                }, function(err) {
                    console.log('Failure: ' + err);
                });          
            }
        );

        if (device.platform === 'Android') {
            xhr = new XMLHttpRequest();
            xhr.open('GET', './kickstart.pdf', true);
            xhr.responseType = 'blob';

            xhr.onload = function() {
                var blob;

                if (this.status === 200) {
                    blob = new Blob([this.response], { type: 'application/pdf'});

                    window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(dir) {
                        dir.getFile('kickstart.pdf', { create: true, exclusive: false }, function(file) {
                            file.createWriter(function(fileWriter) {
                                fileWriter.onwriteend = function() {
                                    console.log('Successful file write: ' + file.toURL());
                                };

                                fileWriter.onerror = function(e) {
                                    console.log('Failed file write: ' + e.toString());
                                };

                                fileWriter.write(blob);
                            });
                        });
                    });
                } else {
                    console.log('problem: ' + this.status);
                }
            } ;

            xhr.send();   
        } else {
            // iOS
            RadaeePDFPlugin.activateLicense({
                licenseType: 0,
                company: '',
                email: '',
                key: ''
            }, function(message) {
                console.log('Activated license');
            }, function(message) {
                console.log('License Activation failed');
            });
        }
    }
};

app.initialize();