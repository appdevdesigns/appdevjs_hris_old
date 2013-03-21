

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
                
                
                // insert our DOM elements
                this.insertDOM();
                
                
                // attach other widgets & functionality here:


                // translate Labels
                // any DOM element that has an attrib "appdLabelKey='xxxx'" will get it's contents
                // replaced with our Label.  Careful to not put this on places that have other content!
                this.xlateLabels();
            },
            

            
            insertDOM: function() {
                
                this.element.html(this.view('/hris/dbadmin/view/attributeSetDetails.ejs', {}));
                
            },

            'dbadmin.attributeset.item.selected subscribe': function(msg, model){
              this.element.find('#attributeset_table').val(model.attributeset_table);
              this.element.find('#attributeset_relation').val(model.attributeset_relation);
              this.element.find('#attributeset_uniqueKey').val(model.attributeset_uniqueKey);
              this.element.find('#attributeset_key').val(model.attributeset_key);
              this.element.find('#attributeset_pkey').val(model.attributeset_pkey);
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

