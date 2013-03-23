////
//// Object
////
//// This model is the interface to the hris2_object table.


(function () {
    // Pull AppDev from the global scope on NodeJS and browser and load the AppDev CommonJS module on Titanium
    var AD = (typeof AppDev === "undefined" ? (typeof global === "undefined" ? require('AppDev') : global.AD) : AppDev);
    var $ = AD.jQuery;

    // On Titanium and NodeJS, the full model definition is needed
    var extendedDefinition = typeof Titanium !== 'undefined' || typeof process !== 'undefined';

    var attr = {
        // Shared model attributes
        _adModule:'hris',
        _adModel:'Object',
        id:'object_id',
        labelKey:'object_key',
        _isMultilingual:false,
        _relationships:{
            belongs_to:[], // array of Model Names: ['Attributeset', 'site.Viewer', ... ]
            has_many:[]    // array of Model Names
            },
        //connectionType:'server', // optional field
        cache:false,
        existing: function(params) {

            var dfd = $.Deferred();

            dfd.resolve(false);

            return dfd;
          }
    };

    if (extendedDefinition) {
        // Extended model attributes
        AD.jQuery.extend(attr, {
            type:'single',  // 'single' | 'multilingual'
//            dbName:AD.Defaults.dbName,
            dbTable:'hris2_object',
            modelFields: {
                  object_id:"int(11) unsigned",
                  object_key:"text",
                  object_pkey:"text",
                  object_table:"text"

            },
            primaryKey:'object_id'
        });
    }


    var Model = AD.Model.extend("hris.Object",
    attr,
    {
        // define instance methods here.
    });

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        // This is a CommonJS module, so return the model
        module.exports = Model;
    }
})();