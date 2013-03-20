
/**
 * @class hris.server.api.Object
 * @parent hris.server.api
 * 
 * Performs the action (update) for a given HRiSv2 api resource.
 * 
 * @apprad resource:Object // @appradend (please leave)
 * @apprad action:update // @appradend (please leave)
 * @apprad url: // @appradend
 */


var log = AD.Util.Log;
var logDump = AD.Util.LogDump;
var error = AD.Util.Error;
var errorDump = AD.Util.ErrorDump;

var $ = AD.jQuery;

var ErrorMSG = null;

var hrisObjectUpdate = new AD.App.Service({});
module.exports = hrisObjectUpdate;


var ObjConst = require('./api_object_constants.js');



////---------------------------------------------------------------------
var hasPermission = function (req, res, next) {
    // Verify the current viewer has permission to perform this action.

    var objKey = req.aRAD.objKey;
    
    var permission = 'hris.'+objKey+'.update';
    var viewer = AD.Viewer.currentViewer(req);
    
    log(req, '   - hasPermission(): checking for : '+permission);

    // if viewer has 'hris.person.findAll' action/permission
    if (viewer.hasTask(permission)) {
        
        log(req, '     viewer has permission: '+permission);
        next();
        
    } else {
        
        errorDump(req, '     viewer failed permission check!');
        ErrorMSG(req, res, 'ERR_NO_PERMISSION', AD.Const.HTTP.ERROR_FORBIDDEN);  // 403 : you don't have permission
    
    } // end if

}



////---------------------------------------------------------------------
var verifyParams = function (req, res, next) {
    // Make sure all required parameters are given before continuing.
	
    log(req, '   - verifyParams(): checking parameters');
    
    var listRequiredParams = {
//          'test':['exists','notEmpty','isNumeric'],
//          'test2':['notEmpty']
    }; // each param is a string
    AD.Util.Service.validateParamsExpress(req, res, next, listRequiredParams);
};



////---------------------------------------------------------------------
var update = function (req, res, next) {
    // actually run the Model.findAll() method.
    
    
    var ModelName = req.aRAD.modelName;
    
    log(req,'   - '+ModelName+'.update()');
    
    var Object = req.aRAD.Object;
    var id = req.aRAD.id;
    
    // gather params:
    var params = {};
    for (var q in req.query) {
        params[q] = req.query[q];
    }
    for (var b in req.body) {
        params[b] = req.body[b];
    }
    
    Object.update(id, params, function() {

        log(req,'     completed');
        next();
        
    }, function(err) {
        error(req, '     error updating objects:');
        errorDump(req, err);
        ErrorMSG(req, res, 'ERR_UPDATE', AD.Const.HTTP.ERROR_SERVER);  // 500 : our end?

    });
    
}


//these are our publicly available /site/api/hris/attributeset  links:
//note: in below definitions, any value in [] is a templated value replaced with the instances value for that attribute: [id] = obj.id;
//note: params are defined like:  params:{ requiredParam1:'[requiredParam1]', requiredParam2: '[requiredParam2]'}
var publicLinks = {
//     findAll: { method:'GET',    uri:'/hris/api/attributeset',      params:{}, type:'resource' },
//     findOne: { method:'GET',    uri:'/hris/api/attributeset/[id]', params:{}, type:'resource' },
//     create:  { method:'POST',   uri:'/hris/api/attributeset',      params:{}, type:'action' },
//     update:  { method:'PUT',    uri:'/hris/api/attributeset/[id]', params:{}, type:'action' },
//     destroy: { method:'DELETE', uri:'/hris/api/attributeset/[id]', params:{}, type:'action' },
       update:  { method:'PUT',    uri:'/hris/api/[objectKey]/[id]',  params:{}, type:'action' }, 
}

var urlCreate = publicLinks.update.uri.replace('[id]',':id').replace('[objectKey]', ':objKey');


var updateStack = [
        AD.App.Page.serviceStack,  // authenticates viewer, and prepares req.aRAD obj.
        ObjConst.findObject,       // find out which object was specified on the url
        hasPermission,		       // make sure we have permission to access this
        verifyParams,			   // make sure all required params are given
        update,                    // actually run object's update method
//        step2, 	               // get a list of all Viewers
//        step3		               // update each viewer's entry
    ];
        

hrisObjectUpdate.setup = function( app ) {

    ErrorMSG = this.module.Error;
    ObjConst.ErrorMSG = ErrorMSG; // this only needs to happen 1x ... right?
    
	////---------------------------------------------------------------------
	app.put(urlCreate, updateStack, function(req, res, next) {
//app.get('/hris/apii/update/:objKey/:id', updateStack, function(req, res, next) {
	    // test using: http://localhost:8088/hris/api/attributeset
	
	
	    // By the time we get here, all the processing has taken place.
	    logDump(req, 'finished /'+urlCreate+' (update) ');
	    
	    
	    var Object = req.aRAD.Object;
	    
	    var returnPkt = {};
	    
	    // send a success message
	    AD.Comm.Service.sendSuccess(req, res, returnPkt );  
	    
	});
	
	
	
	
/*
    ////Register the public site/api
    this.setupSiteAPI('attributeset', publicLinks);
*/

} // end setup()

