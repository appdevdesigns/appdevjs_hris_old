////
//// Object Instances for the Client Side
////
//// This model is the interface for the various user created object types
//// within HRIS.


// This is only relevant on the client side.
if (typeof process == 'undefined') {
    steal('./object.js').then(function() {
        
        // This sets up the client side service links for a single
        // object type.
        var doSetup = function(obj) 
        {
            var key = obj.object_key;
            var pkey = obj.object_pkey;
            var modelName = key[0].toUpperCase() + key.substr(1);
            if (typeof hris[modelName] == 'undefined') {
                var attr = {
                    _adModule: 'hris',
                    _adResource: key,
                    // labelKey: null, // <-- ??
                    id: pkey
                };
                
                // Determine the labelKey
                obj.getLabelField()
                .then(function(fieldname) {
                    attr.labelKey = fieldname;
                    // Then register this object's service links
                    AD.Service.extend("hris." + modelName,
                        attr,
                        {}
                    );
                })
                .fail(function(err) {
                    console.log(err);
                });
            }
            else {
                console.log('hris.' + modelName + ' already defined');
            }
        }
    
        
        // Use the above function to set up all objects.
        hris.Object.findAll({})
        .then(function(list) {
            for (var i=0; i<list.length; i++) {
                console.log('setting up model for Object:', list[i]);
                doSetup(list[i]);
            }
        })
        .fail(function(err) {
            console.log(err);
        });
        
    });
}