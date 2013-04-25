

/**
 * @class [moduleName].client.pages.personSummary
 * @parent [moduleName].client.pages.personSummary
 * 
 *  Setup the personSummary Widget
 */

//steal('/hris/userFamily/view/personSummary.ejs').then(function() {

    // Keep all variables and functions inside an encapsulated scope
    (function() {
    
    
        //// Setup Widget:
        AD.Controller.extend('personSummary', {
    
            
            init: function (el, options) {

                //// Setup your controller here:
                
                // make sure defaults are taken care of
                var defaults = {
                      uid:'personSummary_uuid_notGiven',
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
                var _self = this;
                              
                // attach other widgets & functionality here:
                
                
                
                // translate Labels
                // any DOM element that has an attrib "appdLabelKey='xxxx'" will get it's contents
                // replaced with our Label.  Careful to not put this on places that have other content!
                this.xlateLabels();
            },
            

            
            insertDOM: function() {
                
                this.element.html(this.view('/hris/userFamily/view/personSummary.ejs', {}));
                this.element.hide();
                
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
            'userFamily.person.selected subscribe' : function(message, model) {
                this.element.show();
                
                $('#person-name').text(model.person_givenname+ ' ' + model.person_surname );
                $('#person-gender').text(model.gender_id);
                $('#person-workstatus').text("[WorkStatus]");
                $('#person-chinesename').text("[Chinesename]");
                if(model.person_birthdate == null) {
                    $('#person-dob').text('');
                } else {
                    $('#person-dob').text(model.person_birthdate);
                }                
              
             },
         
            
            'userFamily.userDetails.saved subscribe' : function(message, model) {
                this.element.show();
                
                $('#person-name').text(model.person_givenname+ ' ' + model.person_surname );
                $('#person-gender').text(model.gender_id);
                $('#person-workstatus').text("[WorkStatus]");
                $('#person-chinesename').text("[Chinesename]");
                if(model.person_birthdate == null) {
                    $('#person-dob').text('');
                } else {
                    $('#person-dob').text(model.person_birthdate);
                }                
              
             }
        });
        
    }) ();

// });  // end steal
