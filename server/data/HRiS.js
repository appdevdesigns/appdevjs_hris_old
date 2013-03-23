
/**
 * @class hris.server.HRiS
 * @parent hris.server
 *
 * A collection of shared resources to help manage our Object interfaces.
 */
var HRiS = {};

var log = AD.Util.Log;
var logDump = AD.Util.LogDump;
var error = AD.Util.Error;
var errorDump = AD.Util.ErrorDump;

var db = AD.Model.Datastore;
var $ = AD.jQuery;

module.exports = HRiS;





/**
 * @class hris.server.HRiS.Express
 * @parent hris.server.HRiS
 *
 * Contains a set of common express route functions for use in accessing
 * our defined objects..
 */
HRiS.Express = {};


/**
 * @function createObject
 *
 * Create an object instance.
 *
 * In order for this routine to operate correctly, it expects
 * the following parameters to be defined:
 *
 * * req.aRAD.objectKey : the object_key of the object definition
 * * req.aRAD.tableInfo : the table definition of this object
 *
 * So call this express step after calling the HRiS.Express.whichObject()
 * step.
 *
 * When this step completes, the ID of the new entry will be in req.aRAD.id;
 *
 * @param {obj} req  The express request object
 * @param {obj} res  The express response object
 * @param {fn}  next The express callback function
 */

HRiS.Express.createObject = function (req, res, next) {

    // get object/table definition
    var objectKey = req.aRAD.objectKey;
    var tInfo = req.aRAD.tableInfo;


    //// when creating an object, we only create entries in
    //// the object's direct attributes.

    // get fields by testing each attribute in req.query()
    var params = {};
    for (var a in tInfo.attributes) {

        var attr = tInfo.attributes[a];
        if (attr.rship == 'one') {
            var value = req.param(a);
            if ('undefined' != typeof value) {
                params[a] = value;
            }
        }
    }

    // use our SQL to store info.
    var created = HRiS.Objects.create(objectKey, params);
    $.when(created)
        .then(function(id){

            req.aRAD.id = id;

            // done, so continue on
            next();
        })
        .fail(function(err) {

            errorDump(req, 'error creating object ['+objectKey+'] ...');

            // service response
            HRiS.errorMsg(req, res, 'ERR_OBJ_CREATE', err, AD.Const.HTTP.ERROR_SERVER);

        });
}



/**
 * @function destroyObject
 *
 * Destroy an object instance.
 *
 * In order for this routine to operate correctly, it expects
 * the following parameters to be defined:
 *
 * * req.aRAD.objectKey : the object_key of the object definition
 * * req.aRAD.tableInfo : the table definition of this object
 * * req.query[tableInfo.pKey] : the primary key value of this object
 *
 * So call this express step after calling the HRiS.Express.whichObject()
 * step.
 *
 *
 * @param {obj} req  The express request object
 * @param {obj} res  The express response object
 * @param {fn}  next The express callback function
 */

HRiS.Express.destroyObject = function (req, res, next) {

    // get object/table definition
    var objectKey = req.aRAD.objectKey;
    var tInfo = req.aRAD.tableInfo;

    var id = req.query[tInfo.pKey];

    // use our SQL to store info.
    var destroyed = HRiS.Objects.destroy(objectKey, id);
    $.when(destroyed)
        .then(function(id){

            // done, so continue on
            next();
        })
        .fail(function(err) {

            errorDump(req, 'error destroying object ['+objectKey+'] ...');

            // service response
            HRiS.errorMsg(req, res, 'ERR_OBJ_DESTROY', err, AD.Const.HTTP.ERROR_SERVER);

        });


}



/**
 * @function updateObject
 *
 * Update an object instance.
 *
 * In order for this routine to operate correctly, it expects
 * the following parameters to be defined:
 *
 * * req.aRAD.objectKey : the object_key of the object definition
 * * req.aRAD.tableInfo : the table definition of this object
 * * req.query[tableInfo.pKey] : the primary key value of this object
 *
 * So call this express step after calling the HRiS.Express.whichObject()
 * step.
 *
 *
 * @param {obj} req  The express request object
 * @param {obj} res  The express response object
 * @param {fn}  next The express callback function
 */
HRiS.Express.updateObject = function (req, res, next) {

    // get object/table definition
    var objectKey = req.aRAD.objectKey;
    var tInfo = req.aRAD.tableInfo;

    var id = req.query[tInfo.pKey];


    //// when updating an object, we only update the object's
    //// direct attributes.

    // get fields by testing each attribute in req.query()
    var params = {};
    var hasParam = false;
    for (var a in tInfo.attributes) {

        var attr = tInfo.attributes[a];
        if (attr.rship == 'one') {
            var value = req.param(a);
            if ('undefined' != typeof value) {
                params[a] = value;
                hasParam = true;
            }
        }
    }

    if( !hasParam) {

        //// QUESTION: Is this really an Error? Or do we just continue on and
        ////           assume it is ok?

        errorDump(req, 'no parameters to update for object ['+objectKey+'] ...');

        // service response
        HRiS.errorMsg(req, res, 'ERR_OBJ_NO_PARAM', {}, AD.Const.HTTP.ERROR_CLIENT);

    } else {


        // use our SQL to store info.
        var updated = HRiS.Objects.update(objectKey, id, params);
        $.when(updated)
            .then(function(id){

                // done, so continue on
                next();
            })
            .fail(function(err) {

                errorDump(req, 'error updating object ['+objectKey+'] ...');

                // service response
                HRiS.errorMsg(req, res, 'ERR_OBJ_UPDATE', err, AD.Const.HTTP.ERROR_SERVER);

            });

    }
}



/**
 * @function whichObject
 *
 * Determines which defined object is requested.
 *
 * When finished, this callback stores the following values:
 * * req.aRAD.objectKey : the object_key of the object definition
 * * req.aRAD.tableInfo : the table definition of this object
 * * req.query[pKey]    : if an additional /hris/object/:id is provided, then req.query.pKey = id is added
 *
 * @param {obj} req  The express request object
 * @param {obj} res  The express response object
 * @param {fn}  next The express callback function
 */

