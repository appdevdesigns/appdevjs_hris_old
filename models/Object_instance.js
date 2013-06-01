////
//// Object Instances for the Client Side
////
//// This model is the interface for the various user created object types
//// within HRIS.


// This is only relevant on the client side.
if (typeof process == 'undefined') {
    steal('./object.js').then(function() {
        
        hris.Object.findAll({})
        .then(function(list) {
            for (var i=0; i<list.length; i++) {
                
                // Set up the client side service links for each of
                // the user defined "Object" types.
                var obj = list[i];
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
                    AD.Service.extend("hris." + modelName,
                        attr,
                        {}
                    );
                }
                else {
                    console.log('hris.' + modelName + ' already defined');
                }
                
            }
        })
        .fail(function(err) {
            console.log(err);
        });
        
    });
}