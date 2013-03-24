
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
//Object.onCreated = function (ev, modelInstance) {}


//.onUpdated() : is called each time an instance of Attribute.model is created
//Object.onUpdated = function (ev, modelInstance) {}


//.onDestroyed() : is called each time an instance of Attribute.model is created
//Object.onDestroyed = function (ev, modelInstance) {}




///// On Module Load:
//When all our resources are loaded, then use our object model
// to load our object instances.
/*
var initializeCachedObjects = function() {

    var Object = AD.Model.List['hris.Object'];
    var Attributeset = AD.Model.List['hris.Attributeset'];
    var Attribute = AD.Model.List['hris.Attribute'];

    Object.findAll({}, function(list){

       for (var i=0; i<list.length;i++) {
           var pkey = list[i].id;
           var val = 'val';//list[i].attr(pkey);
           cachedObjects[list[i][Object.id]] = list[i].attrs();
       }

//console.log('');
//console.log('--------------');
//console.log('cached objects:');
//console.log(cachedObjects);
//console.log('--------------');
//console.log();

       // build obj_id: { attribute_name:'' , .... } list
       var objLookup = {};
       for (var i=0; i<list.length; i++) {
           objLookup[list[i].object_id] = {};
       }

       var foundAS = Attributeset.findAll({});
       var foundAtt = Attribute.findAll({});
       $.when(foundAS, foundAtt). then(function(listAS, listATT) {

           //
           // compile objID:ASID
           var oAS = {};
           for (var as=0; as < listAS.length; as++) {
//console.log( listAS[as]);
               var oID = listAS[as].object_id;

               var asID = listAS[as].attributeset_id;

               if ('undefined' == typeof oAS[asID])  oAS[asID] = {};
               oAS[asID]=oID;
           }
//console.log( 'oAS:');
//console.log(oAS);
//console.log('---');
//console.log(objLookup);
            for (var at=0; at< listATT.length; at++){

                var asID = listATT[at].attributeset_id;
                var oID = oAS[asID];
                var atID = listATT[at].attribute_id;
                var atName = listATT[at].attribute_column;
//console.log( 'asID['+asID+'] oID['+oID+'] atID['+atID+'] atName['+atName+']');

                if ('undefined' == typeof objLookup[oID]) objLookup[oID] = {};

                objLookup[oID][atName]= atID;
            }
//console.log(objLookup);


            //// now announce all the public API for those defined objects:
            // for each object
            for (var i=0; i<list.length; i++) {
                var attrs = list[i].attrs();
                var oID = attrs.object_id;

                // clone the link with object substitutions:
                var newLinks = AD.Util.Object.clone(HRiS.publicLinks);
                for (var l in newLinks) {
                    newLinks[l].uri = AD.Util.String.render(newLinks[l].uri, attrs);

                    if (l=='create' || l=='update') {

                        var listParams = objLookup[oID];
                        for (var lp in listParams) {
                            newLinks[l].params[lp] = '['+lp+']';
                        }
                    }
                }
console.log(newLinks);
                ////Register the public site/api
                hrisObject.setupSiteAPI(attrs['object_key'], newLinks);
                console.log(' ... HRiS : registering defined object :'+attrs['object_key']);
            }
       });




//console.log('');
//console.log('newLinks:');
//console.log(newLinks);



    });
}
Object.setupModuleHub = function() {
    Object.module.hub.subscribe(AD.Const.Notifications.MODULE_READY, initializeCachedObjects);
}
*/