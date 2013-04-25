////
//// Attribute
////
//// This model is the interface to the hris2_attributes table.


(function () {
    // Pull AppDev from the global scope on NodeJS and browser and load the AppDev CommonJS module on Titanium
    var AD = (typeof AppDev === "undefined" ? (typeof global === "undefined" ? require('AppDev') : global.AD) : AppDev);
    var $ = AD.jQuery;

    // On Titanium and NodeJS, the full model definition is needed
    var extendedDefinition = typeof Titanium !== 'undefined' || typeof process !== 'undefined';

    var attr = {
        // Shared model attributes
        _adModule:'hris',
        _adModel:'Attribute',
        id:'attribute_id',
        labelKey:'attribute_label',
        _isMultilingual:true,
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
//            dbName:'live_db',
            tables:{
                data:'hris2_attributes',
                trans:'hris2_attributes_trans'
            },
            fields: {
                data: {
                  attribute_id:"int(11) unsigned",
                  attributeset_id:"int(11)",
                  attribute_column:"text",
                  attribute_datatype:"text",
                  meta:"text",
                  attribute_permission:"varchar(25)",
                  attribute_uniqueKey:"tinyint(1)"

                },
                trans: {
                  attributetrans_id:"int(11) unsigned",
                  attribute_id:"int(11)",
                  language_code:"varchar(10)",
                  attribute_label:"text",
                  attribute_question:"text"


                }
            },
            primaryKey:'attribute_id',
            multilingualFields: ['attribute_label', 'attribute_question']
        });
    }


    var Model = AD.Model.extend("hris.Attribute",
    attr,
    {
        // define instance methods here.
    });

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        // This is a CommonJS module, so return the model
        module.exports = Model;
    }
})();
