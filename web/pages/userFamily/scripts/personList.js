

/**
 * @class [moduleName].client.pages.personList
 * @parent [moduleName].client.pages.personList
 * 
 *  Setup the personList Widget
 */

//steal('/hris/userFamily/view/personList.ejs').then(function() {

// Keep all variables and functions inside an encapsulated scope
(function() {


    //// Setup Widget:
    AD.Controller.extend('personList', {


        init: function (el, options) {

            //// Setup your controller here:

            // make sure defaults are taken care of
            var defaults = {
                    uid:'personList_uuid_notGiven',
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
            this.listPersons =  hris.Person.listIterator({});

            // attach other widgets & functionality here:
            this.$carousel = this.element.find('#myCarousel').appdev_list_carousel({
                dataManager:this.listPersons,
                onSelection:function (el){ 
                    _self.onSelection(el);
                },

                // onElement: is a provided callback to generate the individual contents of the carousel
                onElement:function(rowMgr){
                    return '<img src="'+(rowMgr.iconPath || '/hris/images/person.png')+'" width="75" height="75" alt="">'+
                    '<div class="person-name"><h5>'+rowMgr.getLabel()+ '</h5></div>';
                },

                // template: is an ejs template (using '[' tags) where 'this' refers to the individual Model obj 
                //               	template:'<img src="[%== this.iconPath || "/theme/default/images/icon.jpg" %]" width="75" height="75" alt="">'+
                //   				'<div class="module-name"><h5>[%= this.getLabel() %]</h5></div>'
            });

            $('#btn-addperson').click(function() {_self.showAddForm(); });
            $('.add-person').hide();

            // find the Add Form
            this.initAddForm();




            // translate Labels
            // any DOM element that has an attrib "appdLabelKey='xxxx'" will get it's contents
            // replaced with our Label.  Careful to not put this on places that have other content!
            this.xlateLabels();
        },
        onSelection: function(el) {

            // remove existing selected item marker
            if (this.selected != null) {
                this.selected.removeClass('active');
                var div = this.selected.find('.person-active');
                div.remove();
            }

            // show new existing selected item marker
            this.selected = $(el.currentTarget);
            this.selected.addClass('active');
            var selectedDiv = $('<div class="person-active"></div>');
            selectedDiv.css('width', this.selected.css('width'));
            this.selected.prepend(selectedDiv);

            // send event: module.selected
            var model = this.selected.data('adModel');
            AD.Comm.Notification.publish('userFamily.person.selected', model);
        },



        insertDOM: function() {

            this.element.html(this.view('/hris/userFamily/view/personList.ejs', {}));

        },




        addFormClear: function() {
            this.$addForm_inputFirstName.val('');
            this.$addForm_inputLastName.val('');
            this.$addFormError.html('');
        },



        addFormDisable: function() {
            this.$addForm_submit.addClass('disabled');
            this.$addForm_cancel.addClass('disabled');
            this.addInProcess = true;
        },



        addFormEnable: function() {
            this.$addForm_submit.removeClass('disabled');
            this.$addForm_cancel.removeClass('disabled');
            this.addInProcess = false;
        },



        addFormErrorMessage: function( err ) {
            var errMsg = AD.Comm.Error.message(err);
            this.$addFormError.html(errMsg).show();
        },
        'userFamily.userDetails.saved subscribe': function(msg, person)
        {
            
           
            
            this.listPersons.refresh();
            this.xlateLabels();
            
        },



        addPerson: function() {

            var _self = this;

            // get the person first name
            var firstName = this.$addForm_inputFirstName.val();
            var lastName = this.$addForm_inputLastName.val();

            var opt = {
                    url: '/hris/person',
                    params:{person_givenname:firstName, person_surname:lastName},
                    success:function(data) {

                        // refresh items in list
                        var refreshDone = _self.listPersons.refresh();

                        _self.$addForm.hide();
                        _self.addFormEnable();
                        _self.addFormClear();
                        _self.busyOff();

                    },
                    failure: function(err) {

                        _self.busyOff();
                        _self.addFormEnable();
                        _self.addFormErrorMessage( err );

                    }
            }

            AD.ServiceModel.create(opt);
        },

        busyOff: function(){
            this.$addBusy.hide();
        },

        busyOn: function(){
            this.$addBusy.show();
        },


        showAddForm: function() {
            this.$addForm.show();
            this.$addForm.focus();
        },

        initAddForm: function() {
            var _self = this;
            this.$addForm = this.element.find('.add-person');

            this.$addForm.ad_form({
                submit:'.option-submit',
                cancel:'.option-cancel',
                onCancel:function() {
                    _self.$addForm.hide();
                    _self.addFormClear();
                    _self.busyOff();
                }
            });

            this.$addForm_inputFirstName = this.$addForm.find('#person-addform-firstname');
            this.$addForm_inputLastName = this.$addForm.find('#person-addform-lastname');

            // error message
            this.$addFormError = this.$addForm.find('#error-AddPerson');
            this.$addFormError.html('').hide();

            this.$addBusy = this.$addForm.find('#addBusy');
            this.busyOff();

            // cancel button
            this.$addForm_cancel = this.$addForm.find('#btn-addCancel');
            this.$addForm_cancel.click(function() {
                if (!this.addInProcess) {
                    _self.$addForm.hide();
                    _self.addFormClear();
                    //                               _self.$addForm.find('#module-addform-name').val('');
                    _self.busyOff();
                }
            });

            // submit button
            this.$addForm_submit = this.$addForm.find('#btn-addSubmit');
            this.$addForm_submit.click(function() {
                if (!this.addInProcess) {
                    _self.busyOn();
                    _self.addFormDisable();
                    _self.addPerson();
                }
            });
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
