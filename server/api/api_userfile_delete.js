
/**
 * @class hris.server.api.Userfile
 * @parent hris.server.api
 * 
 * Performs the action (delete) for userfile.
 * @apprad resource:userfile // @appradend (please leave)
 * @apprad action:delete // @appradend (please leave)
 * @apprad url: // @appradend
 */


var log = AD.Util.Log;
var logDump = AD.Util.LogDump;
var $ = AD.jQuery;

var ErrorMSG = null;

var hrisUserfileDelete = new AD.App.Service({});
module.exports = hrisUserfileDelete;






////---------------------------------------------------------------------
var hasPermission = function (req, res, next) {
    // Verify the current viewer has permission to perform this action.

        
    var permission = 'hris.userfile.delete';
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

    req.hrisUserfile = {
        model: null,
        path: null
    };
    
    var listRequiredParams = {
//          'test':['exists','notEmpty','isNumeric'],
//          'test2':['notEmpty']
    }; // each param is a string
    AD.Util.Service.validateParamsExpress(req, res, next, listRequiredParams);
};


////---------------------------------------------------------------------
var findFile = function (req, res, next) {
    
    AD.Model.List['hris.Userfile'].findOne({
        userfile_id: req.param('id')
    })
    .then(function(model) {
        if (model) {
            
            req.hrisUserfile.model = model;
            req.hrisUserfile.path = model.userfile_path;
            next();
            
        } else {

            AD.Comm.Service.sendError(req, res, {
                errorMSG: "File not found"
            }, 200);
            logDump(req, "File not found");

        }
    })
    .fail(function(err) {
        AD.Comm.Service.sendError(req, res, err, 200);
        logDump(req, err);
    });

}


////---------------------------------------------------------------------
var deleteEntry = function (req, res, next) {

    req.hrisUserfile.model.destroy()
    .then(function() {
        log(req, 'Deleted userfile DB entry');
        next();
    })
    .fail(function(err) {
        AD.Comm.Service.sendError(req, res, err, 200);
        logDump(req, err);
    });
    
}


////---------------------------------------------------------------------
var deleteFile = function (req, res, next) {

    fs.unlink(req.hrisUserfile.path, function(err) {
        if (err) {
            AD.Comm.Service.sendError(req, res, err, 200);
            logDump(req, err);
        } else {
            log(req, 'Deleted file ['+ req.hrisUserfile.path +']');
            next();
        }
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
    delete: { method:'DELETE', uri:'/hris/userfile/delete/[id]', params:{}, type:'action' }, 
}

var serviceURL = publicLinks.delete.uri.replace('[id]',':id');


var userfileStack = [
        AD.App.Page.serviceStack,  // authenticates viewer, and prepares req.aRAD obj.
        hasPermission,		       // make sure we have permission to access this
        verifyParams,			   // make sure all required params are given
        findFile,
        deleteEntry,
        deleteFile
    ];
        

hrisUserfileDelete.setup = function( app ) {

    ErrorMSG = this.module.Error;
    
	////---------------------------------------------------------------------
	app.delete(serviceURL, userfileStack, function(req, res, next) {
	
	    // By the time we get here, all the processing has taken place.
	    logDump(req, 'finished /'+serviceURL+' (delete) ');
	    
	    // send a success message
	    var result = {
	            message:'done.' 
	    }
	    AD.Comm.Service.sendSuccess(req, res, result );  
	    
	});
	
	
/*
    ////Register the public site/api
    this.setupSiteAPI('userfile', publicLinks);
*/

} // end setup()

