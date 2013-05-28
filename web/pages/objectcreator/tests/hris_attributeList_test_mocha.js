describe('attributeList test',function(){
	
	var object;
	var model;
	var $html;
	var controller;
	var attributeSetID = -1;
	var attrSet;
	var attribute;
	
	before(function(done){
		$html = $('<div></div>').attribute_list();
		$(document).append($html);
		controller = $html.controller();
		model = new hris.Object({
			object_key: 'object_test',
           	object_pkey: 'test_id',
            object_table: 'hris_object_test'
		});
		model.save(function(object) {
			model = object;
			attrSet = new hris.Attributeset({
				type_id: 1,
				object_id: object.object_id,
				attributeset_table: 'test_attributeset_table',
				attributeset_relation: 'many',
				attributeset_uniqueKey: 0,
				attributeset_key: 'test_attributeset_key',
				attributeset_pkey: 'test_attributeset_pkey',
				attributeset_label: 'test attributeset'
			});
			attrSet.save(function(attributeset){
				if ($.isArray(attributeset)) {
                	attributeSetID = attributeset[0].attributeset_id;
                } else {
                	attributeSetID = attributeset.attributeset_id;
                }
				attribute = new hris.Attribute({
					attributeset_id: attributeSetID,
					attribute_column:'testkey_code' ,
					attribute_datatype: 'Text',
					meta: 'meta data',
					attribute_permission: 'Read',
					attribute_uniqueKey: 0
				});
				attribute.save(function(attr){
					done();
				});
			});
		});
	});
	
	after(function(done){
		model.destroy();
		attrSet.destroy();
		attribute.destroy();
		done();
	});
	
	it('initialize controller in DOM',function(done){
		listAttributes = controller.listAttributes;
		list = [];
		chai.assert.deepEqual(listAttributes,list);
		done();
	});
	
	it.skip('objectcreator object selected',function(done){
		AD.Comm.Notification.publish('objectcreator.object.selected',model);
		var text = $html.text();
		var otherText = $html.html();
		var entries = $html.find('li.appdev-list-admin-entry');
		setTimeout(function(){
			var listAttrs = controller.listAttributes;
			chai.assert.lengthOf(entries,1,'list item count is wrong');
			done();
		},5000);
	});

});