HRiS.Express.whichObject = function (req, res, next) {
    // Prepare the rest of the method to use the given object
    //
    // when we are done: req.aRAD.objectKey = :objKey

    var objKey = req.param('hrisObjKey');

    // objKey can only be a string!  express-params() is
    // returning an object/array/something that is the result of the RegExpr
    // operation.
    // is there a better way to ensure this is just a string?
    var strKey = '' + objKey;
    objKey = strKey;

    if ((objKey == 'api')
            || (objKey=='update')){
        // whoops!  this is /hris/api/* route
        // we need to skip this route
        error(req,'   *** objKey == api,  false route match ***');
        next('route');
    } else {
//console.log('objectKey['+objKey+']');
//console.log(objKey);


    // if we can get a definition from this object, then it is
    // valid.

    var loaded = HRiS.Objects.definition(objKey);
    $.when(loaded)
        .then(function(tableInfo){
//console.log();
//console.log( tableInfo);

            if( tableInfo) {

                // we got a definition, so objKey must be good.
                // just continue on:
                req.aRAD.objectKey = objKey;
                req.aRAD.tableInfo = tableInfo;

                // check for findOne :id
                var id = req.param('id');
                if (typeof id != 'undefined') {
                    // we've been given an object id
                    // stuff this value in req.query so it filters our results:
                    req.query[tableInfo.pKey] = parseInt(id);
                }
//console.log('*** ID: ');
//console.log(id);
//console.log(req.query);
                next();

            } else {

                // no tableInfo found for this object ... :(
                errorDump(req, 'no object ['+objKey+'] found ...');

                // service response
                HRiS.errorMsg(req, res, 'OBJ_NOT_FOUND', {}, AD.Const.HTTP.ERROR_NOTFOUND);

            }
        })
        .fail(function(err){

            //// DB Error here:

            // server console message
            error(req, 'error finding table info ...');
            errorDump(req, err);

            // service response
            //var errorData = { errorID:55, errorMsg:'error finding table info for object ['+objKey+']', data:err };
            //AD.Comm.Service.sendError(req, res, errorData, AD.Const.HTTP.ERROR_SERVER ); // 500 : our fault
            HRiS.errorMsg(req, res, 'ERR_TABLE_ACCESS', err, AD.Const.HTTP.ERROR_NOTFOUND);

        });

    }
}





/**
 * @class hris.server.HRiS.Objects
 * @parent hris.server.HRiS
 *
 * Our interface to the Object definitions as they are currently defined in the system.
 */
HRiS.Objects = {};



/**
 * @function create
 *
 * Create an entry in the proper table for the given object key (objKey).
 *
 * This is an Asynchronous method.
 *
 * @param {string} objKey  The Object Key of the object definition we are requesting
 * @param {obj} params An object with 'column_name':'value' pairs of the entry to create.
 * @param {fn} onSuccess An optional callback to call with the data.
 * @param {fn} onError An optional callback to call in the event of an error.
 * @return {deferred}
 */
HRiS.Objects.create = function ( objKey, params, onSuccess, onError) {
    var dfd = $.Deferred();

//console.log('key:'+objKey);
//console.log(params);

    var tInfo = objects[objKey];

    if ('undefined' == typeof tInfo) {

        // Provided objKey is not referencing a valid object in our system!
        var myErr = {
                msg: 'invalid object key ['+objKey+']'
        }
        if (onError) onError(myErr);
        dfd.reject(myErr);

    } else {

        //// reuse our db.create() method to perform the operation:
        // create a dataMgr definition:
        // (see server/dataStore/dataStore_MySQL.js for format)
        // {
        //      dbName: '??',
        //      dbTable:'tableName',
        //      model:{
        //          columnName1:value1,
        //          columnName2:value2,
        //          ...
        //          columnNameN:valueN
        //      }
        // }
        var dataMgr = {
//                dbName:AD.Defaults.dbName,
                dbTable:tInfo.table,
                model:params
        }

        db.create(dataMgr, function(err, id){

            // if err:
            if (err) {

                if (onError) onError(err);
                dfd.reject(err);

            } else {

                if (onSuccess) onSuccess(id);
                dfd.resolve(id);
            }
        });
    }



    return dfd;
}



/**
 * @function definition
 *
 * Return the object definition for the provided object key.
 *
 * This is an Asynchronous method.
 *
 * @param {string} key  The Object Key of the object definition we are requesting
 * @param {fn} onSuccess An optional callback to call with the data.
 * @param {fn} onError An optional callback to call in the event of an error.
 * @return {deferred}
 */
var objects = {};
HRiS.Objects.List = objects;
HRiS.Objects.definition = function (key, onSuccess, onError) {
    var dfd = $.Deferred();

    /*
    Example Definition/Table Format:
    {
        'table':'hris2_person',     // the name of the db table this object is in
        'pkey':'person_id',         // the column name of the table's primary key

        // attributes: list all the defined fields
        'attributes': {

            person_surname:{ rship:'one',  obj:'person', set:'name',  dataType:'TEXT', _label:'Surname' },
                // rship    : how is this attribute related to this object
                //            'one' == this is on the main table
                //            'belongs_to', 'has_one', 'has_many' == this attrib is on another related object
                //
                // obj      : the object_key this attribute belongs to
                // set      : the attributeset_key this attribute belongs to
                // dataType : what kind of data is this [TEXT, INTEGER, NUMBER, DATE, DATETIME, BOOL, LOOKUP]
                // lookupKey: if dataType == LOOKUP, then this has the lookUp table key
                // _label   : the multilingual label for this attribute
            person_givenname:'',
            person_bloodtype:'',
            person_condition:'',

            // attributes from related objects
            passport_id:{ rship:'has_many', obj:'passport', set:'passport', dataType:'INTEGER', lookupKey:null, _label:'' },
            passport_number:{ rship:'has_many', obj:'passport', set:'passport', dataType:'TEXT', lookupKey:null, _label:{ 'en': 'Number' } },
            country_id: { rship:'has_many', obj:'passport', set:'passport', dataType:'LOOKUP', lookupKey:'country', _label:{ 'en':'Country' }},
            passport_issuedate: { rship:'has_many', obj:'passport', set:'passport', dataType:'DATE', lookupKey:null, _label:{ 'en':'Issue Date' }},

        },

        'relationships':{
            'passport':{ rship:'has_many', objkey:'passport', table:'hris_passport', pkey:'passport_id' },
        }


    }

 */


//// Prevent Caching of data
 //   if ('undefined' == typeof objects[key]) {

        var loaded = objLoadDefinition(key);
        $.when(loaded)
            .then(function(table){
                    objects[key] = table;

                    if (onSuccess) onSuccess(table);
                    dfd.resolve(table);
                })
            .fail(function(err){

                    if (onError) onError(err);
                    dfd.reject(err);
                });

//    } else {

//        // we have it, so perform the callback immediately
//        if (onSuccess) { onSuccess(objects[key]);}
//        dfd.resolve(objects[key]);
//    }

    return dfd;
}



/*
 * Internal fn to load the table definition from the hris definition tables.
 * hris_object, hris_attributeset, hris_attribute
 */
