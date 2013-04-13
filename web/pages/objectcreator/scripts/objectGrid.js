

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

                this.object_key = null;
                this.hris_model = null;
                this.attribute_refresh_done = $.Deferred();
                
                // insert our DOM elements
                this.element.hide();
                this.insertDOM();
                
                // attach other widgets & functionality here:
                
                
                
                // translate Labels
                // any DOM element that has an attrib "appdLabelKey='xxxx'" will get its contents
                // replaced with our Label.  Careful to not put this on places that have other content!
                this.xlateLabels();
            },
            
            'objectcreator.object.selected subscribe': function(msg, model) {
                this.object_key = model.object_key;
                // Important assumption: that object_key is the lowercase
                // version of the hris model
                // Also note this is not object_label, which is multilingual,
                // in which case, toUpperCase would break.
                this.hris_model = this.object_key.charAt(0).toUpperCase() + this.object_key.slice(1);
                var self = this;
                if (hris[this.hris_model]) {
                    var found = hris[this.hris_model].findAll({});
                    $.when(found, this.attribute_refresh_done).then(function(listFound, attributes) {
                        // At this point, we have both the attribute list and the 
                        // list of people, so we know the rows and the columns
                        // of the grid.
                        self.updateGrid(listFound, attributes);
                    });
                } else {
                    console.error("objectGrid: No hris model for "+this.hris_model+" found");
                    this.updateGrid([],[]);
                }
            },
            
            insertDOM: function() {
                
                this.element.html(this.view('/hris/objectcreator/view/objectGrid.ejs', {}));
                
            },
            
            'objectcreator.attributeList.refresh subscribe': function(msg, model) {
                this.attribute_refresh_done.resolve(model);
            },

            updateGrid: function(rows, columns) {
                this.element.find('.data').remove();
                this.element.show();
                var thead = this.element.find('thead');
                var tbody = this.element.find('tbody');

                //Create the header row
                var row = $('<tr class="data"></tr>');
                for (var i = 0; i < columns.length; i++) {
                    row.append('<th>'+columns[i].attribute_label+'</th>');
                }
                thead.append(row);

                // Populate the body
                for (var r = 0; r < rows.length; r++) {
                    var row = $('<tr class="data"></tr>');
                    for (var c = 0; c < columns.length; c++){
                        var cname = columns[c].attribute_column;
                        row.append('<td>'+rows[r][cname]+'</td>');
                    }
                    tbody.append(row);
                }
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
