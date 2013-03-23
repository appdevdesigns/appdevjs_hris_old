////
//// Attributeset
////
//// This model is the interface to the hris2_attributeset table.


(function () {
    // Pull AppDev from the global scope on NodeJS and browser and load the AppDev CommonJS module on Titanium
    var AD = (typeof AppDev === "undefined" ? (typeof global === "undefined" ? require('AppDev') : global.AD) : AppDev);
    var $ = AD.jQuery;

    // On Titanium and NodeJS, the full model definition is needed
    var extendedDefinition = typeof Titanium !== 'undefined' || typeof process !== 'undefined';

    var attr = {
        // Shared model attributes
        _adModule:'hris',
        _adModel:'Attributeset',
        id:'attributeset_id',
        labelKey:'attributeset_label',
        _isMultilingual:true,
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
            type:'multilingual',  // 'single' | 'multilingual'
//          dbName:'live_db',
            tables:{
                data:'hris2_attributeset',
                trans:'hris2_attributeset_trans'
            },
            fields: {
                data: {
                  attributeset_id:"int(11) unsigned",
                  type_id:"int(11) unsigned",
                  object_id:"int(11) unsigned",
                  attributeset_table:"text",
                  attributeset_relation:"varchar(4)",
                  attributeset_uniqueKey:"tinyint(1)",
                  attributeset_key:"text",
                  attributeset_pkey:"text"

                },
                trans: {
                  attrsettrans_id:"int(11) unsigned",
                  attributeset_id:"int(11) unsigned",
                  language_code:"varchar(10)",
                  attributeset_label:"text"


                }
            },
            primaryKey:'attributeset_id',
            multilingualFields: ['attributeset_label']
        });
    }


    var Model = AD.Model.extend("hris.Attributeset",
    attr,
    {
        // define instance methods here.
    });

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        // This is a CommonJS module, so return the model
        module.exports = Model;
    }
})();
