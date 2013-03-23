
/**
 * @class hris.server.Object.findAll
 * @parent hris.server.Object
 *
 * Performs the findAll/findOne action for a defined object in the system.
 *
 * @apprad resource:object // @appradend (please leave)
 * @apprad action:findAll // @appradend (please leave)
 * @apprad url:[url] // @appradend
 */


////
//// hrisPerson
////
//// Performs the actions for [resource].
////
////    /[resource]
////
////


var log = AD.Util.Log;
var logDump = AD.Util.LogDump;
var error = AD.Util.Error;
var errorDump = AD.Util.ErrorDump;

var $ = AD.jQuery;

var HRiS = null;
var errorMSG = null;


var hrisObjectFindAll = new AD.App.Service({});
module.exports = hrisObjectFindAll;


var actionFind = function(req, res, next) {
    // all we do here is indicate this is a 'find' action

    req.aRAD.action = 'find';
    next();
}



////---------------------------------------------------------------------
var whichObject = function (req, res, next) {
    // Prepare the rest of the method to use the given object
    //
    // when we are done: req.aRAD.objectKey = :objKey
    log(req, '   - whichObject(): object_find checking for object');

    HRiS.Express.whichObject(req, res, next);

}



////---------------------------------------------------------------------
var hasPermission = function (req, res, next) {
    // Verify the current viewer has permission to perform this action.

if (!AD.Defaults.authRequired) next();
else {
    // Viewer needs :
    // hris.[objKey].[action] permission

    var objKey = req.aRAD.objectKey;
    var action = req.aRAD.action;

    var permission = 'hris.' + objKey + '.' + action;
    var viewer = AD.Viewer.currentViewer(req);

    log(req, '   - hasPermission(): checking for : '+permission);

    // if viewer has 'hris.person.findAll' action/permission
    if (viewer.hasTask(permission)) {

        log(req, '     viewer has permission: '+permission);
        next();

    } else {

        errorDump(req, '     viewer failed permission check!');
        errorMSG(req, res, 'ERR_NO_PERMISSION', AD.Const.HTTP.ERROR_FORBIDDEN);  // 403 : you don't have permission

    } // end if
}
}



////---------------------------------------------------------------------
var verifyParams = function (req, res, next) {
    // Make sure all required parameters are given before continuing.

	var listRequiredParams = {
//	        'test':['exists','notEmpty','isNumeric'],
//	        'test2':['notEmpty']
	}; // each param is a string
	AD.Util.Service.validateParamsExpress(req, res, next, listRequiredParams);
};



////---------------------------------------------------------------------
var initResults = function (req, res, next) {
    // prepare all necessary data structures for processing this request

    // the final json data obj to return
    req.aRAD.results = [];


    next();
};



////---------------------------------------------------------------------
var getViewerScope = function (req, res, next) {
    // Gather any scope limitations for this viewer.  We will track the viewer's
    // scope as a list of obj_id's they are allowed to view.
    //
    // the result of this step should be :
    //  req.aRAD.scopeArray = [1,2,3,...];  // an array of obj_id's this viewer is allowed to see

    var viewer = AD.Viewer.currentViewer(req);
    log(req, '   - getting scope:');
    log(req, '     viewer.guid['+viewer.guid()+']');


    var objKey = req.aRAD.objectKey;
    var action = req.aRAD.action;

    /*

    var viewer = AD.Viewer.currentViewer(req);
    var Scopes = AD.Model.list['hris.Scopes'];
    Scopes.findAll({
            viewer_guid: viewer.guid(),
            object_key: objKey,
            action: action
        }, function(data) {

        req.aRAD.hris.scope = data.scopes;  // ??
        next();

    }, function(err) {

        req.aRAD.hris.scope = 'default scope'; // ??
        next();
    });

    */

//// for testing, we just send back all our matches for this object:

    // an obj with findAll.attr format(  {person_id:{'in':[1,2,3,4,5]}} ) ?
//    req.aRAD.scopeArray = [1,2,3]; //'(1=1)';
    var found = HRiS.allObjectIDs(objKey);
    $.when(found).then(function(ids){
        req.aRAD.scopeArray = ids;
        next();
    });
};



//var tableInfo = null;
/*

{
    'pkey':'person_id',
    'table':'hris2_person',

    // 1-1 relationships are found on main person table
    'one': {
            'Names': ['person_surname', 'person_givenname', ... ],
            'Health': ['person_bloodtype', 'person_condition',...],
            },

    // 1-many relationships are found in external tables and linked by person_id
    'many':{


            },

    // attributes: list all the possible fields
    'attributes': {
        person_surname:{ rship:'one', set:'Names', table:'hris_person' },
        person_givenname:'',
        person_bloodtype:'',
        person_condition:'',

    },

    // Sets: list of the AttributeSets for this object
    'sets': {
        Names:{},
        Health:{},
        Passport:{},
    }
}

 */
