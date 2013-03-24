
// This is the Resource Definition
var log = AD.Util.Log;
var logDump = AD.Util.LogDump;
var error = AD.Util.Error;
var errorDump = AD.Util.ErrorDump;
var $ = AD.jQuery;
var db = AD.Model.Datastore;

var Object = new AD.Resource('hris', 'Object');
module.exports = Object;



//.publicLinks() : return an object representing the url definition for this resource
/*
Object.publicLinks = function () {
    return  {
        findAll: { method:'GET',    uri:'/[app]/[resource]',        params:{}, type:'resource' },
        findOne: { method:'GET',    uri:'/[app]/[resource]/[id]',   params:{}, type:'resource' },
        create:  { method:'POST',   uri:'/[app]/[resource]',        params:{}, type:'action' },
        update:  { method:'PUT',    uri:'/[app]/[resource]/[id]',   params:{}, type:'action' },
        destroy: { method:'DELETE', uri:'/[app]/[resource]/[id]',   params:{}, type:'action' },
    }
}
*/


//.fieldValidations() : return an object's field validations
Object.fieldValidations = function () {
    return  {
        object_key:['exists','notEmpty'],
        object_pkey:['notEmpty'],
        object_table:['notEmpty']
      }
}



// .model  : which model are you associated with
//Object.model = AD.Model.List['hris.Object'];



// .find() : the operation that performs your .model.findAll(params)
//           store your results in : res.aRAD.result = [];
//Object.find = function (req, res, next) { next();}


// no duplicate keys!
var existing = function(params) {
    var dfd = $.Deferred();

    var key= { object_key:params.object_key };
    var found = Object.model.findOne(key);
    $.when(found)
        .then(function(obj){
console.log(' .. obj found');
            if (obj) dfd.resolve(obj);
            else dfd.resolve(false);
        })
        .fail(function(err) {
            dfd.reject(err);
        });
    return dfd;
}


//.create() : the operation that performs your .model.create(params)
//            store your results in : res.aRAD.result = {id:newID}
Object.createNext = Object.create;
Object.create = function (req, res, next) {

    var params = req.aRAD.params;

    $.when(existing(params)).then(function(obj) {
            if (!obj) {

                // assign pkey and table values if not already provided:
                params.object_pkey  = params.object_pkey || params.object_key+'_id';
                params.object_table = params.object_table || 'hris_'+params.object_key;
                req.aRAD.params = params;

                Object.createNext(req, res, next);

            } else {
                var rID = {};
                rID[Object.model.id] = obj[Object.model.id];
                res.aRAD.results = rID;
                next();
            }
      });
}




//.update() : the operation that performs your .model.update(id, params)
//          store any results in : res.aRAD.result = {};
//Object.update = function (req, res, next) { next();}
Object.oldUpdate = Object.create;
Object.update = function (req, res, next) {
    var params = req.aRAD.params;
    delete params.object_pkey;
    delete params.object_table;
    req.aRAD.params = params;

    log(req,'   - prevent update() from modifying pkey & table.');
    Object.oldUpdate(req, res, next);
}


//.destroy() : the operation that performs your .model.destroy(id, params)
//Object.destroy = function (req, res, next) { next();}




///// Model Events:

//.onCreated() : is called each time an instance of Attribute.model is created
//Attribute.onCreated = function (ev, modelInstance) {}


//.onUpdated() : is called each time an instance of Attribute.model is created
//Attribute.onUpdated = function (ev, modelInstance) {}


//.onDestroyed() : is called each time an instance of Attribute.model is created
//Attribute.onDestroyed = function (ev, modelInstance) {}

