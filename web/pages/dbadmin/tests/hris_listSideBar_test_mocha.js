describe('test listSideBar',function(){
	var html = '';
	var object;
	var attributeset;
	var objectId = -1;
	var objectList;
	var attributeList;
	var attributeSetList;
	
	var hiddenButtons = function(buttons){
		var testResult = true;
		if (buttons.attr('style') !== 'display: none;'){
		//if (!buttons.is(':visible')){
			testResult = false;
		}
		return testResult;
	};
	var emptyList = function(listEntries){
		var testResult = true;
		if (listEntries.length !== 0){
			testResult = false;
		}
		return testResult;
	};
	var deSelectedFields = function(listEntries){
	    var testResult = true;
		for(var i=0;i<listEntries.length;i++){
			var objectItem = $(listEntries[i]);
			if (objectItem.hasClass('active')){
				testResult = false;
			}
		}
		return testResult;
	};
	
	before(function(done){
		html = $('<div class="dbAdmin-container"><div class="row-fluid">'+
	   			'<div id="list-sidebar" class="span3 well"></div>'+
        		'<div class="span9 well"><div id="object-details"></div>'+
				'<div id="attribute-set-details"></div>'+
            	'<div id="attribute-details"></div>'+
        		'</div>'+
    			'</div></div>').list_sidebar();
		objectList = html.find('#object-list');
		attributeList = html.find('#attribute-list');
		attributeSetList = html.find('#attribute-set-list');
		object = new hris.Object({
            object_key: 'object_test',
            object_pkey: 'test_id',
            object_table: 'hris2_object_test'
        });
        object.save(function(){
            objectId = object.getID();
            attributeset = new hris.Attributeset({
					type_id: 1,
					object_id: objectId,
					attributeset_table: 'test_attributeset_table',
					attributeset_relation: 'many',
					attributeset_uniqueKey: 0,
					attributeset_key: 'test_attributeset_key',
					attributeset_pkey: 'test_attributeset_pkey',
					attributeset_label: 'test attributeset'
			});
			attributeset.save(function(){
				done();
			});
        });
	});
	
	after(function(done){
		attributeset.destroy();
		object.destroy();
		done();
	});
				
	it('add new object',function(done){
		var model = {};
		var testResult = true;
		AD.Comm.Notification.publish('dbadmin.object.item.add-new',model);
		objectListEntries = objectList.find('li.appdev-list-admin-entry');
		attributeSetButtons = attributeSetList.find(".add-delete");
		attributeListButtons = attributeList.find('.add-delete');
		attributeListEntries = attributeList.find('li.appdev-list-admin-entry');
		//object list should be deselected
		if (!deSelectedFields(objectListEntries)){
			testResult = false;
		}
		//buttons should be hidden
		if(!hiddenButtons(attributeSetButtons)){
			testResult = false;
		}
		//buttons should be hidden
		if (!hiddenButtons(attributeListButtons)){
			testResult = false;
		}
		//attribute list should be empty
		if (!emptyList(attributeListEntries)){
			testResult = false;
		}
		chai.assert.isTrue(testResult,'object screen showing');
		done();
	});
	
	it('object item selected',function(done){
		var testResult = true;
		AD.Comm.Notification.publish('dbadmin.object.item.selected',object);
		attributeSetButtons = attributeSetList.find(".add-delete");
		attributeListButtons = attributeList.find('.add-delete');
		attributeListEntries = attributeList.find('li.appdev-list-admin-entry');
		//attribute list should be empty
		if (!emptyList(attributeListEntries)){
			testResult = false;
		}
		//attribute set buttons should show
		if (hiddenButtons(attributeSetButtons)){
			testResult = false;
		}
		//attribute buttons should be hidden
		if (!hiddenButtons(attributeListButtons)){
			testResult = false;
		}
		chai.assert.isTrue(testResult,'object not selected in list widget');
		done();
	});
	
	it('attributeset item selected',function(done){
		var testResult = true;
		AD.Comm.Notification.publish('dbadmin.attributeset.item.selected',attributeset);
		attributeListButtons = attributeList.find('.add-delete');
		attributeListEntries = attributeList.find('li.appdev-list-admin-entry');
		//buttons should show
		if (hiddenButtons(attributeListButtons)){
			testResult = false;
		}
		chai.assert.isTrue(testResult,'attributeset not selected in list widget');
		done();
	});
	
	it('attributeset item added',function(done){
		var model = {};
		var testResult = true;
		AD.Comm.Notification.publish('dbadmin.attributeset.item.add-new',model);
		attributeListButtons = attributeList.find('.add-delete');
		attributeListEntries = attributeList.find('li.appdev-list-admin-entry');
		attributeSetListEntries = attributeSetList.find('li.appdev-list-admin-entry');
		//attribute set should be deselected
		if(!deSelectedFields(attributeSetListEntries)){
			testResult = false;
		}
		//attribute list should be empty
		if (!emptyList(attributeListEntries)){
			testResult = false;
		}
		//attribute list buttons should be hidden
		if (!hiddenButtons(attributeListButtons)){
			testResult = false;
		}
		chai.assert.isTrue(testResult,'attributeset item not added');
		done();
	});
	
	it('attribute item added',function(done){
		var testResult = true;
		var model = {};
		AD.Comm.Notification.publish('dbadmin.attribute.item.add-new',model);
		attributeListEntries = attributeList.find('li.appdev-list-admin-entry');
		//attribute list widget should be deselected
		if (!deSelectedFields(attributeListEntries)){
			testResult = false;
		}
		chai.assert.isTrue(testResult,'attribute item not added');
		done();
	});
	
	it('object detail cancelled',function(done){
		var testResult = true;
		var model = {};
		AD.Comm.Notification.publish('dbadmin.object.details.cancelled',model);
		objectListEntries = objectList.find('li.appdev-list-admin-entry');
		attributeListEntries = attributeList.find('li.appdev-list-admin-entry');
		attributeSetListEntries = attributeSetList.find('li.appdev-list-admin-entry');
		//object list should be deselected
		if (!deSelectedFields(objectListEntries)){
			testResult = false;
		}
		//attribute list widget should be empty
		if (!emptyList(attributeListEntries)){
			testResult = false;
		}
		//attribute set list should be empty
		if (!emptyList(attributeSetListEntries)){
			testResult = false;
		}
		chai.assert.isTrue(testResult,'object detail page was not cancelled');
		done();
	});
	
	it('attributeset detail cancelled',function(done){
		var testResult = true;
		var model = {};
		AD.Comm.Notification.publish('dbadmin.attributeset.details.cancelled',model);
		var attributeSetListEntries = attributeSetList.find('li.appdev-list-admin-entry');
		var attributeListEntries = attributeList.find('li.appdev-list-admin-entry.active');
		var attributeListButtons = attributeList.find('.add-delete');
		//attribute set list should be deselected
		if(!deSelectedFields(attributeSetListEntries)){
			testResult = false;
		}
		//attribute list should be empty
		if (!emptyList(attributeListEntries)){
			testResult = false;
		}
		//attribute list button should be hidden
		if (!hiddenButtons(attributeListButtons)){
			testResult = false;
		}
		chai.assert.isTrue(testResult,'attributeset detail page is not cancelled');
		done();
	});
	
	it('attribute detail cancelled',function(done){
		var testResult = true;
		var model = {};
		AD.Comm.Notification.publish('dbadmin.attribute.details.cancelled',model);
		attributeListEntries = attributeList.find('li.appdev-list-admin-entry.active');
		//attribute list should be deselected
		if (!deSelectedFields(attributeListEntries)){
			testResult = false;
		}
		chai.assert.isTrue(testResult,'attribute detail is not cancelled');
		done();
	});
	
	it('object selected',function(done){
		AD.Comm.Notification.publish('dbadmin.object.changed',object);
		setTimeout(function(){
			var testResult = true;
			var objectListEntries = objectList.find('li.appdev-list-admin-entry.active');
			if (deSelectedFields(objectListEntries)){
				testResult = false;
			}
			chai.assert.isTrue(testResult,'object not selected');
			done();
		}, 5000);
	});
	
	it('attributeset selected',function(done){
		AD.Comm.Notification.publish('dbadmin.attributeset.changed', attributeset);
		setTimeout(function(){
			var testResult = true;
			var attributeSetListEntries = attributeSetList.find('li.appdev-list-admin-entry.active');
			if (deSelectedFields(attributeSetListEntries)){
				testResult = false;
			}
			chai.assert.isTrue(testResult,'attributeset not selected');
			done();
		},5000);
	});
})
