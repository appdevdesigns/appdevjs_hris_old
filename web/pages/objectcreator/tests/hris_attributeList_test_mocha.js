describe('attributeList test',function(){
	
	var object;
	var model;
	var $html;
	var controller;
	var attributeSetID = -1;
	
	before(function(done){
		$html = $('<div></div>').attribute_list();
		$(document).append($html);
		controller = $html.controller();
		model = {
			object_key: 'object_test',
           	object_pkey: 'test_id',
            object_table: 'hris_object_test'
		};
		hris.Object.create(model, function(object) {
			model = object;
			var attrSet = {
				type_id: 1,
				object_id: object.object_id,
				attributeset_table: 'test_attributeset_table',
				attributeset_relation: 'many',
				attributeset_uniqueKey: 0,
				attributeset_key: 'test_attributeset_key',
				attributeset_pkey: 'test_attributeset_pkey',
				attributeset_label: 'test attributeset'
			};
			hris.Attributeset.create(attrSet,function(attributeset){
				if ($.isArray(attributeset)) {
                	attributeSetID = attributeset[0].attributeset_id;
                } else {
                	attributeSetID = attributeset.attributeset_id;
                }
				var attribute = {
					attributeset_id: attributeSetID,
					attribute_column:'testkey_code' ,
					attribute_datatype: 'Text',
					meta: 'meta data',
					attribute_permission: 'Read',
					attribute_uniqueKey: 0
				};
				hris.Attribute.create(attribute,function(attr){
					done();
				});
			});
		});
	});
	
	it('objectcreator object selected',function(done){
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
	
	it('getRelatedObjects',function(done){
		controller.getRelatedObject();
		done();
	});
});
