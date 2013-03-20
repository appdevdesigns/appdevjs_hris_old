/**
 * @class hris
 * @parent Installed_Modules
 * 
 * ###hris Module
 * 
 * This module <insert short description>
 * 
 */
//required to separate comment blocks for documentjs, please do not remove
var __filler;

/**
 * @class hris.server
 * @parent hris
 * 
 * ##hris server
 * 
 * hris server side 
 */
//required to separate comment blocks for documentjs, please do not remove
var __filler;

/**
 * @class hris.server.api
 * @parent hris.server
 * 
 * ##hris server side apis
 * 
 * hris server side apis
 */
//required to separate comment blocks for documentjs, please do not remove
var __filler;

/**
 * @class hris.server.models
 * @parent hris.server
 * 
 * ##hris server side models
 * 
 * hris server side models
 */
//required to separate comment blocks for documentjs, please do not remove
var __filler;

/**
 * @class hris.server.module_apis
 * @parent hris.server
 * 
 * ##hris server side module apis
 * 
 * hris server side module apis
 */
//required to separate comment blocks for documentjs, please do not remove
var __filler;

/**
 * @class hris.client
 * @parent hris
 * 
 * ##hris client
 * 
 * hris client side
 */
//required to separate comment blocks for documentjs, please do not remove
var __filler;

/**
 * @class hris.client.pages
 * @parent hris.client
 * 
 * ##hris client side pages
 * 
 * hris client side pages
 */
//required to separate comment blocks for documentjs, please do not remove
var __filler;

/**
 * @class hris.titanium
 * @parent hris
 * 
 * ##hris titanium
 * 
 * hris titanium
 */
//required to separate comment blocks for documentjs, please do not remove
var __filler;

/**
 * @class hris.server.Object
 * @parent hris.server
 * 
 * ##HRiS Object operations
 * 
 * The different operations for working with an instance of a defined object
 * in HRiS.
 */
//required to separate comment blocks for documentjs, please do not remove
var __filler;
 

// Replace These Tags:
//  hris  : <-- the name of this module (lowercase)
//  Hris  : <-- the name of this module (uppercase)
 
var log = AD.Util.Log;
var $ = AD.jQuery;


////
//// Hris Module
////

var hrisModule = new AD.App.Module({
    nameModule: 'hris',
    pathModule: __dirname,
/*
    // change the default paths like this:
    pathPages:    __dirname + '/web/pages',
    pathServerModels:  __dirname + '/models/node',
    pathClientModels:  __dirname + '/models/client',
    pathModuleScripts: __dirname + '/data/scripts',
    pathModuleCSS:     __dirname + '/data/css'
*/
/*
    // If you want to override the default notification hub settings:
    hub: {
          wildcard: true, // should the event emitter use wildcards.
          delimiter: '.', // the delimiter used to segment namespaces.
          maxListeners: 0, // the max number of listeners that can be assigned to an event (defautl:10;  0:unlimited).
    }
*/
    
    });
    
hrisModule.createRoutes();
var mI = hrisModule.initialize();  // mI == Module Initialization Done
$.when(mI).then(function(){
    // do any post initialization setup instructions here.
    // by the time you get here, all module resources are loaded.
});


module.exports = hrisModule;
exports.version = 1;  // v1 of our AD.App.Module Definition


var app = hrisModule.app;

// Don't want this to be Global, but all server side services can access this.
hrisModule.HRiS = require(__dirname + '/server/data/HRiS.js');



var errorLabels = null;
var labelsLoaded = AD.Lang.labelsForPath('/hris/errors');
$.when(labelsLoaded)
    .then(function(labels) {
        errorLabels = labels;
//console.log('hris error labels!:');
//console.log(errorLabels);

    });

