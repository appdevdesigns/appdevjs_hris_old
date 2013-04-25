

/**
 * @class [moduleName].client.pages.objectDetails
 * @parent [moduleName].client.pages.objectDetails
 * 
 *  Setup the objectDetails Widget
 */

//steal('/hris/dbadmin/view/objectDetails.ejs').then(function() {

    // Keep all variables and functions inside an encapsulated scope
    (function() {
    
    
        //// Setup Widget:
        AD.Controller.extend('objectDetails', {
    
            
            init: function (el, options) {

                //// Setup your controller here:
                
                // make sure defaults are taken care of
                var defaults = {
                      uid:'objectDetails_uuid_notGiven',
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
                var self = this;

                this.selectedModel = null;
                this.addForm = null;
                this.relationshipMgr = new hris.Relationship();
                
                // insert our DOM elements
                this.insertDOM();

                this.model = new hris.Object();
                this.addForm.ad_form( {
                    dataManager: this.model,
                    dataValid: this.isValid,
                    error: '.text-error',
                    submit: 'button.submit',
                    cancel: 'button.cancel',
                    onSubmit: this.onSubmit,
                    onCancel: function() {
                        self.ADForm.clear();
                        self.element.hide();

                        // Clear the list selection
                        AD.Comm.Notification.publish('dbadmin.object.details.cancelled');

                        return false;
                    }
                } );

                this.ADForm = this.addForm.data( 'ADForm' );

                this.element.hide();
                
                // translate Labels
                // any DOM element that has an attrib "appdLabelKey='xxxx'" will get it's contents
                // replaced with our Label.  Careful to not put this on places that have other content!
                this.xlateLabels();
            },

            isValid: function( data ) {
                return true;
            },

            // Called when the 'Submit' button is clicked
            onSubmit: function( model ) {
                model.save( function(instance, data) {
                    // Save Relationships
                    var callbacks = [];
                    $('#object-relationships tbody tr:visible').each( function(i, el) {
                        var $this = $(this);
                        var rel = new hris.Relationship();
                        rel.loadFromDOM($this);
                        if ($this.hasClass('rel-delete-row')) {
                            // Destroy
                            callbacks.push(rel.destroy());
                        } else {
                            // Update/Create
                            callbacks.push(rel.save());
                        }
                    });
                    $.when(callbacks).then(function(list) {
                        console.log("Relationships done updating");
                    });

                    AD.Comm.Notification.publish('dbadmin.object.changed', instance);
                }, function() {
                    AD.alert('Failed to save Object');
                });
                return false;
            },

            refreshData: function( model ) {
                this.selectedModel = model;
                this.ADForm.setModel( model );
                this.updateRelationshipDropdown();

                // Clear previous relationships
                this.element.find('#object-relationships tbody tr').remove();

                if (model.object_id) {
                    // Add existing relationships
                    var found = hris.Relationship.findAll({objA_id: model.object_id});
                    var self = this;
                    $.when(found).then(function(list){
                        var addRow = function(item) {
                            // TODO: This should be set automatically in the model
                            var found = hris.Object.findOne({object_id: item.objB_id});
                            $.when(found).then(function(obj) {
                                item.objA = self.currentModel;
                                item.objB = obj;
                                self.addRelationshipRow(item);
                            });
                        };
                        for(var i=0; i<list.length; i++) {
                            addRow(list[i]);
                        }
                    });
                }

                // Disable submit button until the user changes something
                this.element.find('button.submit').prop('disabled', true);
            },

            updateRelationshipDropdown: function() {
                var objs = hris.Object.findAll( {} );
                this.element.find( '#add-relationship-dropdown' ).html(
                    this.view( '/hris/dbadmin/view/objectDetails_addList.ejs', { objs: objs } )
                );

                // Attach model to the DOM
                $.when(objs).then(function(list){
                    for(var i=0; i<list.length; i++) {
                        $("#add-relationship-dropdown a[object_id=" + list[i].object_id + "]").data("ad-model", list[i]);
                    }
                });
            },

            insertDOM: function() {
                this.element.html( this.view( '/hris/dbadmin/view/objectDetails.ejs', {} ) );
                this.addForm = $( 'form', this.element );
            },

            // Adds a Relationship to the table
            addRelationshipRow: function(rel) {
                var html = this.view('/hris/dbadmin/view/objectDetails_relationshipRow.ejs', {
                    objB_key: rel.objB.object_key
                } );
                $('#object-relationships tbody').append(html);
                var newRow = this.element.find('#object-relationships tr:last');

                // Set data from the related objects
                if (!rel.objB_label)
                    rel.objB_label = rel.objB.object_key;

                // Bind data
                rel.bindToForm(newRow);
                $('.rel-objB-key', newRow).data('ad-model', rel.objB);

                $('select', newRow).selectpicker();
                this.toggleShowAdvanced($('select', newRow));
            },

            '#object-object_key change': function(el, ev) {
                var value = el.val();
                if ($('#object-object_table').val() == '') {
                    $('#object-object_table').val('hris_' + value);
                }
                if ($('#object-object_pkey').val() == '') {
                    $('#object-object_pkey').val(value + '_id');
                }
            },

            'dbadmin.object.item.selected subscribe': function( msg, model ) {
                //Refresh the form data with the given model and show it
                this.refreshData( model );
                this.element.find('legend').html( AD.Lang.Labels.getLabelHTML('[details.object.title.edit]') );
                this.element.show();
            },

            'dbadmin.object.item.add-new subscribe': function( msg, model ) {
                //Refresh the form data with a new Object model and show it
                this.refreshData( new hris.Object() );
                this.element.find('legend').html( AD.Lang.Labels.getLabelHTML('[details.object.title.new]') );
                this.element.show();
            },

            'dbadmin.attributeset.item.selected subscribe': function(msg, model){
              this.element.hide();
            },

            'dbadmin.attribute.item.selected subscribe': function(msg, model){
              this.element.hide();
            },

            'dbadmin.attributeset.item.add-new subscribe': function( msg, model ) {
                this.element.hide();
            },

            'dbadmin.attribute.item.add-new subscribe': function( msg, model ) {
                this.element.hide();
            },

            // Add a new Relationship
            'a.add-relationship click': function(el, ev) {
                var model = el.data('ad-model');
                var rel = new hris.Relationship();
                rel.objA_id = this.selectedModel.object_id;
                rel.objA = this.selectedModel;
                rel.objB_id = model.object_id;
                rel.objB = model;
                this.addRelationshipRow(rel);

                ev.preventDefault();
            },

            // Hides or shows the "Advanced" icon
            toggleShowAdvanced: function(el) {
                switch(el.val()) {
                case 'belongs_to':
                case 'has_many':
                    el.closest('td').find('.rel-show-advanced').show();
                    break;
                default:
                    el.closest('td').find('.rel-show-advanced').hide();
                    el.closest('td').find('.rel-column-name').hide();
                }
            },

            '#object-relationships select change': function(el, ev) {
                this.toggleShowAdvanced(el);
            },

            // Show Details for Object B
            '.rel-objB-key click': function(el, ev) {
                var model = el.data('ad-model');
                $('#object-list').controller().listController.select(model);
                ev.preventDefault();
            },

            // Hides or shows the div that allows you to select the column_name
            '.rel-show-advanced click': function(el, ev) {
                el.closest('td').find('.rel-column-name').toggle();
            },

            // When the "Delete" button is clicked
            '.rel-delete-btn click': function(el, ev) {
                el.closest('tr').toggleClass('rel-delete-row');
                this.element.find('button.submit').prop('disabled', false);
                ev.preventDefault();
            },

            // Enable the "Save" button when something changes
            ':input change': function(el, ev) {
                this.element.find('button.submit').prop('disabled', false);
            },

            'dbadmin.object.item.deleted subscribe': function( msg, model ) {
                this.element.hide();
            }

        });
        
    }) ();

// });  // end steal
