
/**
 * @class hris.server.subscriptions.Object
 * @parent hris.server.subscriptions
 *
 * A subscriptions that respond to different Object events in the system.
 *
 */
var log = AD.Util.Log;
var logDump = AD.Util.LogDump;
var error = AD.Util.Error;

var db = AD.Model.Datastore;
var $ = AD.jQuery;



var hrisObject = new AD.App.Service({});
module.exports = hrisObject;


var hrisHub = null;   // Module's Notification Center (note: be sure not to use this until setup() is called)
var HRiS= null;       // the shared HRiS code.

var sqlCommands = {
        newTable : 'CREATE TABLE '+AD.Defaults.dbName+'.`[object_table]` ( `[object_pkey]` int(11) unsigned NOT NULL AUTO_INCREMENT, PRIMARY KEY (`[object_pkey]`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8;',
        dropTable: 'DROP TABLE IF EXISTS '+AD.Defaults.dbName+'.`[object_table]`'
}

//-----------------------------------------------------------------------------
hrisObject.setup = function() {
    // setup any handlers, subscriptions, etc... that need to have passed in
    // private resources from the Module:
    //  this.hub = the module's Notification Hub
    //  this.listModels = the list of Model objects in the current Module
    //

    hrisHub = this.module.hub;  // <-- should have a reference to our Module
    HRiS = this.module.HRiS;
//console.log('started hrisObject hub');


    /**
     * @function hris.Object.created
     *
     * This service will make sure the DB table associated with this Object is
     * physically created.
     *
     * @param {string} event the notification key this matched
     * @param {obj} data the primary key id of the newly created Object( { id:1 } )
     */
    //  data: { id:# }
    var newObject = function(event, data) {

    	console.log('newObject');

    	var Object = AD.Model.List['hris.Object'];


    	//// 1: Create the new table

        Object.findOne({id:data.id}, function(object) {

            var attrs = object.attrs();

            //// OK, make sure this object is cached for us:
            cachedObjects[object[Object.id]] = object.attrs();


            // sql:
            // CREATE TABLE `hris2_attributes` (
            //   `attribute_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
            //   PRIMARY KEY (`attribute_id`)
            // ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

            var sql = AD.Util.String.render(sqlCommands.newTable, object.attrs());

// console.log('sql:'+sql);


             db.runSQL(sql,[], function(err, results, fields){
            	 if (err) {
                     console.log(err);
                 }
//                	 AD.Comm.Notification.publish('hris.'+attributeColumn+'.created', data);
// console.log('hey! check it out!');
             });



             //// Now get the object_key and
             var newLinks = AD.Util.Object.clone(HRiS.publicLinks);
             for (var l in newLinks) {
                 newLinks[l].uri = AD.Util.String.render(newLinks[l].uri, attrs);
             }
//console.log('');
//console.log('newLinks:');
//console.log(newLinks);

             ////Register the public site/api
             hrisObject.setupSiteAPI(attrs['object_key'], newLinks);
        });

    }
    hrisHub.subscribe('hris.Object.created', newObject);



    /**
     * @function hris.Object.destroyed
     *
     * This service will make sure the DB table associated with this Object is
     * physically removed.
     *
     * @param {string} event the notification key this matched
     * @param {obj} data the primary key id of the newly created Object( { id:1 } )
     */
    // data is { id:#, guid:'string' }
    var deleteObject = function(event, data) {

console.log('... deleteObject:');

        //// lookup our Object from the cache
        //// since it is already destroyed by now:
        if ('undefined' != typeof cachedObjects[data.id]) {

            var object = cachedObjects[data.id];
            delete cachedObjects[data.id];  // remove this cache entry



            //// 1: Drop Table referenced by this object
            var sql = AD.Util.String.render(sqlCommands.dropTable, object);

console.log('sql:'+sql);


             db.runSQL(sql,[], function(err, results, fields){
                 if (err) {
                     console.log(err);
                 }
//                   AD.Comm.Notification.publish('hris.'+attributeColumn+'.created', data);
// console.log('hey! check it out!');
             });





        //// 2: Remove any relationships referenced by/to this object



        } else {

            /// Odd ... where did this reference come from?
            error('sub_Object.js: deleteObject(): object id['+data.id+'] not found!');
        }

    }
    hrisHub.subscribe('hris.Object.destroyed', deleteObject);




    var updateObject = function(event, data) {

        // check for changes in table/primary key???
    }
    hrisHub.subscribe('hris.Object.updated', updateObject)




    ////  Manage our Object Cache tracking

    // When all our resources are loaded, then use our object model
    // to load our object instances.
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
    hrisHub.subscribe(AD.Const.Notifications.MODULE_READY, initializeCachedObjects);


} // end setup()


//// LEFT OFF:
//// since not able to lookup deleted object, we need to maintain
//// a cached copy of the object values. { id:{obj} }.  Then lookup and
//// remove those entries when deleted.

var cachedObjects = {
        // id: { obj attrs }
};
