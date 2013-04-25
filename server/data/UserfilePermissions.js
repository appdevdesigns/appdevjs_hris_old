
/**
 * This class helps to determine whether a given viewer / person should have
 * the ability to access an uploaded userfile.
 */

var log = AD.Util.Log;
var logDump = AD.Util.LogDump;
var error = AD.Util.Error;
var errorDump = AD.Util.ErrorDump;

var db = AD.Model.Datastore;
var $ = AD.jQuery;

var UserfilePermissions = {};

module.exports = UserfilePermissions;


