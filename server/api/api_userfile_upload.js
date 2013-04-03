
/**
 * @class hris.server.api.Userfile
 * @parent hris.server.api
 * 
 * Performs the action (upload) for userfile.
 * @apprad resource:userfile // @appradend (please leave)
 * @apprad action:upload // @appradend (please leave)
 * @apprad url: // @appradend
 *
 *
 * POST /hris/userfile/upload?attribute_id=[id]
 *
 */


var log = AD.Util.Log;
var logDump = AD.Util.LogDump;
var $ = AD.jQuery;
var path = require('path');
var crypto = require('crypto');
var userfilesDir = __appdevPath + '/modules/hris/userfiles';

var ErrorMSG = null;

var hrisUserfileUpload = new AD.App.Service({});
module.exports = hrisUserfileUpload;






////---------------------------------------------------------------------
var hasPermission = function (req, res, next) {
    // Verify the current viewer has permission to perform this action.

    var permission = 'hris.userfile.upload';
    var viewer = AD.Viewer.currentViewer(req);
    
    log(req, '   - hasPermission(): checking for : '+permission);
    
    return next();

    // if viewer has 'hris.person.findAll' action/permission
    if (viewer.hasTask(permission)) {
        
        log(req, '     viewer has permission: '+permission);
        next();
        
    } else {
        
        logDump(req, '     viewer failed permission check!');
        ErrorMSG(req, res, 'ERR_NO_PERMISSION', AD.Const.HTTP.ERROR_FORBIDDEN);  // 403 : you don't have permission
    
    } // end if

}



////---------------------------------------------------------------------
var verifyParams = function (req, res, next) {
    // Make sure all required parameters are given before continuing.
	
    log(req, '   - verifyParams(): checking parameters');
    
    log(req, req.files);
    
    // Make sure req.files exists
    if (!req.files) {
        logDump(req, 'No uploaded files found');
        AD.Comm.Service.sendError(req, res, {
            errorMSG: "No file was uploaded?"
        }, 200);
        return;
    }
    
    // Establish basic file properties
    for (var idx in req.files) {
        
        var file = req.files[idx];
        if (file instanceof Array) {
            file = req.files.files[0];
        }
        req.hrisUserfile = {
            name: file.name,
            srcPath: file.path,
            mimetype: file.type,
            attribute_id: req.param('attribute_id'),
            checksum: '',
            destPath: '',
            writeStream: null,
        }

        // we only support single file uploads
        break;

    }
    
    
    var listRequiredParams = {
//          'test':['exists','notEmpty','isNumeric'],
//          'test2':['notEmpty']
    }; // each param is a string
    AD.Util.Service.validateParamsExpress(req, res, next, listRequiredParams);
};


var prepareDestination = function(req, res, next) {

    // We need to move the uploaded file from the temp folder that Express
    // has stored it in, to the final userfiles folder in HRIS. 
    //
    // Renaming the file is the easiest way, but that won't work if
    // the temp folder is on a different volume/partition from HRIS. So 
    // we copy the file instead.
    //
    // We won't know the final file name until after we finish reading it in
    // and calculating the checksum. So we use a placeholder name first.
    
    var filename = path.basename(req.hrisUserfile.srcPath);
    req.hrisUserfile.destPath = userfilesDir + '/' + filename;
    
    log(req, 'Copying file to [' + req.hrisUserfile.destPath + ']');
    
    // Create the placeholder file
    req.hrisUserfile.writeStream = fs.createWriteStream(req.hrisUserfile.destPath);
    
    next();
}


var processFile = function(req, res, next) {

    log(req, 'Reading in uploaded file');
    var md5 = crypto.createHash('md5');

    // Begin reading the file
    var stream = fs.ReadStream( req.hrisUserfile.srcPath );
    stream.on('data', function(data) {
        // Incrementally update the MD5 hash as we go
        md5.update(data);
        
        // Incrementally write to the destination file
        req.hrisUserfile.writeStream.write(data);
    });
    stream.on('end', function() {
        log(req, 'Finished reading file');
    
        // Generate the final checksum
        req.hrisUserfile.checksum = md5.digest('hex');
        log(req, 'File has checksum [' + req.hrisUserfile.checksum + ']');
        
        // Get current time
        req.hrisUserfile.date = new Date();
        
        // Finish writing to the destination file
        req.hrisUserfile.writeStream.end(function() {
            var finalName = ''
                + req.hrisUserfile.name
                + '-'
                + req.hrisUserfile.checksum
                + '-'
                + req.hrisUserfile.date.valueOf();

            var finalPath = userfilesDir + '/' + finalName;
        
            // Rename the file now that we know the checksum.
            fs.rename(
                req.hrisUserfile.destPath,
                finalPath,
                function() {
                    log(req, 'Renamed file to [' + finalPath + ']');
                
                    // Update the destPath
                    // (we only save the basename)
                    req.hrisUserfile.destPath = finalName;
                    
                    // Delete the original temp file
                    fs.unlink(req.hrisUserfile.srcPath, function() {
                        log(req, 'Deleted temp file');
                    });
                
                    next();
                }
            );
        });

    });
}


var createEntry = function(req, res, next) {
    
    // guid will not be available if authentication is disabled
    var guid = req.aRAD.viewer_globlUserID || null;

    AD.Model.List['hris.Userfile'].create({
        userfile_name: req.hrisUserfile.name,
        userfile_path: req.hrisUserfile.destPath,
        userfile_mimetype: req.hrisUserfile.mimetype,
        userfile_date: AD.Util.Timestamp(),
        attribute_id: req.hrisUserfile.attribute_id,
        viewer_guid: guid
    })
    .then(function(model) {
        log(req, 'Created hris2_userfile entry');
        req.hrisUserfile.model = model;
        next();
    })
    .fail(function(err) {
        AD.Comm.Service.sendError(req, res, err, 200);
        logDump(req, 'Unable to create hris2_userfile entry');
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
    upload: { method:'POST', uri:'/hris/userfile/upload', params:{}, type:'action' }, 
}

var serviceURL = publicLinks.upload.uri.replace('[id]',':id');


var userfileStack = [
        AD.App.Page.serviceStack,  // authenticates viewer, and prepares req.aRAD obj.
        hasPermission,		       // make sure we have permission to access this
        verifyParams,			   // make sure all required params are given
        prepareDestination,
        processFile,
        createEntry
    ];
        

hrisUserfileUpload.setup = function( app ) {

    ErrorMSG = this.module.Error;
    
	////---------------------------------------------------------------------
	app.post(serviceURL, userfileStack, function(req, res, next) {
	
	    // By the time we get here, all the processing has taken place.
	    logDump(req, 'finished /'+serviceURL+' (upload) ');
	    
	    
	    // send a success message
	    AD.Comm.Service.sendSuccess(req, res, req.hrisUserfile.model);  
	    
	});
	
	
/*
    ////Register the public site/api
    this.setupSiteAPI('userfile', publicLinks);
*/

} // end setup()

