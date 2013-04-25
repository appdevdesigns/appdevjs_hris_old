
/**
 * @class hris.server.api.Userfile
 * @parent hris.server.api
 * 
 * Performs the action (info) for userfile.
 * @apprad resource:userfile // @appradend (please leave)
 * @apprad action:info // @appradend (please leave)
 * @apprad url: // @appradend
 */


var log = AD.Util.Log;
var logDump = AD.Util.LogDump;
var $ = AD.jQuery;
var permissions = require('../data/UserfilePermissions.js');
var downloadPath = '/hris/userfile/download/';

var ErrorMSG = null;

var hrisUserfileInfo = new AD.App.Service({});
module.exports = hrisUserfileInfo;






////---------------------------------------------------------------------
var hasPermission = function (req, res, next) {
    // Verify the current viewer has permission to perform this action.
        
    var permission = 'hris.userfile.info';
    var viewer = AD.Viewer.currentViewer(req);
    
    log(req, '   - hasPermission(): checking for : '+permission);
    
    return next();

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
var fetchInfo = function(req, res, next) {
    // The userfile_id that was passed in through the querystring
    var userfileID = req.param('id');

    AD.Model.List['hris.Userfile'].findOne({
        userfile_id: userfileID
    })
    .then(function(model) {
    
        if (!model) {
            AD.Comm.Service.sendError(req, res, {
                erorrMSG: "userfile not found"
            }, 200);
            return;
        }
    
        console.log(model);
        
        var info = {
            name: model.userfile_name,
            type: model.userfile_mimetype,
            date: model.userfile_date,
            url: downloadPath + model.userfile_id,
            save_url: downloadPath + model.userfile_id + '?save=1'
        }
        AD.Comm.Service.sendSuccess(req, res, info);
        next();
    })
    .fail(function(err) {
        AD.Comm.Service.sendError(req, res, err, 200);
        logDump(req, 'Unable to find hris2_userfile entry');
    });

}



//these are our publicly available /site/api/hris/userfile  links:
//note: in below definitions, any value in [] is a templated value replaced with the instances value for that attribute: [id] = obj.id;
//note: params are defined like:  params:{ requiredParam1:'[requiredParam1]', requiredParam2: '[requiredParam2]'}
var publicLinks = {
//     findAll: { method:'GET',    uri:'/hris/userfiles',     params:{}, type:'resource' },
//     findOne: { method:'GET',    uri:'/hris/userfile/[id]', params:{}, type:'resource' },
//     create:  { method:'POST',   uri:'/hris/userfile',      params:{}, type:'action' },
//     update:  { method:'PUT',    uri:'/hris/userfile/[id]', params:{}, type:'action' },
//     destroy: { method:'DELETE', uri:'/hris/userfile/[id]', params:{}, type:'action' },
    info: { method:'GET', uri:'/hris/userfile/info/[id]', params:{}, type:'action' }, 
}

var serviceURL = publicLinks.info.uri.replace('[id]',':id');


var userfileStack = [
        AD.App.Page.serviceStack,  // authenticates viewer, and prepares req.aRAD obj.
        hasPermission,		       // make sure we have permission to access this
        verifyParams,			   // make sure all required params are given
        fetchInfo,
    ];
        

hrisUserfileInfo.setup = function( app ) {

    ErrorMSG = this.module.Error;
    
	////---------------------------------------------------------------------
	app.get(serviceURL, userfileStack, function(req, res, next) {
	
	    // By the time we get here, all the processing has taken place.
	    logDump(req, 'finished /'+serviceURL+' (info) ');
	    
	});
	
	
/*
    ////Register the public site/api
    this.setupSiteAPI('userfile', publicLinks);
*/

} // end setup()