var objLoadDefinition = function (key, onSuccess, onError) {
    var dfd = $.Deferred();

    var tableInfo = { attributes:{} };

//console.log('objLoadDefinition()...Key:');
//console.log(key);

    // Step 1: load all the direct Object Attributes
    var attributesLoaded = loadTableAttributes(key, tableInfo);
    $.when(attributesLoaded)
        .then(function(loadedTable){

//console.log(loadedTable);
//console.log(loadedTable.attributes);

            // if the key was invalid
            if (loadedTable == null) {

                // note: this operation was successful, but the result
                // is null because an invalid key was asked for.

                // or atleast it is an undefined object (with no attributes yet)
                // let's check:
                var objectOnlyCheck = loadObjectOnly(key, tableInfo);
                $.when(objectOnlyCheck)
                    .then(function( definition ) {

                        if (definition == null) {

                            // ok, this really is a bad object key!
                            if (onSuccess) onSuccess(null);
                            dfd.resolve(null);

                        } else {
                            // lets return the data
                            if (onSuccess) onSuccess(tableInfo);
                            dfd.resolve(tableInfo);
                        }

                    })
                    .fail(function(err){
console.log('failed objectOnlyCheck! ')
                        // Yikes!  Error doing Obj lookup!
                        if (onError) onError(err);
                        dfd.reject(err);

                    });



            } else {


                // Step 2: load all the attributes from any Related Objects
                var relationshipsLoaded = loadRelatedAtrributes(key, tableInfo);
                $.when(relationshipsLoaded)
                    .then(function(){
//console.log(tableInfo);
//console.log(tableInfo.attributes);
                        if (onSuccess) onSuccess(tableInfo);
                        dfd.resolve(tableInfo);

                    })
                    .fail(function(err){

                        // error loading the related tables!
                        if (onError) onError(err);
                        dfd.reject(err);

                    });

            }
        })
        .fail(function(err) {

            // error loading the object's attributes!
            if (onError) onError(err);
            dfd.reject(err);

        });



    return dfd;
}



var loadObjectOnly = function(key, tableInfo, onSuccess, onError) {
    var dfd = $.Deferred();

//console.log('loadObjectOnly(): key:');
//console.log(key);

    var Object = AD.Model.List['hris.Object'];
    Object.findAll({object_key:key}, function(list) {
//console.log('..... Object.findAll():');
//console.log(list);

        if (list.length == 0) {

            // still no dice!
            // but this was successful operation, so
            // return null as result
            if (onSuccess) onSuccess(null);
            dfd.resolve(null);

        } else {

            // we got something.
            if (list.length > 1) {
                // so why did we get >1 match for a unique key!?
                error('*** hris.loadObjectOnly(): >1 match for unique object key ['+key+']');

            }

            // just send back the 1st match

            var object = list[0];

            // make sure tableInfo[ table ] is set
            // tableInfo.table = 'the db table name';  // hris_person
            if ('undefined' == typeof tableInfo['table']) { tableInfo['table'] = object.object_table; }

            // make sure tableInfo[ pKey ] is set
            // tableInfo.pkey = 'person_id';  // the primary key of the table
            if ('undefined' == typeof tableInfo['pKey']) { tableInfo['pKey'] = object.object_pkey; }

//console.log('tableInfo:');
//console.log(tableInfo);

            if (onSuccess) onSuccess(tableInfo);
            dfd.resolve(tableInfo);

        }

    }, function(err){
console.log('HRiS.js:loadObjectOnly():Object.findAll() went wrong!');

        // something went wrong with the lookup!
        if (onError) onError(err);
        dfd.reject(err);

    })

    return dfd;

}


/*
 * This fn will load the attribute info into the provided tableInfo:
 */
var loadTableAttributes = function (key, tableInfo, onSuccess, onError) {
    var dfd = $.Deferred();

    // gather all the (AttributeSets INNER JOIN Attributes) for the person Object
    var sql = [
         'SELECT * FROM  '+AD.Defaults.dbName+'.hris2_object as obj ',
         'INNER JOIN ('+AD.Defaults.dbName+'.hris2_attributeset as ats INNER JOIN '+AD.Defaults.dbName+'.hris2_attributeset_trans as ats_t on ats.attributeset_id=ats_t.attributeset_id) on obj.object_id=ats.object_id',
         'INNER JOIN ('+AD.Defaults.dbName+'.hris2_attributes as attr INNER JOIN '+AD.Defaults.dbName+'.hris2_attributes_trans as attr_t on attr.attribute_id=attr_t.attribute_id) on ats.attributeset_id=attr.attributeset_id',
         'WHERE object_key="'+key+'" AND ats_t.language_code=attr_t.language_code'
         ].join(' ');
    db.runSQL(sql,[], function(err, results, fields){

//console.log('table definition sql :'+sql);
//console.log('tableInfo inside db results ');
//console.log(tableInfo);
        if (err) {

            if (onError) onError(err);
            dfd.reject(err);

        } else {

//console.log('sql:['+sql+']');
//console.log(results);

            if (results.length == 0) {

                // return null since no object was found.
                if (onSuccess) onSuccess(null);
                dfd.resolve(null);

            } else {


                // foreach result
                for(var i=0; i<results.length; i++) {

                    var attribute = results[i];


                    // make sure tableInfo[ table ] is set
                    // tableInfo.table = 'the db table name';  // hris_person
                    if ('undefined' == typeof tableInfo['table']) { tableInfo['table'] = attribute.object_table; }

                    // make sure tableInfo[ pKey ] is set
                    // tableInfo.pkey = 'person_id';  // the primary key of the table
                    if ('undefined' == typeof tableInfo['pKey']) { tableInfo['pKey'] = attribute.object_pkey; }


                    packageAttribute(tableInfo, attribute, 'one'); // these are on main object;


                } // next attribute
//console.log();
//console.log( tableInfo);

                if (onSuccess) onSuccess( tableInfo);
                dfd.resolve(tableInfo);

            } // end if results.length > 0
        }


    });

    return dfd;
}



/*
 * This fn will load the attribute info into the provided tableInfo:
 */
var loadRelatedAtrributes = function (key, tableInfo, onSuccess, onError) {
    var dfd = $.Deferred();

    // provided tableInfo should already have pKey set:
//    var objA_id = tableInfo.pKey;

    // make sure the relationships parameter is created.
    if ('undefined' == typeof tableInfo['relationships']) tableInfo['relationships'] = {};

    // gather all the (AttributeSets INNER JOIN Attributes) for the person Object
    var sql = [
         'Select * FROM  '+AD.Defaults.dbName+'.hris2_object as obj ',
         'INNER JOIN ('+AD.Defaults.dbName+'.hris2_attributeset as ats INNER JOIN '+AD.Defaults.dbName+'.hris2_attributeset_trans as ats_t on ats.attributeset_id=ats_t.attributeset_id) on obj.object_id=ats.object_id',
         'INNER JOIN ('+AD.Defaults.dbName+'.hris2_attributes as attr INNER JOIN '+AD.Defaults.dbName+'.hris2_attributes_trans as attr_t on attr.attribute_id=attr_t.attribute_id) on ats.attributeset_id=attr.attributeset_id',
         'INNER JOIN '+AD.Defaults.dbName+'.hris2_relationship as rship on obj.object_id=rship.objB_id',
         'WHERE objA_id=(SELECT object_id FROM '+AD.Defaults.dbName+'.hris2_object WHERE object_key="'+key+'") AND ats_t.language_code=attr_t.language_code'
         ].join(' ');
    db.runSQL(sql,[], function(err, results, fields){

//console.log('table definition sql :'+sql);
//console.log('tableInfo inside loadedRelated db results ');
//console.log(tableInfo);
        if (err) {

            if (onError) onError(err);
            dfd.reject(err);

        } else {

//console.log('sql:['+sql+']');
//console.log(results);

            if (results.length == 0) {

                // return null since no object was found.
                if (onSuccess) onSuccess(null);
                dfd.resolve(null);

            } else {


                // foreach result
                for(var i=0; i<results.length; i++) {

                    var attribute = results[i];

                    var rship = attribute.relationship_type;
                    packageAttribute(tableInfo, attribute, rship); // these are on main object;

                    //// Example relationship definition:
                    /*
                    'relationships':{
                        'passport':{ rship:'has_many', objkey:'passport', table:'hris_passport', pkey:'passport_id' },
                    }
                    */

                    var thisRship = {
                            rship:rship,
                            objKey:attribute.attributeset_key,

                            table:attribute.object_table,
                            pkey:attribute.object_pkey,
                            objA_pkey: tableInfo.pKey
                    };
                    tableInfo['relationships'][attribute.object_key] = thisRship;


                } // next attribute
//console.log();
//console.log( tableInfo);

                if (onSuccess) onSuccess( tableInfo);
                dfd.resolve(tableInfo);

            } // end if results.length > 0
        }


    });

    return dfd;
}


