

/**
 * @class [moduleName].client.pages.attributeSetList
 * @parent [moduleName].client.pages.attributeSetList
 * 
 *  Setup the attributeSetList Widget
 */

//steal('/hris/userFamily/view/attributeSetList.ejs').then(function() {

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
                



                this.element.hide();

                 
                
                // insert our DOM elements
                this.insertDOM();
                
                 this.person = [];
                // attach other widgets & functionality here:
                $( ".column" ).sortable({
                    connectWith: ".column"
                 });
                 
                //$( ".column" ).disableSelection();
                // Find the object_id for the object_key = person.
                var self = this;
                this.listEntities = {};
                hris.Object.findAll()
                .done(function(list) {
                    for (var i = 0; i < list.length; i++) {
                        self.listEntities[list[i].object_id] = list[i].object_key;
                        if (list[i].object_key == 'person') {
                            self.api_person_object_id = list[i].object_id;
                        }
                    }
                    self.findRelatedEntities();

                });

                // translate Labels
                // any DOM element that has an attrib "appdLabelKey='xxxx'" will get it's contents
                // replaced with our Label.  Careful to not put this on places that have other content!
                this.xlateLabels();
            },

            findRelatedEntities: function() {
                var self = this;
                this.listRelationships = [];
                hris.Relationship.findAll({objA_id: this.api_person_object_id})
                .done(function(list) {
                    for (var i = 0; i < list.length; i++) {
                        var objectId = list[i].objB_id;
                        var objectKey = self.listEntities[objectId];
                        self.listRelationships.push(objectKey);
                    }
                });
            },
            
            

            'userFamily.person.selected subscribe': function(msg, model)
            {
                $(".showEdit").hide();
                this.element.show();
                //this.element.find('.userAttributeRow').remove();
                
                //clear all the portlets from the container from the Container
                $('#attributeDetailContainer').empty();

                var self= this;
                this.person= model;	
                if (this.api_person_object_id === undefined) {
                    return;
                }
                
                // Find out which attribute sets apply to the person object
                var found =  hris.Attributeset.findAll({object_id: this.api_person_object_id});
                $.when(found)
                    .then(function(list){
                        self.element.find('.userAttributeRow').remove();
                        self.element.find('.attribute_Set_List').remove();
                        
                        //iterate through each AttributeSet
                        for (var i=0; i< list.length; i++){
                            self.addAttributeSetItem(list[i]);
                            } 
                        
                        
                        //Add the portal classes and event handers
                        $( ".portlet" ).addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )
                            .find( ".portlet-header" )
                            .addClass( "ui-widget-header ui-corner-all" )
                            .prepend( "<span class='resize-portlet ui-icon ui-icon-minusthick'></span>")
                            .prepend( "<span class='close-portlet ui-icon ui-icon-close'></span>")
                            .end()
                            .find( ".portlet-content" );    
                        $( ".portlet-header .resize-portlet" ).click(function() {
                            $( this ).toggleClass( "ui-icon-minusthick" ).toggleClass( "ui-icon-plusthick" );
                            $( this ).parents( ".portlet:first" ).find( ".portlet-content" ).toggle();
                
                        });
                        $( ".portlet-header .close-portlet" ).click(function() {
                            var par = $( this ).parents( ".portlet:first" ).parent();
                              $('#asl_' + par.attr('id')).show();
                            par.hide();
                            
                          
                        });
                            
                        })
                    .fail(function(err){ });

                $('.relationship-item').remove();
                for (var i = 0; i < this.listRelationships.length; i++) {
                    this.addRelationshipItem(this.listRelationships[i]);
                }

            },


            '.attribute_Set_List click': function(el, ev){
                var $el = $(el);
                
                //$el.addClass('active');

                var model = el.data('ad-model');
                $('#' + model.attributeset_id).show()  ;
                $el.hide();
                AD.Comm.Notification.publish('userFamily.attributeSetItem.selected', model);
                return false;
            },

            '.relationship-item click': function(el, ev) {
                
                AD.Comm.Notification.publish('userFamily.relationshipItem.click', this.person);
                return false;
            },

            addAttributeSetItem: function(model){
                //Add the list item
                var view = this.view('/hris/userFamily/view/attributeSetListItem.ejs', {model: model});
                var $div = $(view);
                $div.data("ad-model", model);
                

                this.ul.append($div);
                
                
                //Now add the portlet item
                
                $('#attributeDetailContainer').append("<div id='" + model.attributeset_id + "'></div>");
                var $div2 = $('#' + model.attributeset_id)  ;
                $div2.data("ad-model", model);
                $div2.data("ad-person", this.person);
                $div2.user_attributes();
                
                

            },


            '#user_attr_save click': function(el, ev){
                //TODO implement save
                this.person.loadFromDOM(this.element);
                this.person.save({id:this.person.person_id});
                
                $('.hideEdit').show();
                $('.showEdit').hide();
                
                
                
                AD.Comm.Notification.publish('userFamily.userDetails.saved', this.person);
               ev.preventDefault();
            },
            '#user_attr_edit click': function(el, ev){
                $('.hideEdit').hide();
                $('.showEdit').show();
                ev.preventDefault();

            },
            
            addRelationshipItem: function(name){
                var view = this.view('/hris/userFamily/view/relationshipListItem.ejs', {name: name});
                var $div = $(view);
                this.ul.append($div);

                $div = $('<div></div>');
                $('#attributeDetailContainer').append($div);
                $div.data('related-object-name', name);
                $div.data('person', this.person);
                $div.related_objects();
            },
            
            insertDOM: function() {
                
                this.element.html(this.view('/hris/userFamily/view/attributeSetList.ejs', {}));
                this.ul = this.element.find('ul');
                
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
