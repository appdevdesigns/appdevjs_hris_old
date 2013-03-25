

/**
 * @class [moduleName].client.pages.attributeDetails
 * @parent [moduleName].client.pages.attributeDetails
 * 
 *  Setup the attributeDetails Widget
 */

//steal('/hris/dbadmin/view/attributeDetails.ejs').then(function() {

    // Keep all variables and functions inside an encapsulated scope
    (function() {
    
    
        //// Setup Widget:
        AD.Controller.extend('attributeDetails', {
    
            
            init: function (el, options) {

                //// Setup your controller here:
                
                // make sure defaults are taken care of
                var defaults = {
                      uid:'attributeDetails_uuid_notGiven',
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

                this.model = new hris.Attribute();
                this.addForm.ad_form({
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
                        AD.Comm.Notification.publish('dbadmin.attribute.details.cancelled');

                        return false;
                    }
                });

                this.ADForm = this.addForm.data( 'ADForm' );

                this.element.hide();
                
                // translate Labels
                // any DOM element that has an attrib "appdLabelKey='xxxx'" will get it's contents
                // replaced with our Label.  Careful to not put this on places that have other content!
                this.xlateLabels();
            },
            
            insertDOM: function() {
                
                this.element.html(this.view('/hris/dbadmin/view/attributeDetails.ejs', {}));
                this.addForm = $( 'form', this.element );
                this.element.find( 'select' ).selectpicker();
            },
            
            isValid: function( data ) {
                return true;
            },

            // Called when the 'Submit' button is clicked
            onSubmit: function( model ) {
                model.save( function(instance, data) {
                    AD.Comm.Notification.publish('dbadmin.attribute.changed', instance);
                }, function() {
                    AD.alert('Failed to Save');
                });
                return false;
            },

            refreshData: function( model ) {
                this.selectedModel = model;
                this.ADForm.setModel( model );
                this.element.find('select').change();   //XXX: bindToForm doesn't call change() on selects

                // Disable submit button until the user changes something
                this.element.find('button.submit').prop('disabled', true);
            },

            // Show the view for editing the selected item
            'dbadmin.attribute.item.selected subscribe': function(msg, model){
                this.refreshData( model );
                this.element.find('legend').html( AD.Lang.Labels.getLabelHTML('[details.attribute.title.edit]') );
                this.element.show();
            },

            // Show the view for creating a new instance
            'dbadmin.attribute.item.add-new subscribe': function( msg, model ) {
                // Set up the new instance based on its parent
                var newModel = new hris.Attribute();
                var parent = $('#attribute-set-list').controller().selectedModel;
                newModel.attr('attributeset_id', parent.attributeset_id);
                newModel.attr('attribute_column', parent.attributeset_key + '_');

                // Display it
                this.refreshData( newModel );
                this.element.find('legend').html( AD.Lang.Labels.getLabelHTML('[details.attribute.title.new]') );
                this.element.show();
            },

            'dbadmin.object.item.selected subscribe': function(msg, model){
                this.element.hide();
            },

            'dbadmin.attributeset.item.selected subscribe': function(msg, model){
                this.element.hide();
            },

            'dbadmin.object.item.add-new subscribe': function( msg, model ) {
                this.element.hide();
            },

            'dbadmin.attributeset.item.add-new subscribe': function( msg, model ) {
                this.element.hide();
            },

            'dbadmin.attribute.item.deleted subscribe': function( msg, model ) {
                this.element.hide();
            },

            // Enable the "Save" button when something changes
            ':input change': function(el, ev) {
                $('button.submit').prop('disabled', false);
            },

            // Called when the datatype is changed
            'select change': function(el, ev) {
                this.showOrHideMETA();
            },

            // Hide/show the META field depending on the value of the datatype field
            showOrHideMETA: function() {
                if (this.element.find('select').val() == 'LOOKUP') {
                    this.element.find('.attribute-meta-div').show();
                } else {
                    this.element.find('.attribute-meta-div').hide();
                }
            } 

        });
        
    }) ();

// });  // end steal
