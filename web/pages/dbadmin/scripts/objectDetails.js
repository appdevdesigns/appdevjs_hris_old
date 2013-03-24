

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
                    AD.Comm.Notification.publish('dbadmin.object.changed', instance);
                }, function() {
                    AD.alert('Failed to Save');
                });
                return false;
            },

            refreshData: function( model ) {
                this.selectedModel = model;
                this.ADForm.setModel( model );
            },
            
            insertDOM: function() {
                this.element.html( this.view( '/hris/dbadmin/view/objectDetails.ejs', {} ) );
                this.addForm = $( 'form', this.element );
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


//// To setup default functionality
/*
            '.col1 li dblclick' : function (e) {
            
                this.element.find('#someDiv').append(e);
            },
*/

//// To Add Subscriptions:
/*
            'apprad.module.selected subscribe': function(message, data) {
                // data should be { name:'[moduleName]' }
                this.module = data.name;
                this.setLookupParams({module: data.name});
            },
*/
        });
        
    }) ();

// });  // end steal