var packageAttribute = function(tableInfo, attribute, relation) {


    var obj = attribute.object_key;
    var keySet = attribute.attributeset_key;
    var dataType = attribute.attribute_datatype;
    var meta = attribute.meta;

    var column = attribute.attribute_column;
    var table = attribute.attributeset_table;

    /*
        Example Table Format:
        {
            'table':'hris2_person',     // the name of the db table this object is in
            'pkey':'person_id',         // the column name of the table's primary key

            // attributes: list all the defined fields
            'attributes': {

                person_surname:{ rship:'one',  obj:'person', set:'name',  dataType:'TEXT', _label:'Surname' },
                    // rship    : how is this attribute related to this object
                    //            'one' == this is on the main table
                    //            'belongs_to', 'has_one', 'has_many' == this attrib is on another related object
                    //
                    // obj      : the object_key this attribute belongs to
                    // set      : the attributeset_key this attribute belongs to
                    // dataType : what kind of data is this [TEXT, INTEGER, NUMBER, DATE, DATETIME, BOOL, LOOKUP]
                    // lookupKey: if dataType == LOOKUP, then this has the lookUp table key
                    // _label   : the multilingual label for this attribute
                person_givenname:'',
                person_bloodtype:'',
                person_condition:'',

                // attributes from related objects
                passport_id:{ rship:'has_many', obj:'passport', set:'passport', dataType:'INTEGER', lookupKey:null, _label:'' },
                passport_number:{ rship:'has_many', obj:'passport', set:'passport', dataType:'TEXT', lookupKey:null, _label:{ 'en': 'Number' } },
                country_id: { rship:'has_many', obj:'passport', set:'passport', dataType:'LOOKUP', lookupKey:'country', _label:{ 'en':'Country' }},
                passport_issuedate: { rship:'has_many', obj:'passport', set:'passport', dataType:'DATE', lookupKey:null, _label:{ 'en':'Issue Date' }},

            },


        }

     */


    // if this column isn't already installed:
    if ('undefined' == typeof tableInfo['attributes'][column]) {

        tableInfo['attributes'][column] = {

            // rship    : how is this attribute related to this object
            //            'one' == this is on the main table
            //            'belongs_to', 'has_one', 'has_many' == this attrib is on another related object
            //
            rship:relation,

            // obj      : the object_key this attribute belongs to
            obj:obj,

            // set      : the attributeset_key this attribute belongs to
            set:keySet,

            // dataType : what kind of data is this [TEXT, INTEGER, NUMBER, DATE, DATETIME, BOOL, LOOKUP]
            dataType:dataType,

            // lookupKey: if dataType == LOOKUP, then this has the lookUp table key
            lookupKey:meta,

            // _label   : the multilingual label for this attribute
            _label:{ },

            // table    : the db.table that this objects is located in
            table:table,

            // obj_pkey : the primary key of the table this object is located in
            obj_pkey:attribute.object_pkey,


            attributeset_id:attribute.attributeset_id,

        }

        // add in the label in { 'en': 'label' } format:
        tableInfo['attributes'][column]._label[attribute.language_code] = attribute.attribute_label;

    } else {

        // if we are here again it is possibly due to another label entry:
        tableInfo['attributes'][column]._label[attribute.language_code] = attribute.attribute_label;

    }
}



/**
 * @function destroy
 *
 * Destroy an entry in the proper table for the given object key (objKey).
 *
 * This is an Asynchronous method.
 *
 * @param {string} objKey  The Object Key of the object definition we are requesting
 * @param {int} id The primary key value of the object to update
 * @param {obj} params (optional) set of 'column_name':'value' pairs to construct a condition search
 * @param {fn} onSuccess An optional callback to call with the data.
 * @param {fn} onError An optional callback to call in the event of an error.
 * @return {deferred}
 */
HRiS.Objects.destroy = function ( objKey, id, params, onSuccess, onError) {
    var dfd = $.Deferred();

//console.log('key:'+objKey);
//console.log(params);

    var tInfo = objects[objKey];

    if ('undefined' == typeof tInfo) {

        // Provided objKey is not referencing a valid object in our system!
        var myErr = {
                msg: 'invalid object key ['+objKey+']'
        }
        if (onError) onError(myErr);
        dfd.reject(myErr);

    } else {

        //// reuse our db.destroy() method to perform the operation:
        // create a dataMgr definition:
        // (see server/dataStore/dataStore_MySQL.js for format)
        // {
        //      dbName: '??',
        //      dbTable:'tableName',
        //      model:{
        //          primaryKey:pkValue,
        //          columnName1:value1,
        //          columnName2:value2,
        //          ...
        //          columnNameN:valueN
        //      }
        // }

        if ('undefined' == typeof params) params = {};
        params[tInfo.pKey] = id;

        var dataMgr = {
//                dbName:AD.Defaults.dbName,
                dbTable:tInfo.table,
                model:params,
        }

        db.destroy(dataMgr, function(err, results){

            // if err:
            if (err) {
console.log(err);

                if (onError) onError(err);
                dfd.reject(err);

            } else {
//console.log('destroy() results:');
//console.log(results);

                if (onSuccess) onSuccess(results);
                dfd.resolve(results);
            }
        });
    }



    return dfd;
}