//var db = AD.Model.Datastore;

//// TODO: would love to see a var multiTableModel = module_Resource.join(model2, 'left', 'primaryKey'); // 'inner join', callingModule.primaryKey are defaults
////       multiTableModel.findAll({}, onsuccess(), onError());
////       also can:  model1.join(model2.join(model3) );
////---------------------------------------------------------------------
/*var gatherTableInfo = function (req, res, next) {
    // figure out the table join info for a person (based upon the defined Attribute Sets)

/*    var attributes = AD.Model.List['hris.Attributeset'];
    console.log(attributes);
    var tableAttributeSet = attributes.tables.data;
    console.log();
    console.log('...........');
    console.log(tableAttributeSet);

    var objKey = req.aRAD.objectKey;

    log(req, '   - checking table info for object['+objKey+']');

    var loaded = HRiS.Objects.definition(objKey);
    $.when(loaded)
        .then(function(tableInfo){
console.log();
console.log( tableInfo);

            if( tableInfo) {

                log(req, '     table info found.');
                req.aRAD.tableInfo = tableInfo;
                next();

            } else {

                // no tableInfo found for this object ... :(
                errorDump(req, '     no object ['+objKey+'] found ...');

                // service response
                var errorData = { errorID:55, errorMSG:'no object ['+objKey+'] found ...' };
                AD.Comm.Service.sendError(req, res, errorData, AD.Const.HTTP.ERROR_NOTFOUND ); // 404

            }
        })
        .fail(function(err){

            // server console message
//            error(req, 'sql['+sql+']');
            error(req, '     error finding table info ...');
            errorDump(req, err);

            // service response
            var errorData = { errorID:55, errorMSG:'error finding table info', data:err };
            AD.Comm.Service.sendError(req, res, errorData, AD.Const.HTTP.ERROR_SERVER ); // 500 : our fault

        });


};

*/


////---------------------------------------------------------------------
var computeObjectFilter = function (req, res, next) {
    // create an sql to pull together all Tables necessary to pull the matching ppl from the DB
    // the goal of this step is to find which of the objects this viewer can view
    // that match the given conditions.
    //
    // the result should be:
    //  req.aRAD.filteredScopeArray = [2,3,4,...];  // array of person_id's that match

//console.log('computingObjectFilter()');

    var objKey = req.aRAD.objectKey;

    var loaded = HRiS.Objects.filteredIDs(objKey, req.query, req.aRAD.scopeArray);
    $.when(loaded)
        .then(function(filteredScope){

//console.log();
//console.log(' filteredScope:');
//console.log(filteredScope);

            if (filteredScope == null) {

                req.aRAD.filteredScopeArray = req.aRAD.scopeArray;

            } else {

                req.aRAD.filteredScopeArray = filteredScope;
            }

            next();
        })
        .fail(function(err){

            // service response
            //var errorData = { errorID:55, errorMSG:'error finding filtered ids', data:err };
            //AD.Comm.Service.sendError(req, res, errorData, AD.Const.HTTP.ERROR_SERVER ); // 500 : our fault
            errorMSG(req, res, 'ERR_FILTERED_IDS', err, AD.Const.HTTP.ERROR_SERVER); // 500 : our fault

        });

};



////---------------------------------------------------------------------
var computeNonCachedObjects = function (req, res, next) {
    // find which desired person id's don't already exist in our cache
    //
    // we should end up with:
    // req.aRAD.idsNotFound = [1,2,3,...];  // all the ids of ppl that have not been cached

//console.log('computeNonCachedObjects()');
//    var objKey = req.aRAD.objectKey;
//    var filteredList = req.aRAD.filteredScopeArray;

//    var notFound = HRiS.Objects.nonCachedIDs(objKey, filteredList);

//    req.aRAD.idsNotFound = notFound;  //these are the objects we need to pull out
req.aRAD.idsNotFound=req.aRAD.filteredScopeArray;  // force caching of all objects
    next();
};