var errorMessages = {
        'OBJ_NOT_FOUND':      { id:1,  key:'[hris.error.objNotFound]'},
        'ERR_TABLE_ACCESS':   { id:2,  key:'[hris.error.tableAccess]'},
        'ERR_NO_PERMISSION':  { id:3,  key:'[site.common.noPermission]'},
        'ERR_FILTERED_IDS' :  { id:4,  key:'[hris.error.filteredIDs]'},
        'ERR_NON_CACHED_OBJ': { id:5,  key:'[hris.error.nonCachedObj]'},
        'ERR_PACKAGING_OBJ':  { id:6,  key:'[hris.error.packagingObj]' },
        
        'ERR_OBJ_CREATE':     { id:10,  key:'[hris.error.objCreate]' },
        'ERR_OBJ_UPDATE':     { id:11,  key:'[hris.error.objUpdate]' },
        'ERR_OBJ_NO_PARAM':   { id:12,  key:'[hris.error.noParams]' },
        
        'ERR_FIND':           { id:20,  key:'[hris.error.find]' },  // error finding desired information
        'ERR_CREATE':         { id:21,  key:'[hris.error.create]'},  // error creating object 
        'ERR_UPDATE':         { id:22,  key:'[hirs.error.update]' }, // error updating object
        'ERR_DESTROY':        { id:23,  key:'[hris.error.destroy]' } // error destorying object
  
}

hrisModule.Error = function (req, res, key, param, code) {

    if (typeof code == 'undefined') {
        if (typeof param == 'number') {
            
            // Error called with no param ... eg:
            // Error(req, res, key, code);
            code = param;
            param = {};
            
        } else {
            
            // hmmmm ... just send a default 400
            code = AD.Const.HTTP.ERROR_CLIENT; // default to 400: client fault ... why not?
        }
    }
    
    if (typeof errorMessages[key] == 'undefined') {
        
        // key not found in our defined error messages:
        
        // assume param is the error data to send
        AD.Comm.Service.sendError(req, res, param, code );
        
        
    } else {
        
        var err = errorMessages[key];
        var viewer = AD.Viewer.currentViewer(req);
//console.log(viewer);

        var label = errorLabels.label(err.key, viewer.languageKey);
        
        // service response
        var errorData = { errorID:err.id, errorMSG:label, errorKey:key, data:param };
        AD.Comm.Service.sendError(req, res, errorData, code ); 
        
    }

    
}



//add our Error routine to HRiS:
hrisModule.HRiS.errorMsg = hrisModule.Error;




/*
////
//// setup any Hris specific routes here
////

### If you want to override the default Route Handling then
### remove hrisModule.createRoutes(); and uncomment this section.  
### Make your changes here:

////
//// On any /hris/* route, we make sure our Client Models are loaded:
//// 
app.get('/init/hris/*', function(req, res, next) {

        log(req,' init/' + hrisModule.nameModule + '/*  : adding model dependencies.');

        AD.App.Page.addJavascripts( req, hrisModule.moduleScripts );
        AD.App.Page.addJavascripts( req, hrisModule.listModelPaths );

        next();
});





////
//// Return any Module defined resources
////
app.get('/hris/data/:resourcePath', function(req, res, next) {

    log(req,' /' + hrisModule.nameModule + '/data/ being processed.');

    var parts = req.url.split('/'+hrisModule.nameModule+'/');
    var urlParts = parts[1].split('?');
    var path = urlParts[0]; // without any additional params

    res.sendfile( hrisModule.pathModule+'/'+path);
});







### If you want to change/prevent any of the automatic directory 
### scanning, then remove the hrisModule.initialize()  and 
### uncomment these lines :




//// 
//// Scan any sub interfaces to gather their routes
////

hrisModule.loadInterfaces();



////
//// The Model objects 
////
//// Load the Server side model objects to handle incoming model actions.
////

hrisModule.loadModels();
exports.listModels=hrisModule.listModels;


////
//// 
//// Load the shared scripts that need to be used on each interface.

hrisModule.loadModuleScripts();



//// Load the services associated with this Module.
hrisModule.loadServices();



//// Load any shared CSS files defined by this Module.
hrisModule.loadModuleCSS();

*/