/**
 * @function filteredIDs
 *
 * Return an array of object id's that match any parameter filters found in the
 * provided filter object.
 *
 * This is an Asynchronous method.
 *
 * filters is an object in the format:
 * 'attribute_column':value
 *
 * @codestart
 * var filter = {
 *  passport_isActive:1
 * }
 * var loaded = HRiS.Objects.filteredIDs('person', filter, [ 1, 2, 3]);
 * $.when(loaded)
 *      .then(function(listIDs) {
 *          // process list
 *          })
 *      .fail(function(err) {
 *          // handle error
 *          });
 * @codeend
 *
 * If you are using express, you can send the req.query object as the filter parameter:
 * @codestart
 * var loaded = HRiS.Objects.filteredIDs('person', req.query, [ 1, 2, 3]);
 * $.when(loaded)
 *      .then(function(listIDs) {
 *              // process list
 *              next();
 *          })
 *      .fail(function(err) {
 *              // handle error
 *          });
 * @codeend
 *
 * The data returned from this routine onSuccess is an array of object id's that match
 * the provided filter.  If no filters are passed in then null is returned.
 *
 * @param {string} objKey  The Object Key of the object definition we are working with
 * @param {obj} filter  An object representing the filters to apply.
 * @param {array} scope An array of id's to limit the search to
 * @param {fn} onSuccess An optional callback to call when finished
 * @param {fn} onError An optional callback to call in the event of an error.
 * @return {deferred}
 */
HRiS.Objects.filteredIDs = function (objKey, filter, scope, onSuccess, onError) {
    var dfd = $.Deferred();


    var filteredScope=null;   // our values to return.  null == no filters found.

    var tInfo = objects[objKey];

    if ('undefined' == typeof tInfo) {

        // Provided objKey is not referencing a valid object in our system!
        var myErr = {
                msg: 'invalid object key ['+objKey+']'
        }
        if (onError) onError(myErr);
        dfd.reject(myErr);

    } else {

        var tables = [];
        tables.push( AD.Defaults.dbName + '.' + tInfo.table+' ' );  // push the object.table onto the stack

        var condition = null;
        var values = [];

//console.log();
//console.log('query=');
//console.log(filter);

        // foreach provided parameter
        for (var p in filter ) {
//console.log(' param p['+p+']='+filter[p]);

            // if the parameter is an attribute of this object
            if ('undefined' != typeof tInfo.attributes[p]) {

                switch( tInfo.attributes[p].rship) {

                    case 'belongs_to':
                        // think: this.passport belongs_to person
                        // to pull person: join on person.person_id

                        var table = tInfo.attributes[p].table;
                        var pKey =  tInfo.attributes[p].obj_pkey;
                        var join = ' INNER JOIN '+AD.Defaults.dbName+'.' + table + ' on ' + tInfo.table+'.'+pKey+'='+table+'.'+pKey+' ';

                        tables.push(join);
                        break;

                    case 'has_many':
                        // think this.person has_many passports
                        // to pull in passport table:  join on passport.person_id

                        // add table to SQL query
                        var table = tInfo.attributes[p].table;
                        var pKey =  tInfo.pKey;
                        var join = ' INNER JOIN '+AD.Defaults.dbName+'.' + table + ' on ' + tInfo.table+'.'+tInfo.pKey+'='+table+'.'+tInfo.pKey+' ';

                        tables.push(join);
                        break;

                }

                // add 'parameter' 'OP' 'value' to condition
                if (condition == null) condition = [];
                condition.push( p + '=?');
                values.push(filter[p]);

//// TODO: enable more complicated conditions than x=y
                // make sure to handle param={'in':[1,3,4], '>=':1, ... } format.

            } else {

                // let's check for special primary key value
                // NOTE: primary keys don't show up in the attributes field

                if (tInfo.pKey == p) {

                    // add 'parameter' 'OP' 'value' to condition
                    if (condition == null) condition = [];
                    condition.push( p + '=?');
                    values.push(filter[p]);

                }

            }// end if





        } // next parameter.

//console.log('');
//console.log('tables, condition, values:');
//console.log(tables);
//console.log(condition);
//console.log(values);
//console.log();

        if (condition != null) {

            // run SQL DISTINCT(person_id) WHERE condition, function(data) {
            var sql = 'SELECT DISTINCT('+ tInfo.table + '.'+ tInfo.pKey+') FROM ';
            sql += tables.join('');
            sql += 'WHERE ' + condition.join(' AND ');


            // if a 'scope' was provided, then add a pkey IN ( ... ) condition
            if ((scope) && (scope.length > 0)) {
                sql += ' AND '+tInfo.table+'.'+tInfo.pKey+' IN ('+ scope.join(', ') + ') ';
            }

//console.log('sql['+sql+']');

            db.runSQL(sql, values, function(err, results, fields) {

                if (err) {

                    // server console message
                    error('sql['+sql+']');
                    error('HRiS.filteredIDs(): error finding filtered ids ...');


                    if (onError) onError(err);
                    dfd.reject(err);

                } else {



//console.log();
//console.log(' distinct ids:');
//console.log(results);

                    filteredScope=[];

                    // for each data
                    for( var i=0; i< results.length; i++) {

                        // filteredScope.push (person_id)
                        filteredScope.push( results[i][tInfo.pKey]);
                    }

//console.log(' filteredScope ids:');
//console.log(filteredScope);


                    if (onSuccess) onSuccess(filteredScope);
                    dfd.resolve(filteredScope);
                }

            });

        } else {

            // no filter was asked for, so we return null.
            if (onSuccess) onSuccess(filteredScope);
            dfd.resolve(filteredScope);
        }

    }

    return dfd;
}



/**
 * @function nonCachedIDs
 *
 * Return an array of object id's that are not found in our HRiS.Objects._cache.
 *
 * @param {obj} objKey  The object key of the object we are working with
 * @param {array} listIDs An array of object id's to scan for.
 *
 * @return {array}
 */
HRiS.Objects._cache = {};
/*
     cache = {
         'objKey': {
             id1: { obj1 },
             id2: { obj2 },
             ...
             idN: { objN }
         },
         ...
     }
 */
HRiS.Objects.nonCachedIDs = function (objKey, listIDs) {

    var notFound = [];

    if ('undefined' == typeof HRiS.Objects._cache[objKey] ) {
        HRiS.Objects._cache[objKey] = {};
        error('** objKey['+objKey+'] not found in HRiS.Objects._cache --> creating! **');
    }

    // foreach req.aRAD.filteredScopeArray as id
    for(var i=0; i<listIDs.length; i++) {

        var id = listIDs[i];

        // if cachedRen[ id ] !exists
        if ('undefined' == typeof HRiS.Objects._cache[objKey][id]) {
            // notFound.push(id);
            notFound.push(id);

        } // end if

    } // next id.


    return notFound;

}



/**
 * @function cache
 *
 * Load objects into our HRiS.Objects._cache
 *
 * This is an Asynchronous method.
 *
 * You can use this method to request a DB lookup on an object (objKey)
 * and pull out the objects whose primary key is a value in listIDs.  For example,
 * you can pull out all the passports that have passport_id in (1,2,3) like this:
 * @codestart
 * var listIDs = [ 1, 2, 3];
 * var loaded = HRiS.Objects.cache('passport', listIDs);
 * $.when(loaded)
 *     .then(function() {
 *
 *         // now those objects are available in HRiS.Objects._cache;
 *
 *     });
 * @codeend
 *
 * If you want to pull objects reference by another value other than it's primary key,
 * then pass in the pKey parameter.  So if you wanted to find all the passports linked to
 * person_id in [1, 2, 3], you would do this:
 * @codestart
 * var listIDs = [ 1, 2, 3];
 * var loaded = HRiS.Objects.cache('passport', listIDs, 'person_id');
 * $.when(loaded)
 *     .then(function() {
 *
 *         // now those objects are available in HRiS.Objects._cache;
 *
 *     });
 * @codeend
 *
 *
 * @param {obj} objKey  The object key of the object we are working with
 * @param {array} listIDs An array of object id's to load.
 * @param {string} pkey An alternate db column to use to match the listIDs. Use this when you want to match on a foreign key rather than the table's primary key. (this is the foreign key name)
 * @param {fn} onSuccess An optional callback to call on success
 * @param {fn} onErr An optional callback to call on error
 * @return {deferred}
 */
