//// Template Replace:
//   hris     : the name of this page's module: (lowercase)
//   userfileTest  : the name of this page :  (lowercase)
//   UserfileTest  : the name of this page :  (Uppercase)

/**
 * @class hris.client.pages.UserfileTest.hrisUserfileTestSetup
 * @parent hris.client.pages.UserfileTest
 * 
 *  The setup script for the userfileTest Page container. 
 *
 *  The job of this code is to perform all the setup steps on the existing
 *  HTML DOM items now.  Add Events, actions, etc... 
 *
 *  This file will be generated 1x by the RAD tool and then left alone.
 *  It is safe to put all your custom code here.
 */


(function() {


////[appRad] --  setup object definitions here:
var hrisUserfileTestSetup = function (topic, data) {


    //// Setup Your Page Data/ Operation Here
    var $widgetDiv = $('#upload-widget-container');
    $widgetDiv.appdev_file_upload({
        urlUpload: "/hris/userfile/upload?attribute_id=0"
    });
    $widgetDiv.on('submit', function(event, data) {
        $('#upload-reset').hide();
    });
    $widgetDiv.on('uploaded', function(event, data) {
        $('#upload-details').empty();
        for (var key in data) {
            $('#upload-details').append('<dt>' + key + '</dt><dd>' + data[key] + '</dd>');
        }
        $('#upload-reset').show();
    });
    
    $('#upload-reset').hide();
    $('#upload-reset').on('click', function() {
        $('#upload-details').empty();
        $('#upload-reset').hide();
        $widgetDiv.controller().reset();
    });
	
	// unsubscribe me so this doesn't get called again ... 
	AD.Comm.Notification.unsubscribe(userfileTestSubID);
} // end hrisUserfileTestSetup()
var userfileTestSubID = AD.Comm.Notification.subscribe('ad.hris.userfileTest.setup',hrisUserfileTestSetup);




$(document).ready(function () {

    //// Do you need to do something on document.ready() before the above
    //// hrisUserfileTestSetup() script is called?


}); // end ready()

}) ();