

/**
 * @class [moduleName].client.pages.attributeList
 * @parent [moduleName].client.pages.attributeList
 * 
 *  Setup the attributeList Widget
 */

//steal('/hris/objectcreator/view/attributeList.ejs').then(function() {

    // Keep all variables and functions inside an encapsulated scope
    (function() {
    
    
        //// Setup Widget:
        AD.Controller.extend('attributeList', {
    
            
            init: function (el, options) {

                //// Setup your controller here:
                
                // make sure defaults are taken care of
                var defaults = {
                      uid:'attributeList_uuid_notGiven',
/*                      
                      dataManager:null, // the ListIterator of the data to display
                      template:null,	// view(): the default view template
                      templateEdit:null,// veiw(): the edit panel view
                      templateDelete:null, // view():  the delete confirmation view
                      title: null      // the MultilingualLabel Key for the title
*/                      
                };
                var options = $.extend(defaults, options);
                this._super(el, options);
                
                
                this.options = options;

                this.object_id = null;
                this.listAttributes = []; // Models for each of the attributes
                this.listRelationships = []; // Models for each of the related objects
                
                
            },



            'objectcreator.object.selected subscribe': function(msg, model) {
                // If the selected object has changed, update the attributes
                // and relationships.
                if (this.object_id !== model.object_id) {
                    this.object_id = model.object_id;
                    this.updateAttributes(model);
                    this.updateRelationships(model);
                }

            },
            
            updateRelationships: function(object) {
                var self = this;
                this.listRelationships = [];
                var listDone = [];

                // Find relationships with a belongs_to (this implies a foreign key column)
                hris.Relationship.findAll({objA_id: object.object_id, relationship_type: 'belongs_to'})
                .then(function(list) {
                    // Is it possible for an object to have more than one
                    // belongs to relationship? I would assume no.
                    // anyway, we'll iterate over the list.
                    for (var i = 0; i < list.length; i++) {
                        listDone.push(self.getRelatedObject(list[i]));
                    }
                    $.when.apply($, listDone).then(function() {
                        AD.Comm.Notification.publish('objectcreator.relationships.refresh', self.listRelationships);
                    });

                });
            },

            getRelatedObject: function(model) {
            // Subroutine for finding the Object definition of an object by id
            // Once the Object definition is found, it adds it to the list of
            // relationships.
            // Returns a deferred, which resolves when the object is found
                var dfed = $.Deferred();
                var self = this;
                hris.Object.findOne({object_id: model.objB_id})
                .then(function(item) {
                    self.listRelationships.push(item);
                    dfed.resolve();
                })
                .fail(function() {
                    dfed.reject();
                })
                return dfed;
            },

            updateAttributes: function(object) {
                var self = this;
                this.listAttributes = [];
                var listDone = []; // list of deferred objects

                // Find all attribute sets for this object
                hris.Attributeset.findAll({object_id: object.object_id})
                .then(function(list) {
                    for (var i = 0; i < list.length; i++) {
                        // Each attribute set: Find all the attributes
                        listDone.push(self.getAttributes(list[i]));
                    }
                    // Wait for all the asynchronous calls to complete:
                    $.when.apply($, listDone).then(function() {
                        AD.Comm.Notification.publish('objectcreator.attributeList.refresh', self.listAttributes);
                    });

                });
            },
            
            getAttributes: function(attributeset) {
            // Find all attributes for a particular attribute set
            // Returns a $.Deferred object which resolves when the findAll
            // call is complete
                var dfed = $.Deferred();
                var self = this;
                hris.Attribute.findAll({attributeset_id: attributeset.attributeset_id})
                .then(function(list) {
                    for (var i = 0; i < list.length; i++) {
                        self.listAttributes.push(list[i]);
                    }
                    dfed.resolve();
                })
                .fail(function() {
                    dfed.reject();
                });
                return dfed;
            },
            
        });
        
    }) ();

// });  // end steal
