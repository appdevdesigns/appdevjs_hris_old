

/**
 * @class [moduleName].client.pages.createForm
 * @parent [moduleName].client.pages.createForm
 * 
 *  Setup the createForm Widget
 */

//steal('/hris/objectcreator/view/createForm.ejs').then(function() {

    // Keep all variables and functions inside an encapsulated scope
    (function() {
    
    
        //// Setup Widget:
        AD.Controller.extend('createForm', {
    
            
            init: function (el, options) {

                //// Setup your controller here:
                
                // make sure defaults are taken care of
                var defaults = {
                      uid:'createForm_uuid_notGiven',
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

                this.addForm = null;
                this.object_key = null;
                this.hris_model = null;
                
                // insert our DOM elements
                this.element.hide();
                this.insertDOM();
                
                
                // attach other widgets & functionality here:
                var self = this;
                this.addForm.ad_form( {
                    submit: 'button.submit',
                    cancel: 'button.cancel',
                    onCancel: function() {
                        self.ADForm.clear();
                        self.element.hide();

                        // Clear the list selection
                        AD.Comm.Notification.publish('dbadmin.object.details.cancelled');

                        return false;
                    }
                } );
                this.ADForm = this.addForm.data( 'ADForm' );

                
                
                // translate Labels
                // any DOM element that has an attrib "appdLabelKey='xxxx'" will get its contents
                // replaced with our Label.  Careful to not put this on places that have other content!
                this.xlateLabels();
            },
            

            
            insertDOM: function() {
                
                this.element.html(this.view('/hris/objectcreator/view/createForm.ejs', {}));
                this.addForm = this.element.find('form');
                
            },
            
            'objectcreator.object.selected subscribe': function(msg, model) {
                this.object_key = model.object_key;
                // Important assumption: that object_key is the lowercase
                // version of the hris model
                // Also note this is not object_label, which is multilingual,
                // in which case, toUpperCase would break.
                this.hris_model = this.object_key.charAt(0).toUpperCase() + this.object_key.slice(1);
                if (hris[this.hris_model]) {
                    this.ADForm.options.dataManager = new hris[this.hris_model]();
                }
            },

            'objectcreator.create.click subscribe': function(msg, model) {
                this.element.show();
            },

            'objectcreator.attributeList.refresh subscribe': function(msg, model) {
                this.element.find('div.dynamic').remove();
                for (var i = 0; i < model.length; i++) {
                    this.addItem(model[i]);
                }
            },

	        addItem: function(model){
                var view = this.view('/hris/objectcreator/view/createFormItem.ejs', {model: model});
                var $div = $(view);

                this.element.find('fieldset.dynamic').append($div);

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
