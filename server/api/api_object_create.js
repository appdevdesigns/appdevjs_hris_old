
/**
 * @class hris.server.api.Object
 * @parent hris.server.api
 *
 * Performs the action (create) for a given HRiSv2 api resource.
 *
 * @apprad resource:Object // @appradend (please leave)
 * @apprad action:create // @appradend (please leave)
 * @apprad url: // @appradend
 */


var log = AD.Util.Log;
var logDump = AD.Util.LogDump;
var error = AD.Util.Error;
var errorDump = AD.Util.ErrorDump;

var $ = AD.jQuery;

var ErrorMSG = null;

var hrisObjectCreate = new AD.App.Service({});
module.exports = hrisObjectCreate;


var ObjConst = require('./api_object_constants.js');



////---------------------------------------------------------------------
var hasPermission = function (req, res, next) {
    // Verify the current viewer has permission to perform this action.

if (!AD.Defaults.authRequired) next();
else {

    var objKey = req.aRAD.objKey;

    var permission = 'hris.'+objKey+'.create';
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

}



////---------------------------------------------------------------------
var verifyParams = function (req, res, next) {
  // Make sure all required parameters are given before continuing.

  log(req, '   - verifyParams(): checking parameters');


  var listRequiredParams = {
    //          'test':['exists','notEmpty','isNumeric'],
    //          'test2':['notEmpty']
  }; // each param is a string

  var objKey = req.aRAD.objKey;
  switch(objKey) {
    case 'object':
      listRequiredParams = {
      object_key:['exists','notEmpty'],
      object_pkey:['notEmpty'],
      object_table:['notEmpty']
    }
    break;
    case 'attribute':
      listRequiredParams = {
      attributeset_id: ['exists'],
      attribute_column: ['exists'],
      attribute_datatype: ['exists'],
      attribute_label: ['exists']
    }
    break;

  }

  console.log(listRequiredParams);
  console.log(req.params);
  console.log(req.body);

  console.log('param():');
  console.log(req.param('object_key'));


  AD.Util.Service.validateParamsExpress(req, res, next, listRequiredParams);
};



////---------------------------------------------------------------------
var create = function (req, res, next) {
  // actually run the Model.create() method.


  var ModelName = req.aRAD.modelName;

  log(req,'   - '+ModelName+'.create()');

  var Object = req.aRAD.Object;
  var params = {};
  for (var q in req.query) {
    params[q] = req.query[q];
  }
  for (var b in req.body) {
    params[b] = req.body[b];
  }

  $.when(Object.existing(params)).then(function(existing) {
    if (!existing) {
      Object.create(params, function(id) {

        log(req,'     new id:'+ id);
        req.aRAD.id = id;
        next();

      }, function(err) {
        error(req, '     error finding results:');
        errorDump(req, err);
        ErrorMSG(req, res, 'ERR_CREATE', AD.Const.HTTP.ERROR_SERVER);  // 500 : our end?

      });
    } else {
      req.aRAD.id = existing[Object.id];
      next();
    }
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
  create:  { method:'POST',   uri:'/hris/api/[objectKey]',       params:{}, type:'action' },
}

var urlCreate = publicLinks.create.uri.replace('[id]',':id').replace('[objectKey]', ':objKey');


var createStack = [
  AD.App.Page.serviceStack,  // authenticates viewer, and prepares req.aRAD obj.
  ObjConst.findObject,       // find out which object was specified on the url
  hasPermission,		       // make sure we have permission to access this
  verifyParams,			   // make sure all required params are given
  create,                    // actually run object's create method
  //        step2, 	               // get a list of all Viewers
  //        step3		               // update each viewer's entry
];


hrisObjectCreate.setup = function( app ) {

  ErrorMSG = this.module.Error;
  ObjConst.ErrorMSG = ErrorMSG; // this only needs to happen 1x ... right?

  ////---------------------------------------------------------------------
  app.post(urlCreate, createStack, function(req, res, next) {
    //app.get('/hris/apii/create/:objKey', createStack, function(req, res, next) {
    // test using: http://localhost:8088/hris/api/attributeset


    // By the time we get here, all the processing has taken place.
    logDump(req, 'finished /'+urlCreate+' (create) ');


    var Object = req.aRAD.Object;

    var returnPkt = {};
    returnPkt[Object.id] = req.aRAD.id;

    // send a success message
    AD.Comm.Service.sendSuccess(req, res, returnPkt );

  });




  /*
  ////Register the public site/api
  this.setupSiteAPI('attributeset', publicLinks);
  */

} // end setup()

