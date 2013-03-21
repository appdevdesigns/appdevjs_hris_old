

/**
 * @class [moduleName].client.pages.attributeSetList
 * @parent [moduleName].client.pages.attributeSetList
 * 
 *  Setup the attributeSetList Widget
 */

//steal('/hris/dbadmin/view/attributeSetList.ejs').then(function() {

    // Keep all variables and functions inside an encapsulated scope
    (function() {
    
    
        //// Setup Widget:
        AD.Controller.extend('attributeSetList', {
    
            
            init: function (el, options) {

                //// Setup your controller here:
                
                // make sure defaults are taken care of
                var defaults = {
                      uid:'attributeSetList_uuid_notGiven',
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
                this.element.html(this.view('/hris/dbadmin/view/attributeSetList.ejs', {}));

                //this.element.hide();
            },

            /**
             * Add all items
             *  model - parent Object
             */
            populate: function(model) {
              var self = this;

              // Clear any previous items
              this.element.find('.item-list').empty();

              // Add new items to the list
              hris.Attributeset.findAll({attributeset_table: model.object_table})
              .then(function(list) {
                for (var i=0; i<list.length; i++){
                  self.addItem(list[i]);
                }
              })
              .fail(function(err) {
                AD.alert("Error");
                console.log(err);
              });
            },

            /**
             * Add a single item
             *  model - the item to add
             */
            addItem: function(model) {
              var html = this.view('/hris/dbadmin/view/attributeSetList_item.ejs', {
                    "label": model.attr('attributeset_key')
              });
              var $item = $(html);
              $item.data('item-model', model);
              this.element.find('.item-list').append($item);
            },

            // Listen for an Object to be selected
            'dbadmin.object.item.selected subscribe': function(msg, model){
              this.populate(model);
            },

            // Listen for an AttributeSet to be selected
            '.list-item click': function(el, ev) {
              var model = el.data('item-model');
              AD.Comm.Notification.publish("dbadmin.attributeset.item.selected", model);
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
