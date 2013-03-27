////
//// Relationship
////
//// This model is the interface to the hris2_relationship table.


(function () {
    // Pull AppDev from the global scope on NodeJS and browser and load the AppDev CommonJS module on Titanium
    var AD = (typeof AppDev === "undefined" ? (typeof global === "undefined" ? require('AppDev') : global.AD) : AppDev);

    // On Titanium and NodeJS, the full model definition is needed
    var extendedDefinition = typeof Titanium !== 'undefined' || typeof process !== 'undefined';

    var attr = {
        // Shared model attributes
        _adModule:'hris',
        _adModel:'Relationship',
        id:'relationship_id',
        labelKey:'relationship_label',
        _isMultilingual:true,
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
            type:'multilingual',  // 'single' | 'multilingual'
//            dbName:'live_db',
            tables:{
                data:'hris2_relationship',
                trans:'hris2_relationship_trans'
            },
            fields: {
                data: {
                  relationship_id:"int(11) unsigned",
                  objA_id:"int(11) unsigned",
                  objB_id:"int(11) unsigned",
                  relationship_type:"varchar(25)"

                },
                trans: {
                  relationshiptrans_id:"int(11)",
                  relationship_id:"int(11)",
                  language_code:"varchar(10)",
                  relationship_label:"text"


                }
            },
            primaryKey:'relationship_id',
            multilingualFields: ['relationship_label']
        });
    }


    var Model = AD.Model.extend("hris.Relationship",
    attr,
    {
        // define instance methods here.
    });

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        // This is a CommonJS module, so return the model
        module.exports = Model;
    }
})();