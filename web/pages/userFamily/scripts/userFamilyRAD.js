//// Template Replace:
//   hris     : the name of this page's module: (lowercase)
//   userFamily  : the name of this page :  (lowercase)
//   UserFamily  : the name of this page :  (Uppercase)

/**
 *  
 *  @class hris.client.pages.UserFamily.RADSetup
 *  @parent hris.client.pages.UserFamily
 *  
 *  appRAD generated setup script for the UserFamily Page container. 
 *
 *  The job of this code is to make sure the HTML DOM content required
 *  for the hrisUserFamilySetup() is generated before it is called.
 */



// Keep all variables and functions inside an encapsulated scope
(function() {

    ////[appRad] --  setup object definitions here:
    var hrisUserFamilyRADSetup = function() {
        // This will be called after all the javascript libraries are loaded
        // using the steal.js dependency manager.
        // 
        // Use this area to add any additional DOM setups that need to be in
        // place before the hrisUserFamilySetup() is called.
        
        
        
        // 1) Setup Our On Page Labels
        //      - scan for any currently embedded labels
        //      - fire off any label load requests queued up by 
        //        our labels.js script.
        var initProcess = AD.Lang.Labels.initLabels();


        //// IDEA:
        // 2) Load the Site Settings for use by our application:
        // AD.Settings.loadSettings({ key:value, key2:value2, ... keyN,valueN });
        // usage: AD.Settings['defaultURL']; // returns str: '/page/temp/viewer'
        
        
        //// IDEA:
        // Load a Viewer object for our application
        // Viewer object is responsible for reporting what 
        // preferences/permissions the current viewer of the page has.
        // AD.Viewer = new Viewer({});
        // usage:  AD.Viewer.hasPermission('canXlate');  // returns True/False

        
        // when our Initialization Process is complete, then pass control 
        // to the programmer's setup() function.
        $.when(initProcess).done(function () {
        
            // keep this last:
            // publish a notification it's time to run hrisUserFamilySetup()
            AD.Comm.Notification.publish("ad.hris.userFamily.setup", {});
            
            // note: since anyone can publish a key, we want to prevent 
            // running this a second time:
            AD.Comm.Notification.unsubscribe(subscriptionID);
        });
        
    }
    var subscriptionID = AD.Comm.Notification.subscribe('ad.hris.userFamily.radsetup',hrisUserFamilyRADSetup);


    $(document).ready(function () {

        // by the time this is called, we should have all our HTML loaded
        // from the server, but no guarantee that all our javascript
        // includes are loaded.
        //

    }); // end ready()

}) ();