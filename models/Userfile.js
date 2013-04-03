////
//// Userfile
////
//// This model is the interface to the hris2_userfile table.


(function () {
    // Pull AppDev from the global scope on NodeJS and browser and load the AppDev CommonJS module on Titanium
    var AD = (typeof AppDev === "undefined" ? (typeof global === "undefined" ? require('AppDev') : global.AD) : AppDev);

    // On Titanium and NodeJS, the full model definition is needed
    var extendedDefinition = typeof Titanium !== 'undefined' || typeof process !== 'undefined';

    var attr = {
        // Shared model attributes
        _adModule:'hris',
        _adModel:'Userfile',
        id:'userfile_id',
        labelKey:'userfile_name',
        _isMultilingual:false,
        _relationships:{
            belongs_to:[], // array of Model Names: ['Attributeset', 'site.Viewer', ... ]
            has_many:[]    // array of Model Names
            },
        //connectionType:'server', // optional field
        cache:false
    };

    if (extendedDefinition) {
        // Extended model attributes
        AD.jQuery.extend(attr, {
            type:'single',  // 'single' | 'multilingual'
//            dbName:AD.Defaults.dbName,
            dbTable:'hris2_userfile',
            modelFields: {
                  userfile_id:"int(11) unsigned",
                  userfile_name:"text",
                  userfile_path:"text",
                  userfile_mimetype:"varchar(32)",
                  userfile_date:"date",
                  attribute_id:"int(11)",
                  viewer_guid:"text"

            },
            primaryKey:'userfile_id'
        });
    }


    var Model = AD.Model.extend("hris.Userfile",
    attr,
    {
        // define instance methods here.
    });

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        // This is a CommonJS module, so return the model
        module.exports = Model;
    }
})();