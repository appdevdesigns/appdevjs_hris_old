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
Relationship.publicLinks = function () {
    return  {
        findAll: { method:'GET',    uri:'/hris/api/relationship',        params:{}, type:'resource' },
        findOne: { method:'GET',    uri:'/hris/api/relationship/[id]',   params:{}, type:'resource' },
        create:  { method:'POST',   uri:'/hris/api/relationship',        params:{}, type:'action' },
        update:  { method:'PUT',    uri:'/hris/api/relationship/[id]',   params:{}, type:'action' },
        destroy: { method:'DELETE', uri:'/hris/api/relationship/[id]',   params:{}, type:'action' },
    }
}



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

var sqlCommands = {
        addForeignKey : 'ALTER TABLE '+AD.Defaults.dbName+'.[table]  ADD [fkey] int(11) UNSIGNED',
        addIndex: 'ALTER TABLE '+AD.Defaults.dbName+'.[table] ADD INDEX ([fkey]) '
}

//.onCreated() : is called each time an instance of Attribute.model is created
//Relationship.onCreated = function (ev, modelInstance) {}
Relationship.onCreated = function(event, relationship) {

console.log('::relationship.onCreated()');

            var relationshipType = relationship.relationship_type;
            var params;

            // Add a foreign key to the child table if it doesn't already exist
            switch(relationshipType) {

                case 'belongs_to':

                    // Define the inverse relationship
                    params = {objA_id: relationship.objB_id,
                              objB_id: relationship.objA_id,
                              relationship_type: 'has_many'};

                    //// Now update the tables
                    var Object = AD.Model.List['hris.Object'];
                    var objaFound = Object.findOne({id:relationship.objA_id});
                    var objbFound = Object.findOne({id:relationship.objB_id});
                    $.when(objaFound, objbFound).then(function(objA, objB){

                        // Add the foreign key column
                        var rData = {table:objA.object_table, fkey:objB.object_pkey};
                        var sql = AD.Util.String.render(sqlCommands.addForeignKey, rData);
console.log('sql:'+sql);
                        $.when(runSQL(sql)).then(function(data){

                        // Add an index
                            sql = AD.Util.String.render(sqlCommands.addIndex, rData);
console.log('sql:'+sql);
                            runSQL(sql);
                        });
                    });
                    break;

                case 'has_many':

                    // Define the inverse relationship
                    params = {objA_id: relationship.objB_id,
                              objB_id: relationship.objA_id,
                              relationship_type: 'belongs_to'};

                    // NOTE: don't need to add a column because we added it on belongs_to

                    break;
            }

            //// Create the Inverse Relationship
            var found = Relationship.model.findOne(params);
            $.when(found).then(function(relationship) {

                if (!relationship) {

                    console.log('  creating '+params.relationship_type+' relationship');

                    var newRship = new Relationship.model(params);
                    newRship.save(function(data) {
                        console.log('  -> created!  new rship id:'+data.id);
                    }, function(err) {
                        console.log(err)
                    });
                }
            });

}

//.onUpdated() : is called each time an instance of Attribute.model is created
//Relationship.onUpdated = function (ev, modelInstance) {}


//.onDestroyed() : is called each time an instance of Attribute.model is created
//Relationship.onDestroyed = function (ev, modelInstance) {}
Relationship.onDestroyed = function(event, data) {


    //// NOTE: we are deleting the rship entry, but not
    //// modifying the actual tables ... for data recovery issues.

    var params;

    // Delete reciprocal relationship
    switch(data.relationship_type) {
        case 'belongs_to':
            params = {  objA_id: data.objB_id,
                        objB_id: data.objA_id,
                        relationship_type: 'has_many'};
            break;

        case 'has_many':
            params = {  objA_id: data.objB_id,
                        objB_id: data.objA_id,
                        relationship_type: 'belongs_to'};
            break;
    }

    console.log('... deleting reciprocal Rship:');

    Relationship.model.findOne(params, function(relationship) {
        if (relationship) {
            relationship.destroy();
        }
    });

}



var runSQL = function(sql) {
    var dfd = $.Deferred();

    console.log('sql:'+sql);
    db.runSQL(sql,[], function(err, results, fields){
        if (err) {
          console.log(err);
          dfd.reject(err);
        } else {
            dfd.resolve(results);
        }
    });
    return dfd;
}
