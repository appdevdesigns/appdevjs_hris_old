

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
        AD.Controller.extend('objectList', {
    
            
            init: function (el, options) {

                //// Setup your controller here:
                var self = this;
                
                // make sure defaults are taken care of
                var defaults = {
                      uid:'objectList_uuid_notGiven',
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
                
                hris.Object.bind('updated', function() {
                    // Refresh the list when data is updated
                    self.populate();
                });
                
                
                // translate Labels
                // any DOM element that has an attrib "appdLabelKey='xxxx'" will get it's contents
                // replaced with our Label.  Careful to not put this on places that have other content!
                this.xlateLabels();
            },
            

            
            insertDOM: function() {
                
                this.element.html(this.view('/hris/dbadmin/view/objectList.ejs', {}));
                
                //this.element.find('input.typeahead').typeahead();
                
                this.populate();
                
                this.element.show();
                
            },
            
            /**
             * Add a single item to the list
             */
            addItem: function(model) {
                var itemHTML = this.view('/hris/dbadmin/view/objectList_item.ejs', {
                    "label": model.attr('object_key')
                });
                var $item = $(itemHTML);
                $item.data('item-model', model);
                this.element.find('.item-list').append($item);
            },
            
            /**
             * Add all items to the list
             */
            populate: function() {
                var self = this;
                
                // Clear any previous items
                this.element.find('.item-list').empty();
                
                // Add new items to the list
                hris.Object.findAll({})
                .then(function(list) {
                    console.log(list);
                    for (var i=0; i<list.length; i++) {
                        self.addItem(list[i]);
                    }
                })
                .fail(function(err) {
                    AD.alert("Error");
                    console.log(err);
                });
            },
            
            ".list-item click": function(el, ev) {
                
                // Highlight the clicked item only
                this.element.find('ul li.active').removeClass('active');
                el.addClass('active');
                
                // Publish event
                var model = el.data('item-model');
                AD.Comm.Notification.publish(
                    "dbadmin.object.item selected",
                    model
                );
                
                // suppress the #
                return false;

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
