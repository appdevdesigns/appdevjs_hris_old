
/**
 * @class hris.server.api.Object
 * @parent hris.server.api
 *
 * Performs the action (label_field) for object.
 * @apprad resource:object // @appradend (please leave)
 * @apprad action:label_field // @appradend (please leave)
 * @apprad url: // @appradend
 */


var log = AD.Util.Log;
var logDump = AD.Util.LogDump;
var error = AD.Util.Error;
var errorDump = AD.Util.ErrorDump;
var db = AD.Model.Datastore.DB;
var $ = AD.jQuery;

var ErrorMSG = null;

var hrisObjectLabelField = new AD.App.Service({});
module.exports = hrisObjectLabelField;






////---------------------------------------------------------------------
var hasPermission = function (req, res, next) {
    // Verify the current viewer has permission to perform this action.



    var permission = 'hris.object.label_field';
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



var fetchData = function(req, res, next) {

    var objectID = req.params['id'];
    var dbName = AD.Defaults.dbName;
    
    // Find all the text attributes of the given object type
    // with a one-to-one relation. These are the potential label key
    // columns.
    var sql = " \
        SELECT a.attribute_column \
        FROM "+dbName+".hris2_object AS o \
        JOIN "+dbName+".hris2_attributeset AS s ON o.object_id = s.object_id \
        JOIN "+dbName+".hris2_attributes AS a ON s.attributeset_id = a.attributeset_id \
        WHERE o.object_id = ? \
        AND s.attributeset_relation = ? \
        AND a.attribute_dataType = ? \
    ";
    
    db.query(sql, [objectID, 'one', 'TEXT'], function(err, list) {
        if (err) {
            log(req, "SQL error in fetchData()");
            log(req, err);
        }
        
        var attributes = [];
        for (var i=0; i<list.length; i++) {
            attributes.push(list[i]['attribute_column']);
        }
        
        req.aRAD.attributeList = attributes;
        next();
    });

};


var parseData = function(req, res, next) {
    
    // Find the first attribute that looks like a label field

    req.aRAD.attributeList.sort(function(a, b) {
        if (a.match(/label/i)) return -1;
        if (b.match(/label/i)) return 1;
        if (a.match(/name/i)) return -1;
        if (b.match(/name/i)) return 1;
        return 0;
    });

    req.aRAD.labelField = req.aRAD.attributeList[0] || null;
    next();
}



//these are our publicly available /site/api/hris/object  links:
//note: in below definitions, any value in [] is a templated value replaced with the instances value for that attribute: [id] = obj.id;
//note: params are defined like:  params:{ requiredParam1:'[requiredParam1]', requiredParam2: '[requiredParam2]'}
var publicLinks = {
//     findAll: { method:'GET',    uri:'/hris/objects',     params:{}, type:'resource' },
//     findOne: { method:'GET',    uri:'/hris/object/[id]', params:{}, type:'resource' },
//     create:  { method:'POST',   uri:'/hris/object',      params:{}, type:'action' },
//     update:  { method:'PUT',    uri:'/hris/object/[id]', params:{}, type:'action' },
//     destroy: { method:'DELETE', uri:'/hris/object/[id]', params:{}, type:'action' },
    label_field: { method:'GET', uri:'/hris/object/label_field/[id]', params:{}, type:'action' },
}

var serviceURL = publicLinks.label_field.uri.replace('[id]',':id');


var objectStack = [
    AD.App.Page.serviceStack,  // authenticates viewer, and prepares req.aRAD obj.
    hasPermission,             // make sure we have permission to access this
    verifyParams,              // make sure all required params are given
    fetchData,
    parseData
    ];


hrisObjectLabelField.setup = function( app ) {

    ErrorMSG = this.module.Error;

    ////---------------------------------------------------------------------
    app.get(serviceURL, objectStack, function(req, res, next) {
        // test using: http://localhost:8088/hris/[serviceName]/[actionName]


        // By the time we get here, all the processing has taken place.
        logDump(req, 'finished /'+serviceURL+' (label_field) ');


        // send a success message
        AD.Comm.Service.sendSuccess(req, res, req.aRAD.labelField);

    });


/*
    ////Register the public site/api
    this.setupSiteAPI('object', publicLinks);
*/

} // end setup()

