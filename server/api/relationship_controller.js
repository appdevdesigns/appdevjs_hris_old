// Relationship : name of the Resource
// hris : the name of the application


// This is the Resource Definition
var log = AD.Util.Log;
var logDump = AD.Util.LogDump;
var error = AD.Util.Error;
var errorDump = AD.Util.ErrorDump;
var $ = AD.jQuery;
var db = AD.Model.Datastore;

var Relationship = new AD.Resource('hris', 'Relationship');
module.exports = Relationship;



//.publicLinks() : return an object representing the url definition for this resource
/*
Relationship.publicLinks = function () {
    return  {
        findAll: { method:'GET',    uri:'/hris/relationship',        params:{}, type:'resource' },
        findOne: { method:'GET',    uri:'/hris/relationship/[id]',   params:{}, type:'resource' },
        create:  { method:'POST',   uri:'/hris/relationship',        params:{}, type:'action' },
        update:  { method:'PUT',    uri:'/hris/relationship/[id]',   params:{}, type:'action' },
        destroy: { method:'DELETE', uri:'/hris/relationship/[id]',   params:{}, type:'action' },
    }
}
*/


//.fieldValidations() : return an object's field validations
/*
Relationship.fieldValidations = function () {
    return  {
//        object_key:['exists','notEmpty'],
//        object_pkey:['notEmpty'],
//        object_table:['notEmpty']
      }
}
*/



// .model  : which model are you associated with
//Relationship.model = AD.Model.List['hris.Relationship'];



// .find() : the operation that performs your .model.findAll(params)
//           store your results in : res.aRAD.result = [];
//Relationship.find = function (req, res, next) { next();}



//.create() : the operation that performs your .model.create(params)
//            store your results in : res.aRAD.result = {id:newID}
//Relationship.createNext = Relationship.create;
//Relationship.create = function (req, res, next) { Relationship.createNext(req, res, next); }


//.update() : the operation that performs your .model.update(id, params)
//          store any results in : res.aRAD.result = {};
//Relationship.update = function (req, res, next) { next();}



//.destroy() : the operation that performs your .model.destroy(id, params)
//Relationship.destroy = function (req, res, next) { next();}



///// Model Events:

//.onCreated() : is called each time an instance of Attribute.model is created
//Relationship.onCreated = function (ev, modelInstance) {}


//.onUpdated() : is called each time an instance of Attribute.model is created
//Relationship.onUpdated = function (ev, modelInstance) {}


//.onDestroyed() : is called each time an instance of Attribute.model is created
//Relationship.onDestroyed = function (ev, modelInstance) {}
