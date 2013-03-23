
/**
 * @class hris.server.Object.update
 * @parent hris.server.Object
 *
 * Performs the update action for a defined object in the system.
 *
 * @apprad resource:object // @appradend (please leave)
 * @apprad action:update // @appradend (please leave)
 * @apprad url: // @appradend
 */


var log = AD.Util.Log;
var logDump = AD.Util.LogDump;
var $ = AD.jQuery;

var HRiS = null;
var ErrorMSG = null;

var hrisObjectCreate = new AD.App.Service({});
module.exports = hrisObjectCreate;


var hrisHub = null;



////---------------------------------------------------------------------
var hasPermission = function (req, res, next) {
    // Verify the current viewer has permission to perform this action.

if (!AD.Defaults.authRequired) next();
else {
    var objectKey = req.aRAD.objectKey;
//    var tInfo = req.aRAD.tableInfo;

    var permission = 'hris.'+objectKey+'.update';
    var viewer = AD.Viewer.currentViewer(req);

    log(req, '   - hasPermission(): checking for : '+permission);

    // if viewer has 'hris.person.findAll' action/permission
    if (viewer.hasTask(permission)) {

        log(req, '     viewer ['+viewer.guid()+'] has permission: '+permission);
        next();

    } else {

        errorDump(req, '     viewer failed permission check!');
        ErrorMSG(req, res, 'ERR_NO_PERMISSION', AD.Const.HTTP.ERROR_FORBIDDEN);  // 403 : you don't have permission

    } // end if
}
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
var postNotifications = function (req, res, next) {
    // Send any notifications for creating this object:

    log(req, '   - postNotifications(): ');

    var objectKey = req.aRAD.objectKey;
    var tInfo = req.aRAD.tableInfo;

    var notification = 'hris.object.'+objectKey+'.updated';

    var value = {};
    value[tInfo.pKey] = req.aRAD.id;

    if (hrisHub)  {
        hrisHub.publish(notification, value);
        log(req, '     key: '+notification);
    } else {
        error(req, '     hub not defined');
    }

    next();
};




//these are our publicly available /site/api/hris/object  links:
//note: in below definitions, any value in [] is a templated value replaced with the instances value for that attribute: [id] = obj.id;
//note: params are defined like:  params:{ requiredParam1:'[requiredParam1]', requiredParam2: '[requiredParam2]'}
var publicLinks = {
//     findAll: { method:'GET',    uri:'/hris/[object_key]', params:{}, type:'resource' },
//     findOne: { method:'GET',    uri:'/hris/[object_key]/[id]', params:{}, type:'resource' },
//     create:  { method:'POST',   uri:'/hris/[object_key]', params:{}, type:'action' },
//     update:  { method:'PUT',    uri:'/hris/[object_key]/[id]', params:{}, type:'action' },
//     destroy: { method:'DELETE', uri:'/hris/[object_key]/[id]', params:{}, type:'action' },
     update:  { method:'PUT',   uri:'/hris/[object_key]/[id]', params:{}, type:'action' },
}

var serviceURL = publicLinks.update.uri.replace('[id]',':id').replace('[object_key]', ':hrisObjKey');




hrisObjectCreate.setup = function( app ) {

    HRiS = this.module.HRiS;
    hrisHub = this.module.hub;
    ErrorMSG = this.module.Error;


    var objectStack = [
           AD.App.Page.serviceStack,  // authenticates viewer, and prepares req.aRAD obj.
           HRiS.Express.whichObject,  // figure out which object this url is about
           hasPermission,             // make sure we have permission to access this
           verifyParams,              // make sure all required params are given
           HRiS.Express.updateObject, // perform the actual db update operation
           postNotifications,         // post any notifications for this object

//           relatedObjs,               // any operations due to related objects?
//           changedValues,             // find any changed values that need to be reported back
           ];


	////---------------------------------------------------------------------
	app.put(serviceURL, objectStack, function(req, res, next) {
//	app.get('/hris/update/:hrisObjKey/:id', objectStack, function(req, res, next) {
	    // test using: http://localhost:8088/hris/[serviceName]/[actionName]

	    var objectKey = req.aRAD.objectKey;
        var tInfo = req.aRAD.tableInfo;

	    // By the time we get here, all the processing has taken place.
	    logDump(req, 'finished '+serviceURL.replace(':hrisObjKey', objectKey)+' (update) ');



	    // on a successful update operation: we need to send back any new/changed values
	    // that are not contained in the instance (like a last_modified field, etc...).



	    // send a success message
	    var successStub = { };
//	    successStub[tInfo.pKey] = req.aRAD.id;
	    AD.Comm.Service.sendSuccess(req, res, successStub );

	});

/*
    ////Register the public site/api
    this.setupSiteAPI('object', publicLinks);
*/

} // end setup()


//// TODO: object.update() validation checks on parameters.
////  - LOOKUP types need to verify the given value is correct. (is one of the possible lookup values)

