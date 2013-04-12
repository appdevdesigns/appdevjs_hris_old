describe('test listSideBar',function(){
				
	it('add new object',function(done){
		var html = $('<div class="dbAdmin-container"><div class="row-fluid">'+
	   			'<div id="list-sidebar" class="span3 well"></div>'+
        		'<div class="span9 well"><div id="object-details"></div>'+
				'<div id="attribute-set-details"></div>'+
            	'<div id="attribute-details"></div>'+
        		'</div>'+
    			'</div></div>').list_sidebar();
		var model = {};
		var objectList = html.find('#object-list');
		var attributeSetList = html.find('#attribute-set-list');
		var attributeList = html.find('#attribute-list');
		AD.Comm.Notification.publish('dbadmin.object.item.add-new',model);
		done();
	});
})
