describe('relatedObjects test',function(){
	
	var html;
	var controller;
	var model;
	
	before(function(done){
		model = new hris.Object({
			object_key: 'person',
           	object_pkey: 'person_id',
            object_table: 'hris_person'
		});
		html = $('<div></div>').data('related-object-name', model);
		html.related_objects();
		$(document).append(html);
		controller = html.controller();
		done();
	});
	
	after(function(){
		html.remove();
		delete html;
		delete controller;
	});
	
	it('initialize controller in DOM',function(done){
		var object = controller.relatedObjectName;
		chai.assert.deepEqual(object,model);
		done();
	});
	
});
