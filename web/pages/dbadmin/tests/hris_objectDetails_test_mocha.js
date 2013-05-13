describe('test objectDetails',function(){
	var html = '';
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
		html = $('<div class="dbAdmin-container"><div class="row-fluid">'+
	   			'<div id="list-sidebar" class="span3 well"></div>'+
        		'<div class="span9 well"><div id="object-details"></div>'+
				'<div id="attribute-set-details"></div>'+
            	'<div id="attribute-details"></div>'+
        		'</div>'+
    			'</div></div>').object_details();
		done();
	});
	
	after(function(){
		hris.APIObject.findAll({},function(list){
			for (var i=0;i<list.length;i++){
				//list[i].destroy();
			}
		});
	});
				
	it('submit form',function(done){
		var testResult = true;
		var object = new Object();
		var button = html.find('button.submit');
		var objectKey = html.find('#object-object_key');
		objectKey.val('testtable');
		var objectTable = html.find('#object-object_table');
		objectTable.val('hris_testtable');
		var objectPrimaryKey = html.find('#object-object_pkey');
		objectPrimaryKey.val('hris_testtable_id');
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
	});
	
	it('add relationship',function(done){
		var data = {};
		AD.Comm.Notification.publish('dbadmin.object.item.add-new',data);
		var html = $('<div class="dbAdmin-container"><div class="row-fluid">'+
	   			'<div id="list-sidebar" class="span3 well"></div>'+
        		'<div class="span9 well"><div id="object-details"></div>'+
				'<div id="attribute-set-details"></div>'+
            	'<div id="attribute-details"></div>'+
        		'</div>'+
    			'</div></div>').object_details();
		var objs = hris.APIObject.findAll( {} );
        var dropdown = html.find( '#add-relationship-dropdown' ).html(
            ( '//modules/hris/web/pages/dbadmin/views/objectDetails_addList.ejs', { objs: objs } )
        );
		var objectKey = html.find('#object-object_key');
		objectKey.val('testtable');
		var objectTable = html.find('#object-object_table');
		objectTable.val('hris_testtable');
		var objectPrimaryKey = html.find('#object-object_pkey');
		objectPrimaryKey.val('hris_testtable_id');
		var toggleButton = html.find('button.dropdown-toggle');
		toggleButton.click();
		var relationshipButton = html.find('#add-relationship-dropdown');
		relationshipButton.click();
		done();
	});
});
