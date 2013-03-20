
/**
 * @class hris.server.api.Object
 * @parent hris.server.api
 * 
 * Performs the action (find) for a given HRiSv2 api resource.
 * 
 * @apprad resource:Object // @appradend (please leave)
 * @apprad action:find // @appradend (please leave)
 * @apprad url: // @appradend
 */


var log = AD.Util.Log;
var logDump = AD.Util.LogDump;
var error = AD.Util.Error;
var errorDump = AD.Util.ErrorDump;
var $ = AD.jQuery;

var ErrorMSG = null;

var hrisObjectFind = new AD.App.Service({});
module.exports = hrisObjectFind;


var ObjConst = require('./api_object_constants.js');




////---------------------------------------------------------------------
var hasPermission = function (req, res, next) {
    // Verify the current viewer has permission to perform this action.

    var objKey = req.aRAD.objKey;
    
    var permission = 'hris.'+objKey+'.find';
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
var packageParams = function (req, res, next) {
    // Look for a provided 'id' value that should become a filter in our
    // findAll operation.  This is basically what a findOne() is: a findAll
    // with the id set.
    // 
    // when we are done, we should have req.query[primaryKey] = id if 
    
    log(req, '   - packageParams(): checking for :id ');
    
    var id = req.param('id');
    if (undefined !== id) {
        // we've been given an object id
        // stuff this value in req.query so it filters our results:
        log(req, '     id['+id+'] found. This is actually a findOne..');
        
        var Object = req.aRAD.Object;
        
        // id is the name of the primaryKey field
        req.query[Object.id] = parseInt(id);
console.log(req.query);
    }
    
    
    next();
    
};



////---------------------------------------------------------------------
var getResults = function (req, res, next) {
    // actually run the Model.findAll() method.
    
    
    var ModelName = req.aRAD.modelName;
    
    log(req,'   - '+ModelName+'.findAll()');
    
    var Object = AD.Model.List['hris.'+ModelName];
    
    var params = {};
    for (var q in req.query) {
        params[q] = req.query[q];
    }
    for (var b in req.body) {
        params[b] = req.body[b];
    }
    
    Object.findAll(params, function(list) {
        
        // ok, list is an array of object instances ... what we want are 
        // a list of simple json 'key':'value' pairs to send back:
        var simpleList = [];
        for (var i=0; i<list.length; i++){
            simpleList.push( list[i].attrs());
        }
        
        log(req,'     # results:'+ simpleList.length);
        req.aRAD.results = simpleList;
        next();
        
    }, function(err) {
        error(req, '     error finding results:');
        errorDump(req, err);
        ErrorMSG(req, res, 'ERR_FIND', AD.Const.HTTP.ERROR_SERVER);  // 500 : our end?

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
       findAll: { method:'GET',    uri:'/hris/api/[objectKey]',      params:{}, type:'action' }, 
       findOne: { method:'GET',    uri:'/hris/api/[objectKey]/[id]', params:{}, type:'action' }, 
}

var urlFindAll = publicLinks.findAll.uri.replace('[id]',':id').replace('[objectKey]', ':objKey');
var urlFindOne = publicLinks.findOne.uri.replace('[id]',':id').replace('[objectKey]', ':objKey');


var attributesetStack = [
        AD.App.Page.serviceStack,  // authenticates viewer, and prepares req.aRAD obj.
        ObjConst.findObject,       // find out which object was specified on the url
        hasPermission,		       // make sure we have permission to access this
        verifyParams,			   // make sure all required params are given
        packageParams,             // this is a shared step, looking for a :id value and making it a filter
        getResults,                // actually run the lookup
//        step2, 	               // get a list of all Viewers
//        step3		               // update each viewer's entry
    ];
        

hrisObjectFind.setup = function( app ) {

    ErrorMSG = this.module.Error;
    
	////---------------------------------------------------------------------
	app.get(urlFindAll, attributesetStack, function(req, res, next) {
	    // test using: http://localhost:8088/hris/api/attributeset
	
	
	    // By the time we get here, all the processing has taken place.
	    logDump(req, 'finished /'+urlFindAll+' (find) ');
	    
	    
	    // send a success message
	    AD.Comm.Service.sendSuccess(req, res, req.aRAD.results );  
	    
	});
	
	
	////---------------------------------------------------------------------
    app.get(urlFindOne, attributesetStack, function(req, res, next) {
        // test using: http://localhost:8088/hris/api/attributeset
    
    
        // By the time we get here, all the processing has taken place.
        logDump(req, 'finished /'+urlFindOne+' (find) ');
        
        
        // send a success message
        AD.Comm.Service.sendSuccess(req, res, req.aRAD.results );  
        
    });
	
	
/*
    ////Register the public site/api
    this.setupSiteAPI('attributeset', publicLinks);
*/

} // end setup()

