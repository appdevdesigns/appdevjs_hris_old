
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
                
                // eventKey is used for publishing notifications related to
                // the widget's model.
                this.eventKey = options.modelName.toLowerCase();
                
                // make sure defaults are taken care of
                var defaults = {
                      uid: this.eventKey + '_list_widget',
                };
                var options = $.extend(defaults, options);
                this._super(el, options);
                
                this.options = options;
                this.model = hris[options.modelName];
                this.selectedModel = null;
                this.currentFilter = null;
                
                this.dataManager = this.model.listIterator(null);   // Initialize as empty
                
                this.initDeleteConfirmation();
                this.initAdminList();
                
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
                        self.modelToDelete.destroy()
                        .then(function() {
                            self.$confirmBox.modal('hide');
                            self.refresh();
                            AD.Comm.Notification.publish(
                                'dbadmin.'+ self.eventKey +'.item.deleted', 
                                {}
                            );
                        });
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
                    title: '[list.title.'+ self.eventKey +']',
                    buttons: { add: true, del: true },
                    dataManager: this.dataManager,
                    onSelect: function(event, model) {
                        self.selectedModel = model;

                        // Show the Detail page (and hide others)
                        AD.Comm.Notification.publish(
                            "dbadmin."+ self.eventKey +".item.selected",
                            model
                        );
                    },
                    onAdd: function(ev) {
                        AD.Comm.Notification.publish(
                            "dbadmin."+ self.eventKey +".item.add-new",
                            {}
                        );
                    },
                    onDelete: function(model) {
                        self.modelToDelete = model;
                        self.$confirmBox.modal('show');
                    }
                });
                this.listController = this.element.find('div.admin-list').controller();

                if (this.options.showButtons == false) {
                    this.hideButtons();
                }
            },

            refresh: function(filter) {
                var dfd = $.Deferred();
                if (filter) this.currentFilter = filter;
                this.selectedModel = null;

                if (!this.currentFilter) {
                    this.clear();
                    dfd.resolve();
                } else {
                    this.dataManager.findAll(this.currentFilter).then(function() {
                        dfd.resolve();
                    });
                }
                return dfd;
            },

            clear: function() {
                this.listController.clearList();
                this.selectedModel = null;
            },

            hideButtons: function() {
                this.element.find('.add-delete').hide();
                this.listController.onDone();
            },
            
            showButtons: function() {
                this.element.find('.add-delete').show();
            }

        });
        
    }) ();
