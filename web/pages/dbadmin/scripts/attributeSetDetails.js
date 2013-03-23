

/**
 * @class [moduleName].client.pages.attributeSetDetails
 * @parent [moduleName].client.pages.attributeSetDetails
 * 
 *  Setup the attributeSetDetails Widget
 */

//steal('/hris/dbadmin/view/attributeSetDetails.ejs').then(function() {

    // Keep all variables and functions inside an encapsulated scope
    (function() {
    
    
        //// Setup Widget:
        AD.Controller.extend('attributeSetDetails', {
    
            
            init: function (el, options) {

                //// Setup your controller here:
                
                // make sure defaults are taken care of
                var defaults = {
                      uid:'attributeSetDetails_uuid_notGiven',
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

                this.model = new hris.Attributeset();
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
                
                this.element.html(this.view('/hris/dbadmin/view/attributeSetDetails.ejs', {}));
                this.addForm = $( 'form', this.element );
                
            },

            isValid: function( data ) {
                return true;
            },

            onSubmit: function( model ) {
                model.save( function( data ) {
                    console.log( data );
                } );
                return false; //prevent defaults
            },

            refreshData: function( model ) {
                this.selectedModel = model;
                this.ADForm.setModel( model );
                
                var self = this;
                
                hris.Object.findOne({object_id: model.object_id})
                .then(function(parent) {
                    self.element.find('#parent-key').html(parent.object_key);
                })
                .fail(function(err){
                    AD.alert("Error");
                    console.log('error: ' + err);
                });
            },

            'dbadmin.attributeset.item.selected subscribe': function(msg, model){
              this.refreshData( model );
              this.element.show();
            },

            'dbadmin.attributeset.item.add-new subscribe': function( msg, model ) {
                //Refresh the form data with a new Object model and show it
                this.refreshData( new hris.Attributeset() );
                this.element.show();
            },

            'dbadmin.object.item.selected subscribe': function(msg, model){
              this.element.hide();
            },

            'dbadmin.attribute.item.selected subscribe': function(msg, model){
              this.element.hide();
            },

        });

    }) ();
