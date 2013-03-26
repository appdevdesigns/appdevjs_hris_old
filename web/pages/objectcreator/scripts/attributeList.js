

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
                this.listAttributes = [];
                this.listDone = [];
                
                
            },



            'objectcreator.object.selected subscribe': function(msg, model) {
                if (this.object_id !== model.object_id) {
                    this.object_id = model.object_id;
                    this.updateAttributes(model);
                }

            },
            
            updateAttributes: function(object) {
                var self = this;
                this.listAttributes = [];
                this.listDone = [];
                hris.Attributeset.findAll({object_id: object.object_id})
                .then(function(list) {
                    for (var i = 0; i < list.length; i++) {
                        self.listDone.push(self.getAttributes(list[i]));
                    }
                });
                $.when.apply(listDone).then(function() {
                    AD.Comm.Notification.publish('objectcreator.attributeList.refresh', null);
                });
            },
            
            getAttributes: function(attributeset) {
                var self = this;
                return hris.Attribute.findAll({attributeset_id: attributeset.attributeset_id})
                .then(function(list) {
                    for (var i = 0; i < list.length; i++) {
                        self.listAttributes.push(list[i]);
                    }
                });
            },
            
            addAttribute: function(text) {

                this.element.find('ul').append('<li>'+text+'</li>');

            }

            
            
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
