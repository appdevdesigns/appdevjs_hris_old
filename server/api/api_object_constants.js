
/**
 * @class hris.server.HRiS
 * @parent hris.server
 *
 * A collection of shared resources to help manage our Object interfaces.
 */
var Object = {};


var log = AD.Util.Log;
var logDump = AD.Util.LogDump;
var error = AD.Util.Error;
var errorDump = AD.Util.ErrorDump;


//what are the acceptable object keys that can be used here:
//format:  [object_key] : 'Model Name'
Object.acceptableKeys = {
        object:'Object',
        attributeset:'Attributeset',
        attribute:'Attribute',
        relationship:'Relationship'
}



////---------------------------------------------------------------------
Object.findObject = function (req, res, next) {
    // Find out which object we are asking to work with:

    log(req, '   - findObject(): checking valid url ');


    var objKey = req.param('objKey');

    if ((typeof objKey == 'undefined')
            || (typeof Object.acceptableKeys[objKey] == 'undefined')) {

        errorDump(req, '     invalid object key ['+objKey+']');
        Object.ErrorMSG(req, res, 'OBJ_NOT_FOUND', AD.Const.HTTP.ERROR_CLIENT);


    } else {

        log(req, '     objectKey:'+objKey);
        log(req, '     modelName:'+Object.acceptableKeys[objKey]);

        req.aRAD.objKey = objKey;
        req.aRAD.modelName = Object.acceptableKeys[objKey];
        req.aRAD.Object = AD.Model.List['hris.'+req.aRAD.modelName];

        // check for findOne/update/destroy :id
        var id = req.param('id');
        if (typeof id != 'undefined') {
            // we've been given an object id
            // stuff this value in req.query so it filters our results:
            log(req, '     id:'+id);
            req.query[req.aRAD.Object.id] = parseInt(id);
            req.aRAD.id = id;
        }
//console.log(req.aRAD);
        next();
    }

}




module.exports = Object;



