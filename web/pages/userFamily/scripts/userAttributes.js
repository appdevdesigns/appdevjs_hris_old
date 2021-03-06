

/**
 * @class [moduleName].client.pages.userAttributes
 * @parent [moduleName].client.pages.userAttributes
 * 
 *  Setup the userAttributes Widget
 */

//steal('/hris/userFamily/view/userAttributes.ejs').then(function() {

    // Keep all variables and functions inside an encapsulated scope
    (function() {
    
    
        //// Setup Widget:
        AD.Controller.extend('userAttributes', {
    
            
            init: function (el, options) {

                //// Setup your controller here:
                
                // make sure defaults are taken care of
                var defaults = {
                      uid:'userAttributes_uuid_notGiven',
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
                
                this.element.hide();
                this.person = this.element.data('ad-person');
                this.model = this.element.data('ad-model');
                // insert our DOM elements
                this.insertDOM();
                
                
                // attach other widgets & functionality here:
                
               
                
                var self= this;
                this.setupForm();
               
                
              
 
                
                
                
                
                // translate Labels
                // any DOM element that has an attrib "appdLabelKey='xxxx'" will get it's contents
                // replaced with our Label.  Careful to not put this on places that have other content!
                this.xlateLabels();
            },

            'userFamily.userDetails.saved subscribe': function(msg, person)
            {
                
                this.person = person;
                this.element.find('#attributeSetDetail').empty();
                this.setupForm();
 
                
            },
            
	        addItem: function(model){

                var view = this.view('/hris/userFamily/view/userAttributeItem.ejs', {model: model, person: this.person});
                var $div = $(view);

                this.element.find('#attributeSetDetail').append($div);

            },
            setupForm: function(){
                var self= this;
                var found =  hris.Attribute.findAll({attributeset_id:  this.model.attributeset_id});
                $.when(found)
                    .then(function(list){
                        self.element.find('.userAttribute').remove();

                        for (var i=0; i< list.length; i++){

                            self.addItem(list[i]);   
                            
                        }
                        self.attrModelList= list;
                        $(".showEdit").hide();
                        self.person.bindToForm(self)
                        
                    })
                    .fail(function(err){
                          console.log(err);
                })
            },


            insertDOM: function() {
                
                this.element.html(this.view('/hris/userFamily/view/userAttributes.ejs', {model: this.model}));
                
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
