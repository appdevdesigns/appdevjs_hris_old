
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
    // data only contains the { id:xx } but we want to provide a guid
    // to modules as well, so we manually look it up:
    var Relationship = AD.Model.List['hris.Relationship'];

    Relationship.findOne({id:data.id}, function(relationship) {
      if (relationship) {

        var relationshipId = relationship.relationship_id;
        var relationshipObjAId = relationship.objA_id;
        var relationshipObjBId = relationship.objB_id;
        var relationshipType = relationship.relationship_type;

        var Object = AD.Model.List['hris.Object'];

        Object.findOne({id:relationshipObjAId}, function(objA) {
          Object.findOne({id:relationshipObjBId}, function(objB) {

            // Add a foreign key to the child table if it doesn't already exist
            switch(relationshipType) {
              case 'belongs_to':
                var params = {objA_id: objB.object_id,
                              objB_id: objA.object_id,
                              relationship_type: 'has_many'};

                var found = Relationship.findAll(params)

                $.when(found).then(function(relationships) {
                  if (typeof relationships[0] == 'undefined') {
                    console.log('creating has_many')
                    // Create the inverse
                    Relationship.create(params, function(id) {
                      console.log(id)
                    }, function(err) {
                      console.log(err)
                    });
                  }
                });

                // Add the foreign key column
                var sql = 'ALTER TABLE '+AD.Defaults.dbName+'.'+ objA.object_table + ' ADD ';
                sql += objB.object_pkey + ' int(10) UNSIGNED;';
                // Add an index
                sql += 'ALTER TABLE '+AD.Defaults.dbName+'.'+ objA.object_table + ' ADD INDEX (' + objB.object_pkey + ');' ;
                console.log(sql)
                db.runSQL(sql,[], function(err, results, fields){
                  if (err) {
                    console.log(err);
                  }
                });

                break;

              case 'has_many':
                var params = {objA_id: objB.object_id,
                              objB_id: objA.object_id,
                              relationship_type: 'belongs_to'};

                var found = Relationship.findAll(params)

                $.when(found).then(function(relationships) {
                  if (typeof relationships[0] == 'undefined') {
                    // Create the inverse
                    Relationship.create(params, function(id) {
                      console.log(id)
                    }, function(err) {
                      console.log(err)
                    });
                  }
                });

                // don't need to add a column because we added it on belongs_to
                break;
              }
            });
          });
        }
      });
    }
    hrisHub.subscribe('hris.Relationship.created', newRelationship);


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
    hrisHub.subscribe('hris.Relationship.destroyed', deleteRelationship);

  } // end setup()




