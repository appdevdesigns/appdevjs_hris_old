describe('test listSideBar',function(){
	var html = '';
	var object;
	var objectId = -1;
	var checkForHiddenButtons = function(buttons){
		var testResult = true;
		if (buttons.attr('style') !== 'display: none;'){
			testResult = false;
		}
		return testResult;
	};
	var checkListLength = function(listEntries){
		var testResult = true;
		if (listEntries.length !== 0){
			testResult = false;
		}
		return testResult;
	};
	var checkForActiveClass = function(listEntries){
	    var testResult = true;
		for(var i=0;i<listEntries.length;i++){
			if (objectListEntries[i].attr('class') == "active"){
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
		object = new hris.Object({
            object_key: 'object_test',
            object_pkey: 'test_id',
            object_table: 'hris2_object_test'
        });
        object.save(function(){
            objectId = object.getID();
            done();
        });
	})
				
	it('add new object',function(done){
		var model = {};
		var testResult = true;
		AD.Comm.Notification.publish('dbadmin.object.item.add-new',model);
		var objectList = html.find('#object-list');
		var attributeList = html.find('#attribute-list');
		var attributeSetList = html.find('#attribute-set-list');
		var objectListEntries = objectList.find('li.appdev-list-admin-entry');
		if (!checkForActiveClass(objectListEntries)){
			testResult = false;
		}
		var attributeSetButtons = attributeSetList.find(".add-delete");
		if(!checkForHiddenButtons(attributeSetButtons)){
			testResult = false;
		}
		var attributeListButtons = attributeList.find('.add-delete');
		if (!checkForHiddenButtons(attributeListButtons)){
			testResult = false;
		}
		var attributeListEntries = attributeList.find('li.appdev-list-admin-entry');
		if (!checkEmptyList(attributeListEntries)){
			testResult = false;
		}
		chai.assert.isTrue(testResult,'object screen showing');
		done();
	});
	
	it('object selected',function(done){
		AD.Comm.Notification.publish('dbadmin.object.item.selected',object);
		
		done;
	});
})
