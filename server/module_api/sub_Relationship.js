
/**
 * @class hris.server.subscriptions.Relationship
 * @parent hris.server.subscriptions
 *
 * A subscriptions that respond to different Relationship events in the system.
 *
 */
var log = AD.Util.Log;
var logDump = AD.Util.LogDump;
var db = AD.Model.Datastore;
var $ = AD.jQuery;

var hrisRelationship = new AD.App.Service({});
module.exports = hrisRelationship;

var hrisHub = null;   // Module's Notification Center (note: be sure not to use this until setup() is called)


var runSQL = function(sql) {
    console.log('sql:'+sql);
    db.runSQL(sql,[], function(err, results, fields){
        if (err) {
          console.log(err);
        }
    });
}

//-----------------------------------------------------------------------------
hrisRelationship.setup = function() {
  // setup any handlers, subscriptions, etc... that need to have passed in
  // private resources from the Module:
  //  this.hub = the module's Notification Hub
  //  this.listModels = the list of Model objects in the current Module
  //

  hrisHub = this.module.hub;  // <-- should have a reference to our Module

  console.log('started hrisRelationship hub');

  /**
   * @function hris.Relationship.created
   *
   * This service will make sure the DB table associated with this Relationship is
   * physically updated with the new column.
   *
   * @param {string} event the notification key this matched
   * @param {obj} data the primary key id of the newly created relationship { id:1 }
   */
    var newRelationship = function(event, data) {

      console.log('newRelationship');

      var Relationship = AD.Model.List['hris.Relationship'];

      Relationship.findOne({id:data.id}, function(relationship) {
          if (relationship) {

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
                          var sql = 'ALTER TABLE '+AD.Defaults.dbName+'.'+ objA.object_table + ' ADD ';
                          sql += objB.object_pkey + ' int(11) UNSIGNED';
                          runSQL(sql);

                          // Add an index
                          sql = 'ALTER TABLE '+AD.Defaults.dbName+'.'+ objA.object_table + ' ADD INDEX (' + objB.object_pkey + ')' ;
                          runSQL(sql);
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
              var found = Relationship.findAll(params);
              $.when(found).then(function(relationships) {

                  if (typeof relationships[0] == 'undefined') {

                      console.log('  creating '+params.relationship_type+' relationship');

                      Relationship.create(params, function(data) {
                          console.log('  -> created!  new rship id:'+data.id);
                      }, function(err) {
                          console.log(err)
                      });
                  }
              });

            } // if rship
        }); // end rship findOne
    }
    hrisHub.subscribe('hris.Relationship.created', newRelationship);

/*
    var deleteRelationship = function(event, data) {
      console.log('======')
      console.log(data)

      var Relationship = AD.Model.List['hris.Relationship'];

      var Object = AD.Model.List['hris.Object'];

      Object.findOne({id:data.objA_id}, function(objA) {
        Object.findOne({id:data.objB_id}, function(objB) {
          // Delete reciprocal relationship
          switch(data.relationship_type) {
            case 'belongs_to':
              var params = {objA_id: objB.object_id,
                            objB_id: objA.object_id,
                            relationship_type: 'has_many'};

              Relationship.findAll(params, function(relationships) {
                if (typeof relationships[0] != 'undefined') {
                  Relationship.destroy(relationships[0].relationship_id)
                }
              });
              break;

            case 'has_many':
              var params = {objA_id: objB.object_id,
                            objB_id: objA.object_id,
                            relationship_type: 'belongs_to'};

              Relationship.findAll(params, function(relationships) {
                if (typeof relationships[0] != 'undefined') {
                  Relationship.destroy(relationships[0].relationship_id)
                }
              });
              break;
           }
        });
      });
    }
*/
    var deleteRelationship = function(event, data) {

        var Relationship = AD.Model.List['hris.Relationship'];
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

        Relationship.findAll(params, function(relationships) {
            if (typeof relationships[0] != 'undefined') {
                relationships[0].destroy();
            }
        });

    }
    hrisHub.subscribe('hris.Relationship.destroyed', deleteRelationship);

  } // end setup()




