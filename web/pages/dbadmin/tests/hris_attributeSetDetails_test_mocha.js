describe('test attributeSetDetails',function(){
	var $html;
	var object;
	var attributeset;
	var objectId = -1;
	var objectList;
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
			var objectItem = $(objectListEntries[i]);
			if (objectItem.attr('class') == 'appdev-list-admin-entry active'){
				testResult = false;
			}
		}
		return testResult;
	};
	
	before(function(done){
    	$html = $('<div></div>');
		$sideBarhtml = $('<div></div>');
		$objectDetails = $('<div></div');
		$(document).append($html);
		$(document).append($sideBarhtml);
		$(document).append($objectDetails);
		$sideBarhtml.list_sidebar();
		$html.attribute_set_details();
		$objectDetails.object_details();
		objectList = $html.find('#object-list').dbadmin_list_widget();
		attributeList = $html.find('#attribute-list').dbadmin_list_widget();
		attributeSetList = $html.find('#attribute-set-list').dbadmin_list_widget();
		object = new hris.Object({
			    	object_key: 'object_test',
            		object_pkey: 'test_id',
            		object_table: 'hris_object_test'
				});
        object.save(function(model){
			object = model;
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
	
	after(function(){
		object.destroy();
		attributeset.destroy();
	});
				
	it('submit form',function(done){
		AD.Comm.Notification.publish('dbadmin.object.item.selected',object);
		setTimeout(function(){
			AD.Comm.Notification.publish('dbadmin.attributeset.item.add-new',{});
			var testResult = true;
			var button = $html.find('button.submit');
			var attributeSetPKey = $html.find("input[data-bind='attributeset_pkey']");
			//attributeSetPKey.value('testtable_pkey');
			var attributeSetTable = $html.find("input[data-bind='attributeset_table']");
			//attributeSetTable.value('testtable');
			var attributeSetLabel = $html.find("inpRrut[data-bind='attributeset_label']");
			attributeSetLabel.val('testtable_label');
			var attributeSetKey = $html.find("input[data-bind='attributeset_key']");
			attributeSetKey.val('testtable_key');
			var attributeSetTypeId = $html.find("input[data-bind='type_id']");
			attributeSetTypeId.val('testtable_type_id');
			button.click();
			hris.Object.findAll({},function(list){
				for (var i=0;i<list.length;i++){
					var objectKey = list[i].attr('object_key');
					if (objectKey == 'testtable'){
						object = list[i];
						chai.assert.deepEqual('testtable',object.attr('object_key'));
						chai.assert.deepEqual('hris_testtable',object.attr('object_table'));
						chai.assert.deepEqual('hris_testtable_id',object.attr('object_pkey'));				
					}
				}
				done();
			});
		},2000);
	});
	
	it('dbadmin attributeSetDetails hide/not show',function(done){
		AD.Comm.Notification.publish('dbadmin.object.item.selected',object);
		var showing = $html.attr('style');
		chai.assert.equal(showing,"display: none;");
		done();
	});
	
		
	it('dbadmin attributeSetDetails selected/show',function(done){
		AD.Comm.Notification.publish('dbadmin.attributeset.item.selected',attributeset);
		var showing = $html.attr('style');
		chai.assert.equal(showing, "display: block;");
		done();
	});
});
