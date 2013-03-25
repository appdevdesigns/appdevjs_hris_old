

/**
 * @class [moduleName].client.pages.objectGrid
 * @parent [moduleName].client.pages.objectGrid
 * 
 *  Setup the objectGrid Widget
 */

//steal('/hris/objectcreator/view/objectGrid.ejs').then(function() {

    // Keep all variables and functions inside an encapsulated scope
    (function() {
    
    
        //// Setup Widget:
        AD.Controller.extend('objectGrid', {
    
            
            init: function (el, options) {

                //// Setup your controller here:
                
                // make sure defaults are taken care of
                var defaults = {
                      uid:'objectGrid_uuid_notGiven',
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
                this.element.hide();
                this.insertDOM();
                
                // attach other widgets & functionality here:
                
                
                
                // translate Labels
                // any DOM element that has an attrib "appdLabelKey='xxxx'" will get its contents
                // replaced with our Label.  Careful to not put this on places that have other content!
                this.xlateLabels();
            },
            

            
            insertDOM: function() {
                
                this.element.html(this.view('/hris/objectcreator/view/objectGrid.ejs', {}));
                
            },
            
            'objectcreator.object.selected subscribe': function(msg, model) {
                this.element.show();
                this.updateAttributes(model);

            },
            
            updateAttributes: function(object) {
                var self = this;
                this.element.find('li').remove();
                hris.Attributeset.findAll({object_id: object.object_id})
                .then(function(list) {
                    for (var i = 0; i < list.length; i++) {
                        self.getAttributes(list[i]);
                    }
                });
            },
            
            getAttributes: function(attributeset) {
                var self = this;
                hris.Attribute.findAll({attributeset_id: attributeset.attributeset_id})
                .then(function(list) {
                    for (var i = 0; i < list.length; i++) {
                        self.addAttribute(list[i].attribute_label);
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
