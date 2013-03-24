

/**
 * @class [moduleName].client.pages.relatedObjects
 * @parent [moduleName].client.pages.relatedObjects
 * 
 *  Setup the relatedObjects Widget
 */

//steal('/hris/userFamily/view/relatedObjects.ejs').then(function() {

    // Keep all variables and functions inside an encapsulated scope
    (function() {
    
    
        //// Setup Widget:
        AD.Controller.extend('relatedObjects', {
    
            
            init: function (el, options) {

                //// Setup your controller here:
                
                // make sure defaults are taken care of
                var defaults = {
                      uid:'relatedObjects_uuid_notGiven',
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
                
                this.relatedObjectName = this.element.data('related-object-name');
                // insert our DOM elements
                this.insertDOM();
                
                
                // attach other widgets & functionality here:
                
                
                
                // translate Labels
                // any DOM element that has an attrib "appdLabelKey='xxxx'" will get it's contents
                // replaced with our Label.  Careful to not put this on places that have other content!
                this.xlateLabels();
            },
            

            
            insertDOM: function() {
                
                this.element.html(this.view('/hris/userFamily/view/relatedObjects.ejs', {name:this.relatedObjectName}));
                
            },
            
            'userFamily.relationshipItem.click subscribe': function(msg, model) {
                console.log('my link was clicked, i should update');
                // At this point, the model (a Person model) does not contain a passports attribute any more
                // even though the original JSON response had it.
                console.log(this.relatedObjectName);
                console.log(model[this.relatedObjectName].length);
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
