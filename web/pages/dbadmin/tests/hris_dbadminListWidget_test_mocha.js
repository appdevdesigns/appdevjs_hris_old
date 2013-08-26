
describe('dbadminListWidget', function() {

    // Using a dummy model instead of a real one from HRIS, so we can test this
    // widget in isolation.
    var fakeData = [
        { id: 1, value: 'ABC' },
        { id: 2, value: 'DEF' },
        { id: 3, value: 'GHI' }
    ];
    AD.DummyModel.fakeData = fakeData;
    hris['APIfakeModel'] = AD.DummyModel;
    
    
    var $container;
    var controller;
    

    before(function(done) {
        $container = $('<div></div>');
        $(document).append($container);
        
        // Initialize the widget with the dummy model we set up above
        $container.dbadmin_list_widget({
            modelName: 'fakeModel'
        });
        controller = $container.controller();
        done();
    });

    
    it('initializes the DOM', function(done) {
        // The dbadminListWidget is supposed to create an additional DIV inside
        chai.assert.lengthOf($container.find("div.admin-list"), 1, "Inner DIV was not created");
        // dbadminListWidget relies on the framework's appdevListAdmin widget. 
        chai.assert($container.find("div.admin-list").hasClass("appdev_list_admin"), "appdevListAdmin widget did not initialize DOM");
        done();
    });
    

    it('initializes the admin list controller', function(done) {
        chai.assert.instanceOf(controller.listController, appdevListAdmin, "appdevListAdmin widget controller not set");
        done();
    });
    

    // This test might be more appropriate for the appdevListAdmin sub-widget
    it('populates the list with correct items', function(done) {
        controller.refresh({});
        var $items = $container.find('li.appdev-list-admin-entry span.model-name');
        // Note: ".model-name" is from the framework appdevListAdmin widget.
        // It is a legacy name from when it was part of the appRAD module.
        // It could, and should, eventually be changed to something more generic

        chai.assert.lengthOf($items, fakeData.length, "widget list item count is wrong");
        
        for (var i=0; i<fakeData.length; i++) {
            chai.assert.equal($items.eq(i).text(), fakeData[i]['value'], "widget list item text is wrong");
        }
        
        done();
    });
    

    after(function(done) {
        $container.remove();
        delete $container;
        delete controller;
        done();
    });
    
});
