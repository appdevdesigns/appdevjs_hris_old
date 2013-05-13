describe('attributeList test',function(){
	
	it('objectcreator.object.selected',function(done){
		var html = $('<div id="list-sidebar" class="span3 well"></div>'+
        	'<div class="span9 well">'+
            '<div id="create-button"></div>'+
            '<div id="create-form"></div>'+
            '<div id="list-view"></div>'+
        	'</div>').create_button();
			model = {
				object_key: 'object_test',
				object_pkey: 'test_id',
				object_table: 'hris2_object_test'
			};
			hris.Object.create(model,function(object){
				//AD.Comm.Notification.publish('objectcreator.object.selected',object);
				html.find('.btn').trigger('click',object);
				done();
			});
	});
	
});
