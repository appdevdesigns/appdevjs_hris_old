
/**
 * @class hris.server.api.Object.destroy
 * @parent hris.server.api.Object
 * 
 * Performs the action (destroy) for a given HRiSv2 api resource.
 * 
 * URL: DELETE /hris/api/:objKey/:id
 * 
 * @apprad resource:Object // @appradend (please leave)
 * @apprad action:destroy // @appradend (please leave)
 * @apprad url: // @appradend
 */


var log = AD.Util.Log;
var logDump = AD.Util.LogDump;
var error = AD.Util.Error;
var errorDump = AD.Util.ErrorDump;

var $ = AD.jQuery;

var ErrorMSG = null;

var hrisObjectDestroy = new AD.App.Service({});
module.exports = hrisObjectDestroy;


var ObjConst = require('./api_object_constants.js');



////---------------------------------------------------------------------
var hasPermission = function (req, res, next) {
    // Verify the current viewer has permission to perform this action.

    var objKey = req.aRAD.objKey;
    
    var permission = 'hris.'+objKey+'.destroy';
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
var destroy = function (req, res, next) {
    // actually run the Model.findAll() method.
    
    
    var ModelName = req.aRAD.modelName;
    
    log(req,'   - '+ModelName+'.destroy()');
    
    var Object = req.aRAD.Object;
    var id = req.aRAD.id;
    Object.destroy(id, function() {

        log(req,'     completed');
        next();
        
    }, function(err) {
        error(req, '     error destroying objects:');
        errorDump(req, err);
        ErrorMSG(req, res, 'ERR_DESTROY', AD.Const.HTTP.ERROR_SERVER);  // 500 : our end?

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
       destroy: { method:'DELETE', uri:'/hris/api/[objectKey]/[id]',  params:{}, type:'action' }, 
}

var urlDestroy = publicLinks.destroy.uri.replace('[id]',':id').replace('[objectKey]', ':objKey');


var destroyStack = [
        AD.App.Page.serviceStack,  // authenticates viewer, and prepares req.aRAD obj.
        ObjConst.findObject,       // find out which object was specified on the url
        hasPermission,		       // make sure we have permission to access this
        verifyParams,			   // make sure all required params are given
        destroy,                   // actually run object's destroy method
//        step2, 	               // get a list of all Viewers
//        step3		               // destroy each viewer's entry
    ];
        

hrisObjectDestroy.setup = function( app ) {

    ErrorMSG = this.module.Error;
    ObjConst.ErrorMSG = ErrorMSG; // this only needs to happen 1x ... right?
    
	////---------------------------------------------------------------------
	  app.delete(urlDestroy, destroyStack, function(req, res, next) {
//app.get('/hris/apii/destroy/:objKey/:id', destroyStack, function(req, res, next) {
	    // test using: http://localhost:8088/hris/api/attributeset/1
	
	
	    // By the time we get here, all the processing has taken place.
	    logDump(req, 'finished /'+urlDestroy+' (destroy) ');
	    
	    
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

