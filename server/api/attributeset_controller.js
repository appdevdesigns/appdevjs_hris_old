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




// .model  : which model are you associated with
//Attributeset.model = AD.Model.List['hris.Attributeset'];



// .find() : the operation that performs your .model.findAll(params)
//           store your results in : res.aRAD.result = [];
//Attributeset.find = function (req, res, next) { next();}



//.create() : the operation that performs your .model.create(params)
//            store your results in : res.aRAD.result = {id:newID}



//.update() : the operation that performs your .model.update(id, params)
//          store any results in : res.aRAD.result = {};
//Attributeset.update = function (req, res, next) { next();}



//.destroy() : the operation that performs your .model.destroy(id, params)
//Attributeset.destroy = function (req, res, next) { next();}




///// Model Events:

//.onCreated() : is called each time an instance of Attribute.model is created
//Attribute.onCreated = function (ev, modelInstance) {}


//.onUpdated() : is called each time an instance of Attribute.model is created
//Attribute.onUpdated = function (ev, modelInstance) {}


//.onDestroyed() : is called each time an instance of Attribute.model is created
//Attribute.onDestroyed = function (ev, modelInstance) {}

