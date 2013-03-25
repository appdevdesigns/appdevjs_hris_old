
// This is the Resource Definition
var log = AD.Util.Log;
var logDump = AD.Util.LogDump;
var error = AD.Util.Error;
var errorDump = AD.Util.ErrorDump;
var $ = AD.jQuery;
var db = AD.Model.Datastore;
var HRiS= null;       // the shared HRiS code.

var Object = new AD.Resource('hris', 'Object');
module.exports = Object;


var sqlCommands = {
        newTable : 'CREATE TABLE '+AD.Defaults.dbName+'.`[object_table]` ( `[object_pkey]` int(11) unsigned NOT NULL AUTO_INCREMENT, PRIMARY KEY (`[object_pkey]`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8;',
        dropTable: 'ALTER TABLE '+AD.Defaults.dbName+'.`[object_table]` RENAME TO '+AD.Defaults.dbName+'.`[object_table]_deleted` '
}


//.publicLinks() : return an object representing the url definition for this resource
Object.publicLinks = function () {
    return  {
        findAll: { method:'GET',    uri:'/hris/api/object',        params:{}, type:'resource' },
        findOne: { method:'GET',    uri:'/hris/api/object/[id]',   params:{}, type:'resource' },
        create:  { method:'POST',   uri:'/hris/api/object',        params:{}, type:'action' },
        update:  { method:'PUT',    uri:'/hris/api/object/[id]',   params:{}, type:'action' },
        destroy: { method:'DELETE', uri:'/hris/api/object/[id]',   params:{}, type:'action' },
    }
}



//.fieldValidations() : return an object's field validations
Object.fieldValidations = function () {
    return  {
        create:{
            object_key:['exists','notEmpty'],
            object_pkey:['notEmpty'],
            object_table:['notEmpty']
          },
        destroy:{},
        update:{}
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


                //// any provided values can't be ''!
                if (params.object_pkey) params.object_pkey = params.object_pkey.trim();
                if (params.object_table) params.object_table = params.object_table.trim();


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
Object.nextUpdate = Object.update;
Object.update = function (req, res, next) {
    var params = req.aRAD.params;

    //// Only Update the object_key, not pkey or table info!
    delete params.object_pkey;
    delete params.object_table;
    req.aRAD.params = params;

    log(req,'   - prevent update() from modifying pkey & table.');
    Object.nextUpdate(req, res, next);
}


//.destroy() : the operation that performs your .model.destroy(id, params)
//Object.destroy = function (req, res, next) { next();}




///// Model Events:

//.onCreated() : is called each time an instance of Attribute.model is created
Object.onCreated = function (ev, model) {

    var attrs = model.attrs();

    var sql = AD.Util.String.render(sqlCommands.newTable, attrs);

console.log('sql:'+sql);


     db.runSQL(sql,[], function(err, results, fields){
         if (err) {
             console.log(err);
         }
//           AD.Comm.Notification.publish('hris.'+attributeColumn+'.created', data);
//console.log('hey! check it out!');
     });



     //// Now get the object_key and
     var newLinks = AD.Util.Object.clone(HRiS.publicLinks);
     var pkeyField = Object.id;
     for (var l in newLinks) {
         newLinks[l].uri = renderUri(newLinks[l], attrs, pkeyField); //AD.Util.String.render(newLinks[l].uri, attrs);
     }
//console.log('');
//console.log('newLinks:');
//console.log(newLinks);

     ////Register the public site/api
     this.setupSiteAPI(attrs['object_key'], newLinks);

}



//.onUpdated() : is called each time an instance of Attribute.model is created
//Object.onUpdated = function (ev, model) {}


//.onDestroyed() : is called each time an instance of Attribute.model is created
Object.onDestroyed = function (ev, model) {

//console.log('... deleteObject:');


        var attrs = model.attrs();

        //// To prevent data loss ... don't actually drop tables,
        //// 1: Rename Table referenced by this object
        var sql = AD.Util.String.render(sqlCommands.dropTable, attrs);

console.log('sql:'+sql);


         db.runSQL(sql,[], function(err, results, fields){
             if (err) {
                 console.log(err);
             }
//                       AD.Comm.Notification.publish('hris.'+attributeColumn+'.created', data);
// console.log('hey! check it out!');
         });





    //// 2: Remove any relationships referenced by/to this object



    }



///// On Module Load:
//When all our resources are loaded, then use our object model
// to load our object instances.

var initializeCachedObjects = function() {

    var ObjectModel = AD.Model.List['hris.Object'];
    var Attributeset = AD.Model.List['hris.Attributeset'];
    var Attribute = AD.Model.List['hris.Attribute'];

    ObjectModel.findAll({}, function(list){
/*
       for (var i=0; i<list.length;i++) {
           var pkey = list[i].id;
           var val = 'val';//list[i].attr(pkey);
           cachedObjects[list[i][Object.id]] = list[i].attrs();
       }
*/
//console.log('');
//console.log('--------------');
//console.log('cached objects:');
//console.log(cachedObjects);
//console.log('--------------');
//console.log();

       // build obj_id: { attribute_name:'' , .... } list
       var objLookup = {};
       var pkeyLookup = {};
       for (var i=0; i<list.length; i++) {
           objLookup[list[i].object_id] = {};
           pkeyLookup[list[i].object_id] = list[i].object_pkey;
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
                    var pkeyField = pkeyLookup[oID];
                    newLinks[l].uri = renderUri(newLinks[l], attrs, pkeyField); //AD.Util.String.render(newLinks[l].uri, attrs).replace('[id]', '['+pkeyField+']');

                    if (l=='create' || l=='update') {

                        var listParams = objLookup[oID];
                        for (var lp in listParams) {
                            newLinks[l].params[lp] = '['+lp+']';
                        }
                    }
                }
//console.log(newLinks);
                ////Register the public site/api
                Object.setupSiteAPI(attrs['object_key'], newLinks);
                console.log(' ... HRiS : registering defined object :'+attrs['object_key']);
            }
       });

//console.log('');
//console.log('newLinks:');
//console.log(newLinks);

    });
}
Object.setupModuleHub = function() {
    HRiS = this.module.HRiS; // don't create a new instance by require();
    Object.module.hub.subscribe(AD.Const.Notifications.MODULE_READY, initializeCachedObjects);
}



//.resourceKey : the resource identifier to register your public links under:
//eg, a call to /site/api/[app]/[resourceKey]/[action] to return you action link
Object.resourceKey = 'APIObject';





var renderUri = function( link, attributes, pkeyName) {

    return  AD.Util.String.render(link.uri, attributes).replace('[id]', '['+pkeyName+']');
}

