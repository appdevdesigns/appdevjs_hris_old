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

// Takes a Javascript object and returns a DD/DT html markup
// of the object's keys and values.
var markupObject = function(data)
{
    var html = '<dl class="well">';
    for (var key in data) {
        // Specia case. Add related links if we have the userfile_id.
        if (key == 'userfile_id') {
            var userfileID = data[key];
            html += markupObject({
                info: '/hris/userfile/info/' + userfileID,
                browse: '/hris/userfile/download/' + userfileID,
                save: '/hris/userfile/download/' + userfileID + '?save=1'
            });
            continue;
        }

        // term
        html += '<dt>' + key + '</dt>';
        // description
        html += '<dd>';
        if (typeof data[key] == 'object') {
            // nested object
            html += markupObject(data[key]);
        }
        else if (data[key][0] == '/' || 
                 data[key].match &&
                 data[key].match(/^(https?|mailto|ftps?)/i)) {
            // put links inside an <a> tag
            html += '<a href="' + data[key] + '">' + data[key] + '</a>';
        } 
        else {
            // plain text
            html += data[key];
        }
        html += '</dd>';
    }
    html += '</dl>';
    return html;
}


////[appRad] --  setup object definitions here:
var hrisUserfileTestSetup = function(topic, data) 
{

    //// Setup Your Page Data/ Operation Here
    var $widgetDiv = $('#upload-widget-container');
    $widgetDiv.appdev_file_upload({
        urlUpload: "/hris/userfile/upload?attribute_id=0"
    });
    $widgetDiv.on('submit', function(event, data) {
        $('#upload-reset').hide();
    });
    $widgetDiv.on('uploaded', function(event, data) {
        console.log(markupObject(data));
        $('#upload-details').empty();
        $('#upload-details').html(markupObject(data));
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