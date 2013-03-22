

/**
 * @class [moduleName].client.pages.objectList
 * @parent [moduleName].client.pages.objectList
 * 
 *  Setup the objectList Widget
 */

//steal('/hris/dbadmin/view/objectList.ejs').then(function() {

    // Keep all variables and functions inside an encapsulated scope
    (function() {
    
    
        //// Setup Widget:
        AD.Controller.extend('dbadminListWidget', {
    
            
            init: function (el, options) {

                //// Setup your controller here:
                var self = this;
                
                // make sure defaults are taken care of
                var defaults = {
                      uid: options.modelName + '_list_widget',
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
                this.model = hris[options.modelName];
                
                this.element.appdev_list_admin({
                    uid: options.uid,
                    title: '[list.title.'+ options.modelName +']',
                    buttons: { add: true },
                    dataManager: this.model.listIterator({}),
                    onSelect: function(ev) {
                        var model = $(ev.currentTarget).data('ad-model');
                        //console.log(model);
                        AD.Comm.Notification.publish(
                            "dbadmin."+ options.modelName.toLowerCase() +".item.selected",
                            model
                        );
                    },
                    onAdd: function() {
                        alert('add');
                    }
                });
                
                
                
                // attach other widgets & functionality here:
                
                // translate Labels
                // any DOM element that has an attrib "appdLabelKey='xxxx'" will get it's contents
                // replaced with our Label.  Careful to not put this on places that have other content!
                this.xlateLabels();
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
