

/**
 * @class [moduleName].client.pages.listSidebar
 * @parent [moduleName].client.pages.listSidebar
 * 
 *  Setup the listSidebar Widget
 */

//steal('/hris/dbadmin/view/listSidebar.ejs').then(function() {

    // Keep all variables and functions inside an encapsulated scope
    (function() {
    
    
        //// Setup Widget:
        AD.Controller.extend('listSidebar', {
    
            
            init: function (el, options) {

                //// Setup your controller here:
                
                // make sure defaults are taken care of
                var defaults = {
                      uid:'listSidebar_uuid_notGiven',
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

                this.element.html(this.view('/hris/dbadmin/view/listSidebar.ejs', {}));

                this.object_list = $('#object-list').dbadmin_list_widget({
                    modelName: 'Object'
                });

                this.attributeset_list = $('#attribute-set-list').dbadmin_list_widget({
                    modelName: 'Attributeset'
                });

                this.attribute_list = $('#attribute-list').dbadmin_list_widget({
                    modelName: 'Attribute'
                });
            },

            'dbadmin.object.item.selected subscribe': function(msg, model) {
                $('#attribute-set-list').controller().refresh({object_id: model.object_id});
                $('#attribute-list').controller().refresh(null);
            },

            'dbadmin.attributeset.item.selected subscribe': function(msg, model) {
                $('#attribute-list').controller().refresh({attributeset_id: model.attributeset_id});
            },

            'dbadmin.attribute.item.selected subscribe': function(msg, model) {
                // No action
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