HRiS.Objects.cache = function (objKey, listIDs, pKey, onSuccess, onError) {

    var dfd = $.Deferred();

    if ('undefined' == typeof listIDs) {listIDs = [];}

    if ('undefined' == typeof HRiS.Objects._cache[objKey]) HRiS.Objects._cache[objKey]= {};


    // find the table info from our objKey
    var tInfo = objects[objKey];


    var pkeyType = typeof pKey;
    switch( pkeyType) {
        case 'undefined':
            // no value given so default to table.pkey

//console.log();
//console.log('cache(): pKey not provided...');
//console.log('objKey['+objKey+']');
//console.log('objects:');
//console.log(objects);
//console.log('tInfo:');
//console.log(tInfo);
//console.log();

            pKey = tInfo.pKey;
            break;

        case 'function':
            // fn called missing pKey param, tell developers to read the docs!
            onError = onSuccess;
            onSuccess = pKey;
            pKey = tInfo.pKey; // default to table.pkey again
            break;
    }


    if (listIDs.length == 0) {

        // so nothing to lookup
        if (onSuccess) onSuccess();
        dfd.resolve();

    } else {


        var condition = pKey + ' IN ('+listIDs.join(',') + ')';

        var loadedObjs = {}


        // run SQL WHERE condition, function(data) {
        var sql = 'SELECT * FROM '+ AD.Defaults.dbName + '.' + tInfo.table + ' WHERE ' + condition;
        db.runSQL(sql, [], function(err, results, fields) {

//console.log('sql for cach(): '+sql);
//console.log(results);

            if (err) {

                error( 'sql['+sql+']');
                error( 'error caching objects['+objKey+'] ... failed initial read');
                error( err);

                if (onError) onError(err);
                dfd.reject(err);


            } else {


                //// First gather base object table entries for our requested IDs

                //// these should be all the 1:1 entries that are found in the base table
                //// when we are done, we should have an object like:
                //// {
                ////    obj_attr1:val1,
                ////    obj_attr2:val2,
                ////    ...
                ////    obj_attrN:valN
                //// }

                // foreach entry in our results
                for(var p=0; p < results.length; p++) {

                    var entry = results[p];

                    var object = {};
                    object[tInfo.pKey] = entry[tInfo.pKey];
                    object._labels = {};

                    // foreach attribute that is 'one'
                    for (var a in tInfo['attributes']) {

                        if (tInfo.attributes[a].rship == 'one') {

                            // store the value
                            object[a] = entry[a];

                            // store the label for this attribute
                            object._labels[a] = tInfo.attributes[a]._label;
                        }

                    } // next AS

                    // foreach related object, make sure those foreignKeys are set
                    for (var r in tInfo['relationships']) {
                        var rKey = tInfo['relationships'][r].pkey;
                        switch( tInfo['relationships'][r].rship) {

                            case 'belongs_to':
                                // think: passport belongs_to person
                                // this object contains the primary key of the other
                                // eg: passport has a person_id foreign key.
                                object[rKey] = entry[rKey];
                                break;

                            case 'has_many':
                                // think: person has_many passports
                                // the related obj has this primary key as their foreign key
                                // nothing to do here
                                break;
                        }
                    }

                    assignLinksToObject(objKey, object);
 //console.log();
 //console.log('------');
 //console.log('object:');
 //console.log(object);
 //console.log();

                    loadedObjs[object[tInfo.pKey]] = object;

                } // next entry

//console.log();
//console.log('----------');
//console.log('loadedObjs:');
//console.log(loadedObjs);
//console.trace(' caching done. ');

                // done for now ..
                // copy currently loaded Objects to the Cache
                for (var id in loadedObjs) {
                    HRiS.Objects._cache[objKey][id] = loadedObjs[id];
                } // next id

                if (onSuccess) onSuccess();
                dfd.resolve();


            } // end if err

        });


    }  // end if length > 0


    return dfd;

}

var HRISObjectLinks = {
      self:    { method:'GET',    uri:'/hris/[objKey]/[id]', params:{}, type:'resource' },
      create:  { method:'POST',   uri:'/hris/[objKey]',      params:{}, type:'action' },
      update:  { method:'PUT',    uri:'/hris/[objKey]/[id]', params:{}, type:'action' },
      destroy: { method:'DELETE', uri:'/hris/[objKey]/[id]', params:{}, type:'action' },
}

var HRISObjectRelationshipLinks = {
        belongs_to: { method:'GET',    uri:'/hris/[objKey]/[id]', params:{}, type:'resource' },
        has_many:   { method:'GET',    uri:'/hris/[objKey]',      params:{}, type:'resource' },
}

var assignLinksToObject = function(key, object, links) {

    if ('undefined' == typeof links) links = HRISObjectLinks;

    // pull the table info for this object.
    var tInfo = objects[key];
    var pKey = tInfo.pKey;

    object._links = {};

    var data = {
            objKey:key,
            id:object[pKey]
    }
    for (var link in links) {

        var newLink = {};

        newLink.method = links[link].method;
        newLink.type = links[link].type;
        newLink.params = links[link].params;
        newLink.uri = AD.Util.String.render(links[link].uri, data);

        object._links[link] = newLink;
    }


    //// Now we need to add links for each related objects
    for (var relatedObjKey in tInfo.relationships) {

        var rshipDef = tInfo.relationships[relatedObjKey];


        var linkDef = HRISObjectRelationshipLinks[rshipDef.rship];

        var newLink = {};
        newLink.method = linkDef.method;
        newLink.type = linkDef.type;
        newLink.params = linkDef.params;


        switch( rshipDef.rship )
        {
            case 'belongs_to':
                // think: passport belongs_to person
                // to pull person:

                // uri should be /hris/person/1
                var relatedObjKey = rshipDef.objKey;
                var data = {
                        objKey:rshipDef.objKey,
                        id:object[rshipDef.pkey]
                }
                newLink.uri = AD.Util.String.render(linkDef.uri, data);

                break;

            case 'has_many':
                // think:  person has_many passports
                // to pull passports:

                // uri should be /hris/passport
                var relatedObjKey = rshipDef.objKey;
                var data = {
                        objKey:rshipDef.objKey
                }
                newLink.uri = AD.Util.String.render(linkDef.uri, data);


                // params should be { person_id:'[person_id]' }
                newLink.params[tInfo.pKey] = '['+tInfo.pKey+']';
                break;
        }

        object._links[relatedObjKey] = newLink;
    }
}




