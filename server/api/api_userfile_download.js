
/**
 * @class hris.server.api.Userfile
 * @parent hris.server.api
 * 
 * Performs the action (download) for userfile.
 * @apprad resource:userfile // @appradend (please leave)
 * @apprad action:download // @appradend (please leave)
 * @apprad url: // @appradend
 */


var log = AD.Util.Log;
var logDump = AD.Util.LogDump;
var $ = AD.jQuery;
var permissions = require('../data/UserfilePermissions.js');
var userfilesDir = __appdevPath + '/modules/hris/userfiles';

var ErrorMSG = null;

var hrisUserfileDownload = new AD.App.Service({});
module.exports = hrisUserfileDownload;






////---------------------------------------------------------------------
var hasPermission = function (req, res, next) {
    // Verify the current viewer has permission to perform this action.


        
    var permission = 'hris.userfile.download';
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
var getFile = function(req, res, next) {
    AD.Model.List['hris.Userfile'].findOne({
        userfile_id: req.param('id')
    })
    .then(function(model) {
        req.hrisUserfile.model = model;
        next();
    })
    .fail(function(err) {
        AD.Comm.Service.sendError(req, res, err);
        logDump(req, 'Unable to find hris2_userfile entry');
    });
}


////---------------------------------------------------------------------
var verifyParams = function (req, res, next) {
    // Make sure all required parameters are given before continuing.
	
    log(req, '   - verifyParams(): checking parameters');
    
    req.hrisUserfile = {
        model: null
    };
    
    var listRequiredParams = {
//          'test':['exists','notEmpty','isNumeric'],
//          'test2':['notEmpty']
    }; // each param is a string
    AD.Util.Service.validateParamsExpress(req, res, next, listRequiredParams);
};



////---------------------------------------------------------------------
var sendHeaders = function(req, res, next) {
    
    // Force download if requested
    if (parseInt(req.param('save'))) {
        res.setHeader(
            'Content-Disposition', 
            'attachment; filename="' + req.hrisUserfile.model.userfile_name + '"'
        );
    }
    
    // Set the file's mime type
    if (req.hrisUserfile.model.userfile_mimetype) {
        res.setHeader(
            'Content-Type',
            req.hrisUserfile.model.userfile_mimetype
        );
    }
    
    next();
    
}



////---------------------------------------------------------------------
var sendFile = function(req, res, next) {

    log(req, "Sending file [" + req.hrisUserfile.model.userfile_name + "]");

    // Incrementally send chunks of the file as it is being read from disk
    var stream = fs.ReadStream(
        userfilesDir
        + '/'
        + req.hrisUserfile.model.userfile_path
    );
    stream.on('data', function(data) {
        res.write(data);
    });
    stream.on('error', function(err) {
        res.end();
        log(req, 'Error sending file');
        logDump(req, err);
    });
    stream.on('end', function() {
        res.end();
        next();
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
    download: { method:'GET', uri:'/hris/userfile/download/[id]', params:{}, type:'action' }, 
}

var serviceURL = publicLinks.download.uri.replace('[id]',':id');


var userfileStack = [
        AD.App.Page.serviceStack,  // authenticates viewer, and prepares req.aRAD obj.
        hasPermission,		       // make sure we have permission to access this
        verifyParams,			   // make sure all required params are given
        getFile,
        sendHeaders,
        sendFile
    ];
        

hrisUserfileDownload.setup = function( app ) {

    ErrorMSG = this.module.Error;
    
	////---------------------------------------------------------------------
	app.get(serviceURL, userfileStack, function(req, res, next) {
	
	    // By the time we get here, all the processing has taken place.
	    logDump(req, 'finished /'+serviceURL+' (download) ');
	    
	});
	
	
/*
    ////Register the public site/api
    this.setupSiteAPI('userfile', publicLinks);
*/

} // end setup()

