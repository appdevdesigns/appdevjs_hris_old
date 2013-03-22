

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

                this.model = new hris.Object();
                this.addForm.ad_form({
                    dataManager: this.model,
                    dataValid: this.isValid,
                    error: '.text-error',
                    submit: 'button.submit',
                    cancel: 'button.cancel',
                    onSubmit: this.onSubmit,
                    onCancel: function() {
                        console.log( 'Canceled' );
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
                
            },
            
            isValid: function( data ) {
                return true;
            },

            onSubmit: function( model ) {
                console.log( model );
                model.save( function( data ) {
                    console.log( data );
                } );
            },

            refreshData: function( model ) {
                this.selectedModel = model;
                this.ADForm.setModel( model );
            },
            
            'dbadmin.attribute.item.selected subscribe': function(msg, model){
                this.refreshData( model );
                this.element.show();
              },

              'dbadmin.object.item.selected subscribe': function(msg, model){
                this.element.hide();
              },

              'dbadmin.attributeset.item.selected subscribe': function(msg, model){
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