/**
 * @function cachedObjects
 *
 * Return a copy of our object from our cache.
 *
 * These are the base object definitions (no embedded related objects).
 *
 *
 * @param {obj} objKey  The object key of the object we are working with
 * @param {array} listIDs An array of object id's to return.
 * @return {deferred}
 */
HRiS.Objects.cachedObjects = function (objKey, listIDs) {


//console.log('objKey['+objKey+']');
//console.log('listIDs:');
//console.log(listIDs);

    var found = {};

    // foreach req.aRAD.filteredScopeArray as id
    for (var i=0; i < listIDs.length; i++) {

        var id = listIDs[i];

        found[id] = AD.Util.Object.clone(HRiS.Objects._cache[objKey][id]);  // don't mess with originals

    } // next id.


    return found;  // final list of objects

}



/**
 * @function packageObjects
 *
 * Return a copy of our object that has any related object
 * embedded inside it's definition..
 *
 *
 * @param {obj} objKey  The object key of the object we are working with
 * @param {array} listIDs An array of object id's to return.
 * @return {deferred}
 */
HRiS.Objects.packageObjects = function (objKey, listIDs) {

    var dfd = $.Deferred();

    var tInfo = objects[objKey];


    if (listIDs.length == 0) {

        // there is nothing to do ... so end successfully:
        dfd.resolve();

    } else {


        // NOtE: these are already copies ... feel free to modify!
        var found = HRiS.Objects.cachedObjects(objKey, listIDs);


        var numPending = 0;  // gotta track pending operations


        var conditions = {};

//console.log('packagedObjects():');
//console.log('listIDs:');
//console.log(listIDs);

//console.log('objKey:'+objKey);
//console.log('found:');
//console.log(found);
//console.log('relationships:');
//console.log(tInfo.relationships);

        // foreach related obj
        for(var rObjKey in tInfo.relationships) {

            // thisObj[relatedObj.key] = {}
    //        thisObj[objKey] = {};

            var relatedObj = tInfo.relationships[rObjKey];

//console.log('   --> relatedObjKey:'+rObjKey);


            numPending ++;  // track this relationship operation

            var relatedTableFound = HRiS.Objects.definition(rObjKey);
            $.when(relatedTableFound)
                .then(function() {



                    // compile sql for pulling out related objects' ID's
                    var sql;
                    var values =[];
                    var condition = '';
                    switch(relatedObj.rship) {
                        case 'belongs_to':
                            // think thisObj(passport) belongs_to relatedObj(person)
                            // find relatedObj(person) using thisObj[relatedObj.primaryKey]
                            //

                            // gather a list of all the foreign key values to related obj
                            for(var id in found) {
                              //console.log('id: '+id);
                                  var thisObj = found[id];
                                  if (thisObj) {
                                      values.push( thisObj[relatedObj.pkey]);
                                  }
                            }

                            // OK, I realize this is a redundant step, since values already contains the id's
                            // this sql will lookup again, but the remainder of the routine expects this step so ...
                            sql = "SELECT DISTINCT(" + relatedObj.pkey + ") as id FROM "+ AD.Defaults.dbName + "." + relatedObj.table + ' WHERE ' ;
                            condition = relatedObj.pkey + " IN (" + values.join(', ') + ")";
                            sql += condition;
                            break;

                        case 'has_many':
                            // think thisObj(person) has_many relatedObj(passports)
                            // findAll relatedObj(passports) using thisObj.primaryKey

//console.log('   --> has_many rship');
//console.log(found);
                            // compile all the thisObj primary keys
                            for(var id in found) {
//console.log('id: '+id);
                                var thisObj = found[id];
                                if (thisObj) {
                                    values.push( thisObj[tInfo.pKey]);
                                } else {
error('   ---> so why is thisObj undefined?!');

                                }
                            }

                            sql = "SELECT DISTINCT(" + relatedObj.pkey + ") as id FROM "+ AD.Defaults.dbName + "." + relatedObj.table + ' WHERE ' ;
                            condition = tInfo.pKey + " IN (" + values.join(', ') + ")";
                            sql += condition;
                            break;
                    }

                    // run sql



                    var packaged = packageThisRship(found,  relatedObj, sql );
                    $.when(packaged)
                        .then(function(){

                            // each obj in found should now have it's obj[relatedObj.key] set
                            numPending --;
                            if (numPending == 0) {

                                // wow ... we're done.
                                dfd.resolve(found);
                            }

                        })
                        .fail(function(err){

                            // a single failure should stop this process
                            // so don't numPending --; here, that should prevent all successful
                            // ops from continuing on
                            error('packageObjects();');
                            error('problem packaging this relationship:');
                            error('sql:'+sql);
                            error('relatedObj:');
                            error(relatedObj);
                            error('found:');
                            error(found);
                            dfd.reject(err);

                        })



                }) // end relatedTableFound
                .fail(function(err){

                    // Internal error when looking for related table:
                    error('packageObjects();');
                    error('problem finding related table:');
                    error('objectKey: '+objKey);
                    dfd.reject(err);

                });

        } // next object



        // if we get to here and numPending == 0, that means there
        // were no related objects, so just continue!
        if (numPending == 0) {
            dfd.resolve(found);
        }


    }
    return dfd;

}