////---------------------------------------------------------------------
var getNonCachedObjects = function (req, res, next) {
    // find which desired person id's don't already exist in our cache
    //
    // by the end of this step, our cache should now contain all the requested
    // person_ids

//console.log('getNonCachedObjects()');
    var objKey = req.aRAD.objectKey;
    var ids = req.aRAD.idsNotFound;

    log(req, '   - attempting to cache new objects');

    var done = HRiS.Objects.cache(objKey, ids);
    $.when(done)
        .then(function(){

            log(req, '     objects cached');
            next();
        })
        .fail(function(err){

            // server console message
            error(req, '     error caching objects ...');
            errorDump(req, err);

            // service response
            // var errorData = { errorID:55, errorMSG:'error finding non cached objects', data:err };
            // AD.Comm.Service.sendError(req, res, errorData, AD.Const.HTTP.ERROR_SERVER ); // 500 : our fault
            errorMSG(req, res, 'ERR_NON_CACHED_OBJ', err, AD.Const.HTTP.ERROR_SERVER); // 500 : our fault

        });

};



////---------------------------------------------------------------------
var gatherResultsFromCache = function (req, res, next) {
    // gather all our objects from the cache
    //
    // we should end up with:
    // req.aRAD.objFound = { id1:{person_obj}, id2:{person_obj} };  // all the ids of ppl that have not been cached

//console.log('gatherResultsFromCache()');
    var objKey = req.aRAD.objectKey;
    var filteredList = req.aRAD.filteredScopeArray;

    /*
    var found = HRiS.Objects.cachedObjects(objKey, filteredList);

    req.aRAD.objFound = found;  // final list of ren

    next();
    */

    var done = HRiS.Objects.packageObjects(objKey, filteredList);
    $.when(done)
        .then(function(found){
            req.aRAD.objFound = found;
            next();
        })
        .fail(function(err){

            errorMSG(req, res, 'ERR_PACKAGING_OBJ', err, AD.Const.HTTP.ERROR_SERVER); // 500 : our fault

        });

};




////
////Proposed format of objects :
////

////A base definition of an object includes:
////  - it's primary key (auto created by system)
////  - all the defined attributes
////  - a special _links: map that provides relevant actions for this object
////  - a special _labels: map that provides language relevant label info for this object's properties

////An example of a Passport object would be:
/*
  {
      passport_id:1,
      passport_number:'12344556',
      passport_issuedate:'date',
      _links:{
          self:{ method:'GET', uri:'/hris/passport/1', params:{}, type:'resource' }, // how to access itself
          create:  {},
          update:  {}, // update this object
          destroy: {}, // destroy this object
      },
      _labels:{
          // NOTE: passport_id is internal, and no label exists for this.
          passport_number:'Number',
          passport_issuedate:'Issue Date',
      }
  }
*/


////Some objects will be related to other objects.  So when
////requesting those objects, we embedd the related objects with them

////An example of a Person object that is related to Passports:
/*

{
  person_id:1,
  person_givenname:'Jason',
  person_surname:'Bourne',
  passport:{
      1:{
          passport_id:1,
          passport_number:'12344556',
          passport_issuedate:'date',
          _links:{
              self:{ uri:'/hris/passport/1' },
              create: {},
              update: {},
              destroy: {},
          },
          _labels:{
              passport_number:'Number',
              passport_issuedate:'Issue Date',
          }
      },
      2:{passport_id:2, passport_number:'44455566', passport_issuedate:'date2'}
  },
  _links:{
      // base links for this individual object
      'self':{}
      'create':{},
      'update':{},
      'destroy':{},

      // links on how to access it related objects
      'names':{ uri:'/hris/[objkey]/[id]/[attributesetKey]' },
      'passport':{ uri:'/hris/[objkey]/', param:{ person_id:[person_id] }},

  },
  _labels:{
      // labels for object's attributes
      person_givenname:'Givenname',
      person_surname:'Surname',

      // labels for each of the related objects
      passport:'Passport',
  }
}
*/


////---------------------------------------------------------------------
var formatResults = function (req, res, next) {
    // now format our renFound to only return the proper data
    //
    // conditions:
    //      if a filter was given that was part of a 'many' rship, only include entries matching the filter
    //
    // links:
    //      additional links can be defined for a person, add a set of { _links:[] } to each person obj
    //
    // we should end up with:
    // req.aRAD.results = [{person_obj}, {person_obj},...];  // each properly formatted person obj

//console.log('formatResults()');

    var found = req.aRAD.objFound;

    var objKey = req.aRAD.objectKey;

    // objects returned from our HRiS.* tools are an object map:
    // {
    //      id  : {obj},
    //      id2 : {obj2},
    //      ...
    //      idN : {objN}
    // }

    // we need to return an array instead:
    // [ {obj}, {obj2}, ..., {objN} ];

    var resultArray = [];
    for(var id in found) {
        resultArray.push( found[id] );
    }

    req.aRAD.results = resultArray;  // [ {person_id:1, Names:{person_givenname:'Jason', person_surname:'Bourn'}} ];  // final list of ren

    next();

};


