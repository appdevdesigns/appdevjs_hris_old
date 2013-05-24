/**
 * @class hris.client.pages.UserfileTest
 * @parent hris.client.pages
 * 
 *  The setup script for the userfileTest Page container. 
 *
 *  The job of this code is to perform all the setup steps on the existing
 *  HTML DOM items now.  Add Events, actions, etc... 
 *
 *  This file will be generated 1x by the RAD tool and then left alone.
 *  It is safe to put all your custom code here.
 */

//// Template Replace:
//   hris     : the name of this page's module: (lowercase)
//   userfileTest  : the name of this page :  (lowercase)
//   UserfileTest  : the name of this page :  (Uppercase)


////
//// UserfileTest
////
//// This is the Page level definition for the UserfileTest page.
////
//// An "page" is usually a new page displayed in the browser, 
//// requiring a full page load.  
////
//// An page is required to load:
////    listJavascripts :  all the javascript files required for this page
////    listCSS : any css files required for this page
////    pathTemplate: the path from the site root to the template file to 
////                  use to render the page content
////    templateData: an object representing all the data to use to render 
////                  the template for this page content



var userfileTestPage = new AD.App.Interface({
    pathPage: __dirname,
/*
    pageStack : [ fn1, fn2, ... , fnN],     // {array} express route compatible functions (see ex at bottom)
    pathModules: __dirname + '/containers',
    pathScripts: __dirname+'/scripts',
    resources:{ bootstrap:false, kendo:false, jqueryui:true },
    themePageStyle: 'empty',
*/
    listWidgets: [ 
// AppRAD: WIDGET DEPENDENCY //    
        'appdev_file_upload'
                 ]
    });
module.exports = userfileTestPage;   

////
//// View Routes
////

var app = userfileTestPage.app;

/*
 * You can override the default setup routine by uncommenting this and 
 * making changes:
 * 
userfileTestPage.setup = function(callback) 
{
    var $ = AD.jQuery;
    var dfd = $.Deferred();

    //// 
    //// Scan any sub containers to gather their routes
    ////
    var dfdContainers = userfileTestPage.loadContainers();
    
    
    //// 
    //// Scan for any services and load them
    ////
    var dfdPages = userfileTestPage.loadServices();
    
    
    // Scan for any .css files registered for this page
    userfileTestPage.loadPageCSS();
    
    // Create our routes : page/css
    userfileTestPage.createRoutes();

    ////
    //// Resolve the deferred when done
    ////
    $.when(dfdContainers, dfdPages).then(function() {
        callback && callback();
        dfd.resolve();
    });
    
    return dfd;
}

*/



/*
 
 // if You need to do additional additions to the data being passed to your userfileTest.ejs view
 // you can do that here:
 

var step1 = function(req, res, next) {
	
	var guid = req.aRAD.viewer.viewer_globalUserID;
    

	// data being passed to your template should be stored in req.aRAD.response.templateData
	req.aRAD.response.templateData['token'] = guid;
	
	// they can be accessed in your template as <%- data.token %>

	next();
}

userfileTestPage.pageStack = [step1];  // make sure this gets called after our page/unitViewer gets loaded:

 */