var packageThisRship = function( listObj, relatedObj, sql, onSuccess, onError) {
    // this fn needs to lookup a set of objects, make sure they are cached,
    // then attach them to their parent objects in listObj[].

    // sql should return a list of relatedObj.pKeys to lookup in our cach() routines.


    var dfd = $.Deferred();

    // run sql
    db.runSQL(sql, [], function(err, results, fields) {

//console.log('sql for cach(): '+sql);
//console.log(results);

        if (err) {

            error( 'packageThisRship():');
            error( 'sql['+sql+']');
            error( 'error finding objects['+relatedObj.objKey+'] ...');
            error( err);

            if (onError) onError(err);
            dfd.reject(err);


        } else {

            // compile listIDs for relatedObj
            var listRelatedObjIDs = [];
            for (var r=0; r<results.length; r++) {
                listRelatedObjIDs.push(results[r].id);
            }

            // find nonCachedIDs for relatedObj
            var nonCachedIDs = HRiS.Objects.nonCachedIDs(relatedObj.objKey, listRelatedObjIDs);

            // cache nonCachedIDs
            var nowCached = HRiS.Objects.cache(relatedObj.objKey, nonCachedIDs);
            $.when(nowCached)
                .then(function(){

//console.log(' nowCached finished ...');

                    // for each relatedObj
                    var found = HRiS.Objects.cachedObjects(relatedObj.objKey, listRelatedObjIDs);
//console.log(' found: ');
//console.log(found);

                    for (var id in found) {

                        //// now stuff this obj back into the proper listObj
                        var rObj = found[id]
                        var rID = rObj[relatedObj.pkey];

                        var objAID = [];
                        switch( relatedObj.rship) {
                            case 'belongs_to':
                                // think rObj is a person and I need to find the passport in listObj
                                // that it goes with:
                                // rObj's primary key is one of the values inside listObj's

                                // listObj will be indexed by person_ids, so we have to step through
                                // each entry and check for a matching value on rObj[pkey]

                                // foreach passport
                                for (var lID in listObj) {
                                    var lObj = listObj[lID];

                                    if (typeof lObj != 'undefined') {

                                        // if passport[person_id] == person[person_id] ...
                                        if (lObj[relatedObj.pkey] == rObj[relatedObj.pkey])
                                            objAID.push(lObj[relatedObj.objA_pkey]);

                                    } else {
                                        // got an id in found that isn't valid! ... why?
                                        error('got an id ['+lID+'] that is not valid!');
                                    }
                                }

                                break;


                            case 'has_many':
                                // think  rObj is a passport and I need to find the person in listObj
                                // that it goes with:
                                // rObj has person's primary key
                                objAID.push(rObj[relatedObj.objA_pkey]);

                                break;
                        }
                        // thisObj[relatedObj.key][id] = cache[objKey][id];

                        // since there could be several objects to stuff this into:
                        for (var iAID=0; iAID < objAID.length; iAID++) {

                            var aID = objAID[iAID];

                            if ('undefined' != typeof listObj[aID]) {

                                // make sure embedded reference exists
                                if ('undefined' == typeof listObj[aID][relatedObj.objKey] )
                                    listObj[aID][relatedObj.objKey] = {};

                                listObj[aID][relatedObj.objKey][rID] = rObj;

                            } else {

                                error('whoah! packageThisRship(): ');
                                error('objaID['+aID+'] not found in listObj:');
                                error(listObj);

                            }
                        }

                    } // next relatedObj


                    // all listObj's updated with our results
                    // we are done now.
                    if (onSuccess) onSuccess();
                    dfd.resolve();

                })
                .fail(function(err){

                    error( 'packageThisRship():');
                    error( 'sql['+sql+']');
                    error( 'failed caching objects['+relatedObj.objKey+'] ... listIDs:');
                    error( nonCachedIDs );
                    error( err);

                    if (onError) onError(err);
                    dfd.reject(err);
                });

        } // end if err on sql operation

    });

    return dfd;
}



/**
 * @function update
 *
 * Update an entry in the proper table for the given object key (objKey).
 *
 * This is an Asynchronous method.
 *
 * @param {string} objKey  The Object Key of the object definition we are requesting
 * @param {int} id The primary key value of the object to update
 * @param {obj} params An object with 'column_name':'value' pairs of the entry to create.
 * @param {fn} onSuccess An optional callback to call with the data.
 * @param {fn} onError An optional callback to call in the event of an error.
 * @return {deferred}
 */
HRiS.Objects.update = function ( objKey, id, params, onSuccess, onError) {
    var dfd = $.Deferred();

//console.log('key:'+objKey);
//console.log(params);

    var tInfo = objects[objKey];

    if ('undefined' == typeof tInfo) {

        // Provided objKey is not referencing a valid object in our system!
        var myErr = {
                msg: 'invalid object key ['+objKey+']'
        }
        if (onError) onError(myErr);
        dfd.reject(myErr);

    } else {

        //// reuse our db.update() method to perform the operation:
        // create a dataMgr definition:
        // (see server/dataStore/dataStore_MySQL.js for format)
        // {
        //      dbName: '??',
        //      dbTable:'tableName',
        //      model:{
        //          columnName1:value1,
        //          columnName2:value2,
        //          ...
        //          columnNameN:valueN
        //      }
        //      primaryKey:'column_name',
        //      id:primaryKeyValue
        // }
        var dataMgr = {
//                dbName:AD.Defaults.dbName,
                dbTable:tInfo.table,
                model:params,
                primaryKey:tInfo.pKey,
                id:id
        }

        db.update(dataMgr, function(err, results){

            // if err:
            if (err) {
console.log(err);

                if (onError) onError(err);
                dfd.reject(err);

            } else {
//console.log('update() results:');
//console.log(results);

                if (onSuccess) onSuccess(results);
                dfd.resolve(results);
            }
        });
    }



    return dfd;
}


/**
 * @class hris.server.HRiS.Lookups
 * @parent hris.server.HRiS
 *
 * Our interface to the defined lookup tables and their contents.
 */
HRiS.Lookups = {};



// these link definitions define the urls for an instance of an object.
// these definitions are used to respond to the client side: AD.Comm.API.link() requests
HRiS.publicLinks = {
      findAll: { method:'GET',    uri:'/hris/[object_key]', params:{}, type:'resource' },
      findOne: { method:'GET',    uri:'/hris/[object_key]/[id]', params:{}, type:'resource' },
      create:  { method:'POST',   uri:'/hris/[object_key]', params:{}, type:'action' },
      update:  { method:'PUT',    uri:'/hris/[object_key]/[id]', params:{}, type:'action' },
      destroy: { method:'DELETE', uri:'/hris/[object_key]/[id]', params:{}, type:'action' },
}



/**
 * @class hris.server.subscriptions
 * @parent hris.server
 *
 * A collection of server side subscriptions that respond to different events in the system.
 *
 */
var __doc;

HRiS.allObjectIDs = function (objKey) {

    var dfd = $.Deferred();

    HRiS.Objects.definition(objKey, function(tableInfo){


        var sql = 'SELECT * FROM ' + AD.Defaults.dbName +'.'+tableInfo.table;
        db.runSQL(sql, [], function(err, results, fields) {

            if (err) {
                console.error('allObjectIDs(): had an error');
                console.error(err);
                dfd.reject(err);

            } else {

//console.log(results);

                var ids = [];
                for (var i=0; i<results.length; i++){
                    ids.push(results[i][tableInfo.pKey]);
                }
                dfd.resolve(ids);
            }

        });
    });
    return dfd;
}


///// NOTE: HRiS.Objects._cache  { 'objKey': { #id: {obj} } };
///// TODO: on hris.Object.destroyed : remove all entries in HRiS.Objects._cache[objKey]
///// TODO: on an instance of hris.Object.[objectkey].destroyed: remove entry in HRiS.Objects._cache[objKey][id]
///// TODO: on an instance of hris.Object.[objectkey].updated : remove entry in HRiS.Objects._cache[objKey][id]
///// TODO: on hris.Attribute.*: clear HRiS.Objects._cache[objKey]
///// TODO: on hris.Relationship.* clear HRiS.Objects._cache[objKey_objA],  HRiS.Objects._cache[objKey_objB]
///// TODO: on hris.Attribute.*: clear HRiS.Objects.List[objKey]
///// TODO: on hris.Relationship.*: clear HRiS.Objects.List[objKey_objA], HRiS.Objects.List[objKey_objB]
///// TODO: on hris.Object.destroyed: clear HRiS.Objects.List[objKey]

