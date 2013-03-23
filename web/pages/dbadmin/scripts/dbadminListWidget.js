
/**
 *  Setup the dbadminListWidget
 */

    // Keep all variables and functions inside an encapsulated scope
    (function() {
    
    
        //// Setup Widget:
        AD.Controller.extend('dbadminListWidget', {
    
            
            init: function (el, options) {

                //// Setup your controller here:
                var self = this;
                
                // make sure defaults are taken care of
                var defaults = {
                      uid: options.modelName + '_list_widget',
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
                this.model = hris[options.modelName];
                
                if (this.model == hris.Object) {
                    // Initialize with all
                    this.dataManager = this.model.listIterator({});
                } else {
                    // Initialize as empty
                    this.dataManager = this.model.listIterator(null);
                }
                
                this.initDeleteConfirmation();
                this.initAdminList();
                
                
                // attach other widgets & functionality here:
                
                // translate Labels
                // any DOM element that has an attrib "appdLabelKey='xxxx'" will get it's contents
                // replaced with our Label.  Careful to not put this on places that have other content!
                this.xlateLabels();
            },
            
            
            initDeleteConfirmation: function() {
                var self = this;

                // Init the delete confirmation dialog box
                this.$confirmBox = $(this.view(
                    '/hris/dbadmin/view/deleteConfirm.ejs',
                    { "modelName": self.options.modelName }
                ));
                $(document).append(this.$confirmBox);
                this.$confirmBox.modal({ show: false });
                // This is what happens when the user confirms a delete op
                this.$confirmBox.find('button.confirm').on('click', function() {
                    if (self.modelToDelete) {
                        self.modelToDelete.destroy();
                        self.$confirmBox.modal('hide');
                        
                        self.refresh();
                    }
                });
                this.$confirmBox.find('button.cancel').on('click', function() {
                    self.$confirmBox.modal('hide');
                    self.listController.onDone();
                });
            },
            
            
            initAdminList: function() {
                var self = this;
            
                // Add a child DIV so we have a different one for the Admin
                // List controller.
                this.element.append('<div class="admin-list">');
                this.element.find('div.admin-list').appdev_list_admin({
                    uid: this.options.uid,
                    title: '[list.title.'+ self.options.modelName +']',
                    buttons: { add: true, del: true },
                    dataManager: this.dataManager,
                    onSelect: function(ev) {
                        var model = $(ev.currentTarget).data('ad-model');
                        
                        // Show the Detail page (and hide others)
                        AD.Comm.Notification.publish(
                            "dbadmin."+ self.options.modelName.toLowerCase() +".item.selected",
                            model
                        );
                    },
                    onAdd: function(ev) {
                        AD.Comm.Notification.publish(
                            "dbadmin."+ self.options.modelName.toLowerCase() +".item.add-new",
                            {}
                        );
                    },
                    onDelete: function(model) {
                        //alert('delete');
                        //model.destroy();
                        self.modelToDelete = model;
                        self.$confirmBox.modal('show');
                    }
                });
                this.listController = this.element.find('div.admin-list').controller();
            },
            
            refresh: function(filter) {
                this.listController.clearList();
                
                if (filter) {
                    this.dataManager.findAll(filter);
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
