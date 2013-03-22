//// Template Replace:
//   hris     : the name of this interface's module: (lowercase)
//   person       : the name of this service :  (lowercase)
//   Person   : the name of this service :  (Uppercase)
//   Create	  : the action for this service : (lowercase) (optional).
//    : a list of required parameters for this service ('param1', 'param2', 'param3')

/**
 * @class hris.server.module_apis.person
 * @parent hris.server.module_apis
 * 
 * Performs the actions for [resource].
 * @apprad resource:[resource] // @appradend (please leave)
 * @apprad action:create // @appradend (please leave)
 * @apprad url:[url] // @appradend
 */


////
//// hrisPerson
////
//// Performs the actions for [resource].
////
////    /[resource] 
////
////


var log = AD.Util.Log;
var logDump = AD.Util.LogDump;
var $ = AD.jQuery;


////Create our Validation object
//var Validation = require(__appdevPath+'/server/objects/validation.js');
//var validation = new Validation();


var hrisPersonCreate = new AD.App.Service({});
module.exports = hrisPersonCreate;






////---------------------------------------------------------------------
var hasPermission = function (req, res, next) {
    // Verify the current viewer has permission to perform this action.


    // if viewer has 'hris.person.create' action/permission
        next();
    // else
        // var errorData = { errorID:55, errorMSG:'No Permission' }
        // AD.Comm.Service.sendError(req, res, errorData, AD.Const.HTTP.ERROR_FORBIDDEN ); // 403 : you don't have permission
    // end if

}



////---------------------------------------------------------------------
var verifyParams = function (req, res, next) {
    // Make sure all required parameters are given before continuing.
	
	var listRequiredParams = []; // each param is a string
	AD.Util.Service.verifyParams(req, res, next, listRequiredParams);
};



// these are our publicly available /site/api/hris/person  links:
// note: in below definitions, any value in [] is a templated value replaced with the instances value for that attribute: [id] = obj.id;
// note: params are defined like:  params:{ requiredParam1:'[requiredParam1]', requiredParam2: '[requiredParam2]'}
var publicLinks = {
//        findAll: { method:'GET',    uri:'/hris/persons', params:{}, type:'resource' },
//        findOne: { method:'GET',    uri:'/hris/person/[id]', params:{}, type:'resource' },
//        create:  { method:'POST',   uri:'/hris/person', params:{}, type:'action' },
//        update:  { method:'PUT',    uri:'/hris/person/[id]', params:{module:'hris', page: '[page]'}, type:'action' },
//        destroy: { method:'DELETE', uri:'/hris/person/[id]', params:{}, type:'action' },
        create:  { method:'POST',   uri:'/hris/person', params:{}, type:'action' }, 
}

var serviceURL = publicLinks.create.uri.replace('[id]',':id');

var personStack = [
        AD.App.Page.serviceStack,  // authenticates viewer, and prepares req.aRAD obj.
        hasPermission,		       // make sure we have permission to access this
        verifyParams,			   // make sure all required params are given
//        step2, 	               // get a list of all Viewers
//        step3		               // update each viewer's entry
    ];
        

hrisPersonCreate.setup = function( app ) {

	
	////---------------------------------------------------------------------
	app.post(serviceURL, personStack, function(req, res, next) {
	    // test using: http://localhost:8088/hris/person
	
	
	    // By the time we get here, all the processing has taken place.
	    logDump(req, 'finished /hris/person (create)');
	    
	    
	    // send a success message
	    var successStub = {
	            message:'done.' 
	    }
	    AD.Comm.Service.sendSuccess(req, res, successStub );  
	    
	});
	

    ////Register the public site/api
    this.setupSiteAPI('person', publicLinks);
} // end setup()