// these are our publicly available /site/api/hris/person  links:
// note: in below definitions, any value in [] is a templated value replaced with the instances value for that attribute: [id] = obj.id;
// note: params are defined like:  params:{ requiredParam1:'[requiredParam1]', requiredParam2: '[requiredParam2]'}
var publicLinks = {
//        findAll: { method:'GET',    uri:'/hris/person', params:{}, type:'resource' },
//        findOne: { method:'GET',    uri:'/hris/person/[id]', params:{}, type:'resource' },
//        create:  { method:'POST',   uri:'/hris/person', params:{}, type:'action' },
//        update:  { method:'PUT',    uri:'/hris/person/[id]', params:{module:'hris', page: '[page]'}, type:'action' },
//        destroy: { method:'DELETE', uri:'/hris/person/[id]', params:{}, type:'action' },
        findAll: { method:'GET',    uri:'/hris/[object_key]', params:{}, type:'resource' },
        findOne: { method:'GET',    uri:'/hris/[object_key]/[id]', params:{}, type:'resource' },
}




var gApp = app;  // global refrence to our app,  app in setup() is a mock object that gets mapped to global app later.

hrisObjectFindAll.setup = function( app ) {

    HRiS = this.module.HRiS;
    errorMSG = this.module.Error;

    var urlFindAll = HRiS.publicLinks.findAll.uri.replace('[id]',':id').replace('[object_key]', ':hrisObjKey');
    var urlfindOne = HRiS.publicLinks.findOne.uri.replace('[id]',':id').replace('[object_key]', ':hrisObjKey');



    var findAllStack = [
            AD.App.Page.serviceStack,  // authenticates viewer, and prepares req.aRAD obj.
            actionFind,                // indicate this is a find action
            HRiS.Express.whichObject,  // figure out which object this url is about
            hasPermission,             // make sure we have permission to access this object
            verifyParams,              // make sure all required params are given
            initResults,               // prepare the data structure for our results
            getViewerScope,            // gather the viewer's scope (who they can see in the DB)

    // beginning of generic object gathering process:
            computeObjectFilter,       // compute the base person filter from given parameters (just find which peopel_id's we should be getting)
            computeNonCachedObjects,   // find which of the persons are not already in our cache
            getNonCachedObjects,       // pull all data related to a person for our non Cached ren

    // at this point we have all our desired ren in our cache
            gatherResultsFromCache,    // pull together the desired set of ppl
            formatResults,             // package the results in the desired json format
        ];


    //// hrisObjKey != 'api'  so we skip /hris/api/* routes
    gApp.param('hrisObjKey',/^(?:(?!api).)*$/);

//    var urlFindAllRegExp = '/hris/:objKey^(?!api)';
	////---------------------------------------------------------------------
	app.get(urlFindAll, findAllStack, function(req, res, next) {
	    // test using: http://localhost:8088/hris/person

	    var objKey = req.aRAD.objectKey;

	    // By the time we get here, all the processing has taken place.
	    logDump(req, 'finished /hris/object ['+objKey+'] (findAll)');


	    // send a success message
	    AD.Comm.Service.sendSuccess(req, res, req.aRAD.results );

	});


	////---------------------------------------------------------------------
    app.get(urlfindOne, findAllStack, function(req, res, next) {
        // test using: http://localhost:8088/hris/person/1

        var objKey = req.aRAD.objectKey;

        // By the time we get here, all the processing has taken place.
        logDump(req, 'finished /hris/object ['+objKey+'] (findOne)');


        // send a success message
        AD.Comm.Service.sendSuccess(req, res, req.aRAD.results );

    });

/*
    ////Register the public site/api
    this.setupSiteAPI('person', publicLinks);
*/
} // end setup()



//// TODO: on a new Object definition
////  - on object.create(): when creating a new obj definition, then
////    - this.setupSiteAPI('object_key', publicLinks);
////    - create a table:  hris_[object_key], primaryKey:[object_key]_id
////    - have hris.cache[object_key] created
////
////  - on attribute.create():
////    - add attribute_key to hris_[object_key] table
////    - if attribute_key is type UUID, then update all rows
////    - have hris.cache[object_key] cleared
////    - have hris.table[object_key] cleared


//// TODO: dont forget to return create, update, destroy services to
////       proper urls

