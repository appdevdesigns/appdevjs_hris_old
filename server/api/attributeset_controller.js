// Attributeset : name of the Resource
// hris : the name of the application


// This is the Resource Definition
var log = AD.Util.Log;
var logDump = AD.Util.LogDump;
var error = AD.Util.Error;
var errorDump = AD.Util.ErrorDump;
var $ = AD.jQuery;
var db = AD.Model.Datastore;

var Attributeset = new AD.Resource('hris', 'Attributeset');
module.exports = Attributeset;



//.publicLinks() : return an object representing the url definition for this resource
Attributeset.publicLinks = function () {
    return  {
        findAll: { method:'GET',    uri:'/hris/api/attributeset',        params:{}, type:'resource' },
        findOne: { method:'GET',    uri:'/hris/api/attributeset/[id]',   params:{}, type:'resource' },
        create:  { method:'POST',   uri:'/hris/api/attributeset',        params:{}, type:'action' },
        update:  { method:'PUT',    uri:'/hris/api/attributeset/[id]',   params:{}, type:'action' },
        destroy: { method:'DELETE', uri:'/hris/api/attributeset/[id]',   params:{}, type:'action' },
    }
}



//.fieldValidations() : return an object's field validations
Attributeset.fieldValidations = function () {
    return  {
        create:{
            object_id:['exists','notEmpty','isNumeric'],
            type_id:['exists', 'notEmpty', 'isNumeric'],
            attributeset_key:['exists', 'notEmpty'],
            attributeset_label:['exists', 'notEmpty']
          },
        destroy:{},
        update:{}
    }

}


// .model  : which model are you associated with
//Attributeset.model = AD.Model.List['hris.Attributeset'];



// .find() : the operation that performs your .model.findAll(params)
//           store your results in : res.aRAD.result = [];
//Attributeset.find = function (req, res, next) { next();}



//.create() : the operation that performs your .model.create(params)
//            store your results in : res.aRAD.result = {id:newID}



//.update() : the operation that performs your .model.update(id, params)
//          store any results in : res.aRAD.result = {};
Attributeset.nextUpdate = Attributeset.update;
Attributeset.update = function (req, res, next) {

    //// Only the following parameters are allowed to be modified:
    //// type_id,  attributeset_label
    //// ---->  Keep id: gets passed on for determining which attributeset_id is updated
    var params = req.aRAD.params;
    var possibleUpdateParams = {
            id:'',
            type_id:'',
            attributeset_label:''
    }
    var newUpdateParams = {}

    for (var u in possibleUpdateParams) {

        if (typeof params[u] != 'undefined') {
            newUpdateParams[u] = params[u];
        }
    }

    req.aRAD.params = newUpdateParams;

    Attributeset.nextUpdate(req, res, next);
}


//.destroy() : the operation that performs your .model.destroy(id, params)
Attributeset.nextDestroy = Attributeset.destroy;
Attributeset.destroy = function (req, res, next) {

    var params = req.aRAD.params;

    ///// NOTE: Don't destroy an Attributeset if it has sub Attributes defined

    // find all Attributes associated with this Attributeset
    var Attribute = AD.Model.List['hris.Attribute'];
    var found = Attribute.findAll({attributeset_id:params.attributeset_id || params.id });
    $.when(found).then(function(list) {

        if (list.length == 0) {

            Attributeset.nextDestroy(req, res, next);

        } else {

            var msg = 'attributeset not empty';
            var code = AD.Const.HTTP.ERROR_METHODNOTALLOWED;

            log(req, '     '+msg);
            log(req, '      ->:'+params.attribute_column);
            var err = { errorID:1, errorMSG: msg };
            AD.Comm.Service.sendError(req, res, err, code);
        }
    })
        // if there aren't any, the continue to delete

        // else error!
}




///// Model Events:

//.onCreated() : is called each time an instance of Attribute.model is created
//Attributeset.onCreated = function (ev, modelInstance) {}


//.onUpdated() : is called each time an instance of Attribute.model is created
//Attributeset.onUpdated = function (ev, modelInstance) {}


//.onDestroyed() : is called each time an instance of Attribute.model is created
//Attributeset.onDestroyed = function (ev, modelInstance) {}



//.resourceKey : the resource identifier to register your public links under:
//eg, a call to /site/api/[app]/[resourceKey]/[action] to return you action link
Attributeset.resourceKey = 'APIAttributeset';

